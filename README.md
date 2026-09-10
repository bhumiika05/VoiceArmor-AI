# VoiceArmor AI — Voice Impersonation Detection & Defense System

> **Tagline:** Detect • Verify • Assess • Prevent  
> **Core USP:** *"Don't just detect the fake voice — prevent the impersonation attack."*

---

## 📌 Problem Statement Overview

* **Problem Statement ID:** SIH26104
* **Problem Title:** AI-Powered Real-Time Detection and Prevention of Voice Cloning Impersonation Attacks
* **Organization:** AICTE
* **Category:** Software
* **Theme:** Miscellaneous

---

## 🎯 The Four Main USPs

1. **USP 1 — REAL-TIME DETECTION:** Detects suspicious cloned voices during ongoing calls rather than post-incident analysis.
2. **USP 2 — DETECTION + PREVENTION:** Does not stop at *"This voice is fake"*. Executes an active defense loop:  
   $$\text{Detect} \longrightarrow \text{Verify Speaker} \longrightarrow \text{Assess Impersonation Risk} \longrightarrow \text{Preventive Security Action}$$
3. **USP 3 — DYNAMIC RISK INTELLIGENCE:** Uses a continuously updating **0–100 Impersonation Risk Score** instead of binary REAL / FAKE labels.
4. **USP 4 — MULTILINGUAL + PRIVACY-AWARE:** Built for Indian multilingual voice scenarios (English, Hindi, etc.) while minimizing raw audio storage by keeping only normalized vector embeddings.

---

## 🔄 Core Product Flow

```
🎙️ AUDIO INPUT (Microphone / File Upload)
       │
       ▼
🤖 AI DEEPFAKE DETECTION (Spectral / Prosody / Vocoder Artifacts)
       │
       ▼
🔐 SPEAKER VERIFICATION (Vector Embeddings & Cosine Distance)
       │
       ▼
⚠️ IMPERSONATION RISK CALCULATION (Multi-Factor Dynamic Scoring)
       │
       ▼
📊 DYNAMIC RISK SCORE (0 - 100 Gauge)
       │
       ▼
🛡️ PREVENTIVE ACTION (Monitor / Warn / Verify / Restrict)
       │
       ▼
📋 INCIDENT REPORT & CRYPTOGRAPHIC EVIDENCE (SHA-256 PDF Export)
```

---

## 🏗️ Technical Architecture

### **Frontend**
* **Framework:** React 18 + Vite
* **Styling:** Tailwind CSS + Custom Cybersecurity SOC Dark Glassmorphism
* **Visualization:** Canvas HTML5 Web Audio API Waveform & Recharts Analytics
* **Icons:** Lucide React

### **Backend & AI Pipeline**
* **Framework:** FastAPI (Python 3.11) + Uvicorn
* **Database:** SQLite with SQLAlchemy ORM
* **Deepfake Engine:** Model Mode (PyTorch / WavLM / wav2vec2), Lightweight Mode (Librosa MFCC + Pitch/Prosody + Scikit-Learn), SIH Demo Mode
* **Speaker Verification:** Acoustic vector embeddings & Cosine Distance matching
* **Forensic Engine:** Cryptographic SHA-256 evidence hashing + ReportLab PDF Report Generation

---

## 🚦 Impersonation Risk Levels & Security Actions

| Risk Score | Risk Level | Status Indicator | Automated Security Action |
| :--- | :--- | :--- | :--- |
| **0 – 20** | 🟢 LOW | Normal | **MONITOR:** Continue monitoring call channel |
| **21 – 50** | 🟡 MODERATE | Caution | **WARN:** Advise operator of acoustic anomalies |
| **51 – 75** | 🟠 HIGH | Warning | **REQUIRE SECONDARY VERIFICATION:** Issue challenge phrase |
| **76 – 100** | 🔴 CRITICAL | Threat | **ALERT + RESTRICT SENSITIVE ACTION:** Block financial / OTP request |

---

## ⚙️ Operational Engine Modes & Graceful Fallback

VoiceArmor automatically selects the optimal processing engine based on host hardware capabilities:

1. **MODE 1 — AI MODEL MODE:** Neural inference using PyTorch / WavLM / wav2vec2.
2. **MODE 2 — LIGHTWEIGHT MODE:** Acoustic feature extraction using Librosa (MFCC, Spectral Centroid, Zero Crossing Rate, Pitch Contours) and deterministic classification.
3. **MODE 3 — DEMO MODE:** Controlled SIH presentation mode for instant evaluation without external dependencies.

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
* Python 3.11+
* Node.js v18+ & npm

### 2. Backend Setup
```bash
# Clone or navigate to directory
cd VoiceArmor

# Install python dependencies
pip install -r requirements.txt

# Run FastAPI backend server
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be accessible at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install node packages
npm install

# Start Vite dev server
npm run dev
```
Frontend will be accessible at: `http://localhost:3000`

---

## 🐳 Docker Deployment

```bash
# Build and run single-container or composed stack
docker-compose up --build
```

---

## 📑 Research & Dataset References

* **Primary Spoofing Reference:** ASVspoof 2021 Challenge dataset (`https://www.asvspoof.org/`)
* **Vocoder Fingerprint Papers:** High-frequency phase spectral analysis in neural speech synthesis (HiFi-GAN, WaveGlow, Tacotron2).

---

## 🧪 Testing

Run backend pytest suite:
```bash
python -m pytest tests/ -v
```

---

## 🛡️ License & Disclosures

Developed for the **Smart India Hackathon (SIH26104)**.  
*Performance metrics displayed in Demo Mode represent simulated presentation metrics for controlled SIH evaluation.*
