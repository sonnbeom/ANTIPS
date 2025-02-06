import React, { useState, useEffect } from "react";
import "./PatientRegistrationStyle.css";
import profile from '../assets/profile.png';
import camera from '../assets/camera.svg';
import hospital from '../assets/hospital2.svg';
import chart from '../assets/cahrt.svg';
import tem from '../assets/tem.svg';
import { useNavigate, useParams } from 'react-router-dom';

const PatientEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  interface FormData {
    name: string;
    admissionDate: string;
    qr: string;
    status: string;
    temperature: string; // temperature
    floor: string;
    room: string;
    urgency: string;
    medicalHistory: string;
    specialNotes: string;
  }

  const [formData, setFormData] = useState<FormData>({
    name: "",
    admissionDate: "",
    qr: "",
    status: '',
    temperature: "36.5", // 기본 체온
    floor: "",
    room: "",
    urgency: "1", // 기본 긴급도
    medicalHistory: "",
    specialNotes: "",
  });

  const [imagePreview, setImagePreview] = useState<string>(profile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`http://43.203.254.199:8080/api/v1/service/non-public/patient?patientId=${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }

        const data = await response.json();
        console.log(data.data)
        // admissionDate가 존재할 때만 split 처리
        const formattedAdmissionDate = data.admissionDate ? data.admissionDate.split("T")[0] : "";

        setFormData({
          name: data.data.name || "",
          admissionDate: formattedAdmissionDate,
          qr: data.data.qr || "",
          status: data.data.status || '',
          temperature: data.data.temperature?.toString() || "36.5",
          floor: data.data.floor?.toString() || "",
          room: data.data.roomNumber?.toString() || "",
          urgency: data.data.urgencyLevel?.toString() || "1",
          medicalHistory: data.data.caseHistory || "",
          specialNotes: data.data.specifics || "",
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleImageError = () => {
    setImagePreview(profile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
      const requestData = {
        id: parseInt(id ?? "0"), // id 값을 request에 포함
        name: formData.name,
        admissionDate: `${formData.admissionDate}T00:00:00`, // 날짜 형식 주의
        specifics: formData.specialNotes,
        urgencyLevel: parseInt(formData.urgency) || 1, // 숫자로 변환
        caseHistory: formData.medicalHistory,
        qr: formData.qr,
        temperature: parseFloat(formData.temperature) || 36.5, // 체온을 숫자로 변환
        status: "to_do",
        floor: parseInt(formData.floor) || 1,
        roomNumber: parseInt(formData.room) || 101,
      };
  
      const response = await fetch(`http://43.203.254.199:8080/api/v1/service/non-public/patient`, {
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
            <div className="photo-upload-group">
              <label htmlFor="patient-registration-photo-upload" className="patient-registration-photo-label">
                <img 
                  src={imagePreview} 
                  alt="Upload" 
                  className="patient-registration-photo-placeholder"
                  onError={handleImageError}
                />
                <div className="patient-registration-photo-span">
                  <img src={camera} alt="camera" /> 사진 업로드
                </div>
              </label>
              <input 
                id="patient-registration-photo-upload" 
                type="file" 
                name="photo" 
                accept="image/*"
                onChange={handleImageChange}
                hidden 
              />
            </div>

            {/* 오른쪽: 이름/생년월일, 바코드/체온 */}
            <div className="patient-registration-form-right">
              {/* 이름, 생년월일 */}
              <div className="patient-registration-form-row">
                <div className="patient-registration-form-group">
                  <label htmlFor="name">이름</label>
                  <input id="patient-registration-name" type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="patient-registration-form-group">
                  <label htmlFor="admissionDate">생년월일</label>
                  <input id="patient-registration-admissionDate" type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} required />
                </div>
              </div>

              {/* 바코드, 체온 */}
              <div className="patient-registration-form-row">
                <div className="patient-registration-form-group">
                  <label htmlFor="qr">QR코드</label>
                  <input id="patient-registration-qr" type="text" name="qr" value={formData.qr} onChange={handleChange} required />
                </div>
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
              <label htmlFor="room">호실</label>
              <input id="patient-registration-room" type="text" name="room" value={formData.room} onChange={handleChange} />
            </div>
            <div className="patient-registration-form-group">
              <label htmlFor="urgency">긴급도</label>
              <select id="patient-registration-urgency" name="urgency" value={formData.urgency} onChange={handleChange}>
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
          <h2 className="patient-registration-section-title">과거 병력</h2>
          <textarea
            name="medicalHistory"
            placeholder="과거 병력을 입력해주세요"
            value={formData.medicalHistory}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="patient-registration-section">
          <h2 className="patient-registration-section-title">특이사항</h2>
          <textarea
            name="specialNotes"
            placeholder="환자의 특이사항을 입력해주세요"
            value={formData.specialNotes}
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
