import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Brain, ShieldCheck } from 'lucide-react';

const EVALUATION_STEPS = [
  'Dispatching payload to n8n webhook workflow...',
  'Evaluating technical depth against industry benchmarks...',
  'Checking accuracy, completeness, and edge cases...',
  'Computing objective score out of 10...',
  'Synthesizing actionable improvement points...',
  'Drafting ideal candidate answer...',
];

export default function LoadingIndicator({ company, topic }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % EVALUATION_STEPS.length);
    }, 2400);

    return () => {
      clearInterval(timerInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="loading-card">
      <div className="loading-glow"></div>
      
      <div className="loading-spinner-wrapper">
        <div className="loading-pulse-ring"></div>
        <div className="loading-pulse-ring-outer"></div>
        <Loader2 className="loading-spinner-icon" size={48} />
        <Brain className="loading-center-brain" size={22} />
      </div>

      <div className="loading-content">
        <div className="loading-badge">
          <Sparkles size={14} className="sparkle-spin" />
          <span>AI Coach Analyzing</span>
        </div>

        <h3 className="loading-heading">
          Evaluating your {company || 'technical'} {topic ? `(${topic})` : ''} answer...
        </h3>

        <p className="loading-step-text">
          {EVALUATION_STEPS[currentStepIndex]}
        </p>

        <div className="loading-progress-bar-track">
          <div className="loading-progress-bar-fill"></div>
        </div>

        <div className="loading-footer-meta">
          <span className="elapsed-counter">
            Elapsed time: <strong>{secondsElapsed}s</strong>
          </span>
          <span className="pipeline-notice">
            <ShieldCheck size={14} /> Production n8n Cloud Workflow
          </span>
        </div>
      </div>
    </div>
  );
}
