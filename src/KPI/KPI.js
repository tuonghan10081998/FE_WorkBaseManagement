import React, { useState, useEffect, useContext } from "react";
import KPIFullMonth from "./KPIFullMonth";
import KPIMonth from "./KPIMonth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import SelectTable from "../CongViecList/select2GridTable";
import { TitleContext } from "../components/TitleContext";
import Select2NV from "../CongViecList/select2NhanVien";

const isData = [
  {
    id: 1,
    userID: "A001",
    fullname: "Nguyễn Văn A",
    dep_Name: "Kinh Doanh",
    year: 2023,
    month1: "75/90",
    month2: "80/90",
    month3: "85/90",
    month4: "90/90",
    month5: "70/80",
    month6: "85/90",
    month7: "90/90",
    month8: "80/90",
    month9: "88/90",
    month10: "85/90",
    month11: "95/90",
    month12: "88/90",
  },
  {
    id: 2,
    userID: "A002",
    fullname: "Trần Thị B",
    dep_Name: "Nhân Sự",
    year: 2023,
    month1: "70/80",
    month2: "75/80",
    month3: "80/85",
    month4: "85/90",
    month5: "65/75",
    month6: "78/80",
    month7: "80/85",
    month8: "75/80",
    month9: "82/85",
    month10: "70/80",
    month11: "85/90",
    month12: "75/80",
  },
];
const isDataMonth = [
  {
    id: 1,
    fullname: "Nguyễn Văn A",
    dep_Name: "Kinh Doanh",
    target: "90",
    achieved: "75",
  },
  {
    id: 2,
    fullname: "Trần Thị B",
    dep_Name: "Nhân Sự",
    target: "80",
    achieved: "70",
  },
  {
    id: 3,
    fullname: "Lê Minh C",
    dep_Name: "Marketing",
    target: "100",
    achieved: "95",
  },
  {
    id: 4,
    fullname: "Phạm Thị D",
    dep_Name: "Kinh Doanh",
    target: "85",
    achieved: "80",
  },
  {
    id: 5,
    fullname: "Vũ Hoàng E",
    dep_Name: "Kế Toán",
    target: "95",
    achieved: "90",
  },
  {
    id: 6,
    fullname: "Ngô Minh F",
    dep_Name: "Nhân Sự",
    target: "88",
    achieved: "85",
  },
  {
    id: 7,
    fullname: "Bùi Thị G",
    dep_Name: "Marketing",
    target: "92",
    achieved: "90",
  },
  {
    id: 8,
    fullname: "Đặng Hoàng H",
    dep_Name: "Kinh Doanh",
    target: "80",
    achieved: "70",
  },
  {
    id: 9,
    fullname: "Lê Thị I",
    dep_Name: "Kế Toán",
    target: "100",
    achieved: "98",
  },
  {
    id: 10,
    fullname: "Trần Minh J",
    dep_Name: "Marketing",
    target: "95",
    achieved: "93",
  },
  {
    id: 11,
    fullname: "Nguyễn Văn K",
    dep_Name: "Kinh Doanh",
    target: "100",
    achieved: "20",
  },
];
const KPI = () => {
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const [isFullName, setFullName] = useState(localStorage.getItem("fullName"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!isIDLogin) {
      navigate("/");
    }
  }, [isIDLogin, navigate]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const [isPhongBan, setPhongBan] = useState(null);
  const [isPhongBanValue, setPhongBanValue] = useState("All");
  const { setTitle, setIcon, setIconAdd } = useContext(TitleContext);
  const [IsNhanVienValue, setNhanVienValue] = useState("");
  const [isNhanVien, setNhanVien] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showPopup, setshowPopup] = useState(false);
  const [isDataNV, setDataNV] = useState([]);
  const [isTab, setTab] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

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

  const startYear = 2022;
  const years = [];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }
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
      isIDLogin != "VNManh" &&
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
  useEffect(() => {
    getPhongBan();
  }, []);
  const getPhongBan = async () => {
    var url = `${process.env.REACT_APP_URL_API}Department/Get?action=get`;
    isIDLogin != "VNManh" &&
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
            Theo năm
          </div>
          <div
            onClick={() => setTab(true)}
            className={`item-table ${isTab ? "active" : ""}`}
          >
            {" "}
            <i class="fa-solid fa-table"></i>
            Theo tháng
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
              <label>Chọn năm </label>{" "}
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
              className={`col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1 col_search ItemCV item-tab ${
                !isTab ? "active" : ""
              }`}
            >
              <label>Chọn tháng </label>{" "}
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
          </div>
        </div>
      </div>
      <div className={`item-tab ${isTab ? "active" : ""}`}>
        <KPIFullMonth setData={isData} />
      </div>
      <div className={`item-tab ${!isTab ? "active" : ""}`}>
        {" "}
        <KPIMonth setDataMonth={isDataMonth} />
      </div>
    </div>
  );
};

export default KPI;
