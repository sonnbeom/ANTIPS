import React, { useState, useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import AlertModal from "./AlertModal";
import "./PatientAlertStyle.css";

interface PatientDto {
  id: number;
  name: string;
  age: number;
  roomNumber: number;
  specifics: string;
}

interface EmergencyDto {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  patientDto: PatientDto;
}

interface AlertResponse {
  listSize: number;
  emergencyDtoList: EmergencyDto[];
}

const PatientAlertSection: React.FC = () => {
  const [alerts, setAlerts] = useState<EmergencyDto[]>([]);
  const [prevAlerts, setPrevAlerts] = useState<EmergencyDto[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [alertId, setAlertId] = useState<number | null>(null);
  const API_URL = import.meta.env.VITE_SERVER_URL;
  
  const audioRef = React.useRef(new Audio('/notification-sound.mp3'));

  const fetchInitialAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/non-public/emergency`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }

      const data = await response.json();
      if (data.data?.emergencyDtoList) {
        setAlerts(data.data.emergencyDtoList);
        setPrevAlerts(data.data.emergencyDtoList); // 초기 로딩 시 prevAlerts도 업데이트
      }
    } catch (error) {
      console.error('초기 알림 데이터 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchInitialAlerts();
  }, []);

  const playNotificationSound = () => {
    audioRef.current.play().catch(error => {
      console.error('알림음 재생 실패:', error);
    });
  };

  useEffect(() => {
    let eventSource: EventSource | null = null;
  
    console.log("🟢 SSE 연결 시도...");
    eventSource = new EventSource(`${API_URL}/public/stream`);
  
    eventSource.onopen = () => {
      console.log("✅ SSE 연결됨");
      setIsConnected(true);
    };
  
    eventSource.onmessage = (event) => {
      try {
        const data: AlertResponse = JSON.parse(event.data);
        if (data.emergencyDtoList) {
          setAlerts(data.emergencyDtoList);
          console.log("새로운 알림 수신:", data);
        }
      } catch (error) {
        console.error("❌ SSE 데이터 파싱 오류:", error);
      }
    };
  
    eventSource.onerror = () => {
      console.error("⚠ SSE 연결 오류 발생");
      setIsConnected(false);
      eventSource?.close();
    };
  
    return () => {
      eventSource?.close();
      console.log("📴 SSE 연결 종료");
    };
  }, []); // 빈 배열을 넣어 최초 1회만 실행
  

  // 새로운 알림이 올 때만 소리 재생
  useEffect(() => {
    if (alerts.length > prevAlerts.length) {
      const newAlertIds = alerts.map(alert => alert.id);
      const prevAlertIds = prevAlerts.map(alert => alert.id);

      const hasNewAlert = newAlertIds.some(id => !prevAlertIds.includes(id));

      if (hasNewAlert) {
        playNotificationSound();
      }
    }

    setPrevAlerts(alerts);
  }, [alerts]);

  const handleAlertClick = (alert: EmergencyDto) => {
    setSelectedPatientId(alert.patientDto.id);
    setAlertId(alert.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = async () => {
    setIsModalOpen(false);
    setSelectedPatientId(null);
    setAlertId(null);
    await fetchInitialAlerts();
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };
  const getRoomColor = (roomNumber : number) => {
    if (roomNumber < 200) return "#457B9D";
    if (roomNumber < 300) return "#F77F00";
    if (roomNumber < 400) return "orange";
    return "red";
  };

  const formatAlertContent = (content: string) => {
    // "비정상적인 고열을 보이고 있습니다.38.0" 형식의 문자열을 분리
    const message = content.split(/(\d+\.?\d*)/)[0];
    const temperature = content.match(/\d+\.?\d*/)?.[0];
  
    return (
      <>
        {message}
        {temperature && (
          <span style={{ color: 'red', fontWeight: 'bold' }}>
            {`  (${temperature}°C)`}
          </span>
        )}
      </>
    );
  };

  const getAlertClass = (title:string) => {
    return title.includes("체온 문제") ? "patient-alert-item urgent" : "patient-alert-item warning";
  };
  return (
    <div className="patient-alert-section">
      <div className="patient-alert-header">
        <div className="patient-icon-text-container">
          <FaExclamationTriangle size={24} color="red" />
          <span>응급 및 특별 알림</span>
        </div>
        <span className="patient-active-alert-count">
          활성 알림 {alerts.length}개
        </span>
      </div>
      <ul className="patient-alert-list">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
      <li
        key={alert.id}
        className={getAlertClass(alert.title)}
        onClick={() => handleAlertClick(alert)}
      >
        <span>
          <span style={{ color: getRoomColor(alert.patientDto.roomNumber) }}>
            {alert.patientDto.roomNumber}호
          </span>
          : {alert.patientDto.name} - {formatAlertContent(alert.content)}
        </span>
        <span className="patient-time">{formatTimeAgo(alert.createdAt)}</span>
      </li>
          ))
        ) : (
          <li className="no-alert">📭 현재 알림이 없습니다.</li>
        )}
      </ul>
  
      {selectedPatientId !== null && alertId !== null && (
        <AlertModal
          alertId={alertId}
          patientId={selectedPatientId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default PatientAlertSection;
