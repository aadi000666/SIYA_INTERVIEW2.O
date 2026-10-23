# 🎯 MockMate AI — Mock Interview Coach

AI-powered mock interview app with animated female AI interviewer "Siya", 
20 custom questions, real-time feedback, and final scorecard.

---

## 📁 Project Structure

```
MockMate-AI/
├── public/
│   └── index.html                    ← HTML entry point
├── src/
│   ├── components/
│   │   ├── OnboardingForm.jsx        ← Screen 1: Personal info form
│   │   ├── InterviewSetup.jsx        ← Screen 2: Mic/camera + intro
│   │   ├── InterviewSession.jsx      ← Screen 3: Main interview (20 Qs)
│   │   ├── AIAvatar.jsx              ← Animated "Siya" female AI face
│   │   ├── FeedbackPanel.jsx         ← Per-answer AI feedback
│   │   └── FinalReport.jsx           ← Screen 4: Full scorecard
│   ├── hooks/
│   │   └── useSpeechRecognition.js   ← Browser mic → text
│   ├── utils/
│   │   └── claudeAPI.js              ← ⚡ ALL API calls (edit only this)
│   ├── App.jsx                       ← Screen router / main controller
│   ├── App.css                       ← Full dark theme styling
│   └── index.js                      ← React entry point
├── package.json
└── README.md
```

---

## 🚀 Setup (3 Steps)

### Step 1 — Install dependencies
```bash
cd MockMate-AI
npm install
```

### Step 2 — Add your API Key
Create a `.env` file in the root directory (we have already created a `.env.example` template and a default `.env` for you) and add your API key there:
```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
# OR
REACT_APP_CLAUDE_API_KEY=your_claude_api_key_here
```
This is much better as you do not need to change any source code to swap API keys!

### Step 3 — Run the app
```bash
npm start
```
Opens at: **http://localhost:3000**

---

## 🎮 How It Works

| Screen | What Happens |
|--------|-------------|
| **Onboarding** | Name, college, field, skills, target role fill karo |
| **Setup** | Mic/camera on karo, rules dekho, Siya se milao |
| **Interview** | 20 AI questions — mic ya type se answer do |
| **Feedback** | Har answer ke baad score + suggestions milenge |
| **Final Report** | Overall grade, strengths, areas to improve, next steps |

---

## 🎙️ Answer Methods
- **Mic (Recommended)** — Browser permission do, bol ke answer do
- **Type** — Textarea mein type karo
- **Both** — Pehle bolo, phir edit karo — dono combine ho jaate hain

---

## 🤖 AI Features
- **Question Generation** — Siya tumhara field + role dekh ke 20 custom questions banati hai
- **Answer Evaluation** — Har answer ko score (1-10), verdict, praise, suggestion milta hai
- **Model Answer** — Siya ek better answer snippet bhi dikhati hai
- **Final Report** — Overall grade (A+ to D), readiness level, action plan

---

## 🛠️ Customization

### Questions ki number change karni ho:
`src/components/InterviewSession.jsx` mein:
```js
setQuestions(qs.slice(0, 20)); // 20 ki jagah 10 ya 30 karo
```

### Language change karni ho (mic ke liye):
`src/hooks/useSpeechRecognition.js` mein:
```js
recognition.lang = "hi-IN"; // Hindi ke liye
recognition.lang = "en-IN"; // Indian English (default)
```

### Colors/theme change karne ke liye:
`src/App.css` mein `:root` section edit karo

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| API Error | `claudeAPI.js` mein API key check karo |
| Mic kaam nahi kar raha | Chrome/Edge use karo (Firefox mein limited support) |
| Questions load nahi ho rahe | Console mein error dekho (F12) |
| CORS error aaye | Browser ka CORS check — `anthropic-dangerous-direct-browser-access: true` header already set hai |

---

## 📦 Tech Stack
- **React 18** — UI framework
- **Claude Sonnet 4.6** — AI engine (questions + evaluation)
- **Web Speech API** — Browser built-in mic (no library needed)
- **CSS Variables** — Dark purple theme, fully responsive
- **No Redux, No Router** — Simple useState-based screen management

---

Made with ❤️ for students by Aadi

---

## 🌐 Live Deployment
This project is configured with GitHub Actions to automatically deploy to GitHub Pages at:
**https://aadi000666.github.io/SIYA_INTERVIEW2.O**


Every time you push changes to the `main` branch, the site will build and update automatically.

### Configuring API Keys on the Deployed Site
For the live website, you can change or configure the API key in the environment variables of your deployment provider (such as Vercel or Netlify) or keep it using the default key configured in `src/utils/claudeAPI.js`.
