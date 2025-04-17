import React, { useEffect } from "react";
import DashboardCardDT from "./DashboardCardDT";
import $ from "jquery";
import "admin-lte/dist/js/adminlte.min.js";

window.$ = $;
window.jQuery = $;

const DashboardDT = ({ sectionTitle, items }) => {
  useEffect(() => {
    // Kích hoạt lại tất cả các card có data-card-widget
    setTimeout(() => {
      $('[data-card-widget="collapse"]').each(function () {
        // Tắt sự kiện trước đó nếu có
        $(this).off("click");

        // Gắn sự kiện click thủ công để kích hoạt collapse
        $(this).on("click", function () {
          const cardBody = $(this).closest(".card").find(".card-body");
          cardBody.slideToggle();
          $(this).find("i").toggleClass("fas fa-plus fas fa-minus");
        });
      });
    }, 100);
  }, [items]); // Thêm dependencies để chạy lại khi có sự thay đổi trong items

  return (
    <div
      className="col-12 col-lg-12 dashboard"
      style={{ padding: "2px 5px", marginBottom: "0", borderRadius: "0" }}
    >
      <div className="card card-success">
        <div className=" card-header bg-white">
          <h3
            style={{ fontWeight: "bold", fontSize: "20px", marginBottom: 0 }}
            className="card-title text-black "
          >
            {sectionTitle}
          </h3>
          <div className="card-tools">
            <button
              type="button"
              className="btn btn-tool"
              data-card-widget="collapse"
            >
              <i className="fas fa-minus text-black"></i>
            </button>
          </div>
        </div>

        {/* Đây là phần thay thế card-body */}
        <div className="card-body py-2 p-0">
          <div className="col-12 col-lg-12  ">
            {items?.map((item, index) => (
              <DashboardCardDT key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDT;
