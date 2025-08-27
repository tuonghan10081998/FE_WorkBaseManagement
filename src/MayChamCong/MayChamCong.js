import React, { useState, useContext, useEffect } from "react";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
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
  const [isDataF, setDataF] = useState([]);
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
  useEffect(() => {
    let dataFilter = isData;
    if (setNhanVien && selectedNV?.value !== "all") {
      dataFilter = isData.filter((x) => x.maNV === selectedNV.value.toString());
    }
    console.log(dataFilter);
    setDataF(dataFilter);
  }, [isData, selectedNV]);
  const exportExcel = () => {
    const header = ["Tên nhân viên", "Ngày làm việc", "Giờ vào", "Giờ ra"];
    const rows = isDataF.map((x) => [x.name, x.date, x.checkIn, x.checkOut]);

    const worksheet = XLSX.utils.aoa_to_sheet([]); // khởi tạo sheet rỗng

    // Thêm title
    XLSX.utils.sheet_add_aoa(worksheet, [["Danh sách chấm công"]], {
      origin: "A1",
    });

    // Rồi mới merge A1:D1
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
    ];

    // 2. Thêm header vào A3
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: "A3" });

    // 3. Thêm dữ liệu bắt đầu từ A3
    XLSX.utils.sheet_add_aoa(worksheet, rows, { origin: "A4" });

    // Auto width
    worksheet["!cols"] = header.map((h, i) => {
      const maxLen = Math.max(
        h.length,
        ...rows.map((r) => (r[i] ? r[i].toString().length : 0))
      );
      return { wch: maxLen + 2 };
    });

    const lastRow = rows.length + 3;
    const lastCol = header.length - 1; // cột cuối (D = 3)

    for (let R = 0; R < lastRow; ++R) {
      for (let C = 0; C <= lastCol; ++C) {
        const addr = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[addr]) continue;

        worksheet[addr].s = {
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
          alignment: { horizontal: "center", vertical: "center" },
          font:
            R === 0
              ? { bold: true, sz: 14 } // title
              : R === 2
              ? { bold: true, color: { rgb: "ffffff" } } // header
              : { sz: 12 },
          fill: R === 2 ? { fgColor: { rgb: "808080" } } : undefined,
        };
      }
    }
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          `Ngày: ${moment(dateRange.from, "YYYY/MM/DD").format(
            "DD/MM/YYYYY"
          )} -- ${moment(dateRange.to, "YYYY/MM/DD").format("DD/MM/YYYYY")}`,
        ],
      ],
      { origin: "A2" }
    );

    // sau khi thêm A2, chỉnh style riêng
    const addr = "A2";
    if (worksheet[addr]) {
      worksheet[addr].s = {
        alignment: { horizontal: "left", vertical: "center" },
        font: { italic: false, sz: 12 }, // tuỳ thích
      };
    }
    for (let C = 0; C <= 3; C++) {
      const addr = XLSX.utils.encode_cell({ r: 0, c: C });
      worksheet[addr] = worksheet[addr] || { v: "" }; // nếu ô chưa tồn tại thì tạo rỗng

      worksheet[addr].s = {
        ...(worksheet[addr].s || {}), // giữ style cũ
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
        alignment: { horizontal: "center", vertical: "center" },
        font: { bold: true, sz: 14 },
      };
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "BangCong.xlsx");
  };
  return (
    <div className="contentItem">
      <div
        className="d-flex justify-content-between align-items-center  mt-1 p-2 div-select"
        style={{ flexWrap: "wrap", gap: "5px" }}
      >
        <div className="d-flex flex-wrap w-100" style={{ gap: "5px" }}>
          <div className="row  w-100 m-0 p-0" style={{}}>
            <div className="col-5 col-md-5 col-lg-3 col-xl-2 m-0  col_search ItemCV">
              <label>Thời gian </label>{" "}
              <DateRangePicker
                onDateChange={handleDateChange}
                setCheckALl={true}
                setCheckVal={false}
              />
            </div>
            <div className="col-5 col-md-5 col-lg-3 col-xl-2 m-0 px-1  ">
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
            <div className="col-2 col-md-2 col-lg-6 col-xl-8 m-0 px-1">
              <div
                className="d-flex justify-content-end align-items-center mt-2"
                style={{ marginTop: "15px" }}
              >
                <button
                  type="button"
                  className="btn btn-primary btn-export d-flex align-items-center px-2 py-1"
                  style={{ height: "33px", marginTop: "17px" }}
                  onClick={exportExcel}
                >
                  <i className="fas fa-file-export me-2"></i>
                  Excel
                </button>
              </div>
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
        <GridMayChamCong data={isDataF} setNhanVien={selectedNV} />
      </div>
    </div>
  );
};
export default MayChamCong;
