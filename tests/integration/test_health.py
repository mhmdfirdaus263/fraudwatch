from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_health_check_returns_application_status() -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "app": "FraudWatch API",
        "version": "0.1.0",
        "environment": "development",
    }
