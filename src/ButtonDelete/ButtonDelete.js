import { useRef, useEffect, useState, useContext } from "react";

import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "izitoast/dist/css/iziToast.min.css";
import iziToast from "izitoast";
const ButtonDelete = ({ setData, setShowUp, setDelete, setShowPopup }) => {
  const [show, setShow] = useState(false);
  const [isShowButton, setShowButton] = useState(true);
  const [isIDData, setIDDate] = useState(null);
  useEffect(() => {
    if (setData?.length > 0) setShowButton(!setShowUp);
  }, [setShowUp]);
  useEffect(() => {
    if (setData?.length > 0) {
      setIDDate(setData[0].id);
    }
  }, [setData]);
  const handleClickDelete = () => {
    setShowPopup((prev) => !prev);
    setDelete(isIDData);
    setShow(false);
  };

  return (
    <div
      className={`${!isShowButton ? "d-flex" : "d-none"}`}
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        gap: 10,
        marginLeft: "auto",
      }}
    >
      <button onClick={() => setShow(true)} className="buttonDL" type="button">
        <span className="buttonDL__text">Xóa</span>
        <span className="buttonDL__icon">
          <svg
            className="svg"
            height={512}
            viewBox="0 0 512 512"
            width={512}
            xmlns="http://www.w3.org/2000/svg"
          >
            <title />
            <path
              d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320"
              style={{
                fill: "none",
                stroke: "#fff",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 32,
              }}
            />
            <line
              style={{
                stroke: "#fff",
                strokeLinecap: "round",
                strokeMiterlimit: 10,
                strokeWidth: 32,
              }}
              x1={80}
              x2={432}
              y1={112}
              y2={112}
            />
            <path
              d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40"
              style={{
                fill: "none",
                stroke: "#fff",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 32,
              }}
            />
            <line
              style={{
                fill: "none",
                stroke: "#fff",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 32,
              }}
              x1={256}
              x2={256}
              y1={176}
              y2={400}
            />
            <line
              style={{
                fill: "none",
                stroke: "#fff",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 32,
              }}
              x1={184}
              x2={192}
              y1={176}
              y2={400}
            />
            <line
              style={{
                fill: "none",
                stroke: "#fff",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 32,
              }}
              x1={328}
              x2={320}
              y1={176}
              y2={400}
            />
          </svg>
        </span>
      </button>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-dialog-centered"
        aria-labelledby="popupModalLabel"
        className="modalHT"
      >
        <Modal.Header closeButton>
          <Modal.Title id="popupModalLabel">Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn muốn xóa công việc này</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
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
export default ButtonDelete;
