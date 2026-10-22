import React, { useState } from 'react';
import {
  Building2,
  Briefcase,
  Layers,
  Sparkles,
  Play,
  CheckCircle2,
  Sliders,
  HelpCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';
import {
  COMPANY_OPTIONS,
  ROLE_OPTIONS,
  TOPIC_OPTIONS,
  DIFFICULTY_OPTIONS,
  QUESTION_COUNT_OPTIONS
} from '../constants';

export default function InterviewSetup({ onStartInterview, isLoading }) {
  const [company, setCompany] = useState('TCS');
  const [customCompany, setCustomCompany] = useState('');
  const [role, setRole] = useState(ROLE_OPTIONS[0]);
  const [customRole, setCustomRole] = useState('');
  const [topic, setTopic] = useState('Core Java');
  const [customTopic, setCustomTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [validationError, setValidationError] = useState('');

  const handleStart = (e) => {
    e.preventDefault();

    const finalCompany = company === 'Other' ? customCompany.trim() : company;
    if (!finalCompany) {
      setValidationError('Please select or specify a target company.');
      return;
    }

    const finalRole = role === 'Other Role' ? customRole.trim() : role;
    if (!finalRole) {
      setValidationError('Please select or specify a target job role.');
      return;
    }

    const finalTopic = topic === 'Other' ? customTopic.trim() : topic;
    if (!finalTopic) {
      setValidationError('Please select or specify an interview topic.');
      return;
    }

    setValidationError('');
    onStartInterview({
      company: finalCompany,
      role: finalRole,
      topic: finalTopic,
      difficulty,
      questionCount: Number(questionCount),
    });
  };

  return (
    <div className="interview-setup-container">
      <div className="setup-hero-banner">
        <div className="setup-hero-text">
          <div className="setup-badge">
            <Sparkles size={14} className="sparkle-icon" />
            <span>AI Mock Interview Simulator</span>
          </div>
          <h2 className="setup-heading">Configure Your Technical Mock Interview</h2>
          <p className="setup-subheading">
            Our AI interviewer adapts to your target company, role, and difficulty level. Questions are asked one by one with live scoring and model answers.
          </p>
        </div>

        <div className="setup-quick-highlights">
          <div className="highlight-item">
            <CheckCircle2 size={16} className="text-emerald" />
            <span>AI asks questions automatically</span>
          </div>
          <div className="highlight-item">
            <CheckCircle2 size={16} className="text-emerald" />
            <span>Real-time scoring out of 10</span>
          </div>
          <div className="highlight-item">
            <CheckCircle2 size={16} className="text-emerald" />
            <span>Comprehensive summary at end</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleStart} className="setup-form-card">
        {validationError && (
          <div className="setup-error-banner">
            <HelpCircle size={16} />
            <span>{validationError}</span>
          </div>
        )}

        <div className="setup-grid">
          {/* Company Selection */}
          <div className="setup-field-group">
            <label className="setup-label">
              <Building2 size={16} className="label-icon" />
              Target Company <span className="req-star">*</span>
            </label>
            <div className="setup-select-wrap">
              <select
                className="setup-select"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              >
                {COMPANY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {company === 'Other' && (
              <input
                type="text"
                placeholder="Enter company name (e.g. Google, Amazon)..."
                className="setup-input mt-2"
                value={customCompany}
                onChange={(e) => setCustomCompany(e.target.value)}
              />
            )}
          </div>

          {/* Job Role Selection */}
          <div className="setup-field-group">
            <label className="setup-label">
              <Briefcase size={16} className="label-icon" />
              Job Role / Profile <span className="req-star">*</span>
            </label>
            <div className="setup-select-wrap">
              <select
                className="setup-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            {role === 'Other Role' && (
              <input
                type="text"
                placeholder="Enter job role (e.g. Mobile Developer)..."
                className="setup-input mt-2"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
              />
            )}
          </div>

          {/* Interview Topic */}
          <div className="setup-field-group">
            <label className="setup-label">
              <Layers size={16} className="label-icon" />
              Technical Domain / Topic <span className="req-star">*</span>
            </label>
            <div className="setup-select-wrap">
              <select
                className="setup-select"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {TOPIC_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
                <option value="Other">Other Specific Topic...</option>
              </select>
            </div>
            {topic === 'Other' && (
              <input
                type="text"
                placeholder="Enter specific topic (e.g. Golang, GraphQL)..."
                className="setup-input mt-2"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
              />
            )}
          </div>

          {/* Question Count */}
          <div className="setup-field-group">
            <label className="setup-label">
              <Sliders size={16} className="label-icon" />
              Number of Questions
            </label>
            <div className="count-pill-group">
              {QUESTION_COUNT_OPTIONS.map((count) => (
                <button
                  key={count}
                  type="button"
                  className={`count-pill ${questionCount === count ? 'active' : ''}`}
                  onClick={() => setQuestionCount(count)}
                >
                  <span className="count-num">{count}</span>
                  <span className="count-text">Questions</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Difficulty Selector Cards */}
        <div className="difficulty-section">
          <label className="setup-label">
            <Zap size={16} className="label-icon" />
            Interview Difficulty Level
          </label>
          <div className="difficulty-cards-grid">
            {DIFFICULTY_OPTIONS.map((diff) => (
              <button
                key={diff.id}
                type="button"
                className={`difficulty-card ${diff.badgeClass} ${
                  difficulty === diff.id ? 'selected' : ''
                }`}
                onClick={() => setDifficulty(diff.id)}
              >
                <div className="diff-card-top">
                  <span className="diff-name">{diff.label}</span>
                  {difficulty === diff.id && (
                    <CheckCircle2 size={16} className="diff-check-icon" />
                  )}
                </div>
                <p className="diff-desc">{diff.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Start Interview Action */}
        <div className="setup-action-footer">
          <div className="setup-summary-chip">
            <ShieldCheck size={16} className="text-cyan" />
            <span>
              Target: <strong>{company === 'Other' ? customCompany || 'Custom' : company}</strong> •{' '}
              <strong>{role === 'Other Role' ? customRole || 'Role' : role}</strong> •{' '}
              <strong>{topic === 'Other' ? customTopic || 'Topic' : topic}</strong> •{' '}
              <strong>{difficulty}</strong> ({questionCount} Questions)
            </span>
          </div>

          <button
            type="submit"
            className="start-interview-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner"></span>
                <span>Starting Session...</span>
              </>
            ) : (
              <>
                <Play size={18} className="start-btn-icon" />
                <span>Start Mock Interview</span>
                <Sparkles size={16} className="start-btn-sparkle" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

