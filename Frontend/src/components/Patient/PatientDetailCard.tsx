import React from 'react';
import './PatientDetailCardStyle.css';
import { FaUserCircle } from 'react-icons/fa';
import PatientInfoItem from './PatientInfoItem';
import { useNavigate } from 'react-router-dom';

interface PatientDetailProps {
  id: number;
  name: string;
  age: number;
  specifics: string;
  urgencyLevel: number;
  temperature: number;
  floor: number;
  roomNumber: number;
  bedNumber: string;
  caseHistory : string;
  createdAt :string;
  status :string;
}

const PatientDetailCard: React.FC<PatientDetailProps> = ({
  id,
  name,
  age,
  specifics,
  urgencyLevel,
  temperature,
  floor,
  roomNumber,
  bedNumber,
  caseHistory,
  createdAt,
  status,
}) => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_SERVER_URL;
  const handleEditClick = () => {
    navigate(`/patient/edit/${id}`);
  };
  const handleDeleteClick = async () => {
    // 삭제 확인 다이얼로그
    if (!window.confirm('정말로 이 환자의 정보를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(
        `${API_URL}/non-public/patient?patientId=${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete patient');
      }

      // 삭제 성공 시 환자 목록 페이지로 이동
      navigate('/patientlist');
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('환자 정보 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="patient-detailcard-container">
      <div className="patient-detailcard-header">
        <h2>환자 정보</h2>
        <div className='patiemt-detailcard-header-button'>
        <button 
          className="patient-detailcard-edit-button"
          onClick={handleEditClick}
        >
          환자 정보 수정
        </button>
        <button 
            className="patient-detailcard-delete-button"
            onClick={handleDeleteClick}
          >
            환자 정보 삭제
          </button>
      </div>
      </div>
      <div className="patient-detailcard-info-card">
        <div className="patient-detailcard-profile">
          <div className="patient-detailcard-profile-image">
            <FaUserCircle size={80} />
          </div>
          <div className="patient-detailcard-info">
            <h3>{name}</h3>
            <p className="patient-detailcard-id">PAT-{String(id).padStart(3, '0')}</p>
            <p className="patient-detailcard-id">입원날짜 : {createdAt.split('T')[0]}</p>
          </div>
        </div>
        <div className="patient-detailcardinfo-grid">
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
          value={`${floor}층 ${bedNumber}번`} 
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
        <PatientInfoItem 
          label="과거병력" 
          value={caseHistory} 
        />
      </div>
      </div>
    </div>
  );
};

export default PatientDetailCard;
