const mongoose = require('mongoose');

// In-memory clones of existing data models for Mock Mode
const mockStore = {
    visitors: [],
    qrPasses: [],
    slots: [
        { _id: 'mock1', slotId: 'A1', slotType: 'Guest', isOccupied: false, timeLimit: 60, duration: 0, isOverstayed: false },
        { _id: 'mock2', slotId: 'A2', slotType: 'Guest', isOccupied: false, timeLimit: 60, duration: 0, isOverstayed: false },
        { _id: 'mock3', slotId: 'VIP1', slotType: 'VIP', isOccupied: false, timeLimit: 120, duration: 0, isOverstayed: false }
    ],
    notifications: []
};

/**
 * Checks if the database is actually connected
 */
const isDBConnected = () => mongoose.connection.readyState === 1;

module.exports = {
    mockStore,
    isDBConnected
};
