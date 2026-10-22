import { useState } from 'react';
import Header from './components/Header';
import InterviewSetup from './components/InterviewSetup';
import ConversationalSession from './components/ConversationalSession';
import InterviewSummary from './components/InterviewSummary';
import InterviewForm from './components/InterviewForm';
import EvaluationResult from './components/EvaluationResult';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorMessage from './components/ErrorMessage';
import EmptyState from './components/EmptyState';
import {
  N8N_INTERVIEW_COACH_WEBHOOK_URL,
  getFallbackQuestion
} from './constants';
import './App.css';

function App() {
  // Navigation mode: 'conversational' (Mock Interview) vs 'single_eval' (Single Evaluator)
  const [activeMode, setActiveMode] = useState('conversational');

  // Conversational Interview State
  // interviewStep: 'setup' | 'in_progress' | 'summary'
  const [interviewStep, setInterviewStep] = useState('setup');
  const [sessionConfig, setSessionConfig] = useState(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [lastEvaluation, setLastEvaluation] = useState(null);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [sessionError, setSessionError] = useState(null);

  // Single Question Evaluator State (preserving existing feature)
  const [singleFormData, setSingleFormData] = useState({
    company: '',
    topic: '',
    question: '',
    answer: '',
  });
  const [isSingleLoading, setIsSingleLoading] = useState(false);
  const [singleEvaluation, setSingleEvaluation] = useState(null);
  const [singleApiError, setSingleApiError] = useState(null);
  const [singleValidationErrors, setSingleValidationErrors] = useState({});
  const [singleLastPayload, setSingleLastPayload] = useState(null);

  /* --------------------------------------------------------------------------
     Conversational AI Interview Handlers
     -------------------------------------------------------------------------- */

  // Request n8n to generate a question (with smart fallback if n8n only has evaluation node)
  const fetchQuestion = async (config, qNumber, prevQuestions) => {
    setIsGeneratingQuestion(true);
    setSessionError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(N8N_INTERVIEW_COACH_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_question',
          company: config.company,
          role: config.role,
          topic: config.topic,
          difficulty: config.difficulty,
          questionNumber: qNumber,
          totalQuestions: config.questionCount,
          previousQuestions: prevQuestions,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const rawText = await response.text();
        let data = null;
        try {
          data = JSON.parse(rawText);
          if (Array.isArray(data)) data = data[0];
        } catch {
          // not JSON, ignore
        }

        // If n8n has the question generator configured and returned a question
        if (data && (data.question || data.generatedQuestion || data.questionText)) {
          const generated = data.question || data.generatedQuestion || data.questionText;
          if (typeof generated === 'string' && generated.trim().length > 10) {
            setCurrentQuestion(generated.trim());
            return;
          }
        }
      }

      // If the online n8n webhook only has the evaluate node configured,
      // intelligently select from the calibrated question bank so the user's interview continues seamlessly!
      const fallback = getFallbackQuestion({
        topic: config.topic,
        difficulty: config.difficulty,
        previousQuestions: prevQuestions,
      });
      setCurrentQuestion(fallback);
    } catch {
      // On network timeout or error, use fallback
      const fallback = getFallbackQuestion({
        topic: config.topic,
        difficulty: config.difficulty,
        previousQuestions: prevQuestions,
      });
      setCurrentQuestion(fallback);
    } finally {
      clearTimeout(timeoutId);
      setIsGeneratingQuestion(false);
    }
  };

  // Start the interview
  const handleStartInterview = async (config) => {
    setSessionConfig(config);
    setCurrentQuestionNumber(1);
    setCompletedQuestions([]);
    setLastEvaluation(null);
    setSessionError(null);
    setInterviewStep('in_progress');

    await fetchQuestion(config, 1, []);
  };

  // Submit candidate answer to n8n webhook for evaluation
  const handleSubmitSessionAnswer = async (candidateAnswer) => {
    setIsEvaluating(true);
    setSessionError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const payload = {
      action: 'evaluate_answer',
      company: sessionConfig.company,
      role: sessionConfig.role,
      topic: sessionConfig.topic,
      difficulty: sessionConfig.difficulty,
      question: currentQuestion,
      answer: candidateAnswer,
      questionNumber: currentQuestionNumber,
      totalQuestions: sessionConfig.questionCount,
    };

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
        throw new Error(
          `n8n Evaluation Webhook returned HTTP ${response.status} (${response.statusText}).`
        );
      }

      const rawText = await response.text();
      let parsed = null;
      try {
        parsed = JSON.parse(rawText);
        if (Array.isArray(parsed)) parsed = parsed[0];
      } catch {
        throw new Error(`Invalid JSON response received from n8n webhook: ${rawText.slice(0, 100)}`);
      }

      if (!parsed || typeof parsed !== 'object') {
        throw new Error('API response was empty or did not contain an evaluation object.');
      }

      const evalData = {
        score: parsed.score !== undefined ? parsed.score : 0,
        feedback: parsed.feedback || 'Answer evaluated successfully.',
        idealAnswer: parsed.idealAnswer || parsed.ideal_answer || '',
        improvements: Array.isArray(parsed.improvements)
          ? parsed.improvements
          : typeof parsed.improvements === 'string'
          ? [parsed.improvements]
          : [],
        candidateAnswer,
      };

      setLastEvaluation(evalData);

      // Record question into completed history
      setCompletedQuestions((prev) => [
        ...prev,
        {
          questionNumber: currentQuestionNumber,
          question: currentQuestion,
          candidateAnswer,
          evaluation: evalData,
        },
      ]);
    } catch (err) {
      console.error('Answer evaluation error:', err);
      let msg = err.message || 'An error occurred while evaluating your answer.';
      if (err.name === 'AbortError') {
        msg = 'The evaluation timed out after 60 seconds. The n8n AI model workflow is taking longer than usual.';
      }
      setSessionError({
        message: msg,
        details: err.stack || err.toString(),
      });
    } finally {
      clearTimeout(timeoutId);
      setIsEvaluating(false);
    }
  };

  // Next question
  const handleNextSessionQuestion = async () => {
    const nextQNum = currentQuestionNumber + 1;
    setCurrentQuestionNumber(nextQNum);
    setLastEvaluation(null);

    const prevList = completedQuestions.map((q) => q.question);
    await fetchQuestion(sessionConfig, nextQNum, prevList);
  };

  // Finish interview and view summary
  const handleFinishInterview = () => {
    setInterviewStep('summary');
  };

  // Restart interview with new setup
  const handleRestartInterview = () => {
    setInterviewStep('setup');
    setSessionConfig(null);
    setCurrentQuestionNumber(1);
    setCurrentQuestion('');
    setLastEvaluation(null);
    setCompletedQuestions([]);
    setSessionError(null);
  };

  // Retake interview with same setup
  const handleRetakeInterview = () => {
    if (!sessionConfig) {
      handleRestartInterview();
      return;
    }
    handleStartInterview(sessionConfig);
  };

  /* --------------------------------------------------------------------------
     Single Question Evaluator Handlers (Preserved Original Feature)
     -------------------------------------------------------------------------- */
  const handleSingleEvaluate = async (payload) => {
    setIsSingleLoading(true);
    setSingleApiError(null);
    setSingleLastPayload(payload);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(N8N_INTERVIEW_COACH_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate_answer',
          ...payload,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`n8n Webhook returned status ${response.status} (${response.statusText}).`);
      }

      const rawText = await response.text();
      let parsed = JSON.parse(rawText);
      if (Array.isArray(parsed)) parsed = parsed[0];

      setSingleEvaluation({
        company: parsed.company || payload.company,
        topic: parsed.topic || payload.topic,
        score: parsed.score !== undefined ? parsed.score : 0,
        feedback: parsed.feedback || 'Evaluation completed successfully.',
        idealAnswer: parsed.idealAnswer || parsed.ideal_answer || '',
        improvements: parsed.improvements || [],
      });
    } catch (err) {
      setSingleApiError({
        message: err.message || 'Evaluation service error.',
        details: err.stack || err.toString(),
      });
    } finally {
      clearTimeout(timeoutId);
      setIsSingleLoading(false);
    }
  };

  const handleSingleReset = () => {
    setSingleFormData({ company: '', topic: '', question: '', answer: '' });
    setSingleValidationErrors({});
    setSingleEvaluation(null);
    setSingleApiError(null);
  };

  return (
    <div className="interview-coach-app">
      <Header
        activeMode={activeMode}
        onSelectMode={(mode) => {
          setActiveMode(mode);
          setSessionError(null);
        }}
      />

      <main className="main-content-layout">
        {/* ==================================================================
            MODE 1: Conversational AI Mock Interview
            ================================================================== */}
        {activeMode === 'conversational' && (
          <div className="conversational-mode-wrap">
            {sessionError && (
              <div className="session-error-container">
                <ErrorMessage
                  message={sessionError.message}
                  details={sessionError.details}
                  onDismiss={() => setSessionError(null)}
                />
              </div>
            )}

            {interviewStep === 'setup' && (
              <InterviewSetup
                onStartInterview={handleStartInterview}
                isLoading={isGeneratingQuestion}
              />
            )}

            {interviewStep === 'in_progress' && sessionConfig && (
              <ConversationalSession
                sessionConfig={sessionConfig}
                currentQuestionNumber={currentQuestionNumber}
                totalQuestions={sessionConfig.questionCount}
                currentQuestion={currentQuestion}
                isGeneratingQuestion={isGeneratingQuestion}
                isEvaluating={isEvaluating}
                lastEvaluation={lastEvaluation}
                previousQA={completedQuestions}
                onSubmitAnswer={handleSubmitSessionAnswer}
                onNextQuestion={handleNextSessionQuestion}
                onFinishInterview={handleFinishInterview}
                onAbortInterview={handleRestartInterview}
              />
            )}

            {interviewStep === 'summary' && sessionConfig && (
              <InterviewSummary
                sessionConfig={sessionConfig}
                completedQuestions={completedQuestions}
                onRestartInterview={handleRestartInterview}
                onRetakeInterview={handleRetakeInterview}
              />
            )}
          </div>
        )}

        {/* ==================================================================
            MODE 2: Single Question Evaluator (Preserved Feature)
            ================================================================== */}
        {activeMode === 'single_eval' && (
          <div className="layout-grid">
            <section className="form-column" aria-label="Interview question input form">
              <InterviewForm
                onSubmit={handleSingleEvaluate}
                isLoading={isSingleLoading}
                formData={singleFormData}
                setFormData={setSingleFormData}
                errors={singleValidationErrors}
                setErrors={setSingleValidationErrors}
                onReset={handleSingleReset}
              />
            </section>

            <section className="result-column" aria-label="Evaluation output">
              {singleApiError && (
                <ErrorMessage
                  message={singleApiError.message}
                  details={singleApiError.details}
                  onRetry={() => singleLastPayload && handleSingleEvaluate(singleLastPayload)}
                  onDismiss={() => setSingleApiError(null)}
                />
              )}

              {isSingleLoading ? (
                <LoadingIndicator
                  company={singleFormData.company}
                  topic={singleFormData.topic}
                />
              ) : singleEvaluation ? (
                <EvaluationResult
                  evaluation={singleEvaluation}
                  onReset={handleSingleReset}
                />
              ) : (
                <EmptyState />
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-left">
            <span className="footer-brand">Technical Interview Practice Coach</span>
            <span className="footer-divider">•</span>
            <span className="footer-note">
              Conversational Mock Interview & Live n8n Cloud Webhook
            </span>
          </div>
          <div className="footer-right">
            <span className="webhook-status-tag">
              n8n Action: <code>generate_question</code> | <code>evaluate_answer</code>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
