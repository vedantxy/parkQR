import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';

const NotificationList = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        if (!user?.token || user.role !== 'admin') return;
        try {
            const response = await fetch(`${API_URL}/api/notifications`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            if (data.success) {
                setNotifications(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        if (!user?.token) return;
        try {
            const response = await fetch(`${API_URL}/api/notifications/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (response.ok) {
                setNotifications(notifications.map(n => 
                    n._id === id ? { ...n, read: true } : n
                ));
            }
        } catch (error) {
            console.error('Failed to mark read:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // 10s sync
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading) return null;

    return (
        <div style={{ padding: '0 20px 20px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    System Alerts 
                    {unreadCount > 0 && (
                        <span style={{ 
                            background: 'var(--error)', 
                            color: 'white', 
                            fontSize: '0.6rem', 
                            padding: '2px 6px', 
                            borderRadius: '99px' 
                        }}>{unreadCount}</span>
                    )}
                </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        No fresh alerts. System clear.
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div key={notif._id} style={{
                            padding: '12px 16px',
                            background: notif.read ? 'rgba(255,255,255,0.02)' : 'rgba(239, 68, 68, 0.03)',
                            borderRadius: '12px',
                            border: `1px solid ${notif.read ? 'rgba(0,0,0,0.05)' : 'rgba(239, 68, 68, 0.1)'}`,
                            position: 'relative',
                            opacity: notif.read ? 0.7 : 1,
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                        }} onClick={() => !notif.read && markAsRead(notif._id)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: notif.read ? 600 : 700, color: notif.read ? 'inherit' : 'var(--error)' }}>
                                    {notif.message}
                                </div>
                                {!notif.read && (
                                    <div style={{ width: 8, height: 8, background: 'var(--error)', borderRadius: '50%' }}></div>
                                )}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                {new Date(notif.createdAt).toLocaleTimeString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationList;
