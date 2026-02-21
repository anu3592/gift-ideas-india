import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GiftCard from '../components/GiftCard';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  // Redirect to home if no data
  if (!data) {
    navigate('/');
    return null;
  }

  const { recipient, occasion, budget, gifts } = data;

  return (
    <div style={pageStyle}>
      <div style={container}>

        {/* Results Header */}
        <div style={headerStyle}>
          <div style={backBtn} onClick={() => navigate('/')}>← Find Another Gift</div>

          <div style={resultsBadge}>
            🎁 {gifts.length} Perfect Gift Ideas Found!
          </div>

          <h1 style={titleStyle}>
            Perfect Gifts for<br />
            <span style={{ color: '#f0b429' }}>{recipient}</span>
          </h1>

          <div style={metaRow}>
            <span style={metaChip}>{occasion}</span>
            <span style={metaChip}>Budget: ₹{Number(budget).toLocaleString('en-IN')}</span>
            <span style={{ ...metaChip, background: 'rgba(34,197,94,0.12)', color: '#22c55e', borderColor: 'rgba(34,197,94,0.25)' }}>
              Live prices from Amazon & Flipkart
            </span>
          </div>
        </div>

        {/* Gift Cards */}
        <div style={giftList}>
          {gifts.map((gift, i) => (
            <GiftCard key={i} gift={gift} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={bottomCta}>
          <p style={{ color: '#9b8caa', marginBottom: '16px' }}>
            Not satisfied? Try again with different preferences!
          </p>
          <button style={tryAgainBtn} onClick={() => navigate('/')}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            🎁 Find More Gifts
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const pageStyle = {
  minHeight: '100vh', paddingTop: '90px', paddingBottom: '60px',
  position: 'relative', zIndex: 1,
};
const container = {
  maxWidth: '860px', margin: '0 auto', padding: '0 24px',
};
const headerStyle = {
  textAlign: 'center', marginBottom: '48px',
  animation: 'fadeUp 0.5s ease',
};
const backBtn = {
  display: 'inline-block', cursor: 'pointer',
  color: '#9b8caa', fontSize: '0.88rem', marginBottom: '24px',
  padding: '8px 16px', borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.08)',
  transition: 'color 0.2s',
};
const resultsBadge = {
  display: 'inline-block', background: 'rgba(240,180,41,0.12)',
  border: '1px solid rgba(240,180,41,0.25)', color: '#f0b429',
  padding: '6px 18px', borderRadius: '20px',
  fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px',
};
const titleStyle = {
  fontFamily: 'Playfair Display, serif',
  fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
  fontWeight: 800, color: '#f5f0ff',
  lineHeight: 1.2, marginBottom: '20px',
};
const metaRow = {
  display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap',
};
const metaChip = {
  background: 'rgba(255,107,157,0.1)', border: '1px solid rgba(255,107,157,0.2)',
  color: '#ff6b9d', padding: '6px 16px', borderRadius: '20px',
  fontSize: '0.82rem', fontWeight: 500,
};
const giftList = { display: 'flex', flexDirection: 'column' };
const bottomCta = {
  textAlign: 'center', padding: '40px 0 20px',
};
const tryAgainBtn = {
  background: 'linear-gradient(135deg, #f0b429 0%, #ff6b9d 100%)',
  color: '#0f0812', border: 'none', padding: '14px 32px',
  borderRadius: '12px', cursor: 'pointer',
  fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 700,
  transition: 'all 0.2s',
  boxShadow: '0 8px 24px rgba(240,180,41,0.25)',
};
