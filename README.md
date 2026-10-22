# Technical Interview Practice Coach 🚀

A modern, responsive conversational AI mock interview application designed to prepare software engineering candidates for technical rounds at top technology companies (TCS, Infosys, Wipro, Accenture, and more). Powered by a production n8n Cloud webhook workflow with live AI evaluation, scoring out of 10, in-depth feedback, model answers, and end-of-session performance analytics.

---

## ✨ Features

### 1. Conversational AI Mock Interview Mode (Primary)
- **Comprehensive Interview Setup**: Choose target company, job role (SDE, Frontend, Backend, Full Stack, Data, DevOps, QA, etc.), topic, difficulty level (Easy, Medium, Hard), and question count (5, 10, or 15).
- **Automated AI Questioning**: The AI interviewer asks questions one-by-one automatically—no need to enter your own questions.
- **Real-Time Step-by-Step Evaluation**: After submitting each answer, receive an instant objective score (0–10), targeted feedback, actionable improvement points, and a model answer.
- **Session Progress Tracking**: Dynamic question progress bar (e.g., Question 1 of 5) with word/character counter and empty-submission guards.
- **Interview History Drawer**: Expandable transcript drawer to review previous questions, answers, and scores during the live interview.
- **End-of-Interview Performance Report**:
  - Total and average score out of 10 with animated radial gauge.
  - Calibrated performance tier (*Offer Bar / Exceptional*, *Strong*, *Developing*, *Needs Core Revision*).
  - Aggregate strengths and high-priority focus areas.
  - Question-by-question breakdown with copyable ideal solutions.
  - Retake and restart controls.

### 2. Single Question Evaluator Mode (Preserved Feature)
- Evaluate standalone practice questions with preset questions (TCS Java, Infosys SQL, Wipro OOP, Accenture REST APIs) or custom questions.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite](https://vite.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Modern CSS3 (Variables, Glassmorphism, Grid, Flexbox, Keyframe animations)
- **AI Backend**: [n8n Cloud](https://n8n.io/) Webhook Workflow

---

## 🔌 n8n Dual-Action Webhook Contract

The application connects to the production webhook:
- **Endpoint**: `https://sowdarya.app.n8n.cloud/webhook/interview-coach`
- **Method**: `POST`

### 1. Question Generation (`action: "generate_question"`)
```json
{
  "action": "generate_question",
  "company": "TCS",
  "role": "Frontend Developer",
  "topic": "React & Frontend",
  "difficulty": "Medium",
  "questionNumber": 1,
  "totalQuestions": 5,
  "previousQuestions": []
}
```
**Expected Response**:
```json
{
  "success": true,
  "question": "Explain how React reconciliation and the Virtual DOM diffing algorithm operate under the hood."
}
```
*(The frontend includes an intelligent contextual fallback question bank, ensuring seamless operation even if the online n8n workflow has not yet added the generator branch).*

### 2. Answer Evaluation (`action: "evaluate_answer"`)
```json
{
  "action": "evaluate_answer",
  "company": "TCS",
  "role": "Frontend Developer",
  "topic": "React & Frontend",
  "difficulty": "Medium",
  "question": "Explain how React reconciliation and the Virtual DOM diffing algorithm operate under the hood.",
  "answer": "React creates a lightweight virtual DOM tree and compares it with the previous tree using diffing heuristics...",
  "questionNumber": 1,
  "totalQuestions": 5
}
```
**Response Format**:
```json
{
  "success": true,
  "company": "TCS",
  "topic": "React & Frontend",
  "score": 8,
  "feedback": "The answer accurately describes virtual DOM comparison...",
  "idealAnswer": "React uses the Fiber reconciliation engine to perform incremental rendering...",
  "improvements": [
    "Mention the two main phases (render/reconciliation and commit).",
    "Explain key-based heuristic diffing for list items."
  ]
}
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation & Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
