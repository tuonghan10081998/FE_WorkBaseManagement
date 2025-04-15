import React, { useState, useEffect, useContext } from "react";
import KPIDetailResult from "./ResultDetail";
import "./KPI.css";
import "bootstrap/dist/css/bootstrap.min.css";
import KPIResult from "./KPIResult";
import { Modal, Button } from "react-bootstrap";
const KPIMonth = ({
  setDataMonth,
  setPQ,
  setCheckAddM,
  setTrigger,
  setisTrigger,
}) => {
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  // Lưu trữ dữ liệu bảng
  const [sortedEmployees, setSortedEmployees] = useState([]);
  const [showPopup, setshowPopup] = useState(false);
  const [showPopupDetail, setshowPopupDetail] = useState(false);
  const [isIDData, setIDData] = useState("");
  const [isMonth, setMonth] = useState("");
  const [isYear, setYear] = useState("");
  const [isUserID, setUserID] = useState("");
  const [isDetailResult, setDetailSesult] = useState([]);
  const [isFullName, setFullName] = useState([]);
  const [isAddM, setAddM] = useState(false);
  useEffect(() => {
    setCheckAddM((x) => !x);
    setisTrigger && setTrigger((x) => !x);
  }, [isAddM]);
  const handleClose = () => {
    setshowPopup(false);
    setTrigger((x) => !x);
  };
  const handleCloseDetail = () => {
    setshowPopupDetail(false);
  };
  // Sắp xếp dữ liệu khi component được tải
  useEffect(() => {
    setSortedEmployees(setDataMonth);
  }, [setDataMonth]);

  // Xử lý các hành động

  const enterAchievedKPI = (id) => {
    setIDData(id);
    setshowPopup(true);
  };
  const enterXemDetail = (id, year, month, fullName) => {
    setUserID(id);
    setMonth(month);
    setYear(year);
    setFullName(fullName);
    setshowPopupDetail(true);
  };
  const GetDetailResult = async () => {
    var url = `${process.env.REACT_APP_URL_API}KPI/GetResult?action=GetDetailResult&para1=${isUserID}&para2=${isMonth}&para3=${isYear}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      setDetailSesult(data);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    isUserID && GetDetailResult();
  }, [isUserID, isAddM]);
  useEffect(() => {
    setisTrigger && setshowPopup(true);
  }, [setisTrigger]);
  return (
    <div className="itemtableName">
      <div className="item-table">
        <table className="task-table">
          <thead>
            <tr>
              <td scope="col">Hạng</td>
              <td scope="col">Nhân viên</td>
              <td scope="col">Bộ phận</td>
              <td scope="col">Mục tiêu</td>
              <td scope="col">Thực hiện</td>
              <td scope="col">Tiến độ</td>
              <td style={{ width: "150px", textAlign: "center" }} scope="col">
                Hành động
              </td>
            </tr>
          </thead>
          <tbody>
            {sortedEmployees.map((employee, index) => {
              const progress = employee.percentRate;
              return (
                <tr key={employee.id}>
                  <td>{index + 1}</td>
                  <td>{employee.fullName}</td>
                  <td>{employee.dep_Name}</td>
                  <td>{employee.kpi.toLocaleString()}</td>
                  <td>{employee.result.toLocaleString()}</td>
                  <td>
                    <div className="mb-2">
                      <div className="text-muted small">
                        {parseFloat(progress.toFixed(2))}%
                      </div>
                      <div className="progress " style={{ height: "10px" }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${progress}%`,
                            backgroundColor:
                              progress >= 90 ? "#28a745" : "#007bff",
                          }}
                          aria-valuenow={progress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center">
                      {(setPQ === "Administrator" ||
                        employee.userID === isUser) && (
                        <button
                          className="btn btn-view btn-icon mx-1"
                          onClick={() =>
                            enterXemDetail(
                              employee.userID,
                              employee.year,
                              employee.month,
                              employee.fullName
                            )
                          }
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      )}
                      {/* {employee.userID === isUser && (
                        <button
                          className="btn btn-achieved btn-icon mx-1"
                          onClick={() => enterAchievedKPI(employee.userID)}
                        >
                          <i className="fas fa-tasks"></i>
                        </button>
                      )} */}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        show={showPopup}
        onHide={handleClose}
        dialogClassName="modal-dialog-centered"
        aria-labelledby="popupModalHeader"
        backdrop="static" // Ngăn không cho modal đóng khi click ngoài
        keyboard={false}
        className="popupModalCreateLeave"
      >
        <Modal.Header closeButton>
          <Modal.Title id="popupModalHeader">Nhập KPI</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <KPIResult
            setshowPopup={setshowPopup}
            setData={sortedEmployees.filter((x) => x.userID === isUser)}
            setAddM={setAddM}
          />
        </Modal.Body>
      </Modal>
      <Modal
        show={showPopupDetail}
        onHide={handleCloseDetail}
        dialogClassName="modal-dialog-centered"
        aria-labelledby="popupModalHeader"
        backdrop="static" // Ngăn không cho modal đóng khi click ngoài
        keyboard={false}
        className="popupModalCreateLeave"
      >
        <Modal.Header closeButton>
          <Modal.Title id="popupModalHeader">Chi tiết KPI</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <KPIDetailResult
            setshowPopup={setshowPopupDetail}
            setData={isDetailResult}
            setPQ={setPQ}
            setFullName={isFullName}
            setAddM={setAddM}
            setMonth={isMonth}
            setYear={isYear}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default KPIMonth;
