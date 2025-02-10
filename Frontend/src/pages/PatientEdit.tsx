import React, { useState, useEffect } from "react";
import "./PatientRegistrationStyle.css";
import hospital from '../assets/hospital2.svg';
import chart from '../assets/cahrt.svg';
import tem from '../assets/tem.svg';
import { useNavigate, useParams } from 'react-router-dom';


const PatientEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [originalData, setOriginalData] = useState<any>(null);
  const API_URL = import.meta.env.VITE_SERVER_URL;


  interface FormData {
    name: string;
    age:string;
    status: string;
    temperature: string; // temperature
    floor: string;
    roomNumber: string;
    urgencyLevel: string;
    caseHistory: string;
    specifics: string;
    createdAt:string;
  }

  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: '',
    status: '',
    temperature: "36.5", // 기본 체온
    floor: "",
    roomNumber: "",
    urgencyLevel: "1", // 기본 긴급도
    caseHistory: "",
    specifics: "",
    createdAt:'',
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`${API_URL}/non-public/patient?patientId=${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }

        const data = await response.json();
        
        // 원본 데이터 저장
        setOriginalData(data.data);

        setFormData({
          name: data.data.name || "",
          age: data.data.age || '',
          status: data.data.status || '',
          temperature: data.data.temperature?.toString() || "36.5",
          floor: data.data.floor?.toString() || "",
          roomNumber: data.data.roomNumber?.toString() || "",
          urgencyLevel: data.data.urgencyLevel?.toString() || "1",
          caseHistory: data.data.caseHistory || "",
          specifics: data.data.specifics || "",
          createdAt: data.data.createdAt || '',
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchPatientData();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormDataChanged = (originalData: any, newData: any) => {
    return !Object.keys(newData).every(key => 
      originalData[key] === newData[key]
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requestData = {
      id: parseInt(id ?? "0"),
      specifics: formData.specifics,
      urgencyLevel: parseInt(formData.urgencyLevel) || 1,
      caseHistory: formData.caseHistory,
      temperature: parseFloat(formData.temperature) || 36.5,
      floor: parseInt(formData.floor) || 1,
      roomNumber: parseInt(formData.roomNumber) || 101
    };
  
    // 원본 데이터와 비교
    const hasChanges = Object.keys(requestData).some(key => 
      originalData[key]?.toString() !== requestData[key]?.toString()
    );

    if (!hasChanges) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/non-public/patient`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to update patient');
      }
  
      navigate('/patientlist');
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };
  
  
  const handleCancel = () => {
    navigate('/patientlist');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="patient-registration-container">
      <h1 className="patient-registration-page-title">
        <img src={hospital} alt="" /> 환자 정보 수정
      </h1>
      <form className="patient-registration-form" onSubmit={handleSubmit}>
        <div className="patient-registration-section">
          <h2 className="patient-registration-section-title">
            <img src={chart} alt="" /> 환자 기본 정보
          </h2>
          <div className="patient-registration-form-row">
            {/* 오른쪽: 이름/생년월일, 바코드/체온 */}
            <div className="patient-registration-form-right">
              {/* 이름, 생년월일 */}
              <div className="patient-registration-form-row">
              <div className="patient-registration-form-group">
  <label htmlFor="name-display">이름</label>
  <input 
    id="name-display" 
    type="text" 
    name="name" 
    value={formData.name} 
    onChange={handleChange} 
    disabled 
  />
</div>
<div className="patient-registration-form-group">
  <label htmlFor="age-display">나이</label>
  <input 
    id="age-display" 
    type="text" 
    name="age" 
    value={formData.age} 
    disabled 
  />
</div>
</div>

              {/* 바코드, 체온 */}
              <div className="patient-registration-form-row">
                <div className="patient-registration-form-group">
                  <label htmlFor="temperature"><img src={tem} alt="tem" /> 체온</label>
                  <input id="patient-registration-temperature" type="text" name="temperature" value={formData.temperature} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          <hr className="pr-hr"/>
        
          <div className="patient-registration-form-row">
            <div className="patient-registration-form-group">
              <label htmlFor="floor">층</label>
              <input id="patient-registration-floor" type="text" name="floor" value={formData.floor} onChange={handleChange} />
            </div>
            <div className="patient-registration-form-group">
              <label htmlFor="roomNumber">호실</label>
              <input id="patient-registration-roomNumber" type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} />
            </div>
            <div className="patient-registration-form-group">
              <label htmlFor="urgencyLevel">긴급도</label>
              <select id="patient-registration-urgencyLevel" name="urgencyLevel" value={formData.urgencyLevel} onChange={handleChange}>
                <option value="1">낮음</option>
                <option value="2">보통</option>
                <option value="3">높음</option>
                <option value="4">매우 높음</option>
              </select>
            </div>
          </div>
        </div>

        <hr className="pr-hr"/>

        <div className="patient-registration-section">
          <h2 className="patient-registration-section-caseHistory">과거 병력</h2>
          <textarea
            name="caseHistory"
            placeholder="과거 병력을 입력해주세요"
            value={formData.caseHistory}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="patient-registration-section">
          <h2 className="patient-registration-section-specifics">특이사항</h2>
          <textarea
            name="specifics"
            placeholder="환자의 특이사항을 입력해주세요"
            value={formData.specifics}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="patient-registration-button-section">
          <button type="button" className="patient-registration-cancel-button" onClick={handleCancel}>
            취소
          </button>
          <button type="submit" className="patient-registration-save-button">
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientEdit;
