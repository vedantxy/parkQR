import React, { useState, useEffect } from 'react';
import socket from '../utils/socket';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';

const NotificationBell = ({ onClick }) => {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnread = async () => {
        if (!user?.token || user.role !== 'admin') return;
        try {
            const res = await fetch(`${API_URL}/api/notifications`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            if (data.success) {
                setUnreadCount(data.data.filter(n => !n.read).length);
            }
        } catch (e) {}
    };

    useEffect(() => {
        fetchUnread();

        // Listen for real-time additions
        socket.on('notification-added', () => {
            setUnreadCount(prev => prev + 1);
            if (window.Notification && Notification.permission === "granted") {
                new Notification("Smart Parking Alert", { body: "New security notification received." });
            }
        });

        return () => socket.off('notification-added');
    }, []);

    return (
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onClick}>
            <Bell size={24} color="var(--text-main)" />
            {unreadCount > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'var(--error)',
                    color: 'white',
                    fontSize: '0.6rem',
                    padding: '2px 5px',
                    borderRadius: '50%',
                    fontWeight: 800,
                    border: '2px solid white'
                }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
