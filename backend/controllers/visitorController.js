const Visitor = require('../models/Visitor');
const QRPass = require('../models/QRPass');
const ParkingSlot = require('../models/ParkingSlot');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const QRService = require('../utils/qrService');

const { isDBConnected, mockStore } = require('../utils/mockData');

exports.createVisitor = async (req, res) => {
  try {
    const { name, phone, vehicle, flatNumber, isPriority } = req.body;

    if (!name || !phone || !flatNumber) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // --- DB MODE ---
    if (isDBConnected()) {
        const visitor = await Visitor.create({
          name, phone, vehicle: vehicle || 'N/A', flatNumber,
          isPriority: !!isPriority, status: 'coming'
        });
        const { qrCode, expiresAt } = await QRService.generateAndStoreQR(visitor);
        return res.status(201).json({ success: true, visitorId: visitor._id, qrCode, expiresAt });
    }

    // --- MOCK MODE ---
    console.log('[MOCK MODE] Creating temporary visitor');
    const mockVisitor = {
        _id: 'v_mock_' + Date.now(),
        name, phone, vehicle, flatNumber, isPriority, status: 'coming'
    };
    mockStore.visitors.push(mockVisitor);
    
    res.status(201).json({
      success: true,
      visitorId: mockVisitor._id,
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + mockVisitor._id, // Simple mock QR
      expiresAt: new Date(Date.now() + 3600000),
      isMock: true
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

    // --- DB MODE ---
    if (isDBConnected()) {
        const qrPass = await QRPass.findOne({ token: qrData }).populate('visitorId');
        if (!qrPass) return res.status(404).json({ success: false, message: 'INVALID QR' });
        
        const visitor = qrPass.visitorId;
        if (!visitor) return res.status(404).json({ message: 'VISITOR ERROR' });

        if (qrPass.isUsed) {
            return res.status(409).json({ success: false, message: 'QR ALREADY USED & CLOSED' });
        }

        if (new Date() > qrPass.expiresAt) {
            return res.status(403).json({ success: false, message: 'QR EXPIRED' });
        }

        return await handleActualScan(req, res, visitor, qrPass, gateName);
    }

    // --- MOCK MODE ---
    const visitor = mockStore.visitors.find(v => v._id === qrData); // In mock mode, QR Data is the ID
    if (!visitor) return res.status(404).json({ success: false, message: 'INVALID MOCK QR' });

    let message = "";
    if (visitor.status === 'coming') {
        visitor.status = 'inside';
        visitor.entryTime = new Date();
        visitor.gate = gateName || 'Mock Gate';
        message = 'ENTRY SUCCESS (MOCK)';
    } else if (visitor.status === 'inside') {
        visitor.status = 'exited';
        visitor.exitTime = new Date();
        message = 'EXIT SUCCESS (MOCK)';
    } else {
        return res.status(400).json({ message: 'VISITOR ALREADY EXITED' });
    }

    // Emit Real-time Events
    const io = req.app.get('socketio');
    if (io) {
        io.emit(visitor.status === 'inside' ? 'visitor-entered' : 'visitor-exited', {
            visitor: visitor.name,
            slot: 'MOCK-1'
        });
    }

    res.status(200).json({
        success: true,
        message,
        data: visitor
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'SERVER ERROR' });
  }
};

async function handleActualScan(req, res, visitor, qrPass, gateName) {
    let message = "";
    let statusUpdate = {};
    let assignedSlotData = null;

    // Security: Prevent Entry Replay
    if (visitor.status === "inside" && !qrPass.isUsed) {
        // This is likely an exit attempt
    } else if (visitor.status === "exited" || qrPass.isUsed) {
        return res.status(403).json({ success: false, message: 'QR INVALID OR EXPIRED' });
    }

    if (visitor.status === "coming") {
      // --- SECURE ENTRY ---
      const slot = await assignSlot(visitor);
      if (!slot) return res.status(503).json({ success: false, message: 'PARKING FULL' });

      statusUpdate = {
        status: "inside", entryTime: new Date(), gate: gateName || "North Gate",
        assignedSlot: slot._id, scannedBy: req.body.scannedBy || 'System'
      };
      assignedSlotData = slot;
      message = `ENTRY GRANTED: Slot ${slot.slotId}`;
      // Note: QR remains valid for Exit
    } 
    else if (visitor.status === "inside") {
      // --- SECURE EXIT ---
      await freeSlot(visitor.assignedSlot);
      statusUpdate = { status: "exited", exitTime: new Date(), assignedSlot: null };
      
      const durationMins = Math.round((statusUpdate.exitTime - visitor.entryTime) / (1000 * 60));
      message = `EXIT GRANTED: Stay Duration: ${durationMins} mins`;
      
      qrPass.isUsed = true; // QR is now dead
      await qrPass.save();
    } 

    Object.assign(visitor, statusUpdate);
    await visitor.save();

    // Sockets & Notifications
    const io = req.app.get('socketio');
    const notifData = {
        message: `${visitor.name} (${visitor.vehicle}) ${visitor.status === 'inside' ? 'Entered' : 'Exited'} via ${visitor.gate}`,
        type: visitor.status === 'inside' ? 'ENTRY' : 'EXIT', 
        userId: 'admin'
    };
    const notif = await Notification.create(notifData);

    if (io) {
        io.emit(visitor.status === 'inside' ? 'visitor-entered' : 'visitor-exited', {
            visitor: visitor.name, slot: assignedSlotData ? assignedSlotData.slotId : 'N/A'
        });
        io.emit('notification-added', notif);
    }

    return res.status(200).json({
      success: true, message,
      data: {
        name: visitor.name, flat: visitor.flatNumber, status: visitor.status,
        slotId: assignedSlotData ? assignedSlotData.slotId : 'Assigned',
        entryTime: visitor.entryTime, exitTime: visitor.exitTime
      }
    });
}


