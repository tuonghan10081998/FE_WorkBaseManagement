import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TitleContext } from "../components/TitleContext";
import { Modal, Button } from "react-bootstrap";
import Createleave from "./CreateLeave";
import SelectTable from "../CongViecList/select2GridTable";
import LeaveCart from "./LeaveCart";
import Select2NhanVien from "../CongViecList/select2NhanVien";
import DateRangePicker from "../Date/DateRangePicker";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";

import "./Leave.css";
import $ from "jquery";
import moment from "moment";

const Leave = () => {
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const [isFullName, setFullName] = useState(localStorage.getItem("fullName"));
  const navigate = useNavigate();

  useEffect(() => {
    !isIDLogin && navigate("/");
  }, [isIDLogin]);
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const [isDepCode, setDepCode] = useState("");
  const [isPQDuyen, setPQDuyen] = useState(false);
  const [isDataPD, setDataPD] = useState([]);
  const [isRole, setRole] = useState("");
  const [isdataF, setDataF] = useState([]);
  const [isopera, setopera] = useState(true);
  const [isLeader, setLeader] = useState("");
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

  const [show, setShow] = useState(false);
  const [isIDData, setIDDate] = useState(null);
  const { setTitle, setIcon, setIconAdd } = useContext(TitleContext);
  const [data, setData] = useState([]);
  const [isdataFilter, setdataFilter] = useState([]);
  const [isWorkItem, setWorkItem] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: moment().startOf("month").format("YYYY-MM-DD"), // Ngày đầu tháng
    to: moment().endOf("month").format("YYYY-MM-DD"), // Ngày cuối tháng
  });

  const [isIDDelete, setIDDelete] = useState(null);
  const [isPhongBan, setPhongBan] = useState(null);
  const [isPhongBanValue, setPhongBanValue] = useState("All");
  const [IsNhanVienValue, setNhanVienValue] = useState("");
  const [IsNhanVien, setNhanVien] = useState("");
  const [isCheckAdd, setCheckAdd] = useState(false);
  const [showPopup, setshowPopup] = useState(false);
  const [isEdit, setEdit] = useState("");
  const [isDataNV, setDataNV] = useState([]);

  useEffect(() => {
    setTitle(`Danh sách nghỉ phép `);
    setIcon(<i class="fa-duotone fa-solid fa-briefcase"></i>);
    setIconAdd();
  }, [setTitle, setIcon]);

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
      const depCodeJoin = data.map((x) => x.dep_Code).join(",");
      const depCodeArray = depCodeJoin.split(",");
      setDepCode(depCodeArray);
    } catch (error) {
      console.error(error.message);
    }
  };

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
    getData();
  }, [isCheckAdd, dateRange]);
  const getData = async () => {
    const url = `${process.env.REACT_APP_URL_API}Leave/Get?action=get&Para1=${dateRange.from}&Para2=${dateRange.to}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const getTable = await response.json();
      setData(getTable);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    var filteredData = data;
    if (isRole === "") return;
    isRole === "Member" &&
      (filteredData = data.filter((x) => x.idRequester?.includes(isUser)));

    isRole === "Leader" &&
      (filteredData = data.filter((x) => isDepCode?.includes(x.dep_Code)));

    if (isPhongBanValue != "All")
      filteredData = filteredData.filter((x) =>
        x.dep_Code?.includes(isPhongBanValue)
      );

    if (IsNhanVienValue != "All")
      filteredData = filteredData.filter((x) =>
        x.idRequester?.includes(IsNhanVienValue)
      );

    setDataF(filteredData);
    setdataFilter(filteredData);
  }, [data, isRole]);

  useEffect(() => {
    let dataPB = isdataF;
    if (isPhongBanValue != "All")
      dataPB = dataPB.filter((x) => x.dep_Code?.includes(isPhongBanValue));

    if (IsNhanVienValue != "All")
      dataPB = dataPB.filter((x) => x.idRequester?.includes(IsNhanVienValue));

    setdataFilter(dataPB);
  }, [IsNhanVienValue, isPhongBanValue, isdataF]);
  const handleDateChange = async (from, to) => {
    await setDateRange({ from, to });
  };
  const handlePBChange = async (value) => {
    setPhongBanValue(value);
  };
  const handleNVChange = async (value) => {
    setNhanVienValue(value);
  };
  const handleClose = () => {
    setshowPopup(!showPopup);
  };
  const handleSetting = (leave) => {
    setEdit(leave.action);
    const dataEdit = isdataF.filter((x) => x.id == leave.id);
    setshowPopup(!showPopup);
    setWorkItem(dataEdit);
  };
  useEffect(() => {
    const dataDelele = isdataF.filter((x) => x.id != isIDDelete);
    setdataFilter(dataDelele);
    setData(dataDelele);
  }, [isIDDelete]);
  return (
    <div>
      {/* <div className="addtask addtaskleave d-flex">
        Thêm
        <button
          onClick={() => {
            setshowPopup(!showPopup);
            setEdit("0");
            setWorkItem([]);
          }}
          className={` toggle-btn  ${showPopup ? "active" : ""} `}
          id="toggle-btn"
        >
          <span>+</span>
        </button>
      </div> */}
      <div
        className="d-flex justify-content-between align-items-center  mt-1 p-2 div-select"
        style={{ flexWrap: "wrap", gap: "5px" }}
      >
        <div className="d-flex flex-wrap w-100" style={{ gap: "5px" }}>
          <div className="row  w-100 m-0 p-0" style={{}}>
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0  col_search ItemCV">
              <label>Thời gian </label>{" "}
              <DateRangePicker onDateChange={handleDateChange} />
            </div>
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1  col_search ItemCV ItemCVPD">
              <label>Chọn phòng ban </label>{" "}
              <SelectTable
                dataSelect2={isPhongBan}
                onPhongBanChange={handlePBChange}
              />
            </div>
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1  col_search ItemCV ItemCVPD">
              <label>Nhân viên</label>{" "}
              {IsNhanVien && (
                <Select2NhanVien
                  dataSelect2NV={IsNhanVien}
                  onNhanVienChange={handleNVChange}
                />
              )}
            </div>

            <div className="col-6 col-md-6 col-lg-3 col-xl-6 m-0 px-1  col_search ItemCV itemadd">
              <button
                style={{ marginTop: "25px" }}
                onClick={() => {
                  setshowPopup(!showPopup);
                  setEdit("0");
                  setWorkItem([]);
                }}
                class="btn btn-primary mr-2"
              >
                <i class="fas fa-plus"></i> Tạo phiếu nghỉ
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`item-tab`}>
        <div className="row m-0 p-0" id="taskColumns">
          <LeaveCart
            handleSetting={handleSetting}
            status={0}
            setPQDuyen={isRole}
            tasks={isdataFilter.filter((task) => task.status == 0)}
            setIDDeleteColumn={setIDDelete}
            setCheckAdd={setCheckAdd}
          />
          <LeaveCart
            handleSetting={handleSetting}
            status={1}
            setPQDuyen={isRole}
            tasks={isdataFilter.filter((task) => task.status == 1)}
            setIDDeleteColumn={setIDDelete}
            setCheckAdd={setCheckAdd}
          />
          <LeaveCart
            handleSetting={handleSetting}
            status={2}
            setPQDuyen={isRole}
            tasks={isdataFilter.filter((task) => task.status == 2)}
            setIDDeleteColumn={setIDDelete}
            setCheckAdd={setCheckAdd}
          />
        </div>
      </div>
      <>
        {showPopup && (
          <div className="modal-backdrop fade show"></div> // Thêm lớp backdrop khi modal mở
        )}
        <div
          className={`modal ${showPopup ? "d-block" : "d-none"}`} // Điều khiển modal mở hay đóng
          tabIndex={-1}
          role="dialog"
          id="customModal"
          aria-labelledby="popupModalHeader"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div style={{ padding: "10px 20px" }} className="modal-header">
                <h5 className="modal-title" id="popupModalHeader">
                  {isEdit === "0"
                    ? "Tạo phiếu"
                    : isEdit === "1"
                    ? "Duyệt phiếu"
                    : "Sửa phiếu"}
                </h5>
                <button
                  onClick={() => setshowPopup(false)}
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body cardleave" style={{ padding: "2px" }}>
                <Createleave
                  setshowPopup={setshowPopup}
                  setCheckAdd={setCheckAdd}
                  setdataFilter={isWorkItem}
                  setEdit={isEdit}
                  setFullName={isFullName}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};
export default Leave;
