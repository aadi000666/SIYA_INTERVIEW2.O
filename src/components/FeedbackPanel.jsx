// ============================================================
//  FeedbackPanel.jsx — Per-answer AI feedback display
// ============================================================
import React from "react";

const VERDICT_CONFIG = {
  Excellent: { color: "#059669", bg: "#D1FAE5", emoji: "🌟" },
  Good: { color: "#2563EB", bg: "#DBEAFE", emoji: "👍" },
  Average: { color: "#D97706", bg: "#FEF3C7", emoji: "💡" },
  "Needs Improvement": { color: "#DC2626", bg: "#FEE2E2", emoji: "📝" },
};

const SCORE_COLOR = (score) => {
  if (score >= 8) return "#059669";
  if (score >= 6) return "#2563EB";
  if (score >= 4) return "#D97706";
  return "#DC2626";
};

export default function FeedbackPanel({ feedback, onNext, isLastQuestion }) {
  if (!feedback) return null;

  const config = VERDICT_CONFIG[feedback.verdict] || VERDICT_CONFIG["Average"];
  const scoreColor = SCORE_COLOR(feedback.score);

  return (
    <div className="feedback-panel">
      {/* Verdict header */}
      <div
        className="verdict-badge"
        style={{ backgroundColor: config.bg, borderColor: config.color }}
      >
        <span className="verdict-emoji">{config.emoji}</span>
        <div>
          <div className="verdict-label" style={{ color: config.color }}>
            {feedback.verdict}
          </div>
          <div className="verdict-score">
            Score:{" "}
            <strong style={{ color: scoreColor }}>
              {feedback.score}/10
            </strong>
          </div>
        </div>

        {/* Score ring */}
        <div className="score-ring-wrapper">
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="#E5E7EB" strokeWidth="5" />
            <circle
              cx="28"
              cy="28"
              r="22"
              fill="none"
              stroke={scoreColor}
              strokeWidth="5"
              strokeDasharray={`${(feedback.score / 10) * 138.2} 138.2`}
              strokeLinecap="round"
              transform="rotate(-90 28 28)"
            />
            <text x="28" y="33" textAnchor="middle" fontSize="13" fontWeight="700" fill={scoreColor}>
              {feedback.score}
            </text>
          </svg>
        </div>
      </div>

      {/* Praise */}
      <div className="feedback-section feedback-praise">
        <div className="feedback-section-title">✅ What You Did Well</div>
        <p>{feedback.praise}</p>
      </div>

      {/* Suggestion */}
      <div className="feedback-section feedback-suggest">
        <div className="feedback-section-title">💡 How to Improve</div>
        <p>{feedback.suggestion}</p>
      </div>

      {/* Better answer */}
      <div className="feedback-section feedback-better">
        <div className="feedback-section-title">🎯 Model Answer Snippet</div>
        <p className="better-answer-text">"{feedback.betterAnswer}"</p>
      </div>

      {/* Encouragement */}
      <div className="encouragement-bar">
        <span className="encouragement-icon">💪</span>
        <span>{feedback.encouragement}</span>
      </div>

      {/* Next button */}
      <button className="btn-primary btn-next" onClick={onNext}>
        {isLastQuestion ? "🏁 See Final Report" : "Next Question →"}
      </button>
    </div>
  );
}
