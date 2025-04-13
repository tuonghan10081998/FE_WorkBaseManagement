import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardSection from "./DashboardSection";
import SelectTable from "../CongViecList/select2GridTable";
import KPIChart from "./KPIChart";
import { TitleContext } from "../components/TitleContext";
import DateRangePicker from "../Date/DateRangePicker";
import "./Dashboard.css";
import moment from "moment";

const Dashboard = () => {
  const navigate = useNavigate();
  const convertDataToDashboardItems = (rawData) => {
    return [
      {
        title: "Chưa thực hiện",
        count: rawData == null ? 0 : rawData.notImplement ?? 0,
        icon: "fas fa-tasks",
        bg: "#17A2B8",
        textDark: false,
      },
      {
        title: "Đang thực hiện",
        count: rawData == null ? 0 : rawData.processing ?? 0,
        icon: "fas fa-spinner",
        bg: "#28A745",
        textDark: false,
      },
      {
        title: "Hoàn thành",
        count: rawData == null ? 0 : rawData.completed ?? 0,
        icon: "fas fa-check-circle",
        bg: "#FFC107",
        textDark: true,
      },
      {
        title: "Quá hạn",
        count: rawData == null ? 0 : rawData.overDeadline ?? 0,
        icon: "fas fa-exclamation-circle",
        bg: "#DC3545",
        textDark: false,
      },
    ];
  };
  const convertNghiPhepData = (data) => {
    return [
      {
        title: "Tổng Nhân Viên",
        count: data.soLuong ?? 0,
        icon: "fas fa-users",
        bg: "#17A2B8",
        textDark: false,
      },
      {
        title: "Nhân Viên Nghỉ",
        count: parseInt(data.status) || 0,
        icon: "fas fa-user-times",
        bg: "#FFC107",
        textDark: true,
      },
    ];
  };

  const { setTitle, setIcon, setIconAdd } = useContext(TitleContext);
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const [isRole, setRole] = useState("");
  const [isopera, setopera] = useState(true);
  const [isLeader, setLeader] = useState("");
  const [isPhongBan, setPhongBan] = useState(null);
  const [isPhongBanValue, setPhongBanValue] = useState("");
  const [isKPI, setKPI] = useState([]);
  const [isCongViec, setCongViec] = useState([]);
  const [isDuAn, setDuAn] = useState([]);
  const [isNghiPhep, setNgayPhep] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: moment().startOf("month").format("YYYY-MM-DD"), // Ngày đầu tháng
    to: moment().endOf("month").format("YYYY-MM-DD"), // Ngày cuối tháng
  });
  useEffect(() => {
    !isUser && navigate("/");
  }, [isUser]);
  const funTitle = () => {
    setTitle(`Dashboard`);
    setIcon(<i className="fa-duotone fa-solid fa-briefcase"></i>);
    setIconAdd();
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
    funTitle();
  }, [setTitle, setIcon]);
  const handlePBChange = async (value) => {
    setPhongBanValue(value);
  };
  const handleDateChange = async (from, to) => {
    await setDateRange({ from, to });
  };
  const getData = async () => {
    const url = `${process.env.REACT_APP_URL_API}DashBoard/Get?action=Get&para1=${isPhongBanValue}&para2=${dateRange.from}&para3=${dateRange.to}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const getTable = await response.json();
      setKPI(getTable.kpi);
      setCongViec(getTable.work);
      setDuAn(getTable.task);
      setNgayPhep(getTable.leave);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    isPhongBanValue && dateRange && getData();
  }, [isPhongBanValue, dateRange]);
  return (
    <div>
      <div
        className="d-flex justify-content-between align-items-center  mt-1 p-2 div-select"
        style={{ flexWrap: "wrap", gap: "5px" }}
      >
        <div className="d-flex flex-wrap w-100" style={{ gap: "5px" }}>
          <div className="row  w-100 m-0 p-0" style={{}}>
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1  col_search ItemCV ItemCVPD">
              <label>Chọn phòng ban </label>{" "}
              <SelectTable
                setCheckAll={false}
                dataSelect2={isPhongBan}
                onPhongBanChange={handlePBChange}
              />
            </div>
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0  col_search ItemCV">
              <label>Thời gian </label>{" "}
              <DateRangePicker
                setCheckALl={false}
                onDateChange={handleDateChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light dashboardCard">
        <DashboardSection
          sectionTitle="Công Việc"
          items={convertDataToDashboardItems(isCongViec)}
        />
        <DashboardSection
          sectionTitle="Dự án"
          items={convertDataToDashboardItems(isDuAn)}
        />
        <DashboardSection
          sectionTitle="Nghỉ Phép"
          items={convertNghiPhepData(isNghiPhep)}
        />
        <KPIChart data={isKPI} />
      </div>
    </div>
  );
};

export default Dashboard;
