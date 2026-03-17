import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', formData);
            login(
                { id: response.data.id, username: response.data.username, email: response.data.email, role: response.data.role },
                response.data.token
            );
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '50px', height: '50px', background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <LogIn size={24} color="var(--primary)" />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Login to manage your library</p>
                </div>

                {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c', fontSize: '0.85rem' }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label><User size={14} style={{ marginRight: '0.4rem' }} /> Username</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="Enter your username" />
                    </div>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label><Lock size={14} style={{ marginRight: '0.4rem' }} /> Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
