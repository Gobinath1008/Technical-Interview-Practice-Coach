import { useState } from 'react';
import Header from './components/Header';
import InterviewForm from './components/InterviewForm';
import EvaluationResult from './components/EvaluationResult';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorMessage from './components/ErrorMessage';
import EmptyState from './components/EmptyState';
import { N8N_INTERVIEW_COACH_WEBHOOK_URL } from './constants';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    company: '',
    topic: '',
    question: '',
    answer: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [lastSubmittedPayload, setLastSubmittedPayload] = useState(null);

  // Submit interview answer to production n8n webhook
  const handleEvaluate = async (payload) => {
    setIsLoading(true);
    setApiError(null);
    setLastSubmittedPayload(payload);

    // Timeout safety controller (60 seconds for AI model generation)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(N8N_INTERVIEW_COACH_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorDetail = '';
        try {
          const errText = await response.text();
          errorDetail = errText;
        } catch {
          // ignore text read error
        }

        throw new Error(
          `n8n Webhook returned status ${response.status} (${response.statusText}). ${
            errorDetail ? `Server says: ${errorDetail}` : ''
          }`
        );
      }

      // Parse JSON response
      const rawText = await response.text();
      let parsedData;
      try {
        parsedData = JSON.parse(rawText);
      } catch {
        throw new Error(
          `Received invalid JSON from interview coach webhook: ${rawText.slice(0, 150)}...`
        );
      }

      // Handle cases where response might be wrapped in an array [ { ... } ]
      const data = Array.isArray(parsedData) ? parsedData[0] : parsedData;

      if (!data || typeof data !== 'object') {
        throw new Error('API response was empty or did not contain an evaluation object.');
      }

      // Check if workflow explicitly returned an error property
      if (data.success === false && data.error) {
        throw new Error(`Evaluation service reported: ${data.error}`);
      }

      // Ensure we preserve the submitted company and topic if API omitted them
      const completeEvaluation = {
        company: data.company || payload.company,
        topic: data.topic || payload.topic,
        score: data.score !== undefined ? data.score : 0,
        feedback: data.feedback || 'Evaluation completed successfully.',
        idealAnswer: data.idealAnswer || data.ideal_answer || '',
        improvements: data.improvements || data.improvement_points || [],
        rawResponse: data,
      };

      setEvaluation(completeEvaluation);
    } catch (err) {
      console.error('Interview evaluation error:', err);
      let userFriendlyMessage = err.message || 'An unexpected error occurred while contacting the evaluation service.';

      if (err.name === 'AbortError') {
        userFriendlyMessage =
          'The request timed out after 60 seconds. The n8n AI model workflow might be taking longer than usual to generate the response.';
      } else if (err.message && err.message.includes('Failed to fetch')) {
        userFriendlyMessage =
          'Network connection error: Failed to reach the n8n webhook. Please ensure you are connected to the internet and the webhook is reachable.';
      }

      setApiError({
        message: userFriendlyMessage,
        details: err.stack || err.toString(),
      });
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  // Reset form and evaluation
  const handleReset = () => {
    setFormData({
      company: '',
      topic: '',
      question: '',
      answer: '',
    });
    setValidationErrors({});
    setEvaluation(null);
    setApiError(null);
    setLastSubmittedPayload(null);
  };

  return (
    <div className="interview-coach-app">
      <Header />

      <main className="main-content-layout">
        <div className="layout-grid">
          {/* Left Column: Form inputs & controls */}
          <section className="form-column" aria-label="Interview question input form">
            <InterviewForm
              onSubmit={handleEvaluate}
              isLoading={isLoading}
              formData={formData}
              setFormData={setFormData}
              errors={validationErrors}
              setErrors={setValidationErrors}
              onReset={handleReset}
            />
          </section>

          {/* Right Column: Loading state, error message, or real evaluation report */}
          <section className="result-column" aria-label="Evaluation output">
            {apiError && (
              <ErrorMessage
                message={apiError.message}
                details={apiError.details}
                onRetry={() => lastSubmittedPayload && handleEvaluate(lastSubmittedPayload)}
                onDismiss={() => setApiError(null)}
              />
            )}

            {isLoading ? (
              <LoadingIndicator company={formData.company} topic={formData.topic} />
            ) : evaluation ? (
              <EvaluationResult
                evaluation={evaluation}
                onReset={handleReset}
              />
            ) : (
              <EmptyState />
            )}
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-left">
            <span className="footer-brand">Technical Interview Practice Coach</span>
            <span className="footer-divider">•</span>
            <span className="footer-note">Powered by n8n Cloud Webhook Workflow</span>
          </div>
          <div className="footer-right">
            <span className="webhook-status-tag">
              Endpoint: <code>/webhook/interview-coach</code>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
