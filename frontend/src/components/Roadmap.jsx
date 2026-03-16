import React, { useState, useEffect } from 'react';
import API from '../api/axiosConfig';

const Roadmap = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { id: 'planned', title: 'Planned', color: '#3b82f6' },
        { id: 'in-progress', title: 'In Progress', color: '#f59e0b' },
        { id: 'completed', title: 'Completed', color: '#10b981' }
    ];

    useEffect(() => {
        fetchRoadmap();
    }, []);

    const fetchRoadmap = async () => {
        try {
            const response = await API.get('/api/feedback');
            const data = response.data.data;
            // Only show feature suggestions or things specifically marked for roadmap
            setFeedbacks(data.filter(f => ['planned', 'in-progress', 'completed'].includes(f.status)));
        } catch (err) {
            console.error('Roadmap fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

    return (
        <div className="roadmap-container animate-fade-in">
            <div className="roadmap-grid">
                {columns.map(column => (
                    <div key={column.id} className="roadmap-column">
                        <div className="column-header" style={{ borderTopColor: column.color }}>
                            <h3>{column.title}</h3>
                            <span className="count">{feedbacks.filter(f => f.status === column.id).length}</span>
                        </div>
                        <div className="column-content">
                            {feedbacks.filter(f => f.status === column.id).map(item => (
                                <div key={item._id} className="roadmap-card">
                                    <div className="card-category">{item.category}</div>
                                    <div className="card-title">{item.message.substring(0, 60)}{item.message.length > 60 ? '...' : ''}</div>
                                    <div className="card-footer">
                                        <div className="upvotes">
                                            <span>▲</span> {item.upvotes?.length || 0}
                                        </div>
                                        <div className="date">{new Date(item.date).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Roadmap;

