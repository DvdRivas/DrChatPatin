# DrChatPatin

![banner](/images/banner-drchatpatin.jpg)

**A Decentralized AI-Powered Medical Assistant for Rare Disease Diagnosis on the Internet Computer Protocol**

[![DOI](https://zenodo.org/badge/1202424664.svg)](https://doi.org/10.5281/zenodo.19444007)

## Tech Stack

### Frontend & Web
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=flat&logo=mui&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat&logo=sass&logoColor=white)

### Web2 / Backend
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Poe](https://img.shields.io/badge/Poe-AI-5A4FCF?style=flat&logo=chatbot&logoColor=white)
![Milvus](https://img.shields.io/badge/Milvus-Vector_DB-00A1EA?style=flat)
![Cryptography](https://img.shields.io/badge/Cryptography-000000?style=flat&logo=letsencrypt&logoColor=white)

### AI / Machine Learning
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat&logo=pytorch&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=flat&logo=tensorflow&logoColor=white)
![HuggingFace](https://img.shields.io/badge/Transformers-FFD21E?style=flat&logo=huggingface&logoColor=black)
![SentenceTransformers](https://img.shields.io/badge/SentenceTransformers-4B8BBE?style=flat)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat&logo=numpy&logoColor=white)

### Web3
![Internet Computer](https://img.shields.io/badge/Internet_Computer-522785?style=flat&logo=dfinity&logoColor=white)
![Motoko](https://img.shields.io/badge/Motoko-417240?style=flat)
![MOPS](https://img.shields.io/badge/MOPS-000000?style=flat)
![NFID](https://img.shields.io/badge/NFID-1A1A1A?style=flat)

### Tooling
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-CB3837?style=flat&logo=npm&logoColor=white)
![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=flat&logo=ubuntu&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05033?style=flat&logo=git&logoColor=white)
![Markdown](https://img.shields.io/badge/Markdown-000000?style=flat&logo=markdown&logoColor=white)

## Abstract

DrChatPatin is a decentralized medical assistant for differential diagnosis of common and rare diseases. The clinician-facing interface and encrypted conversation storage are deployed on the Internet Computer Protocol (ICP) through dedicated canisters, while AI inference is handled through an external API layer. The system combines secure web-based interaction, persistent encrypted conversation management, and AI-assisted diagnostic support in a hybrid Web3/Web2 architecture.

---

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [API](#api)
- [Technology Stack](#technology-stack)
- [Deployed Canisters](#deployed-canisters)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Build & Deployment](#build--deployment)
- [Available Scripts](#available-scripts)
- [Environment Configuration](#environment-configuration)
- [Motoko Dependencies](#motoko-dependencies)
- [Supplementary Material](#supplementary-material)
- [References](#references)

---

## Overview

DrChatPatin addresses the need for AI-assisted support in the differential diagnosis of rare diseases through a secure conversational interface. Its core Web3 components, including the user interface and encrypted conversation storage, are deployed as ICP canisters. A dedicated external API layer connects the application to the diagnostic inference engine. This architecture combines decentralized persistence and identity management with flexible AI model integration.

Key properties of the system:

- **Decentralized execution**: Both the user interface and conversation storage logic are deployed as ICP canisters, ensuring no single point of failure.
- **Persistent conversation history**:Interactions are encrypted and stored on-chain through the backend canister.
- **External AI integration**: A dedicated API layer connects the application to an external AI model, enabling intelligent diagnostic responses.
- **Voice interaction support**: The application supports speech-to-text input, improving accessibility in clinical environments.
- **Secure rendering**: AI responses are rendered as sanitized Markdown to prevent injection vulnerabilities.
- **Internet Identity integration via NFID**: User authentication is handled by NFID (Identity Provider), providing pseudonymous, cryptographically secure login.

---

## System Architecture

The application follows a three-part architecture composed of two ICP canisters and an external API layer for AI inference.

![Diagram-Arquitecture](/images/Arquitecture.png)

The frontend canister serves the React-based user interface as static assets. The backend canister, written in Motoko, manages conversation state and persistent storage. The API layer handles communication with an external AI model responsible for generating diagnostic responses.

---

## API

DrChatPatin includes a dedicated API layer that serves as the bridge between the ICP canisters and the external AI diagnostic engine. This module is responsible for forwarding user queries, receiving model responses, and returning structured data to the frontend for rendering.

### Responsibilities

- Receive conversation context
- Extract information from RAG (if enabled)
- Process model responses from either a local model or a third-party API
- Parse and return AI-generated responses to the frontend

### Configuration

API credentials and endpoint URLs can be managed via environment variables. Before running the project locally, ensure the following variables are defined in your `.env` file:

```env
# AI model endpoint
AI_API_URL=<your_api_endpoint>

# API authentication key
AI_API_KEY=<your_api_key>
```

---

## Technology Stack

### Web3 / Frontend

| Layer | Technology | Version |
|---|---|---|
| **Frontend Framework** | React + JavaScript | — |
| **Styling** | SCSS + Material UI (MUI) | MUI v6.4.x |
| **Markdown Rendering** | marked | v15.0.x |
| **HTML Sanitization** | DOMPurify | v3.2.x |
| **Voice Input** | react-speech-recognition | v4.0.x |
| **Voice Input (hook)** | react-hook-speech-to-text | v0.8.x |

---

### Web3 / Blockchain

| Layer | Technology | Version |
|---|---|---|
| **Smart Contract Language** | Motoko | Base 0.13.7 |
| **Blockchain Platform** | Internet Computer Protocol (ICP) | DFX 0.25.1 |
| **Package Manager (Motoko)** | MOPS | 0.9.1 |
| **Authentication** | NFID | Remote canister |

---
### Web2 / API 

| Layer | Technology | Version |
|---|---|---|
| **Language Runtime** | Python | 3.10.12 |
| **API Framework** | FastAPI | 0.129.0 |
| **LLM SDK** | OpenAI SDK | 0.20.0 |
| **Transformers** | transformers | 4.51.0 |
| **Milvus Lite** | pymilvus | 2.5.6 |
| **Cryptography** | cryptography | 44.0.1 |

---

### AI / ML Stack

| Layer | Technology | Version |
|---|---|---|
| **Deep Learning (Primary)** | PyTorch | 2.6.0 |
| **Tensor Library** | NumPy | 1.24.0 |
| **Alternative DL Framework** | TensorFlow | 2.16.1 |
| **Embeddings / NLP** | sentence-transformers | 4.1.0 |

---

### Runtime & Tooling

| Layer | Technology | Version |
|---|---|---|
| **JavaScript Runtime** | Node.js | 22.14.0 |
| **Package Manager** | npm | ≥ 7.0.0 |
| **OS (Recommended)** | Ubuntu | ≥ 22.04 |

---

## Deployed Canisters

The application is live on the ICP mainnet. The following canister identifiers correspond to the production deployment:

| Canister | ID | Network |
|---|---|---|
| `DrChatPatin_backend` | `z552i-qaaaa-aaaad-qhqaq-cai` | `ic` (mainnet) |
| `DrChatPatin_frontend` | `zu6ru-giaaa-aaaad-qhqba-cai` | `ic` (mainnet) |

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
│   │   └── main.mo                  # Motoko backend canister (conversation logic & storage)
│   └── DrChatPatin_frontend/
│       └── dist/                    # Compiled frontend assets (served by asset canister)
├── canister_ids.json                # Mainnet canister IDs
├── dfx.json                         # DFX canister configuration
├── mops.toml                        # Motoko package dependencies
├── package.json                     # Node.js workspace configuration
├── package-lock.json
├── tsconfig.json                    
├── README.md
API/
├── API_DrChatPatin.py
└── README.md
```

---

## Prerequisites

Before setting up the project locally, ensure the following tools are installed:

- **Node.js** `>= 16.0.0` — [Download](https://nodejs.org/)
- **npm** `>= 7.0.0` — Included with Node.js
- **DFX SDK** — The DFINITY Canister SDK. [Installation Guide](https://internetcomputer.org/docs/current/developer-docs/setup/install)
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

### 3. Configure environment variables

Create a `.env` file in the project root and add the required API credentials:

```bash
cp .env.example .env
# Edit .env with your API endpoint and key
```

### 4. Start the local ICP replica

```bash
dfx start --background
```

### 5. Deploy canisters to the local replica

```bash
dfx deploy
```

Once deployment completes, the application will be available at:

```
http://localhost:4943?canisterId={asset_canister_id}
```

### 6. Start the frontend development server (optional)

```bash
# Regenerate Candid declarations (recommended before starting)
npm run generate

# Start the development server
npm start
```

The development server runs at `http://localhost:8080` and proxies all canister API requests to the local replica at port `4943`.

---

## Production Deployment

To deploy to the ICP mainnet:

```bash
dfx deploy --network ic
```

---

## Available Scripts
> from DrChatPatin_frontend/src/ directory

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
## Supplementary Material

The complete list of 56 queries, along with their corresponding ICD-10 diagnoses used for evaluation, is available in Supplementary Data S1 at the repository DrChatPatin-Supplementary-Data (https://github.com/DvdRivas/DrChatPatin-Supplementary-Data). 

Additionally, the evaluation code (SystemEvaluation.py), together with the corresponding results per branch, is provided in Supplementary Data S2 in the same repository.

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
- NORD Rare Diseases Resources: [https://www.fda.gov/patients/rare-diseases-fda](https://www.fda.gov/patients/rare-diseases-fda)
- Database Used to Create RAG: [https://github.com/DvdRivas/NDB](https://github.com/DvdRivas/NDB)
- POE API: [https://poe.com/api](https://poe.com/api)

---

*Repository maintained by [DvdRivas](https://github.com/DvdRivas). Deployed on the Internet Computer mainnet.*