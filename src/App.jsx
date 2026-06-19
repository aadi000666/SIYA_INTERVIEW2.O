// ============================================================
//  App.jsx — Main app controller
//  Screens: onboarding → setup → interview → report
// ============================================================
import React, { useState } from "react";
import OnboardingForm from "./components/OnboardingForm";
import InterviewSetup from "./components/InterviewSetup";
import InterviewSession from "./components/InterviewSession";
import FinalReport from "./components/FinalReport";
import "./App.css";

const SCREENS = {
  ONBOARDING: "onboarding",
  SETUP: "setup",
  INTERVIEW: "interview",
  REPORT: "report",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.ONBOARDING);
  const [userInfo, setUserInfo] = useState(null);
  const [sessionData, setSessionData] = useState([]);

  const handleOnboardingSubmit = (info) => {
    setUserInfo(info);
    setScreen(SCREENS.SETUP);
  };

  const handleSetupStart = () => {
    setScreen(SCREENS.INTERVIEW);
  };

  const handleInterviewComplete = (data) => {
    setSessionData(data);
    setScreen(SCREENS.REPORT);
  };

  const handleRestart = () => {
    setUserInfo(null);
    setSessionData([]);
    setScreen(SCREENS.ONBOARDING);
  };

  return (
    <div className="app-root">
      {/* Background */}
      <div className="app-bg">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      {/* Screen router */}
      <div className="app-content">
        {screen === SCREENS.ONBOARDING && (
          <OnboardingForm onSubmit={handleOnboardingSubmit} />
        )}

        {screen === SCREENS.SETUP && userInfo && (
          <InterviewSetup
            userInfo={userInfo}
            onStart={handleSetupStart}
            onBack={() => setScreen(SCREENS.ONBOARDING)}
          />
        )}

        {screen === SCREENS.INTERVIEW && userInfo && (
          <InterviewSession
            userInfo={userInfo}
            onComplete={handleInterviewComplete}
          />
        )}

        {screen === SCREENS.REPORT && userInfo && (
          <FinalReport
            userInfo={userInfo}
            sessionData={sessionData}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
