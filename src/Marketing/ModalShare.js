import React, { useState, useContext, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import iziToast from "izitoast";
const ModalShare = ({
  data,
  setIsClick,
  setClick,
  dataNV,
  setData,
  setChange,
}) => {
  const [isShareData, setShareData] = useState(null);
  const [isDisable, setDisable] = useState(false);
  const [isCongViec, setCongViec] = useState(null);
  const handleSave = (e) => {
    e.preventDefault();
    if (dataNV.filter((x) => x.isChecked === 1).length === 0) {
      iziToast.warning({
        title: "Warning",
        message: `Vui lòng chọn nhân viên`,
        position: "topRight",
      });
      return;
    }
    const tasksToAssign = data
      .filter((item) => item.isChecked !== 1)
      .slice(0, isShareData);
    distributeTasks(
      dataNV.filter((x) => x.isChecked === 1),
      tasksToAssign
    );
  };
  const distributeTasks = (users, dataF) => {
    const totalTasks = dataF.length;
    const totalUsers = users.length;
    const base = Math.floor(totalTasks / totalUsers);
    let remainder = totalTasks % totalUsers;

    let taskIndex = 0;

    users.forEach((user) => {
      let tasksForThisUser = base + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;

      for (let i = 0; i < tasksForThisUser; i++) {
        if (taskIndex < dataF.length) {
          const taskId = dataF[taskIndex].id; // hoặc dataF[taskIndex].yourIDField nếu tên khác
          const indexInData = data.findIndex((item) => item.id === taskId);

          if (indexInData !== -1) {
            data[indexInData].isChecked = 1;
            data[indexInData].receiverID = user.userID;
            data[indexInData].receiver = user.fullName;
          }
          taskIndex++;
        }
      }
    });

    setChange((x) => !x);
    setData([...data]);
    setClick(false);
  };

  useEffect(() => {
    setShareData(data.filter((item) => item.isChecked !== 1).length);
  }, [data, setIsClick]);
  const handleChange = (e) => {
    const value = Number(e.currentTarget.value);
    if (value > data.length) {
      iziToast.warning({
        title: "Warning",
        message: `Vui lòng không nhập lớn hơn số lượng data hiện có`,
        position: "topRight",
      });
    } else {
      setShareData(value);
    }
  };
  useEffect(() => {
    console.log(dataNV);
    if (dataNV?.filter((x) => x.isChecked === 1).length === 0) {
      setCongViec("Vui lòng chọn nhân viên");
    } else
      setCongViec(
        `Từng thành viên sẽ có ích nhất ${parseInt(
          isShareData / dataNV?.filter((x) => x.isChecked === 1).length
        )} công việc`
      );
  }, [dataNV, isShareData]);
  return (
    <>
      {setIsClick && (
        <div className="modal-backdrop fade show"></div> // Thêm lớp backdrop khi modal mở
      )}
      <div
        className={`modal ${setIsClick ? "d-block" : "d-none"}`} // Điều khiển modal mở hay đóng
        tabIndex={-1}
        role="dialog"
        id="customModal"
        aria-labelledby="popupModalHeader"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div style={{ padding: "10px 20px" }} className="modal-header">
              <h5 className="modal-title" id="popupModalHeader">
                Thông tin
              </h5>
              <button
                onClick={() => setClick(false)}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body cardleave" style={{ padding: "2px" }}>
              <div className="">
                <div className="card px-2">
                  <div className="card-body  px-4 py-2">
                    <form>
                      <div className="col-12 m-0 p-0 my-2 ">
                        <div className="row">
                          <div className="form-group col-12 m-0 p-0 ">
                            <label htmlFor="projectName">Số lượng data</label>
                            <input
                              type="text"
                              className="form-control"
                              id="projectName"
                              placeholder=""
                              value={
                                data.filter((item) => item.isChecked !== 1)
                                  .length
                              }
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 m-0 p-0 my-2 ">
                        <div className="row">
                          <div className="form-group col-12 m-0 p-0 ">
                            <label htmlFor="projectName">Data muốn chia</label>
                            <input
                              type="text"
                              className="form-control"
                              id="projectName"
                              placeholder=""
                              onChange={(e) => handleChange(e)}
                              value={isShareData}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 m-0 p-0 my-2 ">
                        <div className="row">
                          <div className="form-group col-12 m-0 p-0 ">
                            <p className="mb-0">{isCongViec}</p>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div
                          className="d-flex  p-0 py-2"
                          style={{ background: "#Fff", paddingBottom: "4px" }}
                        >
                          <button
                            disabled={isDisable}
                            onClick={(e) => handleSave(e)}
                            style={{ marginLeft: "auto" }}
                            type="submit"
                            className={`btn btn-primary  mt-3
                 
                          }`}
                          >
                            <i className="fas fa-paper-plane"></i> Share data
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ModalShare;
