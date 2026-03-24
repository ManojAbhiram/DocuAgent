# 🖥️ DocuAgent - Frontend

The user-facing dashboard for DocuAgent, built for rapid responsiveness and a premium enterprise feel. It highlights system SLAs, document processing queues, and dedicated Analyzer views.

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite.js
- **Styling**: Tailwind CSS v3
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📂 Project Structure
- `src/components/`: Reusable UI elements (`Sidebar`, `ThemeToggle`).
- `src/pages/`: Main application views:
  - `Dashboard.jsx`: Metrics, Uptime, and recent Audit Logs.
  - `Documents.jsx`: Secure multi-file drag-and-drop upload view.
  - `ContractAnalyzer.jsx`: Interactive mock view for analyzing contracts.
  - `InvoiceAuditor.jsx`: Mock visualization of invoice auditing.

## 🚀 Commands

We use a standard `Makefile` to simplify Node.js command execution.

### `make install`
Installs all required dependencies using `npm install`.

### `make start`
Boots up the Vite development server binding to `0.0.0.0:5173`. Available on your local network.

### `make build`
Compiles the React application into production-ready static files in the `dist/` directory using Rolldown/esbuild.

---
*Note: Dark mode preferences are automatically stored and handled via Tailwind's `class` strategy applied to the HTML root element.*
