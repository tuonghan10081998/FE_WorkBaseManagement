import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import $ from "jquery";
import "admin-lte/dist/js/adminlte.min.js";

window.$ = $;
window.jQuery = $;

const DashboardPie = ({ dataDepDT, dataKT }) => {
  const [isTab, setTab] = useState(false);
  const [keToanData, setKeToanData] = useState([]);
  const [categoriesKT, setCategoriesKT] = useState([]);
  const [thuNhapData, setThuNhapData] = useState([]);
  const [doanhthuData, setDoanhThuData] = useState([]);
  const [isMinCT, setMinCT] = useState(null);

  const [categoriesDT, setCategoriesDT] = useState([]);
  const [isExpensesDT, setExpensesDT] = useState([]);
  const [isRevenueDT, setRevenueDT] = useState([]);
  const [isProfitDT, setProfitDT] = useState([]);
  const [isMinDT, setMinDT] = useState(null);

  useEffect(() => {
    if (dataKT.length === 0) return;
    const newKeToanData = [];
    const newCategoriesKT = [];
    const newThuNhapData = [];
    const newDoanhThuData = [];
    Object.keys(dataKT).forEach((key, index) => {
      const [chitieu, thunhap] = dataKT[key].split("/").map(Number);
      newKeToanData.push(chitieu);
      newThuNhapData.push(thunhap);
      const doanhthu = thunhap - chitieu;
      newDoanhThuData.push(doanhthu);
      newCategoriesKT.push(`T ${index + 1}`);
    });
    setMinCT(Math.min(...newDoanhThuData));
    setKeToanData(newKeToanData);
    setCategoriesKT(newCategoriesKT);
    setThuNhapData(newThuNhapData);
    setDoanhThuData(newDoanhThuData);
  }, [dataKT]);
  useEffect(() => {
    if (dataDepDT.length === 0) return;
    const newcategoriesDT = [];
    const newExpensesDT = [];
    const newRevenueDT = [];
    const newProfitDT = [];
    dataDepDT?.map((x) => {
      newcategoriesDT.push(x.dep_Name);
      newExpensesDT.push(x.totalExpenses);
      newRevenueDT.push(x.totalRevenue);
      newProfitDT.push(x.profit);
    });
    setMinDT(Math.min(...newProfitDT));
    setCategoriesDT(newcategoriesDT);
    setExpensesDT(newExpensesDT);
    setRevenueDT(newRevenueDT);
    setProfitDT(newProfitDT);
  }, [dataDepDT]);
  const options = {
    chart: {
      type: "column",
      height: 300,
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: categoriesDT,
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
        data: isExpensesDT,
        type: "column",
      },
      {
        name: "Doanh thu",
        data: isRevenueDT,
        type: "column",
      },
      {
        name: "Lợi nhuận",
        data: isProfitDT,
        type: "line",
        color: "#FF5733",
        marker: {
          enabled: true,
          symbol: "circle",
        },
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
      categories: categoriesKT,
      crosshair: true,
    },
    yAxis: {
      min: isMinCT,
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
        data: keToanData,
        type: "column",
      },
      {
        name: "Doanh thu",
        data: thuNhapData,
        type: "column",
      },
      {
        name: "Lợi nhuận",
        data: doanhthuData,
        type: "line",
        color: "#FF5733",
        marker: {
          enabled: true,
          symbol: "circle",
        },
      },
    ],
  };

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
  }, []);
  const handleSumColumn = (data = [], field = "") => {
    if (!Array.isArray(data) || !field) return 0;

    return data.reduce((sum, item) => {
      const value = Number(item[field]) || 0;
      return sum + value;
    }, 0);
  };
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
                DT tổng công ty
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
                DT từng phòng ban
              </h3>
              <div className="tab-table">
                <div
                  onClick={() => setTab(false)}
                  className={`item-table dashboardtab ${
                    !isTab ? "active" : ""
                  }`}
                >
                  {" "}
                  Biểu đồ
                </div>
                <div
                  onClick={() => setTab(true)}
                  className={`item-table dashboardtab ${isTab ? "active" : ""}`}
                >
                  {" "}
                  Table
                </div>
              </div>

              <div className="card-tools" style={{ marginLeft: 0 }}>
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
                {!isTab && (
                  <HighchartsReact highcharts={Highcharts} options={options} />
                )}
                {isTab && (
                  <div className=" ">
                    <div
                      className="item-table"
                      style={{ height: "300px", overflow: "auto" }}
                    >
                      <table className="task-table">
                        <thead>
                          <tr className="trthdashboard">
                            <td scope="col">Phòng ban</td>
                            <td scope="col">Chi tiêu</td>
                            <td scope="col">Doanh thu</td>
                            <td scope="col">Lợi nhuận</td>
                          </tr>
                        </thead>
                        <tbody>
                          {dataDepDT?.map((x, index) => {
                            return (
                              <tr key={x.id}>
                                <td style={{ whiteSpace: "nowrap" }}>
                                  {x.dep_Name}
                                </td>
                                <td style={{ whiteSpace: "nowrap" }}>
                                  {x.totalExpenses.toLocaleString()}
                                </td>
                                <td style={{ whiteSpace: "nowrap" }}>
                                  {x.totalRevenue.toLocaleString()}
                                </td>
                                <td style={{ whiteSpace: "nowrap" }}>
                                  {x.profit.toLocaleString()}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        {dataDepDT && dataDepDT.length > 0 && (
                          <tfoot>
                            <tr className="trtfdashboard">
                              <td
                                style={{
                                  whiteSpace: "nowrap",
                                  fontWeight: "500",
                                  color: "REd",
                                }}
                                colSpan=""
                              >
                                Tổng
                              </td>
                              <td
                                style={{
                                  whiteSpace: "nowrap",
                                  fontWeight: "500",
                                  color: "REd",
                                }}
                              >
                                {handleSumColumn(
                                  dataDepDT,
                                  "totalExpenses"
                                ).toLocaleString()}
                              </td>
                              <td
                                style={{
                                  whiteSpace: "nowrap",
                                  fontWeight: "500",
                                  color: "REd",
                                }}
                              >
                                {handleSumColumn(
                                  dataDepDT,
                                  "totalRevenue"
                                ).toLocaleString()}
                              </td>
                              <td
                                style={{
                                  whiteSpace: "nowrap",
                                  fontWeight: "500",
                                  color: "REd",
                                }}
                              >
                                {handleSumColumn(
                                  dataDepDT,
                                  "profit"
                                ).toLocaleString()}
                              </td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPie;
