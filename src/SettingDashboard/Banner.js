import React from "react";

const Banner = ({ img }) => {
  return (
    <section
      className="text-center mb-3 pb-4"
      style={{
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        borderRadius: "8px",
      }}
    >
      <h2 class="section-heading border_item justify-content-start p-2">
        <i class="fas fa-bell text-info"></i>Thông báo
      </h2>
      <div
        style={{
          margin: "0 auto",
          borderRadius: "0.5rem",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={img}
          alt="Banner thông báo"
          width="1600"
          height="350"
          loading="lazy"
        />
      </div>
    </section>
  );
};
export default Banner;
