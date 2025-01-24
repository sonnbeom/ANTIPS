import React from "react";
import "./PatientAlertStyle.css";
import { FaExclamationTriangle } from "react-icons/fa";
interface Alert {
  id: number;
  room: string;
  name: string;
  message: string;
  category: "urgent" | "warning" | "info"; // 카테고리
  timeAgo: string;
}

const alertsData: Alert[] = [
  { id: 1, room: "101호", name: "김서연", message: "알레르기 반응", category: "urgent", timeAgo: "10분 전" },
  { id: 2, room: "103호", name: "이민준", message: "투약 일정 변경", category: "warning", timeAgo: "30분 전" },
  { id: 3, room: "105호", name: "박지우", message: "추적 관찰 필요", category: "info", timeAgo: "1시간 전" },
  { id: 4, room: "105호", name: "박지우", message: "추적 관찰 필요", category: "info", timeAgo: "1시간 전" },
];

const PatientAlertSection: React.FC = () => {
  return (
    <div className="patient-alert-section">
      {/* 헤더 */}
      <div className="patient-alert-header">
      <div className="patient-icon-text-container">
      <FaExclamationTriangle size={24} color="red" />
      <span>응급 및 특별 알림</span>
    </div>
        <span className="patient-active-alert-count">활성 알림 {alertsData.length}개</span>
      </div>

      {/* 알림 리스트 */}
      <ul className="patient-alert-list">
        {alertsData.map((alert) => (
          <li key={alert.id} className={`patient-alert-item ${alert.category}`}>
            <span>
              {alert.room}: {alert.name} - {alert.message}
            </span>
            <span className="patient-time">{alert.timeAgo}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientAlertSection;
