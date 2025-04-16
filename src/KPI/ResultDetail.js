import { useRef, useEffect, useState, useContext } from "react";
import iziToast from "izitoast";
import unorm from "unorm";
import $, { data } from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import moment from "moment";
const KPIDetailResult = ({
  setAddM,
  setshowPopup,
  setData,
  setPQ,
  setFullName,
  setMonth,
  setYear,
}) => {
  const [isDisable, setDisable] = useState(false);
  const [isDataDetail, setDataDetail] = useState([]);

  useEffect(() => {
    if (Array.isArray(setData)) {
      setDataDetail(setData);
    }
  }, [setData]);

  const handleKPIChange = (id, newKPI) => {
    const numericKPI = parseInt(newKPI) || 0;
    setDataDetail((prevUsers) =>
      prevUsers.map((x) => (x.id === id ? { ...x, result: numericKPI } : x))
    );
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    var arrDetailResult = [];
    isDataDetail?.map((x) => {
      let ojbect = {
        id: x.id,
        userID: x.userID,
        month: setMonth,
        year: setYear,
        result: x.result,
        unit: "",
        createDate: moment(x.createDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
        idCreator: "",
      };
      arrDetailResult.push(ojbect);
    });
    PostSave(arrDetailResult);

    setDisable(true);
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
  const handleSumColumn = (data = [], field = "") => {
    if (!Array.isArray(data) || !field) return 0;

    return data.reduce((sum, item) => {
      const value = Number(item[field]) || 0;
      return sum + value;
    }, 0);
  };
  return (
    <div className="">
      <div className="card">
        <div className="card-body">
          <form>
            <div className="col-lg-12 col-xl-12 m-0 p-0 my-2">
              <div className="row">
                <div className="form-group col-12 m-0 p-0">
                  <label htmlFor="endDate">Nhân viên</label>
                  <input
                    readOnly={true}
                    type="text"
                    className="form-control"
                    id="projectName"
                    value={setFullName}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-12 col-xl-12 m-0 p-0 my-2">
              <div className="row">
                <label style={{ whiteSpace: "nowrap" }}>Danh sách</label>
                <div
                  className="m-0 p-0"
                  style={{ overflow: "auto", maxHeight: "500px" }}
                >
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <td style={{ fontSize: "14px", width: "90px" }}>
                          Ngày
                        </td>
                        <td
                          style={{
                            fontSize: "14px",
                            width: "150px",
                            textAlign: "center",
                          }}
                        >
                          KPI
                        </td>
                        <td style={{ fontSize: "14px" }}>Ghi chú</td>
                      </tr>
                    </thead>
                    <tbody>
                      {isDataDetail.map((x) => (
                        <tr key={x.userID}>
                          <td style={{ fontSize: "13px" }}>{x.createDate}</td>
                          <td>
                            <input
                              readOnly={setPQ === "Administrator"}
                              style={{
                                boxShadow: "none",
                                border: "none",
                                padding: "0",
                                textAlign: "center",
                              }}
                              type="number"
                              min="0"
                              max="100"
                              className="form-control"
                              value={x.result}
                              onChange={(e) =>
                                handleKPIChange(x.id, e.target.value)
                              }
                            />
                          </td>
                          <td
                            style={{
                              fontSize: "13px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {x.note || ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    {isDataDetail && isDataDetail.length > 0 && (
                      <tfoot>
                        <tr>
                          <td
                            style={{
                              whiteSpace: "nowrap",
                              fontWeight: "500",
                              color: "REd",
                            }}
                            colSpan="1"
                          >
                            Tổng
                          </td>
                          <td
                            style={{
                              whiteSpace: "nowrap",
                              fontWeight: "500",
                              color: "REd",
                              textAlign: "center",
                            }}
                          >
                            {handleSumColumn(
                              isDataDetail,
                              "result"
                            ).toLocaleString()}
                          </td>
                          <td colSpan="1"></td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            </div>

            {setPQ !== "Administrator" && (
              <div
                className="col-lg-12 col-xl-12 m-0 p-0 my-2 mt-4"
                style={{ background: "#fff", paddingBottom: "4px" }}
              >
                <div className="row">
                  <button
                    disabled={isDisable}
                    onClick={(e) => handleAddTask(e)}
                    style={{ marginLeft: "auto", width: "100px" }}
                    type="submit"
                    className="btn btn-primary"
                  >
                    <i className="fas fa-paper-plane"></i> Lưu
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default KPIDetailResult;
