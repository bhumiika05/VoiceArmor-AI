import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import Incident
from backend.app.schemas import IncidentResponse
from backend.app.ai.forensics import forensics

router = APIRouter(prefix="/api/incidents", tags=["Incident Center"])

@router.get("", response_model=List[IncidentResponse])
def get_incidents(
    level: Optional[str] = Query(None, description="Filter by risk level: LOW, MODERATE, HIGH, CRITICAL"),
    db: Session = Depends(get_db)
):
    query = db.query(Incident)
    if level and level.upper() != "ALL":
        query = query.filter(Incident.risk_level == level.upper())
    
    incidents = query.order_by(Incident.timestamp.desc()).all()
    
    # Parse explanations JSON strings into python lists
    result = []
    for inc in incidents:
        exps = json.loads(inc.explanations_json) if inc.explanations_json else []
        result.append(
            IncidentResponse(
                id=inc.id,
                incident_id=inc.incident_id,
                session_id=inc.session_id,
                speaker_name=inc.speaker_name,
                timestamp=inc.timestamp,
                risk_score=inc.risk_score,
                risk_level=inc.risk_level,
                deepfake_probability=inc.deepfake_probability,
                speaker_match_score=inc.speaker_match_score,
                recommended_action=inc.recommended_action,
                sensitive_action=inc.sensitive_action,
                verification_status=inc.verification_status,
                audio_hash=inc.audio_hash,
                explanations=exps
            )
        )
    return result


@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident_by_id(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.incident_id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    exps = json.loads(inc.explanations_json) if inc.explanations_json else []
    return IncidentResponse(
        id=inc.id,
        incident_id=inc.incident_id,
        session_id=inc.session_id,
        speaker_name=inc.speaker_name,
        timestamp=inc.timestamp,
        risk_score=inc.risk_score,
        risk_level=inc.risk_level,
        deepfake_probability=inc.deepfake_probability,
        speaker_match_score=inc.speaker_match_score,
        recommended_action=inc.recommended_action,
        sensitive_action=inc.sensitive_action,
        verification_status=inc.verification_status,
        audio_hash=inc.audio_hash,
        explanations=exps
    )


@router.get("/{incident_id}/report")
def download_incident_report(incident_id: str, format: str = Query("pdf"), db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.incident_id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")

    exps = json.loads(inc.explanations_json) if inc.explanations_json else []
    inc_data = {
        "incident_id": inc.incident_id,
        "session_id": inc.session_id,
        "timestamp": inc.timestamp.strftime("%Y-%m-%d %H:%M:%S UTC"),
        "speaker_name": inc.speaker_name,
        "risk_score": inc.risk_score,
        "risk_level": inc.risk_level,
        "deepfake_probability": inc.deepfake_probability,
        "speaker_match_score": inc.speaker_match_score if inc.speaker_match_score is not None else "N/A",
        "recommended_action": inc.recommended_action,
        "sensitive_action": inc.sensitive_action,
        "verification_status": inc.verification_status,
        "audio_hash": inc.audio_hash,
        "explanations": exps
    }

    if format.lower() == "json":
        return Response(
            content=json.dumps(inc_data, indent=2),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename=VoiceArmor_{incident_id}_Report.json"}
        )

    # Default to PDF
    pdf_bytes = forensics.generate_pdf_report(inc_data)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=VoiceArmor_{incident_id}_Report.pdf"}
    )


@router.delete("/{incident_id}")
def delete_incident(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.incident_id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    db.delete(inc)
    db.commit()
    return {"status": "success", "message": f"Incident {incident_id} deleted."}


@router.delete("")
def clear_all_incidents(db: Session = Depends(get_db)):
    db.query(Incident).delete()
    db.commit()
    return {"status": "success", "message": "All incident logs cleared from database."}
