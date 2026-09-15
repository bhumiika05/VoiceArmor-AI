import pytest
from backend.app.ai.risk_engine import risk_engine

def test_low_risk_scenario():
    res = risk_engine.calculate_risk(
        deepfake_probability=10.0,
        speaker_match_score=95.0,
        sensitive_action="MONITORING"
    )
    assert res["impersonation_risk_score"] <= 20
    assert res["risk_level"] == "LOW"
    assert res["recommended_action"] in ["ALLOW / MONITOR", "MONITOR"]
    assert not res["is_restricted"]

def test_critical_risk_scenario():
    res = risk_engine.calculate_risk(
        deepfake_probability=92.0,
        speaker_match_score=15.0,
        sensitive_action="MONEY_TRANSFER"
    )
    assert res["impersonation_risk_score"] >= 76
    assert res["risk_level"] == "CRITICAL"
    assert res["recommended_action"] == "ALERT + RESTRICT SENSITIVE ACTION"
    assert res["is_restricted"]
    assert res["verification_required"]
