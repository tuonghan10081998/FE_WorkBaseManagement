import React, { useState, useContext, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import iziToast from "izitoast";
const ModalNVUserLeader = ({
  setShow,
  setIsShow,
  dataNV,
  dataOption,
  setID,
}) => {
  const [isDataNV, setDataNV] = useState([]);
  const [isDataNVF, setDataNVF] = useState([]);
  const [isPhongBanValue, setPhongBanValue] = useState("");
  const [isNhanVien, setNhanVien] = useState("");
  const [isDisable, setDisable] = useState(false);
  const handleChange = (option) => {
    setPhongBanValue(option);
  };
  const handleChangeCheck = (e, id, isChecked) => {
    const newData = isDataNV.map((x) => {
      return x.userID === id ? { ...x, isChecked: isChecked } : x;
    });
    setDataNV(newData);
  };

  useEffect(() => {
    dataNV && setDataNV(dataNV);
  }, [dataNV]);
  useEffect(() => {
    let dataNVF = isDataNV.filter(
      (x) =>
        x.fullName &&
        x.fullName.toLowerCase().includes(isNhanVien.toLowerCase()) &&
        x.userID !== setID
    );
    if (isPhongBanValue.value && isPhongBanValue.value != "all") {
      dataNVF = dataNVF.filter((x) => x.dep_Code === isPhongBanValue.value);
    }
    setDataNVF(dataNVF);
  }, [isPhongBanValue, isNhanVien, isDataNV]);
  const handleSave = (e) => {
    e.preventDefault();
    var arrSave = [];
    const dataSave = isDataNV;
    if (dataSave.length === 0) return;
    dataSave.map((x) => {
      let object = {
        id: x.id,
        idLeader: setID,
        userID: x.userID,
        isChecked: x.isChecked,
      };
      arrSave.push(object);
    });
    PostSave(arrSave);
  };
  const PostSave = async (arrPost) => {
    setDisable(true);
    const request = new Request(
      `${process.env.REACT_APP_URL_API}User/PostUserLeader`,
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
    if (data.statusCode == "200") {
      iziToast.success({
        title: "Success",
        message: data.message,
        position: "topRight",
      });
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
    <Modal
      show={setIsShow}
      // onHide={setShowH(false)}
      dialogClassName="modal-dialog-centered custom-modal-dialog"
      aria-labelledby="popupModalHeader"
      backdrop="static"
      keyboard={false}
      className="popupModalCreateLeave"
    >
      <Modal.Body>
        {" "}
        <div className="">
          <div className="card">
            <div className="card-body cardbody">
              <div className="row headerDuAn">
                <div className="col-8 p-0 m-0">
                  <h2
                    style={{ textAlign: "left", fontSize: "28px" }}
                    className="card-title   font-weight-bold  "
                  >
                    Thông tin
                  </h2>
                </div>
                <div className="col-4 p-0 m-0 d-flex justify-content-end">
                  <button
                    onClick={() => setShow((prev) => !prev)}
                    class="btn-close-custom"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <form>
                <div className="col-md-12 col-lg-12 position-relative mt-2">
                  <div className="card">
                    <ul className="list-group list-group-flush">
                      <div className="row">
                        {" "}
                        <div className="col-6">
                          <label
                            style={{ fontWeight: "bold", fontSize: "17px" }}
                          >
                            Phòng ban{" "}
                          </label>{" "}
                          <Select
                            options={dataOption}
                            value={isPhongBanValue}
                            onChange={handleChange}
                            placeholder="-- Tất cả --"
                            isSearchable
                          />
                        </div>
                        <div className="col-6">
                          <label
                            style={{ fontWeight: "bold", fontSize: "17px" }}
                          >
                            Nhân viên
                          </label>{" "}
                          <input
                            type="text"
                            id="projectFilter"
                            className="form-control mr-2 mb-2"
                            placeholder=""
                            value={isNhanVien}
                            onChange={(e) => setNhanVien(e.currentTarget.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <li className="list-group-item ">
                          <div
                            className="tilteLI sttPQ"
                            style={{ width: "100px" }}
                          >
                            Chọn
                          </div>
                          <div className="gridUL row m-0 p-0  w-100">
                            <span className="tilteLI pqul col-12"> Họ tên</span>
                          </div>
                        </li>
                      </div>
                      <div
                        className="listTK"
                        style={{ maxHeight: "calc(100vh - 430px)" }}
                      >
                        {" "}
                        {isDataNVF.map((x, index) => (
                          <li
                            key={index}
                            className={`list-group-item
                            }`}
                          >
                            <div className="sttPQ" style={{ width: "100px" }}>
                              {" "}
                              <input
                                style={{ width: "20px", height: "20px" }}
                                onChange={(e) =>
                                  handleChangeCheck(
                                    e,
                                    x.userID,
                                    x.isChecked == 1 ? 0 : 1
                                  )
                                }
                                type="checkbox"
                                checked={x.isChecked == 1}
                              />
                            </div>
                            <div className="gridUL row m-0 p-0  w-100">
                              <span className=" pqul  col-12">
                                {x.fullName || ""}
                              </span>
                            </div>
                          </li>
                        ))}
                      </div>
                    </ul>
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
      </Modal.Body>
    </Modal>
  );
};
export default ModalNVUserLeader;
