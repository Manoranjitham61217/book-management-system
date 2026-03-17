import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import { Save, ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';

const BookForm = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '', author: '', category: '', isbn: '', description: '', publishedYear: new Date().getFullYear(), count: 1
    });
    const [pdfFile, setPdfFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            const fetchBook = async () => {
                try {
                    const response = await api.get(`/books/${id}`);
                    setFormData(response.data);
                } catch (err) {
                    setError('Failed to fetch book details');
                }
            };
            fetchBook();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'publishedYear' || name === 'count' ? parseInt(value) : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            let savedBookId = id;
            if (isEdit) {
                await api.put(`/books/${id}`, formData);
            } else {
                const response = await api.post('/books', formData);
                savedBookId = response.data.id;
            }

            if (pdfFile) {
                const pdfData = new FormData();
                pdfData.append('file', pdfFile);
                await api.post(`/books/${savedBookId}/pdf`, pdfData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            navigate('/books');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save book');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-lumina" style={{ maxWidth: '900px', padding: '2rem 0' }}>
            <button onClick={() => navigate('/books')} className="btn-secondary" style={{ marginBottom: '2rem', padding: '0.6rem 1.2rem' }}>
                <ArrowLeft size={18} />
                Back to Books
            </button>

            <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={20} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{isEdit ? 'Edit Book' : 'Add New Book'}</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fill in the details below to update your collection.</p>
                    </div>
                </div>

                {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c', fontSize: '0.9rem' }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Book Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Enter book title" />
                        </div>
                        <div className="form-group">
                            <label>Author</label>
                            <input type="text" name="author" value={formData.author} onChange={handleChange} required placeholder="Enter author name" />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Fiction" />
                        </div>
                        <div className="form-group">
                            <label>ISBN</label>
                            <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} placeholder="Optional" />
                        </div>
                        <div className="form-group">
                            <label>Published Year</label>
                            <input type="number" name="publishedYear" value={formData.publishedYear} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Copies Available</label>
                            <input type="number" name="count" value={formData.count} onChange={handleChange} min="0" />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Brief summary of the book..."></textarea>
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Upload PDF Book (Optional)</label>
                            <input 
                                type="file" 
                                accept="application/pdf" 
                                onChange={(e) => setPdfFile(e.target.files[0])} 
                                style={{ padding: '0.5rem', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                            />
                            {isEdit && formData.pdfFilename && !pdfFile && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>* A PDF is already uploaded for this book. Uploading a new one will replace it.</p>
                            )}
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '2rem' }} disabled={loading}>
                        <Save size={18} />
                        {loading ? 'Saving...' : (isEdit ? 'Update Book' : 'Add Book')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookForm;
