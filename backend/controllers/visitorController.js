const QRCode = require('qrcode');
const crypto = require('crypto');

// Mock data store
let visitors = [];

exports.createVisitor = async (req, res) => {
  try {
    const { name, phone, vehicle, flatNumber, isPriority } = req.body;

    if (!name || !phone || !flatNumber) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const visitor = {
      _id: 'mock_id_' + Date.now(),
      name,
      phone,
      vehicle,
      flatNumber,
      isPriority,
      status: 'coming',
      createdAt: new Date()
    };

    visitors.push(visitor);

    const secureToken = crypto.randomBytes(20).toString('hex');
    const qrCode = await QRCode.toDataURL(secureToken);

    res.status(201).json({
      success: true,
      message: 'Visitor registered successfully',
      visitor,
      qrCode
    });
  } catch (error) {
    console.error('Visitor Controller Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
