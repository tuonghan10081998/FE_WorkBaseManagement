import "./KPI.css";

const KPIFullMonth = ({ setData }) => {
  const calculateSums = (months) => {
    let totalAchieved = 0;
    let totalTarget = 0;

    months.forEach((month) => {
      const monthSplit = month.split("@")[0];
      const [achieved, target] = monthSplit.split("/").map(Number);
      totalAchieved += achieved;
      totalTarget += target;
    });

    return [totalAchieved, totalTarget];
  };
  const handleColorT = (value) => {
    const monthSplit = value.split("@");
    const [first, second] = monthSplit[0].split("/").map(Number);
    const color = monthSplit[1] == 0 ? "red" : "green";

    return (
      <span>
        <span style={{ color, fontWeight: "600" }}>{first}</span>
        <span style={{ color, fontWeight: "600" }}>/{second}</span>
      </span>
    );
  };
  // Hàm xử lý hành động
  const handleViewDetails = (id) => {
    alert("Xem chi tiết nhân viên có ID: " + id);
  };

  const handleEnterTargetKPI = (id) => {
    alert("Nhập KPI Mục Tiêu cho nhân viên có ID: " + id);
  };

  const handleEnterAchievedKPI = (id) => {
    alert("Nhập KPI Thực Hiện cho nhân viên có ID: " + id);
  };

  return (
    <div className="itemtableName">
      <div className="item-table">
        <table className="task-table">
          <thead>
            <tr>
              <td scope="col">Nhân viên</td>
              <td scope="col">Bộ phận</td>
              <td scope="col">Năm</td>
              <td scope="col">T1</td>
              <td scope="col">T2</td>
              <td scope="col">T3</td>
              <td scope="col">T4</td>
              <td scope="col">T5</td>
              <td scope="col">T6</td>
              <td scope="col">T7</td>
              <td scope="col">T8</td>
              <td scope="col">T9</td>
              <td scope="col">T10</td>
              <td scope="col">T11</td>
              <td scope="col">T12</td>
              <td scope="col">T.T.Hiện</td>
              <td scope="col">T.M.Tiêu</td>
              {/* <td scope="col">Hành động</td> */}
            </tr>
          </thead>
          <tbody>
            {setData.map((employee, index) => {
              // Tạo mảng tháng
              const months = [
                employee.month1,
                employee.month2,
                employee.month3,
                employee.month4,
                employee.month5,
                employee.month6,
                employee.month7,
                employee.month8,
                employee.month9,
                employee.month10,
                employee.month11,
                employee.month12,
              ];

              // Tính tổng thực hiện và mục tiêu
              const [totalAchieved, totalTarget] = calculateSums(months);

              return (
                <tr className="tbodytr" key={employee.id}>
                  <td>{employee.fullname}</td>
                  <td>{employee.dep_Name}</td>
                  <td>{employee.year}</td>
                  <td>{handleColorT(employee.month1)}</td>
                  <td>{handleColorT(employee.month2)}</td>
                  <td>{handleColorT(employee.month3)}</td>
                  <td>{handleColorT(employee.month4)}</td>
                  <td>{handleColorT(employee.month5)}</td>
                  <td>{handleColorT(employee.month6)}</td>
                  <td>{handleColorT(employee.month7)}</td>
                  <td>{handleColorT(employee.month8)}</td>
                  <td>{handleColorT(employee.month9)}</td>
                  <td>{handleColorT(employee.month10)}</td>
                  <td>{handleColorT(employee.month11)}</td>
                  <td>{handleColorT(employee.month12)}</td>
                  <td>{totalAchieved}</td>
                  <td>{totalTarget}</td>
                  {/* <td>
                    <div className="d-flex justify-content-start">
                      <button
                        className="btn btn-target btn-sm mx-1"
                        onClick={() => handleEnterTargetKPI(employee.id)}
                      >
                        <i className="fas fa-bullseye"></i>
                      </button>
                      <button
                        className="btn btn-achieved btn-sm mx-1"
                        onClick={() => handleEnterAchievedKPI(employee.id)}
                      >
                        <i className="fas fa-tasks"></i>
                      </button>
                    </div>
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default KPIFullMonth;
