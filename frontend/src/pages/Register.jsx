import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { UserPlus, Mail, User, Lock, AlertCircle, ShieldCheck } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try a different username/email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '50px', height: '50px', background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <UserPlus size={24} color="var(--primary)" />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Create Account</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Join ZenithBooks today</p>
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
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="johndoe" />
                    </div>
                    <div className="form-group">
                        <label><Mail size={14} style={{ marginRight: '0.4rem' }} /> Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                    </div>
                    <div className="form-group">
                        <label><Lock size={14} style={{ marginRight: '0.4rem' }} /> Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                    </div>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label>Role</label>
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register Now'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
