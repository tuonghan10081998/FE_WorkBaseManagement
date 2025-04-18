import React, { useState, useMemo, useEffect } from "react";
import "../CongViecList/ListCV.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "../CongViecList/GridCV.css";
import "../PhanQuyen/PhanQuyen.css";
import { Modal, Button } from "react-bootstrap";
import iziToast from "izitoast";
const PQPhongBan = ({ isData, onchange, setCheckAdd }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isDepCode, setDepCode] = useState("");
  const [isDepName, setDepName] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    if (isDepCode == "") {
      handleNotifi("nhập mã phòng ban");
      return;
    }
    if (isDepName == "") {
      handleNotifi("nhập tên phòng ban");
      return;
    }

    const object = {
      id: 0,
      dep_Code: isDepCode,
      dep_Name: isDepName,
    };
    PostSave(object);
  };
  const PostSave = async (arrPost) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}Department/Post`,
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
      setShowPopup(false);
      setDepCode("");
      setDepName("");
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Lưu thất bại`,
        position: "topRight",
      });
    }
  };
  const handleNotifi = (value) => {
    iziToast.warning({
      title: "Warning",
      message: `Vui lòng  ${value}`,
      position: "topRight",
    });
  };
  return (
    <div
      className="grid-table w-100 position-relative"
      style={{ padding: "12px" }}
    >
      <div className="itemtableNamePQ">
        <div className="item-table ">
          <table className="task-table">
            <thead>
              <tr>
                <td className="text-center theadSpan tilteLI">
                  <div>Chọn</div>
                </td>
                <td className="tilteLI">Phòng ban</td>
              </tr>
            </thead>
            <tbody className="tbody">
              {isData.map((row) => {
                return (
                  <tr>
                    <td className="box-wrap">
                      <div>
                        <input
                          onChange={(e) =>
                            onchange(row.dep_Code, row.isChecked == 1 ? 0 : 1)
                          }
                          type="checkbox"
                          checked={row.isChecked == 1}
                        />
                      </div>
                    </td>
                    <td
                      style={{
                        maxWidth: "300px",
                        minWidth: "250px",
                        textAlign: "left",
                      }}
                      className=""
                    >
                      {row.dep_Name}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="addPB">
            <button
              onClick={() => setShowPopup(true)}
              class="btn btn-primary mr-2"
            >
              <i class="fas fa-plus"></i> Thêm phòng ban
            </button>
          </div>
        </div>
      </div>
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
              <h4 className="card-title text-center mb-4">Thêm phòng ban</h4>
              <div
                onClick={(e) => setShowPopup(false)}
                className="mb-4"
                style={{ marginLeft: "auto" }}
              >
                <i className="fa-solid fa-xmark canclePQ"></i>
              </div>
            </div>
            <form>
              <div className="mb-3">
                <label htmlFor="dep_Code" className="form-label">
                  Mã phòng ban
                </label>
                <input
                  type="text"
                  id="dep_Code"
                  name="dep_Code"
                  className="form-control"
                  value={isDepCode}
                  onChange={(e) => setDepCode(e.currentTarget.value)}
                  autoComplete="off"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="dep_Name" className="form-label">
                  Tên phòng ban
                </label>
                <input
                  type="text"
                  id="dep_Name"
                  name="dep_Name"
                  className="form-control"
                  value={isDepName}
                  onChange={(e) => setDepName(e.currentTarget.value)}
                  autoComplete="off"
                />
              </div>
              <div className="d-flex justify-content-end">
                <button
                  onClick={(e) => handleSave(e)}
                  type="submit"
                  className="btn btn-primary"
                >
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PQPhongBan;
