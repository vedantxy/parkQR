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
                <h3 style={{ margin: 0 }}>Smart Allocation Grid</h3>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: 12, height: 12, background: 'var(--success)', borderRadius: '3px' }}></div> Free
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: 12, height: 12, background: 'var(--error)', borderRadius: '3px' }}></div> Occupied
                    </div>
                </div>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                gap: '20px' 
            }}>
                {slots.map((slot) => (
                    <div key={slot._id} className="animate-in" style={{
                        aspectRatio: '0.7',
                        background: slot.isOccupied ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                        border: `2px solid ${slot.isOccupied ? 'var(--error)' : 'var(--success)'}`,
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        boxShadow: slot.isOccupied ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.1)'
                    }}>
                        <div style={{ 
                            fontSize: '1.25rem', 
                            fontWeight: 800, 
                            color: slot.isOccupied ? 'var(--error)' : 'var(--success)' 
                        }}>
                            {slot.slotId}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>
                            {slot.slotType}
                        </div>
                        
                        {slot.isOccupied && (
                            <div style={{ 
                                marginTop: '12px', 
                                padding: '4px 8px', 
                                background: 'var(--error)', 
                                color: 'white', 
                                fontSize: '0.6rem', 
                                borderRadius: '4px',
                                fontWeight: 700
                            }}>
                                {slot.vehicle}
                            </div>
                        )}

                        <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: slot.isOccupied ? 'var(--error)' : 'var(--success)'
                        }}></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParkingGrid;
