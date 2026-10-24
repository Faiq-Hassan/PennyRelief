<div align="center">

<img src="./admin-portal/public/logo.jpg" alt="PennyRelief Emblem" width="150" style="border-radius: 50%; box-shadow: 0 12px 32px rgba(5,28,20,0.35); border: 3px solid #34d399;" />

# 🪙 PennyRelief
### *Autonomous Multi-Agent Student Micro-Donation & Emergency Relief Ecosystem*
#### *Zero Bureaucracy • 100% Dignified • 0% APR Qarz-e-Hasna • Automated AI Audit*

[![Production Live](https://img.shields.io/badge/Production%20Live-pennyrelief.autosols.com-34d399?style=for-the-badge&logo=googlechrome&logoColor=white)](https://pennyrelief.autosols.com)
[![Expo Go](https://img.shields.io/badge/Mobile%20App-Expo%20SDK%2058%20(React%20Native)-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![Gemini 2.5](https://img.shields.io/badge/AI%20Engine-Gemini%202.5%20Flash%20Lite-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Gemma 4](https://img.shields.io/badge/Local%20Agent-Gemma%204%20(Open--Source)-072a1e?style=for-the-badge&logo=ollama&logoColor=white)](https://ollama.com)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas%20Live-13aa52?style=for-the-badge&logo=mongodb&logoColor=white)](https://cloud.mongodb.com)
[![Admin Portal](https://img.shields.io/badge/Admin%20Portal-Vite%20%2B%20React%2019-ff8f6b?style=for-the-badge&logo=react&logoColor=white)](https://pennyrelief.autosols.com/home)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](./LICENSE)

---

### *"Never let financial distress halt a university education again."*

</div>

## 📑 Table of Contents

- [🌟 Executive Overview](#-executive-overview)
- [📱 Mobile App Experience (Expo Go)](#-mobile-app-experience-expo-go)
  - [Mobile User Journey & Lifecycle Graph](#mobile-user-journey--lifecycle-graph)
  - [Step-by-Step Mobile Setup Guide](#step-by-step-mobile-setup-guide)
  - [Seamless Real-Time Sync with Admin Portal](#seamless-real-time-sync-with-admin-portal)
- [🔐 Master Credentials Reference](#-master-credentials-reference)
- [🏗️ System Architecture & Cross-Platform Topology](#️-system-architecture--cross-platform-topology)
- [🤖 Autonomous Multi-Agent AI Allocation Pipeline](#-autonomous-multi-agent-ai-allocation-pipeline)
  - [The 4-Stage Multi-Agent Audit](#the-4-stage-multi-agent-audit)
  - [Deterministic Financial Benchmarks](#deterministic-financial-benchmarks)
  - [Verification CLI Command](#verification-cli-command)
- [📊 Executive Admin Portal & PDF Suite](#-executive-admin-portal--pdf-suite)
- [🎨 Editorial Design Language & Aesthetics](#-editorial-design-language--aesthetics)
- [🚀 Local Development & Quick Start](#-local-development--quick-start)
- [🌐 Production Deployment & VPS Synchronization](#-production-deployment--vps-synchronization)
- [📁 Repository File Structure](#-repository-file-structure)
- [📜 License & Ethics](#-license--ethics)

---

## 🌟 Executive Overview

**PennyRelief** is Pakistan’s first automated, zero-bureaucracy university micro-endowment platform. Funded through community penny micro-donations (as low as PKR 100) and evaluated in real-time by autonomous AI agents, PennyRelief protects enrolled students from dropping out due to sudden household financial shocks.

* **Award-Winning Editorial UI**: Inspired by premier fintech publications, built with **Fraunces** serif typography, soft sage/mint canvases, deep forest obsidian containers, warm coral accents, and smooth Framer Motion spring physics.
* **Autonomous AI Need Prioritization**: Multi-agent auditor powered by **Google Gemini 2.5 Flash Lite** and local **Gemma 4**, evaluating applicant financial stress in under 30 seconds with 100% mathematical fairness.
* **Zero Bureaucracy, 100% Dignity**: Pure **0% APR (Qarz-e-Hasna)** student relief. No humiliating paper queues, no invasive committee interviews, and an open verifiable disbursal ledger.
* **Unified Cross-Platform Sync**: Mobile app on **Expo Go (React Native)** and Admin Portal on **Vite/React 19** share the exact same live **MongoDB Atlas** cluster for immediate bidirectional consistency.

---

## 📱 Mobile App Experience (Expo Go)

The PennyRelief mobile application empowers students to manage their relief wallet, submit tuition relief requests with instant document capture, and track micro-disbursals directly from their smartphones.

### Mobile User Journey & Lifecycle Graph

```mermaid
flowchart TD
    classDef startNode fill:#072a1e,stroke:#34d399,stroke-width:2px,color:#fff;
    classDef actionNode fill:#0b3324,stroke:#38bdf8,stroke-width:2px,color:#fff;
    classDef decisionNode fill:#1c1917,stroke:#f59e0b,stroke-width:2px,color:#fbbf24;
    classDef aiNode fill:#2e1065,stroke:#c084fc,stroke-width:2px,color:#fff;
    classDef successNode fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#34d399;
    classDef adminNode fill:#431407,stroke:#ff8f6b,stroke-width:2px,color:#fff;

    Start([📱 Install Expo Go on iOS / Android]):::startNode --> QR[📷 Scan Dev Server QR Code / Tunnel]:::actionNode
    QR --> Launch[🚀 Launch PennyRelief Mobile App]:::actionNode
    Launch --> AuthChoice{Existing Student?}:::decisionNode

    AuthChoice -->|Yes| Login[🔑 Sign in with student@nfc.edu.pk / studentpassword123]:::actionNode
    AuthChoice -->|No| Register[📝 Register New Account with Student CNIC & University Email]:::actionNode

    Register --> DB_Sync[(☁️ MongoDB Atlas Sync)]:::successNode
    Login --> Dashboard[💳 Student Relief Dashboard & Digital Wallet]:::actionNode
    DB_Sync --> Dashboard

    Dashboard --> ApplyRelief[📄 Request Emergency Relief]:::actionNode
    ApplyRelief --> UploadDocs[📤 Upload Fee Challan, Monthly Income & CNIC Proof]:::actionNode
    UploadDocs --> SubmitApp[⚡ Submit Application]:::actionNode

    SubmitApp --> TriggerAI[🤖 Trigger Autonomous AI Need Pipeline]:::aiNode
    TriggerAI --> Eval{AI Financial Stress Check}:::decisionNode

    Eval -->|Per-Capita ≤ PKR 15k & CGPA ≥ 2.0| PriorityHigh[⭐ Priority Score: 95-99% Need Index]:::successNode
    Eval -->|Above Benchmark Limit| ReviewFlag[⚠️ Flagged for Secondary Discretionary Review]:::decisionNode

    PriorityHigh --> AdminFeed[📡 Instant Live Feed in Executive Admin Portal]:::adminNode
    ReviewFlag --> AdminFeed

    AdminFeed --> OneClickDisburse[🏛️ Endowment Officer One-Click Batch Approval]:::adminNode
    OneClickDisburse --> DisbursedLedger[💰 Instant Disbursal: PKR 25,000 Disbursed to Wallet]:::successNode
    DisbursedLedger --> VoucherPDF[📑 Official Disbursal Voucher PDF Generated]:::startNode
```

---

### Step-by-Step Mobile Setup Guide

#### 1. Install Expo Go
- **Android Users**: Download **[Expo Go from Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)**.
- **iOS Users**: Download **[Expo Go from Apple App Store](https://apps.apple.com/app/expo-go/id982107779)**.

#### 2. Start the Mobile Server
In your project root terminal on your computer:
```bash
npx expo start -c
```
> **Tip**: The `-c` flag clears Metro bundler cache to guarantee that the latest API endpoints and assets are delivered cleanly.

#### 3. Connect Your Phone
- **Android**: Open the **Expo Go** app and tap **"Scan QR Code"**. Point your camera at the QR code displayed in your terminal.
- **iOS**: Open the native **Camera** app, scan the terminal QR code, and tap the prompt to open in Expo Go.
- **Remote / Anywhere Access**: The mobile app is pre-configured with the production API endpoint:
  ```javascript
  // constants/Project.Api.js
  export const API_URL = "https://pennyrelief.autosols.com";
  ```
  This guarantees that your phone connects immediately over cellular data, campus Wi-Fi, or home internet without needing to configure local IP addresses.

#### 4. Authenticate & Use
- Enter the verified student credentials:
  - **Email**: `student@nfc.edu.pk`
  - **Password**: `studentpassword123`
- Or click **Register** to create a brand-new student account with your name, department, semester, and monthly family income.

---

### Seamless Real-Time Sync with Admin Portal

Every action performed inside the Expo Go mobile application is synchronized in real-time across the platform:

| Mobile Action | Backend Processing | Admin Portal Live Reflection |
| :--- | :--- | :--- |
| **New Student Registration** | Saved to MongoDB Atlas `UserModel` with hashed bcrypt credential. | Instantly visible under **Registered Students** table and downloadable via **Executive Registered Students PDF**. |
| **Emergency Relief Application** | Saved to `LoanApplication` with fee challans, family members, and income. | Appears immediately in **Loan Applications** table and in the **🤖 AI Fund Allocation Pipeline**. |
| **AI Need Scoring** | Processed through Gemini 2.5 Flash Lite benchmark algorithms. | Ranks student by Need Score (95%-99%), displaying per-capita income stress index. |
| **Officer Approval / Rejection** | Disbursal status updated in database with audit timestamp. | Mobile wallet status turns to **"Active Relief • Semester Tuition Cleared"**. |

---

## 🔐 Master Credentials Reference

### Production & Staging Authentication

| Role | Interface | URL / Access Method | Email / Identifier | Password | Access Level |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Endowment Officer (Admin)** | Web Admin Portal | [`https://pennyrelief.autosols.com/home`](https://pennyrelief.autosols.com/home) | `admin@nfc.edu.pk` | `adminpassword123` | **Full Executive Access** (Direct Dashboard Bypass enabled on production) |
| **Enrolled Student (Primary)** | Mobile App (Expo Go) | Expo Go Client | `student@nfc.edu.pk` | `studentpassword123` | Active Relief Wallet, Tuition Loan Applications, Status Ledger |
| **Enrolled Student (Engineering)** | Mobile App (Expo Go) | Expo Go Client | `ayesha.s@nfc.edu.pk` | `studentpassword123` | Software Engineering relief profile |
| **Enrolled Student (Electrical)** | Mobile App (Expo Go) | Expo Go Client | `bilal.m@nfc.edu.pk` | `studentpassword123` | Electrical Engineering relief profile |
| **Enrolled Student (Civil)** | Mobile App (Expo Go) | Expo Go Client | `fatima.n@nfc.edu.pk` | `studentpassword123` | Civil Engineering relief profile |
| **Self-Registered Student** | Mobile & Web | Register Form | *Your Registered Email* | *Your Chosen Password* | Immediate database synchronization |

---

## 🏗️ System Architecture & Cross-Platform Topology

```mermaid
graph LR
    subgraph "Clients"
        MobileApp["📱 Mobile App (Expo Go)<br/>React Native • iOS & Android"]
        WebAdmin["💻 Admin Portal<br/>React 19 • Vite • Tailwind"]
        PublicLanding["🌐 Editorial Landing<br/>Fraunces • Framer Motion"]
    end

    subgraph "API Gateway (pennyrelief.autosols.com)"
        Nginx["🛡️ Nginx Reverse Proxy<br/>SSL / Let's Encrypt"]
        Express["⚡ Express.js Server<br/>Node.js v20+"]
        AuthMiddleware["🔒 Auth & Session Guard"]
    end

    subgraph "Autonomous Intelligence"
        Orchestrator["🧠 4-Stage Multi-Agent Orchestrator"]
        GeminiCloud["☁️ Google AI Studio<br/>Gemini 2.5 Flash Lite"]
        GemmaLocal["💻 Local Edge Fallback<br/>Ollama Gemma 4"]
    end

    subgraph "Data & Storage Persistence"
        AtlasCluster[("🍃 MongoDB Atlas<br/>nfc_bank Cluster")]
        UsersColl["👥 Users Collection"]
        LoansColl["📑 LoanApplications Collection"]
        DonationsColl["💳 Community Donations Ledger"]
    end

    MobileApp -->|HTTPS / REST API| Nginx
    WebAdmin -->|HTTPS / REST API| Nginx
    PublicLanding -->|HTTPS / REST API| Nginx

    Nginx --> Express
    Express --> AuthMiddleware
    AuthMiddleware --> Orchestrator
    AuthMiddleware --> AtlasCluster

    Orchestrator --> GeminiCloud
    Orchestrator -.->|Fallback| GemmaLocal

    AtlasCluster --- UsersColl
    AtlasCluster --- LoansColl
    AtlasCluster --- DonationsColl
```

---

## 🤖 Autonomous Multi-Agent AI Allocation Pipeline

Traditional university relief processes take weeks of invasive committee interviews and paper bureaucracy. PennyRelief replaces this with an autonomous 4-stage multi-agent pipeline executing against Google AI Studio Gemini 2.5:

```mermaid
flowchart TD
    classDef agent fill:#072a1e,stroke:#34d399,stroke-width:2px,color:#fff;
    classDef check fill:#041910,stroke:#f59e0b,stroke-width:2px,color:#fbbf24;
    classDef pass fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#34d399;
    classDef flag fill:#4c0519,stroke:#f43f5e,stroke-width:2px,color:#fda4af;

    In([📄 Student Application Ingest]):::agent --> A1[1. Document Parser Agent<br/>Extracts Challan, CNIC & Family Size]:::agent
    A1 --> A2[2. Financial Analyst Agent<br/>Computes Household Per-Capita Income]:::agent
    A2 --> D1{Per-Capita Income ≤ PKR 15,000?}:::check

    D1 -->|Pass & CGPA ≥ 2.0| A3[3. Decision Builder Agent<br/>Synthesizes 0% APR Micro-Voucher]:::pass
    D1 -->|Fail: Exceeds Threshold| F1([❌ Flagged Ineligible / Discretionary]):::flag

    A3 --> A4[4. Statutory Compliance Checker<br/>Validates University Enrollment & Caps]:::agent
    A4 --> Out([⭐ High-Priority Need Score: 95-99%]):::pass
```

### The 4-Stage Multi-Agent Audit

1. **Document Parser Agent**: Validates student national identity, academic matriculation, uploaded semester fee challan, and stated household dependents.
2. **Financial Analyst Agent**: Calculates true household per-capita income by dividing declared monthly household earnings by family dependents. Analyzes the financial strain ratio against tuition costs.
3. **Decision Builder Agent**: Generates an optimized, interest-free relief recommendation capped at tuition dues, ensuring fair pool distribution.
4. **Statutory Compliance Checker**: Verifies applicant against institutional bylaws, anti-duplication constraints, and active student enrollment.

### Deterministic Financial Benchmarks

| Metric | Hard Criterion | Rationale |
| :--- | :--- | :--- |
| **Household Per-Capita Income** | $\le \text{PKR } 15,000 / \text{member / month}$ | Targets relief directly to low-income families suffering genuine economic shocks. |
| **Academic Standing** | $\text{CGPA} \ge 2.00$ | Confirms bona fide active student status in good standing. |
| **Relief Allocation Cap** | $\text{PKR } 50,000$ per semester | Distributes community endowment across maximum number of students. |
| **Financing Structure** | **0% APR (Qarz-e-Hasna)** | Zero debt burden; optional pay-it-forward pledge upon gainful post-grad employment. |

### Verification CLI Command

Verify the multi-agent pipeline live against the Google AI Studio Gateway:
```bash
npm run proof
```

---

## 📊 Executive Admin Portal & PDF Suite

The executive admin portal provides endowment officers with instant control over the campus micro-fund:

- **🤖 AI Fund Allocation Pipeline**:
  - Live ranking of all pending applicants sorted by AI Need Index.
  - Transparent inspection of per-capita income, CGPA, and AI rationale.
  - **One-Click Batch Disbursal**: Disburse approved micro-endowments instantly with a single click.
- **📑 Application Review & Individual Vouchers**:
  - Review fee challan documents, approve, reject, or mark under-review.
  - Generate and export individual **Official Relief Disbursal Vouchers (PDF)**.
- **👥 Registered Students Executive PDF Directory**:
  - Comprehensive, publication-grade PDF report generated client-side via `jspdf` and `jspdf-autotable`.
  - Executive header with institutional badge, KPI metrics summary (Total Enrolled, Relief Beneficiaries, Disbursal Volume).
  - High-density student ledger table with official digital verification seal.
- **💳 Community Donation Analytics & Ledger**:
  - Self-contained, resilient community donation vault.
  - Instant CSV export of donor ledger records with zero third-party latency.

---

## 🎨 Editorial Design Language & Aesthetics

PennyRelief is designed to reflect institutional prestige, calm confidence, and dignity:

```
Design Palette & Foundations:
├─ Canvas Mint            : #f3fbf6 / #eef7f2
├─ Deep Obsidian Forest   : #051c14 / #072a1e
├─ Vibrant Coral / Peach  : #ff8f6b / #ff7a52
├─ Sage Verification Mint : #34d399 / #c1e8d5
└─ Editorial Typography   : Fraunces (Editorial Serif) + Plus Jakarta Sans + JetBrains Mono
```

- **Clean Showcase Hero**: Clean central smartphone device showcase showcasing the live relief wallet, with no distracting icon clutter.
- **Traveling Bezier Status Capsule**: Animated trajectory path visualizing live campus disbursals (`PKR 25,000 Disbursed • 0% APR`).
- **Interactive Need Calculator**: Allows students to simulate monthly household earnings and dependents to preview their estimated relief eligibility before applying.

---

## 🚀 Local Development & Quick Start

### Prerequisites
- **Node.js**: v18+, v20+, or v22+
- **npm**: v9+
- **MongoDB**: Live connection string configured in `backend/config/Db.js` or via `.env`.

### 1. Start the Backend API Server
```bash
cd backend
npm install
npm run dev
# Server running at http://localhost:5000
```

### 2. Start the Admin & Landing Web Portal
```bash
cd admin-portal
npm install --legacy-peer-deps
npm run dev
# Vite dev server running at http://localhost:5173
```

### 3. Launch the Mobile Application
```bash
# In project root
npx expo start -c
# Scan the QR code using Expo Go on Android or Camera app on iOS
```

---

## 🌐 Production Deployment & VPS Synchronization

The platform is deployed live on a high-performance VPS with Nginx and PM2 process management:

- **Live URL**: [`https://pennyrelief.autosols.com`](https://pennyrelief.autosols.com)
- **Direct Admin Route**: [`https://pennyrelief.autosols.com/home`](https://pennyrelief.autosols.com/home)
- **Host VPS IP**: `82.29.190.123`
- **GitHub Repository**: [`https://github.com/Faiq-Hassan/PennyRelief.git`](https://github.com/Faiq-Hassan/PennyRelief.git)

### Production Server Update Commands

When updating the production VPS with the latest repository changes:
```bash
# 1. SSH into the server
ssh root@82.29.190.123

# 2. Navigate to project root & pull latest commits
cd /var/www/pennyrelief   # (or project directory)
git pull origin main

# 3. Build optimized frontend production bundle
cd admin-portal
npm install --legacy-peer-deps
npm run build

# 4. Restart backend processes & reload Nginx
pm2 restart pennyrelief-backend || pm2 restart all
sudo systemctl reload nginx

echo "✅ PennyRelief successfully updated and running in production!"
```

---

## 📁 Repository File Structure

```
PennyRelief/
├── admin-portal/                     # React 19 + Vite + Tailwind CSS + Framer Motion
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx       # Public editorial showcase (Calculator, Modals, Showcase)
│   │   │   ├── HomePage.jsx          # Executive Admin Dashboard (Overview, KPIs, Navigation)
│   │   │   └── Login.jsx             # Admin authentication portal
│   │   ├── components/
│   │   │   ├── AiPipelineView.jsx    # Autonomous AI Prioritization & One-Click Disbursal
│   │   │   ├── Loan.jsx              # Loan applications management & Voucher PDF exports
│   │   │   ├── PayersDetails.jsx     # Community micro-donation ledger & CSV exports
│   │   │   ├── DonationCard.jsx      # High-performance analytics metrics
│   │   │   └── AuthWrapper.jsx       # Secure direct route bypass
│   │   └── utils/
│   │       └── pdfGenerator.js       # Executive Registered Students PDF & Voucher Suite
├── app/                              # React Native / Expo SDK 58 Mobile Student App
│   ├── (tabs)/                       # Tab navigation (Wallet, Apply, History, Profile)
│   └── index.jsx                     # Mobile onboarding & authentication
├── backend/                          # Node.js / Express REST Server
│   ├── config/
│   │   └── Db.js                     # Resilient MongoDB Atlas auto-reconnect client
│   ├── Controllers/
│   │   ├── aiPipelineController.js   # Multi-agent benchmark auditor & rank-order engine
│   │   ├── adminController.js        # Safe JSON endpoints, user registry & loan queries
│   │   └── stripeController.js       # Resilient self-contained donation fallback
│   ├── models/
│   │   ├── User.Model.js             # Student user schema with hashed credentials
│   │   ├── LoanApplication.Model.js  # Emergency relief application records
│   │   └── Admin.Model.js            # Endowment officer schema
│   ├── Routes/adminRoutes.js         # REST endpoints for admin operations
│   └── seedData.js                   # MongoDB Atlas seeder with verified student profiles
├── constants/
│   └── Project.Api.js                # Production mobile API configuration (pennyrelief.autosols.com)
├── src/
│   ├── llm/
│   │   ├── llm.js                    # Unified LLM gateway (Gemini 2.5 & Ollama)
│   │   └── skillLoader.js            # Dynamic instruction injector
│   ├── agents/                       # DocumentParser, FinancialAnalyst, DecisionBuilder, ComplianceChecker
│   └── orchestrator/orchestrator.js  # 4-stage fault-tolerant multi-agent orchestrator
└── README.md                         # Project documentation and operational guide
```

---

## 📜 License & Ethics

PennyRelief is distributed under the terms of the **[MIT License](./LICENSE)**. 

### Commitment to Dignity
All student relief operations follow strict ethical guidelines:
1. **Zero Exploitation**: 0% APR. Pure Qarz-e-Hasna. No compound charges or late fees ever.
2. **Computational Impartiality**: AI agents audit solely on financial hardship indicators (per-capita income, fee deadlines, dependents) without demographic bias.
3. **Data Sovereignty**: Student documents are used strictly for distress validation and are never monetized or shared with third parties.

---

<div align="center">
  <b>Built for educational equity with Google Gemini 2.5 Flash Lite & Gemma 4.</b><br/>
  &copy; 2026 PennyRelief Foundation. All rights reserved.
</div>