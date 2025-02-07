import React, { useState } from "react";
import "./PatientRegistrationStyle.css";
import profile from '../assets/profile.png';
import camera from '../assets/camera.svg'
import hospital from '../assets/hospital2.svg'
import chart from '../assets/cahrt.svg'
import tem from '../assets/tem.svg'
import { useNavigate } from 'react-router-dom';

const PatientRegistration: React.FC = () => {
  interface FormData {
    name: string;
    admissionDate: string;
    qr: string;
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
    temperature: "36.5", // 기본 체온
    floor: "",
    room: "",
    urgency: "1", // 기본 긴급도
    medicalHistory: "",
    specialNotes: "",
  });
  // 이미지 프리뷰를 위한 state의 초기값을 profile로 설정
  const [imagePreview, setImagePreview] = useState<string>(profile);
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleCancel = () => {
    navigate('/patientlist');
  };
  // 이미지 업로드 핸들러 수정
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    } else {
      // 파일 선택이 취소되었을 때 기본 프로필 이미지로 되돌림
      setImagePreview(profile);
    }
  };
  // 이미지 에러 처리 추가
  const handleImageError = () => {
    setImagePreview(profile);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 로컬 스토리지에서 토큰 가져오기
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      // API 요청 데이터 형식에 맞게 변환
      const requestData = {
        name: formData.name,
        admissionDate: `${formData.admissionDate}T00:00:00`, // 날짜 형식 주의
        specifics: formData.specialNotes,
        urgencyLevel: parseInt(formData.urgency) || 1, // 숫자로 변환
        caseHistory: formData.medicalHistory,
        qr: formData.qr,
        temperature: parseFloat(formData.temperature) || 36.5, // 체온을 숫자로 변환
        status: "TODO",
        floor: parseInt(formData.floor) || 1,
        roomNumber: parseInt(formData.room) || 101,
      };
      const response = await fetch('http://43.203.254.199:8080/api/v1/service/non-public/patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to register patient');
      }
      const data = await response.json();
      console.log('Patient registered successfully:', data);
      // 성공 시 환자 목록 페이지로 이동
      navigate('/patientlist');
    } catch (error) {
      console.error('Error registering patient:', error);
      // 에러 처리 (예: 에러 메시지 표시)
    }
  };
  
  return (
    <div className="patient-registration-container">
      <h1 className="patient-registration-page-title"><img src={hospital} alt="" /> 새로운 환자 등록</h1>
      <form className="patient-registration-form" onSubmit={handleSubmit}>
        <div className="patient-registration-section">
          <h2 className="patient-registration-section-title"><img src={chart} alt="" /> 환자 기본 정보</h2>
          <div className="patient-registration-form-row">
          <div className="photo-upload-group">
      <label htmlFor="patient-registration-photo-upload" className="patient-registration-photo-label">
        <img 
          src={imagePreview} 
          alt="Upload" 
          className="patient-registration-photo-placeholder"
          onError={handleImageError} // 이미지 로드 실패시 기본 이미지로 대체
        />
        <div className="patient-registration-photo-span"><img src={camera} alt="camera" /> 사진 업로드</div>
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
        <label htmlFor="name">QR코드</label>
        <input id="patient-registration-qr" type="text" name="qr" value={formData.qr} onChange={handleChange} required />
      </div>
      <div className="patient-registration-form-group">
        <label htmlFor="temperature"><img src={tem} alt="tem" />  체온</label>
        <input id="patient-registration-diagnosis" type="text" name="temperature" value={formData.temperature} onChange={handleChange} />
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
              <select 
                id="patient-registration-urgency" 
                name="urgency" 
                value={formData.urgency} 
                onChange={handleChange}
              >
                <option value="1">낮음</option>
                <option value="2">보통</option>
                <option value="3">높음</option>
                <option value="4">매우 높음</option>
              </select>
            </div>
          </div>
        </div>
        <hr className="pr-hr"/>
        {/* 과거 병력 */}
        <div className="patient-registration-section">
          <h2 className="patient-registration-section-title">과거 병력</h2>
          <textarea
            name="medicalHistory"
            placeholder="과거 병력을 입력해주세요"
            value={formData.medicalHistory}
            onChange={handleChange}
          ></textarea>
        </div>
        {/* 특이사항 */}
        <div className="patient-registration-section">
          <h2 className="patient-registration-section-title">특이사항</h2>
          <textarea
            name="specialNotes"
            placeholder="환자의 특이사항을 입력해주세요"
            value={formData.specialNotes}
            onChange={handleChange}
          ></textarea>
        </div>
        {/* 버튼 섹션 */}
        <div className="patient-registration-button-section">
        <button 
        type="button" 
        className="patient-registration-cancel-button"
        onClick={handleCancel}
      >
        취소
      </button>
          <button type="submit" className="patient-registration-save-button">
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistration;
