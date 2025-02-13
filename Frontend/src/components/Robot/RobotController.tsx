import React, { useEffect, useState, useCallback } from "react";
import * as ROSLIB from "@breq/roslib";
import './RobotControllerStyle.css'

const RobotController: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [ros, setRos] = useState<ROSLIB.Ros | null>(null);
  const [cmdVel, setCmdVel] = useState<ROSLIB.Topic | null>(null);

  const connectToROS = () => {
    if (connected) {
      disconnectFromROS();
      return;
    }

    const rosInstance = new ROSLIB.Ros({ url: "ws://70.12.247.222:9090" });
    
    rosInstance.on("connection", () => {
      console.log("Connected to ROS");
      setConnected(true);
      const topic = new ROSLIB.Topic({
        ros: rosInstance,
        name: "/cmd_vel",
        messageType: "geometry_msgs/Twist"
      });
      setCmdVel(topic);
    });

    rosInstance.on("error", (error) => {
      console.error("ROS Connection Error", error);
      setConnected(false);
    });

    rosInstance.on("close", () => {
      console.log("ROS Connection Closed");
      setConnected(false);
    });

    setRos(rosInstance);
  };

  const disconnectFromROS = () => {
    if (ros) {
      ros.close();
      console.log("Disconnected from ROS");
      setConnected(false);
      setRos(null);
      setCmdVel(null);
    }
  };

  const sendCommand = useCallback((linearX: number, angularZ: number) => {
    if (!cmdVel) {
      console.warn("Not connected to ROS, command not sent.");
      return;
    }

    const twist = new ROSLIB.Message({
      linear: { x: linearX, y: 0, z: 0 },
      angular: { x: 0, y: 0, z: angularZ },
    });
    
    cmdVel.publish(twist);
    console.log("Command sent:", twist);
  }, [cmdVel]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case "w": sendCommand(0.5, 0); break;  // 앞으로
      case "s": sendCommand(-0.5, 0); break; // 뒤로
      case "a": sendCommand(0, 1.0); break;  // 좌회전
      case "d": sendCommand(0, -1.0); break; // 우회전
      case "x": sendCommand(0, 0); console.log("Stop command sent"); break; // 정지
      default: return;
    }
    console.log(`Key pressed: ${event.key}`);
  }, [sendCommand]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <section className="robot-controller">
      <h3 className="controller-title">Robot Controller <span className={connected ? "connected" : "disconnected"}>{connected ? "(Connected)" : "(Disconnected)"}</span></h3>
      <button className="connect-button" onClick={connectToROS}>{connected ? "🔴 Disconnect from ROS" : "🔗 Connect to ROS"}</button>
      <div className="control-buttons">
        <button className="control-button up" onClick={() => { sendCommand(0.5, 0); console.log("Button: Forward"); }}>⬆️ Forward</button>
        <div className="horizontal-controls">
          <button className="control-button left" onClick={() => { sendCommand(0, 1.0); console.log("Button: Left"); }}>⬅️ Left</button>
          <button className="control-button right" onClick={() => { sendCommand(0, -1.0); console.log("Button: Right"); }}>➡️ Right</button>
        </div>
        <button className="control-button down" onClick={() => { sendCommand(-0.5, 0); console.log("Button: Backward"); }}>⬇️ Backward</button>
        <button className="control-button stop" onClick={() => { sendCommand(0, 0); console.log("Button: Stop"); }}>🛑 Stop</button>
      </div>
    </section>
  );
};

export default RobotController;
