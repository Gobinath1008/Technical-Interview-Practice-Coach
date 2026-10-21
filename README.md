# Technical Interview Practice Coach 🚀

A modern, responsive web application designed to help software engineering candidates prepare for technical interviews at top technology companies (TCS, Infosys, Wipro, Accenture, and more) with real-time AI evaluation, scoring out of 10, in-depth feedback, and model answers.

---

## ✨ Features

- **Company-Specific Targeting**: Tailored for top companies including TCS, Infosys, Wipro, Accenture, or any custom organization.
- **Real-Time AI Evaluation Engine**: Evaluates answers live using a production n8n Cloud webhook workflow.
- **Objective Scoring (0–10)**: Dynamic animated SVG radial gauge color-coded with calibrated performance badges (*Exceptional*, *Strong*, *Moderate*, *Needs Work*).
- **In-Depth Technical Feedback**: Identifies strengths, omissions, and conceptual depth.
- **Actionable Improvements List**: Clear, numbered action items highlighting key concepts, nuances, and edge cases to mention.
- **Ideal Model Answer**: Senior-level reference answers with a one-click copy-to-clipboard button.
- **1-Click Quick Presets**: Pre-loaded questions across Java, SQL, OOP, and REST APIs for instant testing.
- **Responsive Dark Navy & Electric Blue Theme**: Polished interface with smooth transitions and subtle animations for desktop, laptop, and mobile devices.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite](https://vite.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Modern CSS3 (Variables, Flexbox, Grid, Glassmorphism, Keyframe animations)
- **AI Automation**: [n8n Cloud](https://n8n.io/) Webhook Workflow

---

## 🔌 API Integration

Answers are evaluated via a POST request to the n8n webhook:

- **Endpoint**: `https://sowdarya.app.n8n.cloud/webhook/interview-coach`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "company": "TCS",
    "topic": "Java",
    "question": "What is the difference between String, StringBuilder, and StringBuffer in Java?",
    "answer": "..."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "company": "TCS",
    "topic": "Java",
    "score": 8,
    "feedback": "...",
    "idealAnswer": "...",
    "improvements": ["...", "..."]
  }
  ```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Gobinath1008/Technical-Interview-Practice-Coach.git
   cd Technical-Interview-Practice-Coach
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
