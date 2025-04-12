import { useRef, useEffect, useState, useContext } from "react";
import iziToast from "izitoast";
import unorm from "unorm";
import $, { data } from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import moment from "moment";
const KPISetting = ({ setRole, setshowPopup, setCheckAddFM }) => {
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const selectRef2 = useRef(null);
  const [isPhongBan, setPhongBan] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [isDisable, setDisable] = useState(false);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [users, setUsers] = useState([]);
  const startYear = currentYear - 2;
  const years = [];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  for (let year = startYear; year <= currentYear + 1; year++) {
    years.push(year);
  }
  const getPhongBan = async () => {
    var url = `${process.env.REACT_APP_URL_API}Department/Get?action=get`;
    setRole !== "Administrator" &&
      (url = `${process.env.REACT_APP_URL_API}Department/Get?action=GetDept_User&para1=${isUser}`);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      setPhongBan(data);
      setSelectedDepartment(data[0].dep_Code);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getPhongBan();
  }, []);

  useEffect(() => {
    if (selectRef2.current) {
      $(selectRef2.current).select2();

      $(selectRef2.current).on("change", function () {
        const value = $(this).val();
        setSelectedDepartment(value);
      });
    }

    return () => {
      if (selectRef2.current) {
        $(selectRef2.current).select2("destroy");
      }
    };
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    setDisable(true);
    var arrSetting = [];
    users?.map((x) => {
      let ojbect = {
        id: 0,
        userID: x.userID,
        month: selectedMonth,
        year: selectedYear,
        kpi: x.kpi,
        unit: "",
        createDate: moment().format("YYYY-MM-DD"),
        idCreator: isUser,
      };
      arrSetting.push(ojbect);
    });
    PostSave(arrSetting);
  };
  const PostSave = async (arrPost) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}KPI/PostSetting`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arrPost),
      }
    );
    let response = await fetch(request);
    let data = await response.json();
    setDisable(false);
    if (data.status == "OK") {
      iziToast.success({
        title: "Success",
        message: `Lưu thành công`,
        position: "topRight",
      });

      setshowPopup((prev) => !prev);
      setCheckAddFM((prev) => !prev);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Lưu thất bại`,
        position: "topRight",
      });
    }
  };
  const handleKPIChange = (userID, newKPI) => {
    const numericKPI = parseInt(newKPI) || 0;

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userID === userID ? { ...user, kpi: numericKPI } : user
      )
    );
  };

  const GetSetting = async () => {
    const phongbanResult = selectedDepartment;
    const yearResult = selectedYear;
    const monthResult = selectedMonth;
    if (phongbanResult == "" || selectedYear == "" || selectedMonth == "")
      return;
    var url = `${process.env.REACT_APP_URL_API}KPI/GetSetting?action=GetSetting&para1=${phongbanResult}&para2=${monthResult}&para3=${yearResult}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    GetSetting();
  }, [selectedDepartment, selectedYear, selectedMonth]);
  return (
    <div className="">
      <div className="card">
        <div className="card-body">
          <form>
            <div className="col-12 m-0 p-0 my-2 ">
              <div className="row select_KPIPB">
                <div className="form-group col-6 m-0 p-0 ">
                  <label htmlFor="startDate">Phòng ban</label>
                  <select
                    className="form-control "
                    id="selectPD"
                    ref={selectRef2}
                    style={{ minWidth: "100px" }}
                  >
                    {isPhongBan.map((item) => (
                      <option key={item.dep_Code} value={item.dep_Code}>
                        {item.dep_Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-3 m-0 p-0 px-1">
                  <label style={{ whiteSpace: "nowrap" }}>Chọn năm </label>{" "}
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
                <div className="form-group col-3 m-0 p-0 ">
                  <label style={{ whiteSpace: "nowrap" }}>Chọn tháng </label>{" "}
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
              </div>
            </div>
            <div className="col-lg-12 col-xl-12 m-0 p-0 my-2  ">
              <div className="row">
                <label style={{ whiteSpace: "nowrap" }}>Danh sách </label>{" "}
                <div className="m-0 p-0">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th style={{ fontSize: "14px" }}>Họ tên</th>
                        <th style={{ fontSize: "14px" }}>Cài đặt KPI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.userID}>
                          <td style={{ fontSize: "13px" }}>{user.fullName}</td>
                          <td>
                            {" "}
                            <input
                              style={{
                                boxShadow: "none",
                                border: "none",
                                padding: "0 ",
                              }}
                              type="number"
                              min="0"
                              max="100"
                              className="form-control"
                              value={user.kpi}
                              onChange={(e) =>
                                handleKPIChange(user.userID, e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div
              className="col-lg-12 col-xl-12 m-0 p-0 my-2 mt-4"
              style={{ background: "#Fff", paddingBottom: "4px" }}
            >
              <div className="row">
                <button
                  disabled={isDisable}
                  onClick={(e) => handleAddTask(e)}
                  style={{ marginLeft: "auto", width: "100px" }}
                  type="submit"
                  className={`btn btn-primary 
                }`}
                >
                  <i className="fas fa-paper-plane"></i> Lưu
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default KPISetting;
