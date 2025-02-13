import React from "react";
import "./RobotStyle.css";
import LiveRobotFeed from "../components/Robot/LiveRobotFeed";
import RobotController from "../components/Robot/RobotController";;
import PatientAlertSection from "../components/Patient/PatientAlert";

const Robot: React.FC = () => {
  return (
    <div className="robot-page-container">

      {/* 알림 섹션 */}
      <div className="robot-alert-section">
      <PatientAlertSection />
      </div>
      {/* 로봇 라이브 피드 */}
      <div className="robot-dashboard">
      <LiveRobotFeed />
      <RobotController />
    </div>
    </div>
  );
};

export default Robot;
