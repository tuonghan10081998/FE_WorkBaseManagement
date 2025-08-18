import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TitleContext } from "../components/TitleContext";
import { Modal, Button } from "react-bootstrap";
import GridMayChamCong from "./GridMayChamCong";
import DateRangePicker from "../Date/DateRangePicker";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import moment from "moment";
import Select from "react-select";
const MayChamCong = () => {
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const [isFullName, setFullName] = useState(localStorage.getItem("fullName"));
  const navigate = useNavigate();

  useEffect(() => {
    !isIDLogin && navigate("/");
  }, [isIDLogin]);
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const [isPQDuyen, setPQDuyen] = useState(false);
  const [isData, setData] = useState([]);
  const [isNhanVien, setNhanVien] = useState([]);
  const [isRole, setRole] = useState("");
  const { setTitle, setIcon, setIconAdd } = useContext(TitleContext);
  const [selectedNV, setSelectedNV] = useState(null);
  const handleDateChange = async (from, to) => {
    await setDateRange({ from, to });
  };
  const [dateRange, setDateRange] = useState({
    from: moment().format("YYYY-MM-DD"), // Ngày đầu tháng
    to: moment().format("YYYY-MM-DD"), // Ngày cuối tháng
  });

  useEffect(() => {
    setTitle(`Danh sách chấm công `);
    setIcon(<i class="fa-duotone fa-solid fa-briefcase"></i>);
    setIconAdd();
  }, [setTitle, setIcon]);
  const getData = async () => {
    const url = `${process.env.REACT_APP_URL_API}MCC/GetData?fromdate=${dateRange.from}&todate=${dateRange.to}`;
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
  const GetNV = async () => {
    const url = `${process.env.REACT_APP_URL_API}MCC/GetEmployee`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const Table = await response.json();
      let formattedOptions = Table.map((x) => ({
        value: x.maNV,
        label: x.name,
      }));

      formattedOptions = [
        { value: "all", label: "Tất cả" },
        ...formattedOptions,
      ];
      console.log(formattedOptions);
      setNhanVien(formattedOptions);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getData();
  }, [dateRange]);
  useEffect(() => {
    GetNV();
  }, []);
  const OnChangeNV = (selectedOption) => {
    setSelectedNV(selectedOption);
  };
  useEffect(() => {
    if (isNhanVien.length > 0 && !selectedNV) {
      setSelectedNV(isNhanVien[0]);
    }
  }, [isNhanVien, selectedNV]);
  useEffect(() => {
    if (isNhanVien.length > 0) {
      setSelectedNV(isNhanVien[0]);
    } else {
      setSelectedNV(null);
    }
  }, [isNhanVien]);
  return (
    <div className="contentItem">
      <div
        className="d-flex justify-content-between align-items-center  mt-1 p-2 div-select"
        style={{ flexWrap: "wrap", gap: "5px" }}
      >
        <div className="d-flex flex-wrap w-100" style={{ gap: "5px" }}>
          <div className="row  w-100 m-0 p-0" style={{}}>
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0  col_search ItemCV">
              <label>Thời gian </label>{" "}
              <DateRangePicker
                onDateChange={handleDateChange}
                setCheckALl={true}
                setCheckVal={false}
              />
            </div>
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1  ">
              <label
                className=""
                style={{ marginBottom: "5px", fontWeight: "bold" }}
              >
                Nhân viên
              </label>{" "}
              <Select
                options={isNhanVien}
                value={selectedNV}
                onChange={OnChangeNV}
                placeholder="Tất cả"
                isSearchable
              />
            </div>
            {/* 
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
                <i class="fas fa-plus"></i> Tạo phiếu
              </button>
            </div> */}
          </div>
        </div>
      </div>
      <div className={`item-tab`}>
        <GridMayChamCong data={isData} setNhanVien={selectedNV} />
      </div>
    </div>
  );
};
export default MayChamCong;
