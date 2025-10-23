import { Modal, Button } from "react-bootstrap";
import iziToast from "izitoast";
import React, { useEffect, useState } from "react";
import Select from "react-select";
const PQPositon = ({
  setNhanVien,
  setShowPopup,
  showPopup,
  setIsPosition,
  setUserID,
  setPosition,
  setPositionA,
  setPhongBanS,
  setPhongBanSave,
  setActive,
  setActiveUser,
}) => {
  const [optionsPB, setOptionsPB] = useState([]);
  const [selectedPB, setSelectedPB] = useState(null);
  const [activeStatus, setActiveStatus] = useState(setActive == 1);
  const handleSave = (e) => {
    e.preventDefault();
    const object = {
      userName: "",
      fullName: "",
      passWord: "",
      email: "",
      telegram: "",
      department: selectedPB.value,
      userID: setUserID,
      position: setIsPosition,
      isActive: activeStatus ? 1 : 0,
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
      setPhongBanSave(selectedPB.value);
      setShowPopup((x) => !x);
      setPositionA((x) => !x);
      setActiveUser(!activeStatus);
      setActiveStatus(true);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Lưu thất bại`,
        position: "topRight",
      });
    }
  };
  const getPhongBan = async () => {
    const url = `${process.env.REACT_APP_URL_API}Department/Get?action=get`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);

      const data = await response.json();
      const formattedOptions = data.map((dep) => ({
        value: dep.dep_Code,
        label: dep.dep_Name,
      }));
      setOptionsPB(formattedOptions);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getPhongBan();
  }, []);
  useEffect(() => {
    if (optionsPB.length > 0) {
      const selected = optionsPB.find((x) => x.value === setPhongBanS);
      if (selected) setSelectedPB(selected);
    } else {
      setSelectedPB(optionsPB[0]);
    }
  }, [optionsPB, setPhongBanS]);
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
                <label>Phòng ban</label>
                <Select
                  options={optionsPB}
                  value={selectedPB}
                  onChange={setSelectedPB}
                  isSearchable
                />
              </div>
              <div className="mb-3">
                <label htmlFor="dep_Name" className="form-label">
                  Chức vụ
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
              {/* ✅ Trạng thái Active */}
              <div className="mb-3 d-flex align-items-center justify-content-between">
                <label className="form-label mb-0">Kích hoạt tài khoản</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="activeSwitch"
                    checked={activeStatus}
                    onChange={(e) => {
                      setActiveStatus(e.target.checked);
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="activeSwitch"
                    style={{ cursor: "pointer" }}
                  >
                    {activeStatus ? "Bật" : "Tắt"}
                  </label>
                </div>
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
    </div>
  );
};
export default PQPositon;
