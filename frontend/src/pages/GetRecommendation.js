import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function GetRecommendation({ setResult }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    Age: '', Gender: 'Male', Weight_kg: '', Height_cm: '', BMI: '',
    Disease_Type: 'None', Severity: 'Mild', Physical_Activity_Level: 'Moderate',
    Daily_Caloric_Intake: '', Cholesterol_mgdL: '', Blood_Pressure_mmHg: '',
    Glucose_mgdL: '', Dietary_Restrictions: 'None', Allergies: 'None',
    Preferred_Cuisine: 'Indian', Weekly_Exercise_Hours: '', Adherence_to_Diet_Plan: '',
    Dietary_Nutrient_Imbalance_Score: ''
  });

  const handle = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'Weight_kg' || name === 'Height_cm') {
        const w = parseFloat(updated.Weight_kg);
        const h = parseFloat(updated.Height_cm) / 100;
        if (w && h) updated.BMI = (w / (h * h)).toFixed(1);
      }
      return updated;
    });
  };

  const submit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        Age: Number(form.Age), Weight_kg: Number(form.Weight_kg),
        Height_cm: Number(form.Height_cm), BMI: Number(form.BMI),
        Daily_Caloric_Intake: Number(form.Daily_Caloric_Intake),
        Cholesterol_mgdL: Number(form.Cholesterol_mgdL),
        Blood_Pressure_mmHg: Number(form.Blood_Pressure_mmHg),
        Glucose_mgdL: Number(form.Glucose_mgdL),
        Weekly_Exercise_Hours: Number(form.Weekly_Exercise_Hours),
        Adherence_to_Diet_Plan: Number(form.Adherence_to_Diet_Plan),
        Dietary_Nutrient_Imbalance_Score: Number(form.Dietary_Nutrient_Imbalance_Score),
      };
      const res = await axios.post('/api/predict', payload);
      setResult(res.data);
      navigate('/results');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Something went wrong. Is the backend running?'));
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid var(--border)', background: 'var(--bg)',
    color: 'var(--text-primary)', fontSize: '14px', marginTop: '6px'
  };
  const labelStyle = { fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' };
  const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' };

  const steps = ['Basic Info', 'Lifestyle', 'Health', 'Goals', 'Confirm'];

  return (
    <div>
      <div className="page-header">
        <h1>Get Diet Recommendation</h1>
        <p>Tell us about yourself to get a personalized diet plan</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto 4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '14px',
              background: step > i + 1 ? 'var(--primary)' : step === i + 1 ? 'var(--primary)' : 'var(--border)',
              color: step >= i + 1 ? 'white' : 'var(--text-secondary)'
            }}>{step > i + 1 ? '✓' : i + 1}</div>
            <div style={{ fontSize: '11px', color: step === i + 1 ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: step === i + 1 ? '600' : '400' }}>{s}</div>
          </div>
        ))}
      </div>

      <div className="card">
        {/* Step 1 - Basic Info */}
        {step === 1 && (
          <div>
            <h2 style={{ marginBottom: '20px', fontSize: '17px' }}>Basic Information</h2>
            <div style={gridStyle}>
              <div><label style={labelStyle}>Age</label><input style={inputStyle} name="Age" value={form.Age} onChange={handle} placeholder="e.g. 25" type="number" /></div>
              <div><label style={labelStyle}>Gender</label>
                <select style={inputStyle} name="Gender" value={form.Gender} onChange={handle}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div><label style={labelStyle}>Weight (kg)</label><input style={inputStyle} name="Weight_kg" value={form.Weight_kg} onChange={handle} placeholder="e.g. 70" type="number" /></div>
              <div><label style={labelStyle}>Height (cm)</label><input style={inputStyle} name="Height_cm" value={form.Height_cm} onChange={handle} placeholder="e.g. 175" type="number" /></div>
            </div>
            <div style={{ background: 'var(--bg)', padding: '14px', borderRadius: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>BMI (auto-calculated): </span>
              <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '18px' }}>{form.BMI || '—'}</span>
            </div>
          </div>
        )}

        {/* Step 2 - Lifestyle */}
        {step === 2 && (
          <div>
            <h2 style={{ marginBottom: '20px', fontSize: '17px' }}>Lifestyle</h2>
            <div style={gridStyle}>
              <div><label style={labelStyle}>Activity Level</label>
                <select style={inputStyle} name="Physical_Activity_Level" value={form.Physical_Activity_Level} onChange={handle}>
                  <option>Sedentary</option><option>Light</option><option>Moderate</option><option>Active</option><option>Very Active</option>
                </select>
              </div>
              <div><label style={labelStyle}>Preferred Cuisine</label>
                <select style={inputStyle} name="Preferred_Cuisine" value={form.Preferred_Cuisine} onChange={handle}>
                  <option>Indian</option><option>Mediterranean</option><option>Western</option><option>Asian</option>
                </select>
              </div>
              <div><label style={labelStyle}>Weekly Exercise Hours</label><input style={inputStyle} name="Weekly_Exercise_Hours" value={form.Weekly_Exercise_Hours} onChange={handle} placeholder="e.g. 5" type="number" /></div>
              <div><label style={labelStyle}>Daily Caloric Intake</label><input style={inputStyle} name="Daily_Caloric_Intake" value={form.Daily_Caloric_Intake} onChange={handle} placeholder="e.g. 2000" type="number" /></div>
            </div>
          </div>
        )}

        {/* Step 3 - Health */}
        {step === 3 && (
          <div>
            <h2 style={{ marginBottom: '20px', fontSize: '17px' }}>Health Information</h2>
            <div style={gridStyle}>
              <div><label style={labelStyle}>Disease Type</label>
                <select style={inputStyle} name="Disease_Type" value={form.Disease_Type} onChange={handle}>
                  <option>None</option><option>Diabetes</option><option>Hypertension</option><option>Obesity</option><option>Heart Disease</option>
                </select>
              </div>
              <div><label style={labelStyle}>Severity</label>
                <select style={inputStyle} name="Severity" value={form.Severity} onChange={handle}>
                  <option>Mild</option><option>Moderate</option><option>Severe</option>
                </select>
              </div>
              <div><label style={labelStyle}>Cholesterol (mg/dL)</label><input style={inputStyle} name="Cholesterol_mgdL" value={form.Cholesterol_mgdL} onChange={handle} placeholder="e.g. 180" type="number" /></div>
              <div><label style={labelStyle}>Blood Pressure (mmHg)</label><input style={inputStyle} name="Blood_Pressure_mmHg" value={form.Blood_Pressure_mmHg} onChange={handle} placeholder="e.g. 120" type="number" /></div>
              <div><label style={labelStyle}>Glucose (mg/dL)</label><input style={inputStyle} name="Glucose_mgdL" value={form.Glucose_mgdL} onChange={handle} placeholder="e.g. 90" type="number" /></div>
            </div>
          </div>
        )}

        {/* Step 4 - Goals */}
        {step === 4 && (
          <div>
            <h2 style={{ marginBottom: '20px', fontSize: '17px' }}>Goals & Preferences</h2>
            <div style={gridStyle}>
              <div><label style={labelStyle}>Dietary Restrictions</label>
                <select style={inputStyle} name="Dietary_Restrictions" value={form.Dietary_Restrictions} onChange={handle}>
                  <option>None</option><option>Vegetarian</option><option>Vegan</option><option>Gluten-Free</option>
                </select>
              </div>
              <div><label style={labelStyle}>Allergies</label>
                <select style={inputStyle} name="Allergies" value={form.Allergies} onChange={handle}>
                  <option>None</option><option>Nuts</option><option>Dairy</option><option>Gluten</option><option>Seafood</option>
                </select>
              </div>
              <div><label style={labelStyle}>Adherence to Diet Plan (1-10)</label><input style={inputStyle} name="Adherence_to_Diet_Plan" value={form.Adherence_to_Diet_Plan} onChange={handle} placeholder="e.g. 7" type="number" min="1" max="10" /></div>
              <div><label style={labelStyle}>Nutrient Imbalance Score (1-10)</label><input style={inputStyle} name="Dietary_Nutrient_Imbalance_Score" value={form.Dietary_Nutrient_Imbalance_Score} onChange={handle} placeholder="e.g. 2" type="number" min="1" max="10" /></div>
            </div>
          </div>
        )}

        {/* Step 5 - Confirm */}
        {step === 5 && (
          <div>
            <h2 style={{ marginBottom: '20px', fontSize: '17px' }}>Confirm Your Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {Object.entries(form).map(([key, val]) => (
                <div key={key} style={{ background: 'var(--bg)', padding: '10px 14px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px' }}>{key.replace(/_/g, ' ')}</div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{val || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
          {step > 1 ? (
            <button className="btn-secondary" onClick={() => setStep(step - 1)}>← Back</button>
          ) : <div />}
          {step < 5 ? (
            <button className="btn-primary" onClick={() => setStep(step + 1)}>Next →</button>
          ) : (
            <button className="btn-primary" onClick={submit} disabled={loading}>
              {loading ? '⏳ Generating...' : '🥗 Get My Diet Plan'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default GetRecommendation;