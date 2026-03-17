import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Search, LayoutGrid, List, Plus, ChevronLeft, ChevronRight, BookOpen, Trash2, Edit, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AiInsightCard from '../components/AiInsightCard';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [viewMode, setViewMode] = useState('grid');
    const { user } = useAuth();

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await api.get('/books', {
                params: { query, page, size: 8 }
            });
            setBooks(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error('Failed to fetch books', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchBooks();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [query, page]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await api.delete(`/books/${id}`);
                fetchBooks();
            } catch (err) {
                alert('Failed to delete book');
            }
        }
    };

    return (
        <div className="container animate-lumina" style={{ padding: '2rem 0' }}>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="text-gradient">Lumina Explorer</h1>
                    <p>Discover your next great read with AI-powered insights.</p>
                </div>
                {user.role === 'ROLE_ADMIN' && (
                    <Link to="/add-book" className="btn-primary" style={{ textDecoration: 'none', marginBottom: '1rem' }}>
                        <Plus size={20} />
                        Curate Collection
                    </Link>
                )}
            </div>

            <div className="glass" style={{ padding: '1.5rem', marginBottom: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                    <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                    <input
                        type="text"
                        placeholder="Search archives by title, author, or essence..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ paddingLeft: '3.5rem' }}
                    />
                </div>
                <div className="glass" style={{ display: 'flex', padding: '0.4rem', gap: '0.5rem' }}>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}
                        style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}
                    >Grid</button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}
                        style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}
                    >Table</button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                    <div className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: 600 }}>Syncing with Library Grids...</div>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="card-grid">
                            <AnimatePresence>
                                {books.map((book) => (
                                    <motion.div
                                        key={book.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="glass"
                                        style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.7rem', padding: '0.3rem 0.7rem', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--accent)', borderRadius: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid var(--glass-border)' }}>{book.category}</span>
                                            {user.role === 'ROLE_ADMIN' && (
                                                <div style={{ display: 'flex', gap: '0.8rem' }}>
                                                    <Link to={`/edit-book/${book.id}`} style={{ color: 'var(--text-muted)' }} title="Edit Book"><Edit size={16} /></Link>
                                                    <button onClick={() => handleDelete(book.id)} style={{ background: 'transparent', color: 'var(--secondary)', padding: 0 }} title="Delete Book"><Trash2 size={16} /></button>
                                                </div>
                                            )}
                                        </div>
                                        <h3 style={{ marginTop: '1.2rem', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>{book.title}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.2rem', fontWeight: 500 }}>by <span style={{ color: 'var(--text-main)' }}>{book.author}</span></p>
                                        <p style={{ fontSize: '0.9rem', flex: 1, marginBottom: '1.5rem', opacity: 0.8, lineHeight: '1.6' }}>{book.description?.substring(0, 110)}{book.description?.length > 110 ? '...' : ''}</p>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <Link to={`/books/${book.id}`} className="btn-secondary" style={{ width: '100%', textDecoration: 'none', display: 'flex', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                                <ExternalLink size={16} />
                                                View Details
                                            </Link>
                                        </div>

                                        <AiInsightCard bookTitle={book.title} author={book.author} />

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', marginTop: '1.5rem', paddingTop: '1rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Reference</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 600 }}>{book.isbn}</span>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', display: 'block' }}>Availability</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: book.count > 0 ? 'var(--accent)' : 'var(--secondary)' }}>{book.count > 0 ? `${book.count} Units` : 'Depleted'}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="glass" style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <th style={{ padding: '1rem' }}>Title</th>
                                        <th style={{ padding: '1rem' }}>Author</th>
                                        <th style={{ padding: '1rem' }}>Category</th>
                                        <th style={{ padding: '1rem' }}>Published</th>
                                        <th style={{ padding: '1rem' }}>Stock</th>
                                        <th style={{ padding: '1rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.map((book) => (
                                        <tr key={book.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '1rem', fontWeight: 500 }}>{book.title}</td>
                                            <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{book.author}</td>
                                            <td style={{ padding: '1rem' }}>{book.category}</td>
                                            <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{book.publishedYear}</td>
                                            <td style={{ padding: '1rem' }}>{book.count}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                                    <Link to={`/books/${book.id}`} style={{ color: 'var(--primary)' }} title="View Details"><ExternalLink size={18} /></Link>
                                                    {user.role === 'ROLE_ADMIN' && (
                                                        <>
                                                            <Link to={`/edit-book/${book.id}`} style={{ color: 'var(--text-muted)' }} title="Edit"><Edit size={18} /></Link>
                                                            <button onClick={() => handleDelete(book.id)} style={{ background: 'transparent', color: '#f87171', padding: 0 }} title="Delete"><Trash2 size={18} /></button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                            className="glass" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', opacity: page === 0 ? 0.5 : 1 }}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Page {page + 1} of {totalPages || 1}</span>
                        <button
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(page + 1)}
                            className="glass" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', opacity: page >= totalPages - 1 ? 0.5 : 1 }}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default BookList;
