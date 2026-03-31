import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Zap, LayoutDashboard, Shield, LogOut, Menu, X, LogIn } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    ...(user ? [{ to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> }] : []),
    ...(isAdmin ? [{ to: '/admin', label: 'Admin Panel', icon: <Shield size={15} /> }] : []),
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'var(--gradient)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Trigger<span className="gradient-text">Pulse</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8, textDecoration: 'none',
              fontSize: 14, fontWeight: 500,
              color: location.pathname === link.to ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: location.pathname === link.to ? 'rgba(255,255,255,0.08)' : 'transparent',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = location.pathname === link.to ? 'var(--text-primary)' : 'var(--text-secondary)'}
            >
              {link.icon}{link.label}
            </Link>
          ))}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8 }}>
              <span style={{
                fontSize: 13, color: 'var(--text-secondary)',
                background: 'rgba(255,255,255,0.05)',
                padding: '5px 12px', borderRadius: 8,
                border: '1px solid var(--border)',
              }}>
                {user.email}
              </span>
              <button onClick={handleLogout} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                color: '#f87171', fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', borderRadius: 8, textDecoration: 'none',
              fontSize: 14, fontWeight: 600, color: 'white',
              background: 'var(--gradient)', marginLeft: 8, transition: 'opacity 0.2s',
            }}>
              <LogIn size={15} /> Sign In
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
};
