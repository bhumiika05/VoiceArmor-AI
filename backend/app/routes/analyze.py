import uuid
import json
import datetime
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import Speaker, AnalysisResult, Incident, VoiceSession
from backend.app.schemas import AnalysisResponse
from backend.app.ai.deepfake_detector import detector
from backend.app.ai.speaker_verification import verifier
from backend.app.ai.risk_engine import risk_engine
from backend.app.ai.forensics import forensics

router = APIRouter(prefix="/api", tags=["Voice Analysis"])

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_voice(
    file: UploadFile = File(...),
    sensitive_action: str = Form("MONITORING"),
    speaker_id: Optional[str] = Form(None),
    language: str = Form("auto"),
    session_id: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    audio_bytes = await file.read()
    if not audio_bytes or len(audio_bytes) < 10:
        raise HTTPException(status_code=400, detail="Invalid audio payload")

    current_session = session_id or f"SESS-{uuid.uuid4().hex[:8].upper()}"
    audio_hash = forensics.compute_sha256(audio_bytes)

    # 1. AI Deepfake Analysis (Integrated Quality Gate & Calibration)
    deepfake_res = detector.analyze_audio_bytes(audio_bytes, filename=file.filename, language=language)
    df_prob = deepfake_res["calibrated_deepfake_probability"]
    det_conf = deepfake_res["detection_confidence"]
    classification = deepfake_res["classification"]

    # 2. Speaker Verification
    speaker_match_score = None
    speaker_match_status = "UNVERIFIED"
    target_speaker_name = "Unknown Speaker"

    if speaker_id:
        speaker_obj = db.query(Speaker).filter(Speaker.speaker_id == speaker_id).first()
        if speaker_obj and speaker_obj.embedding_json:
            target_speaker_name = speaker_obj.name
            ref_emb = json.loads(speaker_obj.embedding_json)
            curr_emb = verifier.extract_embedding(audio_bytes)
            comp_res = verifier.compare_embeddings(ref_emb, curr_emb)
            speaker_match_score = comp_res["match_score"]
            speaker_match_status = comp_res["status"]

    # 3. Impersonation Risk Calculation
    risk_res = risk_engine.calculate_risk(
        deepfake_probability=df_prob,
        detection_confidence=det_conf,
        classification=classification,
        speaker_match_score=speaker_match_score,
        signals=deepfake_res["signals"],
        replay_info=deepfake_res.get("replay_info", {}),
        quality_gate_info=deepfake_res.get("quality_gate", {}),
        sensitive_action=sensitive_action
    )

    risk_score = risk_res["impersonation_risk_score"]
    risk_level = risk_res["risk_level"]

    # 4. Save Analysis Result
    an_record = AnalysisResult(
        session_id=current_session,
        deepfake_probability=df_prob,
        classification=classification,
        confidence=det_conf,
        signals_json=json.dumps(deepfake_res["signals"]),
        speaker_match_score=speaker_match_score,
        risk_score=risk_score,
        risk_level=risk_level,
        recommended_action=risk_res["recommended_action"]
    )
    db.add(an_record)
    db.commit()

    # 5. Create Incident Automatically if High or Critical Risk
    incident_created = False
    incident_id_str = None

    if risk_level in ["HIGH", "CRITICAL"] or (sensitive_action != "MONITORING" and risk_level != "LOW"):
        incident_id_str = f"INC-{uuid.uuid4().hex[:6].upper()}"
        incident_record = Incident(
            incident_id=incident_id_str,
            session_id=current_session,
            speaker_name=target_speaker_name,
            risk_score=risk_score,
            risk_level=risk_level,
            deepfake_probability=df_prob,
            speaker_match_score=speaker_match_score,
            recommended_action=risk_res["recommended_action"],
            sensitive_action=sensitive_action,
            verification_status="RESTRICTED" if risk_level == "CRITICAL" else "UNVERIFIED",
            audio_hash=audio_hash,
            explanations_json=json.dumps(deepfake_res["explanations"])
        )
        db.add(incident_record)
        db.commit()
        incident_created = True

    return AnalysisResponse(
        engine_mode=deepfake_res["engine_mode"],
        deepfake_probability=df_prob,
        calibrated_deepfake_probability=df_prob,
        classification=classification,
        confidence=det_conf,
        detection_confidence=det_conf,
        uncertainty_pm=deepfake_res.get("uncertainty_pm", 3.5),
        signals=deepfake_res["signals"],
        speaker_match_score=speaker_match_score,
        speaker_match_status=speaker_match_status,
        impersonation_risk_score=risk_score,
        risk_level=risk_level,
        color_code=risk_res["color_code"],
        recommended_action=risk_res["recommended_action"],
        action_description=risk_res["action_description"],
        is_restricted=risk_res["is_restricted"],
        verification_required=risk_res["verification_required"],
        quality_gate=deepfake_res.get("quality_gate"),
        replay_info=deepfake_res.get("replay_info"),
        explanations=deepfake_res["explanations"],
        session_id=current_session,
        audio_hash=audio_hash,
        incident_created=incident_created,
        incident_id=incident_id_str
    )


@router.post("/analyze/live", response_model=AnalysisResponse)
async def analyze_live_chunk(
    file: UploadFile = File(...),
    sensitive_action: str = Form("MONITORING"),
    speaker_id: Optional[str] = Form(None),
    language: str = Form("auto"),
    session_id: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    return await analyze_voice(
        file=file,
        sensitive_action=sensitive_action,
        speaker_id=speaker_id,
        language=language,
        session_id=session_id,
        db=db
    )
