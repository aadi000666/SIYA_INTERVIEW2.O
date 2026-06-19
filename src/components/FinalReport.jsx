// ============================================================
//  FinalReport.jsx — End of interview scorecard
// ============================================================
import React, { useState, useEffect } from "react";
import { generateFinalReport } from "../utils/claudeAPI";

const GRADE_COLORS = {
  "A+": "#059669", A: "#10B981", "B+": "#2563EB",
  B: "#3B82F6", "C+": "#D97706", C: "#F59E0B", D: "#DC2626",
};

const READINESS_CONFIG = {
  "Highly Ready": { color: "#059669", emoji: "🚀", bar: 100 },
  Ready: { color: "#10B981", emoji: "✅", bar: 80 },
  "Almost Ready": { color: "#D97706", emoji: "⚡", bar: 60 },
  "Not Ready": { color: "#DC2626", emoji: "📚", bar: 30 },
};

export default function FinalReport({ userInfo, sessionData, onRestart }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const r = await generateFinalReport(userInfo, sessionData);
        setReport(r);
      } catch {
        // Fallback report
        const avg = Math.round(
          sessionData.reduce((s, q) => s + (q.score || 0), 0) / sessionData.length
        );
        setReport({
          overallScore: avg * 10,
          grade: avg >= 8 ? "A" : avg >= 6 ? "B" : avg >= 4 ? "C" : "D",
          summary: "You completed the mock interview. Keep practicing!",
          strengths: ["Attempted all questions", "Showed effort"],
          areasToImprove: ["Technical depth", "Structured answers", "Confidence"],
          topSkillsToLearn: ["STAR method", "Core concepts", "Communication"],
          readinessLevel: avg >= 7 ? "Ready" : avg >= 5 ? "Almost Ready" : "Not Ready",
          nextSteps: "Keep practicing mock interviews daily.",
          motivationalMessage: "Every expert was once a beginner. Keep going!",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [userInfo, sessionData]);

  if (loading) {
    return (
      <div className="report-loading">
        <div className="report-spinner">📊</div>
        <h3>Generating your performance report...</h3>
        <p>Siya is analyzing your interview answers</p>
      </div>
    );
  }

  const gradeColor = GRADE_COLORS[report.grade] || "#6B7280";
  const readiness = READINESS_CONFIG[report.readinessLevel] || READINESS_CONFIG["Almost Ready"];
  const avgScore = (sessionData.reduce((s, q) => s + (q.score || 0), 0) / sessionData.length).toFixed(1);

  return (
    <div className="report-container">
      <div className="report-card">
        {/* Header */}
        <div className="report-header">
          <div className="confetti-emoji">🎉</div>
          <h2>Interview Complete!</h2>
          <p>
            Great job, <strong>{userInfo.name}</strong>! Here's your detailed report for{" "}
            <strong>{userInfo.topic}</strong>
          </p>
        </div>

        {/* Score hero */}
        <div className="score-hero">
          {/* Overall score */}
          <div className="score-circle-big">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="#1E1B4B" strokeWidth="12" />
              <circle
                cx="70" cy="70" r="60" fill="none"
                stroke={gradeColor} strokeWidth="12"
                strokeDasharray={`${(report.overallScore / 100) * 376.99} 376.99`}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
              />
              <text x="70" y="65" textAnchor="middle" fontSize="28" fontWeight="800" fill={gradeColor}>
                {report.overallScore}
              </text>
              <text x="70" y="85" textAnchor="middle" fontSize="12" fill="#9CA3AF">
                out of 100
              </text>
            </svg>
            <div className="grade-badge" style={{ color: gradeColor }}>
              Grade: {report.grade}
            </div>
          </div>

          {/* Quick stats */}
          <div className="quick-stats">
            <div className="stat-item">
              <div className="stat-value">{sessionData.length}</div>
              <div className="stat-label">Questions Answered</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ color: gradeColor }}>{avgScore}/10</div>
              <div className="stat-label">Avg Score</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ color: readiness.color }}>
                {readiness.emoji}
              </div>
              <div className="stat-label">{report.readinessLevel}</div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="report-summary">
          <h4>📋 Interview Summary</h4>
          <p>{report.summary}</p>
        </div>

        {/* Strengths + Improve */}
        <div className="report-two-col">
          <div className="report-box strengths-box">
            <h4>💪 Your Strengths</h4>
            <ul>
              {report.strengths?.map((s, i) => (
                <li key={i}>✅ {s}</li>
              ))}
            </ul>
          </div>
          <div className="report-box improve-box">
            <h4>📈 Areas to Improve</h4>
            <ul>
              {report.areasToImprove?.map((a, i) => (
                <li key={i}>🔧 {a}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Skills to learn */}
        <div className="skills-section">
          <h4>🚀 Top Skills to Learn Next</h4>
          <div className="skill-tags">
            {report.topSkillsToLearn?.map((skill, i) => (
              <span key={i} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div className="next-steps-box">
          <h4>🗺️ Your Next Steps</h4>
          <p>{report.nextSteps}</p>
        </div>

        {/* Per-question breakdown */}
        <div className="qa-breakdown">
          <h4>📝 Question-by-Question Scores</h4>
          <div className="qa-list">
            {sessionData.map((item, i) => (
              <div key={i} className="qa-item">
                <div className="qa-num">Q{i + 1}</div>
                <div className="qa-q">{item.question?.slice(0, 60)}...</div>
                <div
                  className="qa-score"
                  style={{
                    color:
                      item.score >= 7 ? "#059669" : item.score >= 4 ? "#D97706" : "#DC2626",
                  }}
                >
                  {item.score}/10
                </div>
                <div className="qa-verdict">{item.verdict}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational message */}
        <div className="motivation-box">
          <span className="motivation-emoji">✨</span>
          <p>{report.motivationalMessage}</p>
        </div>

        {/* Action buttons */}
        <div className="report-actions">
          <button className="btn-primary" onClick={onRestart}>
            🔄 Take Another Mock Interview
          </button>
          <button
            className="btn-secondary"
            onClick={() => window.print()}
          >
            🖨️ Print Report
          </button>
        </div>
      </div>
    </div>
  );
}
