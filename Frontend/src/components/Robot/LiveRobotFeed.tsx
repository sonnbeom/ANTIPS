import React, { useState } from "react";
import robot from "../../assets/robotst.png";

const LiveRobotFeed: React.FC = () => {
  const [imageSrc, setImageSrc] = useState("http://70.12.247.213:8081/");

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('스트림 로딩 오류:', e);
    setImageSrc(robot);
  };

  return (
    <section className="live-robot-feed" 
            style={{
              justifyContent : 'center'
            }
              
    }>
      <h2>실시간 로봇 영상</h2>
      <div className="live-robot-img" 
      style={{
        display : 'flex',
        margin :'0 auto',
        justifyContent :'center'
      }}>
      <img 
        src={imageSrc}
        alt="카메라 스트림"
        style={{
          objectFit: 'contain'
        }}
        onError={handleImageError}
      />
      </div>
    </section>
  );
};

export default LiveRobotFeed;
