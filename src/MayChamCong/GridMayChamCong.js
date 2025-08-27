import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
const GridMayChamCong = ({ data }) => {
  const [listData, setListData] = useState([]);
  useEffect(() => {
    setListData(data);
  }, [data]);

  const exportExcel = () => {
    const header = ["Tên nhân viên", "Ngày làm việc", "Giờ vào", "Giờ ra"];
    const rows = listData.map((x) => [x.name, x.date, x.checkIn, x.checkOut]);

    const worksheet = XLSX.utils.aoa_to_sheet([]); // khởi tạo sheet rỗng

    // 1. Thêm title vào A1
    XLSX.utils.sheet_add_aoa(worksheet, [["Danh sách chấm công"]], {
      origin: "A1",
    });

    // 2. Thêm header vào A2
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: "A3" });

    // 3. Thêm dữ liệu bắt đầu từ A3
    XLSX.utils.sheet_add_aoa(worksheet, rows, { origin: "A4" });

    // Merge A1:D1
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
    ];

    // Auto width
    worksheet["!cols"] = header.map((h, i) => {
      const maxLen = Math.max(
        h.length,
        ...rows.map((r) => (r[i] ? r[i].toString().length : 0))
      );
      return { wch: maxLen + 2 };
    });

    // Style
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
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
              : R === 1
              ? { bold: true, color: { rgb: "ffffff" } } // header
              : { sz: 12 },
          fill: R === 1 ? { fgColor: { rgb: "808080" } } : undefined,
        };
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bảng công");
    XLSX.writeFile(workbook, "BangCong.xlsx");
  };

  return (
    <div className="py-2 px-2 ">
      {/* <button onClick={exportExcel} className="btn btn-success m-2">
        Xuất Excel
      </button> */}
      <div className="row g-2">
        {/* Danh sách tài khoản */}

        <div className="col-12">
          <div className="card" style={{ height: "50px" }}>
            <div>
              <div
                className="item-table "
                style={{ height: "calc(100vh - 155px)", overflow: "auto" }}
              >
                <table className="task-table table-striped">
                  <thead>
                    <tr className="trthdashboard">
                      <td scope="col">Tên nhân viên</td>
                      <td scope="col">Ngày làm việc</td>
                      <td scope="col">Giờ vào</td>
                      <td scope="col">Giờ ra </td>
                    </tr>
                  </thead>
                  <tbody>
                    {listData?.map((x, index) => {
                      return (
                        <tr key={x.id}>
                          <td style={{ whiteSpace: "nowrap" }}>{x.name}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{x.date}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{x.checkIn}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{x.checkOut}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GridMayChamCong;
