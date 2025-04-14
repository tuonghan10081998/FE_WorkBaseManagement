import React, { useState, useEffect, useContext } from "react";
import KPIFullMonth from "./KPIFullMonth";
import KPIMonth from "./KPIMonth";
import KPISetting from "./CreateKPI";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import SelectTable from "../CongViecList/select2GridTable";
import { TitleContext } from "../components/TitleContext";
import Select2NV from "../CongViecList/select2NhanVien";
import { Modal, Button } from "react-bootstrap";

const KPI = () => {
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const [isFullName, setFullName] = useState(localStorage.getItem("fullName"));
  const navigate = useNavigate();

  useEffect(() => {
    !isIDLogin && navigate("/");
  }, [isIDLogin]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const [isData, setData] = useState([]);
  const [isDataF, setDataF] = useState([]);
  const [isCheckAddFM, setCheckAddFM] = useState(false);
  const [isCheckAddM, setCheckAddM] = useState(false);
  const [isPhongBan, setPhongBan] = useState(null);
  const [isPhongBanValue, setPhongBanValue] = useState("");
  const { setTitle, setIcon, setIconAdd } = useContext(TitleContext);
  const [IsNhanVienValue, setNhanVienValue] = useState("");
  const [isNhanVien, setNhanVien] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showPopup, setshowPopup] = useState(false);
  const [isDataNV, setDataNV] = useState([]);
  const [isDataNVTT, setDataNVTT] = useState([]);
  const [isTab, setTab] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [isEditNV, setEditNV] = useState("");
  const [isRole, setRole] = useState("");
  const [isopera, setopera] = useState(true);
  const [isLeader, setLeader] = useState("");
  const [isCheckNV, setCheckNV] = useState(false);
  const [isDataMonth, setDataMonth] = useState([]);
  const [isDataMonthF, setDataMonthF] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const handleClickNKPI = (e) => {
    e.preventDefault();
    setTrigger((prev) => !prev); // Mỗi lần click đổi trạng thái
  };
  const getPhanQuyen = async () => {
    const url = `${process.env.REACT_APP_URL_API}User/GetRole?action=GEt&para1=${isUser}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();

      const priorityRoles = data.lstUserRole.map((item) => item.roleID);
      const currentHighestRole =
        priorityRoles.find((roleID) =>
          data.lstUserRole.some(
            (item) => item.roleID === roleID && item.isChecked === 1
          )
        ) || "Member";
      if (currentHighestRole === "Leader") {
        const selectedDepCodes = data.lstUserDep
          .filter((dep) => dep.isChecked === 1) // Lọc những phòng ban được chọn
          .map((dep) => dep.dep_Code) // Lấy mã phòng ban
          .join(",");
        setLeader(selectedDepCodes);
      }
      currentHighestRole === "Member" && setopera(false);
      setRole(currentHighestRole);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getPhanQuyen();
  }, [isUser]);

  useEffect(() => {
    setTitle(`KPI `);
    setIcon(<i class="fa-duotone fa-solid fa-briefcase"></i>);
    setIconAdd();
  }, [setTitle, setIcon]);

  const handlePBChange = (value) => {
    setPhongBanValue(value);
  };

  const handleNVChange = (value) => {
    setNhanVienValue(value);
  };

  const startYear = currentYear - 2;
  const years = [];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  for (let year = startYear; year <= currentYear + 1; year++) {
    years.push(year);
  }
  useEffect(() => {
    isRole != "" && fetchData();
  }, [isRole]);
  const fetchData = async () => {
    const url = `${process.env.REACT_APP_URL_API}User/Get?action=Get`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const staffData = await response.json();
      let filteredData = staffData;
      setDataNVTT(filteredData);
      isRole !== "Administrator" &&
        isRole !== "Leader" &&
        (filteredData = staffData.filter((x) => x.userID == isUser));

      isRole === "Leader" &&
        (filteredData = staffData.filter((x) => isLeader.includes(x.dep_Code)));

      setDataNV(filteredData);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    if (setDataNV?.length > 0) {
      let nhanvien = isDataNV;
      if (isPhongBanValue != "All") {
        nhanvien = nhanvien.filter((x) => x.dep_Code == isPhongBanValue);
      }
      const nhanvienNew = Array.from(
        new Map(
          nhanvien.map((item) => [
            `${item.userID}-${item.fullName}-${item.dep_Code}-${item.dep_Name}`,
            {
              userID: item.userID,
              fullName: item.fullName,
              dep_Code: item.dep_Code,
              dep_Name: item.dep_Name,
            },
          ])
        ).values()
      );
      setNhanVien(nhanvienNew);
    }
  }, [isPhongBanValue, isDataNV]);

  useEffect(() => {
    isRole != "" && getPhongBan();
  }, [isRole]);

  const getPhongBan = async () => {
    var url = `${process.env.REACT_APP_URL_API}Department/Get?action=get`;
    isRole !== "Administrator" &&
      (url = `${process.env.REACT_APP_URL_API}Department/Get?action=GetDept_User&para1=${isUser}`);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      setPhongBan(data);
      setPhongBanValue(data[0].dep_Code);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    console.log(isEditNV);
  }, [isEditNV, isCheckNV]);
  const handleClose = () => {
    setshowPopup(!showPopup);
  };
  const GetResult = async () => {
    const phongbanResult = isPhongBanValue;
    const yearResult = selectedYear;
    const monthResult = selectedMonth;
    if (phongbanResult == "" || selectedYear == "" || selectedMonth == "")
      return;
    var url = `${process.env.REACT_APP_URL_API}KPI/GetResult?action=GetResult&para1=${phongbanResult}&para2=${monthResult}&para3=${yearResult}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      setDataMonth(data);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    var dataF = isDataMonth;
    if (IsNhanVienValue !== "All")
      dataF = dataF.filter((x) => x.userID === IsNhanVienValue);
    setDataMonthF(dataF);
  }, [isDataMonth, IsNhanVienValue]);

  useEffect(() => {
    GetResult();
  }, [isPhongBanValue, selectedYear, selectedMonth, isCheckAddM, isCheckAddFM]);
  const GetTotalSetting = async () => {
    const phongbanResult = isPhongBanValue;
    const yearResult = selectedYear;
    const monthResult = selectedMonth;
    if (phongbanResult == "" || selectedYear == "" || selectedMonth == "")
      return;
    var url = `${process.env.REACT_APP_URL_API}KPI/GetTotalResult?action=GetTotalResult&para1=${phongbanResult}&para2=0&para3=${yearResult}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    var dataF = isData;
    if (IsNhanVienValue !== "All")
      dataF = dataF.filter((x) => x.userID === IsNhanVienValue);
    setDataF(dataF);
  }, [isData, IsNhanVienValue]);
  useEffect(() => {
    GetTotalSetting();
  }, [isPhongBanValue, selectedYear, isCheckAddFM, isCheckAddM]);
  return (
    <div>
      <div>
        <div className="tab-table">
          <div
            onClick={() => setTab(false)}
            className={`item-table ${!isTab ? "active" : ""}`}
          >
            {" "}
            <i class="fa-solid fa-list-ol"></i>
            Tháng
          </div>
          <div
            onClick={() => setTab(true)}
            className={`item-table ${isTab ? "active" : ""}`}
          >
            {" "}
            <i class="fa-solid fa-table"></i>
            Năm
          </div>
        </div>
      </div>

      <div
        className="d-flex justify-content-between align-items-center  mt-1 p-2 div-select"
        style={{ flexWrap: "wrap", gap: "5px" }}
      >
        <div className="d-flex flex-wrap w-100" style={{ gap: "5px" }}>
          <div className="row  w-100 m-0 p-0" style={{}}>
            <div
              className={`${
                !isTab ? "col-6" : "col-6"
              }  col-md-6 col-lg-2 col-xl-2 m-0  col_search ItemCV`}
            >
              <label style={{ whiteSpace: "nowrap" }}>Chọn năm </label>{" "}
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
              className={`col-6 col-md-6 col-lg-2 col-xl-2 m-0 px-1 col_search ItemCV item-tab ${
                isTab ? "active" : ""
              }`}
            >
              <label style={{ whiteSpace: "nowrap" }}>Chọn tháng </label>{" "}
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
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1  col_search ItemCV ItemCVPD">
              <label>Chọn phòng ban </label>{" "}
              <SelectTable
                setCheckAll={false}
                dataSelect2={isPhongBan}
                onPhongBanChange={handlePBChange}
              />
            </div>

            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1  col_search ItemCV ItemCVPD">
              <label>Chọn nhân viên</label>{" "}
              <Select2NV
                dataSelect2NV={isNhanVien}
                onNhanVienChange={handleNVChange}
              />
            </div>
            <div
              className={`${
                !isTab
                  ? "col-12 col-md-12 col-lg-2 col-xl-4"
                  : "col-6 col-md-6 col-lg-4 col-xl-6"
              }  m-0 px-1  col_search ItemCV itemadd`}
            >
              {isRole === "Administrator" && (
                <button
                  onClick={() => setshowPopup(true)}
                  style={{ marginTop: "26px" }}
                  class="btn btn-primary mr-2"
                >
                  <i class="fas fa-plus"></i> Cài đặt KPI
                </button>
              )}
              {isRole !== "Administrator" && (
                <button
                  onClick={(e) => handleClickNKPI(e)}
                  style={{ marginTop: "26px" }}
                  class="btn btn-primary mr-2"
                >
                  <i class="fas fa-plus"></i> Nhập KPI
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={`item-tab ${!isTab ? "active" : ""}`}>
        <KPIFullMonth setData={isDataF} />
      </div>
      <div className={`item-tab ${isTab ? "active" : ""}`}>
        {" "}
        <KPIMonth
          setPQ={isRole}
          setCheckAddM={setCheckAddM}
          setDataMonth={isDataMonthF}
          setTrigger={setTrigger}
          setisTrigger={trigger}
        />
      </div>
      <Modal
        show={showPopup}
        onHide={handleClose}
        dialogClassName="modal-dialog-centered"
        aria-labelledby="popupModalHeader"
        backdrop="static" // Ngăn không cho modal đóng khi click ngoài
        keyboard={false}
        className="popupModalCreateLeave"
      >
        <Modal.Header closeButton>
          <Modal.Title id="popupModalHeader">Cài đặt KPI</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <KPISetting
            setshowPopup={setshowPopup}
            setCheckAddFM={setCheckAddFM}
            setRole={isRole}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default KPI;
