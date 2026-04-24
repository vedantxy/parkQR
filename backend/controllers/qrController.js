const QRCode = require('qrcode');
const QRPass = require('../models/QRPass');
const Visitor = require('../models/Visitor');

/**
 * @desc    Generate a QR Code for a visitor and save to DB
 * @route   POST /api/qr/generate/:visitorId
 * @access  Private (Admin/Guard)
 */
const generateVisitorQR = async (req, res) => {
  try {
    const { visitorId } = req.params;

    // 1. Check if visitor exists
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    // 2. Generate unique data for QR (e.g., visitor ID + secret hash)
    // For simplicity, we use visitor ID. In production, use a signed token.
    const qrData = `visitor:${visitorId}:${Date.now()}`;

    // 3. Generate QR as Data URI (Base64)
    const qrImage = await QRCode.toDataURL(qrData);

    // 4. Create and Save QRPass record
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expiry in 24 hours

    const qrPass = await QRPass.create({
      visitorId,
      qrCode: qrImage, // Storing the base64 string
      expiresAt,
      isUsed: false
    });

    res.status(201).json({
      message: 'QR Pass generated successfully',
      qrPass: {
        _id: qrPass._id,
        qrCode: qrPass.qrCode, // Frontend can display this directly in <img> tag
        expiresAt: qrPass.expiresAt
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateVisitorQR };
