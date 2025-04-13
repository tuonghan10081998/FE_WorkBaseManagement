import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
const TaskCard = ({ task, setClickCardID, setClick, setIDDeleteColumn }) => {
  const [show, setShow] = useState(false);
  const [isIDData, setIDDate] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    let ID = e.currentTarget.dataset.id;
    setIDDate(ID);
    setShow(true);
  };
  const handleClick = (e) => {
    let ID = e.currentTarget.dataset.id;
    setClickCardID(ID);
    setClick((x) => !x);
  };
  const handleClickDelete = (value) => {
    setIDDeleteColumn(isIDData);
    setShow(false);
  };
  const handleClicksetting = (e) => {
    const parent = e.currentTarget.closest(".carticon");
    const child = parent.querySelector(".popupsettingCart");
    if (child) {
      // child.classList.toggle("active");
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
  return (
    <div
      className="task-card"
      data-project={task.workName}
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
            Công việc: {task.workName}
          </p>
        </div>
        <div className="carticon position-relative">
          <i
            data-id={task.id}
            onClick={(e) => handleClicksetting(e)}
            className="fa-solid fa-gear"
            style={{ color: "#89915e" }}
          ></i>
          <div className="popupsettingCart popupsettingCV">
            <div
              data-id={task.id}
              onClick={(e) => {
                handleClick(e);
                handleClicksetting(e);
              }}
              className={`${4 == 1 ? "d-none" : ""}`}
            >
              <i className="fa-solid fa-street-view me-1"></i>Hoàn thành và cập
              nhật
            </div>
            <div
              data-id={task.id}
              onClick={(e) => {
                handleShow(e);
                handleClicksetting(e);
              }}
              style={{ boxShadow: "none" }}
            >
              <i
                style={{ color: "REd" }}
                className="fa-solid fa-trash me-1"
              ></i>
              Xóa công việc
            </div>
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
            <i className="fas fa-user"></i> {task.implementer}
          </p>
        </div>
        <p>
          <i className="fas fa-clock"></i>{" "}
          {`${task.implementDate} - ${task.completeDate}`}
        </p>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-dialog-centered"
        aria-labelledby="popupModalLabel"
        className="modalHT"
      >
        <Modal.Header closeButton>
          <Modal.Title id="popupModalLabel">Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn xác nhận xóa công việc này</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={() => handleClickDelete()} variant="primary">
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskCard;
