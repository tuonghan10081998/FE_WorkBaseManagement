import React, { useState, useContext, useEffect } from "react";
import ProjectColumn from "./ProjectColumn";
import { TitleContext } from "../components/TitleContext";
import CreateProject from "./CreateProject";
import SelectTable from "../CongViecList/select2GridTable";
import GridTask from "./GridProject";
import DateRangePicker from "../Date/DateRangePicker";
import ButtonDelete from "../ButtonDelete/ButtonDelete";
import Select2NV from "../CongViecList/select2NhanVien";
import "../CongViecList/ListCV.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "../ButtonDelete/ButtoonDelete.css";
import $ from "jquery";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";
const ListCV = () => {
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const [isPhongBanValue, setPhongBanValue] = useState("All");
  const [isDepCode, setDepCode] = useState("");
  const [isPQDuyen, setPQDuyen] = useState(false);

  const [dateRange, setDateRange] = useState({
    from: moment().startOf("month").format("YYYY-MM-DD"), // Ngày đầu tháng
    to: moment().endOf("month").format("YYYY-MM-DD"), // Ngày cuối tháng
  });
  const [isDataNV, setDataNV] = useState([]);
  const [isDataNVTT, setDataNVTt] = useState([]);
  const [data, setData] = useState([]);
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

  const getPhanQuyen = async () => {
    const url = `${process.env.REACT_APP_URL_API}User/GetRole?action=GEt&para1=${isUser}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      const dataPQ = data.lstUserRole.filter((x) => x.roleID == 1);
      if (dataPQ[0].isChecked == 1) setPQDuyen(true);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getPhanQuyen();
  }, [isUser, isPQDuyen]);

  const handleDateChange = async (from, to) => {
    await setDateRange({ from, to });
  };
  const handlePBChange = async (value) => {
    setPhongBanValue(value);
  };
  const handleNVChange = async (value) => {
    setNhanVienValue(value);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const url = `${process.env.REACT_APP_URL_API}User/Get?action=Get`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const staffData = await response.json();
      let filteredData = staffData;
      setDataNVTt(staffData);
      isIDLogin.toLowerCase() != "admin" &&
        (filteredData = staffData.filter((x) => x.userID == isUser));

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
    setTitle(`Danh sách dự án`);
    setIcon(<i class="fa-duotone fa-solid fa-briefcase"></i>);
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
    isIDLogin.toLowerCase() != "admin" &&
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
    getPhongBan();
  }, []);
  const getData = async () => {
    // console.log(dateRange.from);
    // console.log(dateRange.to);
    const url = `${process.env.REACT_APP_URL_API}Task/Get?action=GEt&Para1=a&Para2=a`;
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
    if (isIDLogin.toLowerCase() != "admin") {
      filteredData = data.filter((x) => {
        return (
          x.idImplementer?.includes(isUser) ||
          (isPQDuyen && x.idRequester?.includes(isUser))
        );
      });
    }
    setdataFilter(filteredData); // Cập nhật state với mảng đã lọc
  }, [data, isPQDuyen, isIDLogin, isUser]);
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
    let dataPB = data;
    let quatrinh = IsQuaTrinh;
    const valueDuan = IsDuAn;

    if (isPhongBanValue != "All")
      dataPB = dataPB.filter((x) => x.dep_Code?.includes(isPhongBanValue));

    if (isNhanVienValue !== "All")
      dataPB = dataPB.filter(
        (x) =>
          x.idImplementer?.includes(isNhanVienValue) ||
          x.idRequester?.includes(isNhanVienValue)
      );
    if (quatrinh != 0) dataPB = dataPB.filter((x) => x.status == quatrinh);

    dataPB = dataPB.filter((x) =>
      x.taskName?.toLowerCase().includes(valueDuan.toLowerCase())
    );
    setdataFilter(dataPB);
  }, [isPhongBanValue]);
  useEffect(() => {
    let dataPB = data;
    let quatrinh = IsQuaTrinh;
    const valueDuan = IsDuAn;
    if (isPhongBanValue != "All")
      dataPB = dataPB.filter((x) => x.dep_Code?.includes(isPhongBanValue));

    if (isNhanVienValue !== "All")
      dataPB = dataPB.filter(
        (x) =>
          x.idImplementer?.includes(isNhanVienValue) ||
          x.idRequester?.includes(isNhanVienValue)
      );
    if (quatrinh != 0) dataPB = dataPB.filter((x) => x.status == quatrinh);

    if (isNhanVienValue != "All")
      dataPB = dataPB.filter((x) => x.idImplementer?.includes(isNhanVienValue));
    dataPB = dataPB.filter((x) =>
      x.taskName?.toLowerCase().includes(valueDuan.toLowerCase())
    );
    setdataFilter(dataPB);
  }, [IsQuaTrinh]);
  useEffect(() => {
    let dataPB = data;
    let quatrinh = IsQuaTrinh;
    const valueDuan = IsDuAn;
    if (isPhongBanValue != "All")
      dataPB = dataPB.filter((x) => x.dep_Code?.includes(isPhongBanValue));

    if (quatrinh != 0) dataPB = dataPB.filter((x) => x.status == quatrinh);

    if (isNhanVienValue !== "All")
      dataPB = dataPB.filter(
        (x) =>
          x.idImplementer?.includes(isNhanVienValue) ||
          x.idRequester?.includes(isNhanVienValue)
      );

    dataPB = dataPB.filter((x) =>
      x.taskName?.toLowerCase().includes(valueDuan.toLowerCase())
    );
    setdataFilter(dataPB);
  }, [IsDuAn]);

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
  useEffect(() => {
    let dataPB = data;
    let quatrinh = IsQuaTrinh;
    const valueDuan = IsDuAn;
    if (isPhongBanValue != "All")
      dataPB = dataPB.filter((x) => x.dep_Code?.includes(isPhongBanValue));

    if (quatrinh != 0) dataPB = dataPB.filter((x) => x.status == quatrinh);

    if (isNhanVienValue !== "All")
      dataPB = dataPB.filter(
        (x) =>
          x.idImplementer?.includes(isNhanVienValue) ||
          x.idRequester?.includes(isNhanVienValue)
      );
    dataPB = dataPB.filter((x) =>
      x.taskName?.toLowerCase().includes(valueDuan.toLowerCase())
    );
    setdataFilter(dataPB);
  }, [isNhanVienValue]);
  return (
    <div className="">
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
      <div>
        <div className="tab-table">
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
              <label>Chọn phòng ban </label>{" "}
              <SelectTable
                dataSelect2={isPhongBan}
                onPhongBanChange={handlePBChange}
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
              <label>Dự án </label>{" "}
              <input
                type="text"
                id="projectFilter"
                className="form-control mr-2"
                placeholder="Dự án/Quy trình"
                value={IsDuAn}
                onChange={(e) => setDuAn(e.currentTarget.value)}
              />
            </div>
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1  col_search ItemCV ItemCVPD">
              <label>Chọn nhân viên</label>{" "}
              <Select2NV
                dataSelect2NV={isNhanVien}
                onNhanVienChange={handleNVChange}
              />
            </div>
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1  col_search ItemCV itemadd">
              {isPQDuyen && (
                <>
                  {!showPopup && (
                    <button
                      style={{ marginTop: "26px" }}
                      onClick={() => {
                        setShowPopup(!showPopup);
                        setWorkItem([]);
                      }}
                      className="btn btn-primary mr-2"
                    >
                      <i className="fas fa-plus"></i> Add
                    </button>
                  )}
                  {showPopup && (
                    <button
                      style={{ marginTop: "26px" }}
                      onClick={() => setShowPopup(!showPopup)}
                      className="btn btn-danger"
                    >
                      <i className="fas fa-times"></i> Cancel
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={`item-tab ${isTab ? "active" : ""}`}>
        <div className="row m-0 p-0" id="taskColumns">
          <ProjectColumn
            handleSetting={handleSetting}
            setIDDelete={setDelete}
            title="Chưa thực hiện"
            status={1}
            setPQDuyen={isPQDuyen}
            setCheckAdd={setCheckAdd}
            tasks={isdataFilter.filter((task) => task.status == 1)}
          />
          <ProjectColumn
            handleSetting={handleSetting}
            setIDDelete={setDelete}
            title="Đang thực hiện"
            setPQDuyen={isPQDuyen}
            status={2}
            setCheckAdd={setCheckAdd}
            tasks={isdataFilter.filter((task) => task.status == 2)}
          />
          <ProjectColumn
            handleSetting={handleSetting}
            setIDDelete={setDelete}
            title="Hoàn thành"
            status={3}
            setPQDuyen={false}
            setCheckAdd={setCheckAdd}
            tasks={isdataFilter.filter((task) => task.status == 3)}
          />
          <ProjectColumn
            handleSetting={handleSetting}
            setIDDelete={setDelete}
            title="Quá hạn"
            status={4}
            setPQDuyen={isPQDuyen}
            setCheckAdd={setCheckAdd}
            tasks={isdataFilter.filter((task) => task.status == 4)}
          />
        </div>
      </div>
      <div className={`item-tab ${!isTab ? "active" : ""}`}>
        <GridTask
          setDataGrid={isdataFilter}
          handleSetting={handleSetting}
          setIDDeleteColumn={setDelete}
          setCheckAdd={setCheckAdd}
          setPQDuyen={isPQDuyen}
        />
      </div>
      <Modal
        show={showPopup}
        //   onHide={handleClose}
        dialogClassName="modal-dialog-centered custom-modal-dialog"
        aria-labelledby="popupModalHeader"
        backdrop="static"
        keyboard={false}
        className="popupModalCreateLeave"
      >
        <Modal.Body>
          <CreateProject
            setShowPopup={setShowPopup}
            setCheckAdd={setCheckAdd}
            setDataAddTask={isWorkItem}
            setEdit={isEdit}
            setDataNV={isDataNVTT}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ListCV;
