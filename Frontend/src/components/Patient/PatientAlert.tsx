import React, { useState, useEffect,useRef } from "react";
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
  const eventSourceRef = useRef<EventSource | null>(null);
  const hasRetriedRef = useRef(false);
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
    }
  };

  useEffect(() => {
    fetchInitialAlerts();
  }, []);

  const playNotificationSound = () => {
    audioRef.current.play().catch(error => {
    });
  };

  useEffect(() => {
    const connect = () => {
      eventSourceRef.current = new EventSource(`${API_URL}/public/stream`,{
        withCredentials: true
      });

      eventSourceRef.current.onopen = () => {
        setIsConnected(true);
        hasRetriedRef.current = false; // 재연결 성공 시 초기화
      };

      eventSourceRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.emergencyDtoList) {
            setAlerts(data.emergencyDtoList);
          }
        } catch (error) {
        }
      };

      eventSourceRef.current.onerror = (error) => {
        setIsConnected(false);
        eventSourceRef.current?.close();

        // 아직 재연결을 시도하지 않았다면 한 번만 재연결 시도
        if (!hasRetriedRef.current) {
          hasRetriedRef.current = true;
          setTimeout(connect, 5000); // 5초 후 재연결
        } else {
        }
      };
    };

    connect(); // 초기 연결 시도

    const checkConnection = setInterval(() => {
      if (eventSourceRef.current) {
      }
    }, 50000);

    return () => {
      clearInterval(checkConnection);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);
  
  
  

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

  const formatAlertContent = (content: string, title: string) => {
    const message = content.split(/(\d+\.?\d*)/)[0];
    const value = content.match(/\d+\.?\d*/)?.[0];
    
    return (
      <>
        {message}
        {value && (
          <span style={{ color: 'red', fontWeight: 'bold' }}>
            {`  (${value}${title.includes("체온 문제") ? '°C' : '%'})`}
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
      : {alert.patientDto.name} - {formatAlertContent(alert.content, alert.title)}
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
