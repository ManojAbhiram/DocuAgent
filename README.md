# 🛡️ DocuAgent

DocuAgent is a **Secure AI Document Processing Platform** designed for enterprise trust and compliance. It features a robust FastAPI backend protected by deep security guardrails, paired with a modern React frontend dashboard.

## ✨ Core Features

- **Document Ingestion**: Upload and process documents into a secure queue.
- **Security Guardrails**: 
  - **PII Masking**: Automatically detects and replaces sensitive information (Emails, Phones, GST) with secure tokens *before* reaching the LLM.
  - **Rehydration**: Seamlessly restores original data natively in the secured environment post-analysis.
  - **Prompt Injection Protection**: Heuristic-based checks to ensure safety.
  - **Audit Logs**: 100% trace of LLM interactions.
- **Contract Analyzer**: Automated clause extraction and risk scoring.
- **Invoice Auditor**: Duplicate checks and GST validations.
- **Financial Analyzer**: AI-driven KPI extractions.

## 🏗️ Architecture Stack

- **Backend**: Python 3, FastAPI, SQLAlchemy (SQLite/PostgreSQL), LiteLLM, python-jose (JWT Auth), cryptography (simulated AES-256).
- **Frontend**: React (Vite.js), TailwindCSS (v3), React Router DOM, Lucide Icons.

## 🚀 Getting Started

### Universal Steps (Using Make)
If you have `make` installed, use these commands on any OS:
```bash
# 1. Backend
cd backend && make run

# 2. Frontend
cd frontend && npm run dev -- --port 5174
```

### Manual Steps (Platform Specific)

#### 🖥️ Windows (PowerShell)
```powershell
# 1. Backend
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload

# 2. Frontend
cd frontend
npm run dev -- --port 5174
```

#### 🐧 Linux / macOS
```bash
# 1. Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# 2. Frontend
cd frontend
npm run dev -- --port 5174
```
> View at: [Backend Docs](http://localhost:8000/docs) | [Frontend](http://localhost:5174)

## 🔒 Security Principles

1. **Zero Trust LLM**: The LLM is treated as an untrusted third party. Raw sensitive data never leaves the `GuardrailService`.
2. **Auditability**: Every action (Upload, Processing, LLM Call) is recorded with masked traces.
3. **Data Residency Ready**: Built to accommodate strictly isolated and encrypted components.

---

*Built with security and AI safety as a first-class citizen.*
