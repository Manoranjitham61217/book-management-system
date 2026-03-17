import { useState, useEffect } from 'react';
import api from '../api/api';
import { Search, Download, BookOpen, AlertCircle, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ArchiveExplorer = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchInitial = async () => {
            setLoading(true);
            try {
                const response = await api.get('/gutenberg/search', { params: { query: 'classic' } });
                setResults(response.data);
            } catch (err) {
                console.error('Failed to fetch archives');
            } finally {
                setLoading(false);
            }
        };
        fetchInitial();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        try {
            const response = await api.get('/gutenberg/search', { params: { query } });
            setResults(response.data);
        } catch (err) {
            console.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (book) => {
        setImporting(book.isbn);
        try {
            await api.post('/gutenberg/import', book);
            setMessage({ type: 'success', text: `"${book.title}" has been added to your library.` });

            // Broadcast social activity (optional, but honors the Lumina design)
            try {
                const username = JSON.parse(localStorage.getItem('user'))?.username || 'Archivist';
                // Note: Social broadcast usually happens via WebSocket, but here we just show local feedback
            } catch (e) { }

        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data || 'Failed to import essence.' });
        } finally {
            setImporting(null);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    return (
        <div className="container animate-lumina" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div className="section-header" style={{ marginBottom: 0 }}>
                    <h1 className="text-gradient">Classic Books</h1>
                    <p>Browse and add classic books to your collection.</p>
                </div>
                <button onClick={() => navigate('/books')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowLeft size={18} />
                    Back to Library
                </button>
            </div>

            <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
                <div className="card" style={{ display: 'flex', padding: '0.5rem', maxWidth: '600px', margin: '0 auto', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for books by title, author, or category..."
                        style={{ border: 'none', color: 'var(--text-main)', flex: 1, padding: '0.5rem 1rem', fontSize: '1rem', outline: 'none' }}
                    />
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                        <span>Search</span>
                    </button>
                </div>
            </form>

            <div style={{ marginBottom: '2rem' }}>
                {message && (
                    <div
                        className="card"
                        style={{
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            borderLeft: `4px solid ${message.type === 'success' ? 'var(--primary)' : '#ef4444'}`,
                            background: message.type === 'success' ? '#eff6ff' : '#fef2f2'
                        }}
                    >
                        {message.type === 'success' ? <Sparkles size={18} color="var(--primary)" /> : <AlertCircle size={18} color="#ef4444" />}
                        <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{message.text}</span>
                    </div>
                )}
            </div>

            {loading && results.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '5rem 0' }}>
                    <Loader2 size={60} className="animate-spin text-primary" style={{ opacity: 0.5 }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Searching...</p>
                </div>
            ) : (
                <div className="card-grid">
                    {results.map((book) => (
                        <div
                            key={book.isbn}
                            className="card"
                            style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ padding: '0.5rem', background: '#f3f4f6', borderRadius: '4px' }}>
                                    <BookOpen size={20} color="var(--primary)" />
                                </div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '0.2rem 0.4rem', borderRadius: '2px' }}>
                                    External
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>{book.title}</h3>
                                <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>{book.author}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {book.description}
                                </p>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
                                <button
                                    className="btn-primary"
                                    style={{ width: '100%', fontSize: '0.85rem' }}
                                    disabled={importing === book.isbn}
                                    onClick={() => handleImport(book)}
                                >
                                    {importing === book.isbn ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        <><Download size={18} /> Add to Library</>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {results.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No books found.</p>
                </div>
            )}
        </div>
    );
};

export default ArchiveExplorer;
