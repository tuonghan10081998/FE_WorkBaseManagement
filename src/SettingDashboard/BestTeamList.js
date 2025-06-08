import React from "react";
import BestTeamCard from "./BestTeamCard";

const BestTeamList = ({ teams }) => {
  return (
    <section className="col-md-6 d-flex flex-column">
      <div className="bg-white rounded-3 shadow-sm p-4 h-100 d-flex flex-column">
        <h2 className="section-heading d-flex border_item align-items-center mb-3">
          <i className="fas fa-users text-primary me-2"></i>Best Team
        </h2>
        <div
          className="flex-grow-1"
          style={{ maxHeight: "320px", overflowY: "auto" }}
        >
          {teams.map((team) => (
            <BestTeamCard key={team.id} team={team} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default BestTeamList;
