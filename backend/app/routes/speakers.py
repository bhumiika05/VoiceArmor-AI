import uuid
import json
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import Speaker
from backend.app.schemas import SpeakerResponse
from backend.app.ai.speaker_verification import verifier
from backend.app.ai.forensics import forensics

router = APIRouter(prefix="/api/speakers", tags=["Speaker Management"])

@router.post("/enroll", response_model=SpeakerResponse)
async def enroll_speaker(
    name: str = Form(...),
    role: str = Form("Executive / Employee"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    audio_bytes = await file.read()
    if not audio_bytes or len(audio_bytes) < 10:
        raise HTTPException(status_code=400, detail="Invalid audio payload for speaker enrollment")

    spk_id = f"SPK-{uuid.uuid4().hex[:6].upper()}"
    audio_hash = forensics.compute_sha256(audio_bytes)
    
    # Extract & serialize vector embedding (privacy-preserving, raw audio discarded)
    embedding_vector = verifier.extract_embedding(audio_bytes)
    embedding_json_str = json.dumps(embedding_vector)

    speaker_record = Speaker(
        speaker_id=spk_id,
        name=name,
        role=role,
        embedding_json=embedding_json_str,
        audio_hash=audio_hash
    )

    db.add(speaker_record)
    db.commit()
    db.refresh(speaker_record)

    return speaker_record


@router.get("", response_model=List[SpeakerResponse])
def list_speakers(db: Session = Depends(get_db)):
    speakers = db.query(Speaker).order_by(Speaker.enrolled_at.desc()).all()
    return speakers


@router.delete("/{speaker_id}")
def delete_speaker(speaker_id: str, db: Session = Depends(get_db)):
    spk = db.query(Speaker).filter(Speaker.speaker_id == speaker_id).first()
    if not spk:
        raise HTTPException(status_code=404, detail="Speaker profile not found")
    
    db.delete(spk)
    db.commit()
    return {"status": "success", "message": f"Speaker profile {speaker_id} deleted successfully."}
