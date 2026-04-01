import { Link } from 'react-router-dom';
import { Zap, Code, Globe, Mail, ExternalLink } from 'lucide-react';
import styled from 'styled-components';

export const Footer = ({ variant = 'simple' }) => {
  const currentYear = new Date().getFullYear();

  if (variant === 'simple') {
    return (
      <SimpleFooterWrapper>
        <div className="container">
          <div className="left">
            <Link to="/" className="logo">
              <Zap size={16} fill="currentColor" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 700, lineHeight: 1 }}>TriggerPulse</span>
                <span style={{ fontSize: 9, fontWeight: 500, color: 'var(--text-secondary)', marginTop: 2 }}>
                  auto trigger your backend
                </span>
              </div>
            </Link>
            <span className="separator">|</span>
            <p className="copyright">© {currentYear} All rights reserved</p>
          </div>
          <div className="right">
            <span>Made with ⚡ by </span>
            <a href="https://github.com/owsam22" target="_blank" rel="noopener noreferrer" className="credit">
              owsam22 <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </SimpleFooterWrapper>
    );
  }

  return (
    <DetailedFooterWrapper>
      <div className="container">
        <div className="top-section">
          <div className="brand-col">
            <Link to="/" className="logo">
              <div className="logo-icon">
                <Zap size={20} fill="white" color="white" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 800, lineHeight: 1 }}>TriggerPulse</span>
                <span style={{ fontSize: 10, fontWeight: 500, color: '#94a3b8', marginTop: 4 }}>
                  auto trigger your backend
                </span>
              </div>
            </Link>
            <p className="description">
              The ultimate uptime monitoring solution for free-tier backends. 
              Keep your services warm, responsive, and always ready for your users.
            </p>
            <div className="socials">
              <a href="https://samarpan-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer"><Code size={20} /></a>
              <a href="#"><Globe size={20} /></a>
              <a href="mailto:22.samarpan@gmail.com"><Mail size={20} /></a>
            </div>
          </div>

          <div className="links-grid">
            <div className="link-group">
              <h4>Product</h4>
              <Link to="/auth">Get Started</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/admin">Admin Panel</Link>
            </div>
            <div className="link-group">
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">API Reference</a>
              <a href="#">Status Page</a>
            </div>
            <div className="link-group">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Security</a>
            </div>
          </div>
        </div>

        <div className="bottom-bar">
          <p>© {currentYear} TriggerPulse. Built for developers by developers.</p>
          <div className="credits">
            <span>Created with ❤️ by </span>
            <a href="https://github.com/owsam22" target="_blank" rel="noopener noreferrer">owsam22</a>
          </div>
        </div>
      </div>
    </DetailedFooterWrapper>
  );
};

const SimpleFooterWrapper = styled.footer`
  padding: 24px 0;
  border-top: 1px solid var(--border);
  margin-top: auto;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-secondary);
    font-size: 13px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    color: var(--text-primary);
    font-weight: 700;
    transition: opacity 0.2s;
    &:hover { opacity: 0.8; }
  }

  .separator { color: var(--border); }

  .right {
    font-size: 13px;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .credit {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 3px;
    &:hover { text-decoration: underline; }
  }

  @media (max-width: 640px) {
    .container { justify-content: center; text-align: center; }
  }
`;

const DetailedFooterWrapper = styled.footer`
  padding: 80px 0 40px;
  background: #0f1117;
  color: #94a3b8;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .top-section {
    display: grid;
    grid-template-columns: 1.5fr 2fr;
    gap: 64px;
    margin-bottom: 64px;
  }

  .brand-col {
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: white;
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 24px;
      letter-spacing: -0.02em;

      .logo-icon {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
      }
    }

    .description {
      line-height: 1.7;
      margin-bottom: 32px;
      font-size: 15px;
      max-width: 360px;
    }

    .socials {
      display: flex;
      gap: 16px;
      a {
        color: #94a3b8;
        transition: all 0.2s;
        &:hover { color: white; transform: translateY(-2px); }
      }
    }
  }

  .links-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }

  .link-group {
    h4 {
      color: white;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 24px;
    }
    
    a {
      display: block;
      color: #94a3b8;
      text-decoration: none;
      margin-bottom: 12px;
      font-size: 15px;
      transition: color 0.2s;
      &:hover { color: white; }
    }
  }

  .bottom-bar {
    padding-top: 32px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;

    .credits {
      display: flex;
      align-items: center;
      gap: 4px;
      a {
        color: white;
        text-decoration: none;
        font-weight: 600;
        &:hover { text-decoration: underline; }
      }
    }
  }

  @media (max-width: 968px) {
    .top-section { grid-template-columns: 1fr; gap: 48px; }
  }

  @media (max-width: 640px) {
    padding: 60px 0 32px;
    .links-grid { grid-template-columns: 1fr; gap: 32px; }
    .bottom-bar { flex-direction: column; gap: 16px; text-align: center; }
  }
`;
