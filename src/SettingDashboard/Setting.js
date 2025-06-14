import React, { useState, useEffect, useContext } from "react";
import Notifi from "./Notifi";
import BestSaler from "./BestSaler";
import BestTeam from "./BestTeam";
import Achivement from "./Achivement";
import { TitleContext } from "../components/TitleContext";
import { useNavigate } from "react-router-dom";
const Setting = () => {
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const navigate = useNavigate();

  useEffect(() => {
    !isIDLogin && navigate("/");
  }, [isIDLogin]);
  const [isTab, setTab] = useState(1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const startYear = currentYear - 2;
  const years = [];
  const { setTitle, setIcon, setIconAdd } = useContext(TitleContext);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  for (let year = startYear; year <= currentYear + 1; year++) {
    years.push(year);
  }
  useEffect(() => {
    setTitle(`Cài đặt `);
    setIcon(<i className="fa-solid fa-gear"></i>);
    setIconAdd();
  }, [setTitle, setIcon]);

  return (
    <div className="col-md-12 col-lg-12 contentItem">
      <div
        className="d-flex justify-content-between align-items-center  mt-1 p-2 div-select"
        style={{ flexWrap: "wrap", gap: "5px" }}
      >
        <div className="d-flex flex-wrap w-100" style={{ gap: "5px" }}>
          <div className="row  w-100 m-0 p-0" style={{}}>
            <div
              className={`col-5 col-md-5 col-lg-3 col-xl-2 m-0  col_search ItemCV`}
            >
              <label style={{ whiteSpace: "nowrap" }}>Năm </label>{" "}
              <select
                className="select_uutien select_year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div
              className={`col-5 col-md-5 col-lg-3 col-xl-2 m-0 px-1 col_search ItemCV item-tab  `}
            >
              <label style={{ whiteSpace: "nowrap" }}>Tháng </label>{" "}
              <select
                className="select_uutien select_year"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    Tháng {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="card" style={{ height: "50px" }}>
        <div>
          <div className="tab-table">
            <div
              onClick={() => setTab(1)}
              className={`item-table ${isTab == 1 ? "active" : ""}`}
            >
              {" "}
              <i className="fa-solid fa-list-ol"></i>
              Thông báo
            </div>
            <div
              onClick={() => setTab(2)}
              className={`item-table ${isTab == 2 ? "active" : ""}`}
            >
              {" "}
              <i className="fa-solid fa-user"></i>
              Best Saler
            </div>
            <div
              onClick={() => setTab(3)}
              className={`item-table ${isTab == 3 ? "active" : ""}`}
            >
              {" "}
              <i className="fa-solid fa-gamepad"></i>
              Thành tích
            </div>
            <div
              onClick={() => setTab(4)}
              className={`item-table ${isTab == 4 ? "active" : ""}`}
            >
              {" "}
              <i className="fa-solid fa-users"></i>
              Best Team
            </div>
          </div>
          <div className={` ${isTab == 1 ? "d-flex" : "d-none"}`}>
            <Notifi selectedYear={selectedYear} selectedMonth={selectedMonth} />
          </div>
          <div className={` ${isTab == 2 ? "d-flex" : "d-none"}`}>
            <BestSaler
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />
          </div>
          <div className={` ${isTab == 3 ? "d-flex" : "d-none"}`}>
            <Achivement
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />
          </div>
          <div className={` ${isTab == 4 ? "d-flex" : "d-none"}`}>
            <BestTeam
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Setting;
