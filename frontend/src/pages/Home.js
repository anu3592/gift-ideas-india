import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OCCASIONS = [
  '🎂 Birthday', '💍 Anniversary', '🎓 Graduation', '💝 Valentine\'s Day',
  '🎄 Christmas', '🪔 Diwali', '🎊 New Year', '👶 Baby Shower',
  '💒 Wedding', '🏠 Housewarming', '🙏 Thank You', '🌟 Just Because',
];

const RELATIONS = [
  '👩 Mom', '👨 Dad', '👫 Partner/Spouse', '👭 Best Friend',
  '👧 Sister', '👦 Brother', '👴 Grandfather', '👵 Grandmother',
  '👨‍💼 Boss/Colleague', '👶 Child', '🧑 Friend', '💑 Couple',
];

const INTERESTS = [
  'Reading 📚', 'Cooking 🍳', 'Gaming 🎮', 'Music 🎵',
  'Fitness 💪', 'Travel ✈️', 'Art & Craft 🎨', 'Gardening 🌱',
  'Fashion 👗', 'Tech & Gadgets 💻', 'Movies & TV 🎬', 'Sports ⚽',
  'Photography 📷', 'Yoga & Wellness 🧘', 'Coffee & Tea ☕', 'Pets 🐾',
];

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    recipient: '',
    relation: '',
    age: '',
    occasion: '',
    budget: '',
    genderHint: '',
    interests: [],
    customNote: '',
  });

  const toggleInterest = (interest) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : prev.interests.length < 6
          ? [...prev.interests, interest]
          : prev.interests,
    }));
  };

  const handleSubmit = async () => {
    if (!form.recipient || !form.occasion || !form.budget) {
      setError('Please fill in recipient name, occasion, and budget!');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('https://gift-tracker-o5eo.onrender.com/api/gifts', {
        ...form,
        budget: Number(form.budget),
        age: form.age ? Number(form.age) : null,
      });

      // Pass results to Results page via navigation state
      navigate('/results', { state: res.data });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again!');
    }
    setLoading(false);
  };

  return (
    <div style={pageStyle}>
      {/* Floating decorative emojis */}
      {['🎁', '✨', '🎀', '💝', '⭐', '🎊'].map((emoji, i) => (
        <div key={i} style={{
          position: 'fixed', fontSize: `${1.2 + (i % 3) * 0.4}rem`,
          opacity: 0.12, pointerEvents: 'none', zIndex: 0,
          top: `${10 + i * 14}%`,
          left: i % 2 === 0 ? `${3 + i}%` : 'auto',
          right: i % 2 !== 0 ? `${3 + i}%` : 'auto',
          animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
          animationDelay: `${i * 0.4}s`,
        }}>{emoji}</div>
      ))}

      <div style={formContainer}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={badgeStyle}>✨ Powered by AI</div>
          <h1 style={titleStyle}>Find the Perfect Gift</h1>
          <p style={subtitleStyle}>
            Tell us about the person — our AI will suggest thoughtful gifts<br />
            and find them across Amazon & Flipkart instantly!
          </p>
        </div>

        {/* Form */}
        <div style={formGrid}>

          {/* Recipient Name */}
          <div style={fieldGroup}>
            <label style={labelStyle}>Who is this gift for? *</label>
            <input
              style={inputStyle}
              placeholder="e.g. Mom, Rahul, My Best Friend..."
              value={form.recipient}
              onChange={e => setForm(prev => ({ ...prev, recipient: e.target.value }))}
            />
          </div>

          {/* Relation */}
          <div style={fieldGroup}>
            <label style={labelStyle}>Your relation with them *</label>
            <div style={pillGrid}>
              {RELATIONS.map(r => (
                <button key={r} style={{
                  ...pill,
                  ...(form.relation === r ? pillActive : {}),
                }}
                  onClick={() => setForm(prev => ({ ...prev, relation: r }))}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Age + Gender */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={fieldGroup}>
              <label style={labelStyle}>Their age (optional)</label>
              <input
                style={inputStyle} type="number" placeholder="e.g. 25"
                value={form.age}
                onChange={e => setForm(prev => ({ ...prev, age: e.target.value }))}
              />
            </div>
            <div style={fieldGroup}>
              <label style={labelStyle}>Gender (optional)</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Male', 'Female', 'Any'].map(g => (
                  <button key={g} style={{
                    ...pill,
                    ...(form.genderHint === g.toLowerCase() ? pillActive : {}),
                  }}
                    onClick={() => setForm(prev => ({ ...prev, genderHint: g.toLowerCase() }))}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Occasion */}
          <div style={fieldGroup}>
            <label style={labelStyle}>What's the occasion? *</label>
            <div style={pillGrid}>
              {OCCASIONS.map(o => (
                <button key={o} style={{
                  ...pill,
                  ...(form.occasion === o ? pillActive : {}),
                }}
                  onClick={() => setForm(prev => ({ ...prev, occasion: o }))}>
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div style={fieldGroup}>
            <label style={labelStyle}>
              Budget (₹) *
              <span style={{ color: '#9b8caa', fontWeight: 400, marginLeft: '8px' }}>
                {form.budget ? `₹${Number(form.budget).toLocaleString('en-IN')}` : ''}
              </span>
            </label>
            <input
              style={inputStyle} type="number" placeholder="e.g. 1500"
              value={form.budget}
              onChange={e => setForm(prev => ({ ...prev, budget: e.target.value }))}
            />
            {/* Budget quick select */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
              {[500, 1000, 2000, 5000, 10000, 25000].map(b => (
                <button key={b} style={{
                  ...pill, fontSize: '0.78rem',
                  ...(form.budget === String(b) ? pillActive : {}),
                }}
                  onClick={() => setForm(prev => ({ ...prev, budget: String(b) }))}>
                  ₹{b.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div style={fieldGroup}>
            <label style={labelStyle}>
              Their interests & hobbies
              <span style={{ color: '#9b8caa', fontWeight: 400, marginLeft: '8px' }}>
                (select up to 6)
              </span>
            </label>
            <div style={pillGrid}>
              {INTERESTS.map(interest => (
                <button key={interest} style={{
                  ...pill,
                  ...(form.interests.includes(interest) ? pillGold : {}),
                }}
                  onClick={() => toggleInterest(interest)}>
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Note */}
          <div style={fieldGroup}>
            <label style={labelStyle}>Any special note? (optional)</label>
            <textarea
              style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
              placeholder="e.g. She loves minimalist things, he is into dark colors, they recently moved to a new house..."
              value={form.customNote}
              onChange={e => setForm(prev => ({ ...prev, customNote: e.target.value }))}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={errorBox}>{error}</div>
        )}

        {/* Submit Button */}
        <button style={{ ...submitBtn, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit} disabled={loading}
          onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
              <span style={{ animation: 'sparkle 1s ease infinite' }}>✨</span>
              AI is finding perfect gifts...
              <span style={{ animation: 'sparkle 1s ease infinite', animationDelay: '0.3s' }}>✨</span>
            </span>
          ) : (
            '🎁 Find Perfect Gifts →'
          )}
        </button>

        {/* Trust badges */}
        <div style={trustRow}>
          {['🤖 AI-Powered', '📦 Amazon', '🛒 Flipkart', '💰 Best Prices'].map(t => (
            <span key={t} style={trustBadge}>{t}</span>
          ))}
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
const formContainer = {
  maxWidth: '760px', margin: '0 auto', padding: '0 24px',
};
const headerStyle = {
  textAlign: 'center', marginBottom: '48px', animation: 'fadeUp 0.5s ease',
};
const badgeStyle = {
  display: 'inline-block', background: 'rgba(240,180,41,0.15)',
  border: '1px solid rgba(240,180,41,0.3)', color: '#f0b429',
  padding: '6px 16px', borderRadius: '20px', fontSize: '0.82rem',
  fontWeight: 600, marginBottom: '16px', letterSpacing: '0.5px',
};
const titleStyle = {
  fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800,
  marginBottom: '12px', color: '#f5f0ff',
  textShadow: '0 0 60px rgba(240,180,41,0.2)',
};
const subtitleStyle = {
  fontSize: '1rem', color: '#9b8caa', lineHeight: 1.6,
};
const formGrid = {
  display: 'flex', flexDirection: 'column', gap: '28px',
  background: 'rgba(26,16,32,0.8)', borderRadius: '24px',
  padding: '36px', border: '1px solid rgba(240,180,41,0.1)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  marginBottom: '24px',
};
const fieldGroup = { display: 'flex', flexDirection: 'column', gap: '10px' };
const labelStyle = {
  fontSize: '0.88rem', fontWeight: 600, color: '#f5f0ff', letterSpacing: '0.3px',
};
const inputStyle = {
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(240,180,41,0.15)',
  borderRadius: '12px', padding: '12px 16px', color: '#f5f0ff',
  fontFamily: 'DM Sans', fontSize: '0.95rem', outline: 'none', width: '100%',
  transition: 'border-color 0.2s',
};
const pillGrid = { display: 'flex', flexWrap: 'wrap', gap: '8px' };
const pill = {
  background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
  color: '#9b8caa', padding: '7px 14px', borderRadius: '20px',
  cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'DM Sans',
  transition: 'all 0.2s', fontWeight: 500,
};
const pillActive = {
  background: 'rgba(255,107,157,0.15)',
  borderColor: 'rgba(255,107,157,0.5)', color: '#ff6b9d',
};
const pillGold = {
  background: 'rgba(240,180,41,0.15)',
  borderColor: 'rgba(240,180,41,0.4)', color: '#f0b429',
};
const errorBox = {
  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
  color: '#ef4444', padding: '12px 16px', borderRadius: '12px',
  fontSize: '0.9rem', marginBottom: '16px',
};
const submitBtn = {
  width: '100%', padding: '18px',
  background: 'linear-gradient(135deg, #f0b429 0%, #ff6b9d 100%)',
  color: '#0f0812', border: 'none', borderRadius: '14px',
  cursor: 'pointer', fontFamily: 'Playfair Display, serif',
  fontSize: '1.1rem', fontWeight: 700,
  transition: 'all 0.25s ease',
  boxShadow: '0 8px 32px rgba(240,180,41,0.3)',
  letterSpacing: '0.3px',
};
const trustRow = {
  display: 'flex', justifyContent: 'center', gap: '12px',
  flexWrap: 'wrap', marginTop: '20px',
};
const trustBadge = {
  fontSize: '0.8rem', color: '#9b8caa', padding: '6px 14px',
  borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)',
};
