import React, { useState } from 'react';
import {
  Trophy,
  Award,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  Building2,
  Briefcase,
  Layers,
  Zap,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ListChecks,
  Copy,
  Check
} from 'lucide-react';
import ScoreGauge from './ScoreGauge';

export default function InterviewSummary({
  sessionConfig,
  completedQuestions,
  onRestartInterview,
  onRetakeInterview,
}) {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [copiedId, setCopiedId] = useState(null);

  const totalQuestions = completedQuestions.length || sessionConfig.questionCount || 1;
  const totalScore = completedQuestions.reduce(
    (sum, q) => sum + (Number(q.evaluation?.score) || 0),
    0
  );
  const averageScore = Number((totalScore / totalQuestions).toFixed(1));
  const maxPossibleScore = totalQuestions * 10;
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);

  // Performance Tier
  let performanceTier = 'Strong Candidate';
  let tierDesc = 'You demonstrated solid conceptual understanding across most interview questions.';
  let tierClass = 'tier-strong';

  if (averageScore >= 8.5) {
    performanceTier = 'Interview Ready (Offer Bar)';
    tierDesc = 'Exceptional performance. Your responses reflect senior engineering depth, clean trade-off articulation, and strong architectural reasoning.';
    tierClass = 'tier-exceptional';
  } else if (averageScore >= 7.0) {
    performanceTier = 'Strong Performer';
    tierDesc = 'You have a solid technical foundation. A few refinements on low-level mechanics or edge cases will push you into top percentiles.';
    tierClass = 'tier-strong';
  } else if (averageScore >= 5.0) {
    performanceTier = 'Developing Competency';
    tierDesc = 'You understand high-level concepts, but missed key technical specifics, edge cases, and modern standard practices.';
    tierClass = 'tier-moderate';
  } else {
    performanceTier = 'Needs Core Revision';
    tierDesc = 'Significant gaps were identified in fundamental mechanisms. Review the ideal model answers below to strengthen your foundation.';
    tierClass = 'tier-needs-work';
  }

  // Aggregate all improvement points
  const allImprovements = completedQuestions.flatMap((q) => q.evaluation?.improvements || []);
  const topImprovements = allImprovements.slice(0, 6);

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const handleCopyIdeal = async (id, text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="interview-summary-container">
      {/* Summary Hero Header */}
      <div className="summary-hero-card">
        <div className="summary-hero-top">
          <div className="summary-trophy-wrap">
            <Trophy size={36} className="trophy-icon" />
          </div>

          <div className="summary-title-wrap">
            <div className="summary-badge-strip">
              <span className="summary-pill"><Building2 size={12} /> {sessionConfig.company}</span>
              <span className="summary-pill"><Briefcase size={12} /> {sessionConfig.role}</span>
              <span className="summary-pill"><Layers size={12} /> {sessionConfig.topic}</span>
              <span className="summary-pill"><Zap size={12} /> {sessionConfig.difficulty}</span>
            </div>
            <h2 className="summary-title">Technical Mock Interview Report</h2>
            <p className="summary-subtitle">
              Session completed: {totalQuestions} questions evaluated against top-tier tech interview standards.
            </p>
          </div>

          <div className="summary-actions-top">
            <button
              type="button"
              className="summary-retake-btn"
              onClick={onRetakeInterview}
              title="Retake interview with same parameters"
            >
              <RefreshCw size={14} /> Retake
            </button>
            <button
              type="button"
              className="summary-restart-btn"
              onClick={onRestartInterview}
              title="Configure a new interview"
            >
              <RotateCcw size={14} /> New Interview
            </button>
          </div>
        </div>

        {/* Big Score Overview Grid */}
        <div className="summary-score-dashboard">
          <div className="dashboard-gauge-box">
            <ScoreGauge score={averageScore} maxScore={10} />
            <span className="gauge-sub">Average Score per Question</span>
          </div>

          <div className="dashboard-metrics-box">
            <div className={`performance-tier-badge ${tierClass}`}>
              <Award size={16} />
              <span>{performanceTier}</span>
            </div>
            <p className="tier-description-text">{tierDesc}</p>

            <div className="metrics-stat-grid">
              <div className="metric-box">
                <span className="m-label">Total Score</span>
                <span className="m-val text-cyan">
                  {totalScore} <small>/ {maxPossibleScore}</small>
                </span>
              </div>
              <div className="metric-box">
                <span className="m-label">Accuracy Rate</span>
                <span className="m-val text-emerald">{percentage}%</span>
              </div>
              <div className="metric-box">
                <span className="m-label">Questions Answered</span>
                <span className="m-val">{totalQuestions} / {totalQuestions}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Strengths & Focus Areas */}
      <div className="summary-insights-grid">
        <div className="insight-card strengths">
          <div className="insight-head">
            <CheckCircle2 size={18} className="text-emerald" />
            <h3>Key Interview Strengths</h3>
          </div>
          <ul className="insight-list">
            <li>Successfully completed {totalQuestions} technical questions under time and depth evaluation.</li>
            <li>Demonstrated structured thinking across {sessionConfig.topic} core principles.</li>
            <li>Showcased consistent terminology aligned with {sessionConfig.company} expectations.</li>
          </ul>
        </div>

        <div className="insight-card areas-to-grow">
          <div className="insight-head">
            <TrendingUp size={18} className="text-amber" />
            <h3>Top Actionable Areas to Strengthen</h3>
          </div>
          {topImprovements.length > 0 ? (
            <ul className="insight-list">
              {topImprovements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="no-areas-text">
              No critical flaws detected! Continue maintaining this high level of precision.
            </p>
          )}
        </div>
      </div>

      {/* Detailed Question-by-Question Breakdown */}
      <div className="summary-breakdown-section">
        <div className="breakdown-header">
          <h3 className="breakdown-title">Question-by-Question Transcript & AI Evaluation</h3>
          <span className="breakdown-count">
            {completedQuestions.length} Questions Reviewed
          </span>
        </div>

        <div className="breakdown-accordion-list">
          {completedQuestions.map((item, index) => {
            const isExpanded = expandedIndex === index;
            const itemScore = item.evaluation?.score ?? 0;

            return (
              <div
                key={index}
                className={`breakdown-accordion-card ${isExpanded ? 'expanded' : ''}`}
              >
                <div
                  className="accordion-header"
                  onClick={() => toggleExpand(index)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="accordion-header-left">
                    <span className="q-index-pill">Q{item.questionNumber}</span>
                    <h4 className="accordion-q-title">{item.question}</h4>
                  </div>

                  <div className="accordion-header-right">
                    <span
                      className={`accordion-score-pill ${
                        itemScore >= 8
                          ? 'score-high'
                          : itemScore >= 6
                          ? 'score-med'
                          : 'score-low'
                      }`}
                    >
                      {itemScore} / 10
                    </span>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="accordion-content-body">
                    {/* Candidate Answer */}
                    <div className="acc-section candidate-section">
                      <div className="acc-section-label">Your Submitted Answer:</div>
                      <p className="acc-answer-text">{item.candidateAnswer}</p>
                    </div>

                    {/* AI Feedback */}
                    <div className="acc-section feedback-section">
                      <div className="acc-section-label">AI Coach Feedback:</div>
                      <p className="acc-feedback-text">{item.evaluation?.feedback}</p>
                    </div>

                    {/* Improvements */}
                    {item.evaluation?.improvements && item.evaluation.improvements.length > 0 && (
                      <div className="acc-section improvements-section">
                        <div className="acc-section-label">
                          <ListChecks size={15} className="text-amber" /> Suggested Improvements:
                        </div>
                        <ul className="acc-improvements-list">
                          {item.evaluation.improvements.map((imp, impIdx) => (
                            <li key={impIdx}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Ideal Model Answer */}
                    {item.evaluation?.idealAnswer && (
                      <div className="acc-section ideal-section">
                        <div className="ideal-head-row">
                          <div className="acc-section-label">
                            <BookOpen size={15} className="text-cyan" /> Ideal Model Solution:
                          </div>
                          <button
                            type="button"
                            className="copy-btn-tiny"
                            onClick={() => handleCopyIdeal(index, item.evaluation.idealAnswer)}
                          >
                            {copiedId === index ? (
                              <>
                                <Check size={12} /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={12} /> Copy
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="acc-ideal-pre">
                          <code>{item.evaluation.idealAnswer}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Footer for Action */}
      <div className="summary-bottom-actions">
        <button
          type="button"
          className="btn-restart-large"
          onClick={onRestartInterview}
        >
          <RotateCcw size={16} />
          <span>Configure Another Mock Interview</span>
        </button>

        <button
          type="button"
          className="btn-retake-large"
          onClick={onRetakeInterview}
        >
          <RefreshCw size={16} />
          <span>Retake Same Interview ({sessionConfig.topic})</span>
        </button>
      </div>
    </div>
  );
}

