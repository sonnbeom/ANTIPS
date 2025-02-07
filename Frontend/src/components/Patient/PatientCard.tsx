import React from "react";
import { useNavigate } from "react-router-dom";
import "./PatientCardStyle.css";

interface PatientCardProps {
  id: number;
  name: string;
  patientId: string;
  location: string;
  status: string;
  alertType: string;
  alertMessage: string;
  lastTreatmentDate: string;
}

const PatientCard: React.FC<PatientCardProps> = ({
  id,
  name,
  patientId,
  location,
  status,
  alertType,
  alertMessage,
  lastTreatmentDate,
}) => {
  const navigate = useNavigate();

  const handleNavigateToDetail = () => {
    navigate(`/patient/${id}`);
  };

  return (
    <div className={`patient-card ${status === "입원중" ? "inpatient" : "waiting"}`}>
      {/* 환자 정보 */}
      <div className="patient-info">
        <div className="patitent-info-left">
          <img
            src={`https://randomuser.me/api/portraits/men/75.jpg`}
            alt={name}
            className="patient-avatar"
          />
          <div>
            <h4>{name}</h4>
            <p>환자번호: {patientId}</p>
            <p>위치: {location}</p>
          </div>
        </div>
        <div className="patitent-info-right">
          <span
            className={`patient-status-badge ${
              status === "입원중" ? "inpatient" : "waiting"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* 알림 정보 */}
      {alertType && (
        <div
          className={`patient-alert ${
            alertType === "응급" ? "urgent" : alertType === "특별 메모" ? "info" : ""
          }`}
        >
          <span className="patient-alert-icon">⚠️</span>
          {alertType}: {alertMessage}
        </div>
      )}
      {/* 마지막 진료 정보 */}
      <hr />
      <div className="patient-last-treatment-section">
        <p className="patient-last-treatment">
          <span className="patient-last-treatment-icon">⏰</span> 입원날짜: {lastTreatmentDate}
        </p>
        <button 
          className="patient-navigate-button"
          onClick={handleNavigateToDetail}
        >
          상세보기 →
        </button>
      </div>
    </div>
  );
};

export default PatientCard;
