import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #2d6a4f, #52b788)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>
            Eat Healthy, <br /><span style={{ color: '#d8f3dc' }}>Live Better 🌿</span>
          </h1>
          <p style={{ fontSize: '15px', opacity: 0.9, marginBottom: '24px', maxWidth: '400px' }}>
            Get personalized diet recommendations tailored to your goals, preferences and lifestyle.
          </p>
          <button className="btn-primary" style={{ background: 'white', color: '#2d6a4f' }} onClick={() => navigate('/recommend')}>
            Get Started →
          </button>
        </div>
        <div style={{ fontSize: '120px' }}>🥗</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { icon: '👤', title: 'Personalized', desc: 'Recommendations based on your profile and goals' },
          { icon: '🥦', title: 'Balanced Nutrition', desc: 'Well-balanced meals for a healthy lifestyle' },
          { icon: '🎯', title: 'Achieve Goals', desc: 'Support for weight loss, gain, or maintenance' },
          { icon: '📊', title: 'Track Progress', desc: 'View history and track your diet journey' },
        ].map((item, i) => (
          <div key={i} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>{item.icon}</div>
            <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '6px', color: 'var(--text-primary)' }}>{item.title}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Quick Stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Diet Types', value: '3', sub: 'Balanced, Low-Carb, Low-Sodium' },
            { label: 'Food Options', value: '146', sub: 'In our database' },
            { label: 'Meal Plan', value: '7 Days', sub: 'Personalized weekly plan' },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'var(--bg)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)' }}>{stat.value}</div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{stat.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;