import React from "react";
import robot from "../../assets/robotst.png"

const LiveRobotFeed: React.FC = () => {
  return (
    <section className="live-robot-feed">
      <h2>Live Robot Feed</h2>
      <img
        src={robot}
        alt="Live Robot Feed"
        className="robot-feed-image"
      />
    </section>
  );
};

export default LiveRobotFeed;
