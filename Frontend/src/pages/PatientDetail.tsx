import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PatientDetailStyle.css';
import PatientAlertSection from '../components/Patient/PatientAlert'
import PatientDetailCard from '../components/Patient/PatientDetailCard';
import TreatmentRecord from '../components/Patient/TreatmentRecord'

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
}

interface TreatmentData {
  type: 'urgent' | 'normal';
  title: string;
  description: string;
  doctor: string;
  timestamp: string;
}

interface ApiResponse {
  status: number;
  message: string;
  data: PatientData;
}

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [treatmentRecords, setTreatmentRecords] = useState<TreatmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('토큰이 없습니다');
        }

        // 환자 정보와 긴급 조치 기록을 병렬로 가져오기
        const [patientResponse, treatmentResponse] = await Promise.all([
          fetch(`http://43.203.254.199:8080/api/v1/service/non-public/patient?patientId=${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`http://43.203.254.199:8080/api/v1/service/non-public/urgenct-care/emergency?patientId=${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
        ]);

        const patientResult: ApiResponse = await patientResponse.json();
        const treatmentResult = await treatmentResponse.json();

        console.log('환자 데이터:', patientResult);
        console.log('긴급 조치 기록:', treatmentResult);

        if (patientResponse.ok && patientResult.status === 200) {
          setPatientData(patientResult.data);
        }

        if (treatmentResponse.ok) {
          setTreatmentRecords(treatmentResult.data || []);
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
          {treatmentRecords.map((record, index) => (
            <TreatmentRecord
              key={index}
              {...record}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
