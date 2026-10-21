import React from 'react';
import { Award, CheckCircle2, MessageSquareText, Lightbulb, Compass } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="empty-state-card">
      <div className="empty-state-header">
        <div className="empty-state-icon-box">
          <Award size={36} className="empty-icon" />
          <div className="empty-icon-glow"></div>
        </div>
        <h3 className="empty-title">Awaiting Your Answer</h3>
        <p className="empty-subtitle">
          Submit your response on the left or select a sample question to trigger real-time AI evaluation via the production n8n webhook.
        </p>
      </div>

      <div className="empty-features-grid">
        <div className="empty-feature-item">
          <div className="feature-icon-badge">
            <Award size={18} />
          </div>
          <div className="feature-info">
            <span className="feature-title">Objective Score out of 10</span>
            <span className="feature-desc">Calibrated against top company interview rubrics.</span>
          </div>
        </div>

        <div className="empty-feature-item">
          <div className="feature-icon-badge">
            <MessageSquareText size={18} />
          </div>
          <div className="feature-info">
            <span className="feature-title">Detailed Feedback</span>
            <span className="feature-desc">Identifies strengths, omissions, and conceptual depth.</span>
          </div>
        </div>

        <div className="empty-feature-item">
          <div className="feature-icon-badge">
            <Lightbulb size={18} />
          </div>
          <div className="feature-info">
            <span className="feature-title">Actionable Improvements</span>
            <span className="feature-desc">Specific keywords, caveats, and examples to mention.</span>
          </div>
        </div>

        <div className="empty-feature-item">
          <div className="feature-icon-badge">
            <CheckCircle2 size={18} />
          </div>
          <div className="feature-info">
            <span className="feature-title">Ideal Model Answer</span>
            <span className="feature-desc">Production-grade answers ready for revision & copy.</span>
          </div>
        </div>
      </div>

      <div className="empty-state-footer-tip">
        <Compass size={16} className="tip-icon" />
        <span>Tip: Complete all 4 fields on the left and click <strong>"Evaluate Answer"</strong>.</span>
      </div>
    </div>
  );
}
