import React, { useState } from "react";
import "./RobotActivityLogStyle.css";
import { FaGamepad } from "react-icons/fa"; // React Icons 사용 (게임패드 아이콘)
import RobotCommandModal from "./RobotCommandModal"; // 모달 컴포넌트

const RobotActivityLog: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="robot-activity-log">
      <h3>Robot Activity Log</h3>
      <ul>
        <li>
          Monitoring Room 304 - Current Task
          <span className="status in-progress">In Progress</span>
        </li>
        <li>
          Supply Delivery to Room 302 - Next Task
          <span className="status queued">Queued</span>
        </li>
        <li>
          Battery Status - 78%
          <span className="status battery-status">78%</span>
        </li>
      </ul>

      {/* 하단 컨트롤 버튼 */}
      <div className="control-robot-button-section">
        <button className="control-robot-button" onClick={handleOpenModal}>
          <FaGamepad className="control-robot-button-icon" />
          Control Robot
        </button>
      </div>

      {/* 모달 창 */}
      {isModalOpen && (
        <RobotCommandModal isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </section>
  );
};

export default RobotActivityLog;
