import React from "react";

const DashboardCard = ({ title, count, icon, bg, textDark }) => {
  const textClass = textDark ? "text-dark" : "text-white";
  return (
    <div className="col-6 col-lg-3 p-0 m-0 g-3 px-4 py-2">
      <div className={`card  ${textClass}`} style={{ backgroundColor: bg }}>
        <div className=" d-flex align-items-center p-3 ">
          <div>
            <div className={`h3 fw-bold ${textClass}`}>{count}</div>
            <div className={`h6 ${textClass}`}>{title}</div>
          </div>
          <div className={`ms-auto display-4 opacity-50 ${textClass}`}>
            <i className={icon}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
