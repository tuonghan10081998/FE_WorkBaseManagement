import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import $ from "jquery";
import "admin-lte/dist/js/adminlte.min.js";

window.$ = $;
window.jQuery = $;

const KPIChart = ({ data, dataDepDetail, setTextPB }) => {
  const [categories, setCategories] = useState([]);
  const [thucHienData, setThucHienData] = useState([]);
  const [mucTieuData, setMucTieuData] = useState([]);

  const [categoriesCT, setCategoriesCT] = useState([]);
  const [isExpensesCT, setExpensesCT] = useState([]);
  const [isRevenueCT, setRevenueCT] = useState([]);
  const [isProfitCT, setProfitCT] = useState([]);
  const [isMinDT, setMinDT] = useState(null);
  useEffect(() => {
    if (dataDepDetail.length === 0) return;

    const newcategoriesCT = [];
    const newExpensesCT = [];
    const newRevenueCT = [];
    const newProfitCT = [];
    Object.keys(dataDepDetail).forEach((key, index) => {
      const [expensesct, revenuect] = dataDepDetail[key].split("/").map(Number);
      newcategoriesCT.push(`T ${index + 1}`);
      newExpensesCT.push(expensesct);
      newRevenueCT.push(revenuect);
      newProfitCT.push(revenuect - expensesct);
    });
    setMinDT(Math.min(...newProfitCT));
    setCategoriesCT(newcategoriesCT);
    setExpensesCT(newExpensesCT);
    setRevenueCT(newRevenueCT);
    setProfitCT(newProfitCT);
  }, [dataDepDetail]);
  useEffect(() => {
    if (data.length === 0) return;
    // const kpiData = data[0];
    const newCategories = [];
    const newThucHienData = [];
    const newMucTieuData = [];

    Object.keys(data).forEach((key, index) => {
      const [thucHien, mucTieu] = data[key].split("/").map(Number);
      newCategories.push(`T ${index + 1}`);
      newThucHienData.push(thucHien);
      newMucTieuData.push(mucTieu);
    });
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
        name: "Mục tiêu",
        data: thucHienData,
      },
      {
        name: "Thực hiện ",
        data: mucTieuData,
      },
    ],
  };
  const options2 = {
    chart: {
      type: "column",
      height: 300,
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: categoriesCT,
      crosshair: true,
    },
    yAxis: {
      min: isMinDT,
      title: { text: "Số Lượng" },
      opposite: false, // dùng true nếu muốn đưa trục y của line qua bên phải
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
        name: "Chi tiêu",
        data: isExpensesCT,
        type: "column",
      },
      {
        name: "Doanh thu",
        data: isRevenueCT,
        type: "column",
      },
      {
        name: "Lợi nhuận",
        data: isProfitCT,
        type: "line",
        color: "#FF5733",
        marker: {
          enabled: true,
          symbol: "circle",
        },
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
    <div className="col-12 dashboard" style={{ padding: "2px 10px" }}>
      <div className="row bg-white ">
        <div
          style={{ padding: "2px 5px", borderRadius: "0px" }}
          className="col-12 col-lg-6 m-0  dashboard"
        >
          <div className="card card-success">
            <div className="card-header bg-white">
              <h3
                className="card-title text-black"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  marginBottom: 0,
                }}
              >
                DT phòng {setTextPB}
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
              <div
                style={{ padding: "0px 10px 0px 0px" }}
                className="col-12 col-lg-6"
              >
                <HighchartsReact highcharts={Highcharts} options={options2} />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{ padding: "2px 5px", borderRadius: "0px" }}
          className="col-12 col-lg-6 m-0  dashboard"
        >
          <div className="card card-success">
            <div className="card-header bg-white">
              <h3
                className="card-title text-black"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  marginBottom: 0,
                }}
              >
                KPI phòng {setTextPB}
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
              <div
                style={{ padding: "0px 10px 0px 0px" }}
                className="col-12 col-lg-6"
              >
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
