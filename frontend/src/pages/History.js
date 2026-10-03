import React, { useState, useEffect } from 'react';
import axios from 'axios';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get('/api/predict/history')
      .then(res => {
        console.log("API Response:", res.data);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.data || res.data.predictions || [];

        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("History Error:", err);
        setHistory([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1>History</h1>
          <p>View your past diet recommendations</p>
        </div>

        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '48px'
          }}
        >
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>⏳</div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Loading history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>History</h1>
        <p>View your past diet recommendations</p>
      </div>

      {history.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '48px'
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
          <p style={{ color: 'var(--text-secondary)' }}>
            No history yet. Generate your first diet plan!
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {history.map((item, i) => (
            <div
              key={i}
              className="card"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelected(selected === i ? null : i)}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: '700',
                      fontSize: '16px',
                      color: 'var(--primary)',
                      marginBottom: '4px'
                    }}
                  >
                    {item.diet_type || "Diet"} Plan
                  </div>

                  <div
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    📅{" "}
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString(
                          'en-IN',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }
                        )
                      : 'N/A'}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        color: 'var(--primary)'
                      }}
                    >
                      {item.confidence || 0}%
                    </div>

                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      Confidence
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#e8f5ee',
                      color: '#2d6a4f',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    ✅ Completed
                  </div>

                  <div style={{ fontSize: '20px' }}>
                    {selected === i ? '▲' : '▼'}
                  </div>
                </div>
              </div>

              {selected === i && item.weekly_plan && (
                <div
                  style={{
                    marginTop: '20px',
                    borderTop: '1px solid var(--border)',
                    paddingTop: '20px'
                  }}
                >
                  <div
                    style={{
                      fontWeight: '700',
                      marginBottom: '12px'
                    }}
                  >
                    📅 7-Day Meal Plan
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    {Object.keys(item.weekly_plan).map((day, j) => {
                      const meals = item.weekly_plan[day];

                      return (
                        <div
                          key={j}
                          style={{
                            background: 'var(--bg)',
                            borderRadius: '10px',
                            padding: '12px'
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: 'var(--primary)',
                              marginBottom: '8px'
                            }}
                          >
                            Day {j + 1}
                          </div>

                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(3, 1fr)',
                              gap: '8px'
                            }}
                          >
                            {['breakfast', 'lunch', 'dinner'].map(meal => (
                              <div
                                key={meal}
                                style={{ fontSize: '13px' }}
                              >
                                <span
                                  style={{
                                    color: 'var(--text-secondary)',
                                    textTransform: 'capitalize'
                                  }}
                                >
                                  {meal === 'breakfast'
                                    ? '🌅'
                                    : meal === 'lunch'
                                    ? '☀️'
                                    : '🌙'}{' '}
                                  {meal}:
                                </span>

                                <br />

                                <span style={{ fontWeight: '600' }}>
                                  {meals?.[meal]?.food_name || 'N/A'}
                                </span>

                                <span
                                  style={{
                                    color: 'var(--primary)',
                                    marginLeft: '6px'
                                  }}
                                >
                                  {meals?.[meal]?.calories || 0} kcal
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;