import React from 'react';
import './PatientDetailCardStyle.css';
import { FaUserCircle } from 'react-icons/fa';
import PatientInfoItem from './PatientInfoItem';
import { useNavigate } from 'react-router-dom';

interface PatientDetailProps {
  id: number;
  name: string;
  birthDate: string;
  age: number;
  specifics: string;
  urgencyLevel: number;
  temperature: number;
  floor: number;
  roomNumber: number;
}

const PatientDetailCard: React.FC<PatientDetailProps> = ({
  id,
  name,
  birthDate,
  age,
  specifics,
  urgencyLevel,
  temperature,
  floor,
  roomNumber
}) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/patient/edit/${id}`);
  };

  return (
    <div className="patient-detailcard-container">
      <div className="patient-detailcard-header">
        <h2>환자 정보</h2>
        <button 
          className="patient-detailcard-edit-button"
          onClick={handleEditClick}
        >
          환자 정보 수정
        </button>
      </div>

      <div className="patient-detailcard-info-card">
        <div className="patient-detailcard-profile">
          <div className="patient-detailcard-profile-image">
            <FaUserCircle size={80} />
          </div>
          <div className="patient-detailcard-info">
            <h3>{name}</h3>
            <p className="patient-detailcard-id">PAT-{String(id).padStart(3, '0')}</p>
          </div>
        </div>
        <div className="patient-detailcardinfo-grid">
        <PatientInfoItem 
          label="생년월일" 
          value={birthDate} 
        />
        <PatientInfoItem 
          label="나이" 
          value={`${age}세`} 
        />
        <PatientInfoItem 
          label="현재 체온" 
          value={`${temperature}°C`} 
        />
        <PatientInfoItem 
          label="병실 정보" 
          value={`${floor}층 ${roomNumber}호`} 
        />
        <PatientInfoItem 
          label="긴급도" 
          value={urgencyLevel}
          isUrgencyLevel={true}
          urgencyLevel={urgencyLevel}
        />
        <PatientInfoItem 
          label="특이사항" 
          value={specifics} 
        />
      </div>
      </div>
    </div>
  );
};

export default PatientDetailCard;
