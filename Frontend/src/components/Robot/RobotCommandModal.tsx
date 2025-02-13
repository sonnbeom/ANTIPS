import React, { useState, useEffect } from "react";
import "./RobotCommandModalStyle.css";
import * as ROSLIB from 'roslib'; // ✅ 올바른 방식


interface RobotCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const RobotCommandModal: React.FC<RobotCommandModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("location");
  const [room, setRoom] = useState("");
  const [bedNumber, setBedNumber] = useState("");
  const [direction, setDirection] = useState<string>('');
  const [ros, setRos] = useState<ROSLIB.Ros | null>(null);
  const [connected, setConnected] = useState(false);
  const [robotStatus, setRobotStatus] = useState<string>('');

  // ROS 연결 설정
  useEffect(() => {
    const loadROSLIB = async () => {
      const ROSLIB = await import('roslib');
      
      const newRos = new ROSLIB.Ros({
        url: 'ws://70.12.247.222:9090'
      });
  
      newRos.on('connection', () => {
        console.log('Connected to ROS websocket server.');
        setConnected(true);
      });
  
      newRos.on('error', (error) => {
        console.error('Error connecting to ROS:', error);
        setConnected(false);
      });
  
      newRos.on('close', () => {
        console.log('Connection to ROS websocket server closed.');
        setConnected(false);
      });
  
      setRos(newRos);
    };
  
    loadROSLIB();
  }, []);
  

  // 로봇 상태 구독
  useEffect(() => {
    if (!ros || !connected) return;

    const statusListener = new ROSLIB.Topic({
      ros: ros,
      name: '/robot_status', // 실제 토픽 이름으로 변경
      messageType: 'std_msgs/String'
    });

    statusListener.subscribe((message: any) => {
      setRobotStatus(message.data);
    });

    return () => {
      statusListener.unsubscribe();
    };
  }, [ros, connected]);

  // 로봇 이동 명령 발행 함수
  const publishMoveCommand = (linear: number, angular: number) => {
    if (!ros || !connected) {
      console.error('ROS not connected');
      return;
    }

    const cmdVel = new ROSLIB.Topic({
      ros: ros,
      name: '/cmd_vel',
      messageType: 'geometry_msgs/Twist'
    });

    const twist = new ROSLIB.Message({
      linear: { x: linear, y: 0, z: 0 },
      angular: { x: 0, y: 0, z: angular }
    });

    cmdVel.publish(twist);
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (event: KeyboardEvent) => {
    if (activeTab !== 'manual') return;

    const speed = 0.5; // 선속도 (m/s)
    const turn = 1.0;  // 각속도 (rad/s)

    switch (event.key) {
      case 'ArrowUp':
        setDirection('up');
        publishMoveCommand(speed, 0);
        break;
      case 'ArrowDown':
        setDirection('down');
        publishMoveCommand(-speed, 0);
        break;
      case 'ArrowLeft':
        setDirection('left');
        publishMoveCommand(0, turn);
        break;
      case 'ArrowRight':
        setDirection('right');
        publishMoveCommand(0, -turn);
        break;
    }
  };

  const handleKeyUp = () => {
    setDirection('');
    publishMoveCommand(0, 0);
  };

  // 위치 기반 이동 명령
  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ros || !connected) {
      console.error('ROS not connected');
      return;
    }

    const goalPose = new ROSLIB.Topic({
      ros: ros,
      name: '/move_base_simple/goal',
      messageType: 'geometry_msgs/PoseStamped'
    });

    const pose = calculateGoalPose(room, bedNumber);

    const goal = new ROSLIB.Message({
      header: {
        frame_id: 'map',
        stamp: {
          secs: Math.floor(Date.now() / 1000),
          nsecs: (Date.now() % 1000) * 1000000
        }
      },
      pose: pose
    });

    goalPose.publish(goal);
    console.log("Moving to location:", { room, bedNumber });
    onClose();
  };

  // 수동 제어 폼 제출
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    publishMoveCommand(0, 0); // 정지 명령
    console.log("Manual control stopped");
    onClose();
  };

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    if (isOpen && activeTab === 'manual') {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, activeTab, connected]);

  // 방향 버튼 스타일 동적 적용
  const getButtonStyle = (buttonDirection: string) => {
    return {
      backgroundColor: direction === buttonDirection ? '#007bff' : '',
      color: direction === buttonDirection ? 'white' : ''
    };
  };

  if (!isOpen) return null;

  return (
    <div className="robot-modal-overlay">
      <div className="robot-modal-content">
        <div className="robot-modal-header">
          <div>
            로봇 제어
            {connected ? 
              <span className="connection-status connected">연결됨</span> : 
              <span className="connection-status disconnected">연결 안됨</span>
            }
          </div>
          <button className="robot-close-button" onClick={onClose}>✕</button>
        </div>
        <hr className="R-C-hr" />

        <div className="robot-tab-buttons">
          <button
            className={`robot-tab-button ${activeTab === "location" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("location")}
          >
            위치 선택
          </button>
          <button
            className={`robot-tab-button ${activeTab === "manual" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("manual")}
          >
            수동 제어
          </button>
        </div>

        {activeTab === "location" && (
          <form onSubmit={handleLocationSubmit}>
            <label htmlFor="robot-room-select">호실 선택</label>
            <select
              id="robot-room-select"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            >
              <option value="">호실을 선택하세요</option>
              <option value="101">101호</option>
              <option value="102">102호</option>
              <option value="103">103호</option>
            </select>

            <label htmlFor="robot-bed-select">침대 번호</label>
            <select
              id="robot-bed-select"
              value={bedNumber}
              onChange={(e) => setBedNumber(e.target.value)}
              required
            >
              <option value="">침대 번호를 선택하세요</option>
              <option value="1">1번 침대</option>
              <option value="2">2번 침대</option>
              <option value="3">3번 침대</option>
            </select>

            <div className="robot-modal-buttons">
              <button type="button" className="robot-cancel-btn" onClick={onClose}>
                취소
              </button>
              <button type="submit" className="robot-submit-btn" disabled={!connected}>
                이동 지시
              </button>
            </div>
          </form>
        )}

        {activeTab === "manual" && (
          <form onSubmit={handleManualSubmit}>
            <p>방향키를 사용하여 로봇을 제어합니다.</p>
            <div className="manual-control-buttons">
              <button 
                type="button" 
                className="direction-button"
                style={getButtonStyle('up')}
                disabled={!connected}
              >
                ↑
              </button>
              <div>
                <button 
                  type="button" 
                  className="direction-button"
                  style={getButtonStyle('left')}
                  disabled={!connected}
                >
                  ←
                </button>
                <button 
                  type="button" 
                  className="direction-button"
                  style={getButtonStyle('down')}
                  disabled={!connected}
                >
                  ↓
                </button>
                <button 
                  type="button" 
                  className="direction-button"
                  style={getButtonStyle('right')}
                  disabled={!connected}
                >
                  →
                </button>
              </div>
            </div>
            <div className="robot-status">
              {robotStatus && <p>로봇 상태: {robotStatus}</p>}
            </div>
            <div className="robot-modal-buttons">
              <button type="button" className="robot-cancel-btn" onClick={onClose}>
                취소
              </button>
              <button type="submit" className="robot-submit-btn" disabled={!connected}>
                제어 종료
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// 목표 위치 계산 함수
const calculateGoalPose = (room: string, bed: string) => {
  // 예시 좌표 (실제 환경에 맞게 수정 필요)
  const positions: { [key: string]: { x: number, y: number, theta: number } } = {
    '101-1': { x: 1.0, y: 1.0, theta: 0 },
    '101-2': { x: 2.0, y: 1.0, theta: 0 },
    '101-3': { x: 3.0, y: 1.0, theta: 0 },
    '102-1': { x: 1.0, y: 2.0, theta: 0 },
    '102-2': { x: 2.0, y: 2.0, theta: 0 },
    '102-3': { x: 3.0, y: 2.0, theta: 0 },
    '103-1': { x: 1.0, y: 3.0, theta: 0 },
    '103-2': { x: 2.0, y: 3.0, theta: 0 },
    '103-3': { x: 3.0, y: 3.0, theta: 0 },
  };

  const key = `${room}-${bed}`;
  const pos = positions[key] || { x: 0, y: 0, theta: 0 };

  return {
    position: { x: pos.x, y: pos.y, z: 0 },
    orientation: {
      x: 0,
      y: 0,
      z: Math.sin(pos.theta / 2),
      w: Math.cos(pos.theta / 2)
    }
  };
};

export default RobotCommandModal;
