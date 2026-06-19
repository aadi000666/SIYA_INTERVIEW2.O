// ============================================================
//  AIAvatar.jsx — Animated female AI interviewer "Siya"
// ============================================================
import React, { useEffect, useState } from "react";

export default function AIAvatar({ isSpeaking, isThinking, mood = "neutral" }) {
  const [blink, setBlink] = useState(false);
  const [wave, setWave] = useState(0);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Sound wave animation when speaking
  useEffect(() => {
    if (isSpeaking) {
      const waveInterval = setInterval(() => {
        setWave((p) => (p + 1) % 4);
      }, 300);
      return () => clearInterval(waveInterval);
    }
    setWave(0);
  }, [isSpeaking]);

  const moodColors = {
    neutral: "#7C3AED",
    happy: "#059669",
    thinking: "#D97706",
    positive: "#059669",
    negative: "#DC2626",
  };

  const accentColor = moodColors[mood] || moodColors.neutral;

  return (
    <div className="avatar-wrapper">
      {/* Outer glow ring */}
      <div
        className={`avatar-ring ${isSpeaking ? "ring-pulse" : ""} ${isThinking ? "ring-spin" : ""}`}
        style={{ borderColor: accentColor }}
      />

      {/* Main SVG face */}
      <div className="avatar-face">
          <img 
            src={process.env.PUBLIC_URL + "/siya-avatar.png"} 
            alt="Siya" 
            style={{ 
              width: "120px", 
              height: "120px", 
              borderRadius: "50%", 
              objectFit: "cover",
              animation: isSpeaking ? "speakBounce 0.5s infinite alternate" : "none"
            }} 
          />

          {/* Thinking dots overlay */}
          {isThinking && (
            <div style={{
              position: "absolute",
              bottom: "10px",
              display: "flex",
              gap: "4px",
              justifyContent: "center",
              width: "100%"
            }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: accentColor, opacity: wave >= 1 ? 1 : 0.3 }} />
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: accentColor, opacity: wave >= 2 ? 1 : 0.3 }} />
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: accentColor, opacity: wave >= 3 ? 1 : 0.3 }} />
            </div>
          )}
      </div>

      {/* Speaking sound waves */}
      {isSpeaking && (
        <div className="sound-waves">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="wave-bar"
              style={{
                animationDelay: `${i * 0.1}s`,
                backgroundColor: accentColor,
              }}
            />
          ))}
        </div>
      )}

      {/* Status label */}
      <div className="avatar-status" style={{ color: accentColor }}>
        {isThinking ? "🤔 Thinking..." : isSpeaking ? "🗣️ Siya is speaking" : "👩‍💼 Siya"}
      </div>
    </div>
  );
}
