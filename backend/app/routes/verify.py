import random
from fastapi import APIRouter, Form, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import Incident, VerificationAttempt

router = APIRouter(prefix="/api/verify", tags=["Secondary Verification"])

CHALLENGE_PHRASES = [
    "Alpha Tango 492 Security Verification",
    "Sierra Victor 815 Authorization Code",
    "Delta Echo 307 Identity Clearance",
    "VoiceArmor Challenge Shield 994"
]

@router.get("/phrase")
def get_challenge_phrase():
    return {
        "challenge_phrase": random.choice(CHALLENGE_PHRASES),
        "instructions": "Please speak or enter the exact verification phrase displayed on screen."
    }

@router.post("/challenge")
def process_challenge_verification(
    incident_id: str = Form(...),
    challenge_phrase: str = Form(...),
    spoken_phrase: str = Form(...),
    db: Session = Depends(get_db)
):
    incident = db.query(Incident).filter(Incident.incident_id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident record not found")

    # Clean and compare phrases
    expected = challenge_phrase.strip().lower()
    spoken = spoken_phrase.strip().lower()

    # Levenshtein / substring match threshold
    is_success = expected in spoken or spoken in expected or len(set(expected.split()).intersection(set(spoken.split()))) >= 2

    attempt = VerificationAttempt(
        incident_id=incident_id,
        challenge_phrase=challenge_phrase,
        success=is_success
    )
    db.add(attempt)

    if is_success:
        incident.verification_status = "VERIFIED_SUCCESS"
        db.commit()
        return {
            "status": "VERIFICATION_SUCCESSFUL",
            "incident_id": incident_id,
            "security_state": "UNLOCKED",
            "message": "Secondary challenge phrase verified successfully. Access granted for pending request."
        }
    else:
        db.commit()
        return {
            "status": "VERIFICATION_FAILED",
            "incident_id": incident_id,
            "security_state": "RESTRICTED",
            "message": "Challenge phrase verification mismatch. Secondary security restrictions remain in effect."
        }
