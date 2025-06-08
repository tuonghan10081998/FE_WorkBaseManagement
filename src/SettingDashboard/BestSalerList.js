import React from "react";
import BestSalerCard from "./BestSalerCard";

const BestSalerList = ({ salers }) => {
  return (
    <section className="col-md-6 d-flex flex-column">
      <div className="bg-white rounded-3 shadow-sm p-4 h-100 d-flex flex-column">
        <h2 className="section-heading border_item d-flex align-items-center mb-3">
          <i className="fas fa-star text-warning me-2"></i>Best Saler
        </h2>
        <div
          className="flex-grow-1"
          style={{ maxHeight: "320px", overflowY: "auto" }}
        >
          {salers.map((saler) => (
            <BestSalerCard key={saler.id} saler={saler} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default BestSalerList;
