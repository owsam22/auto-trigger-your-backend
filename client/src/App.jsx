import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ServerStatusProvider, useServerStatus } from './context/ServerStatusContext';
import { Navbar } from './components/Navbar';
import { UniversalModal } from './components/UniversalModal';
import { ServerOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import VerifyEmail from './pages/VerifyEmail';

// Protected route: must be logged in AND email verified (unless admin)
const PrivateRoute = ({ children }) => {
  const { user, loading, isEmailVerified, isAdmin } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isEmailVerified && !isAdmin) return <Navigate to="/verify-email" replace />;
  return children;
};

// Admin route: must be admin
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin, isEmailVerified } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

// Auth route: redirect to dashboard if already logged in and verified (or admin)
const GuestRoute = ({ children }) => {
  const { user, loading, isEmailVerified, isAdmin } = useAuth();
  if (loading) return <PageLoader />;
  if (user && (isEmailVerified || isAdmin)) return <Navigate to="/dashboard" replace />;
  if (user && !isEmailVerified && !isAdmin) return <Navigate to="/verify-email" replace />;
  return children;
};

// Verify-email route: only for logged-in unverified users
const VerifyEmailRoute = ({ children }) => {
  const { user, loading, isEmailVerified, isAdmin } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/auth" replace />;
  if (isEmailVerified || isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

const PageLoader = () => (
  <div style={{
    minHeight: 'calc(100vh - 64px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: '50%',
      border: '3px solid rgba(99,102,241,0.2)',
      borderTopColor: '#6366f1',
      animation: 'spin 0.8s linear infinite',
    }} />
  </div>
);

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={
          <GuestRoute><Auth /></GuestRoute>
        } />
        <Route path="/verify-email" element={
          <VerifyEmailRoute><VerifyEmail /></VerifyEmailRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute><Admin /></AdminRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

const ServerDownInterceptor = () => {
  const { isServerDown } = useServerStatus();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleGlobalClick = (e) => {
      // Intercept clicks on buttons or links when the server is down
      if (isServerDown && e.target.closest('button, a')) {
        // Prevent blocking clicks inside the modal itself so users can dismiss it
        if (e.target.closest('.server-down-modal, .universal-close-btn')) return;

        e.preventDefault();
        e.stopPropagation();
        setModalOpen(true);
      }
    };

    if (isServerDown) {
      document.addEventListener('click', handleGlobalClick, true); // Use capture phase
    }

    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [isServerDown]);

  return (
    <UniversalModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
      <div className="server-down-modal" style={{ textAlign: 'center', padding: '10px 0' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <ServerOff size={28} />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
          Service Unavailable
        </h3>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>
          The service is under maintenance. Please contact the admin or try again later.
        </p>
        <button
          onClick={() => setModalOpen(false)}
          style={{
            width: '100%', padding: '12px 0', borderRadius: 12, border: 'none',
            background: 'var(--gradient)', color: 'white', fontWeight: 600, fontSize: 15,
            cursor: 'pointer'
          }}
        >
          Acknowledge
        </button>
      </div>
    </UniversalModal>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ServerStatusProvider>
        <AuthProvider>
          <ServerDownInterceptor />
          <AppRoutes />
          <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#0f0f1a',
              color: '#f0f0ff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
            success: { iconTheme: { primary: '#4ade80', secondary: '#0f0f1a' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#0f0f1a' } },
          }}
        />
        </AuthProvider>
      </ServerStatusProvider>
    </BrowserRouter>
  );
}
