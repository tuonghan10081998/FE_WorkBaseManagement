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
  const IMG_API = process.env.REACT_APP_URL_IMG;
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const [messages, setMessages] = useState([]);
  const [isAvatar, setAvatar] = useState("");
  const [isWord, setWord] = useState(null);
  const getMess = async (idWord) => {
    var url = `${process.env.REACT_APP_URL_API}Work/GetFeedbackV2?IDWork=${idWord}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data);
      getData();
    } catch (error) {
      console.error(error.message);
    }
  };
  const getData = async () => {
    if (isUser == "") return;
    const url = `${process.env.REACT_APP_URL_API}User/Get?action=get&para1=${isUser}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);

      const data = await response.json();
      const d = data[0];
      console.log(d);
      setAvatar(`${d.avatar ?? "Default/UserDefault.png"}`);
    } catch (error) {
      console.error(error.message);
    }
  };
  const renderMessages = () => {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";

    messages.forEach((msg) => {
      const isCurrentUser = msg.userID === isUser;
      const userInfo = msg.userName;
      const imageUrl = `${IMG_API}${
        msg.avatar?.trim() ? msg.avatar : "Default/UserDefault.png"
      }`;

      const messageHTML = `
        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center mb-1">
            ${
              isCurrentUser
                ? `<p class="text-secondary small mb-0">${msg.createDate}</p>
                 <p class="fw-semibold mb-0 text-dark">${userInfo}</p>`
                : `<p class="fw-semibold mb-0 text-dark">${userInfo}</p>
                 <p class="text-secondary small mb-0">${msg.createDate}</p>`
            }
          </div>
          <div class="d-flex align-items-start gap-3 ${
            isCurrentUser ? "justify-content-end" : ""
          }">
            ${
              !isCurrentUser
                ? `<img src="${imageUrl}" class="rounded-circle flex-shrink-0" width="40" height="40" alt=""/>`
                : ""
            }
            <p class="mb-0 ${isCurrentUser ? "msg-right" : "msg-left"}">${
        msg.message
      }</p>
            ${
              isCurrentUser
                ? `<img src="${imageUrl}" class="rounded-circle flex-shrink-0" width="40" height="40" alt=""/>`
                : ""
            }
          </div>
        </div>
      `;

      chatBox.insertAdjacentHTML("beforeend", messageHTML);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  };

  window.handleSend = () => {
    const input = document.getElementById("chat-input");
    const text = input.innerText.trim();
    if (!text) return;

    const newMessage = {
      id: 0,
      idWork: isWord.toString(),
      message: text,
      files: "",
      userID: isUser,
      userName: isIDLogin,
      avatar: isAvatar,
      createDate: moment().format("DD/MM/YY HH:mm:ss"),
    };
    const Save = {
      id: 0,
      idWork: isWord.toString(),
      message: text,
      file: "",
      userID: isUser,
      createDate: "2025-08-07T17:34:50.513Z",
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages); // ✅ Cập nhật đúng cách
    input.innerText = "";
    SaveMess(Save);
  };
  const SaveMess = async (arr) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}Work/PostFeedbackV2`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arr),
      }
    );
    let response = await fetch(request);
    let data = await response.json();
  };
  const [show, setShow] = useState(false);
  const [isIDData, setIDDate] = useState(null);
  const [isShowHT, setShowHT] = useState(false);
  const [isIDHT, setIDHT] = useState(null);
  const [isLable, setLable] = useState(null);
  const [IsLableBody, setLableBody] = useState(null);
  const [isCheckView, setCheckView] = useState("");
  const [isFeedBack, setFeedBack] = useState("");
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
  window.handleFeedbackChange = function (val) {
    setFeedBack(val);
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
      idUserFeedback: "",
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
    isCheckView == 2 && handleFeedBack();
  };

  const handleFeedBack = () => {
    const object = {
      id: isIDData,
      ticket: "string",
      workName: "string",
      description: "string",
      priority: 0,
      note: "string",
      idRequester: "string",
      createDate: "2025-04-16T16:47:16.878Z",
      fromDate: "2025-04-16T16:47:16.878Z",
      remindDate: "2025-04-16T16:47:16.878Z",
      toDate: "2025-04-16T16:47:16.878Z",
      completeDate: "2025-04-16T16:47:16.878Z",
      idResponsible: "string",
      idApprover: "string",
      feedback: isFeedBack,
      statusHT: 0,
      statusRemind: 0,
      lstIDImplementer: ["string"],
      idUserFeedback: isUser,
    };
    PostFB(object);
  };

  const PostFB = async (arrPost) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}Work/PostFeedback`,
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
      setShow(false);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Lưu thất bại`,
        position: "topRight",
      });
    }
  };
  window.handleDownFile = (e) => {
    const id = e.getAttribute("data-id");
    const dataF = tasks.filter((x) => x.id.toString() === id.toString());

    const thoigian = moment(dataF[0].createDate, "DD/MM/YYYY").format(
      "YYYYMMDD"
    );
    const file = dataF[0].requestFile;
    downLoad(thoigian, file);
  };
  const downLoad = async (thoigian, file) => {
    const url = `${process.env.REACT_APP_URL_API}Work/Download?thoiGian=${thoigian}&fileName=${file}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const blob = await response.blob(); // 👈 lấy file dưới dạng blob

      // Tạo link download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = file; // 👈 đặt tên file khi tải về
      link.click();

      // Clean up
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Lỗi khi tải file:", error.message);
    }
  };
  useEffect(() => {
    const chatBox = document.getElementById("chat-box");
    if (chatBox) {
      renderMessages();
    }
  }, [IsLableBody, messages]);
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
                    {task.ticket} - {task.workName}
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
                    {/* && setPQDuyen !== "Member" */}
                    {task.statusHT !== "1" && (
                      <div
                        data-id={task.id}
                        onClick={(e) => {
                          handleShowHT(e);
                          handleClickOutside(e);
                        }}
                      >
                        <i className="fa-solid fa-street-view me-1"></i>
                        <span>Hoàn thành</span>
                      </div>
                    )}
                    <div
                      data-id={task.id}
                      onClick={(e) => {
                        getMess(task.id);
                        setWord(task.id);
                        handleShow(e);
                        setLableBody(`
                        <div>
                          <p class="duan" style="font-size: 17px;font-weight: bold;">
                            <i style="color: #6ba323;" class="fa-solid fa-briefcase"></i>
                            ${task.ticket} - ${task.workName}
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
                              <div>
                                <i style="color: #256A9D;"  class="fas fa-user me-1"></i> Thực hiện: ${
                                  task.implementer
                                }
                              </div>
                            </div>
                          </div>

                          <div class="task_item item_detail" style="gap: 2px;">
                            <div>

                             <i style="color: #C16262;" class="fas fa-clock"></i> Ngày: ${moment(
                               task.fromDate,
                               "DD/MM/YYYY HH:mm:ss"
                             ).format("DD/MM/YY HH:mm")} - ${moment(
                          task.toDate,
                          "DD/MM/YYYY HH:mm:ss"
                        ).format("DD/MM/YY HH:mm")}
                            </div>
                          </div>
                          <div class="task_item item_detail" style="gap: 2px;">
                            <div>
                            <i style="color:#768d1e" class="fa-solid fa-bell"></i> Ngày báo deadline: 
                            ${
                              task.remindDate
                                ? moment(
                                    task.remindDate,
                                    "DD/MM/YYYY HH:mm:ss"
                                  ).format("DD/MM/YY HH:mm")
                                : ""
                            }
                           
                            </div>
                          </div>
                          <div class="task_item item_detail" style="gap: 2px;">
                            <div>
                             <i style="color: #354b8b;" class="fa-solid fa-calendar-plus"></i> Ngày hoàn thành: ${
                               task.completeDate
                                 ? moment(
                                     task.completeDate,
                                     "DD/MM/YYYY HH:mm:ss"
                                   ).format("DD/MM/YY HH:mm")
                                 : ""
                             }
                            </div>
                          </div>
                           <div class="task_item item_detail" style="gap: 2px;">
                             <div style="display: flex;justify-content: center;align-items: center;gap: 5px;">
                              <i  style="color:#97bb27" class="fa-solid fa-folder-closed"></i> File đính kèm : 
                              <div style="margin-left: 5px;">${
                                task.requestFile || ""
                              }</div> 
                             </div>
                             <div>
                                <i   onclick="handleDownFile(this)" data-id="${
                                  task.id
                                }" style="display: ${
                          !task.requestFile ? "none" : ""
                        }; color: #0d6efd; cursor: pointer; font-size: 20px;"  class="fa-solid fa-download"></i>
                             </div>
                           
                          </div>
                           <div class="task_item item_detail" style="gap: 2px;">
                            <div>
                              <i  style="color:#2746bb" class="fa-solid fa-snowflake"></i> Chi tiết : 
                              <div style="margin-left: 20px;word-break: break-all;">${
                                task.note || ""
                              }</div> 
                            </div>
                          </div>
                          
                           <div class="task_item item_detail" style="gap: 2px;">
                      <div style="width: 100%;">
                        <i style="color:#f39c12;" class="fa-solid fa-comment-dots"></i> Phản hồi:
                       
                      </div>
                    </div>
                     <!-- Chat UI HTML -->
                   <div class="bg-white d-flex justify-content-center align-items-center ">
                    <div class="border border-secondary rounded shadow-sm w-100" style="max-width: 28rem;">
                      <div class="p-3" style="max-height: 400px; overflow-y: auto;" id="chat-box">
                        <!-- Tin nhắn sẽ được render động ở đây -->
                      </div>
                      <div class="border-top border-secondary d-flex align-items-center px-3 py-2">
                         <div
                          id="chat-input"
                          class="form-control input-message text-secondary small"
                          contenteditable="true"
                          style="max-width: 350px;min-height: 38px; border: 1px solid #ccc; border-radius: 5px; padding: 6px; overflow-wrap: break-word; flex: 1;"
                        ></div>
                        <button aria-label="Gửi tin nhắn" class="btn btn-primary ms-4" onclick="handleSend()" type="submit">
                        <i class="fas fa-paper-plane">
                        </i>
                        </button>
                      
                      </div>
                    </div>
                  </div>
                        </div>
                      `);

                        setLable("Xem chi tiết công việc");
                        handleClickOutside(e);
                        setCheckView(2);
                        setFeedBack(task.feedback);
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
                    {(setPQDuyen === "Administrator" ||
                      task.idRequester === isUser) && (
                      <div
                        data-id={task.id}
                        onClick={(e) => {
                          // handleShowHT(e);
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
                  {`${moment(task.fromDate, "DD/MM/YYYY HH:mm:ss").format(
                    "DD/MM/YY HH:mm"
                  )} - ${moment(task.toDate, "DD/MM/YYYY HH:mm:ss").format(
                    "DD/MM/YY HH:mm"
                  )}`}
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
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton onHide={handleClose}>
          <Modal.Title id="popupModalLabel">{isLable}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: IsLableBody }}></div>
        </Modal.Body>
        {isCheckView == 1 && (
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {isCheckView == 1 ? "Hủy" : "Đóng"}
            </Button>

            <Button onClick={() => handleCliCk()} variant="primary">
              {isCheckView == 1 ? "Đồng ý" : "Lưu FeedBack"}
            </Button>
          </Modal.Footer>
        )}
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
