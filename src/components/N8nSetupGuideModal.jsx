import React, { useState } from 'react';
import { X, Sparkles, Workflow, Copy, Check } from 'lucide-react';

export default function N8nSetupGuideModal({ isOpen, onClose }) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState(false);

  if (!isOpen) return null;

  const n8nPromptText = `You are a Senior Technical Interviewer at {{ $json.body.company || "a top tech firm" }} interviewing for a {{ $json.body.role || "Software Engineer" }} role.
Generate exactly ONE relevant, realistic technical interview question on the topic of "{{ $json.body.topic }}".
Difficulty level: {{ $json.body.difficulty || "Medium" }}.
Question number {{ $json.body.questionNumber || 1 }} of {{ $json.body.totalQuestions || 5 }}.
Do not repeat any of these previously asked questions: {{ JSON.stringify($json.body.previousQuestions || []) }}.

Respond ONLY with a valid JSON object in this format:
{
  "success": true,
  "question": "The interview question text here...",
  "category": "{{ $json.body.topic }}",
  "difficulty": "{{ $json.body.difficulty }}"
}`;

  const jsonResponseFormat = `{
  "success": true,
  "question": "Explain the difference between optimistic and pessimistic locking in database transactions with use cases.",
  "category": "SQL & Databases",
  "difficulty": "Medium"
}`;

  const handleCopy = async (text, setter) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Workflow size={20} className="text-cyan" />
            <h3 className="modal-title">n8n Dual-Action Node Configuration Guide</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-intro">
            The frontend now sends an <code>action</code> property in every webhook request:
            <br />
            • <code>action: "generate_question"</code> (to formulate technical questions)
            <br />
            • <code>action: "evaluate_answer"</code> (to grade candidate responses)
          </p>

          <div className="guide-step">
            <div className="step-badge">Step 1</div>
            <div className="step-content">
              <h4>Add an "If" or "Switch" node after your Webhook node in n8n</h4>
              <p>Configure condition:</p>
              <div className="code-block-wrap">
                <code>{`{{ $json.body.action === 'generate_question' }}`}</code>
              </div>
            </div>
          </div>

          <div className="guide-step">
            <div className="step-badge">Step 2</div>
            <div className="step-content">
              <div className="step-header-row">
                <h4>True Branch: Question Generation LLM Node</h4>
                <button
                  type="button"
                  className="copy-snippet-btn"
                  onClick={() => handleCopy(n8nPromptText, setCopiedPrompt)}
                >
                  {copiedPrompt ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
                </button>
              </div>
              <p>Add an AI LLM / OpenAI / Anthropic node connected to the Webhook response with this system prompt:</p>
              <pre className="code-pre">
                <code>{n8nPromptText}</code>
              </pre>
            </div>
          </div>

          <div className="guide-step">
            <div className="step-badge">Step 3</div>
            <div className="step-content">
              <div className="step-header-row">
                <h4>Expected JSON Output for generate_question</h4>
                <button
                  type="button"
                  className="copy-snippet-btn"
                  onClick={() => handleCopy(jsonResponseFormat, setCopiedFormat)}
                >
                  {copiedFormat ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedFormat ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="code-pre">
                <code>{jsonResponseFormat}</code>
              </pre>
            </div>
          </div>

          <div className="guide-step">
            <div className="step-badge">Step 4</div>
            <div className="step-content">
              <h4>False Branch (or default): Keep your existing Evaluation Node</h4>
              <p>
                Your existing evaluation pipeline handles <code>action: "evaluate_answer"</code> and continues returning:
                <code>{` { score, feedback, idealAnswer, improvements }`}</code>.
              </p>
            </div>
          </div>

          <div className="modal-note-box">
            <Sparkles size={16} className="text-cyan" />
            <span>
              <strong>Note:</strong> The frontend is fully fault-tolerant. If your n8n workflow hasn't added the generator branch yet, our app automatically generates context-aware questions from its internal bank while still sending all evaluations to your live n8n AI engine!
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-done-btn" onClick={onClose}>
            Got it, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}

