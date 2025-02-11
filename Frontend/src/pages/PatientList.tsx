import React, { useState, useEffect, useCallback } from "react";
import "./PatientListStyle.css";
import PatientCard from "../components/Patient/PatientCard";
import PatientAlertSection from "../components/Patient/PatientAlert";
import FloorButton from "../components/Patient/Floorbtn";
import SortButton from "../components/Patient/SortBtn";
import { useNavigate } from 'react-router-dom';

interface PatientData {
  id: number;
  name: string;
  age:string;
  roomNumber:string;
  specifics:string;
  floor:string;
  caseHistory:string;
  temperature:string;
  urgencyLevel:string;
  status:string;
  createdAt:string;
  alertType:number;
  alertMessage:string;
}

interface ApiResponse {
  status: number;
  message: string;
  data: {
    listSize: number;
    patientList: PatientData[];
  };
}

const PatientList: React.FC = () => {
  const [activeFloor, setActiveFloor] = useState<string>("1층");
  const [activeSort, setActiveSort] = useState<string>("최신순");
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const sortMapping: Record<string, string> = {
        '최신순': 'created_at',
        '위급도순': 'urgency_level',
        'ToDo': 'to_do',
        'Done': 'done'
      };

      const sortKeyword = sortMapping[activeSort] || 'created_at';
      const floorNumber = activeFloor.replace('층', '') || '1';

      const params = new URLSearchParams();
      params.append('order', 'desc');
      params.append('floor', floorNumber);
      params.append('sort', sortKeyword);

      const apiUrl = `${API_URL}/non-public/patients?${params.toString()}`;


      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (result.status === 200) {
        // admissionDate에서 시간 부분을 제거하여 날짜만 처리
        const updatedPatients = result.data.patientList.map(patient => ({
          ...patient,
          createdAt: patient.createdAt.split('T')[0], // "2025-02-11" 형태로 날짜만 추출
        }));
        setPatients(updatedPatients);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, [activeFloor, activeSort]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleFloorClick = (floor: string) => {
    setActiveFloor(prev => (prev === floor ? "1층" : floor));
  };

  const handleSortClick = (sort: string) => {
    setActiveSort(prev => (prev === sort ? "최신순" : sort));
  };

  const handleCreate = () => {
    navigate('/patientregistration');
  };

  return (
    <div className="patient-list-container">
      <div className="patient-alert-sections">
        <PatientAlertSection />
      </div>

      <div className="patient-floor-filter-section">
        {["1층", "2층", "3층"].map((floor) => (
          <FloorButton
            key={floor}
            floor={floor}
            isActive={activeFloor === floor}
            onClick={() => handleFloorClick(floor)}
          />
        ))}
      </div>

      <div className="patient-sort-section">
        <div className="sort-buttons">
          {["최신순", "위급도순",'ToDo',"Done"].map((option) => (
            <SortButton
              key={option}
              label={option}
              isActive={activeSort === option}
              onClick={() => handleSortClick(option)}
            />
          ))}
        </div>
      <button className="add-patient-button" onClick={handleCreate}>+ 환자 추가</button>
      </div>

      <div className="patient-card-list">
        {loading ? (
          <div className="loading-text">환자 정보를 불러오는 중...</div>
        ) : patients.length === 0 ? (
          <div className="no-patient-text">등록된 환자가 없습니다.</div>
        ) : (
          patients.map((patient) => (
            <PatientCard
              key={patient.id}
              id={patient.id}
              age={patient.age}
              name={patient.name}
              location={`${patient.floor}층 - ${patient.roomNumber}호`}
              status={patient.status}
              caseHistory={patient.caseHistory}
              alertType={patient.urgencyLevel? "응급" : ""}
              alertMessage={patient.specifics}
              lastTreatmentDate={patient.createdAt}
              // 누락된 props 추가
              specifics={patient.specifics}
              floor={patient.floor}
              temperature={patient.temperature || "36.5"} // 기본값 설정
              urgencyLevel={patient.urgencyLevel}
              createdAt={patient.createdAt}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PatientList;
