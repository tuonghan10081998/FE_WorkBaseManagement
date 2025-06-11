import React, { useEffect, useState } from "react";
import moment from "moment";
import iziToast from "izitoast";
import { Modal, Button } from "react-bootstrap";
const ProjectColumn = ({
  status,
  tasks,
  handleSetting,
  setIDDelete,
  setPQDuyen,
  setCheckAdd,
}) => {
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const [show, setShow] = useState(false);
  const [isIDData, setIDDate] = useState(null);
  const [isShowHT, setShowHT] = useState(false);
  const [isIDHT, setIDHT] = useState(null);
  const [isLable, setLable] = useState(null);
  const [IsLableBody, setLableBody] = useState(null);
  const [isCheckView, setCheckView] = useState("");
  const [isFeedBack, setFeedBack] = useState("abcc");
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
    console.log(data);
    const d = data[0];
    var arrHT = [];
    const object = {
      id: d.id,
      taskName: d.taskName,
      description: d.description,
      priority: d.priority.toString(),
      note: d.note,
      idRequester: d.idRequester,
      createDate: moment().format("YYYY-MM-DD"),
      fromDate: moment(d.fromDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      toDate: moment(d.toDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      completeDate: moment().format("YYYY-MM-DD"),
      idApprover: "",
      statusHT: 1,
      lstIDImlement: d.idImplementer.split(","),
    };
    arrHT.push(object);
    PostSave(object, NameValue);
  };
  window.handleFeedbackChange = function (val) {
    setFeedBack(val);
  };
  const PostSave = async (arrPost, NameValue) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}Task/${NameValue}`,
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
  const handleCliCk = (e) => {
    e.preventDefault();
    isCheckView == 1 && handleClickDelete();
    isCheckView == 2 && handleFeedBack();
  };
  const handleFeedBack = () => {
    const object = {
      id: isIDData,
      userID: isUser,
      FeedBacck: isFeedBack,
    };
  };
  const PostFB = async (arrPost) => {
    const request = new Request(`${process.env.REACT_APP_URL_API}Task}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arrPost),
    });
    let response = await fetch(request);
    let data = await response.json();
    if (data.status == "OK") {
      iziToast.success({
        title: "Success",
        message: `Lưu thành công`,
        position: "topRight",
      });

      setCheckAdd((prev) => !prev);
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
    <div className="col-md-6 col-lg-3" style={{ padding: "0 10px" }}>
      <div className="task-column">
        <div
          onClick={(e) => handleClickScroll(e)}
          className={`bg-${statusClass}  text-white p-2 rounded d-flex justify-content-between align-items-center`}
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
              data-project={task.taskName}
              data-status={task.status}
              data-id={task.id}
              data-date={`${task.implementDate} - ${task.completeDate}`}
            >
              <div className="editCart">
                <div>
                  {" "}
                  <p className="duan" style={{ fontSize: "17px" }}>
                    <i
                      style={{ color: "#6ba323" }}
                      className="fa-solid fa-briefcase"
                    ></i>{" "}
                    {task.ticket} - {task.taskName}
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
                    {/* setPQDuyen !== "Member" && */}
                    {task.statusHT !== "1" && (
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
                            Dự án: ${task.taskName}
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
                              <div>
                                <i style="color: #894141;
                            font-size: 21px;" class="fa-solid fa-person-dress me-1"
                         ></i> Trách nhiệm: ${task.responsible}
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
                              <i  style="color:#2746bb" class="fa-solid fa-snowflake"></i> Chi tiết :
                               <div style="margin-left: 20px;">${
                                 task.note || ""
                               }</div> 
                            </div>
                          </div>
                          
                      </div>
                      `);
                        setLable("Xem chi tiết dự án");
                        setCheckView(2);
                      }}
                    >
                      <i class="fa-solid fa-eye me-1"></i>
                      <span> Xem </span>
                    </div>
                    {(setPQDuyen !== "Member" ||
                      task.idRequester === isUser) && (
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
                    {setPQDuyen === "Administrator" && (
                      <div
                        data-id={task.id}
                        onClick={(e) => {
                          handleShow(e);
                          setLableBody("Bạn muốn xóa dự án này");
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
                    <i
                      style={{ color: "rgb(116 117 133)", fontSize: "18px" }}
                      class="fa-solid fa-person-dress me-1"
                    ></i>
                    Trách nhiệm: {task.responsible}
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
                  {`${moment(task.fromDate, "DD/MM/YYYY").format(
                    "DD/MM"
                  )} - ${moment(task.toDate, "DD/MM/YYYY").format("DD/MM")}`}
                </p>
                {status === 3 && (
                  <div>
                    <i
                      style={{
                        color: `${task.statusHT === "1" ? "#4952b5" : "red"}`,
                      }}
                      class="fa-solid fa-flag"
                    ></i>
                  </div>
                )}
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
        <Modal.Header closeButton={!show}>
          <Modal.Title id="popupModalLabel">{isLable}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: IsLableBody }}></div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          {isCheckView == 1 && (
            <Button onClick={(e) => handleCliCk(e)} variant="primary">
              {isCheckView == 1 ? "Đồng ý" : "Lưu FeedBack"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <Modal
        show={isShowHT}
        // onHide={false}
        dialogClassName="modal-dialog-centered"
        aria-labelledby="popupModalLabel"
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

export default ProjectColumn;
