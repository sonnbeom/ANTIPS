import React, { useState } from "react";
import robot from "../../assets/robotst.png";

const LiveRobotFeed: React.FC = () => {
  const [imageSrc, setImageSrc] = useState("http://70.12.247.213:8081/video_feed");
  const [imageSrc1, setImageSrc1] = useState("http://70.12.246.24:8081/video_feed");

  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '20px',
    padding: '0 20px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '10px'
    }
  } as React.CSSProperties;

  const imageContainerStyle = {
    flex: 1,
    maxWidth: '50%',
    '@media (max-width: 768px)': {
      maxWidth: '100%',
      marginBottom: '10px'
    }
  } as React.CSSProperties;

  const imageStyle = {
    width: '100%',
    height: '50vh',
    objectFit: 'contain' as const,
    border: '1px solid #ccc',
    borderRadius: '8px',
    '@media (max-width: 768px)': {
      height: '40vh'
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('스트림 로딩 오류:', e);
    setImageSrc(robot);
  };

  const handleImageError1 = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('스트림 로딩 오류:', e);
    setImageSrc1(robot);
  };

  return (
    <section className="live-robot-feed">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>실시간 로봇 영상</h2>
      <style>
        {`
          @media (max-width: 768px) {
            .video-container {
              flex-direction: column !important;
            }
            .video-item {
              max-width: 100% !important;
            }
          }
        `}
      </style>
      <div className="video-container" style={containerStyle}>
        <div className="video-item" style={imageContainerStyle}>
          <img 
            src={imageSrc}
            alt="카메라 스트림 1"
            style={imageStyle}
            onError={handleImageError}
          />
        </div>
        <div className="video-item" style={imageContainerStyle}>
          <img 
            src={imageSrc1}
            alt="카메라 스트림 2"
            style={imageStyle}
            onError={handleImageError1}
          />
        </div>
      </div>
    </section>
  );
};

export default LiveRobotFeed;
