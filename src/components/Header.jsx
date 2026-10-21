import React from 'react';
import { Sparkles, Terminal, Activity, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-lockup">
          <div className="brand-icon-wrapper">
            <div className="brand-glow"></div>
            <div className="brand-icon">
              <Terminal size={24} className="icon-main" />
              <Sparkles size={13} className="icon-sparkle" />
            </div>
          </div>
          <div className="brand-text">
            <div className="brand-title-row">
              <h1 className="brand-title">Interview Coach</h1>
              <span className="brand-pill">Pro v2.0</span>
            </div>
            <p className="brand-tagline">
              Master technical rounds for top tech companies with instant AI scoring, in-depth evaluation, and expert answers.
            </p>
          </div>
        </div>

        <div className="header-status-area">
          <div className="status-badge" title="Live connection configured to n8n webhook workflow">
            <span className="status-dot-pulse"></span>
            <span className="status-dot"></span>
            <Activity size={14} className="status-icon" />
            <span className="status-text">n8n Pipeline Ready</span>
          </div>

          <div className="company-quick-strip">
            <span className="strip-label"><Zap size={12} /> Target:</span>
            <span className="company-chip">TCS</span>
            <span className="company-chip">Infosys</span>
            <span className="company-chip">Wipro</span>
            <span className="company-chip">Accenture</span>
          </div>
        </div>
      </div>
    </header>
  );
}

