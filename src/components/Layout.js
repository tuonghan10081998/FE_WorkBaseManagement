import React, { useState, useEffect, useContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { TitleContext } from "../components/TitleContext";
import "../components/index.css";

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHomeExpanded, setIsHomeExpanded] = useState(false);
  const { title, icon, iconAdd } = useContext(TitleContext);
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const [isfullName, setfullName] = useState(localStorage.getItem("fullName"));
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const [isPQDuyen, setPQDuyen] = useState(false);
  const [isPagePQ, setPagePQ] = useState(false);
  const [isDB, setDB] = useState(false);
  const [isKT, setKT] = useState(false);
  const getPhanQuyen = async () => {
    const url = `${process.env.REACT_APP_URL_API}User/GetRole?action=GEt&para1=${isUser}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      const dataPQ = data.lstUserPage.filter((x) => x.pageID === "R");
      const dataDB = data.lstUserPage.filter((x) => x.pageID === "DB");
      const dataKT = data.lstUserPage.filter((x) => x.pageID === "Accountant");
      if (dataPQ[0].isChecked == 1) setPagePQ(true);
      if (dataDB[0].isChecked == 1) setDB(true);
      if (dataKT[0].isChecked == 1) setKT(true);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getPhanQuyen();
  }, [isUser, isPQDuyen]);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth <= 800);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenu = () => {
    if (!isCollapsed && window.innerWidth <= 800) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleClick = () => {
    if (window.innerWidth <= 800) {
      if (!isCollapsed) setIsCollapsed(true);
    }
  };

  return (
    <div className="d-flex">
      <div
        className={`bg-dark text-white sidebar p-3 ${
          isCollapsed ? "collapsed" : "expanded"
        }`}
        id="sidebar"
      >
        <div className="brand" id="toggleSidebar">
          {/* <img src="/img/logoNTB.png" className="img" /> */}
          <span style={{ whiteSpace: "nowrap" }} className="ms-2">
            AZGroup
          </span>
        </div>
        <nav className="nav flex-column">
          {/* <div className="nav-item">
            <a
              className="nav-link text-white d-flex justify-content-between align-items-center"
              href="#"
              onClick={() => setIsHomeExpanded(!isHomeExpanded)}
            >
              <div>
                <i className="fas fa-home text-lg"></i>
                <span className="ms-2">Home</span>
              </div>
            </a>
            {isHomeExpanded && (
              <div className={`${!isCollapsed ? "ms-4" : "ms-0"}`}>
                <Link className="nav-link text-white" to="/subhome1">
                  <i className="fas fa-circle text-sm"></i>
                  <span className="ms-2">Sub Home 1</span>
                </Link>
                <Link className="nav-link text-white" to="/subhome2">
                  <i className="fas fa-circle text-sm"></i>
                  <span className="ms-2">Sub Home 2</span>
                </Link>
              </div>
            )}
          </div> */}
          {isDB && (
            <div className="nav-item">
              <Link
                className="nav-link text-white d-flex justify-content-between align-items-center"
                to="/layout/Dashboard"
              >
                <div>
                  <i
                    style={{ color: "#78baeb" }}
                    className="fa-solid fa-gauge"
                  ></i>
                  <span className="ms-2">Dashboard</span>
                </div>
              </Link>
            </div>
          )}{" "}
          <div className="nav-item">
            <Link
              className="nav-link text-white d-flex justify-content-between align-items-center"
              to="/layout/listcongviec"
            >
              <div>
                <i
                  style={{ color: "#65ff40" }}
                  className="fas fa-photo-video text-lg"
                ></i>
                <span className="ms-2">Danh sách công việc</span>
              </div>
            </Link>
          </div>
          <div className="nav-item">
            <Link
              className="nav-link text-white d-flex justify-content-between align-items-center"
              to="/layout/project"
            >
              <div>
                <i
                  style={{ color: "#0d6efd" }}
                  className="fa-solid fa-diagram-project"
                ></i>
                <span className="ms-2">Danh sách dự án</span>
              </div>
            </Link>
          </div>
          <div className="nav-item">
            <Link
              className="nav-link text-white d-flex justify-content-between align-items-center"
              to="/layout/listleave"
            >
              <div>
                <i
                  style={{ color: "#e70000" }}
                  className="fa-solid fa-person-walking-arrow-right"
                ></i>
                <span className="ms-2">Danh sách nghỉ phép</span>
              </div>
            </Link>
          </div>
          <div className="nav-item">
            <Link
              className="nav-link text-white d-flex justify-content-between align-items-center"
              to="/layout/KPI"
            >
              <div>
                <i
                  style={{ color: "rgb(185 255 123)" }}
                  className="fa-solid fa-star"
                ></i>
                <span className="ms-2">KPI nhân viên</span>
              </div>
            </Link>
          </div>
          {isKT && (
            <div className="nav-item">
              <Link
                className="nav-link text-white d-flex justify-content-between align-items-center"
                to="/layout/PurChase"
              >
                <div>
                  <i
                    style={{ color: "rgb(249 237 72)" }}
                    className="fas fa-fire text-lg"
                  ></i>
                  <span className="ms-2">Kế toán</span>
                </div>
              </Link>
            </div>
          )}
          {isPagePQ && (
            <div className="nav-item">
              <Link
                className="nav-link text-white d-flex justify-content-between align-items-center"
                to="/layout/phanquyen"
              >
                <div>
                  <i
                    style={{ color: "green" }}
                    className="fa-solid fa-shapes"
                  ></i>
                  <span className="ms-2">Phân quyền</span>
                </div>
              </Link>
            </div>
          )}
          <div className="nav-item">
            <Link
              onClick={() => {
                localStorage.setItem("passwordID", "");
                localStorage.setItem("usernameID", "");
                localStorage.setItem("userID", "");
                localStorage.setItem("fullName", "");
              }}
              className="nav-link text-white d-flex justify-content-between align-items-center"
              to="/"
            >
              <div>
                <i
                  style={{ color: "#0dcaf0" }}
                  className="fa-solid fa-right-to-bracket"
                ></i>
                <span className="ms-2">Đăng xuất</span>
              </div>
            </Link>
          </div>
        </nav>
      </div>

      <div
        className={`flex-grow-1 d-flex flex-column  ${
          isCollapsed ? "active" : ""
        }`}
        id="mainContent"
        onClick={handleClick}
      >
        <div className="title">
          <div
            className="brand menutable"
            id="toggleSidebar"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <i className="fas fa-bars text-2xl"></i>
          </div>
          {title}{" "}
          <div
            style={{ marginRight: "15px" }}
            className="d-flex align-items-center icon-userName"
          >
            <i className="fas fa-user user-iconLayout"></i>
            <span className="user-name">{isfullName}</span>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
