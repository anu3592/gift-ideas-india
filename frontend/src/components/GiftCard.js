import React, { useState } from 'react';

const PLATFORM_CONFIG = {
  amazon:   { label: 'Amazon',   color: '#ff9900', bg: 'rgba(255,153,0,0.12)',  icon: '📦' },
  flipkart: { label: 'Flipkart', color: '#2874f0', bg: 'rgba(40,116,240,0.12)', icon: '🛒' },
};

export default function GiftCard({ gift, index }) {
  const [activeProduct, setActiveProduct] = useState(null);

  const hasProducts = gift.products && gift.products.length > 0;

  return (
    <div style={{ ...cardStyle, animationDelay: `${index * 0.1}s` }} className="fade-up">

      {/* Gift Idea Header */}
      <div style={cardHeader}>
        <div style={emojiCircle}>{gift.emoji || '🎁'}</div>
        <div style={{ flex: 1 }}>
          <h3 style={giftName}>{gift.name}</h3>
          <p style={giftDesc}>{gift.description}</p>
        </div>
        {gift.cheapestPrice && (
          <div style={priceTag}>
            From {gift.cheapestPrice}
          </div>
        )}
      </div>

      {/* Why Perfect */}
      <div style={whyBox}>
        <span style={{ color: '#f0b429', fontSize: '0.8rem', fontWeight: 700, marginRight: '8px' }}>
          💡 Why perfect:
        </span>
        <span style={{ color: '#c4b8d4', fontSize: '0.85rem', lineHeight: 1.5 }}>
          {gift.whyPerfect}
        </span>
      </div>

      {/* Products Section */}
      {hasProducts ? (
        <div style={productsSection}>
          <p style={productsTitle}>
            🛍️ Find this on:
            {gift.cheapestPlatform && (
              <span style={{ color: PLATFORM_CONFIG[gift.cheapestPlatform]?.color, marginLeft: '8px', fontSize: '0.75rem' }}>
                Best price on {PLATFORM_CONFIG[gift.cheapestPlatform]?.label}!
              </span>
            )}
          </p>

          <div style={productsGrid}>
            {gift.products.map((product, i) => {
              const cfg = PLATFORM_CONFIG[product.platform] || {};
              const isCheapest = product.platform === gift.cheapestPlatform;

              return (
                <div key={i} style={{
                  ...productCard,
                  borderColor: isCheapest ? `${cfg.color}50` : 'rgba(255,255,255,0.06)',
                  background: isCheapest ? cfg.bg : 'rgba(255,255,255,0.02)',
                }}>
                  {/* Product image */}
                  {product.image && (
                    <div style={imgWrap}>
                      <img
                        src={product.image} alt={product.name}
                        style={imgStyle}
                        onError={e => e.target.style.display = 'none'}
                      />
                    </div>
                  )}

                  <div style={{ padding: '10px' }}>
                    {/* Platform badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ ...platformBadge, color: cfg.color, background: cfg.bg }}>
                        {cfg.icon} {cfg.label}
                      </span>
                      {isCheapest && (
                        <span style={lowestBadge}>🏆 Lowest</span>
                      )}
                    </div>

                    {/* Product name */}
                    <p style={productName}>{product.name}</p>

                    {/* Price + Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontFamily: 'Playfair Display', fontSize: '1rem', fontWeight: 700, color: cfg.color }}>
                        {product.price || 'View Price'}
                      </span>
                      {product.rating && (
                        <span style={{ fontSize: '0.72rem', color: '#9b8caa' }}>
                          ⭐ {product.rating}
                        </span>
                      )}
                    </div>

                    {/* Buy Button */}
                    <button
                      style={{ ...buyBtn, background: cfg.color }}
                      onClick={() => window.open(product.buyLink, '_blank')}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      {cfg.icon} Buy on {cfg.label} →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // No products found — show manual search links
        <div style={noProductsBox}>
          <p style={{ color: '#9b8caa', fontSize: '0.85rem', marginBottom: '12px' }}>
            Search manually on these platforms:
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { label: 'Amazon', icon: '📦', color: '#ff9900', url: `https://www.amazon.in/s?k=${encodeURIComponent(gift.searchKeyword)}&tag=${process.env.REACT_APP_AMAZON_TAG || ''}` },
              { label: 'Flipkart', icon: '🛒', color: '#2874f0', url: `https://www.flipkart.com/search?q=${encodeURIComponent(gift.searchKeyword)}` },
              { label: 'Myntra', icon: '👗', color: '#ff3f6c', url: `https://www.myntra.com/${encodeURIComponent(gift.searchKeyword)}` },
            ].map(p => (
              <button key={p.label}
                style={{ ...manualBtn, borderColor: `${p.color}40`, color: p.color }}
                onClick={() => window.open(p.url, '_blank')}>
                {p.icon} Search on {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const cardStyle = {
  background: 'rgba(26,16,32,0.9)', borderRadius: '20px',
  border: '1px solid rgba(240,180,41,0.1)',
  overflow: 'hidden', marginBottom: '24px',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  animation: 'fadeUp 0.5s ease forwards', opacity: 0,
};
const cardHeader = {
  display: 'flex', alignItems: 'flex-start', gap: '16px',
  padding: '24px 24px 0',
};
const emojiCircle = {
  width: '52px', height: '52px', borderRadius: '14px',
  background: 'rgba(240,180,41,0.12)', border: '1px solid rgba(240,180,41,0.2)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '1.6rem', flexShrink: 0,
};
const giftName = {
  fontFamily: 'Playfair Display, serif', fontSize: '1.15rem',
  fontWeight: 700, color: '#f5f0ff', marginBottom: '4px',
};
const giftDesc = {
  fontSize: '0.85rem', color: '#9b8caa', lineHeight: 1.5,
};
const priceTag = {
  background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
  color: '#22c55e', padding: '4px 12px', borderRadius: '20px',
  fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap',
};
const whyBox = {
  margin: '16px 24px', padding: '12px 16px',
  background: 'rgba(240,180,41,0.06)', borderRadius: '12px',
  border: '1px solid rgba(240,180,41,0.1)',
};
const productsSection = { padding: '0 24px 24px' };
const productsTitle = {
  fontSize: '0.82rem', fontWeight: 600, color: '#9b8caa',
  marginBottom: '12px', display: 'flex', alignItems: 'center',
};
const productsGrid = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px',
};
const productCard = {
  borderRadius: '14px', border: '1px solid', overflow: 'hidden',
  transition: 'transform 0.2s',
};
const imgWrap = {
  background: '#fff', height: '130px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const imgStyle = { width: '100%', height: '100%', objectFit: 'contain', padding: '10px' };
const platformBadge = {
  padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700,
};
const lowestBadge = {
  background: 'rgba(34,197,94,0.15)', color: '#22c55e',
  padding: '2px 7px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 700,
};
const productName = {
  fontSize: '0.78rem', color: '#c4b8d4', lineHeight: 1.4,
  marginBottom: '8px', display: '-webkit-box',
  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
};
const buyBtn = {
  width: '100%', color: '#fff', border: 'none',
  padding: '8px', borderRadius: '8px', cursor: 'pointer',
  fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.78rem',
  transition: 'opacity 0.2s',
};
const noProductsBox = {
  padding: '0 24px 24px',
};
const manualBtn = {
  background: 'transparent', border: '1px solid',
  padding: '8px 16px', borderRadius: '10px', cursor: 'pointer',
  fontFamily: 'DM Sans', fontSize: '0.82rem', fontWeight: 600,
  transition: 'all 0.2s',
};
