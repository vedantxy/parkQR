const Visitor = require('../models/Visitor');
const ParkingSlot = require('../models/ParkingSlot');
const Notification = require('../models/Notification');
const { isDBConnected, mockStore } = require('../utils/mockData');

/**
 * @desc    Get dashboard analytics aggregation
 * @route   GET /api/analytics
 */
exports.getDashboardStats = async (req, res) => {
    try {
        if (isDBConnected()) {
            // 1. Booking Trends (Last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const dailyStats = await Visitor.aggregate([
                { $match: { createdAt: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            // 2. Occupancy Overview
            const totalSlots = await ParkingSlot.countDocuments();
            const occupiedSlots = await ParkingSlot.countDocuments({ isOccupied: true });
            const overstayCount = await ParkingSlot.countDocuments({ isOverstayed: true });

            // 3. Peak Hours (Hourly distribution)
            const peakHours = await Visitor.aggregate([
                { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 24 }
            ]);

            return res.status(200).json({
                success: true,
                data: {
                    dailyStats,
                    occupancy: {
                        total: totalSlots,
                        occupied: occupiedSlots,
                        free: totalSlots - occupiedSlots,
                        overstay: overstayCount
                    },
                    peakHours,
                    kpis: {
                        totalVisitorsToday: await Visitor.countDocuments({
                            createdAt: { $gte: new Date().setHours(0,0,0,0) }
                        }),
                        criticalAlerts: await Notification.countDocuments({ read: false, type: 'OVERSTAY' })
                    }
                }
            });
        }

        // --- MOCK ANALYTICS ---
        const today = new Date().toISOString().split('T')[0];
        res.status(200).json({
            success: true,
            data: {
                dailyStats: [
                    { _id: '2026-04-20', count: 12 },
                    { _id: '2026-04-21', count: 19 },
                    { _id: '2026-04-22', count: 15 },
                    { _id: '2026-04-23', count: 22 },
                    { _id: '2026-04-24', count: 30 },
                    { _id: today, count: mockStore.visitors.length }
                ],
                occupancy: {
                    total: 10,
                    occupied: mockStore.slots.filter(s => s.isOccupied).length,
                    free: mockStore.slots.filter(s => !s.isOccupied).length,
                    overstay: mockStore.slots.filter(s => s.isOverstayed).length
                },
                peakHours: [{ _id: 18, count: 5 }, { _id: 10, count: 3 }],
                kpis: {
                    totalVisitorsToday: mockStore.visitors.length,
                    criticalAlerts: mockStore.notifications.filter(n => !n.read && n.type === 'OVERSTAY').length
                }
            },
            isMock: true
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Aggregation Failed' });
    }
};
