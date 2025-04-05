import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "select2/dist/css/select2.min.css";
import "select2/dist/js/select2.min.js";

const SelectTable = ({ dataSelect2, onPhongBanChange }) => {
  const selectRef = useRef(null);
  useEffect(() => {
    if (selectRef.current) {
      $(selectRef.current).select2({
        placeholder: "Chọn phòng ban...",
      });
      $(selectRef.current).on("change", function () {
        const value = $(this).val();
        onPhongBanChange(value);
      });
    }
    return () => {
      if (selectRef.current) {
        $(selectRef.current).select2("destroy");
      }
    };
  }, []);

  return (
    <div
      className="w-100"
      style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
    >
      <div className="lst_DonHang w-100">
        <select
          className="select_2 select2PhongBan"
          ref={selectRef}
          style={{ minWidth: "200px" }}
        >
          {" "}
          <option value="All">Tất cả</option>
          {dataSelect2?.map((item) => (
            <option key={item.dep_Code} value={item.dep_Code}>
              {item.dep_Name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default SelectTable;
