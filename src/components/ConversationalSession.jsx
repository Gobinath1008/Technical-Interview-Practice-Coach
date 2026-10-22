import React, { useState } from 'react';
import {
  Brain,
  Send,
  ArrowRight,
  Sparkles,
  Building2,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
  History,
  AlertCircle,
  Copy,
  Check,
  CheckCircle,
  Award,
  BookOpen,
  ListChecks,
  RotateCcw
} from 'lucide-react';
import ScoreGauge from './ScoreGauge';

export default function ConversationalSession({
  sessionConfig,
  currentQuestionNumber,
  totalQuestions,
  currentQuestion,
  isGeneratingQuestion,
  isEvaluating,
  lastEvaluation,
  previousQA,
  onSubmitAnswer,
  onNextQuestion,
  onFinishInterview,
  onAbortInterview,
}) {
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [answerError, setAnswerError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [copiedIdeal, setCopiedIdeal] = useState(false);

  // Compute progress percentage
  const progressPercent = Math.round(
    ((currentQuestionNumber - 1) / totalQuestions) * 100
  );
  const isLastQuestion = currentQuestionNumber === totalQuestions;
  const hasEvaluatedCurrent = Boolean(lastEvaluation);

  // Word and character counts
  const wordCount = candidateAnswer.trim().split(/\s+/).filter(Boolean).length;
  const charCount = candidateAnswer.length;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!candidateAnswer || !candidateAnswer.trim()) {
      setAnswerError('Please type your answer before submitting.');
      return;
    }

    if (candidateAnswer.trim().length < 15) {
      setAnswerError('Your answer should be at least 15 characters to receive a meaningful technical evaluation.');
      return;
    }

    setAnswerError('');
    onSubmitAnswer(candidateAnswer.trim());
  };

  const handleNext = () => {
    setCandidateAnswer('');
    setAnswerError('');
    if (isLastQuestion) {
      onFinishInterview();
    } else {
      onNextQuestion();
    }
  };

  const handleCopyIdealAnswer = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdeal(true);
      setTimeout(() => setCopiedIdeal(false), 2200);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="conversational-session-container">
      {/* Session Progress Header */}
      <div className="session-progress-header">
        <div className="session-meta-top">
          <div className="session-pill-strip">
            <span className="session-meta-pill company-pill">
              <Building2 size={13} /> {sessionConfig.company}
            </span>
            <span className="session-meta-pill role-pill">
              <Briefcase size={13} /> {sessionConfig.role}
            </span>
            <span className="session-meta-pill topic-pill">
              <Layers size={13} /> {sessionConfig.topic}
            </span>
            <span className={`session-meta-pill diff-pill ${sessionConfig.difficulty.toLowerCase()}`}>
              {sessionConfig.difficulty}
            </span>
          </div>

          <button
            type="button"
            className="session-abort-btn"
            onClick={onAbortInterview}
            title="Exit interview and return to setup"
          >
            <RotateCcw size={13} /> Exit Interview
          </button>
        </div>

        {/* Progress Bar & Status */}
        <div className="session-progress-row">
          <div className="progress-label-wrap">
            <span className="question-counter-label">
              Question <strong>{currentQuestionNumber}</strong> of <strong>{totalQuestions}</strong>
            </span>
            <span className="progress-percentage-label">
              {progressPercent}% Completed
            </span>
          </div>
          <div className="session-progress-track">
            <div
              className="session-progress-fill"
              style={{
                width: `${hasEvaluatedCurrent ? Math.round((currentQuestionNumber / totalQuestions) * 100) : progressPercent}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Interview Stage */}
      <div className="session-stage-grid">
        {/* Left Side: Current Question & Candidate Response Input */}
        <div className="stage-input-column">
          {/* AI Interviewer Question Card */}
          <div className="interviewer-question-card">
            <div className="question-card-top">
              <div className="interviewer-avatar-wrap">
                <div className="interviewer-avatar">
                  <Brain size={22} className="avatar-brain" />
                </div>
                <div className="interviewer-badge-text">
                  <span className="interviewer-title">AI Technical Interviewer</span>
                  <span className="interviewer-subtitle">
                    {sessionConfig.company} • {sessionConfig.role} Panel
                  </span>
                </div>
              </div>

              <span className="q-tag">
                Q{currentQuestionNumber}
              </span>
            </div>

            <div className="question-body">
              {isGeneratingQuestion ? (
                <div className="question-generating-state">
                  <span className="q-spinner"></span>
                  <span className="generating-text">
                    Formulating Question {currentQuestionNumber} tailored to {sessionConfig.topic} ({sessionConfig.difficulty})...
                  </span>
                </div>
              ) : (
                <p className="interviewer-question-text">
                  {currentQuestion || 'Loading interview question...'}
                </p>
              )}
            </div>
          </div>

          {/* Candidate Answer Form */}
          <div className="candidate-answer-card">
            <div className="answer-card-header">
              <span className="answer-label">Your Technical Answer</span>
              <span className="answer-stats">
                {wordCount} words • {charCount} chars
              </span>
            </div>

            {!hasEvaluatedCurrent ? (
              <form onSubmit={handleSubmit} className="answer-form">
                <textarea
                  className={`candidate-textarea ${answerError ? 'has-error' : ''}`}
                  rows={8}
                  placeholder="Type your explanation as you would explain to the senior interviewer. Include key concepts, trade-offs, internal implementation details, and practical examples..."
                  value={candidateAnswer}
                  onChange={(e) => {
                    setCandidateAnswer(e.target.value);
                    if (answerError) setAnswerError('');
                  }}
                  disabled={isEvaluating || isGeneratingQuestion}
                />

                {answerError && (
                  <p className="answer-error-msg">
                    <AlertCircle size={14} /> {answerError}
                  </p>
                )}

                <div className="answer-actions-bar">
                  <button
                    type="submit"
                    className="submit-answer-btn"
                    disabled={isEvaluating || isGeneratingQuestion || !candidateAnswer.trim()}
                  >
                    {isEvaluating ? (
                      <>
                        <span className="btn-spinner"></span>
                        <span>Evaluating with n8n AI...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Answer for Evaluation</span>
                        <Sparkles size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="submitted-answer-preview">
                <div className="preview-label">Your Submitted Answer:</div>
                <p className="preview-text">{lastEvaluation.candidateAnswer}</p>

                <div className="next-action-row">
                  <button
                    type="button"
                    className="next-question-btn"
                    onClick={handleNext}
                  >
                    <span>
                      {isLastQuestion ? 'Complete Interview & View Summary' : 'Proceed to Next Question'}
                    </span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Evaluation Feedback of current question */}
        <div className="stage-feedback-column">
          {hasEvaluatedCurrent ? (
            <div className="current-evaluation-card">
              <div className="eval-card-header">
                <div className="eval-title-wrap">
                  <Award size={18} className="text-cyan" />
                  <h3 className="eval-heading">Question {currentQuestionNumber} Assessment</h3>
                </div>
                <span className="n8n-badge">
                  <Sparkles size={12} /> Live n8n Output
                </span>
              </div>

              {/* Score Display */}
              <div className="eval-score-banner">
                <ScoreGauge score={lastEvaluation.score} maxScore={10} />
                <div className="eval-quick-critique">
                  <h4 className="critique-title">Evaluation Summary</h4>
                  <p className="critique-text">{lastEvaluation.feedback}</p>
                </div>
              </div>

              {/* Improvements */}
              {lastEvaluation.improvements && lastEvaluation.improvements.length > 0 && (
                <div className="eval-section-mini">
                  <div className="section-mini-head">
                    <ListChecks size={16} className="text-amber" />
                    <span>Areas for Improvement</span>
                  </div>
                  <ul className="improvements-list-mini">
                    {lastEvaluation.improvements.map((imp, idx) => (
                      <li key={idx} className="imp-item-mini">
                        <span className="imp-num">{idx + 1}</span>
                        <span className="imp-text">{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ideal Answer */}
              {lastEvaluation.idealAnswer && (
                <div className="eval-section-mini ideal-section-mini">
                  <div className="section-mini-head space-between">
                    <div className="flex-head">
                      <BookOpen size={16} className="text-cyan" />
                      <span>Ideal Model Answer</span>
                    </div>
                    <button
                      type="button"
                      className={`copy-btn-mini ${copiedIdeal ? 'copied' : ''}`}
                      onClick={() => handleCopyIdealAnswer(lastEvaluation.idealAnswer)}
                    >
                      {copiedIdeal ? (
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
                  <div className="ideal-answer-snippet">
                    <pre>
                      <code>{lastEvaluation.idealAnswer}</code>
                    </pre>
                  </div>
                </div>
              )}

              <div className="bottom-proceed-bar">
                <button
                  type="button"
                  className="next-question-btn wide"
                  onClick={handleNext}
                >
                  <span>
                    {isLastQuestion ? 'Finish & View Complete Report' : `Next Question (${currentQuestionNumber + 1} of ${totalQuestions})`}
                  </span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="feedback-awaiting-card">
              <div className="awaiting-icon-wrap">
                <Sparkles size={32} className="text-cyan pulse" />
              </div>
              <h3 className="awaiting-title">Awaiting Your Answer</h3>
              <p className="awaiting-desc">
                Answer Question {currentQuestionNumber} on the left and click <strong>Submit Answer</strong>. The n8n AI engine will evaluate your technical precision and return a score out of 10, improvement tips, and a model solution.
              </p>
              <div className="awaiting-criteria-list">
                <div className="criteria-item">
                  <CheckCircle size={14} className="text-emerald" />
                  <span>Technical accuracy & depth</span>
                </div>
                <div className="criteria-item">
                  <CheckCircle size={14} className="text-emerald" />
                  <span>Handling of trade-offs & edge cases</span>
                </div>
                <div className="criteria-item">
                  <CheckCircle size={14} className="text-emerald" />
                  <span>Senior-level terminology</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Previous Questions & Answers Accordion / Drawer */}
      {previousQA && previousQA.length > 0 && (
        <div className="previous-questions-section">
          <button
            type="button"
            className="toggle-history-btn"
            onClick={() => setShowHistory(!showHistory)}
          >
            <div className="toggle-btn-left">
              <History size={16} className="text-cyan" />
              <span>
                Interview History ({previousQA.length} answered {previousQA.length === 1 ? 'question' : 'questions'})
              </span>
            </div>
            {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showHistory && (
            <div className="history-cards-container">
              {previousQA.map((item, idx) => (
                <div key={idx} className="history-card">
                  <div className="history-card-header">
                    <span className="history-q-num">Question {item.questionNumber}</span>
                    <span className="history-score-badge">
                      Score: <strong>{item.evaluation?.score ?? 0} / 10</strong>
                    </span>
                  </div>
                  <h4 className="history-question-text">{item.question}</h4>
                  <div className="history-candidate-answer">
                    <strong>Your Answer:</strong> {item.candidateAnswer}
                  </div>
                  {item.evaluation?.feedback && (
                    <div className="history-feedback-text">
                      <strong>Feedback:</strong> {item.evaluation.feedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

