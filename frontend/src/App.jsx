import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [serverStatus, setServerStatus] = useState('Checking...')

  useEffect(() => {
    // Check backend server health
    fetch('http://localhost:3000/api/health')
      .then(res => res.json())
      .then(data => setServerStatus(data.message))
      .catch(() => setServerStatus('Server offline'))
  }, [])

  return (
    <div className="app">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">HSC Power</span>
            </h1>
            <p className="hero-subtitle">
              Empowering Your Academic Journey with Smart Technology
            </p>
            <p className="hero-description">
              A comprehensive platform designed for HSC students to excel in their studies
              with intelligent tools, resources, and collaborative learning.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary">Get Started</button>
              <button className="btn btn-secondary">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Study Resources</h3>
              <p>Access comprehensive study materials, practice questions, and past papers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Progress Tracking</h3>
              <p>Monitor your learning progress with detailed analytics and insights.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Collaborative Learning</h3>
              <p>Connect with peers, join study groups, and share knowledge.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Support</h3>
              <p>Get personalized recommendations and instant answers to your questions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Performance Analytics</h3>
              <p>Detailed insights into your strengths and areas for improvement.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Efficient</h3>
              <p>Built with modern technology for a seamless user experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="status">
        <div className="container">
          <div className="status-card">
            <h3>System Status</h3>
            <div className="status-indicator">
              <span className={`status-dot ${serverStatus.includes('running') ? 'online' : 'offline'}`}></span>
              <span className="status-text">{serverStatus}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 HSC Power - ELEC5620 Group 83. All rights reserved.</p>
          <p className="tech-stack">Built with React, Vite & Express.js</p>
        </div>
      </footer>
    </div>
  )
}

export default App

