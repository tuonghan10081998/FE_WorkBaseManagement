import React, { useEffect, useRef } from "react";
import $ from "jquery";
import moment from "moment";
import "daterangepicker/daterangepicker.css";
import "daterangepicker";

const DateRangePicker = ({
  onDateChange,
  setCheckALl = true,
  setCheckVal = true,
}) => {
  const dateRangeRef = useRef(null);

  useEffect(() => {
    const $datePicker = $(dateRangeRef.current);
    const today = moment();
    const startOfMonth = moment().startOf("month"); // Ngày đầu tiên của tháng
    const endOfMonth = moment().endOf("month"); // Ngày cuối cùng của tháng
    const startOfYear = moment().startOf("year"); // Ngày đầu tiên của năm
    const endOfYear = moment().endOf("year"); // Ngày cuối cùng của năm

    $datePicker.daterangepicker(
      {
        startDate: startOfMonth, // Mặc định từ ngày đầu tháng
        endDate: endOfMonth, // Đến ngày cuối tháng
        opens: "center",
        showDropdowns: true,
        autoUpdateInput: false,
        ranges: {
          "Hôm nay": [today, today],
          "Hôm qua": [
            moment().subtract(1, "days"),
            moment().subtract(1, "days"),
          ],
          "7 ngày qua": [moment().subtract(6, "days"), today],
          "Tháng này": [startOfMonth, endOfMonth], // Cập nhật mặc định cho tháng hiện tại
          "Tháng trước": [
            moment().subtract(1, "month").startOf("month"),
            moment().subtract(1, "month").endOf("month"),
          ],

          ...(setCheckALl && {
            "Tất cả": [moment("1900-01-01"), moment("1900-01-01")],
          }),
        },
        locale: {
          format: "DD/MM/YYYY",
          cancelLabel: "Hủy",
          applyLabel: "Áp dụng",
          customRangeLabel: "Chọn ngày",
        },
      },
      (start, end) => {
        const formattedStart = start.format("YYYY-MM-DD");
        const formattedEnd = end.format("YYYY-MM-DD");

        // Nếu lựa chọn là "Tất cả", trả về ngày "1900-01-01"
        if (start.format("YYYY-MM-DD") === "1900-01-01") {
          $datePicker.val("Tất cả");
        } else {
          $datePicker.val(
            `${start.format("DD/MM/YYYY")} - ${end.format("DD/MM/YYYY")}`
          );
        }

        if (onDateChange) {
          // Nếu chọn "Tất cả", gửi ngày cố định "1900-01-01"
          if (start.format("YYYY-MM-DD") === "1900-01-01") {
            onDateChange("1900-01-01", "1900-01-01");
          } else {
            onDateChange(formattedStart, formattedEnd);
          }
        }
      }
    );

    setCheckVal &&
      $datePicker.val(
        `${startOfMonth.format("DD/MM/YYYY")} - ${endOfMonth.format(
          "DD/MM/YYYY"
        )}`
      );
    !setCheckVal &&
      $datePicker.val(
        `${today.format("DD/MM/YYYY")} - ${today.format("DD/MM/YYYY")}`
      );

    return () => {
      $datePicker.data("daterangepicker").remove();
    };
  }, []);

  const handleCalendarClick = () => {
    $(dateRangeRef.current).trigger("click");
  };

  return (
    <div className="date-picker-container">
      <input
        ref={dateRangeRef}
        id="dateRangePicker"
        className="form-control"
        readOnly
      />
      <i
        className="fa fa-calendar-days"
        onClick={handleCalendarClick}
        style={{ cursor: "pointer" }}
      ></i>
    </div>
  );
};

export default DateRangePicker;
