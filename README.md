# FraudWatch

FraudWatch is a full-stack machine learning application for assessing fraud risk in financial transactions.

It combines a trained machine learning model, a FastAPI prediction service, and a responsive React dashboard. The application returns a relative fraud-risk score, prediction label, risk level, review recommendation, and contextual risk factors.

> FraudWatch is a portfolio and educational project. Its predictions should support human review, not automatically approve, reject, or block real transactions.

## Features

- Interactive transaction fraud analysis
- Relative fraud-risk scoring
- Fraud or legitimate prediction
- Low, medium, high, and critical risk levels
- Human-review recommendations
- Contextual risk factors
- Browser-based analysis history
- Search, filtering, sorting, and selective history deletion
- Model evaluation dashboard
- Confusion matrix visualization
- Permutation feature importance
- Validation model comparison
- Responsive desktop and mobile navigation
- Interactive FastAPI documentation

## Machine Learning Results

The deployed champion model is a Histogram Gradient Boosting classifier evaluated on a frozen chronological test set.

| Metric | Result |
|---|---:|
| Precision | 74.94% |
| Recall | 74.17% |
| F1 Score | 74.55% |
| PR-AUC | 80.02% |
| Decision threshold | 0.9797 |
| Test transactions | 555,719 |
| Known fraud cases | 2,145 |
| Detected fraud cases | 1,591 |
| Predicted alerts | 2,123 |
| Alert rate | 0.382% |
| Test inference time | 2.39 seconds |
| Throughput | Approximately 232K transactions/second |

### Final Test Confusion Matrix

| Actual / Predicted | Legitimate | Fraud |
|---|---:|---:|
| Legitimate | 553,042 | 532 |
| Fraud | 554 | 1,591 |

The high decision threshold reduces unnecessary alerts while retaining useful fraud detection performance.

Model scores represent relative fraud risk and are not calibrated probabilities.

## Privacy and Responsible AI

FraudWatch applies several privacy-aware and responsible-use decisions:

- Customer name is not collected.
- Card number is not collected.
- Date of birth is not collected.
- Customer age was removed from the deployed model after an ablation study.
- The model was evaluated on synthetic transaction data.
- High-risk predictions are intended for trained human review.
- Predictions should not be treated as final financial decisions.
- Model limitations are displayed directly in the interface.

## Application Pages

### Landing Page

Introduces the project, core performance metrics, system workflow, and responsible AI principles.

### Detection Overview

Displays final test metrics, fraud activity, category risk information, model performance, and recent browser analyses.

### Analyze Transaction

Allows users to submit transaction and location information to the FastAPI prediction service.

The result includes:

- Prediction label
- Fraud-risk score
- Decision threshold
- Risk level
- Review recommendation
- Contextual risk factors

### Review History

Stores completed analyses locally in the browser and provides:

- Search
- Prediction filtering
- Risk filtering
- Sorting
- Individual record details
- Single-record deletion
- Multiple-record deletion
- Full-history clearing

No analysis history is uploaded to a user account or remote history service.

### Model Insights

Presents:

- Champion model summary
- Final test metrics
- Confusion matrix
- Permutation feature importance
- Validation model comparison
- Privacy decisions
- Model limitations
- Human-review policy

## Architecture

```text
React + TypeScript frontend
        |
        | HTTP / JSON
        v
FastAPI prediction API
        |
        v
Feature engineering pipeline
        |
        v
Histogram Gradient Boosting model
        |
        v
Prediction, score, risk level,
review recommendation, and risk factors
```

## Technology Stack

### Machine Learning

- Python 3.12
- pandas
- NumPy
- scikit-learn
- imbalanced-learn
- joblib

### Backend

- FastAPI
- Pydantic
- pydantic-settings
- Uvicorn
- SQLAlchemy

### Frontend

- React
- TypeScript
- Vite
- React Router
- Recharts
- Lucide React

### Testing and Quality

- pytest
- Ruff
- ESLint
- TypeScript compiler
- Git

## Project Structure

