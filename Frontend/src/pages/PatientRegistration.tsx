import React, { useState } from "react";
import "./PatientRegistrationStyle.css";
import profile from '../assets/profile.png';
import camera from '../assets/camera.svg'
import hospital from '../assets/hospital2.svg'
import chart from '../assets/cahrt.svg'
import bar from '../assets/bar.svg'
import tem from '../assets/tem.svg'

const PatientRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    barcode: "",
    diagnosis: "",
    floor: "",
    room: "",
    urgency: "",
    medicalHistory: "",
    specialNotes: "",
  });
  
  // 이미지 프리뷰를 위한 state의 초기값을 profile로 설정
  const [imagePreview, setImagePreview] = useState<string>(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };
  // 이미지 에러 처리 추가
  const handleImageError = () => {
    setImagePreview(profile);
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
        <label htmlFor="birthdate">생년월일</label>
        <input id="patient-registration-birthdate" type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
      </div>
    </div>

    {/* 바코드, 체온 */}
    <div className="patient-registration-form-row">
      <div className="patient-registration-form-group">
        <label htmlFor="barcode"><img src={bar} alt="bar" />  바코드 번호</label>
        <input id="patient-registration-barcode" type="text" name="barcode" value={formData.barcode} onChange={handleChange} />
      </div>
      <div className="patient-registration-form-group">
        <label htmlFor="diagnosis"><img src={tem} alt="tem" />  체온</label>
        <input id="patient-registration-diagnosis" type="text" name="diagnosis" value={formData.diagnosis} onChange={handleChange} />
      </div>
    </div>
  </div>
</div>


          <hr/>
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
                <option value="">선택하세요</option>
                <option value="low">낮음</option>
                <option value="medium">보통</option>
                <option value="high">높음</option>
              </select>
            </div>
          </div>
        </div>
        <hr/>
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
          <button type="button" className="patient-registration-cancel-button">
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
