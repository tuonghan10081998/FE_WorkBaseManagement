import React, { useState, useEffect, useContext } from "react";
import "./KPI.css";
import "bootstrap/dist/css/bootstrap.min.css";
const KPIMonth = ({ setDataMonth }) => {
  const calculateProgress = (achieved, target) => {
    return (parseFloat(achieved) / parseFloat(target)) * 100;
  };

  // Lưu trữ dữ liệu bảng
  const [sortedEmployees, setSortedEmployees] = useState([]);

  // Sắp xếp dữ liệu khi component được tải
  useEffect(() => {
    const sortedData = [...setDataMonth].sort(
      (a, b) =>
        calculateProgress(b.achieved, b.target) -
        calculateProgress(a.achieved, a.target)
    );
    setSortedEmployees(sortedData);
  }, []);

  // Xử lý các hành động
  const viewDetails = (id) => {
    alert(`Xem chi tiết nhân viên có ID: ${id}`);
  };

  const enterTargetKPI = (id) => {
    alert(`Nhập KPI Mục Tiêu cho nhân viên có ID: ${id}`);
  };

  const enterAchievedKPI = (id) => {
    alert(`Nhập KPI Thực Hiện cho nhân viên có ID: ${id}`);
  };
  return (
    <div className="itemtableName">
      <div className="item-table">
        <table className="task-table">
          <thead>
            <tr>
              <td scope="col">Hạng</td>
              <td scope="col">Nhân viên</td>
              <td scope="col">Bộ phận</td>
              <td scope="col">Thực hiện</td>
              <td scope="col">Mục tiêu</td>
              <td scope="col">Tiến độ</td>
              <td style={{ width: "150px" }} scope="col">
                Hành động
              </td>
            </tr>
          </thead>
          <tbody>
            {sortedEmployees.map((employee, index) => {
              const progress = calculateProgress(
                employee.achieved,
                employee.target
              );
              return (
                <tr key={employee.id}>
                  <td>{index + 1}</td>
                  <td>{employee.fullname}</td>
                  <td>{employee.dep_Name}</td>
                  <td>{employee.achieved}</td>
                  <td>{employee.target}</td>
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
                    <div className="d-flex justify-content-start">
                      <button
                        className="btn btn-target btn-icon mx-1"
                        onClick={() => enterTargetKPI(employee.id)}
                      >
                        <i className="fas fa-bullseye"></i>
                      </button>
                      <button
                        className="btn btn-achieved btn-icon mx-1"
                        onClick={() => enterAchievedKPI(employee.id)}
                      >
                        <i className="fas fa-tasks"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default KPIMonth;
