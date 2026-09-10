from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime

class SpeakerEnrollRequest(BaseModel):
    name: str
    role: Optional[str] = "Executive / Employee"

class SpeakerResponse(BaseModel):
    id: int
    speaker_id: str
    name: str
    role: str
    enrolled_at: datetime
    audio_hash: Optional[str] = None

    class Config:
        from_attributes = True

class SignalDetails(BaseModel):
    vocoder_fingerprint: float
    prosodic_roboticity: float
    spectral_irregularity: float
    temporal_artifacts: float
    pitch_variance_hz: Optional[float] = None

class AnalysisResponse(BaseModel):
    engine_mode: str
    deepfake_probability: float
    calibrated_deepfake_probability: float
    classification: str
    confidence: float
    detection_confidence: float
    uncertainty_pm: Optional[float] = 3.5
    signals: Dict[str, float]
    speaker_match_score: Optional[float] = None
    speaker_match_status: Optional[str] = "UNVERIFIED"
    impersonation_risk_score: int
    risk_level: str
    color_code: str
    recommended_action: str
    action_description: str
    is_restricted: bool
    verification_required: bool
    quality_gate: Optional[Dict[str, Any]] = None
    replay_info: Optional[Dict[str, Any]] = None
    explanations: List[str]
    session_id: str
    audio_hash: str
    incident_created: bool
    incident_id: Optional[str] = None

class IncidentResponse(BaseModel):
    id: int
    incident_id: str
    session_id: str
    speaker_name: str
    timestamp: datetime
    risk_score: int
    risk_level: str
    deepfake_probability: float
    speaker_match_score: Optional[float]
    recommended_action: str
    sensitive_action: str
    verification_status: str
    audio_hash: str
    explanations: List[str]

    class Config:
        from_attributes = True

class VerificationChallengeRequest(BaseModel):
    incident_id: str
    challenge_phrase: str
    response_phrase: str

class DemoAttackRequest(BaseModel):
    scenario: Optional[str] = "Executive Impersonation Wire Fraud"
    target_speaker: Optional[str] = "CEO Alexander Vance"
    sensitive_action: Optional[str] = "MONEY_TRANSFER"
