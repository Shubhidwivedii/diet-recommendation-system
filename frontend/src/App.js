import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import GetRecommendation from './pages/GetRecommendation';
import History from './pages/History';
import Results from './pages/Results';

function App() {
  const [theme, setTheme] = useState('light');
  const [result, setResult] = useState(null);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <Router>
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <span className="logo-icon">🌿</span>
            <div>
              <div className="logo-title">DietSmart</div>
              <div className="logo-sub">AI Diet Recommendations</div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <NavLink to="/" end className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>🏠 Home</NavLink>
            <NavLink to="/recommend" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>🥗 Get Recommendation</NavLink>
            <NavLink to="/history" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>📋 History</NavLink>
          </nav>
          <div className="sidebar-bottom">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
            <div className="nav-item logout">🚪 Logout</div>
          </div>
        </aside>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recommend" element={<GetRecommendation setResult={setResult} />} />
            <Route path="/results" element={<Results result={result} />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;