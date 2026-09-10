import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "VoiceArmor AI"
    assert "ai_engine_mode" in data

def test_dashboard_metrics():
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "total_calls_analyzed" in data["summary"]
    assert "threats_detected" in data["summary"]

def test_list_speakers():
    response = client.get("/api/speakers")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_demo_attack_simulation():
    response = client.post("/api/demo/attack", data={
        "scenario": "Executive Voice Cloning Attack Test",
        "target_speaker": "CEO John Test",
        "sensitive_action": "MONEY_TRANSFER"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ATTACK_DETECTED_AND_PREVENTED"
    assert data["analysis"]["risk_level"] == "CRITICAL"
    assert data["analysis"]["impersonation_risk_score"] >= 90
    assert data["incident_id"] is not None

def test_list_incidents():
    response = client.get("/api/incidents")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
