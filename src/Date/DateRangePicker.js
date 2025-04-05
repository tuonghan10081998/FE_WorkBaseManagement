import React, { useEffect, useRef } from "react";
import $ from "jquery";
import moment from "moment";
import "daterangepicker/daterangepicker.css";
import "daterangepicker";

const DateRangePicker = ({ onDateChange }) => {
  const dateRangeRef = useRef(null);

  useEffect(() => {
    const $datePicker = $(dateRangeRef.current);
    const today = moment();
    const startOfMonth = moment().startOf("month"); // Ngày đầu tiên của tháng
    const endOfMonth = moment().endOf("month"); // Ngày cuối cùng của tháng

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

        $datePicker.val(
          `${start.format("DD/MM/YYYY")} - ${end.format("DD/MM/YYYY")}`
        );

        if (onDateChange) {
          onDateChange(formattedStart, formattedEnd);
        }
      }
    );

    // Set giá trị mặc định hiển thị trên input
    $datePicker.val(
      `${startOfMonth.format("DD/MM/YYYY")} - ${endOfMonth.format(
        "DD/MM/YYYY"
      )}`
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
