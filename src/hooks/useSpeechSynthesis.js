import { useState, useEffect, useRef, useCallback } from "react";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const utteranceRef = useRef(null);

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback((text) => {
    if (!("speechSynthesis" in window)) return;
    
    const cleanText = text
      .replace(/```[a-z]*\n[\s\S]*?\n```/g, "") 
      .replace(/[{}\[\]"]/g, "") 
      .replace(/[#*_]/g, "") 
      .trim();

    if (!cleanText) return;

    const playVoice = () => {
      window.speechSynthesis.cancel();
      if (muted) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utteranceRef.current = utterance;

      const voices = window.speechSynthesis.getVoices();
      
      const isHindi = /[\u0900-\u097F]/.test(cleanText);
      let voice = null;

      if (isHindi) {
        voice = voices.find(v => 
          (v.name && v.name.toLowerCase().includes("swara")) || 
          (v.voiceURI && v.voiceURI.toLowerCase().includes("swara"))
        ) || voices.find(v => v.lang && v.lang.includes("hi-IN"));
      } else {
        voice = voices.find(v => 
          (v.name && v.name.toLowerCase().includes("neerja")) || 
          (v.voiceURI && v.voiceURI.toLowerCase().includes("neerja"))
        ) || voices.find(v => 
            (v.name && v.name.toLowerCase().includes("google us english")) || 
            (v.name && v.name.toLowerCase().includes("zira")) || 
            (v.name && v.name.toLowerCase().includes("google uk english female")) ||
            (v.lang && v.lang.toLowerCase().includes("en") && v.name && v.name.toLowerCase().includes("female"))
          ) || voices.find(v => v.lang && v.lang.toLowerCase().includes("en"));
      }

      if (!voice && voices.length > 0) {
        voice = voices[0];
      }
      
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = 1.05;
      utterance.pitch = 1.15;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", playVoice, { once: true });
    } else {
      playVoice();
    }
  }, [muted]);

  // Prime voices cache
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    muted,
    setMuted,
  };
}
