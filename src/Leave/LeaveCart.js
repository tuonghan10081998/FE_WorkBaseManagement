import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import iziToast from "izitoast";
const LeaveCart = ({
  status,
  tasks,
  handleSetting,
  setIDDeleteColumn,
  setPQDuyen,
  setCheckAdd,
}) => {
  const statusText =
    status === 1 ? "Đã duyệt" : status === 0 ? "Chờ duyệt" : "Không duyệt";
  const statusClass =
    status === 1 ? "success" : status === 0 ? "warning" : "danger";
  const statusIcon =
    status === 1 ? (
      <i className="fas fa-check-circle me-1"></i>
    ) : status === 0 ? (
      <i className="fas fa-spinner me-1"></i>
    ) : (
      <i className="fa-solid fa-circle-xmark me-1"></i>
    );

  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const [isTitleBody, setTiTleBody] = useState("");
  const [show, setShow] = useState(false);
  const [isIDData, setIDDate] = useState(null);
  const [isCheckHandle, setCheckHandle] = useState(null);
  const [isCheckPhieu, setCheckPhieu] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    let ID = e.currentTarget.dataset.id;
    setIDDate(ID);
    setShow(true);
  };

  const handleClickDelete = (value) => {
    setIDDeleteColumn(isIDData);
    setShow(false);
    handleSave("Delete");
  };
  const handleClickScroll = (e) => {
    const parent = e.currentTarget.closest(".task-column");
    const child = parent.querySelector(".overColumn");
    if (child) {
      child.classList.toggle("active");
    }
  };
  const handleClick = (e) => {
    const parent = e.currentTarget.closest(".carticon");
    const child = parent.querySelector(".popupsettingCart");
    if (child) {
      child.classList.toggle("active");
    }
  };
  const handleClickOutside = (e) => {
    const cartIcons = document.querySelectorAll(".carticon");

    cartIcons.forEach((cartIcon) => {
      const popup = cartIcon.querySelector(".popupsettingCart");
      if (popup && !cartIcon.contains(e.target)) {
        popup.classList.remove("active");
      }
    });
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const handlesSubmit = () => {
    isCheckHandle == 0 && handleClickDelete();
    isCheckHandle == 1 && handleSave("PostApprove");
  };
  const handleSave = (NamePort) => {
    const data = tasks.filter((x) => x.id == isIDData);
    const d = data[0];
    let arrLeave = [];
    const object = {
      id: d.id,
      title: d.title,
      reason: d.reason.toString(),
      fromDate: moment(d.fromDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      toDate: moment(d.toDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      status: isCheckPhieu.toString(),
      createDate: moment().format("YYYY-MM-DD"),
      idRequester: "",
      idManager: isUser,
      approvalDate: null,
    };
    arrLeave.push(object);
    PostSave(object, NamePort);
  };
  const PostSave = async (arrPost, NamePort) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}Leave/${NamePort}`,
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
    if (data.status == "OK") {
      iziToast.success({
        title: "Success",
        message: `Lưu thành công`,
        position: "topRight",
      });
      setCheckAdd((x) => !x);
      setShow(false);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Lưu thất bại`,
        position: "topRight",
      });
    }
  };
  return (
    <div className="col-md-4 col-lg-4" style={{ padding: "0 10px" }}>
      <div className="task-column">
        <div
          onClick={(e) => handleClickScroll(e)}
          className={`bg-${statusClass} text-white p-2 rounded d-flex justify-content-between align-items-center`}
        >
          <span>{statusText}</span>
          <span className={`badge bg-white badge-light text-${statusClass}`}>
            {tasks.length}
          </span>
        </div>
        <div className="mt-2 overColumn">
          {tasks?.map((task, index) => (
            <div
              className="task-card"
              data-id={task.id}
              data-date={`${task.fromDate} - ${task.toDate}`}
            >
              <div className="editCart">
                <div>
                  {" "}
                  <p className="duan" style={{ fontSize: "17px" }}>
                    <i class="fa-solid fa-newspaper me-1"></i>
                    {task.title}
                  </p>
                </div>
                <div className="carticon position-relative">
                  <i
                    data-id={task.id}
                    onClick={(e) => handleClick(e)}
                    className="fa-solid fa-gear"
                    style={{ color: "#89915e" }}
                  ></i>
                  <div className="popupsettingCart">
                    <div
                      data-id={task.id}
                      onClick={(e) => {
                        handleShow(e);
                        setTiTleBody(
                          "Bạn xác nhận duyệt phiếu xin nghỉ việc này"
                        );
                        setCheckHandle(1);
                        setCheckPhieu(1);
                      }}
                      className={`${
                        setPQDuyen && status != 1 && isUser != task.idRequester
                          ? ""
                          : "d-none"
                      }`}
                    >
                      <i class="fa-solid fa-street-view me-1"></i>Duyệt
                    </div>
                    <div
                      data-id={task.id}
                      onClick={(e) => {
                        handleShow(e);
                        setTiTleBody(
                          "Bạn xác nhận không duyệt phiếu xin nghỉ việc này"
                        );
                        setCheckHandle(1);
                        setCheckPhieu(2);
                      }}
                      className={`${
                        setPQDuyen && status != 2 && isUser != task.idRequester
                          ? ""
                          : "d-none"
                      }`}
                    >
                      <i class="fa-solid fa-street-view me-1"></i>Không duyệt
                    </div>
                    {isUser == task.idRequester && status == 0 && (
                      <div
                        onClick={(e) => {
                          if (handleSetting) {
                            handleSetting({
                              action: 2,
                              id: task.id,
                            });
                          }
                        }}
                      >
                        <i className="fa-solid fa-pen-to-square me-1"></i>
                        Sửa
                      </div>
                    )}
                    {(isUser == task.idRequester && status == 0) ||
                      (isIDLogin.toLowerCase() == "admin" && (
                        <div
                          data-id={task.id}
                          onClick={(e) => {
                            handleShow(e);
                            setTiTleBody(
                              "Bạn xác nhận xóa phiếu xin nghỉ việc này"
                            );
                            setCheckHandle(0);
                          }}
                          // className={`${!setQP ? "d-none" : ""}`}
                          style={{ boxShadow: "none" }}
                        >
                          <i
                            style={{ color: "REd" }}
                            className="fa-solid fa-trash-can me-1"
                          ></i>
                          Xóa
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="task_item">
                <div className="user-names">
                  <p className="">
                    {" "}
                    <i class="fa-solid fa-universal-access me-1"></i>Lý do:{" "}
                    {task.reason}
                  </p>
                </div>
              </div>
              <div className="task_item">
                <div className="user-names"></div>
              </div>
              <div className="task_item">
                <div className="user-names">
                  <p>
                    <i className="fas fa-clock me-1"></i>Ngày nghỉ:{" "}
                    {`${task.fromDate} - ${task.toDate}`}
                  </p>
                </div>
              </div>

              <div className="task_item">
                <div className="user-names">
                  <p>
                    <i
                      style={{ color: "#8ec311" }}
                      className="fas fa-user me-1"
                    ></i>
                    Người duyệt: {task.manager}
                  </p>
                </div>
              </div>
              <div className="task_item">
                <div className="user-names">
                  <p>
                    <i className="fas fa-user me-1"></i>Viết phiếu:{" "}
                    {task.requester}
                  </p>
                </div>

                <div className="user-names">
                  {" "}
                  <p
                    className={`text-${statusClass}`}
                    style={{ fontSize: "16px" }}
                  >
                    {" "}
                    {statusIcon}
                    {statusText}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-dialog-centered"
        aria-labelledby="popupModalLabel"
        className="modalHT"
      >
        <Modal.Header>
          <Modal.Title id="popupModalLabel">Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{isTitleBody}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={() => handlesSubmit()} variant="primary">
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LeaveCart;
