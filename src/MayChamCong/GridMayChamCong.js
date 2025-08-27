import React, { useState, useEffect, useContext } from "react";
import moment from "moment";

const GridMayChamCong = ({ data }) => {
  const [listData, setListData] = useState([]);
  useEffect(() => {
    setListData(data);
  }, [data]);

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
