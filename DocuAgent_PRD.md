# Product Requirements Document (PRD)
## DocuAgent: Secure AI Document Processing Platform

**Version:** 1.0  
**Status:** Approved for Production  
**Target Architecture:** Distributed microservices (FastAPI Backend, React Frontend)

---

## 1. Executive Summary
DocuAgent is an enterprise-grade, secure Document Processing and AI Analysis Platform. It aims to eliminate friction and risks typically associated with integrating Large Language Models (LLMs) into corporate workflows by acting as a zero-trust intermediate layer. 

The primary business objective is to streamline manual document review (Contracts, Invoices, Financials) using advanced AI extraction models while maintaining stringent data residency, PII security, and auditability.

---

## 2. Product Vision & Goals

### 2.1 Vision
To create a singular, unified gateway interface where end-users can safely upload sensitive business documents, receive instant analytical insights via AI, and ensure zero confidential data leakage to third-party generative models.

### 2.2 Key Performance Indicators (KPIs)
- **Time to Analysis (TTA):** Extract and generate KPI reports from 50-page PDFs in under 15 seconds.
- **Data Security:** Ensure 100% of defined PII schemas (Emails, Phone Numbers, GSTs) are masked/tokenized before contacting external AI providers.
- **Provider Migration Time:** Enable zero-code fallback configurations (LiteLLM) within minutes from OpenAI to Anthropic, Gemini, or local models.

---

## 3. Key Features

### 3.1 Role-Based Access Control & User Flow
A built-in JWT Authentication tier supporting granular scopes.
- **Roles Defined:** Admin, Legal, Finance, Standard User.
- **UX Element:** A comprehensive authentication portal supporting login and user-registration logic.

### 3.2 Universal Document Ingestion pipeline
The ability to process multi-format document sets autonomously. 
- **Intelligent Parsers:** Seamless fallback processing between Microsoft's `MarkItDown` algorithm (Native text extraction for PDF, Excel, Word, PPT) and OpenCV-enhanced `Tesseract` OCR integrations for graphical scans.
- **Asynchronous Processing:** Documents are processed dynamically via background workers to keep UI responsive.

### 3.3 The "Guardrail" Security Layer (Core USP)
The backbone of DocuAgent strictly enforces data sanitization:
- **Pre-Flight Masking:** Scans native extraction strings, identifying sensitive PII tokens, and replaces them with arbitrary hashes (`[MASKED_EMAIL_xyz]`).
- **Prompt Injection Validation:** Scans the incoming contextual prompt for standard jailbreak anomalies and halts the API relay.
- **Post-Flight Rehydration:** Maps returned responses from the LLM back to natural unmasked internal text before presentation to the UI.

### 3.4 Multi-LLM Routing (LiteLLM)
Zero vendor lock-in capability designed for dynamic switching.
- Configurations load dynamically from `.env` logic. Supported routing includes `gemini-2.5-flash-lite`, `gpt-4o`, `claude-3-5`, and local `ollama/llama3` instances.

### 3.5 Specialized Analyzers (Business Modules)
Dedicated sub-services wrapped around the Guardrails offering specific analytical tasks:
1. **Contract Analyzer:** Clause identification and Risk/SLA summaries.
2. **Invoice Auditor:** Regulatory compliance checks (e.g. GST) and logical duplicate transaction flagging.
3. **Financial Analyzer:** Key Performance Indicator (KPI) extractions and structured insight generation.

### 3.6 Full Telemetry & Audit Trails
100% trace of LLM behaviors captured permanently.
- **Internal Database:** All operations—from document receipt to LLM response—log into a secure internal RDBMS (SQLite / PostgreSQL) tracking the user, action, latency, and success status.

---

## 4. Technical Architecture Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Backend Framework** | Python 3 + FastAPI | Performance capabilities, native async execution, tight Pydantic validation. |
| **Authentication** | python-jose (JWT) | Stateless zero-dependency authorization. |
| **Language Abstraction** | LiteLLM | Supports simultaneous multithreading to 100+ standard GenAI endpoints. |
| **Frontend Framework** | React 18 + Vite | Highly responsive Single Page Application architecture. |
| **CSS System** | Tailwind CSS v3 | Rapid responsive styling allowing easy integration of Dark Mode. |
| **Native Storage** | SQLite / SQLAlchemy | Relational DB ready to be upgraded to PostgreSQL upon scaling. |

---

## 5. User Stories
1. **As an Admin**, I want to deploy my own internal API keys (e.g., Gemini) in an environment variable securely, so I don't distribute keys heavily.
2. **As a User**, I want to drag and drop several heavy PDFs simultaneously over a dark-mode oriented sleek UI.
3. **As a Legal Expert**, I want the LLM to analyze liability terms *without* sending the customer's actual PII parameters to an API server.
4. **As an Auditor**, I need a ledger that confirms exactly when an LLM hallucination check occurred and who ran the request.

---

## 6. Deployment & Future Considerations
- **Scalability:** Next phase involves replacing FastAPI `BackgroundTasks` with a dedicated `Celery` messaging queue backed by `Redis`. 
- **Orchestration:** Must be entirely Docker-compatible. The platform guarantees isolation between the generic Database Node and the Worker Node running heavy OCR logic.

---

## 7. End-to-End Workflow (Document to Result)

### 7.1. Document Upload
- **Trigger:** User uploads multi-format files (PDF, PNG, JPG) via the React frontend's ingestion UI.
- **Action:** Frontend makes an async `POST /documents/upload` request. Backend stores the file on disk, creates a Database record, logs an `AuditLog`, and routes text extraction to a FastAPI Background Task.

### 7.2. Asynchronous Extraction
- **OCR & Parsing:** The backend task attempts computer-vision text extraction via `PaddleOCR` for visual docs. If unsuccessful, it gracefully falls back to `MarkItDown` for universal extraction.
- **Completion:** The raw text is written to `Document.extracted_text` in the database, and the status is successfully marked as `Completed`.

### 7.3. The Guardrail Engine (Security)
- **Trigger:** User selects the completed document and requests AI analysis (e.g., Contract Analyzer).
- **Masking:** The raw text is routed through the `GuardrailService`. It identifies sensitive PII (Emails, Phones, GST) and swaps them with secure tokens mappings stored in a transient vault (e.g., `[EMAIL_ABCD123]`).
- **Prompt Defense:** Checks the incoming prompt against malicious jailbreak dictionaries.

### 7.4. Secure LLM Analysis
- **Zero-Trust:** The LLM (via `LiteLLM`) receives only the masked text. 
- **Generation:** Generates a structured JSON response under low-temperature execution to prevent hallucinations.

### 7.5. Rehydration & Result Rendering
- **Un-masking:** Validated JSON payloads return through the `GuardrailService` where secure tokens are *rehydrated* back into their original PII values natively.
- **Rendering:** The final payload is stored in the DB, sent to the frontend, and elegantly visualized with charts, color-coded risk flags, and structured tables.
