import React, { useState, useEffect, useContext } from "react";
import Banner from "./Banner";
import BestTeamList from "./BestTeamList";
import BestSalerList from "./BestSalerList";
import AchievementsList from "./AchievementsList";
import "./DashboardUser.css";
import { TitleContext } from "../components/TitleContext";
import { useNavigate } from "react-router-dom";
const DashBoardUser = () => {
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const navigate = useNavigate();
  useEffect(() => {
    !isIDLogin && navigate("/");
  }, [isIDLogin]);
  const IMG_API = process.env.REACT_APP_URL_IMG;
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
  const [isImageNoti, setImageNoti] = useState(null);
  const [bestSalers, setBestSalers] = useState([]);
  const [bestTeams, setbestTeams] = useState([]);
  const [achievements, setAchievements] = useState([]);
  useEffect(() => {
    setTitle(`Xem `);
    setIcon(<i className="fa-solid fa-gear"></i>);
    setIconAdd();
  }, [setTitle, setIcon]);
  const getData = async (thang, nam) => {
    const url = `${process.env.REACT_APP_URL_API}DashBoard/GetEmployeeDB?month=${thang}&year=${nam}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();

      const withImageApi = data.notification?.map((item) => ({
        ...item,
        imageapi: `${IMG_API}${item.images ?? "Default/UserDefault.png"}`,
      }));
      const ImageThongBao =
        withImageApi.length > 0 ? withImageApi[0].imageapi : "";

      setImageNoti(ImageThongBao);

      const withImageApiS = data.bestSaler?.map((item) => ({
        ...item,
        imageapi: `${IMG_API}${
          item.avartar?.trim() ? item.avartar : "Default/UserDefault.png"
        }`,
      }));
      setBestSalers(withImageApiS);

      const withImageApiBT = data.bestTeam?.map((item) => ({
        ...item,
        imageapi: `${IMG_API}${
          item.images?.trim() ? item.images : "Default/UserDefault.png"
        }`,
      }));
      setbestTeams(withImageApiBT);

      const withImageApiA = data.achivement?.map((item) => ({
        ...item,
        imageapi: `${IMG_API}${item.images}`,
      }));

      setAchievements(withImageApiA);
    } catch (error) {
      console.error(error.message);
    }
  };
  const getDataBestSaler = async (thang, nam) => {
    const url = `${process.env.REACT_APP_URL_API}BestSaler/Get?month=${thang}&year=${nam}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      const withImageApi = data.map((item) => ({
        ...item,
        imageapi: `${IMG_API}${
          item.avartar?.trim() ? item.avartar : "Default/UserDefault.png"
        }`,
      }));
      setBestSalers(withImageApi);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getData(selectedMonth, selectedYear);
    // getDataBestSaler(selectedMonth, selectedYear);
    // getDataBestTeam(selectedMonth, selectedYear);
    // getDataAchievements(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);
  const getDataBestTeam = async (thang, nam) => {
    const url = `${process.env.REACT_APP_URL_API}BestTeam/Get?month=${thang}&year=${nam}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      const withImageApi = data.map((item) => ({
        ...item,
        imageapi: `${IMG_API}${
          item.images?.trim() ? item.images : "Default/UserDefault.png"
        }`,
      }));
      setbestTeams(withImageApi);
    } catch (error) {
      console.error(error.message);
    }
  };
  const getDataAchievements = async (thang, nam) => {
    const url = `${process.env.REACT_APP_URL_API}Achivement/Get?month=${thang}&year=${nam}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      const withImageApi = data.map((item) => ({
        ...item,
        imageapi: `${IMG_API}${item.images}`,
      }));

      setAchievements(withImageApi);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="contentItem">
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
      <div className="px-2 my-2 mb-2 ">
        <Banner img={isImageNoti} />

        <div className="row g-4 mb-2">
          <BestTeamList teams={bestTeams} />
          <BestSalerList salers={bestSalers} />
        </div>

        <AchievementsList achievements={achievements} />
      </div>
    </div>
  );
};
export default DashBoardUser;
