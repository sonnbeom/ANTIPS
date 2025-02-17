import React, { useState } from "react";
import "./PatientRegistrationStyle.css";
import profile from '../assets/profile.png';
import hospital from '../assets/hospital2.svg'
import chart from '../assets/cahrt.svg'
import tem from '../assets/tem.svg'
import { useNavigate } from 'react-router-dom';

const PatientRegistration: React.FC = () => {
  interface FormData {
    name: string;
    age: string;
    qrCode: string;
    temperature: string; // temperature
    floor: string;
    roomNumber: string;
    urgencyLevel: string;
    caseHistory: string;
    specifics: string;
    bedNumber: string;
  }
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    qrCode: "",
    temperature: "36.5", // 기본 체온
    floor: "",
    roomNumber: "",
    urgencyLevel: "1", // 기본 긴급도
    caseHistory: "",
    specifics: "",
    bedNumber: "",
  });
  // 이미지 프리뷰를 위한 state의 초기값을 profile로 설정
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_SERVER_URL;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleCancel = () => {
    navigate('/patientlist');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 로컬 스토리지에서 토큰 가져오기
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      // API 요청 데이터 형식에 맞게 변환
      const requestData = {
        name: formData.name,
        age: formData.age, // 날짜 형식 주의
        specifics: formData.specifics,
        urgencyLevel: parseInt(formData.urgencyLevel) || 1, // 숫자로 변환
        caseHistory: formData.caseHistory,
        qrCode: formData.qrCode,
        temperature: parseFloat(formData.temperature) || 36.5, // 체온을 숫자로 변환
        floor: parseInt(formData.floor) || 1,
        roomNumber: parseInt(formData.roomNumber) || 101,
        bedNumber:formData.bedNumber,
      };
      const response = await fetch(`${API_URL}/non-public/patient`, {
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
      // 성공 시 환자 목록 페이지로 이동
      navigate('/patientlist');
    } catch (error) {
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

  {/* 오른쪽: 이름/생년월일, 바코드/체온 */}
  <div className="patient-registration-form-right">
    {/* 이름, 생년월일 */}
    <div className="patient-registration-form-row">
      <div className="patient-registration-form-group">
        <label htmlFor="name">이름</label>
        <input id="patient-registration-name" type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="patient-registration-form-group">
        <label htmlFor="age">나이</label>
        <input id="patient-registration-age" type="text" name="age" value={formData.age} onChange={handleChange} required />
      </div>
    </div>

    {/* 바코드, 체온 */}
    <div className="patient-registration-form-row">
    <div className="patient-registration-form-group">
        <label htmlFor="qrCode">QR code</label>
        <input id="patient-registration-qrCode" type="text" name="qrCode" value={formData.qrCode} onChange={handleChange} required />
      </div>
      <div className="patient-registration-form-group">
        <label htmlFor="temperature"><img src={tem} alt="tem" />  체온</label>
        <input id="patient-registration-temperature" type="text" name="temperature" value={formData.temperature} onChange={handleChange} />
      </div>
      <div className="patient-registration-form-group">
              <label htmlFor="urgencyLevel">긴급도</label>
              <select 
                id="patient-registration-urgencyLevel" 
                name="urgencyLevel" 
                value={formData.urgencyLevel} 
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
              <label htmlFor="bedNumber">침대번호</label>
              <input id="patient-registration-bedNumber" type="text" name="bedNumber" value={formData.bedNumber} onChange={handleChange} />
            </div>
          </div>
        </div>
        <hr className="pr-hr"/>
        {/* 과거 병력 */}
        <div className="patient-registration-section">
          <h2 className="patient-registration-section-caseHistory">과거 병력</h2>
          <textarea
            name="caseHistory"
            placeholder="과거 병력을 입력해주세요"
            value={formData.caseHistory}
            onChange={handleChange}
          ></textarea>
        </div>
        {/* 특이사항 */}
        <div className="patient-registration-section">
          <h2 className="patient-registration-section-specifics">특이사항</h2>
          <textarea
            name="specifics"
            placeholder="환자의 특이사항을 입력해주세요"
            value={formData.specifics}
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
