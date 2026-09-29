<div align="center">

<h1>🛡️ QRGuard</h1>
<p><strong>AI-Powered QR Code & URL Phishing Detection System</strong></p>

<p>
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Flask-2.3-000000?style=for-the-badge&logo=flask&logoColor=white" />
  <img src="https://img.shields.io/badge/scikit--learn-RandomForest-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python" />
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js" />
</p>

</div>

---

## 📌 Overview

**QRGuard** is a full-stack, AI-powered cybersecurity web application that protects users from phishing attacks and malicious content hidden inside QR codes and suspicious URLs.

QR codes have become a popular vector for phishing attacks — a malicious link disguised as a harmless QR code can steal credentials, install malware, or redirect users to fraudulent sites. QRGuard uses a trained **Random Forest Machine Learning model** combined with real-time URL feature extraction to instantly classify any QR code or link as **Safe** or **Malicious**.

> 🎓 Built as a final-year college project (PBL) demonstrating practical applications of Machine Learning in cybersecurity.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📷 **QR Image Upload** | Drag & drop or browse a QR code image for instant analysis |
| 🎥 **Live Camera Scanner** | Point your webcam at a QR code and capture it in real-time |
| 🔗 **URL Checker** | Paste any suspicious link and get an AI-powered verdict instantly |
| 🤖 **ML Classification** | Random Forest model classifies URLs as Safe or Malicious |
| 📊 **Detection Dashboard** | View your complete scan history stored locally |
| 🗄️ **Database Lookup** | Cross-references against known safe/malicious URL databases (MongoDB) |
| 🌙 **Dark Cyber Theme** | Premium glassmorphism UI with neon accents and smooth animations |
| 📱 **Responsive Design** | Works seamlessly on mobile, tablet, and desktop |
| ⚡ **Real-time Results** | Instant threat analysis with confidence indicators |

---

## 🖥️ Application Screenshots

> The application features a premium dark cybersecurity aesthetic with glassmorphism panels, neon cyan/blue accents, and smooth Framer Motion animations.

**Home Page** — Three detection modes: Upload QR, Camera Scan, URL Check  
**Result Cards** — Color-coded Safe (green) / Malicious (red) with security recommendations  
**Dashboard** — Local history of all scanned QR codes and URLs  

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React.js 18** | UI component framework |
| **Vite 5** | Next-generation build tool |
| **Tailwind CSS 3** | Utility-first styling |
| **Framer Motion** | Smooth animations & transitions |
| **Axios** | HTTP API requests |
| **React Router DOM** | Client-side routing |
| **React Webcam** | Camera access for live scanning |
| **Lucide React** | Modern icon library |

### Backend
| Technology | Purpose |
|---|---|
| **Flask** | Python REST API framework |
| **Flask-CORS** | Cross-Origin Resource Sharing |
| **OpenCV** | QR code detection and decoding |
| **Pillow** | Image processing |
| **scikit-learn** | Random Forest ML model |
| **Pandas / NumPy** | Data manipulation for feature extraction |
| **MongoDB / PyMongo** | URL threat intelligence database |
| **joblib** | Model serialization (.pkl) |

---

## 🧠 Machine Learning Model

The core of QRGuard is a **Random Forest Classifier** trained on a large dataset of safe and malicious URLs.

### Feature Extraction Pipeline
The model extracts the following features from every URL before classification:

- URL length and character count
- Number of dots, slashes, and special characters
- Presence of IP address in URL
- HTTPS vs HTTP scheme detection
- Domain length and TLD analysis
- Presence of suspicious keywords (login, verify, secure, etc.)
- Subdomain count
- Path depth and query string analysis

### Prediction Flow
```
QR Image / URL Input
        ↓
   QR Decode (OpenCV)
        ↓
   URL Normalization
        ↓
   DB Lookup (MongoDB) ──→ Known Safe/Malicious → Return Result
        ↓ (if unknown)
   Feature Extraction
        ↓
   Random Forest Predict
        ↓
   Safe / Malicious Result
```

---

## 📁 Project Structure

```
QRGuard/
│
├── backend/
│   ├── models/
│   │   └── random_forest_model.pkl    # Pre-trained ML model
│   ├── utils/
│   │   └── feature_extraction.py      # URL feature engineering
│   ├── app.py                          # Flask server & API endpoints
│   └── requirements.txt               # Python dependencies
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx              # Top navigation bar
    │   │   ├── Footer.jsx              # Footer with links
    │   │   ├── QRUpload.jsx            # Drag & drop image uploader
    │   │   ├── QRScanner.jsx           # Webcam scanner component
    │   │   ├── URLChecker.jsx          # Direct URL input form
    │   │   └── ResultCard.jsx          # Safe/Malicious result display
    │   ├── layouts/
    │   │   └── MainLayout.jsx          # App shell with animated background
    │   ├── pages/
    │   │   ├── Home.jsx                # Main scanner page (3 tabs)
    │   │   ├── Dashboard.jsx           # Detection history dashboard
    │   │   ├── About.jsx               # Project info & tech stack
    │   │   └── NotFound.jsx            # 404 error page
    │   ├── services/
    │   │   └── api.js                  # Axios API abstraction layer
    │   ├── App.jsx                     # Router setup
    │   ├── main.jsx                    # Entry point
    │   └── index.css                   # Global styles & Tailwind directives
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js** v18+
- **Python** v3.8+
- **MongoDB** (optional — app works without it via ML fallback)

### 1. Clone the Repository

```bash
git clone https://github.com/harishv06/QRGuard.git
cd QRGuard
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file inside `backend/` (optional):
```env
MONGODB_URI=mongodb://localhost:27017/QRGuard
MONGODB_DB=QRGuard
PORT=5000
```

Start the Flask server:
```bash
python app.py
```
> Backend runs on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

Create a `.env` file inside `frontend/` (optional):
```env
VITE_API_URL=http://localhost:5000
```

Start the Vite dev server:
```bash
npm run dev
```
> Frontend runs on **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |
| `POST` | `/scan` | Decode & classify QR code image (Base64) |
| `POST` | `/analyze-url` | Directly classify a URL string |
| `POST` | `/checksafe-url` | Check if URL is in safe database |
| `POST` | `/checkmalicious-url` | Check if URL is in malicious database |
| `POST` | `/report-url` | Report a URL as malicious |

### Example Request — Analyze URL
```bash
curl -X POST http://localhost:5000/analyze-url \
  -H "Content-Type: application/json" \
  -d '{"url": "http://free-prize-winner.xyz/claim"}'
```

### Example Response
```json
{
  "status": "malicious",
  "url": "http://free-prize-winner.xyz/claim"
}
```

---

## 🔐 Security Notes

- All QR images are processed **server-side** and not stored
- Only the extracted **URL string** is used for ML inference
- CORS is configured to restrict API access
- MongoDB is gracefully bypassed if unavailable — the ML model handles all predictions independently

---

## 🚀 Future Enhancements

- [ ] User authentication & personal history sync
- [ ] Browser extension for automatic QR scanning
- [ ] Confidence score % displayed in results
- [ ] Bulk URL CSV upload and batch analysis
- [ ] Integration with VirusTotal / Google Safe Browsing APIs
- [ ] PWA support for mobile offline scanning

---

## 🪪 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ as a Final Year PBL Project</p>
  <p><strong>QRGuard</strong> — Scan Smart. Stay Safe.</p>
</div>
