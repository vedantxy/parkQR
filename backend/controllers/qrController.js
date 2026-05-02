const QRPass = require('../models/QRPass');
const Visitor = require('../models/Visitor');
const QRService = require('../utils/qrService');
const { isDBConnected } = require('../utils/mockData');

/**
 * @desc    Generate a QR Code for a visitor and save to DB
 * @route   POST /api/qr/generate/:visitorId
 * @access  Private (Admin/Guard)
 */
const generateVisitorQR = async (req, res) => {
  try {
    const { visitorId } = req.params;

    // 1. Check if visitor exists
    if (isDBConnected()) {
        const visitor = await Visitor.findById(visitorId);
        if (!visitor) return res.status(404).json({ success: false, message: 'Visitor not found in DB' });

        const { qrCode, expiresAt, token } = await QRService.generateAndStoreQR(visitor, 1440);
        return res.status(201).json({ success: true, message: 'QR Generated', qrPass: { qrCode, expiresAt, token } });
    }

    // --- MOCK MODE FALLBACK ---
    res.status(201).json({
        success: true,
        message: 'QR Pass generated (MOCK)',
        qrPass: {
            qrCode: 'data:image/png;base64,mock-qr-data',
            expiresAt: new Date(Date.now() + 86400000),
            token: 'mock-token-' + visitorId
        }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { generateVisitorQR };
