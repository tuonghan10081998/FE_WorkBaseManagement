import $ from "jquery";
import "daterangepicker/daterangepicker.css";
import "daterangepicker";

export function InitDate(selector, setThoiGianBD, setThoiGianKT) {
  $(selector)
    .daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      locale: {
        format: "DD/MM/YYYY ",
      },
    })
    .on("apply.daterangepicker", function (ev, picker) {
      const formattedDate = picker.startDate.format("DD/MM/YYYY");
      $(this).val(formattedDate);
      if ($(this).hasClass("thoigianbd")) {
        setThoiGianBD(formattedDate);
      } else if ($(this).hasClass("thoigiankt")) {
        setThoiGianKT(formattedDate);
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
        }
      });
    });
}
