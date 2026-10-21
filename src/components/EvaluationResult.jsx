import React, { useState } from 'react';
import {
  Award,
  CheckCircle,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  ListChecks,
  Building2,
  Tag,
  RotateCcw
} from 'lucide-react';
import ScoreGauge from './ScoreGauge';

export default function EvaluationResult({ evaluation, onReset }) {
  const [copied, setCopied] = useState(false);

  if (!evaluation) return null;

  // Extract fields defensively
  const company = evaluation.company || '';
  const topic = evaluation.topic || '';
  const score = evaluation.score !== undefined ? evaluation.score : 0;
  const feedback = evaluation.feedback || 'No feedback text provided by API.';
  const idealAnswer = evaluation.idealAnswer || evaluation.ideal_answer || '';
  
  // Normalize improvements into an array
  let improvementsList = [];
  if (Array.isArray(evaluation.improvements)) {
    improvementsList = evaluation.improvements;
  } else if (typeof evaluation.improvements === 'string' && evaluation.improvements.trim()) {
    improvementsList = evaluation.improvements
      .split(/\n+/)
      .map((item) => item.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter(Boolean);
  }

  const handleCopyIdealAnswer = async () => {
    if (!idealAnswer) return;
    try {
      await navigator.clipboard.writeText(idealAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <div className="evaluation-card">
      {/* Top result header with metadata & reset button */}
      <div className="eval-header">
        <div className="eval-header-left">
          <div className="eval-badge-group">
            <span className="eval-company-pill">
              <Building2 size={13} /> {company || 'Target Company'}
            </span>
            {topic && (
              <span className="eval-topic-pill">
                <Tag size={13} /> {topic}
              </span>
            )}
            <span className="eval-verified-pill">
              <Sparkles size={13} /> Verified by n8n
            </span>
          </div>
          <h2 className="eval-title">Interview Evaluation Report</h2>
        </div>

        {onReset && (
          <button
            type="button"
            className="eval-reset-btn"
            onClick={onReset}
            title="Clear and evaluate another response"
          >
            <RotateCcw size={14} /> New Evaluation
          </button>
        )}
      </div>

      {/* Main score overview grid */}
      <div className="eval-score-card">
        <ScoreGauge score={score} maxScore={10} />
        
        <div className="eval-score-summary">
          <div className="score-label-row">
            <h3 className="score-summary-title">Performance Assessment</h3>
            <span className="score-summary-tag">
              Score: <strong>{score} / 10</strong>
            </span>
          </div>

          <p className="score-summary-description">
            {score >= 8
              ? 'Outstanding performance. Your response demonstrates clear technical mastery, precise terminology, and strong architectural reasoning.'
              : score >= 6
              ? 'Competent answer. You grasp the fundamentals well, though expanding on trade-offs, internal mechanics, or edge cases will elevate your score.'
              : 'Developing response. Core concepts need deeper grounding and key nuances were omitted. Review the ideal answer below.'}
          </p>

          <div className="score-stats-row">
            <div className="score-mini-stat">
              <span className="stat-label">Improvements Identified</span>
              <span className="stat-value">{improvementsList.length}</span>
            </div>
            <div className="score-mini-stat">
              <span className="stat-label">Model Solution</span>
              <span className="stat-value">{idealAnswer ? 'Available' : 'Pending'}</span>
            </div>
            <div className="score-mini-stat">
              <span className="stat-label">API Evaluation</span>
              <span className="stat-value text-emerald">100% Real-time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Feedback Section */}
      <section className="eval-section feedback-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-icon-box blue">
              <Award size={18} />
            </span>
            <h3 className="section-heading">Detailed Feedback</h3>
          </div>
        </div>
        <div className="feedback-body">
          <p className="feedback-text">{feedback}</p>
        </div>
      </section>

      {/* Actionable Improvements List */}
      <section className="eval-section improvements-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-icon-box amber">
              <ListChecks size={18} />
            </span>
            <h3 className="section-heading">Key Improvements to Make</h3>
          </div>
          <span className="section-count-badge">
            {improvementsList.length} Action Items
          </span>
        </div>

        {improvementsList.length > 0 ? (
          <ul className="improvements-list">
            {improvementsList.map((item, index) => (
              <li key={index} className="improvement-item">
                <div className="improvement-indicator">
                  <span className="improvement-num">{index + 1}</span>
                </div>
                <div className="improvement-text-wrap">
                  <p className="improvement-text">{item}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-improvements-box">
            <CheckCircle size={18} className="text-emerald" />
            <span>No major deficiencies detected. Excellent clarity and precision!</span>
          </div>
        )}
      </section>

      {/* Ideal Answer Section */}
      {idealAnswer && (
        <section className="eval-section ideal-answer-section">
          <div className="section-header">
            <div className="section-title-wrap">
              <span className="section-icon-box cyan">
                <BookOpen size={18} />
              </span>
              <h3 className="section-heading">Ideal Model Answer</h3>
            </div>

            <button
              type="button"
              className={`copy-button ${copied ? 'copied' : ''}`}
              onClick={handleCopyIdealAnswer}
              title="Copy ideal answer to clipboard"
            >
              {copied ? (
                <>
                  <Check size={14} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy Answer
                </>
              )}
            </button>
          </div>

          <div className="ideal-answer-box">
            <div className="ideal-answer-callout">
              <Sparkles size={14} />
              <span>Recommended phrasing and technical coverage for senior panel interviews</span>
            </div>
            <pre className="ideal-answer-pre">
              <code>{idealAnswer}</code>
            </pre>
          </div>
        </section>
      )}
    </div>
  );
}
