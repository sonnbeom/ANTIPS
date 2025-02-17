import React, { useState, useEffect } from "react";
import user from '../../assets/free-icon-user-747376.png'
import "./AlertModalStyle.css";

interface Patient {
  alertId : number ;
  patientId: number;
  name: string;
  age: number;
  floor: number;
  roomNumber: number;
  urgencyLevel: number;
}

interface UrgentCare {
  urgentCareId: number;
  content: string;
  createdAt: string;
}

interface AlertData {
  patient: Patient;
  urgentCareList: UrgentCare[];
}

interface AlertModalProps {
  alertId: number;  // emergencyId로 사용될 값
  patientId: number;
  isOpen: boolean;
  onClose: () => void;
}
const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const AlertModal: React.FC<AlertModalProps> = ({ alertId, patientId, isOpen, onClose }) => {
  const [detailedAction, setDetailedAction] = useState("");
  const [alertData, setAlertData] = useState<AlertData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentTime = new Date().toLocaleString();
  const API_URL = import.meta.env.VITE_SERVER_URL;
  useEffect(() => {
    const fetchCaseHistory = async () => {
      if (!isOpen) return;
    
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
    
        const apiUrl = `${API_URL}/non-public/urgent-care/emergency?patientId=${patientId}`;
    
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
    
        // 응답이 JSON이 아닐 경우 방지
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Invalid content-type: Expected JSON but received ${contentType}`);
        }
    
        const result = await response.json();

    
        setAlertData(result.data); // API 응답 구조에 맞게 저장
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    
  
    fetchCaseHistory();
  }, [patientId, isOpen]);
  

  if (!isOpen || !alertData) return null;
  if (isLoading) return <div>Loading...</div>;

  const handleSave = async () => {
    if (!detailedAction.trim()) {
      window.alert("조치 사항을 입력해주세요.");
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
      const response = await fetch(`${API_URL}/non-public/urgent-care`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId: patientId,
          content: detailedAction,
          emergencyId: alertId  // alertId 추가
        })
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save case history: ${response.status}`);
      }
  
      setDetailedAction("");
      onClose();
    } catch (error) {
      window.alert('조치 사항 저장에 실패했습니다.');
    }
  };
  

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className="alert-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="alert-modal-header">
          <h2>긴급 조치 입력</h2>
          <span className="alert-modal-time">현재 시각: {currentTime}</span>
        </div>
        <div className="alert-modal-body">
          <div className="alert-modal-left">
            <div className="patient-info-group">
              <img
                src={user}
                alt="환자"
                className="patient-photo"
              />
              <h3>{alertData.patient.name} (나이: {alertData.patient.age})</h3>
              <p>병실: {alertData.patient.roomNumber}호 / 층: {alertData.patient.floor}층</p>
              <p>긴급도: {alertData.patient.urgencyLevel}</p>
            </div>
            <div className="previous-actions">
  <h4>이전 조치 사항</h4>
  <div className="previous-actions-list">
  {alertData.urgentCareList
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 2)
  .map((care) => (
    <div key={care.urgentCareId} className="urgent-care-box">
      <p className="urgent-care-date">{formatDateTime(care.createdAt)}</p>
      <p className="urgent-care-content">{care.content}</p>
    </div>
  ))}

  </div>
</div>
          </div>
          <div className="alert-modal-right">
            <div className="action-input-group">
              <label>조치 사항</label>
              <textarea
                value={detailedAction}
                onChange={(e) => setDetailedAction(e.target.value)}
                placeholder="상세한 조치 사항을 입력하세요"
              />
            </div>
            <div className="alert-modal-footer">
          <button className="alert-modal-cancel" onClick={onClose}>
            취소
          </button>
          <button className="alert-modal-save" onClick={handleSave}>
            저장
          </button>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;