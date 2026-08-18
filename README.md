# AI Tutor Service (Backend)

An intelligent, grade-adaptive AI Tutor backend powered by **Google Gemini 3.6 Flash** and **Node.js / Express**. This service generates structured explanations, practice multiple-choice questions, and ASCII visual flowcharts with strict JSON outputs and built-in response caching.

---

## 🚀 Key Features

- **Structured Output Guarantees:** Enforces strict JSON schemas using Gemini's native `responseSchema` configuration.
- **Visual ASCII Diagrams:** Generates formatted multi-line ASCII flowcharts for visual learning requests.
- **In-Memory Caching:** Instant response execution for repeated queries.
- **Grade-Adaptive Explanations:** Tailors responses and analogies based on student grade levels and concept mastery.
- **Fault-Tolerant Parsing:** Robust text cleaning handles edge-case token formatting gracefully without crashing the server.

---

## 📁 Repository Structure

```text
server/
├── src/
│   ├── controllers/
│   │   └── aiController.js    # Express route request & response handlers
│   ├── prompts/
│   │   └── aiPrompts.js       # System prompts and instruction builders
│   ├── routes/
│   │   └── aiRoutes.js        # API endpoints for AI service
│   └── services/
│       └── aiService.js       # Core Gemini API integration & schema enforcement
├── test.js                    # Interactive CLI testing tool
├── .env                       # Environment variables (API Keys & Config)
├── package.json               # Node.js dependencies & scripts
└── README.md                  # Project documentation