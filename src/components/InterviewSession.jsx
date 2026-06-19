// ============================================================
//  InterviewSession.jsx — Main interview screen
//  20 questions, mic/type input, live AI feedback
// ============================================================
import React, { useState, useEffect, useRef } from "react";
import AIAvatar from "./AIAvatar";
import FeedbackPanel from "./FeedbackPanel";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { generateQuestions, evaluateAnswer } from "../utils/claudeAPI";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";

export default function InterviewSession({ userInfo, onComplete }) {
  const [phase, setPhase] = useState("loading"); // loading | question | evaluating | feedback | done
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [sessionData, setSessionData] = useState([]);
  const [avatarMood, setAvatarMood] = useState("neutral");
  const [error, setError] = useState(null);

  const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript } =
    useSpeechRecognition();

  const { speak: speakText, stop: stopText, isSpeaking: isSiyaSpeaking, muted, setMuted } =
    useSpeechSynthesis();

  const textareaRef = useRef(null);

  // Live value displayed in textarea (combines typed answer + live spoken transcript)
  const displayValue = isListening && transcript ? typedAnswer + (typedAnswer.endsWith(' ') ? '' : ' ') + transcript : typedAnswer;

  // ── Load questions on mount ────────────────────────────
  useEffect(() => {
    async function loadQuestions() {
      try {
        const qs = await generateQuestions(userInfo);
        setQuestions(qs.slice(0, 20));
        setPhase("question");
      } catch (err) {
        setError("Questions generate karne mein problem aayi. API key check karo.");
        setPhase("error");
      }
    }
    loadQuestions();
  }, [userInfo]);

  // ── Sync spoken transcript with textarea scroll ────────
  useEffect(() => {
    if (transcript && textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [transcript]);

  // ── Commit transcript to typedAnswer when mic is stopped ──
  useEffect(() => {
    if (!isListening && transcript) {
      setTypedAnswer((prev) => {
        const base = prev.trim();
        const addition = transcript.trim();
        return base ? `${base} ${addition}` : addition;
      });
      resetTranscript();
    }
  }, [isListening, transcript, resetTranscript]);

  // ── Trigger TTS (Speech Synthesis) for questions ────────
  useEffect(() => {
    if (phase === "question" && questions[currentIndex]) {
      speakText(questions[currentIndex]);
    }
  }, [phase, currentIndex, questions, speakText]);

  // ── Trigger TTS (Speech Synthesis) for feedback ─────────
  useEffect(() => {
    if (phase === "feedback" && feedback) {
      const textToSpeak = `${feedback.verdict}. Praise: ${feedback.praise}. Suggestion: ${feedback.suggestion}. ${feedback.encouragement}`;
      speakText(textToSpeak);
    }
  }, [phase, feedback, speakText]);

  // ── Stop speaking on cleanup ───────────────────────────
  useEffect(() => {
    return () => {
      stopText();
    };
  }, [stopText]);

  // ── Submit answer ──────────────────────────────────────
  const handleSubmitAnswer = async () => {
    if (isListening) stopListening();
    stopText(); // Stop Siya from speaking

    const finalAnswer = (typedAnswer + " " + transcript).trim() || "(No answer given)";
    setPhase("evaluating");
    setAvatarMood("thinking");

    try {
      const result = await evaluateAnswer(
        userInfo,
        questions[currentIndex],
        finalAnswer,
        currentIndex + 1
      );

      setFeedback(result);
      setAvatarMood(result.score >= 7 ? "positive" : result.score >= 4 ? "neutral" : "negative");

      const entry = {
        question: questions[currentIndex],
        answer: finalAnswer,
        score: result.score,
        verdict: result.verdict,
      };
      setSessionData((p) => [...p, entry]);
      setPhase("feedback");
    } catch {
      setError("Feedback load karne mein error aaya. Dobara try karo.");
      setPhase("question");
    }
  };

  // ── Skip question ──────────────────────────────────────
  const handleSkip = () => {
    stopText(); // Stop Siya from speaking
    const entry = {
      question: questions[currentIndex],
      answer: "(Skipped)",
      score: 0,
      verdict: "Skipped",
    };
    setSessionData((p) => [...p, entry]);
    moveNext();
  };

  // ── Move to next question ──────────────────────────────
  const moveNext = () => {
    stopText(); // Stop Siya from speaking
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      onComplete([...sessionData]);
    } else {
      setCurrentIndex(nextIndex);
      setTypedAnswer("");
      resetTranscript();
      setFeedback(null);
      setAvatarMood("neutral");
      setPhase("question");
    }
  };

  const handleNextAfterFeedback = () => {
    stopText(); // Stop Siya from speaking
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      onComplete(sessionData);
    } else {
      moveNext();
    }
  };

  const progress = ((currentIndex) / questions.length) * 100;

  // ── RENDER: Loading ────────────────────────────────────
  if (phase === "loading") {
    return (
      <div className="session-loading">
        <AIAvatar isSpeaking={false} isThinking={true} mood="thinking" />
        <h3>Siya is preparing your questions...</h3>
        <p>Customized for <strong>{userInfo.topic}</strong></p>
        <div className="loading-bar"><div className="loading-bar-fill" /></div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="session-error">
        <div className="error-icon">⚠️</div>
        <h3>Oops!</h3>
        <p>{error}</p>
        <p className="error-hint">
          Make sure your API key is set in <code>src/utils/claudeAPI.js</code>
        </p>
      </div>
    );
  }

  // ── RENDER: Main session ───────────────────────────────
  return (
    <div className="session-container">
      {/* Progress bar */}
      <div className="progress-header">
        <div className="progress-meta">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span className="progress-pct">{Math.round(progress)}% Complete</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="question-dots">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`q-dot ${i < currentIndex ? "q-dot-done" : i === currentIndex ? "q-dot-active" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="session-body">
        {/* Left: Avatar */}
        <div className="session-left">
          <AIAvatar
            isSpeaking={isSiyaSpeaking}
            isThinking={phase === "evaluating"}
            mood={avatarMood}
          />

          {/* User info mini & Voice Controls */}
          <div className="session-user-info">
            <div className="user-tag">👤 {userInfo.name}</div>
            <div className="user-tag">🎯 {userInfo.topic}</div>
            <button 
              className={`mute-btn ${muted ? "muted" : ""}`}
              onClick={() => setMuted(!muted)}
              style={{
                background: "var(--bg-card2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "8px 12px",
                color: muted ? "var(--red)" : "var(--accent-light)",
                cursor: "pointer",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                fontWeight: "600",
                transition: "all 0.2s"
              }}
            >
              <span>{muted ? "🔇 Voice Muted" : "🔊 Voice Unmuted"}</span>
            </button>
          </div>
        </div>

        {/* Right: Q&A + Feedback */}
        <div className="session-right">
          {phase !== "feedback" ? (
            <>
              {/* Question card */}
              <div className="question-card">
                <div className="question-number">Q{currentIndex + 1}</div>
                <div className="question-text">
                  {questions[currentIndex] || "Loading question..."}
                </div>
              </div>

              {/* Answer area */}
              <div className="answer-section">
                <div className="answer-label">
                  {isListening ? "🎙️ Listening... speak your answer" : "✍️ Your Answer"}
                </div>

                <textarea
                  ref={textareaRef}
                  className="answer-textarea"
                  placeholder="Type your answer here, or click mic to speak..."
                  value={displayValue}
                  onChange={(e) => {
                    setTypedAnswer(e.target.value);
                  }}
                  rows={5}
                  disabled={phase === "evaluating"}
                />

                <div className="answer-controls">
                  {isSupported && (
                    <button
                      className={`mic-btn ${isListening ? "mic-active" : ""}`}
                      onClick={isListening ? stopListening : startListening}
                      disabled={phase === "evaluating"}
                    >
                      {isListening ? "⏹️ Stop Mic" : "🎙️ Speak Answer"}
                    </button>
                  )}

                  <button
                    className="btn-skip"
                    onClick={handleSkip}
                    disabled={phase === "evaluating"}
                  >
                    Skip →
                  </button>

                  <button
                    className="btn-primary btn-submit"
                    onClick={handleSubmitAnswer}
                    disabled={phase === "evaluating" || !displayValue.trim()}
                  >
                    {phase === "evaluating" ? "⏳ Evaluating..." : "Submit Answer ✓"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <FeedbackPanel
              feedback={feedback}
              onNext={handleNextAfterFeedback}
              isLastQuestion={currentIndex === questions.length - 1}
            />
          )}
        </div>
      </div>
    </div>
  );
}
