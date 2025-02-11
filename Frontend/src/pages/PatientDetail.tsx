import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PatientDetailStyle.css';
import PatientAlertSection from '../components/Patient/PatientAlert'
import PatientDetailCard from '../components/Patient/PatientDetailCard';
import TreatmentRecord from '../components/Patient/TreatmentRecord'


const API_URL = import.meta.env.VITE_SERVER_URL;
interface PatientData {
  id: number;
  name: string;
  birthDate: string;
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

interface UrgentCareData {
  id: number;
  content: string;
  createdAt: string;
}

interface ApiResponse {
  status: number;
  message: string;
  data: {
    urgentCareList: UrgentCareData[];
  };
}

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [treatmentRecords, setTreatmentRecords] = useState<UrgentCareData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('토큰이 없습니다');
        }

        const [patientResponse, treatmentResponse] = await Promise.all([
          fetch(`${API_URL}/non-public/patient?patientId=${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${API_URL}/non-public/urgent-care/emergency?patientId=${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
        ]);

        const patientResult: ApiResponse = await patientResponse.json();
        const treatmentResult = await treatmentResponse.json();

        if (patientResponse.ok && patientResult.status === 200) {
          setPatientData(patientResult.data);
        }

        if (treatmentResponse.ok) {
          const urgentCareList = treatmentResult.data?.urgentCareList || [];
          setTreatmentRecords(urgentCareList);
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '데이터 조회 중 오류가 발생했습니다';
        console.error('Error:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!patientData) return <div>환자 정보를 찾을 수 없습니다</div>;

  return (
    <div className="patient-detail-container">
      <div className="patient-alert-sections">
        <PatientAlertSection />
      </div>
      <div className='patient-detail-card'>
        <PatientDetailCard {...patientData} />
      </div>
      <div className='patient-treatmentrecord-sections'>
        <div className="treatment-records-header">
          <h2>긴급 조치 기록</h2>
        </div>
        <div className="treatment-records-list">
  {treatmentRecords.length > 0 ? (
    treatmentRecords.map((record) => (
      <TreatmentRecord
   // React의 내부 속성으로 key 사용
        id={record.id}     // 컴포넌트의 prop으로 id 전달
        content={record.content}
        createdAt={record.createdAt}
      />
    ))
  ) : (
    <div className="no-records-message">긴급 조치 기록이 없습니다.</div>
  )}
</div>
      </div>
    </div>
  );
};

export default PatientDetail;
