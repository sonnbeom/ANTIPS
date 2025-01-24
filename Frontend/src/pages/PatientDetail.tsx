// PatientDetail.tsx
import React from 'react';
import './PatientDetailStyle.css';
import PatientAlertSection from '../components/Patient/PatientAlert.tsx'
import PatientDetailCard from '../components/Patient/PatientDetailCard.tsx';
import TreatmentRecord from '../components/Patient/TreatmentRecord.tsx'

interface PatientData {
  patientId: number;
  name: string;
  birthDate: string;
  age: number;
  specifics: string;
  urgencyLevel: number;
  temperature: number;
  floor: number;
  roomNumber: number;
}

interface TreatmentData {
  type: 'urgent' | 'normal';
  title: string;
  description: string;
  doctor: string;
  timestamp: string;
}

const PatientDetail: React.FC = () => {
  // 환자 정보 더미 데이터
  const patientData: PatientData = {
    patientId: 1,
    name: "손승범",
    birthDate: "1998-05-14",
    age: 27,
    specifics: "고온이 3일 정도 지속됨",
    urgencyLevel: 4,
    temperature: 36.5,
    floor: 1,
    roomNumber: 101
  };

  // 치료 기록 더미 데이터
  const treatmentRecords: TreatmentData[] = [
    {
      type: 'urgent',
      title: '응급 처치: 고열 증상',
      description: '체온 38.9도 확인, 해열제 타이레놀 500mg 투여',
      doctor: '김지훈 의사',
      timestamp: '2024-01-15 14:30'
    },
    {
      type: 'normal',
      title: '정기 회진',
      description: '활력징후 확인, 수액 교체 (생리식염수 1000ml)',
      doctor: '이수진 간호사',
      timestamp: '2024-01-15 10:15'
    },
    {
      type: 'urgent',
      title: '알레르기 반응 대응',
      description: '피부 발진 확인, 항히스타민제 투여',
      doctor: '박성훈 의사',
      timestamp: '2024-01-14 18:45'
    }
  ];

  return (
    <div className="patient-detail-container">
      <div className="patient-alert-sections">
        <PatientAlertSection />
      </div>
      <div className='patient-detail-card'>
        <PatientDetailCard 
          patientId={patientData.patientId}
          name={patientData.name}
          birthDate={patientData.birthDate}
          age={patientData.age}
          specifics={patientData.specifics}
          urgencyLevel={patientData.urgencyLevel}
          temperature={patientData.temperature}
          floor={patientData.floor}
          roomNumber={patientData.roomNumber}
        />
      </div>
      <div className='patient-treatmentrecord-sections'>
        <div className="treatment-records-header">
          <h2>긴급 조치 기록</h2>
        </div>
        <div className="treatment-records-list">
          {treatmentRecords.map((record, index) => (
            <TreatmentRecord
              key={index}
              type={record.type}
              title={record.title}
              description={record.description}
              doctor={record.doctor}
              timestamp={record.timestamp}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
