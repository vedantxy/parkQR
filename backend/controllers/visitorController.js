const Visitor = require('../models/Visitor');
const QRPass = require('../models/QRPass');
const QRCode = require('qrcode');
const crypto = require('crypto');

/**
 * @desc    Add a new visitor and generate a secure QR Pass
 * @route   POST /api/visitors
 * @access  Private (Admin/Guard/Resident)
 */
const createVisitor = async (req, res) => {
  try {
    const { name, phone, vehicle, flatNumber, isPriority } = req.body;

    // 1. Basic Validation
    if (!name || !phone || !flatNumber) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // 2. Create the Visitor
    const visitor = await Visitor.create({
      name,
      phone,
      vehicle,
      flatNumber,
      isPriority,
      status: 'coming'
    });

    // 3. Security Optimization: Tamper-proof QR Data
    // Instead of JSON in QR, use a unique short token or the QRPass ID.
    // This prevents users from manually creating fake QR data.
    const secureToken = crypto.randomBytes(20).toString('hex');

    // 4. Create the QRPass Record
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 Min Expiry

    const qrPass = await QRPass.create({
      visitorId: visitor._id,
      qrCode: secureToken, // Store only the token/ID, NOT the heavy base64
      expiresAt,
      isUsed: false
    });

    // 5. Generate QR Image for response only (Do not store base64 in DB)
    // The QR data now only points to our internal record.
    const qrImageBase64 = await QRCode.toDataURL(qrPass.qrCode);

    res.status(201).json({
      success: true,
      visitor,
      qrCode: qrImageBase64, // Returned to frontend for display
      qrPassId: qrPass._id,
      expiresAt
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createVisitor };
