import React, { useState } from "react";
import robot from "../../assets/robotst.png";
import './LiveRobotStyle.css'

const LiveRobotFeed: React.FC = () => {
  const [imageSrc, setImageSrc] = useState("http://70.12.247.213:8081/video_feed");

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('스트림 로딩 오류:', e);
    setImageSrc(robot);
  };
  return (
    <section className="live-robot-feed">
      <h3>실시간 로봇 영상</h3>
      <div className="video-container" >
        <div className="video-item" >
          <img 
            src={imageSrc}
            alt="카메라 스트림 1"
            onError={handleImageError}
          />
        </div>
      </div>
    </section>
  );
};

export default LiveRobotFeed;
