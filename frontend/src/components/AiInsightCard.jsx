import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Quote, Target, Star } from 'lucide-react';
import api from '../api/api';

const AiInsightCard = ({ bookTitle, author }) => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchInsights = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/ai/insights?title=${encodeURIComponent(bookTitle)}&author=${encodeURIComponent(author)}`);
            setInsights(response.data);
        } catch (err) {
            setError("AI is busy right now. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    if (!insights && !loading && !error) {
        return (
            <button onClick={fetchInsights} className="btn-secondary" style={{ width: '100%', marginTop: '1rem', borderStyle: 'dashed' }}>
                <Sparkles size={16} />
                <span>Show AI Summary</span>
            </button>
        );
    }

    return (
        <div className="card" style={{ padding: '1rem', marginTop: '1rem', background: '#f9fafb' }}>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>Thinking...</div>
                </div>
            ) : error ? (
                <div style={{ fontSize: '0.8rem', color: '#ef4444', textAlign: 'center' }}>{error}</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Brain size={18} color="var(--primary)" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>AI Summary</span>
                    </div>

                    <p style={{ fontSize: '0.9rem', fontStyle: 'italic', lineHeight: '1.4', color: 'var(--text-main)' }}>
                        "{insights.summary}"
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Star size={12} color="#fbbf24" fill="#fbbf24" />
                            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{insights.score}% match</span>
                        </div>
                        <div style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem', color: 'var(--primary)', border: '1px solid var(--border-color)', borderRadius: '2px', background: 'white' }}>
                            {insights.sentiment}
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default AiInsightCard;
