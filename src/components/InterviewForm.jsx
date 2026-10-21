import React, { useState } from 'react';
import {
  Send,
  Building,
  Layers,
  HelpCircle,
  FileEdit,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Bookmark
} from 'lucide-react';
import { COMPANY_OPTIONS, SAMPLE_QUESTIONS } from '../constants';

export default function InterviewForm({
  onSubmit,
  isLoading,
  formData,
  setFormData,
  errors,
  setErrors,
  onReset
}) {
  const [customCompany, setCustomCompany] = useState('');

  // Handle standard field change
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field if user begins typing
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Handle quick sample question selection
  const handleSelectSample = (sample) => {
    // Check if sample company is in standard list
    const isStandard = COMPANY_OPTIONS.includes(sample.company);
    setFormData({
      company: isStandard ? sample.company : 'Other',
      topic: sample.topic,
      question: sample.question,
      answer: sample.answer,
    });
    if (!isStandard) {
      setCustomCompany(sample.company);
    }
    setErrors({});
  };

  // Compute word and character count
  const answerLength = (formData.answer || '').length;
  const answerWordCount = (formData.answer || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const validationErrors = {};
    if (!formData.company || !formData.company.trim()) {
      validationErrors.company = 'Please select a company.';
    } else if (formData.company === 'Other' && !customCompany.trim()) {
      validationErrors.customCompany = 'Please specify the company name.';
    }

    if (!formData.topic || !formData.topic.trim()) {
      validationErrors.topic = 'Interview topic is required (e.g., Java, SQL, React).';
    }

    if (!formData.question || !formData.question.trim()) {
      validationErrors.question = 'Please provide the technical interview question.';
    } else if (formData.question.trim().length < 8) {
      validationErrors.question = 'Question seems too short. Please provide a clear question.';
    }

    if (!formData.answer || !formData.answer.trim()) {
      validationErrors.answer = 'Please provide your draft answer to be evaluated.';
    } else if (formData.answer.trim().length < 15) {
      validationErrors.answer = 'Answer should be at least 15 characters for a meaningful technical evaluation.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const effectiveCompany =
      formData.company === 'Other' && customCompany.trim()
        ? customCompany.trim()
        : formData.company;

    onSubmit({
      company: effectiveCompany,
      topic: formData.topic.trim(),
      question: formData.question.trim(),
      answer: formData.answer.trim(),
    });
  };

  return (
    <div className="interview-form-card">
      <div className="form-card-header">
        <div className="form-title-group">
          <div className="form-icon-pill">
            <FileEdit size={18} />
          </div>
          <div>
            <h2 className="form-card-title">Interview Input</h2>
            <p className="form-card-subtitle">
              Enter target company details and your response for AI evaluation.
            </p>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="sample-presets-container">
          <div className="preset-label-row">
            <span className="preset-label">
              <Sparkles size={13} /> Quick Presets:
            </span>
          </div>
          <div className="preset-chips">
            {SAMPLE_QUESTIONS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                className="preset-chip"
                onClick={() => handleSelectSample(sample)}
                disabled={isLoading}
                title={`Load ${sample.company} - ${sample.topic}`}
              >
                <Bookmark size={11} />
                <span>{sample.company}: {sample.topic}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="practice-form">
        {/* Row 1: Company & Topic */}
        <div className="form-row grid-2">
          {/* Company Field */}
          <div className="form-group">
            <label htmlFor="company-select" className="form-label">
              <Building size={14} className="label-icon" />
              Target Company <span className="required-star">*</span>
            </label>
            <div className={`input-wrapper ${errors.company ? 'has-error' : ''}`}>
              <select
                id="company-select"
                className="form-select"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                disabled={isLoading}
              >
                <option value="" disabled>
                  Select target company...
                </option>
                {COMPANY_OPTIONS.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
            </div>
            {errors.company && (
              <p className="field-error-msg">
                <AlertCircle size={13} /> {errors.company}
              </p>
            )}

            {/* Custom Company input when "Other" is chosen */}
            {formData.company === 'Other' && (
              <div className="custom-company-input-wrap">
                <input
                  type="text"
                  placeholder="Enter custom company (e.g. Google, Amazon)..."
                  className={`form-input custom-input ${errors.customCompany ? 'has-error' : ''}`}
                  value={customCompany}
                  onChange={(e) => {
                    setCustomCompany(e.target.value);
                    if (errors.customCompany) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.customCompany;
                        return next;
                      });
                    }
                  }}
                  disabled={isLoading}
                />
                {errors.customCompany && (
                  <p className="field-error-msg">
                    <AlertCircle size={13} /> {errors.customCompany}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Topic Field */}
          <div className="form-group">
            <label htmlFor="topic-input" className="form-label">
              <Layers size={14} className="label-icon" />
              Interview Topic <span className="required-star">*</span>
            </label>
            <div className={`input-wrapper ${errors.topic ? 'has-error' : ''}`}>
              <input
                id="topic-input"
                type="text"
                className="form-input"
                placeholder="e.g. Java, SQL, OOP, System Design"
                value={formData.topic}
                onChange={(e) => handleChange('topic', e.target.value)}
                disabled={isLoading}
              />
            </div>
            {errors.topic && (
              <p className="field-error-msg">
                <AlertCircle size={13} /> {errors.topic}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Interview Question */}
        <div className="form-group">
          <label htmlFor="question-input" className="form-label">
            <HelpCircle size={14} className="label-icon" />
            Interview Question <span className="required-star">*</span>
          </label>
          <div className={`input-wrapper ${errors.question ? 'has-error' : ''}`}>
            <textarea
              id="question-input"
              rows={3}
              className="form-textarea question-textarea"
              placeholder="e.g. What is the difference between String, StringBuilder, and StringBuffer in Java?"
              value={formData.question}
              onChange={(e) => handleChange('question', e.target.value)}
              disabled={isLoading}
            />
          </div>
          {errors.question && (
            <p className="field-error-msg">
              <AlertCircle size={13} /> {errors.question}
            </p>
          )}
        </div>

        {/* Row 3: Student Answer */}
        <div className="form-group">
          <div className="textarea-label-row">
            <label htmlFor="answer-input" className="form-label">
              <FileEdit size={14} className="label-icon" />
              Student Answer <span className="required-star">*</span>
            </label>
            <span className="char-count-badge">
              {answerWordCount} {answerWordCount === 1 ? 'word' : 'words'} • {answerLength} chars
            </span>
          </div>
          <div className={`input-wrapper ${errors.answer ? 'has-error' : ''}`}>
            <textarea
              id="answer-input"
              rows={7}
              className="form-textarea answer-textarea"
              placeholder="Type your explanation here. Include key technical concepts, internal implementation details, differences, or performance trade-offs..."
              value={formData.answer}
              onChange={(e) => handleChange('answer', e.target.value)}
              disabled={isLoading}
            />
          </div>
          {errors.answer && (
            <p className="field-error-msg">
              <AlertCircle size={13} /> {errors.answer}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions-row">
          <button
            type="submit"
            className="submit-evaluate-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner"></span>
                <span>Evaluating Answer...</span>
              </>
            ) : (
              <>
                <Send size={16} className="btn-send-icon" />
                <span>Evaluate Answer</span>
                <Sparkles size={15} className="btn-sparkle-icon" />
              </>
            )}
          </button>

          <button
            type="button"
            className="clear-form-btn"
            onClick={onReset}
            disabled={isLoading}
            title="Reset form fields"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        </div>
      </form>
    </div>
  );
}
