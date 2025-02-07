import React, { useEffect, useState } from "react";
import map from "../../assets/map.png";

// ROSLIB 타입 정의
declare global {
  interface Window {
    ROSLIB: any;
  }
}

interface PoseMessage {
  pose: {
    pose: {
      position: {
        x: number;
        y: number;
      };
      orientation: {
        z: number;
        w: number;
      };
    };
  };
}

const CurrentLocation: React.FC = () => {
  const [robotPosition, setRobotPosition] = useState({ x: 0, y: 0 });
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // ROSLIB이 로드되었는지 확인
    if (typeof window.ROSLIB === 'undefined') {
      console.error('ROSLIB is not loaded');
      return;
    }

    const ros = new window.ROSLIB.Ros({
      url: 'ws://localhost:9090'
    });

    ros.on('connection', () => {
      console.log('Connected to websocket server.');
      setConnected(true);
    });

    ros.on('error', (error: Error) => {
      console.error('Error connecting to websocket server:', error);
      setConnected(false);
    });

    ros.on('close', () => {
      console.log('Connection to websocket server closed.');
      setConnected(false);
    });

    const poseTopic = new window.ROSLIB.Topic({
      ros: ros,
      name: '/amcl_pose',
      messageType: 'geometry_msgs/PoseWithCovarianceStamped'
    });

    const messageCallback = (message: PoseMessage) => {
      setRobotPosition({
        x: message.pose.pose.position.x,
        y: message.pose.pose.position.y
      });
    };

    if (connected) {
      poseTopic.subscribe(messageCallback);
    }

    return () => {
      if (connected) {
        poseTopic.unsubscribe(messageCallback);
        ros.close();
      }
    };
  }, [connected]);

  return (
    <section className="lobot-current-location">
      <h3>Current Location {connected ? '(Connected)' : '(Disconnected)'}</h3>
      <div className="map-container">
        <img
          src={map}
          alt="Current Location"
          className="floor-plan-image"
        />
        {connected && (
          <div 
            className="robot-marker"
            style={{
              position: 'absolute',
              left: `${robotPosition.x}px`,
              top: `${robotPosition.y}px`,
              width: '10px',
              height: '10px',
              backgroundColor: 'red',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}
      </div>
    </section>
  );
};

export default CurrentLocation;
