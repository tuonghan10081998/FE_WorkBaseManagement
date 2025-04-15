import React, { useEffect } from "react";
import DashboardCard from "./DashboardCard";
import $ from "jquery";
import "admin-lte/dist/js/adminlte.min.js";

window.$ = $;
window.jQuery = $;

const DashboardSection = ({ sectionTitle, items }) => {
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
    <div>
      <div className="col-12 dashboard">
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
          <div className="card-body py-2">
            <div className="row  bg-white">
              {items?.map((item, index) => (
                <DashboardCard key={index} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
