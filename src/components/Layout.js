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
          <img src="/img/logoNTB.png" className="img" />
          <span style={{ whiteSpace: "nowrap" }} className="ms-2">
            Nam Thanh Bình
          </span>
        </div>
        <nav className="nav flex-column">
          <div className="nav-item">
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
          </div>

          <div className="nav-item">
            <Link
              className="nav-link text-white d-flex justify-content-between align-items-center"
              to="/layout/project"
            >
              <div>
                <i className="fas fa-fire text-lg"></i>
                <span className="ms-2">Danh sách dự án</span>
              </div>
            </Link>
          </div>
          <div className="nav-item">
            <Link
              className="nav-link text-white d-flex justify-content-between align-items-center"
              to="/layout/KPI"
            >
              <div>
                <i className="fas fa-fire text-lg"></i>
                <span className="ms-2">KPI</span>
              </div>
            </Link>
          </div>

          <div className="nav-item">
            <Link
              className="nav-link text-white d-flex justify-content-between align-items-center"
              to="/layout/listcongviec"
            >
              <div>
                <i className="fas fa-photo-video text-lg"></i>
                <span className="ms-2">Danh sách công việc</span>
              </div>
            </Link>
          </div>

          <div className="nav-item">
            <Link
              className="nav-link text-white d-flex justify-content-between align-items-center"
              to="/layout/listleave"
            >
              <div>
                <i className="fas fa-fire text-lg"></i>
                <span className="ms-2">Danh sách nghỉ phép</span>
              </div>
            </Link>
          </div>

          {isIDLogin.toLowerCase() == "admin" && (
            <div className="nav-item">
              <Link
                className="nav-link text-white d-flex justify-content-between align-items-center"
                to="/layout/phanquyen"
              >
                <div>
                  <i className="fas fa-history text-lg"></i>
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
                <i className="fas fa-clock text-lg"></i>
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
          <div class="d-flex align-items-center icon-userName">
            <i class="fas fa-user user-iconLayout"></i>
            <span class="user-name">{isfullName}</span>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
