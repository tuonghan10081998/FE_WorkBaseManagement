import { useRef, useEffect, useState, useContext } from "react";
import iziToast from "izitoast";
import unorm from "unorm";
import $, { data } from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import moment from "moment";
const KPIResult = ({ setAddM, setData, setshowPopup }) => {
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const selectRef2 = useRef(null);

  const [isDisable, setDisable] = useState(false);

  const [isDepCode, setDepCode] = useState("");
  const [isDepName, setDepName] = useState("");
  const [isIDNV, setIDNV] = useState("");
  const [isNameNV, setNameNV] = useState("");
  const [isKPI, setKPI] = useState("");
  const [isUnit, setUnit] = useState("");
  const [isGhiChu, setGhiChu] = useState("");
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    if (setData.length == 0) return;
    const d = setData[0];
    setDepCode(d.dep_Code);
    setDepName(d.dep_Name);
    setIDNV(d.userID);
    setNameNV(d.fullName);
  }, [setData]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (isKPI == "") {
      handleNotifi("nhập số lượng kpi trong ngày");
      return;
    }
    setDisable(true);
    var arrResult = [];
    const object = {
      id: 0,
      userID: isIDNV,
      month: currentMonth,
      year: currentYear,
      result: isKPI,
      unit: "",
      note: isGhiChu,
      createDate: moment().format("YYYY-MM-DD"),
      idCreator: "string",
    };
    arrResult.push(object);
    PostSave(arrResult);
  };
  const PostSave = async (arrPost) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}KPI/PostResult`,
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

      setshowPopup((x) => !x);
      setAddM((x) => !x);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Lưu thất bại`,
        position: "topRight",
      });
    }
  };
  const handleNotifi = (value) => {
    iziToast.warning({
      title: "Warning",
      message: `Vui lòng  ${value}`,
      position: "topRight",
    });
  };
  return (
    <div className="">
      <div className="card">
        <div className="card-body">
          <form>
            <div className="col-12 m-0 p-0 my-2 ">
              <div className="row">
                <div className="form-group col-6 m-0 p-0 pe-1">
                  <label style={{ whiteSpace: "nowrap" }}>Năm </label>{" "}
                  <input
                    readOnly={true}
                    type="text"
                    className="form-control"
                    id="projectName"
                    value={currentYear}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group col-6 m-0 p-0 ps-1">
                  <label style={{ whiteSpace: "nowrap" }}> Tháng </label>{" "}
                  <input
                    readOnly={true}
                    type="text"
                    className="form-control"
                    id="projectName"
                    value={currentMonth}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-xl-12 m-0 p-0 my-2  ">
              <div className="row">
                <div className="form-group col-12 m-0 p-0 ">
                  <label htmlFor="startDate">Phòng ban</label>
                  <input
                    readOnly={true}
                    type="text"
                    className="form-control"
                    id="projectName"
                    value={isDepName}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-xl-12 m-0 p-0 my-2  ">
              <div className="row">
                <div className="form-group col-12 m-0 p-0 ">
                  <label htmlFor="endDate">Nhân viên</label>
                  <input
                    readOnly={true}
                    type="text"
                    className="form-control"
                    id="projectName"
                    value={isNameNV}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-12 col-xl-12 m-0 p-0 my-2  ">
              <div className="row">
                <div className="col-12 m-0 p-0 ">
                  <div className="p-0">
                    <label htmlFor="projectDescription">Nhập KPI</label>

                    <input
                      type="number"
                      className="form-control"
                      id="projectName"
                      onChange={(e) => setKPI(e.currentTarget.value)}
                      value={isKPI}
                      autoComplete="off"
                    />
                  </div>
                </div>
                {/* <div className="col-6 m-0 p-0 ps-1">
                  <div className="p-0">
                    <label htmlFor="projectDescription">Đơn vị</label>
                    <input
                      type="text"
                      className="form-control"
                      id="projectName"
                      onChange={(e) => setUnit(e.currentTarget.value)}
                      value={isUnit}
                      autoComplete="off"
                    />
                  </div>
                </div> */}
              </div>
            </div>
            <div className="col-lg-12 col-xl-12 m-0 p-0 my-2  ">
              <div className="row">
                <div className="col-12 m-0 p-0 ">
                  <div className="p-0">
                    <label htmlFor="projectDescription">Ghi chú</label>

                    <input
                      type="text"
                      className="form-control"
                      id="projectName"
                      onChange={(e) => setGhiChu(e.currentTarget.value)}
                      value={isGhiChu}
                      autoComplete="off"
                    />
                  </div>
                </div>
                {/* <div className="col-6 m-0 p-0 ps-1">
                  <div className="p-0">
                    <label htmlFor="projectDescription">Đơn vị</label>
                    <input
                      type="text"
                      className="form-control"
                      id="projectName"
                      onChange={(e) => setUnit(e.currentTarget.value)}
                      value={isUnit}
                      autoComplete="off"
                    />
                  </div>
                </div> */}
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
export default KPIResult;
