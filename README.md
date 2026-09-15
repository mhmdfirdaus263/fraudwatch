# FraudWatch

FraudWatch is a full-stack machine learning application for detecting potentially fraudulent credit card transactions.

The system produces a fraud probability, risk level, review recommendation, and interpretable risk factors to help fraud analysts prioritize suspicious transactions.

## Project Status

Currently under development.

Completed:

- Project structure
- Python environment
- FastAPI application foundation
- Health endpoint
- Initial integration test

## Planned Features

- Transaction fraud prediction
- Fraud probability and risk level
- Configurable decision threshold
- Model explainability
- Manual transaction review
- Fraud monitoring dashboard
- Model performance monitoring
- REST API
- Responsive web interface

## Technology Stack

### Machine Learning

- Python
- pandas
- scikit-learn
- imbalanced-learn

### Backend

- FastAPI
- Pydantic
- SQLAlchemy

### Frontend

- React
- TypeScript
- Vite

### Quality

- pytest
- Ruff
- Git

## API

Health check:

```text
GET /api/v1/health