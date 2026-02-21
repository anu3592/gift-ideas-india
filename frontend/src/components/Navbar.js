import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={navStyle}>
      <Link to="/" style={logoStyle}>
        🎁 <span style={{ color: '#f0b429' }}>Gift</span>Ideas India
      </Link>
      <p style={{ fontSize: '0.8rem', color: '#9b8caa', fontStyle: 'italic' }}>
        AI-Powered Gift Finder
      </p>
    </nav>
  );
}

const navStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
  padding: '16px 32px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  background: 'rgba(15,8,18,0.85)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(240,180,41,0.1)',
};
const logoStyle = {
  fontFamily: 'Playfair Display, serif',
  fontWeight: 800, fontSize: '1.4rem',
  color: '#f5f0ff', textDecoration: 'none',
  display: 'flex', alignItems: 'center', gap: '8px',
  letterSpacing: '-0.3px',
};
