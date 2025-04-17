import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardSection from "./DashboardSection";
import SelectTable from "../CongViecList/select2GridTable";
import DashboardDT from "./DashboardDT";
import KPIChart from "./KPIChart";
import DashboardPie from "./DashboardPie";
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
  const convertRevenue_Total = (rawData) => {
    return [
      {
        title: "Tổng chi phí",
        count: rawData == null ? 0 : rawData.totalExpenses ?? 0,
        icon: "fas fa-tasks",
        bg: "#17A2B8",
        textDark: false,
      },
      {
        title: "Tổng doanh thu",
        count: rawData == null ? 0 : rawData.totalRevenue ?? 0,
        icon: "fas fa-spinner",
        bg: "#28A745",
        textDark: false,
      },
      {
        title: "Lợi nhuận",
        count: rawData == null ? 0 : rawData.profit ?? 0,
        icon: "fas fa-check-circle",
        bg: "#FFC107",
        textDark: true,
      },
    ];
  };
  const convertNghiPhepData = (data) => {
    return [
      {
        title: "Nhân viên nghỉ",
        count: parseInt(data.soLuong) || 0,
        icon: "fas fa-user-times",
        bg: "#FFC107",
        textDark: true,
      },
    ];
  };
  const convertDoanhThu = (data) => {
    return [
      {
        title: "Doanh thu",
        count: parseInt(data.doanhThu) || 0,
        icon: "fa-solid fa-chart-simple",
        bg: "#28a745",
        textDark: false,
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
  const [isPhongBanText, setPhongBanText] = useState("");
  const [isKPI, setKPI] = useState([]);
  const [isCongViec, setCongViec] = useState([]);
  const [isKeToan, setKeToan] = useState([]);
  const [isDuAn, setDuAn] = useState([]);
  const [isNghiPhep, setNgayPhep] = useState([]);
  const [isDoanhThu, setDoanhThu] = useState([]);
  const [isrevenue_Total, setrevenue_Total] = useState([]);
  const [isdeps_RevenueDetail, setdeps_RevenueDetail] = useState([]);
  const [isdep_Detail, setdep_Detail] = useState([]);
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
  const handleTChange = (value) => {
    setPhongBanText(value);
  };
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
      setPhongBanText(data[0].dep_Name);
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
      setKeToan(getTable.fee);
      setDoanhThu(getTable.doanhThu);
    } catch (error) {
      console.error(error.message);
    }
  };
  const getDT = async () => {
    const url = `${process.env.REACT_APP_URL_API}DashBoard/getdt?action=GetDT&para1=${isPhongBanValue}&para2=${dateRange.from}&para3=${dateRange.to}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const getTable = await response.json();
      setrevenue_Total(getTable.revenue_Total);
      setdeps_RevenueDetail(getTable.deps_RevenueDetail);
      setdep_Detail(getTable.dep_Detail);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    if (isPhongBanValue && dateRange) {
      getData();
      getDT();
    }
  }, [isPhongBanValue, dateRange]);
  return (
    <div className="contentItem">
      <div
        className="d-flex justify-content-between align-items-center  mt-1 p-2 div-select"
        style={{
          flexWrap: "wrap",
          gap: "5px",
          position: "fixed",
          width: "100%",
          background: "#fff",
          zIndex: "99",
          top: "50px",
        }}
      >
        <div className="d-flex flex-wrap w-100" style={{ gap: "5px" }}>
          <div className="row  w-100 m-0 p-0" style={{}}>
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1  col_search ItemCV ItemCVPD">
              <label>Phòng ban </label>{" "}
              <SelectTable
                setCheckAll={false}
                dataSelect2={isPhongBan}
                onPhongBanChange={handlePBChange}
                onChangeText={handleTChange}
                setOnChangeText={true}
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

      <div style={{ marginTop: "75px" }}>
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
            sectionTitle="Lợi nhuận tổng công cty"
            items={convertRevenue_Total(isrevenue_Total)}
          />
          <div
            className="col-12 dashboard"
            style={{
              padding: "2px 10px",
              marginBottom: "10px",
              borderRadius: "0",
            }}
          >
            <div className="row">
              {/* <DashboardDT
                sectionTitle="Doanh thu"
                items={convertDoanhThu(isDoanhThu)}
              /> */}
              <DashboardDT
                sectionTitle="Nghỉ Phép"
                items={convertNghiPhepData(isNghiPhep)}
              />
            </div>
          </div>

          <DashboardPie dataKT={isKeToan} dataDepDT={isdeps_RevenueDetail} />
          <KPIChart
            setTextPB={isPhongBanText}
            data={isKPI}
            dataDepDetail={isdep_Detail}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
