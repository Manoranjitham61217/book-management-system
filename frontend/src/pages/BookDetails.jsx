import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { BookOpen, ArrowLeft, Download, FileText, Calendar, Archive } from 'lucide-react';
import AiInsightCard from '../components/AiInsightCard';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await api.get(`/books/${id}`);
                setBook(response.data);
            } catch (err) {
                setError('Failed to fetch book details.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id]);

    const handleReadPdf = () => {
        if (book?.pdfFilename) {
            window.open(`http://localhost:8080/api/books/pdf/${book.pdfFilename}`, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <p className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading Book Essence...</p>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--secondary)' }}>{error || 'Book not found'}</p>
                <button onClick={() => navigate('/books')} className="btn-secondary" style={{ marginTop: '1rem' }}>Return to Library</button>
            </div>
        );
    }

    return (
        <div className="container animate-lumina" style={{ padding: '2rem 0', maxWidth: '1000px' }}>
            <button onClick={() => navigate('/books')} className="btn-secondary" style={{ marginBottom: '2rem', padding: '0.6rem 1.2rem' }}>
                <ArrowLeft size={18} />
                Back to Library
            </button>

            <div className="card" style={{ padding: '3rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', opacity: 0.05, filter: 'blur(40px)', pointerEvents: 'none' }} />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {book.category || 'Uncategorized'}
                            </span>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', color: 'var(--text-main)', lineHeight: 1.2 }}>{book.title}</h1>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>by <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{book.author}</span></p>
                        </div>

                        {book.pdfFilename && (
                            <button onClick={handleReadPdf} className="btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.39)' }}>
                                <FileText size={20} />
                                Read PDF
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', padding: '1.5rem 0', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ padding: '0.6rem', background: '#fef3c7', borderRadius: '10px' }}><Calendar size={20} color="#d97706" /></div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', margin: 0 }}>Published</p>
                                <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{book.publishedYear || 'Unknown'}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ padding: '0.6rem', background: '#e0e7ff', borderRadius: '10px' }}><Archive size={20} color="#4f46e5" /></div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', margin: 0 }}>ISBN</p>
                                <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{book.isbn || 'N/A'}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ padding: '0.6rem', background: book.count > 0 ? '#dcfce7' : '#fee2e2', borderRadius: '10px' }}><BookOpen size={20} color={book.count > 0 ? '#16a34a' : '#dc2626'} /></div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', margin: 0 }}>Status</p>
                                <p style={{ fontSize: '1rem', fontWeight: 700, color: book.count > 0 ? '#16a34a' : '#dc2626', margin: 0 }}>{book.count > 0 ? `${book.count} Available` : 'Out of Stock'}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>Synopsis</h3>
                        <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-muted)', whiteSpace: 'pre-line' }}>
                            {book.description || <span style={{ fontStyle: 'italic', opacity: 0.7 }}>No description available for this volume.</span>}
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <AiInsightCard bookTitle={book.title} author={book.author} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
