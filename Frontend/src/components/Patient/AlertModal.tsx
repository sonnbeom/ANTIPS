import React, { useState } from "react";
import "./AlertModalStyle.css";

interface Patient {
  patientId: number;
  name: string;
  age: number;
  floor: number;
  roomNumber: number;
  urgencyLevel: number;
}

interface UrgentCare {
  urgentCareId: number;
  urgentCareContent: string;
  createdAt: string;
}

interface AlertData {
  patient: Patient;
  urgentCareList: UrgentCare[];
}

interface AlertModalProps {
  alertData: AlertData | null;
  isOpen: boolean;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ alertData, isOpen, onClose }) => {
  const [detailedAction, setDetailedAction] = useState("");
  const currentTime = new Date().toLocaleString();

  if (!alertData || !isOpen) return null;

  const handleSave = () => {
    if (!detailedAction.trim()) {
      window.alert("조치 사항을 입력해주세요.");
      return;
    }

    console.log({
      patientId: alertData.patient.patientId,
      detailedAction,
      timestamp: currentTime,
    });

    setDetailedAction("");
    onClose();
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
                src="https://randomuser.me/api/portraits/men/75.jpg"
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
                {alertData.urgentCareList.map((care) => (
                  <div key={care.urgentCareId} className="urgent-care-box">
                    <p className="urgent-care-date">{care.createdAt}</p>
                    <p className="urgent-care-content">{care.urgentCareContent}</p>
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
          </div>
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
  );
};

export default AlertModal;


// import React, { useState, useEffect } from "react";
// import "./AlertModalStyle.css";

// interface Patient {
//   patientId: number;
//   name: string;
//   age: number;
//   floor: number;
//   roomNumber: number;
//   urgencyLevel: number;
// }

// interface UrgentCare {
//   urgentCareId: number;
//   urgentCareContent: string;
//   createdAt: string;
// }

// interface AlertData {
//   patient: Patient;
//   urgentCareList: UrgentCare[];
// }

// interface AlertModalProps {
//   patientId: number;
//   isOpen: boolean;
//   onClose: () => void;
// }

// const AlertModal: React.FC<AlertModalProps> = ({ patientId, isOpen, onClose }) => {
//   const [detailedAction, setDetailedAction] = useState("");
//   const [alertData, setAlertData] = useState<AlertData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const currentTime = new Date().toLocaleString();

//   useEffect(() => {
//     const fetchCaseHistory = async () => {
//       if (!isOpen) return;
      
//       try {
//         const token = localStorage.getItem('token');
//         const response = await fetch(`/api/v1/secure/patient/case-history/${patientId}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch case history');
//         }

//         const result = await response.json();
//         setAlertData(result.data);
//       } catch (error) {
//         console.error('Error fetching case history:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCaseHistory();
//   }, [patientId, isOpen]);

//   if (!isOpen || !alertData) return null;
//   if (isLoading) return <div>Loading...</div>;

//   const handleSave = async () => {
//     if (!detailedAction.trim()) {
//       window.alert("조치 사항을 입력해주세요.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/v1/secure/case-history', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           patientId: patientId,
//           caseHistoryContent: detailedAction
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to save case history');
//       }

//       setDetailedAction("");
//       onClose();
//     } catch (error) {
//       console.error('Error saving case history:', error);
//       window.alert('조치 사항 저장에 실패했습니다.');
//     }
//   };

//   return (
//     <div className="alert-modal-overlay" onClick={onClose}>
//       <div className="alert-modal-content" onClick={(e) => e.stopPropagation()}>
//         <div className="alert-modal-header">
//           <h2>긴급 조치 입력</h2>
//           <span className="alert-modal-time">현재 시각: {currentTime}</span>
//         </div>
//         <div className="alert-modal-body">
//           <div className="alert-modal-left">
//             <div className="patient-info-group">
//               <img
//                 src="https://randomuser.me/api/portraits/men/75.jpg"
//                 alt="환자"
//                 className="patient-photo"
//               />
//               <h3>{alertData.patient.name} (나이: {alertData.patient.age})</h3>
//               <p>병실: {alertData.patient.roomNumber}호 / 층: {alertData.patient.floor}층</p>
//               <p>긴급도: {alertData.patient.urgencyLevel}</p>
//             </div>
//             <div className="previous-actions">
//               <h4>이전 조치 사항</h4>
//               <div className="previous-actions-list">
//                 {alertData.urgentCareList.map((care) => (
//                   <div key={care.urgentCareId} className="urgent-care-box">
//                     <p className="urgent-care-date">{care.createdAt}</p>
//                     <p className="urgent-care-content">{care.urgentCareContent}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//           <div className="alert-modal-right">
//             <div className="action-input-group">
//               <label>조치 사항</label>
//               <textarea
//                 value={detailedAction}
//                 onChange={(e) => setDetailedAction(e.target.value)}
//                 placeholder="상세한 조치 사항을 입력하세요"
//               />
//             </div>
//           </div>
//         </div>
//         <div className="alert-modal-footer">
//           <button className="alert-modal-cancel" onClick={onClose}>
//             취소
//           </button>
//           <button className="alert-modal-save" onClick={handleSave}>
//             저장
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AlertModal;