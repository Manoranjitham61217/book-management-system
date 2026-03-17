import { useState, useEffect } from 'react';
import api from '../api/api';
import { BarChart3, Users, BookOpen, Star, TrendingUp, Sparkles, ChevronRight, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import PulseFeed from '../components/PulseFeed';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalBooks: 0, categories: 0, activeUsers: 24 });
    const [recommendations, setRecommendations] = useState([]);

    const bookColors = [
        { bg: '#eff6ff', border: '#bfdbfe', icon: '#60a5fa' },
        { bg: '#fef2f2', border: '#fecaca', icon: '#f87171' },
        { bg: '#f0fdf4', border: '#bbf7d0', icon: '#4ade80' },
        { bg: '#fffbeb', border: '#fde68a', icon: '#fbbf24' },
        { bg: '#f5f3ff', border: '#ddd6fe', icon: '#a78bfa' }
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/books', { params: { size: 100 } });
                const books = response.data.content;
                const uniqueCategories = new Set(books.map(b => b.category)).size;
                setStats(prev => ({ ...prev, totalBooks: books.length, categories: uniqueCategories }));

                setRecommendations(books.slice(0, 4));
            } catch (err) {
                console.error('Failed to fetch dashboard stats');
            }
        };
        fetchStats();
    }, []);

    const statsCards = [
        { label: 'Total Books', value: stats.totalBooks, icon: BookOpen, color: '#8b5cf6' },
        { label: 'Categories', value: stats.categories, icon: BarChart3, color: '#ec4899' },
        { label: 'Active Users', value: stats.activeUsers, icon: Users, color: '#06b6d4' },
        { label: 'AI Tips', value: '89', icon: Sparkles, color: '#fbbf24' },
    ];

    return (
        <div className="container animate-lumina" style={{ padding: '2rem 0' }}>
            <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', borderRadius: '16px', padding: '2.5rem 3rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid #bfdbfe', boxShadow: 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.5)' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e3a8a', letterSpacing: '-0.02em', margin: 0 }}>Welcome back, {user.username} 👋</h1>
                <p style={{ color: '#3b82f6', fontSize: '1.1rem', margin: 0, fontWeight: 500 }}>Here's what's happening in your library today.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                {statsCards.map((stat, index) => (
                    <div
                        key={index}
                        className="card"
                        style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'white' }}
                    >
                        <div style={{ width: '56px', height: '56px', background: `${stat.color}15`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <stat.icon size={28} color={stat.color} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{stat.value}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <TrendingUp size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Recommended for You</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recommendations.length > 0 ? recommendations.map((book, index) => {
                            const colorTheme = bookColors[index % bookColors.length];
                            return (
                                <div
                                    key={book.id}
                                    className="card"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: '1rem',
                                        padding: '1rem',
                                        alignItems: 'stretch',
                                        background: 'white'
                                    }}
                                >
                                    <div style={{
                                        width: '100px',
                                        minWidth: '100px',
                                        background: `linear-gradient(to bottom right, white, ${colorTheme.bg})`,
                                        border: `1px solid ${colorTheme.border}`,
                                        borderRadius: '12px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '0.5rem',
                                        textAlign: 'center',
                                        flexShrink: 0,
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        {book.coverImageUrl ? (
                                            <img src={book.coverImageUrl} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                                        ) : (
                                            <>
                                                <div style={{ padding: '0.5rem', background: 'white', borderRadius: '50%', marginBottom: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative', zIndex: 1 }}>
                                                    <BookOpen size={20} color={colorTheme.icon} />
                                                </div>
                                                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: colorTheme.icon, textTransform: 'uppercase', letterSpacing: '0.05em', position: 'relative', zIndex: 1 }}>
                                                    {book.category || 'Book'}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, justifyContent: 'center', gap: '1rem' }}>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: '1.3', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{book.title}</h4>

                                        <button
                                            onClick={() => navigate(`/books/${book.id}`)}
                                            style={{
                                                background: 'transparent',
                                                border: `1px solid ${colorTheme.icon}`,
                                                color: colorTheme.icon,
                                                padding: '0.4rem 0.75rem',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.4rem',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                transition: 'all 0.2s ease',
                                                cursor: 'pointer',
                                                alignSelf: 'flex-start'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = colorTheme.bg;
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                            }}
                                        >
                                            View Details
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <p style={{ opacity: 0.5 }}>Finding books for you...</p>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <PulseFeed />

                    <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#eff6ff', borderColor: '#bfdbfe' }}>
                        <Sparkles size={24} color="var(--primary)" />
                        <div>
                            <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>AI Tip</p>
                            <p style={{ fontSize: '0.75rem', color: '#1e40af' }}>Check book insights for hidden themes!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
