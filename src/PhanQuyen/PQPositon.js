import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import iziToast from "izitoast";
const PQPositon = ({
  setNhanVien,
  setShowPopup,
  showPopup,
  setIsPosition,
  setUserID,
  setPosition,
  setPositionA,
}) => {
  const handleSave = (e) => {
    e.preventDefault();
    const object = {
      userName: "",
      fullName: "",
      passWord: "",
      email: "",
      telegram: "",
      department: "",
      userID: setUserID,
      position: setIsPosition,
    };
    PostSave(object);
  };
  const PostSave = async (arrPost) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}User/UpdatePosition`,
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
    if (data.statusCode == "200") {
      iziToast.success({
        title: "Success",
        message: data.message,
        position: "topRight",
      });

      setShowPopup((x) => !x);
      setPositionA((x) => !x);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Lưu thất bại`,
        position: "topRight",
      });
    }
  };
  return (
    <div>
      <Modal
        show={showPopup}
        //   onHide={handleClose}
        dialogClassName="modal-dialog-centered "
        aria-labelledby="popupModalHeader"
        backdrop="static"
        keyboard={false}
        className="popupModalCreateLeave"
      >
        <Modal.Body>
          <div className="card p-4 shadow-sm w-100">
            <div className="d-flex">
              <h4 className="card-title text-center mb-4">Cập nhật chức vụ</h4>
              <div
                onClick={(e) => setShowPopup((x) => !x)}
                className="mb-4"
                style={{ marginLeft: "auto" }}
              >
                <i className="fa-solid fa-xmark canclePQ"></i>
              </div>
            </div>
            <form>
              <div className="mb-3">
                <label htmlFor="dep_Code" className="form-label">
                  Nhân viên
                </label>
                <input
                  readOnly={true}
                  type="text"
                  className="form-control"
                  value={setNhanVien}
                  autoComplete="off"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="dep_Name" className="form-label">
                  Chức vục
                </label>
                <input
                  type="text"
                  id="dep_Name"
                  name="dep_Name"
                  className="form-control"
                  value={setIsPosition}
                  onChange={(e) => setPosition(e.currentTarget.value)}
                  autoComplete="off"
                />
              </div>
              <div className="d-flex justify-content-end">
                <button
                  onClick={(e) => handleSave(e)}
                  type="submit"
                  className="btn btn-primary"
                >
                  Cập nhập
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      ;
    </div>
  );
};
export default PQPositon;
