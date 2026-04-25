import React, { useState, useEffect } from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, Users, AlertTriangle, Disc } from 'lucide-react';

const AnalyticsDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/analytics');
                const json = await res.json();
                if (json.success) setData(json.data);
            } catch (e) {} finally { setLoading(false); }
        };
        fetchData();
    }, []);

    if (loading || !data) return <div className="spinner"></div>;

    const occupancyData = [
        { name: 'Occupied', value: data.occupancy.occupied, color: 'var(--primary)' },
        { name: 'Free', value: data.occupancy.free, color: 'var(--success)' },
        { name: 'Overstay', value: data.occupancy.overstay, color: 'var(--error)' }
    ];

    return (
        <div className="analytics-view animate-in">
            {/* KPI Section */}
            <div className="dashboard-grid">
                <div className="glass stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <div className="stat-label">Daily Visitors</div>
                            <div className="stat-value">{data.kpis.totalVisitorsToday}</div>
                        </div>
                        <Users size={32} color="var(--primary)" opacity={0.3} />
                    </div>
                </div>
                <div className="glass stat-card">
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <div className="stat-label">Critical Alerts</div>
                            <div className="stat-value" style={{ color: 'var(--error)' }}>{data.kpis.criticalAlerts}</div>
                        </div>
                        <AlertTriangle size={32} color="var(--error)" opacity={0.3} />
                    </div>
                </div>
                <div className="glass stat-card">
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <div className="stat-label">Occupancy Rate</div>
                            <div className="stat-value">
                                {Math.round((data.occupancy.occupied / data.occupancy.total) * 100)}%
                            </div>
                        </div>
                        <Disc size={32} color="var(--success)" opacity={0.3} />
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '32px' }}>
                {/* Trend Chart */}
                <div className="glass" style={{ padding: '24px', height: '400px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={18} color="var(--primary)" />
                        Visitor In-flow Trend (Last 7 Days)
                    </h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={data.dailyStats}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="_id" scale="point" padding={{ left: 10, right: 10 }} />
                            <YAxis />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                            <Line 
                                type="monotone" 
                                dataKey="count" 
                                stroke="var(--primary)" 
                                strokeWidth={4} 
                                dot={{ r: 6, fill: 'var(--primary)', strokeWidth: 2, stroke: 'white' }} 
                                activeDot={{ r: 8 }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Occupancy Pie Chart */}
                <div className="glass" style={{ padding: '24px', height: '400px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Occupancy Distribution</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={occupancyData}
                                cx="50%" cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {occupancyData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.8rem' }}>
                        {occupancyData.map(d => (
                            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }}></div>
                                {d.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
