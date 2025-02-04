import React from "react";
import "./RobotStyle.css";
import LiveRobotFeed from "../components/Robot/LiveRobotFeed";
import CurrentLocation from "../components/Robot/CurrentLocation";
import RobotActivityLog from "../components/Robot/RobotActivityLog";
import PatientAlertSection from "../components/Patient/PatientAlert";

const Robot: React.FC = () => {
  return (
    <div className="robot-page-container">

      {/* 알림 섹션 */}
      <div className="robot-alert-section">
      <PatientAlertSection />
      </div>
      {/* 로봇 라이브 피드 */}
      <div className="robot-live-section">
      <LiveRobotFeed />
      </div>
      {/* 현재 위치 및 로봇 활동 로그 */}
      <div className="robot-info-section">
        <CurrentLocation />
        <RobotActivityLog />
      </div>
    </div>
  );
};

export default Robot;
