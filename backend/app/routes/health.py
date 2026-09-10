from fastapi import APIRouter
from backend.app.ai.deepfake_detector import detector

router = APIRouter(prefix="/api", tags=["Health"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "VoiceArmor AI",
        "version": "1.0.0",
        "ai_engine_mode": detector.mode,
        "usp": "Detect • Verify • Assess • Prevent"
    }
