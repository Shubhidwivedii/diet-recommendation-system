import React from 'react';
import { useNavigate } from 'react-router-dom';

function Results({ result }) {
  const navigate = useNavigate();

  if (!result) {
    return (
      <div>
        <div className="page-header">
          <h1>Your Diet Recommendation</h1>
          <p>No results yet. Please fill the form first.</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🥗</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            You haven't generated a diet plan yet.
          </p>
          <button className="btn-primary" onClick={() => navigate('/recommend')}>
            Get Recommendation →
          </button>
        </div>
      </div>
    );
  }

  const days = Object.keys(result.weekly_plan);

  return (
    <div>
      <div className="page-header">
        <h1>Your Diet Recommendation 🎉</h1>
        <p>Based on your profile, here's your personalized diet plan</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Diet Type</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)' }}>{result.diet_type}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>AI Confidence</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)' }}>{result.confidence}%</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>📅 7-Day Meal Plan</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {days.map((day, i) => {
            const meals = result.weekly_plan[day];
            return (
              <div key={i} style={{ background: 'var(--bg)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '12px', fontSize: '15px' }}>
                  Day {i + 1}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {['breakfast', 'lunch', 'dinner'].map((meal) => (
                    <div key={meal} style={{ background: 'var(--card-bg)', borderRadius: '10px', padding: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'capitalize', marginBottom: '4px' }}>
                        {meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'} {meal}
                      </div>
                      <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {meals[meal]?.food_name || 'N/A'}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }}>
                        {meals[meal]?.calories || 0} kcal
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="btn-primary" onClick={() => navigate('/recommend')}>
          🔄 Get New Plan
        </button>
        <button className="btn-secondary" onClick={() => navigate('/history')}>
          📋 View History
        </button>
      </div>
    </div>
  );
}

export default Results;