```text
FRAUDWATCH/
├── ai/                         # Training and feature-engineering code
├── backend/
│   └── app/
│       ├── api/                # API router and endpoints
│       ├── core/               # Application configuration
│       ├── schemas/            # Request and response models
│       ├── services/           # Prediction services
│       └── main.py             # FastAPI application
├── data/
│   └── evaluation/             # Evaluation metrics and analysis artifacts
├── frontend/
│   ├── public/
│   └── src/
│       ├── app/                # Frontend routing
│       ├── assets/             # Images and branding
│       ├── components/         # Reusable UI components
│       ├── data/               # Dashboard and model insight data
│       ├── hooks/              # React hooks
│       ├── pages/              # Application pages and page styles
│       ├── services/           # API and browser-storage services
│       ├── styles/             # Shared styles
│       ├── types/              # TypeScript types
│       └── utils/              # Shared utilities
├── models/                     # Serialized machine learning models
├── scripts/                    # Data and model scripts
├── tests/
│   ├── integration/
│   └── unit/
├── .env.example
├── pyproject.toml
└── README.md
```

## Local Setup

### Prerequisites

Install:

- Python 3.12
- Node.js 22 or newer
- npm
- Git

### 1. Open the project

```powershell
cd D:\FRAUDWATCH
```

### 2. Create the Python environment

```powershell
py -3.12 -m venv .venv
```

Activate it:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\.venv\Scripts\Activate.ps1
```

### 3. Install backend dependencies

Install the application and development dependencies:

```powershell
python -m pip install --upgrade pip
pip install -e ".[dev]"
```

### 4. Configure the environment

```powershell
Copy-Item .env.example .env
```

Default configuration:

```env
APP_NAME=FraudWatch API
APP_VERSION=0.1.0
ENVIRONMENT=development
API_PREFIX=/api/v1
```

### 5. Start the backend

From `D:\FRAUDWATCH`:

```powershell
uvicorn backend.app.main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

### 6. Install frontend dependencies

Open another PowerShell terminal:

```powershell
cd D:\FRAUDWATCH\frontend
npm install
```

### 7. Start the frontend

```powershell
npm run dev
```

Open:

```text
http://localhost:5173
```

## Frontend API Configuration

The frontend uses this backend by default:

```text
http://127.0.0.1:8000
```

To use another backend URL, create `frontend/.env.local`:

```env
VITE_API_BASE_URL=https://your-backend.example.com
```

Restart the Vite development server after changing environment variables.

## API

### Health Check

```http
GET /api/v1/health
```

### Analyze Transaction

```http
POST /api/v1/predictions
Content-Type: application/json
```

Example request:

```json
{
  "transaction_datetime": "2024-04-27T10:21:00",
  "category": "shopping_net",
  "amount": 1240.0,
  "state": "NY",
  "customer_latitude": 40.7128,
  "customer_longitude": -74.006,
  "city_population": 8336817,
  "merchant_latitude": 34.0522,
  "merchant_longitude": -118.2437
}
```

Example response structure:

```json
{
  "prediction": "legitimate",
  "fraud_score": 0.9723,
  "decision_threshold": 0.9797,
  "risk_level": "high",
  "needs_review": true,
  "risk_factors": [
    "Transaction occurred during a high-risk time window.",
    "Category has an elevated fraud rate in training data.",
    "Amount is at or above the median fraudulent amount."
  ]
}
```

## Validation

### Backend

From the project root:

```powershell
ruff check backend tests
pytest
```

Current result:

```text
11 tests passed
All Ruff checks passed
```

### Frontend

From `D:\FRAUDWATCH\frontend`:

```powershell
npm run lint
npm run build
```

The production build currently succeeds. Vite may display a non-blocking warning because the main JavaScript chunk is larger than 500 kB.

## Current Limitations

- The model was evaluated on synthetic transaction data.
- Geographic inputs and learned patterns currently reflect the model’s training coverage.
- Browser history is stored only in `localStorage`.
- Active analysis state is stored only for the current browser session.
- Model scores are not calibrated probabilities.
- The application does not perform automated transaction blocking.
- Authentication and remote user accounts are not currently implemented.
- The frontend production bundle has not yet been code-split.

## Future Improvements

- Production deployment
- Authentication and role-based access control
- Persistent database-backed review history
- Analyst notes and review outcomes
- Model and data-drift monitoring
- Probability calibration
- Broader geographic model coverage
- Automated CI/CD
- Frontend route-based code splitting

## License

This project is currently provided for portfolio and educational purposes.