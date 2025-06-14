import React from "react";

const AchievementCard = ({ achievement }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="achievement-card bg-white rounded-3 shadow-sm p-3 d-flex flex-column align-items-center mb-4"
        style={{ maxWidth: "300px" }}
      >
        <img
          src={achievement.imageapi}
          alt={achievement.title}
          style={{
            objectFit: "cover",
            borderRadius: "0.5rem",
            width: "100%",
            height: "100%",
            maxHeight: "200px",
            maxWidth: "300px",
          }}
          loading="lazy"
        />
        <div className="achievement-title mt-2 text-center fw-semibold">
          {achievement.title}
        </div>
      </div>
    </div>
  );
};
export default AchievementCard;
