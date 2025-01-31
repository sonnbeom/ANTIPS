import React, { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import AlertModal from "./AlertModal.tsx";
import "./PatientAlertStyle.css";

interface Alert {
  id: number;
  room: string;
  name: string;
  message: string;
  category: "urgent" | "warning" | "info";
  timeAgo: string;
}

interface AlertData {
  patient: {
    patientId: number;
    name: string;
    age: number;
    floor: number;
    roomNumber: number;
    urgencyLevel: number;
  };
  urgentCareList: {
    urgentCareId: number;
    urgentCareContent: string;
    createdAt: string;
  }[];
}

const alertsData: Alert[] = [
  { id: 1, room: "101호", name: "김서연", message: "알레르기 반응", category: "urgent", timeAgo: "10분 전" },
  { id: 2, room: "103호", name: "이민준", message: "투약 일정 변경", category: "warning", timeAgo: "30분 전" },
  { id: 3, room: "105호", name: "박지우", message: "추적 관찰 필요", category: "info", timeAgo: "1시간 전" },
];

const patientDataList: AlertData[] = [
  {
    patient: {
      patientId: 1,
      name: "손승범",
      age: 27,
      floor: 1,
      roomNumber: 101,
      urgencyLevel: 4,
    },
    urgentCareList: [
      { urgentCareId: 1, urgentCareContent: "합병증 증상으로 인한 열 39도", createdAt: "2024-10-23" },
      { urgentCareId: 2, urgentCareContent: "원인 모름 열 39도", createdAt: "2024-10-21" },
    ],
  },
  {
    patient: {
      patientId: 2,
      name: "김민준",
      age: 40,
      floor: 2,
      roomNumber: 103,
      urgencyLevel: 3,
    },
    urgentCareList: [
      { urgentCareId: 3, urgentCareContent: "투약 일정 변경", createdAt: "2024-10-22" },
    ],
  },
  {
    patient: {
      patientId: 3,
      name: "박지우",
      age: 55,
      floor: 3,
      roomNumber: 105,
      urgencyLevel: 2,
    },
    urgentCareList: [
      { urgentCareId: 4, urgentCareContent: "추적 관찰 필요", createdAt: "2024-10-20" },
    ],
  },
];

const PatientAlertSection: React.FC = () => {
  const [selectedAlertData, setSelectedAlertData] = useState<AlertData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAlertClick = (alert: Alert) => {
    const alertData = patientDataList.find((data) => data.patient.patientId === alert.id);
    if (alertData) {
      setSelectedAlertData(alertData);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlertData(null);
  };

  return (
    <div className="patient-alert-section">
      <div className="patient-alert-header">
        <div className="patient-icon-text-container">
          <FaExclamationTriangle size={24} color="red" />
          <span>응급 및 특별 알림</span>
        </div>
        <span className="patient-active-alert-count">활성 알림 {alertsData.length}개</span>
      </div>
      <ul className="patient-alert-list">
        {alertsData.map((alert) => (
          <li
            key={alert.id}
            className={`patient-alert-item ${alert.category}`}
            onClick={() => handleAlertClick(alert)}
          >
            <span>
              {alert.room}: {alert.name} - {alert.message}
            </span>
            <span className="patient-time">{alert.timeAgo}</span>
          </li>
        ))}
      </ul>

      <AlertModal 
        alertData={selectedAlertData} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default PatientAlertSection;
