import React, { useEffect, useState } from "react";
import moment from "moment";
import iziToast from "izitoast";
import { Modal, Button } from "react-bootstrap";
const TaskColumn = ({
  status,
  tasks,
  handleSetting,
  setIDDelete,
  setPQDuyen,
  setCheckAdd,
}) => {
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const [show, setShow] = useState(false);
  const [isIDData, setIDDate] = useState(null);
  const [isShowHT, setShowHT] = useState(false);
  const [isIDHT, setIDHT] = useState(null);
  const [isLable, setLable] = useState(null);
  const [IsLableBody, setLableBody] = useState(null);
  const [isCheckView, setCheckView] = useState("");
  const handleClickScroll = (e) => {
    const parent = e.currentTarget.closest(".task-column");
    const child = parent.querySelector(".overColumn");
    if (child) {
      child.classList.toggle("active");
    }
  };
  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    let ID = e.currentTarget.dataset.id;
    setIDDate(ID);
    setShow(true);
  };
  const handleShowHT = (e) => {
    let ID = e.currentTarget.dataset.id;
    setIDHT(ID);
    setShowHT(true);
  };
  const handleClickDelete = (value) => {
    setIDDelete(isIDData);
    setShow(false);
    handleHT(isIDData, "Delete");
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
  const handleHT = async (ID, NameValue) => {
    const data = tasks.filter((x) => x.id == ID);
    const d = data[0];
    var arrHT = [];
    const object = {
      id: d.id,
      workName: d.workName,
      description: d.description,
      priority: d.priority.toString(),
      note: d.note,
      idRequester: d.idRequester,
      lstIDImplementer: d.idImplementer.split(","),
      fromDate: moment(d.fromDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      toDate: moment(d.toDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      remindDate: moment(d.remindDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      idApprover: "",
      statusHT: 1,
    };
    arrHT.push(object);
    PostSave(object, NameValue);
  };
  const PostSave = async (arrPost, NameValue) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}Work/${NameValue}`,
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

      setCheckAdd((prev) => !prev);
      setShowHT(false);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Lưu thất bại`,
        position: "topRight",
      });
    }
  };
  const statusText =
    status === 1
      ? "Chưa thực hiện"
      : status === 2
      ? "Đang thực hiện"
      : status === 3
      ? "Hoàn thành"
      : "Quá hạn";

  const statusClass =
    status === 1
      ? "success"
      : status === 2
      ? "info"
      : status === 3
      ? "warning"
      : "success";
  const handleCliCk = () => {
    isCheckView == 1 && handleClickDelete();
  };
  return (
    <div className="col-md-6 col-lg-3" style={{ padding: "0 10px" }}>
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
              data-project={task.workName}
              data-status={task.status}
              data-id={task.id}
              data-date={`${task.fromDate} - ${task.toDate}`}
            >
              <div className="editCart">
                <div>
                  {" "}
                  <p className="duan" style={{ fontSize: "17px" }}>
                    <i
                      style={{ color: "#6ba323" }}
                      className="fa-solid fa-briefcase"
                    ></i>{" "}
                    Công việc: {task.workName}
                  </p>
                </div>
                <div className="carticon position-relative">
                  <i
                    data-id={task.id}
                    onClick={(e) => handleClick(e)}
                    className="fa-solid fa-gear"
                    style={{ color: "#89915e" }}
                  ></i>
                  <div
                    data-id={task.id}
                    className="popupsettingCart popupsettingCV"
                  >
                    {setPQDuyen && status != 1 && (
                      <div data-id={task.id} onClick={(e) => handleShowHT(e)}>
                        <i className="fa-solid fa-street-view me-1"></i>
                        <span>Hoàn thành</span>
                      </div>
                    )}

                    <div
                      data-id={task.id}
                      onClick={(e) => {
                        handleShow(e);
                        setLableBody(`
                        <div>
                          <p class="duan" style="font-size: 17px;font-weight: bold;">
                            <i style="color: #6ba323;" class="fa-solid fa-briefcase"></i>
                            Công việc: ${task.workName}
                          </p>

                         <div class="task_item item_detail" style="gap: 2px;">
                            <div class="user-names">
                              <div>
                                <i class="fa-solid fa-splotch me-1" style="color: #9b88fd;"></i>
                            Mô tả: ${task.description}
                              </div>
                            </div>
                          </div>    
                          <div class="task_item item_detail" style="gap: 2px;">
                            <div class="user-names">
                              <div>
                                <i style="color: #8ec311;" class="fas fa-user me-1"></i>
                                Giao việc: ${task.requester}
                              </div>
                            </div>
                          </div>

                          <div class="task_item item_detail" style="gap: 2px;">
                            <div class="user-names">
                              <fiv>
                                <i style="color: #256A9D;"  class="fas fa-user me-1"></i> Thực hiện: ${
                                  task.implementer
                                }
                              </fiv>
                            </div>
                          </div>

                          <div class="task_item item_detail" style="gap: 2px;">
                            <div>
                              <i style="color: #C16262;" class="fas fa-clock"></i> Ngày: ${
                                task.fromDate
                              } - ${task.toDate}
                            </div>
                          </div>
                          <div class="task_item item_detail" style="gap: 2px;">
                            <div>
                            <i style="color:#768d1e" class="fa-solid fa-bell"></i> Ngày báo deadline: ${
                              task.remindDate || ""
                            }
                            </div>
                          </div>
                          <div class="task_item item_detail" style="gap: 2px;">
                            <div>
                             <i style="color: #354b8b;" class="fa-solid fa-calendar-plus"></i> Ngày hoàn thành: ${
                               task.completeDate || ""
                             }
                            </div>
                          </div>
                           <div class="task_item item_detail" style="gap: 2px;">
                            <div>
                              <i  style="color:#2746bb" class="fa-solid fa-snowflake"></i> Chi tiết : ${
                                task.note || ""
                              }
                            </div>
                          </div>
                        </div>
                      `);

                        setLable("Xem chi tiết công việc");
                        setCheckView(2);
                      }}
                    >
                      <i class="fa-solid fa-eye me-1"></i>
                      <span> Xem </span>
                    </div>

                    {setPQDuyen && (
                      <div
                        onClick={(e) => {
                          if (handleSetting) {
                            handleSetting({
                              action: 2, // Đặt tên key cho đúng
                              id: task.id, // Đảm bảo truyền ID đúng
                            });
                            handleClick(e);
                          }
                        }}
                      >
                        <i className="fa-solid fa-pen-to-square me-1"></i>
                        <span>Sửa</span>
                      </div>
                    )}
                    {isIDLogin == "VNManh" && (
                      <div
                        data-id={task.id}
                        onClick={(e) => {
                          handleShow(e);
                          setLableBody("Bạn muốn xóa công việc này");
                          setLable("Thông báo");
                          setCheckView(1);
                        }}
                        style={{ boxShadow: "none" }}
                      >
                        <i
                          style={{ color: "REd" }}
                          className="fa-solid fa-trash me-1"
                        ></i>
                        <span> Xóa </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="task-title" style={{ fontSize: "14px" }}>
                <i
                  className="fa-solid fa-splotch me-1"
                  style={{ color: "#9b88fd" }}
                ></i>
                Mô tả: {task.description}
              </p>

              <div className="task_item" style={{ gap: "2px" }}>
                <div className="user-names">
                  <p>
                    <i
                      style={{ color: "#8ec311" }}
                      className="fas fa-user me-1"
                    ></i>
                    Giao việc: {task.requester}
                  </p>
                </div>
              </div>
              <div className="task_item" style={{ gap: "2px" }}>
                <div className="user-names">
                  <p>
                    <i className="fas fa-user me-1"></i>Thực hiện:{" "}
                    {task.implementer}
                  </p>
                </div>
              </div>
              <div className="task_item" style={{ gap: "2px" }}>
                <p>
                  <i className="fas fa-clock "></i> Ngày:{" "}
                  {`${task.fromDate} - ${task.toDate}`}
                </p>
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
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton={!show}>
          <Modal.Title id="popupModalLabel">{isLable}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: IsLableBody }}></div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {isCheckView == 1 ? "Hủy" : "Đóng"}
          </Button>
          {isCheckView == 1 && (
            <Button onClick={() => handleCliCk()} variant="primary">
              Đồng ý
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <Modal
        show={isShowHT}
        // onHide={false}
        dialogClassName="modal-dialog-centered"
        aria-labelledby="popupModalLabel"
        backdrop="static"
        keyboard={false}
        className="modalHT"
      >
        <Modal.Header closeButton={false}>
          <Modal.Title id="popupModalLabel">Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn xác nhận hoàn thành công việc này</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHT(false)}>
            Hủy
          </Button>
          <Button onClick={() => handleHT(isIDHT, "PostHT")} variant="primary">
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskColumn;
