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

Quickly spin up the stack using the provided Makefiles.

### 1. Backend Setup
```bash
cd backend
make install    # Create venv and install dependencies
make run        # Run FastAPI on http://localhost:8000
```
> View the live API documentation at `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
make install    # Install node_modules
make start      # Start Vite dev server on http://localhost:5173
```
> View the dashboard at `http://localhost:5173`

## 🔒 Security Principles

1. **Zero Trust LLM**: The LLM is treated as an untrusted third party. Raw sensitive data never leaves the `GuardrailService`.
2. **Auditability**: Every action (Upload, Processing, LLM Call) is recorded with masked traces.
3. **Data Residency Ready**: Built to accommodate strictly isolated and encrypted components.

---

*Built with security and AI safety as a first-class citizen.*
