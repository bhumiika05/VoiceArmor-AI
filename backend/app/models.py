import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Speaker(Base):
    __tablename__ = "speakers"

    id = Column(Integer, primary_key=True, index=True)
    speaker_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    role = Column(String(100), default="Executive / Employee")
    embedding_json = Column(Text, nullable=False)  # JSON string of vector embedding
    enrolled_at = Column(DateTime, default=datetime.datetime.utcnow)
    audio_hash = Column(String(64), nullable=True)


class VoiceSession(Base):
    __tablename__ = "voice_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(50), unique=True, index=True, nullable=False)
    speaker_id = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(20), default="ACTIVE")  # ACTIVE, CLOSED, THREAT_DETECTED
    language = Column(String(20), default="auto")


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(50), index=True, nullable=False)
    deepfake_probability = Column(Float, nullable=False)
    classification = Column(String(50), nullable=False)
    confidence = Column(Float, nullable=False)
    signals_json = Column(Text, nullable=True)
    speaker_match_score = Column(Float, nullable=True)
    risk_score = Column(Integer, nullable=False)
    risk_level = Column(String(20), nullable=False)
    recommended_action = Column(String(100), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String(50), unique=True, index=True, nullable=False)
    session_id = Column(String(50), index=True, nullable=False)
    speaker_name = Column(String(100), default="Unknown")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    risk_score = Column(Integer, nullable=False)
    risk_level = Column(String(20), nullable=False)
    deepfake_probability = Column(Float, nullable=False)
    speaker_match_score = Column(Float, nullable=True)
    recommended_action = Column(String(100), nullable=False)
    sensitive_action = Column(String(50), default="MONITORING")
    verification_status = Column(String(30), default="UNVERIFIED")  # UNVERIFIED, VERIFIED_SUCCESS, RESTRICTED
    audio_hash = Column(String(64), nullable=False)
    explanations_json = Column(Text, nullable=True)


class VerificationAttempt(Base):
    __tablename__ = "verification_attempts"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String(50), index=True, nullable=False)
    challenge_phrase = Column(String(200), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    success = Column(Boolean, default=False)
    attempts_count = Column(Integer, default=1)
