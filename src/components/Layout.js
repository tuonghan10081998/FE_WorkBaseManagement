import React, { useState, useEffect, useContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { TitleContext } from "../components/TitleContext";
import "../components/index.css";
import Info from "../Info/Info";
const Layout = () => {
  const IMG_API = process.env.REACT_APP_URL_IMG;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHomeExpanded, setIsHomeExpanded] = useState(false);
  const [isMerketing, setMerketing] = useState(false);
  const [isDashboard, setDashboard] = useState(false);
  const [isSetting, setSetting] = useState(false);
  const { title, icon, iconAdd } = useContext(TitleContext);
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const [isfullName, setfullName] = useState(localStorage.getItem("fullName"));
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const [isPQDuyen, setPQDuyen] = useState(false);
  const [isPagePQ, setPagePQ] = useState(false);
  const [isDB, setDB] = useState(false);
  const [isKT, setKT] = useState(false);
  const [isShowInfo, setShowInfo] = useState(false);
  const [isCheck, setCheck] = useState(false);
  const [isRole, setRole] = useState("");
  const [isAvatar, setAvatar] = useState("");
  const [isSaveInfo, setSaveInfo] = useState(null);
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

      const priorityRoles = data.lstUserRole.map((item) => item.roleID);
      const currentHighestRole =
        priorityRoles.find((roleID) =>
          data.lstUserRole.some(
            (item) => item.roleID === roleID && item.isChecked === 1
          )
        ) || "Member";
      setRole(currentHighestRole);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getPhanQuyen();
    getData();
  }, [isUser, isPQDuyen]);
  const getData = async () => {
    if (isUser == "") return;
    const url = `${process.env.REACT_APP_URL_API}User/Get?action=get&para1=${isUser}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);

      const data = await response.json();
      const d = data[0];
      setAvatar(
        `${IMG_API}${d.avatar?.trim() ? d.avatar : "Default/UserDefault.png"}`
      );
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getData();
  }, [isSaveInfo]);
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
        className={`bg-dark text-white sidebar position-fixed p-3 ${
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
          {/* {isDB && (
            <div className="nav-item">
              <Link
                onClick={handleMenu}
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
          )}{" "} */}
          <div className="nav-item">
            <div
              className="nav-link text-white d-flex justify-content-between align-items-center"
              href="#"
            >
              <div onClick={() => setDashboard(!isDashboard)}>
                <i
                  style={{ color: "#78baeb" }}
                  className="fa-solid fa-gauge"
                ></i>
                <span className="ms-2">Dashboard</span>
              </div>
            </div>
            {isDashboard && (
              <div className={`${!isCollapsed ? "ms-4" : "ms-0"}`}>
                {isDB && (
                  <Link
                    onClick={handleMenu}
                    className="nav-link text-white"
                    to="/layout/Dashboard"
                  >
                    <i
                      style={{ color: "rgb(207 72 249)" }}
                      className="fa-solid fa-desktop"
                    ></i>
                    <span className="ms-2">Tổng quan</span>
                  </Link>
                )}
                <Link
                  onClick={handleMenu}
                  className="nav-link text-white"
                  to="/layout/DashBoardUser"
                >
                  <i
                    style={{ color: "#f3b705" }}
                    className="fa-solid fa-users"
                  ></i>

                  <span className="ms-2">Nhân viên</span>
                </Link>
              </div>
            )}
          </div>
          <div className="nav-item">
            <Link
              onClick={handleMenu}
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
              onClick={handleMenu}
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
              onClick={handleMenu}
              className="nav-link text-white d-flex justify-content-between align-items-center"
              to="/layout/listleave"
            >
              <div>
                <i
                  style={{ color: "#e70000" }}
                  className="fa-solid fa-person-walking-arrow-right"
                ></i>
                <span className="ms-2">Danh sách xin phép</span>
              </div>
            </Link>
          </div>
          <div className="nav-item">
            <Link
              onClick={handleMenu}
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
          {/* <div className="nav-item">
            <div
              className="nav-link text-white d-flex justify-content-between align-items-center"
              href="#"
            >
              <div onClick={() => setIsHomeExpanded(!isHomeExpanded)}>
                <i
                  style={{ color: "rgb(249 237 72)" }}
                  className="fas fa-fire text-lg"
                ></i>
                <span className="ms-2">Thông báo</span>
              </div>
            </div>
            {isHomeExpanded && (
              <div className={`${!isCollapsed ? "ms-4" : "ms-0"}`}>
                <Link
                  onClick={handleMenu}
                  className="nav-link text-white"
                  to="/layout/Setting"
                >
                  <i
                    style={{ color: "rgb(207 72 249)" }}
                    className="fa-solid fa-circle-dollar-to-slot"
                  ></i>
                  <span className="ms-2">Cài đặt </span>
                </Link>
                <Link
                  onClick={handleMenu}
                  className="nav-link text-white"
                  to="/layout/DashBoardUser"
                >
                  <i
                    style={{ color: "#f3b705" }}
                    className="fa-solid fa-comments-dollar"
                  ></i>

                  <span className="ms-2">Xem</span>
                </Link>
              </div>
            )}
          </div> */}
          {isKT && (
            <div className="nav-item">
              <div
                className="nav-link text-white d-flex justify-content-between align-items-center"
                href="#"
              >
                <div onClick={() => setIsHomeExpanded(!isHomeExpanded)}>
                  <i
                    style={{ color: "rgb(249 237 72)" }}
                    className="fas fa-fire text-lg"
                  ></i>
                  <span className="ms-2">Kế toán</span>
                </div>
              </div>
              {isHomeExpanded && (
                <div className={`${!isCollapsed ? "ms-4" : "ms-0"}`}>
                  <Link
                    onClick={handleMenu}
                    className="nav-link text-white"
                    to="/layout/PurChase"
                  >
                    <i
                      style={{ color: "rgb(207 72 249)" }}
                      className="fa-solid fa-circle-dollar-to-slot"
                    ></i>
                    <span className="ms-2">Chi tiêu</span>
                  </Link>
                  <Link
                    onClick={handleMenu}
                    className="nav-link text-white"
                    to="/layout/Revenue"
                  >
                    <i
                      style={{ color: "#f3b705" }}
                      className="fa-solid fa-comments-dollar"
                    ></i>

                    <span className="ms-2">Thu nhập</span>
                  </Link>
                </div>
              )}
            </div>
          )}
          <div className="nav-item">
            <div
              className="nav-link text-white d-flex justify-content-between align-items-center"
              href="#"
            >
              <div onClick={() => setMerketing(!isMerketing)}>
                <i className="fa-solid fa-filter-circle-dollar"></i>
                <i
                  style={{ color: "rgb(196 206 255)" }}
                  class="fa-solid fa-megaphone"
                ></i>
                <span className="ms-2">Dữ liệu marketing</span>
              </div>
            </div>
            {isMerketing && (
              <div className={`${!isCollapsed ? "ms-4" : "ms-0"}`}>
                <Link
                  onClick={handleMenu}
                  className="nav-link text-white"
                  to="/layout/MarketingReport"
                >
                  <i
                    style={{ color: "#f3b705" }}
                    className="fa-solid fa-flag"
                  ></i>

                  <span className="ms-2">Xem</span>
                </Link>
                {isRole === "Administrator" && (
                  <Link
                    onClick={handleMenu}
                    className="nav-link text-white"
                    to="/layout/Marketing"
                  >
                    <i
                      style={{ color: "rgb(205 0 95)" }}
                      className="fa-solid fa-share-from-square"
                    ></i>

                    <span className="ms-2">Chia data</span>
                  </Link>
                )}
              </div>
            )}
          </div>
          {isPagePQ && (
            <div className="nav-item">
              <div
                className="nav-link text-white d-flex justify-content-between align-items-center"
                href="#"
              >
                <div onClick={() => setSetting(!isSetting)}>
                  <i
                    style={{ color: "rgb(249 237 72)" }}
                    className="fa-solid fa-sliders"
                  ></i>
                  <span className="ms-2">Cài đặt</span>
                </div>
              </div>
              {isSetting && (
                <div className={`${!isCollapsed ? "ms-4" : "ms-0"}`}>
                  {isPagePQ && (
                    <Link
                      onClick={handleMenu}
                      className="nav-link text-white"
                      to="/layout/phanquyen"
                    >
                      <i
                        style={{ color: "green" }}
                        className="fa-solid fa-shapes"
                      ></i>
                      <span className="ms-2">Phân quyền</span>
                    </Link>
                  )}
                  <Link
                    onClick={handleMenu}
                    className="nav-link text-white"
                    to="/layout/Setting"
                  >
                    <i
                      style={{ color: "#f3b705" }}
                      className="fa-solid fa-comments-dollar"
                    ></i>

                    <span className="ms-2">Cài đặt Dashboard</span>
                  </Link>
                </div>
              )}
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
        <div
          style={{ position: "fixed", width: "100%", top: "0" }}
          className="title"
        >
          <div
            className="brand menutable"
            id="toggleSidebar"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <i className="fas fa-bars text-2xl"></i>
          </div>
          {title}{" "}
          <div
            onClick={() => {
              setShowInfo(true);
              setCheck(!isCheck);
            }}
            style={{
              marginRight: "15px",
              cursor: "pointer",
              position: "fixed",
              right: 0,
            }}
            className="d-flex align-items-center icon-userName"
          >
            <img
              src={`${isAvatar}?${new Date().getTime()}`}
              alt={`Logo ${isAvatar}`}
              width={45}
              height={40}
              className="rounded-circle"
              style={{
                objectFit: "cover",
                boxShadow: "0 0 6px rgb(0 0 0 / 0.15)",
              }}
              loading="lazy"
            />
            <span className="user-name">{isfullName}</span>
          </div>
        </div>
        <Outlet />
      </div>

      <>
        {isShowInfo && (
          <div className="modal-backdrop fade show"></div> // Thêm lớp backdrop khi modal mở
        )}
        <div
          className={`modal ${isShowInfo ? "d-block" : "d-none"}`} // Điều khiển modal mở hay đóng
          tabIndex={-1}
          role="dialog"
          id="customModal"
          aria-labelledby="popupModalHeader"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div style={{ padding: "10px 20px" }} className="modal-header">
                <h5 className="modal-title" id="popupModalHeader">
                  Thông tin
                </h5>
                <button
                  onClick={() => setShowInfo(false)}
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body cardleave" style={{ padding: "2px" }}>
                <Info
                  setSaveInfo={setSaveInfo}
                  setCheck={isCheck}
                  setShowInfo={setShowInfo}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Layout;
