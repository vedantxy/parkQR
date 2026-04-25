const Visitor = require('../models/Visitor');
const QRPass = require('../models/QRPass');
const mongoose = require('mongoose');
const QRService = require('../utils/qrService');


// Fallback Mock Storage (For when MongoDB is not running)
let mockVisitors = [];

exports.createVisitor = async (req, res) => {
  try {
    const { name, phone, vehicle, flatNumber, isPriority } = req.body;

    if (!name || !phone || !flatNumber) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Require MongoDB for production-ready code
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database connecting... please retry' });
    }

    // 1. Persist Visitor Data in MongoDB

    const visitor = await Visitor.create({
      name,
      phone,
      vehicle: vehicle || 'N/A',
      flatNumber,
      isPriority: !!isPriority,
      status: 'coming'
    });

    // 2. Generate and Store QR Code using the modular Service
    // Following System Flow: Create Visitor -> Generate QR -> Store QR -> Response
    const { qrCode, expiresAt } = await QRService.generateAndStoreQR(visitor);

    // 3. Return necessary data only (Frontend responsibility is display only)
    res.status(201).json({
      success: true,
      visitorId: visitor._id,
      qrCode,      // Base64 QR code image
      expiresAt   // Pass expiry time
    });
  } catch (error) {
    console.error('Visitor Controller Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Verifies a scanned QR payload (Production Ready)
 */
exports.verifyVisitor = async (req, res) => {
  try {
    const { scannedData } = req.body;

    if (!scannedData) {
      return res.status(400).json({ success: false, message: 'No QR data provided' });
    }

    // 1. Static validation (Format check)
    const validation = QRService.validateFormat(scannedData);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    // 2. Database verification (Auth/Lookup by token)
    // We use the token from scannedData directly
    const qrPass = await QRPass.findOne({ token: scannedData }).populate('visitorId');

    if (!qrPass) {
      return res.status(404).json({ success: false, message: 'Invalid or forged QR Code' });
    }

    // 3. Check for Expiry
    if (new Date() > qrPass.expiresAt) {
      return res.status(410).json({ success: false, message: 'QR Code has expired' });
    }

    // 4. Preventing Replay Attacks / Re-use
    if (qrPass.isUsed) {
      return res.status(409).json({ success: false, message: 'QR Code already used' });
    }

    // 5. Atomic Update status in both models
    qrPass.isUsed = true;
    await qrPass.save();

    const visitor = qrPass.visitorId;
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor record linked to QR no longer exists' });
    }

    visitor.status = 'inside';
    visitor.entryTime = new Date();
    await visitor.save();

    res.status(200).json({
      success: true,
      message: 'Access Granted!',
      visitor: {
        name: visitor.name,
        flat: visitor.flatNumber,
        entryTime: visitor.entryTime,
        vehicle: visitor.vehicle
      }
    });

  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


