import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import $ from "jquery";
import "admin-lte/dist/js/adminlte.min.js";

window.$ = $;
window.jQuery = $;

const KPIChart = ({ data }) => {
  const [categories, setCategories] = useState([]);
  const [thucHienData, setThucHienData] = useState([]);
  const [mucTieuData, setMucTieuData] = useState([]);

  useEffect(() => {
    console.log(data);
    if (data.length === 0) return;
    // const kpiData = data[0];
    const newCategories = [];
    const newThucHienData = [];
    const newMucTieuData = [];

    Object.keys(data).forEach((key, index) => {
      const [thucHien, mucTieu] = data[key].split("/").map(Number);
      newCategories.push(`Tháng ${index + 1}`);
      newThucHienData.push(thucHien);
      newMucTieuData.push(mucTieu);
    });
    console.log(newCategories);
    setCategories(newCategories);
    setThucHienData(newThucHienData);
    setMucTieuData(newMucTieuData);
  }, [data]);

  const options = {
    chart: {
      type: "column",
      height: 300,
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: categories,
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Số Lượng",
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: "{point.y:.0f}",
        },
      },
    },
    series: [
      {
        name: "Thực Hiện",
        data: thucHienData,
      },
      {
        name: "Mục Tiêu",
        data: mucTieuData,
      },
    ],
  };

  // Re-bind collapse logic when data changes
  useEffect(() => {
    setTimeout(() => {
      $('[data-card-widget="collapse"]').each(function () {
        $(this)
          .off("click")
          .on("click", function () {
            const cardBody = $(this).closest(".card").find(".card-body");
            cardBody.slideToggle();
            $(this).find("i").toggleClass("fas fa-plus fas fa-minus");
          });
      });
    }, 100);
  }, [data]);

  return (
    <div className="row bg-white">
      <div>
        <div className="col-12 dashboard">
          <div className="card card-success">
            <div className="card-header bg-white">
              <h3
                className="card-title text-black"
                style={{ fontWeight: "bold", fontSize: "20px" }}
              >
                KPI
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

            <div className="card-body">
              <div className="col-12">
                <HighchartsReact highcharts={Highcharts} options={options} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIChart;
