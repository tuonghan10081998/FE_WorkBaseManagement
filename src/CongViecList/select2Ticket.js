import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "select2/dist/css/select2.min.css";
import "select2/dist/js/select2.min.js";

const Select2Ticket = ({ dataSelect2, onChangeMaTicket }) => {
  const selectRef = useRef(null);
  useEffect(() => {
    if (selectRef.current) {
      $(selectRef.current).select2({
        placeholder: "Chọn mã ticket...",
      });
      $(selectRef.current).on("change", function () {
        const value = $(this).val();
        onChangeMaTicket(value);
      });
    }
    return () => {
      if (selectRef.current) {
        $(selectRef.current).select2("destroy");
      }
    };
  }, []);
  useEffect(() => {
    onChangeMaTicket("All");
  }, [dataSelect2]);
  return (
    <div
      className="w-100"
      style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
    >
      <div className="lst_DonHang w-100">
        <select
          className="select_2 "
          ref={selectRef}
          style={{ minWidth: "200px" }}
        >
          {" "}
          <option value="All">Tất cả</option>
          {dataSelect2?.map((item) => (
            <option key={item.ticket} value={item.ticket}>
              {item.ticket}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default Select2Ticket;
