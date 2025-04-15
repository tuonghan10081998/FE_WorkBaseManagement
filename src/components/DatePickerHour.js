import $ from "jquery";
import "daterangepicker/daterangepicker.css";
import "daterangepicker";

export function InitDateH(
  selector,
  setThoiGianBD,
  setThoiGianKT,
  setThoiGianBao
) {
  $(selector)
    .daterangepicker({
      timePicker: true,
      timePicker24Hour: true,
      singleDatePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      locale: {
        format: "DD/MM/YYYY HH:mm",
      },
      container: "body",
    })
    .on("apply.daterangepicker", function (ev, picker) {
      ev.stopPropagation();
      const formattedDate = picker.startDate.format("DD/MM/YYYY HH:mm");
      $(this).val(formattedDate);
      if ($(this).hasClass("thoigianbd")) {
        setThoiGianBD(formattedDate);
      } else if ($(this).hasClass("thoigiankt")) {
        setThoiGianKT(formattedDate);
      } else {
        setThoiGianBao(formattedDate);
      }
    })
    .on("show.daterangepicker", function (ev, picker) {
      $(".daterangepicker .custom-btn").remove();
      $(".daterangepicker .drp-buttons").prepend(
        '<button style="margin: 0;background: #fbdede;" type="button" class="btn custom-btn">Reset</button>'
      );
      $(".custom-btn").on("click", function () {
        $(ev.target).val("");
        picker.hide();
        if ($(ev.target).hasClass("thoigianbd")) {
          setThoiGianBD("");
        } else if ($(ev.target).hasClass("thoigiankt")) {
          setThoiGianKT("");
        } else {
          setThoiGianBao("");
        }
      });
    });
}
