import React, { useState, useEffect } from 'react';

const ParkingGrid = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSlots = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/parking/slots');
            const data = await response.json();
            if (data.success) {
                setSlots(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch slots:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots();
        // Live update every 10 seconds
        const interval = setInterval(fetchSlots, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="spinner" style={{ margin: '40px auto' }}></div>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0 }}>Live Parking Monitor</h3>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: 12, height: 12, background: 'var(--success)', borderRadius: '3px' }}></div> Free
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: 12, height: 12, background: 'var(--warning)', borderRadius: '3px' }}></div> Near Limit
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: 12, height: 12, background: 'var(--error)', borderRadius: '3px' }}></div> Overstay
                    </div>
                </div>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
                gap: '20px' 
            }}>
                {slots.map((slot) => {
                    const usagePercent = slot.isOccupied ? Math.min((slot.duration / slot.timeLimit) * 100, 100) : 0;
                    const isNearLimit = usagePercent > 80 && usagePercent <= 100;
                    const isOverstayed = slot.isOverstayed;
                    
                    let statusColor = 'var(--success)';
                    if (isOverstayed) statusColor = 'var(--error)';
                    else if (isNearLimit) statusColor = 'var(--warning)';
                    else if (slot.isOccupied) statusColor = 'var(--primary)';

                    return (
                        <div key={slot._id} className="animate-in" style={{
                            aspectRatio: '0.8',
                            background: slot.isOccupied ? 'white' : 'rgba(16, 185, 129, 0.05)',
                            border: `2px solid ${statusColor}`,
                            borderRadius: '16px',
                            padding: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            transition: 'all 0.3s ease',
                            boxShadow: slot.isOccupied ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: statusColor }}>
                                    {slot.slotId}
                                </div>
                                <div style={{ 
                                    padding: '2px 6px', 
                                    background: `${statusColor}20`, 
                                    color: statusColor, 
                                    fontSize: '0.6rem', 
                                    borderRadius: '4px',
                                    fontWeight: 700
                                }}>
                                    {slot.slotType}
                                </div>
                            </div>
                            
                            {slot.isOccupied ? (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '10px' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px' }}>{slot.vehicle}</div>
                                    
                                    <div style={{ marginBottom: '4px', fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Stay: {slot.duration}m</span>
                                        <span>{Math.max(slot.timeLimit - slot.duration, 0)}m left</span>
                                    </div>
                                    
                                    <div style={{ height: '6px', width: '100%', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ 
                                            height: '100%', 
                                            width: `${usagePercent}%`, 
                                            background: statusColor,
                                            transition: 'width 0.5s ease'
                                        }}></div>
                                    </div>

                                    {isOverstayed && (
                                        <div style={{ 
                                            marginTop: '8px', 
                                            fontSize: '0.6rem', 
                                            color: 'var(--error)', 
                                            fontWeight: 800,
                                            textAlign: 'center',
                                            animation: 'pulse 2s infinite'
                                        }}>
                                            ⚠️ OVERSTAYED
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', opacity: 0.5 }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>AVAILABLE</span>
                                </div>
                            )}

                            <style>{`
                                @keyframes pulse {
                                    0% { opacity: 1; }
                                    50% { opacity: 0.5; }
                                    100% { opacity: 1; }
                                }
                            `}</style>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ParkingGrid;
