import React, { useState } from 'react';
import { Sparkles, Terminal, Activity, HelpCircle, MessagesSquare, FileEdit } from 'lucide-react';
import N8nSetupGuideModal from './N8nSetupGuideModal';

export default function Header({ activeMode, onSelectMode }) {
  const [showGuide, setShowGuide] = useState(false);

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
              <span className="brand-pill">Conversational AI</span>
            </div>
            <p className="brand-tagline">
              Adaptive technical mock interviews & real-time n8n AI answer evaluation.
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="header-nav-modes">
          <button
            type="button"
            className={`mode-tab-btn ${activeMode === 'conversational' ? 'active' : ''}`}
            onClick={() => onSelectMode('conversational')}
          >
            <MessagesSquare size={15} />
            <span>Mock Interview</span>
          </button>

          <button
            type="button"
            className={`mode-tab-btn ${activeMode === 'single_eval' ? 'active' : ''}`}
            onClick={() => onSelectMode('single_eval')}
          >
            <FileEdit size={15} />
            <span>Single Evaluator</span>
          </button>
        </div>

        <div className="header-status-area">
          <button
            type="button"
            className="n8n-guide-btn"
            onClick={() => setShowGuide(true)}
            title="View n8n workflow configuration guide"
          >
            <HelpCircle size={14} className="text-cyan" />
            <span>n8n Setup Guide</span>
          </button>

          <div className="status-badge" title="Live connection configured to n8n webhook workflow">
            <span className="status-dot-pulse"></span>
            <span className="status-dot"></span>
            <Activity size={14} className="status-icon" />
            <span className="status-text">n8n Connected</span>
          </div>
        </div>
      </div>

      <N8nSetupGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </header>
  );
}
