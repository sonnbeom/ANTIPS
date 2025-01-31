import React from "react";
import map from "../../assets/map.png"
const CurrentLocation: React.FC = () => {
  return (
    <section className="lobot-current-location">
      <h3>Current Location</h3>
      <img
        src={map}
        alt="Current Location"
        className="floor-plan-image"
      />
    </section>
  );
};

export default CurrentLocation;
