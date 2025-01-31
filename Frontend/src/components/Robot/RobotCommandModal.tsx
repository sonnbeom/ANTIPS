import React, { useState } from "react";
import "./RobotCommandModalStyle.css";

interface RobotCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RobotCommandModal: React.FC<RobotCommandModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("location"); // 탭 상태 관리

  // 위치 선택 폼 상태
  const [room, setRoom] = useState("");
  const [bedNumber, setBedNumber] = useState("");

  // 위치 폼 전송
  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Location Form:", { room, bedNumber });
    onClose();
  };

  // 수동 제어 폼 전송
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Manual Control Form: 유저가 원하는 방향 제어");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="robot-modal-overlay">
      <div className="robot-modal-content">
        {/* 모달 헤더 */}
        <div className="robot-modal-header">
          <div>로봇 제어</div>
          <button className="robot-close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <hr className="R-C-hr" />

        {/* 탭 버튼 */}
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

        {/* 위치 선택 폼 */}
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
              <button type="submit" className="robot-submit-btn">
                이동 지시
              </button>
            </div>
          </form>
        )}

        {/* 수동 제어 폼 */}
        {activeTab === "manual" && (
          <form onSubmit={handleManualSubmit}>
            <p>방향을 선택하여 로봇을 수동 제어합니다.</p>
            <div className="manual-control-buttons">
              <button type="button" className="direction-button">↑</button>
              <div>
                <button type="button" className="direction-button">←</button>
                <button type="button" className="direction-button">↓</button>
                <button type="button" className="direction-button">→</button>
              </div>

            </div>
            <div className="robot-modal-buttons">
              <button type="button" className="robot-cancel-btn" onClick={onClose}>
                취소
              </button>
              <button type="submit" className="robot-submit-btn">
                제어 지시
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RobotCommandModal;
