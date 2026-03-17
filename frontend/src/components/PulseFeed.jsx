import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Activity, User, Zap } from 'lucide-react';

const PulseFeed = () => {
    const [activities, setActivities] = useState([]);
    const stompClientRef = useRef(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws-pulse');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe('/topic/pulse', (message) => {
                    const activity = JSON.parse(message.body);
                    setActivities((prev) => [activity, ...prev].slice(0, 10));
                });
            },
            onStompError: (frame) => {
                console.error('STOMP error', frame);
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, []);

    return (
        <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <Activity size={18} color="var(--primary)" />
                <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Activity Feed</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1 }}>
                <div>
                    {activities.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
                            <p style={{ fontSize: '0.9rem' }}>No recent activity.</p>
                        </div>
                    ) : (
                        activities.map((act, index) => (
                            <div
                                key={act.timestamp + index}
                                className="card"
                                style={{ padding: '0.75rem', marginBottom: '0.75rem', borderLeft: '3px solid var(--primary)' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <User size={14} color="var(--primary)" />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{act.username}</span>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{act.timestamp}</span>
                                </div>
                                <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{act.action}</span>{' '}
                                    <span style={{ fontWeight: 600 }}>{act.bookTitle}</span>
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PulseFeed;
