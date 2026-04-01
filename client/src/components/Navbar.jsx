import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServerStatus } from '../context/ServerStatusContext';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Zap, LayoutDashboard, Shield, LogOut, Menu, X, LogIn, AlertTriangle } from 'lucide-react';
import Button from './button';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { isServerDown } = useServerStatus();
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
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e5e7eb',
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              Trigger<span className="gradient-text">Pulse</span>
            </span>
            <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-secondary)', marginTop: 2 }}>
              auto trigger your backend
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8, textDecoration: 'none',
              fontSize: 14, fontWeight: 500,
              color: location.pathname === link.to ? '#4f46e5' : '#64748b',
              background: location.pathname === link.to ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
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
                fontSize: 13, color: '#64748b',
                background: '#f1f5f9',
                padding: '5px 12px', borderRadius: 8,
                border: '1px solid #e2e8f0',
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
            <Button
              as={Link}
              to="/auth"
              size="small"
              style={{ marginLeft: 8 }}
            >
              <LogIn size={15} /> Sign In
            </Button>
          )}
        </div>
      </div>
      
      {/* Server Down Banner */}
      {isServerDown && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#ef4444', color: 'white', fontSize: 13,
          fontWeight: 600, textAlign: 'center', padding: '8px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)',
        }}>
          <AlertTriangle size={16} /> The service is under maintenance. Please contact the admin or try again later.
        </div>
      )}
    </motion.nav>
  );
};
