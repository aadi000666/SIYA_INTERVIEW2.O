// ============================================================
//  InterviewSetup.jsx — Mic/Camera permission UI + countdown
// ============================================================
import React, { useState, useEffect } from "react";
import AIAvatar from "./AIAvatar";

export default function InterviewSetup({ userInfo, onStart, onBack }) {
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [micStatus, setMicStatus] = useState("idle"); // idle | granted | denied
  const [generating, setGenerating] = useState(false);

  const handleMicToggle = async () => {
    if (!micOn) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicOn(true);
        setMicStatus("granted");
      } catch {
        setMicStatus("denied");
      }
    } else {
      setMicOn(false);
      setMicStatus("idle");
    }
  };

  const handleCamToggle = () => {
    setCamOn((p) => !p);
  };

  const handleBeginInterview = () => {
    setGenerating(true);
    let count = 3;
    setCountdown(count);
    const t = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(t);
        setCountdown(null);
        onStart();
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  return (
    <div className="setup-container">
      <div className="setup-card">
        {/* Header */}
        <div className="setup-header">
          <button className="back-btn" onClick={onBack}>
            ← Back
          </button>
          <h2>Setup Your Interview</h2>
          <p className="setup-subtitle">
            Ready, <strong>{userInfo.name}</strong>? Let's prep your interview
            for <strong>{userInfo.topic}</strong>
          </p>
        </div>

        {/* Avatar intro */}
        <div className="setup-avatar-section">
          <AIAvatar isSpeaking={false} isThinking={false} mood="neutral" />
          <div className="siya-intro">
            <h3>Hi, I'm Siya! 👋</h3>
            <p>
              Your personal AI interview coach. I'll ask you{" "}
              <strong>20 questions</strong>, listen to your answers, and give you
              real-time feedback to help you ace your actual interview!
            </p>
          </div>
        </div>

        {/* Info chips */}
        <div className="info-chips">
          <div className="info-chip">
            <span className="chip-icon">👤</span>
            <span>{userInfo.name}</span>
          </div>
          <div className="info-chip">
            <span className="chip-icon">🎯</span>
            <span>{userInfo.topic}</span>
          </div>
          <div className="info-chip">
            <span className="chip-icon">📚</span>
            <span>{userInfo.field}</span>
          </div>
          <div className="info-chip">
            <span className="chip-icon">💼</span>
            <span>{userInfo.experience}</span>
          </div>
        </div>

        {/* Device Setup */}
        <div className="device-setup">
          <h4>Device Setup</h4>
          <p className="device-note">
            For the best experience, enable microphone to speak your answers.
          </p>

          <div className="device-buttons">
            {/* Microphone */}
            <button
              className={`device-btn ${micOn ? "device-active" : ""} ${micStatus === "denied" ? "device-denied" : ""}`}
              onClick={handleMicToggle}
            >
              <span className="device-icon">{micOn ? "🎙️" : "🔇"}</span>
              <span className="device-label">
                {micOn ? "Mic ON" : "Enable Mic"}
              </span>
              <span className="device-badge">
                {micStatus === "granted"
                  ? "✓ Ready"
                  : micStatus === "denied"
                  ? "✗ Denied"
                  : "Optional"}
              </span>
            </button>

            {/* Camera (fake — just UI toggle) */}
            <button
              className={`device-btn ${camOn ? "device-active" : ""}`}
              onClick={handleCamToggle}
            >
              <span className="device-icon">{camOn ? "📹" : "📷"}</span>
              <span className="device-label">
                {camOn ? "Camera ON" : "Enable Camera"}
              </span>
              <span className="device-badge">
                {camOn ? "✓ On" : "Optional"}
              </span>
            </button>
          </div>

          {micStatus === "denied" && (
            <p className="warning-msg">
              ⚠️ Mic blocked. You can still type your answers manually.
            </p>
          )}
          {!micOn && (
            <p className="tip-msg">
              💡 No mic? No problem — you can type your answers too!
            </p>
          )}
        </div>

        {/* Interview rules */}
        <div className="rules-box">
          <h4>📋 Interview Rules</h4>
          <ul>
            <li>20 questions total — mix of technical, behavioral & HR</li>
            <li>Speak or type your answer for each question</li>
            <li>Siya will give instant feedback after each answer</li>
            <li>Final scorecard at the end with areas to improve</li>
            <li>You can skip a question if you're unsure</li>
          </ul>
        </div>

        {/* Start button */}
        {countdown !== null ? (
          <div className="countdown-display">
            <div className="countdown-number">{countdown}</div>
            <p>Interview starting...</p>
          </div>
        ) : (
          <button
            className="btn-primary btn-large btn-start"
            onClick={handleBeginInterview}
            disabled={generating}
          >
            {generating ? "⏳ Preparing Questions..." : "🚀 Begin Interview"}
          </button>
        )}
      </div>
    </div>
  );
}
