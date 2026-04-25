const QRPass = require('../models/QRPass');
const Visitor = require('../models/Visitor');
const QRService = require('../utils/qrService');

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
      return res.status(404).json({ success: false, message: 'Visitor not found' });
    }

    // 2. Generate and Store using Service (Centralized Logic)
    const { qrCode, expiresAt, token } = await QRService.generateAndStoreQR(visitor, 1440); // 24 hours

    res.status(201).json({
      success: true,
      message: 'QR Pass generated successfully',
      qrPass: {
        qrCode,
        expiresAt,
        token // Just in case frontend needs it
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { generateVisitorQR };
