import React, { useEffect, useState, useCallback } from "react";
import * as ROSLIB from "@breq/roslib";
import "./RobotControllerStyle.css";

const RobotController: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [ros, setRos] = useState<ROSLIB.Ros | null>(null);
  const [cmdKeyTopic, setCmdKeyTopic] = useState<ROSLIB.Topic | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [servoAngle, setServoAngle] = useState<number | null>(null);

  const connectToROS = () => {
    if (connected) {
      disconnectFromROS();
      return;
    }

    const rosInstance = new ROSLIB.Ros({ url: "wss://70.12.247.222:9090" });

    rosInstance.on("connection", () => {
      setConnected(true);

      const cmdTopic = new ROSLIB.Topic({
        ros: rosInstance,
        name: "/cmd_key",
        messageType: "std_msgs/String",
      });
      setCmdKeyTopic(cmdTopic);

      const motorStatusTopic = new ROSLIB.Topic({
        ros: rosInstance,
        name: "/motor_status",
        messageType: "std_msgs/String",
      });

      motorStatusTopic.subscribe((message: ROSLIB.Message) => {
        try {
          const data = JSON.parse((message as any).data);
          setSpeed(data.speed || 0);
          setServoAngle(data.servo_angle || null);
        } catch (error) {

        }
      });
    });

    rosInstance.on("error", (error) => {
      setConnected(false);
    });

    rosInstance.on("close", () => {

      setConnected(false);
      setSpeed(null);
      setServoAngle(null);
    });

    setRos(rosInstance);
  };

  const disconnectFromROS = () => {
    if (ros) {
      ros.close();
      setConnected(false);
      setRos(null);
      setCmdKeyTopic(null);
      setSpeed(null);
      setServoAngle(null);
    }
  };

  const sendCommand = useCallback((key: string) => {
    if (!cmdKeyTopic) {

      return;
    }

    const message = new ROSLIB.Message({ data: key });
    cmdKeyTopic.publish(message);
  }, [cmdKeyTopic]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const validKeys = ["w", "a", "s", "d", "x"];
    if (validKeys.includes(event.key)) {
      sendCommand(event.key);
    }
  }, [sendCommand]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <section className="robot-controller">
      <h3 className="controller-title">
        Robot Controller
        <span className={connected ? "connected" : "disconnected"}>
          {connected ? "(Connected)" : "(Disconnected)"}
        </span>
      </h3>
      <button className="connect-button" onClick={connectToROS}>
        {connected ? "🔴 Disconnect from ROS" : "🔗 Connect to ROS"}
      </button>

      <div className="motor-status">
        <h4>Motor Status:</h4>
        <p>Speed: {speed !== null ? speed : "No data"}</p>
        <p>Servo Angle: {servoAngle !== null ? servoAngle : "N/A"}</p>
      </div>

      <div className="control-buttons">
        <button className="control-button up" onClick={() => sendCommand("w")}>
          ⬆️ Forward
        </button>
        <div className="horizontal-controls">
          <button className="control-button left" onClick={() => sendCommand("a")}>
            ⬅️ Left
          </button>
          <button className="control-button right" onClick={() => sendCommand("d")}>
            ➡️ Right
          </button>
        </div>
        <button className="control-button down" onClick={() => sendCommand("s")}>
          ⬇️ Backward
        </button>
        <button className="control-button stop" onClick={() => sendCommand("x")}>
          🛑 Stop
        </button>
        <button className="control-button send-101" onClick={() => sendCommand("auto")}>
          📡 Auto Send
        </button>
      </div>
    </section>
  );
};

export default RobotController;
