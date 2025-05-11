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
  setChienDich,
  setTrangThai,
  setTimKiem,
  setIsSelectData,
}) => {
  const [isShareData, setShareData] = useState(null);
  const [isDisable, setDisable] = useState(false);
  const [isCongViec, setCongViec] = useState(null);
  const handleSave = (e) => {
    e.preventDefault();
    setDisable(true);
    if (dataNV.filter((x) => x.isChecked === 1).length === 0) {
      iziToast.warning({
        title: "Warning",
        message: `Vui lòng chọn nhân viên`,
        position: "topRight",
      });
      return;
    }
    const tasksToAssign = data
      .filter(
        (item) =>
          item.isChecked !== 1 &&
          (setChienDich === "all" || item.utmCampaign === setChienDich) &&
          (setTrangThai === "all" ? true : item.status === setTrangThai) &&
          ((item.name ?? "").toUpperCase().includes(setTimKiem.toUpperCase()) ||
            (item.phone ?? "")
              .toUpperCase()
              .includes(setTimKiem.toUpperCase()) ||
            (item.mail ?? "")
              .toUpperCase()
              .includes(setTimKiem.toUpperCase())) &&
          (setIsSelectData.toString() === "1"
            ? true
            : item.isChecked === (setIsSelectData.toString() === "3" ? 0 : 1))
      )
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

    var dataSave = [...data];
    dataSave = dataSave.filter(
      (x) =>
        x.isChecked === 1 &&
        (setChienDich === "all" || x.utmCampaign === setChienDich) &&
        (setTrangThai === "all" ? true : x.status === setTrangThai) &&
        ((x.name ?? "").toUpperCase().includes(setTimKiem.toUpperCase()) ||
          (x.phone ?? "").toUpperCase().includes(setTimKiem.toUpperCase()) ||
          (x.mail ?? "").toUpperCase().includes(setTimKiem.toUpperCase())) &&
        (setIsSelectData.toString() === "1"
          ? true
          : x.isChecked === (setIsSelectData.toString() === "3" ? 0 : 1))
    );
    var arrSave = [];
    dataSave.map((x) => {
      let object = {
        id: x.id,
        date: "string",
        name: "string",
        phone: "string",
        mail: "string",
        question: "string",
        utmSource: "string",
        utmCampaign: "string",
        status: 0,
        preBroker: "string",
        ftd: 0,
        broker: "string",
        dealDate: "2025-04-28T13:49:17.047Z",
        note: "string",
        createUser: "string",
        createDate: "2025-04-28T13:49:17.047Z",
        receiverID: x.receiverID,
        oldReceiverID: "string",
        isChecked: 1,
      };
      arrSave.push(object);
    });
    PostSave(arrSave, ...data);
  };
  const PostSave = async (arrPost, dataF) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}MarketingData/PostShare`,
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
      // setData(dataF);
      setClick(false);
      setChange((x) => !x);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Lưu thất bại`,
        position: "topRight",
      });
    }
  };
  useEffect(() => {
    setShareData(
      data?.filter(
        (item) =>
          item.isChecked !== 1 &&
          (setChienDich === "all" || item.utmCampaign === setChienDich) &&
          (setTrangThai === "all" ? true : item.status === setTrangThai) &&
          ((item.name ?? "").toUpperCase().includes(setTimKiem.toUpperCase()) ||
            (item.phone ?? "")
              .toUpperCase()
              .includes(setTimKiem.toUpperCase()) ||
            (item.mail ?? "")
              .toUpperCase()
              .includes(setTimKiem.toUpperCase())) &&
          (setIsSelectData.toString() === "1"
            ? true
            : item.isChecked === (setIsSelectData.toString() === "3" ? 0 : 1))
      ).length
    );
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
    if (dataNV?.filter((x) => x.isChecked === 1).length === 0) {
      setCongViec("Vui lòng chọn nhân viên");
    } else
      var result = parseInt(
        isShareData / dataNV?.filter((x) => x.isChecked === 1).length
      );

    setCongViec(
      <>
        Từng thành viên sẽ có ích nhất{" "}
        <span className="text-danger fw-bold fs-5">{result}</span> công việc
      </>
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
                                data?.filter(
                                  (item) =>
                                    item.isChecked !== 1 &&
                                    (setChienDich === "all" ||
                                      item.utmCampaign === setChienDich) &&
                                    (setTrangThai === "all"
                                      ? true
                                      : item.status === setTrangThai) &&
                                    ((item.name ?? "")
                                      .toUpperCase()
                                      .includes(setTimKiem.toUpperCase()) ||
                                      (item.phone ?? "")
                                        .toUpperCase()
                                        .includes(setTimKiem.toUpperCase()) ||
                                      (item.mail ?? "")
                                        .toUpperCase()
                                        .includes(setTimKiem.toUpperCase())) &&
                                    (setIsSelectData.toString() === "1"
                                      ? true
                                      : item.isChecked ===
                                        (setIsSelectData.toString() === "3"
                                          ? 0
                                          : 1))
                                ).length
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
                            <i className="fas fa-paper-plane"></i> Lưu
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
