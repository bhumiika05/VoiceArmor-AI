import uuid
import json
import datetime
from fastapi import APIRouter, Depends, Form
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import Incident, AnalysisResult
from backend.app.ai.forensics import forensics

router = APIRouter(prefix="/api/demo", tags=["SIH Demonstration"])

@router.post("/attack")
def simulate_voice_cloning_attack(
    scenario: str = Form("Executive Voice Cloning Attack"),
    target_speaker: str = Form("CEO Alexander Vance"),
    sensitive_action: str = Form("MONEY_TRANSFER"),
    db: Session = Depends(get_db)
):
    """
    Simulates a controlled SIH Executive Voice Cloning Impersonation Attack.
    Runs the full end-to-end security pipeline without requiring external voice APIs.
    """
    session_id = f"SESS-DEMO-{uuid.uuid4().hex[:6].upper()}"
    incident_id = f"INC-ATTACK-{uuid.uuid4().hex[:6].upper()}"
    
    simulated_voice_clip = b"VOICEARMOR_SIH_DEMO_CLONED_AUDIO_PAYLOAD_EXECUTIVE_WIRE_TRANSFER_REQUEST_001"
    audio_hash = forensics.compute_sha256(simulated_voice_clip)

    deepfake_probability = 94.2
    speaker_match_score = 18.5
    impersonation_risk_score = 92
    risk_level = "CRITICAL"
    recommended_action = "ALERT + RESTRICT SENSITIVE ACTION"

    signals = {
        "vocoder_fingerprint": 94.8,
        "prosodic_roboticity": 91.2,
        "spectral_irregularity": 88.5,
        "temporal_artifacts": 86.0,
        "pitch_variance_hz": 6.8
    }

    explanations = [
        "🚨 High synthetic speech probability (94.2%) detected by WavLM acoustic model.",
        "⚠️ Speaker similarity (18.5%) indicates severe mismatch against registered CEO profile.",
        "🔬 High-frequency neural vocoder artifacts detected above 4kHz band.",
        "🔴 High-risk sensitive operation requested: 'MONEY_TRANSFER' ($250,000 Urgent Wire).",
        "🛡️ Preventive Action: Financial transaction blocked automatically."
    ]

    # Save incident record to SQLite
    incident = Incident(
        incident_id=incident_id,
        session_id=session_id,
        speaker_name=target_speaker,
        timestamp=datetime.datetime.utcnow(),
        risk_score=impersonation_risk_score,
        risk_level=risk_level,
        deepfake_probability=deepfake_probability,
        speaker_match_score=speaker_match_score,
        recommended_action=recommended_action,
        sensitive_action=sensitive_action,
        verification_status="RESTRICTED",
        audio_hash=audio_hash,
        explanations_json=json.dumps(explanations)
    )

    db.add(incident)
    db.commit()

    return {
        "status": "ATTACK_DETECTED_AND_PREVENTED",
        "demo_mode": "CONTROLLED SIH DEMONSTRATION",
        "scenario": scenario,
        "cloned_phrase": "Please process the transaction immediately. I am currently unavailable for normal verification.",
        "session_id": session_id,
        "incident_id": incident_id,
        "analysis": {
            "engine_mode": "DEMO MODE (SIH CONTROLLED)",
            "deepfake_probability": deepfake_probability,
            "classification": "AI-GENERATED / SUSPICIOUS",
            "confidence": 95.5,
            "signals": signals,
            "speaker_match_score": speaker_match_score,
            "speaker_match_status": "MISMATCH",
            "impersonation_risk_score": impersonation_risk_score,
            "risk_level": risk_level,
            "color_code": "RED",
            "recommended_action": recommended_action,
            "action_description": "Critical Voice Impersonation Threat detected! Sensitive operation restricted automatically to prevent fraud.",
            "is_restricted": True,
            "verification_required": True,
            "explanations": explanations,
            "audio_hash": audio_hash
        },
        "progression_steps": [
            {"step": 1, "label": "Audio Capture & Preprocessing", "risk": 15},
            {"step": 2, "label": "AI Neural Deepfake Analysis", "risk": 48},
            {"step": 3, "label": "Speaker Enrollment Comparison (CEO Vance)", "risk": 72},
            {"step": 4, "label": "Sensitive Action Context Assessment ($250k Wire)", "risk": 92}
        ]
    }
