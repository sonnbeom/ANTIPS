import React, { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import AlertModal from "./AlertModal";
import "./PatientAlertStyle.css";

interface Alert {
  id: number;
  room: string;
  name: string;
  message: string;
  category: "urgent" | "warning" | "info";
  timeAgo: string;
}

const alertsData: Alert[] = [
  { id: 9, room: "101호", name: "김서연", message: "알레르기 반응", category: "urgent", timeAgo: "10분 전" },
  { id: 2, room: "103호", name: "이민준", message: "투약 일정 변경", category: "warning", timeAgo: "30분 전" },
  { id: 3, room: "105호", name: "박지우", message: "추적 관찰 필요", category: "info", timeAgo: "1시간 전" },
];

const PatientAlertSection: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAlertClick = (alert: Alert) => {
    setSelectedPatientId(alert.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatientId(null);
  };

  return (
    <div className="patient-alert-section">
      <div className="patient-alert-header">
        <div className="patient-icon-text-container">
          <FaExclamationTriangle size={24} color="red" />
          <span>응급 및 특별 알림</span>
        </div>
        <span className="patient-active-alert-count">활성 알림 {alertsData.length}개</span>
      </div>
      <ul className="patient-alert-list">
        {alertsData.map((alert) => (
          <li
            key={alert.id}
            className={`patient-alert-item ${alert.category}`}
            onClick={() => handleAlertClick(alert)}
          >
            <span>
              {alert.room}: {alert.name} - {alert.message}
            </span>
            <span className="patient-time">{alert.timeAgo}</span>
          </li>
        ))}
      </ul>

      {selectedPatientId !== null && (
        <AlertModal 
          patientId={selectedPatientId} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default PatientAlertSection;



// import React, { useState, useEffect } from "react";
// import { FaExclamationTriangle } from "react-icons/fa";
// import AlertModal from "./AlertModal.tsx";
// import "./PatientAlertStyle.css";

// interface Alert {
//   id: number;
//   room: string;
//   name: string;
//   message: string;
//   category: "urgent" | "warning" | "info";
//   timeAgo: string;
// }

// interface AlertData {
//   patient: {
//     patientId: number;
//     name: string;
//     age: number;
//     floor: number;
//     roomNumber: number;
//     urgencyLevel: number;
//   };
//   urgentCareList: {
//     urgentCareId: number;
//     urgentCareContent: string;
//     createdAt: string;
//   }[];
// }

// interface SensorData {
//   sensorId: string;
//   roomNumber: number;
//   floor: number;
//   type: string;
//   value: number;
//   timestamp: string;
// }

// const PatientAlertSection: React.FC = () => {
//   const [alerts, setAlerts] = useState<Alert[]>([]);
//   const [selectedAlertData, setSelectedAlertData] = useState<AlertData | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     // 토큰 가져오기
//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.error('No token found');
//       return;
//     }

//     // SSE 연결 설정
//     const eventSource = new EventSource('/api/v1/secure/pnotice', {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     // 이벤트 리스너 설정
//     eventSource.onmessage = (event) => {
//       try {
//         const sensorData: SensorData = JSON.parse(event.data);
        
//         // 센서 데이터를 알림 형식으로 변환
//         const newAlert: Alert = {
//           id: Date.now(), // 임시 ID
//           room: `${sensorData.floor}층 ${sensorData.roomNumber}호`,
//           name: "환자", // API에서 환자 정보를 포함하지 않으므로 기본값 사용
//           message: `${sensorData.type}: ${sensorData.value}`,
//           category: determineAlertCategory(sensorData),
//           timeAgo: formatTimestamp(sensorData.timestamp)
//         };

//         // 알림 목록 업데이트
//         setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
//       } catch (error) {
//         console.error('Error parsing SSE data:', error);
//       }
//     };

//     // 에러 처리
//     eventSource.onerror = (error) => {
//       console.error('SSE Error:', error);
//       eventSource.close();
//     };

//     // 컴포넌트 언마운트 시 연결 종료
//     return () => {
//       eventSource.close();
//     };
//   }, []);

//   // 알림 카테고리 결정 함수
//   const determineAlertCategory = (sensorData: SensorData): "urgent" | "warning" | "info" => {
//     if (sensorData.type === "temperature") {
//       if (sensorData.value >= 38) return "urgent";
//       if (sensorData.value >= 37.5) return "warning";
//     }
//     return "info";
//   };

//   // 타임스탬프 포맷팅 함수
//   const formatTimestamp = (timestamp: string): string => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

//     if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
//     if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
//     return `${Math.floor(diffInMinutes / 1440)}일 전`;
//   };

//   const handleAlertClick = (alert: Alert) => {
//     // 알림 클릭 처리 로직
//     const alertData = patientDataList.find((data) => data.patient.patientId === alert.id);
//     if (alertData) {
//       setSelectedAlertData(alertData);
//       setIsModalOpen(true);
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedAlertData(null);
//   };

//   return (
//     <div className="patient-alert-section">
//       <div className="patient-alert-header">
//         <div className="patient-icon-text-container">
//           <FaExclamationTriangle size={24} color="red" />
//           <span>응급 및 특별 알림</span>
//         </div>
//         <span className="patient-active-alert-count">활성 알림 {alerts.length}개</span>
//       </div>
//       <ul className="patient-alert-list">
//         {alerts.map((alert) => (
//           <li
//             key={alert.id}
//             className={`patient-alert-item ${alert.category}`}
//             onClick={() => handleAlertClick(alert)}
//           >
//             <span>
//               {alert.room}: {alert.name} - {alert.message}
//             </span>
//             <span className="patient-time">{alert.timeAgo}</span>
//           </li>
//         ))}
//       </ul>

//       <AlertModal 
//         alertData={selectedAlertData} 
//         isOpen={isModalOpen} 
//         onClose={handleCloseModal} 
//       />
//     </div>
//   );
// };

// export default PatientAlertSection;
