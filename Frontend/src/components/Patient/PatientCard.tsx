import React from "react";
import { useNavigate } from "react-router-dom";
import history from "../../assets/history.svg"
import alert from "../../assets/alert.svg"
import creat from "../../assets/creat.svg"
import "./PatientCardStyle.css";

interface PatientCardProps {
  id: number;
  name: string;
  age:string;
  lastTreatmentDate:string;
  location:string;
  specifics:string;
  floor:string;
  caseHistory:string;
  temperature:string;
  urgencyLevel:string;
  status:string;
  createdAt:string;
  alertType:string;
  alertMessage:string;
}

const PatientCard: React.FC<PatientCardProps> = ({
  id,
  name,
  lastTreatmentDate,
  location,
  specifics,
  age,
  floor,
  caseHistory,
  temperature,
  urgencyLevel,
  status,
  createdAt,
  alertType,
  alertMessage,
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
          <div>
            <h4>{name}</h4>
            <p>나이 : {age}</p>
            <p>환자번호: # {id}</p>
            <p>위치: {location}</p>
          </div>
        </div>
        <div className="patitent-info-right">
          <span
            className={`patient-status-badge ${
              status === "done" ? "inpatient" : "waiting"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* 알림 정보 */}
      {alertType && (
        <div className='patient-alert-urgent'>
          <img src={alert} alt="" className="patient-alert-icon"/> {alertMessage}
        </div>
      )}
        {caseHistory && (
        <div className='patient-alert-info'>
        <img src={history} alt="" className="patient-alert-icon"/> {caseHistory}
        </div>
      )}
      {/* 마지막 진료 정보 */}
      <hr />
      <div className="patient-last-treatment-section">
        <p className="patient-last-treatment">
          <img src={creat} alt="" className="patient-last-treatment-icon"/>  입원날짜: {lastTreatmentDate}
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
