import React from "react";

const BestTeamCard = ({ team }) => {
  return (
    <div className="team-card d-flex align-items-center gap-3 bg-light rounded p-3 ">
      <img
        src={team.imageapi}
        alt={`Logo ${team.team}`}
        width={60}
        height={60}
        className="rounded-circle"
        style={{ objectFit: "cover", boxShadow: "0 0 6px rgb(0 0 0 / 0.15)" }}
        loading="lazy"
      />
      <div className="team-info flex-grow-1">
        <div
          className="team-name fw-semibold fs-5 mb-1"
          style={{ color: "#212529" }}
        >
          {team.team}
        </div>
        <div
          className="team-details text-secondary"
          style={{ fontSize: "0.9rem" }}
        >
          <span className="fw-semibold text-dark">Doanh số:</span>{" "}
          {team.money.toLocaleString()}
          <br />
          <span className="fw-semibold text-dark">Ghi chú:</span> {team.note}
        </div>
      </div>
    </div>
  );
};
export default BestTeamCard;
