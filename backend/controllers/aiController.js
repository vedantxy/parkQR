const Anthropic = require('@anthropic-ai/sdk');
const Visitor = require('../models/Visitor');
const ParkingSlot = require('../models/ParkingSlot');

// Initialize Anthropic client
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * 🤖 Smart Parking Assistant — Chat endpoint
 * POST /api/ai/ask
 * Body: { question: string }
 */
const askAssistant = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, error: 'Question is required' });
    }

    // Gather real-time stats for context
    let stats = { totalInside: 0, totalExited: 0, totalComing: 0, overstayed: 0, totalSlots: 0, occupiedSlots: 0 };

    try {
      stats.totalInside = await Visitor.countDocuments({ status: 'inside' });
      stats.totalExited = await Visitor.countDocuments({ status: 'exited' });
      stats.totalComing = await Visitor.countDocuments({ status: 'coming' });
      stats.totalSlots = await ParkingSlot.countDocuments();
      stats.occupiedSlots = await ParkingSlot.countDocuments({ isOccupied: true });
    } catch (dbErr) {
      // Mock mode — use placeholder data
      console.warn('⚠️ AI: DB unavailable, using mock stats');
      stats = { totalInside: 12, totalExited: 45, totalComing: 3, overstayed: 2, totalSlots: 50, occupiedSlots: 22 };
    }

    const systemPrompt = `You are ParkSmart AI — an intelligent assistant for a Smart Parking & Visitor Management System.

CURRENT LIVE STATS:
- Visitors currently inside: ${stats.totalInside}
- Visitors who have exited today: ${stats.totalExited}
- Visitors expected (coming): ${stats.totalComing}
- Total parking slots: ${stats.totalSlots}
- Occupied slots: ${stats.occupiedSlots}
- Available slots: ${stats.totalSlots - stats.occupiedSlots}

RULES:
- Be helpful, concise, and professional.
- If asked about parking data, use the stats above.
- You can suggest actions like "add a visitor", "check overstay alerts", etc.
- Keep responses under 200 words unless asked for detail.
- Use simple language. You may respond in Hindi or English based on the user's language.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: question }]
    });

    const reply = message.content[0].text;

    res.json({ success: true, reply });

  } catch (error) {
    console.error('🤖 AI Error:', error.message);

    if (error.status === 401) {
      return res.status(500).json({ success: false, error: 'Invalid API key. Check ANTHROPIC_API_KEY in .env' });
    }

    res.status(500).json({ success: false, error: 'AI service temporarily unavailable' });
  }
};

/**
 * 🔍 Visitor Risk Analysis
 * GET /api/ai/analyze/:visitorId
 */
const analyzeVisitor = async (req, res) => {
  try {
    const { visitorId } = req.params;
    const visitor = await Visitor.findById(visitorId);

    if (!visitor) {
      return res.status(404).json({ success: false, error: 'Visitor not found' });
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: `Analyze this visitor and provide a risk assessment.
        
Visitor Data:
- Name: ${visitor.name}
- Phone: ${visitor.phone}
- Vehicle: ${visitor.vehicle}
- Flat: ${visitor.flatNumber}
- Status: ${visitor.status}
- Priority: ${visitor.isPriority ? 'VIP' : 'Normal'}
- Entry Time: ${visitor.entryTime || 'Not entered yet'}
- Created: ${visitor.createdAt}

Respond ONLY in valid JSON format with no markdown or extra text:
{"risk": "LOW|MEDIUM|HIGH", "reason": "Brief 1-2 line explanation", "recommendation": "Brief action suggestion"}`
      }]
    });

    // Parse JSON response safely
    const raw = message.content[0].text;
    const cleaned = raw.replace(/```json\s*|```\s*/g, '').trim();
    const result = JSON.parse(cleaned);

    res.json({ success: true, ...result, visitor: { name: visitor.name, vehicle: visitor.vehicle, status: visitor.status } });

  } catch (error) {
    console.error('🔍 Analysis Error:', error.message);

    if (error instanceof SyntaxError) {
      return res.status(500).json({ success: false, error: 'AI response parsing failed' });
    }

    res.status(500).json({ success: false, error: 'Analysis service failed' });
  }
};

/**
 * 📊 AI-Powered Summary
 * GET /api/ai/summary
 */
const getDailySummary = async (req, res) => {
  try {
    let stats = {};
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      stats = {
        totalToday: await Visitor.countDocuments({ createdAt: { $gte: today } }),
        inside: await Visitor.countDocuments({ status: 'inside' }),
        exited: await Visitor.countDocuments({ status: 'exited', exitTime: { $gte: today } }),
        totalSlots: await ParkingSlot.countDocuments(),
        occupied: await ParkingSlot.countDocuments({ isOccupied: true }),
      };
    } catch {
      stats = { totalToday: 47, inside: 12, exited: 35, totalSlots: 50, occupied: 22 };
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: `Generate a brief daily parking summary in 3-4 bullet points.
        Stats: ${JSON.stringify(stats)}
        Keep it concise and actionable. Include occupancy percentage.`
      }]
    });

    res.json({ success: true, summary: message.content[0].text, stats });

  } catch (error) {
    console.error('📊 Summary Error:', error.message);
    res.status(500).json({ success: false, error: 'Summary generation failed' });
  }
};

module.exports = { askAssistant, analyzeVisitor, getDailySummary };
