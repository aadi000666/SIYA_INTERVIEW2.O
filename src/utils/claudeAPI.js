// ============================================================
//  claudeAPI.js — MockMate AI
//  Yahan sirf API_KEY daalna hai — baaki sab kuch yahi se hoga
// ============================================================

// Key dynamically checks environment variables first, then defaults to the hardcoded value.
const API_KEY = (typeof process !== "undefined" && process.env) ? (
  process.env.REACT_APP_GEMINI_API_KEY ||
  process.env.REACT_APP_CLAUDE_API_KEY ||
  process.env.REACT_APP_API_KEY ||
  "AIzaSyCpDlB7OaKD2mDUXb5QsrHhG3Jw9-Jdxf8"
) : "AIzaSyCpDlB7OaKD2mDUXb5QsrHhG3Jw9-Jdxf8";

const IS_GEMINI = API_KEY.startsWith("AIzaSy");
const CLAUDE_MODEL = "claude-3-5-sonnet-20241022";
const GEMINI_MODEL = "gemini-2.5-flash";

const CLAUDE_URL = "https://api.anthropic.com/v1/messages";
const getGeminiUrl = () => `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;

// ─── Core fetch wrapper ────────────────────────────────────
async function callClaude(systemPrompt, userMessage, conversationHistory = []) {
  if (IS_GEMINI) {
    // ─── Gemini Flow ──────────────────────────────────────
    const contents = [];
    
    // Map message history to Gemini's format
    for (const msg of conversationHistory) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      });
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: userMessage }]
    });

    const payload = {
      contents,
      systemInstruction: systemPrompt ? {
        parts: [{ text: systemPrompt }]
      } : undefined,
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json" // Ensures structured JSON output
      }
    };

    const response = await fetch(getGeminiUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error?.message || "Gemini API call failed");
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } else {
    // ─── Claude Flow ──────────────────────────────────────
    const messages = [
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

    const response = await fetch(CLAUDE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error?.message || "Claude API call failed");
    }

    const data = await response.json();
    return data.content?.[0]?.text || "";
  }
}

// ─── 1. Generate 20 interview questions ───────────────────
export async function generateQuestions(userInfo) {
  const system = `You are MockMate, a professional AI interview coach. 
Generate exactly 20 interview questions for a candidate. 
Return ONLY a valid JSON array of 20 strings — no extra text, no markdown fences.
Mix question types: technical (40%), behavioral (30%), situational (20%), HR (10%).
Difficulty should gradually increase from easy to hard.`;

  const prompt = `Generate 20 interview questions for:
Name: ${userInfo.name}
Education: ${userInfo.education} in ${userInfo.degree}
Field of Interest: ${userInfo.field}
Interview Topic/Role: ${userInfo.topic}
Experience Level: ${userInfo.experience}
Skills: ${userInfo.skills}`;

  const raw = await callClaude(system, prompt);

  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    // Fallback: split by newlines if JSON parse fails
    return raw
      .split("\n")
      .filter((l) => l.trim().match(/^\d+\.|^"/))
      .slice(0, 20)
      .map((l) => l.replace(/^\d+\.\s*"|"$/g, "").trim());
  }
}

// ─── 2. Evaluate a single answer ──────────────────────────
export async function evaluateAnswer(userInfo, question, answer, questionNumber) {
  const system = `You are Siya, a warm but honest female AI interview coach with 10 years of experience.
You evaluate candidate answers and give constructive feedback.
Always respond in this EXACT JSON format (no markdown, no extra text):
{
  "score": <number 1-10>,
  "verdict": "<Excellent|Good|Average|Needs Improvement>",
  "praise": "<what was good about the answer, 1-2 sentences>",
  "suggestion": "<specific improvement tip, 1-2 sentences>",
  "betterAnswer": "<a model answer snippet, 2-3 sentences>",
  "encouragement": "<short motivating line>"
}`;

  const prompt = `Candidate: ${userInfo.name} | Field: ${userInfo.field} | Role: ${userInfo.topic}
Question ${questionNumber}: "${question}"
Candidate's Answer: "${answer || "(No answer given / skipped)"}"
Evaluate this answer professionally.`;

  const raw = await callClaude(system, prompt);

  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return {
      score: 5,
      verdict: "Average",
      praise: "You attempted the question.",
      suggestion: "Try to be more specific with examples.",
      betterAnswer: "A strong answer uses the STAR method with real examples.",
      encouragement: "Keep practicing, you're improving!",
    };
  }
}

// ─── 3. Generate final interview report ───────────────────
export async function generateFinalReport(userInfo, questionsAndAnswers) {
  const system = `You are MockMate AI, an expert interview analysis system.
Generate a comprehensive final report. Return ONLY valid JSON, no markdown:
{
  "overallScore": <1-100>,
  "grade": "<A+|A|B+|B|C+|C|D>",
  "summary": "<3-4 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "areasToImprove": ["<area 1>", "<area 2>", "<area 3>"],
  "topSkillsToLearn": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "readinessLevel": "<Not Ready|Almost Ready|Ready|Highly Ready>",
  "nextSteps": "<2-3 sentence action plan>",
  "motivationalMessage": "<inspiring closing message>"
}`;

  const qaText = questionsAndAnswers
    .map((qa, i) => `Q${i + 1}: ${qa.question}\nA: ${qa.answer}\nScore: ${qa.score}/10`)
    .join("\n\n");

  const prompt = `Generate final report for:
Name: ${userInfo.name} | Field: ${userInfo.field} | Role: ${userInfo.topic}

Interview Q&A Summary:
${qaText}`;

  const raw = await callClaude(system, prompt);

  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return {
      overallScore: 60,
      grade: "B",
      summary: "You completed the mock interview successfully.",
      strengths: ["Attempted all questions", "Good communication"],
      areasToImprove: ["Technical depth", "Structured answers"],
      topSkillsToLearn: ["STAR method", "System design basics"],
      readinessLevel: "Almost Ready",
      nextSteps: "Practice more mock interviews and study core concepts.",
      motivationalMessage: "Every expert was once a beginner. Keep going!",
    };
  }
}
