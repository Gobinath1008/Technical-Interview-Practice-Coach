import React from 'react';

/**
 * ScoreGauge renders a circular radial progress gauge for scores out of 10.
 */
export default function ScoreGauge({ score = 0, maxScore = 10 }) {
  const numericScore = Number(score) || 0;
  const clampedScore = Math.min(Math.max(numericScore, 0), maxScore);
  const percentage = (clampedScore / maxScore) * 100;

  // Circular gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine score color scheme & tier
  let color = '#38bdf8'; // electric cyan default
  let badgeText = 'Good';
  let badgeClass = 'badge-good';

  if (clampedScore >= 8.5) {
    color = '#10b981'; // emerald
    badgeText = 'Exceptional';
    badgeClass = 'badge-exceptional';
  } else if (clampedScore >= 7) {
    color = '#38bdf8'; // electric cyan
    badgeText = 'Strong';
    badgeClass = 'badge-strong';
  } else if (clampedScore >= 5) {
    color = '#f59e0b'; // amber
    badgeText = 'Moderate';
    badgeClass = 'badge-moderate';
  } else {
    color = '#f43f5e'; // rose
    badgeText = 'Needs Work';
    badgeClass = 'badge-needs-work';
  }

  return (
    <div className="score-gauge-container">
      <div className="gauge-circle-wrapper">
        <svg className="gauge-svg" width="140" height="140" viewBox="0 0 140 140">
          {/* Background track */}
          <circle
            className="gauge-bg"
            cx="70"
            cy="70"
            r={radius}
            strokeWidth="10"
            fill="transparent"
          />
          {/* Glowing animated progress track */}
          <circle
            className="gauge-progress"
            cx="70"
            cy="70"
            r={radius}
            strokeWidth="10"
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            transform="rotate(-90 70 70)"
            style={{
              filter: `drop-shadow(0 0 8px ${color}88)`,
              transition: 'stroke-dashoffset 1s ease-in-out',
            }}
          />
        </svg>

        <div className="gauge-center-content">
          <div className="gauge-score-value">
            <span className="current-score">{clampedScore}</span>
            <span className="max-score">/{maxScore}</span>
          </div>
          <span className="gauge-label">Score</span>
        </div>
      </div>

      <div className="gauge-meta">
        <span className={`gauge-badge ${badgeClass}`}>{badgeText}</span>
        <span className="gauge-percentage">{Math.round(percentage)}% Quality Match</span>
      </div>
    </div>
  );
}

