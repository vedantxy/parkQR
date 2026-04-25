const Visitor = require('../models/Visitor');
const QRPass = require('../models/QRPass');
const ParkingSlot = require('../models/ParkingSlot');
const mongoose = require('mongoose');
const QRService = require('../utils/qrService');

exports.createVisitor = async (req, res) => {
  try {
    const { name, phone, vehicle, flatNumber, isPriority } = req.body;

    if (!name || !phone || !flatNumber) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database connecting...' });
    }

    const visitor = await Visitor.create({
      name,
      phone,
      vehicle: vehicle || 'N/A',
      flatNumber,
      isPriority: !!isPriority,
      status: 'coming'
    });

    const { qrCode, expiresAt } = await QRService.generateAndStoreQR(visitor);

    res.status(201).json({
      success: true,
      visitorId: visitor._id,
      qrCode,
      expiresAt
    });
  } catch (error) {
    console.error('Visitor Controller Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Helper: Assign a parking slot to a vehicle
 */
const assignSlot = async (visitor) => {
  const preferredType = visitor.isPriority ? 'VIP' : 'Guest';
  
  // 1. Try preferred slot type
  let slot = await ParkingSlot.findOneAndUpdate(
    { isOccupied: false, slotType: preferredType },
    { 
      isOccupied: true, 
      vehicle: visitor.vehicle,
      startTime: new Date(),
      visitorId: visitor._id 
    },
    { new: true }
  );

  // 2. Fallback: Any available slot
  if (!slot && visitor.isPriority) {
    slot = await ParkingSlot.findOneAndUpdate(
      { isOccupied: false },
      { 
        isOccupied: true, 
        vehicle: visitor.vehicle,
        startTime: new Date(),
        visitorId: visitor._id 
      },
      { new: true }
    );
  }
  
  return slot;
};

/**
 * Helper: Free up a parking slot
 */
const freeSlot = async (slotId) => {
  if (!slotId) return;
  await ParkingSlot.findByIdAndUpdate(slotId, {
    isOccupied: false,
    vehicle: null,
    startTime: null,
    visitorId: null
  });
};

/**
 * @desc    Unified Entry/Exit Scan Logic with Smart Parking
 */
exports.scanQR = async (req, res) => {
  try {
    const { qrData, gateName } = req.body;

    if (!qrData) {
      return res.status(400).json({ success: false, message: 'No QR data received' });
    }

    const qrPass = await QRPass.findOne({ token: qrData }).populate('visitorId');

    if (!qrPass) {
      return res.status(404).json({ success: false, message: 'INVALID QR' });
    }

    const visitor = qrPass.visitorId;
    if (!visitor) return res.status(404).json({ message: 'VISITOR ERROR' });

    // 1. Security Check: Block if QR already fully used (Exited)
    if (qrPass.isUsed) {
      return res.status(409).json({ success: false, message: 'QR ALREADY USED & CLOSED' });
    }

    // 2. Security Check: Block if QR expired
    if (new Date() > qrPass.expiresAt) {
      return res.status(403).json({ success: false, message: 'QR EXPIRED: Pass no longer valid' });
    }

    let message = "";
    let statusUpdate = {};
    let assignedSlotData = null;

    if (visitor.status === "coming") {
      // --- ENTRY FLOW ---
      // Try to assign a parking slot
      const slot = await assignSlot(visitor);
      
      if (!slot) {
        return res.status(503).json({ success: false, message: 'PARKING FULL: No slots available' });
      }

      statusUpdate = {
        status: "inside",
        entryTime: new Date(),
        gate: gateName || "North Gate",
        assignedSlot: slot._id,
        scannedBy: req.body.scannedBy || 'System'
      };
      
      assignedSlotData = slot;
      message = `ENTRY SUCCESS: Park at Slot ${slot.slotId}`;
    } 
    else if (visitor.status === "inside") {
      // --- EXIT FLOW ---
      if (qrPass.isUsed) return res.status(409).json({ message: 'QR ALREADY USED' });

      // Free up the slot
      await freeSlot(visitor.assignedSlot);

      statusUpdate = {
        status: "exited",
        exitTime: new Date(),
        assignedSlot: null // Clear reference
      };
      
      const durationMins = Math.round((statusUpdate.exitTime - visitor.entryTime) / (1000 * 60));
      message = `EXIT SUCCESS: Slot freed. Stay: ${durationMins} mins`;
      
      qrPass.isUsed = true;
      await qrPass.save();
    } 
    else {
      return res.status(403).json({ success: false, message: 'ACCESS DENIED' });
    }

    Object.assign(visitor, statusUpdate);
    await visitor.save();

    res.status(200).json({
      success: true,
      message,
      data: {
        name: visitor.name,
        flat: visitor.flatNumber,
        status: visitor.status,
        slotId: assignedSlotData ? assignedSlotData.slotId : (visitor.assignedSlot ? 'Assigned' : 'N/A'),
        entryTime: visitor.entryTime,
        exitTime: visitor.exitTime
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'SERVER ERROR' });
  }
};


