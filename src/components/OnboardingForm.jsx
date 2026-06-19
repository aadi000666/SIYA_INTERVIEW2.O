// ============================================================
//  OnboardingForm.jsx — Student ka personal info lena
// ============================================================
import React, { useState } from "react";

const FIELDS = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Data Science & AI",
  "MBA / Management",
  "BCA / MCA",
  "B.Sc / M.Sc",
  "Other",
];

const EXPERIENCE_LEVELS = ["Fresher", "0-1 Year", "1-2 Years", "2+ Years"];

export default function OnboardingForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    education: "",
    degree: "",
    field: "",
    skills: "",
    experience: "Fresher",
    topic: "",
  });
  const [errors, setErrors] = useState({});

  const update = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name required";
    if (!form.education.trim()) e.education = "Education required";
    if (!form.degree.trim()) e.degree = "Degree required";
    if (!form.field) e.field = "Select your field";
    if (!form.topic.trim()) e.topic = "Interview topic required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <div className="logo-badge">
            <span className="logo-icon">🎯</span>
          </div>
          <h1 className="app-title">MockMate AI</h1>
          <p className="app-subtitle">
            Aapki AI-powered Mock Interview Coach
          </p>
        </div>

        <div className="form-grid">
          {/* Name */}
          <div className="form-group">
            <label>Your Full Name</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          {/* Education */}
          <div className="form-group">
            <label>Current Education Level</label>
            <input
              type="text"
              placeholder="e.g. B.Tech 3rd Year, Diploma, MBA"
              value={form.education}
              onChange={(e) => update("education", e.target.value)}
              className={errors.education ? "input-error" : ""}
            />
            {errors.education && (
              <span className="error-msg">{errors.education}</span>
            )}
          </div>

          {/* Degree/College */}
          <div className="form-group">
            <label>College / University</label>
            <input
              type="text"
              placeholder="e.g. SRMU, IIT Delhi, VIT"
              value={form.degree}
              onChange={(e) => update("degree", e.target.value)}
              className={errors.degree ? "input-error" : ""}
            />
            {errors.degree && (
              <span className="error-msg">{errors.degree}</span>
            )}
          </div>

          {/* Field */}
          <div className="form-group">
            <label>Field / Branch</label>
            <select
              value={form.field}
              onChange={(e) => update("field", e.target.value)}
              className={errors.field ? "input-error" : ""}
            >
              <option value="">-- Select your field --</option>
              {FIELDS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            {errors.field && (
              <span className="error-msg">{errors.field}</span>
            )}
          </div>

          {/* Skills */}
          <div className="form-group full-width">
            <label>Your Key Skills (optional)</label>
            <input
              type="text"
              placeholder="e.g. Python, React, Machine Learning, SQL"
              value={form.skills}
              onChange={(e) => update("skills", e.target.value)}
            />
          </div>

          {/* Experience */}
          <div className="form-group">
            <label>Experience Level</label>
            <div className="chip-group">
              {EXPERIENCE_LEVELS.map((exp) => (
                <button
                  key={exp}
                  className={`chip ${form.experience === exp ? "chip-active" : ""}`}
                  onClick={() => update("experience", exp)}
                  type="button"
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Interview Topic */}
          <div className="form-group full-width">
            <label>Interview Topic / Target Role ✨</label>
            <input
              type="text"
              placeholder="e.g. Frontend Developer, Data Analyst, Python Developer, Campus Placement"
              value={form.topic}
              onChange={(e) => update("topic", e.target.value)}
              className={errors.topic ? "input-error" : ""}
            />
            {errors.topic && (
              <span className="error-msg">{errors.topic}</span>
            )}
          </div>
        </div>

        <button className="btn-primary btn-large" onClick={handleSubmit}>
          Start My Mock Interview →
        </button>

        <p className="footer-note">
          20 AI-generated questions • Real-time feedback • Final scorecard
        </p>
      </div>
    </div>
  );
}
