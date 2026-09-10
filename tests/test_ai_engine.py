import pytest
from backend.app.ai.deepfake_detector import detector
from backend.app.ai.speaker_verification import verifier

def test_deepfake_detector_fallback():
    dummy_audio = b"RIFF" + b"\x00" * 500  # Fake header + bytes
    res = detector.analyze_audio_bytes(dummy_audio, filename="test.wav")
    assert "deepfake_probability" in res
    assert "classification" in res
    assert "confidence" in res
    assert "signals" in res

def test_speaker_verification_cosine():
    emb1 = [0.1] * 32
    emb2 = [0.1] * 32
    emb3 = [-0.1] * 32

    # Matching vectors
    match_res = verifier.compare_embeddings(emb1, emb2)
    assert match_res["match_score"] >= 95.0
    assert match_res["status"] == "MATCH"

    # Divergent vectors
    mismatch_res = verifier.compare_embeddings(emb1, emb3)
    assert mismatch_res["match_score"] <= 30.0
    assert mismatch_res["status"] == "MISMATCH"
