import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskColumn from "./TaskColumn";
import { TitleContext } from "../components/TitleContext";
import AddTask from "../components/AddTask";
import SelectTable from "./select2GridTable";
import GridWork from "../CongViecList/GridCV";
import DateRangePicker from "../Date/DateRangePicker";
import ButtonDelete from "../ButtonDelete/ButtonDelete";
import Select2Ticket from "./select2Ticket";
import Select2NV from "./select2NhanVien";
import "../CongViecList/ListCV.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "../ButtonDelete/ButtoonDelete.css";
import $ from "jquery";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";
const ListCV = () => {
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const navigate = useNavigate();
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const [isPhongBanValue, setPhongBanValue] = useState("All");
  const [isDepCode, setDepCode] = useState("");
  const [isPQDuyen, setPQDuyen] = useState(false);

  const [dateRange, setDateRange] = useState({
    from: moment().startOf("month").format("YYYY-MM-DD"), // Ngày đầu tháng
    to: moment().endOf("month").format("YYYY-MM-DD"), // Ngày cuối tháng
  });
  useEffect(() => {
    !isUser && navigate("/");
  }, [isUser]);
  const [isDataNV, setDataNV] = useState([]);
  const [isDataNVTT, setDataNVTT] = useState([]);
  const [data, setData] = useState([]);
  const [isdataF, setDataF] = useState([]);
  const [isdataFilter, setdataFilter] = useState([]);
  const { setTitle, setIcon, setIconAdd } = useContext(TitleContext);
  const [showPopup, setShowPopup] = useState(false);
  const [isCheckAdd, setCheckAdd] = useState(false);
  const [isTab, setTab] = useState(false);
  const [isDataGridTable, DataGridTable] = useState([]);
  const [isWorkItem, setWorkItem] = useState([]);
  const [isClickCard, setClickCardID] = useState(null);
  const [isPhongBan, setPhongBan] = useState(null);

  const [isNhanVien, setNhanVien] = useState([]);
  const [IsQuaTrinh, setQuaTrinh] = useState("0");
  const [IsDuAn, setDuAn] = useState("");
  const [IsClickCTH, setClickCTH] = useState(false);
  const [IsClickTH, setClickTH] = useState(false);
  const [IsClickHT, setClickHT] = useState(false);
  const [IsClickQH, setClickQH] = useState(false);
  const [IsDelete, setDelete] = useState(null);
  const [isEdit, setEdit] = useState("");
  const [isNhanVienValue, setNhanVienValue] = useState("All");
  const [isTicketValue, setTicketValue] = useState("All");
  const [isTicket, setTicket] = useState([]);

  const [isRole, setRole] = useState("");
  const [isopera, setopera] = useState(true);
  const [isLeader, setLeader] = useState("");
  const [isUserLeader, setUserLeader] = useState("");

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
      if (currentHighestRole === "UnderLeader") {
        const currentUserID = isUser;
        const checkedUserIDs = data.lstUserLeader
          .filter((x) => x.isChecked === 1)
          .map((x) => x.userID);
        const allUserIDs = [
          currentUserID,
          ...checkedUserIDs.filter((id) => id !== currentUserID),
        ].join(",");

        setUserLeader(allUserIDs);
      }
      currentHighestRole === "Member" && setopera(false);
      setRole(currentHighestRole);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    isUser != "" && getPhanQuyen();
  }, []);

  const handleDateChange = async (from, to) => {
    await setDateRange({ from, to });
  };
  const handlePBChange = async (value) => {
    setPhongBanValue(value);
  };
  const handleNVChange = async (value) => {
    setNhanVienValue(value);
  };
  const onChangeMaTicket = async (value) => {
    setTicketValue(value);
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
      setDataNVTT(staffData);

      isRole !== "Administrator" &&
        isRole !== "Leader" &&
        (filteredData = staffData.filter((x) => x.userID == isUser));

      isRole === "Leader" &&
        (filteredData = staffData.filter((x) => isLeader.includes(x.dep_Code)));

      isRole === "UnderLeader" &&
        (filteredData = staffData.filter((x) =>
          isUserLeader.includes(x.userID)
        ));
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

  const funTitle = () => {
    setTitle(`Danh sách công việc`);
    setIcon(<i className="fa-duotone fa-solid fa-briefcase"></i>);
    setIconAdd();
  };

  useEffect(() => {
    funTitle();
  }, [setTitle, setIcon]);
  useEffect(() => {
    if (!showPopup) funTitle();
  }, [showPopup]);
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
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    isRole != "" && getPhongBan();
  }, [isRole]);
  const getData = async () => {
    const url = `${process.env.REACT_APP_URL_API}Work/Get?action=Get&para1=${dateRange.from}&para2=${dateRange.to}`;
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
    getData();
  }, [isCheckAdd, dateRange]);
  useEffect(() => {
    let filteredData = data;
    if (isRole === "") return;
    if (isRole === "Member") {
      filteredData = filteredData.filter(
        (x) =>
          x.idImplementer?.includes(isUser) ||
          x.idRequester === isUser ||
          x.idResponsible === isUser
      );
    }
    if (isRole === "UnderLeader") {
      let exactCodes = isUserLeader.split(",");
      filteredData = filteredData.filter(
        (x) =>
          exactCodes.includes(x.idImplementer) ||
          exactCodes.includes(x.idRequester) ||
          exactCodes.includes(x.idResponsible)
      );
    }

    if (isRole === "Leader") {
      let exactCodes = isLeader.split(",");
      filteredData = filteredData.filter((x) =>
        exactCodes.includes(x.dep_Code)
      );
    }
    if (isPhongBanValue != "All")
      filteredData = filteredData.filter((x) =>
        x.dep_Code?.includes(isPhongBanValue)
      );
    if (isTicketValue != "All")
      filteredData = filteredData.filter((x) =>
        x.ticket?.includes(isTicketValue)
      );

    if (IsQuaTrinh != 0)
      filteredData = filteredData.filter((x) => x.status == IsQuaTrinh);

    if (isNhanVienValue !== "All")
      filteredData = filteredData.filter(
        (x) =>
          x.idImplementer?.includes(isNhanVienValue) ||
          x.idRequester?.includes(isNhanVienValue) ||
          x.idResponsible?.includes(isNhanVienValue)
      );
    filteredData = filteredData?.filter((x) =>
      x.workName.toLowerCase().includes(IsDuAn.toLowerCase())
    );
    setdataFilter(filteredData);
    setDataF(filteredData);
  }, [data, isRole]);
  useEffect(() => {
    let ticketFilter = isdataF;
    if (isPhongBanValue != "All") {
      ticketFilter = ticketFilter.filter((x) => x.dep_Code == isPhongBanValue);
    }
    const dataticket = Array.from(
      new Map(
        ticketFilter.map((item) => [
          `${item.ticket}`,
          {
            ticket: item.ticket,
          },
        ])
      ).values()
    );
    setTicket(dataticket);
  }, [isPhongBanValue, isdataF]);

  const handleAdd = () => {
    setTitle(` Thêm công việc mới`);
    setIcon(<i className="fa-solid fa-plus icontitle"></i>);
    !showPopup && setWorkItem([]);
    setShowPopup(!showPopup);
  };
  useEffect(() => {
    if (isClickCard && data?.length > 0) {
      let dataAddTask = data.filter((x) => x.id == isClickCard);
      setWorkItem(dataAddTask);
      setShowPopup(!showPopup);
    }
  }, [IsClickCTH, IsClickTH, IsClickHT, IsClickQH]);

  useEffect(() => {
    let dataPB = isdataF;
    let quatrinh = IsQuaTrinh;
    const valueDuan = IsDuAn;
    if (isPhongBanValue != "All")
      dataPB = dataPB.filter((x) => x.dep_Code?.includes(isPhongBanValue));

    if (isTicketValue != "All")
      dataPB = dataPB.filter((x) => x.ticket?.includes(isTicketValue));

    if (quatrinh != 0) dataPB = dataPB.filter((x) => x.status == quatrinh);

    if (isNhanVienValue !== "All")
      dataPB = dataPB.filter(
        (x) =>
          x.idImplementer?.includes(isNhanVienValue) ||
          x.idRequester?.includes(isNhanVienValue) ||
          x.idResponsible?.includes(isNhanVienValue)
      );

    dataPB = dataPB.filter((x) =>
      x.workName.toLowerCase().includes(valueDuan.toLowerCase())
    );
    setdataFilter(dataPB);
  }, [
    isPhongBanValue,
    isTicketValue,
    IsQuaTrinh,
    IsDuAn,
    isNhanVienValue,
    isdataF,
  ]);

  useEffect(() => {
    let dataDelete = data.filter((x) => x.id != IsDelete);
    setData(dataDelete);
    setdataFilter(dataDelete);
  }, [IsDelete]);
  const handleSetting = (leave) => {
    setEdit(leave.action);
    const dataEdit = data.filter((x) => x.id == leave.id);

    setShowPopup(!showPopup);
    setWorkItem(dataEdit);
  };
  return (
    <div className="contentItem">
      {/* <div className="addtask addtaskleave d-flex">
        Thêm
        <button
          onClick={handleAdd}
          className={` toggle-btn  ${showPopup ? "active" : ""} `}
          id="toggle-btn"
        >
          <span>+</span>
        </button>
      </div> */}
      {/* <div
        style={{ paddingRight: "17px !important" }}
        className="position-fixed  end-0 p-0 pe-4 topicon"
      >
        {" "}
        <div className="position-relative">
          <button className="btn btn-warning rounded-circle shadow-lg shake">
            <i
              style={{ color: "#fff", fontSize: "18px" }}
              className="fas fa-bell"
            />
          </button>
          <span className="position-absolute  start-100  badge rounded-pill bg-danger custom-badge">
            5
          </span>
        </div>
      </div> */}
      <div className="d-flex">
        <div className="tab-table w-100">
          <div
            onClick={() => setTab(false)}
            className={`item-table ${!isTab ? "active" : ""}`}
          >
            {" "}
            <i class="fa-solid fa-list-ol"></i>
            Danh sách
          </div>
          <div
            onClick={() => setTab(true)}
            className={`item-table ${isTab ? "active" : ""}`}
          >
            {" "}
            <i class="fa-solid fa-table"></i>
            Lưới
          </div>
        </div>
        <div
          style={{ display: "flex", whiteSpace: "nowrap", marginRight: "5px" }}
        >
          {/* {isRole !== "Member" && ( */}
          <>
            <button
              style={{ marginTop: "2px" }}
              onClick={() => {
                setShowPopup(!showPopup);
                setWorkItem([]);
              }}
              className="btn btn-primary mr-2"
            >
              <i className="fas fa-plus"></i> Thêm công việc
            </button>
          </>
          {/* )} */}
        </div>
      </div>
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
              <label>Phòng ban </label>{" "}
              <SelectTable
                dataSelect2={isPhongBan}
                onPhongBanChange={handlePBChange}
              />
            </div>
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1  col_search ItemCV ItemCVPD">
              <label>Mã ticket </label>{" "}
              <Select2Ticket
                dataSelect2={isTicket}
                onChangeMaTicket={onChangeMaTicket}
              />
            </div>
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1 col_search ItemCV">
              <label>Quá trình </label>
              <select
                onChange={(e) => setQuaTrinh(e.currentTarget.value)}
                className="select_uutien selectQuaTrinh"
              >
                <option value="0">Tất cả</option>
                <option value="1">Chưa thực hiện</option>
                <option value="2">Đã thực hiện</option>
                <option value="3">Hoàn thành</option>
                <option value="4">Quá hạn</option>
              </select>
            </div>
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 col_search ItemCV ">
              <label>Công việc </label>{" "}
              <input
                type="text"
                id="projectFilter"
                className="form-control mr-2"
                placeholder=""
                value={IsDuAn}
                onChange={(e) => setDuAn(e.currentTarget.value)}
              />
            </div>
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1  col_search ItemCV ItemCVPD">
              <label>Nhân viên</label>{" "}
              <Select2NV
                dataSelect2NV={isNhanVien}
                onNhanVienChange={handleNVChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={`item-tab ${isTab ? "active" : ""}`}>
        <div className="row m-0 p-0" id="taskColumns">
          <TaskColumn
            handleSetting={handleSetting}
            setIDDelete={setDelete}
            title="Chưa thực hiện"
            status={1}
            setPQDuyen={isRole}
            setCheckAdd={setCheckAdd}
            tasks={isdataFilter.filter((task) => task.status == 1)}
          />
          <TaskColumn
            handleSetting={handleSetting}
            setIDDelete={setDelete}
            title="Đang thực hiện"
            setPQDuyen={isRole}
            status={2}
            setCheckAdd={setCheckAdd}
            tasks={isdataFilter.filter((task) => task.status == 2)}
          />
          <TaskColumn
            handleSetting={handleSetting}
            setIDDelete={setDelete}
            title="Hoàn thành"
            status={3}
            setPQDuyen={isRole}
            setCheckAdd={setCheckAdd}
            tasks={isdataFilter.filter((task) => task.status == 3)}
          />
          <TaskColumn
            handleSetting={handleSetting}
            setIDDelete={setDelete}
            title="Quá hạn"
            status={4}
            setPQDuyen={isRole}
            setCheckAdd={setCheckAdd}
            tasks={isdataFilter.filter((task) => task.status == 4)}
          />
        </div>
      </div>
      <div className={`item-tab ${!isTab ? "active" : ""}`}>
        <GridWork
          setDataGrid={isdataFilter}
          handleSetting={handleSetting}
          setIDDeleteColumn={setDelete}
          setCheckAdd={setCheckAdd}
          setPQDuyen={isRole}
        />
      </div>
      <>
        {showPopup && (
          <div className="modal-backdrop fade show"></div> // Thêm lớp backdrop khi modal mở
        )}
        <div
          className={`modal  ${showPopup ? "d-block" : "d-none"}`} // Điều khiển modal mở hay đóng
          tabIndex={-1}
          role="dialog"
          id="customModal"
          aria-labelledby="popupModalHeader"
        >
          <div
            // style={{ width: "60%", maxWidth: "80%" }}
            className="modal-dialog modal-dialog-centered custom-modal-dialog"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-body cardleave" style={{ padding: "2px" }}>
                <AddTask
                  setShowPopup={setShowPopup}
                  setCheckAdd={setCheckAdd}
                  setDataAddTask={isWorkItem}
                  setEdit={isEdit}
                  setDataNV={isDataNVTT}
                  setRole={isRole}
                  setisUserLeader={isUserLeader}
                />
              </div>
            </div>
          </div>
        </div>
      </>
      {/* <Modal
        show={showPopup}
        //   onHide={handleClose}
        dialogClassName="modal-dialog-centered custom-modal-dialog"
        aria-labelledby="popupModalHeader"
        backdrop="static"
        keyboard={false}
        className="popupModalCreateLeave"
      >
        <Modal.Body>
          
        </Modal.Body>
      </Modal> */}
    </div>
  );
};

export default ListCV;
