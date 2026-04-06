# DrChatPatin

![banner](/images/banner-drchatpatin.jpg)

**A Decentralized AI-Powered Medical Assistant for Rare Disease Diagnosis on the Internet Computer Protocol**


## Abstract

DrChatPatin is a decentralized application (dApp) designed to assist healthcare professionals and patients in the preliminary diagnosis of rare diseases, following diagnostic criteria aligned with the U.S. Food and Drug Administration (FDA) standards. The system operates entirely on the **Internet Computer Protocol (ICP)**, ensuring data immutability, censorship resistance, and persistent conversation storage through on-chain canister smart contracts. The frontend and backend components are co-deployed on the ICP network, eliminating reliance on centralized cloud infrastructure.

---

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Deployed Canisters](#deployed-canisters)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Build & Deployment](#build--deployment)
- [Available Scripts](#available-scripts)
- [Environment Configuration](#environment-configuration)
- [Motoko Dependencies](#motoko-dependencies)
- [References](#references)

---

## Overview

Rare diseases affect a disproportionately small patient population, which historically has led to limited diagnostic tooling and clinical decision support. DrChatPatin addresses this gap by providing an AI-assisted conversational interface capable of guiding diagnostic reasoning according to established FDA rare disease classifications.

Key properties of the system:

- **Decentralized execution**: Both the user interface and conversation storage logic are deployed as ICP canisters, ensuring no single point of failure.
- **Persistent conversation history**: Patient-provider interactions are stored immutably on-chain via the backend canister.
- **Voice interaction support**: The application supports speech-to-text input, improving accessibility in clinical environments.
- **Secure rendering**: AI responses are rendered as sanitized Markdown to prevent injection vulnerabilities.
- **Internet Identity integration**: User authentication is handled by DFINITY's Internet Identity canister, providing pseudonymous, cryptographically secure login without passwords.

---

## System Architecture

The application follows a two-canister architecture deployed on the Internet Computer mainnet:

```
┌─────────────────────────────────────────────────┐
│              Internet Computer (ICP)            │
│                                                 │
│  ┌──────────────────────┐  ┌─────────────────┐  │
│  │  DrChatPatin_frontend│  │ DrChatPatin_    │  │
│  │  (Asset Canister)    │◄─►│ backend        │  │
│  │                      │  │ (Motoko Canister)│ │
│  │  React + TypeScript  │  │                 │  │
│  │  MUI v6 + SCSS       │  │ Conversation    │  │
│  └──────────────────────┘  │ Storage & Logic │  │
│            ▲               └─────────────────┘  │
│            │                                    │
│  ┌─────────┴──────────┐                         │
│  │  Internet Identity │                         │
│  │   (Auth Canister)  │                         │
│  └────────────────────┘                         │
└─────────────────────────────────────────────────┘
```

The frontend canister serves the React-based user interface as static assets. The backend canister, written in Motoko, manages conversation state and persistent storage. Authentication delegates to the Internet Identity canister (`rdmx6-jaaaa-aaaaa-aaadq-cai`), maintained by the DFINITY Foundation.

---

## Technology Stack

### Blockchain & Infrastructure

| Technology | Role | Version / ID |
|---|---|---|
| Internet Computer Protocol (ICP) | Decentralized application runtime | Mainnet |
| DFX SDK | Canister deployment & local replica | v1 |
| Internet Identity | Cryptographic authentication canister | `rdmx6-jaaaa-aaaaa-aaadq-cai` |

### Backend

| Technology | Role | Version |
|---|---|---|
| Motoko | Smart contract language (ICP-native) | — |
| `base` | Motoko standard library | 0.13.7 |
| `map` | High-performance on-chain hash map | 9.0.1 |
| MOPS | Motoko package manager | — |

### Frontend

| Technology | Role | Version |
|---|---|---|
| React | UI component framework | — |
| TypeScript | Type-safe JavaScript | — |
| Material UI (MUI) | Component library | 6.4.x |
| Emotion (`@emotion/react`, `@emotion/styled`) | CSS-in-JS (MUI peer dependency) | 11.14.x |

### Styling

| Technology | Role | Share |
|---|---|---|
| SCSS | Custom stylesheet authoring | 34.5% of codebase |

### Libraries

| Technology | Role | Version |
|---|---|---|
| marked | Markdown-to-HTML renderer | 15.0.x |
| DOMPurify | HTML sanitizer (XSS prevention) | 3.2.x |
| react-speech-recognition | Voice-to-text input | 4.0.x |
| react-hook-speech-to-text | Speech-to-text React hook | 0.8.x |

### Tooling & Runtime

| Technology | Role | Requirement |
|---|---|---|
| Node.js | JavaScript runtime | ≥ 16.0.0 |
| npm | Package manager | ≥ 7.0.0 |
| dotenv | Environment variable management | 16.4.x |

---

## Deployed Canisters

The application is live on the ICP mainnet. The following canister identifiers correspond to the production deployment:

| Canister | ID | Network |
|---|---|---|
| `DrChatPatin_backend` | `z552i-qaaaa-aaaad-qhqaq-cai` | `ic` (mainnet) |
| `DrChatPatin_frontend` | `zu6ru-giaaa-aaaad-qhqba-cai` | `ic` (mainnet) |
| `internet_identity` | `rdmx6-jaaaa-aaaaa-aaadq-cai` | `ic` (mainnet, remote) |

The live frontend is accessible at:

```
https://zu6ru-giaaa-aaaad-qhqba-cai.icp0.io
```

---

## Repository Structure

```
DrChatPatin/
├── src/
│   ├── DrChatPatin_backend/
│   │   └── main.mo                  # Motoko backend canister (conversation logic)
│   └── DrChatPatin_frontend/
│       └── dist/                    # Compiled frontend assets (served by asset canister)
├── canister_ids.json                # Mainnet canister IDs
├── dfx.json                         # DFX canister configuration
├── mops.toml                        # Motoko package dependencies
├── package.json                     # Node.js workspace configuration
├── package-lock.json
├── tsconfig.json                    # TypeScript compiler configuration
└── README.md
```

---

## Prerequisites

Before setting up the project locally, ensure the following tools are installed:

- **Node.js** `>= 16.0.0` — [Download](https://nodejs.org/)
- **npm** `>= 7.0.0` — Included with Node.js
- **DFX SDK** — The DFINITY Canister SDK, required for local ICP replica management and canister deployment. [Installation Guide](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- **MOPS** — Motoko package manager. [Installation Guide](https://mops.one/docs/install)

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/DvdRivas/DrChatPatin.git
cd DrChatPatin
```

### 2. Install Node.js dependencies

```bash
npm install
```

### 3. Start the local ICP replica

```bash
dfx start --background
```

This starts a local replica of the Internet Computer running in the background.

### 4. Deploy canisters to the local replica

```bash
dfx deploy
```

This command compiles the Motoko backend canister, builds the frontend assets, and deploys both to the local replica. It also auto-generates the Candid interface declarations used by the frontend to communicate with the backend.

Once deployment completes, the application will be available at:

```
http://localhost:4943?canisterId={asset_canister_id}
```

Replace `{asset_canister_id}` with the canister ID printed by the `dfx deploy` output.

### 5. Start the frontend development server (optional)

For frontend hot-reloading during development:

```bash
# Regenerate Candid declarations (recommended before starting)
npm run generate

# Start the development server
npm start
```

The development server runs at `http://localhost:8080` and proxies all canister API requests to the local replica at port `4943`.

---

## Build & Deployment

To compile the full project for production:

```bash
npm run build
```

To deploy to the ICP mainnet, ensure your DFX identity is configured and funded with cycles, then run:

```bash
dfx deploy --network ic
```

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| Start dev server | `npm start` | Starts the Webpack development server at port 8080 |
| Build | `npm run build` | Compiles frontend assets for production |
| Pre-build | `npm run prebuild` | Runs workspace pre-build hooks |
| Generate declarations | `npm run generate` | Regenerates Candid interface declarations from deployed canisters |
| Test | `npm test` | Runs the test suite across all workspaces |
| DFX help | `dfx help` | Displays DFX SDK command reference |
| Canister help | `dfx canister --help` | Displays canister management commands |

---

## Environment Configuration

### When hosting outside of DFX

If the frontend is served without DFX (e.g., via a CDN or custom web server), the application must be configured to avoid fetching the ICP root key in production. Use one of the following approaches:

**Option A — Webpack environment variable:**

```bash
DFX_NETWORK=ic npm run build
```

**Option B — `dfx.json` override:**

In `dfx.json`, set the `env_override` property for the relevant canister declarations:

```json
"declarations": {
  "env_override": "ic"
}
```

**Option C — Custom actor constructor:**

Implement a custom `createActor` constructor that explicitly targets the mainnet host without relying on `process.env.DFX_NETWORK`.

---

## Motoko Dependencies

Backend canister dependencies are managed via **MOPS** and declared in `mops.toml`:

| Package | Version | Purpose |
|---|---|---|
| `base` | `0.13.7` | Motoko standard library (data structures, primitives) |
| `map` | `9.0.1` | High-performance hash map implementation for on-chain storage |

---

## References

- Internet Computer Protocol Documentation: [https://internetcomputer.org/docs](https://internetcomputer.org/docs)
- DFINITY Developer Quick Start: [https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- Motoko Programming Language Guide: [https://internetcomputer.org/docs/current/motoko/main/motoko](https://internetcomputer.org/docs/current/motoko/main/motoko)
- Motoko Language Reference: [https://internetcomputer.org/docs/current/motoko/main/language-manual](https://internetcomputer.org/docs/current/motoko/main/language-manual)
- MOPS Package Registry: [https://mops.one](https://mops.one)
- Internet Identity: [https://identity.ic0.app](https://identity.ic0.app)
- FDA Rare Diseases Resources: [https://www.fda.gov/patients/rare-diseases-fda](https://www.fda.gov/patients/rare-diseases-fda)
- DOMPurify: [https://github.com/cure53/DOMPurify](https://github.com/cure53/DOMPurify)

---

*Repository maintained by [DvdRivas](https://github.com/DvdRivas). Deployed on the Internet Computer mainnet.*