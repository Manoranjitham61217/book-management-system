import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Book, LogOut, User, LayoutDashboard, PlusCircle } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ background: 'white', borderBottom: '1px solid var(--border-color)', padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 1000 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 800 }}>
                    <Book size={24} />
                    <span>ZenithBooks</span>
                </Link>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
                            <NavLink to="/books" className="nav-link">Search</NavLink>
                            <NavLink to="/archives" className="nav-link">Public Books</NavLink>
                            {user.role === 'ROLE_ADMIN' && (
                                <NavLink to="/add-book" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <PlusCircle size={18} />
                                    <span>Add Book</span>
                                </NavLink>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '0.5rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{user.username}</span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user.role.replace('ROLE_', '')}</span>
                                </div>
                                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '10px' }}>
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Sign In</Link>
                            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
