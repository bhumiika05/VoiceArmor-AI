"""
VoiceArmor Temporal Chunk Aggregator
Implements Exponential Moving Average (EMA) and Trimmed Mean filtering across rolling stream chunks.
Prevents transient acoustic noise spikes from triggering sudden false positive risk spikes.
"""

from typing import List, Dict, Any
import numpy as np


class TemporalAggregator:
    def __init__(self, alpha: float = 0.35, window_size: int = 5):
        self.alpha = alpha
        self.window_size = window_size
        self.history: List[float] = []

    def add_chunk_score(self, chunk_score: float) -> Dict[str, Any]:
        """
        Appends chunk score and returns aggregated risk score, trend, and stability stats.
        """
        self.history.append(float(chunk_score))
        if len(self.history) > self.window_size:
            self.history.pop(0)

        # 1. Exponential Moving Average (EMA)
        ema = self.history[0]
        for score in self.history[1:]:
            ema = self.alpha * score + (1.0 - self.alpha) * ema

        # 2. Trimmed Mean (removes min and max outliers if history length >= 4)
        if len(self.history) >= 4:
            sorted_h = sorted(self.history)
            trimmed = sorted_h[1:-1]
            trimmed_mean = float(np.mean(trimmed))
        else:
            trimmed_mean = float(np.mean(self.history))

        # Final aggregated score (blend of EMA and trimmed mean)
        final_aggregated = 0.60 * ema + 0.40 * trimmed_mean

        # Trend calculation
        if len(self.history) >= 2:
            diff = self.history[-1] - self.history[-2]
            if diff > 5.0:
                trend = "INCREASING"
            elif diff < -5.0:
                trend = "DECREASING"
            else:
                trend = "STABLE"
        else:
            trend = "INITIALIZING"

        # Calculate Chunk Agreement Percentage
        # Agreement measure how consistently chunks yield similar classification
        std_dev = float(np.std(self.history)) if len(self.history) > 1 else 0.0
        agreement = max(50.0, min(99.0, 100.0 - std_dev * 2.5))

        return {
            "aggregated_risk_score": int(round(final_aggregated)),
            "chunk_count": len(self.history),
            "latest_chunk_score": round(chunk_score, 1),
            "ema_score": round(ema, 1),
            "trimmed_mean_score": round(trimmed_mean, 1),
            "trend": trend,
            "chunk_agreement_pct": round(agreement, 1)
        }

    def reset(self):
        self.history.clear()


# Singleton instance
temporal_aggregator = TemporalAggregator()
