import React, { useState } from "react";
import robot from "../../assets/robotst.png";

const LiveRobotFeed: React.FC = () => {
  const [imageSrc, setImageSrc] = useState("http://70.12.247.213:8081/");

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('스트림 로딩 오류:', e);
    setImageSrc(robot);
  };

  return (
    <section className="live-robot-feed">
      <h2>실시간 로봇 영상</h2>
      <img 
        src={imageSrc}
        alt="카메라 스트림"
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'contain'
        }}
        onError={handleImageError}
      />
    </section>
  );
};

export default LiveRobotFeed;
