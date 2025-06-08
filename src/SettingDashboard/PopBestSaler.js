import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import iziToast from "izitoast";

const PopBestSaler = ({
  selectedYear,
  selectedMonth,
  data,
  setShow,
  setIsShow,
  setAdd,
}) => {
  const [id, setId] = useState(0);
  const [money, setMoney] = useState(0);
  const [note, setNote] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [isDisable, setDisable] = useState(false);
  const [isReadOnly, setReadOnly] = useState(false);

  const [optionsPB, setOptionsPB] = useState([]);
  const [optionsNV, setOptionsNV] = useState([]);
  const [selectedPB, setSelectedPB] = useState(null);
  const [selectedNV, setSelectedNV] = useState(null);
  const [isDataNV, setDataNV] = useState(null);

  const getPhongBan = async () => {
    const url = `${process.env.REACT_APP_URL_API}Department/Get?action=get`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);

      const result = await response.json();
      const formatted = [
        { value: "all", label: "Tất cả" },
        ...result.map((x) => ({
          value: x.dep_Code,
          label: x.dep_Name,
        })),
      ];
      setOptionsPB(formatted);
    } catch (error) {
      console.error(error);
    }
  };

  const getNhanVien = async () => {
    const url = `${process.env.REACT_APP_URL_API}User/Get?action=Get`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);

      const result = await response.json();
      let filtered = result.filter((x) => x.fullName.toLowerCase() !== "admin");

      if (selectedPB && selectedPB.value !== "all") {
        filtered = filtered.filter((x) => x.dep_Code === selectedPB.value);
      }
      const formatted = filtered.map((x) => ({
        value: x.userID,
        label: x.fullName,
        dep_Code: x.dep_Code,
        dep_Name: x.dep_Name,
      }));
      setDataNV(formatted);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPhongBan();
  }, []);
  useEffect(() => {
    if (!isDataNV) return;
    let isDataNVF = isDataNV;
    if (selectedPB && selectedPB.value !== "all") {
      isDataNVF = isDataNVF.filter((x) => x.dep_Code === selectedPB.value);
    }
    setOptionsNV(isDataNVF);

    if (data.length > 0) {
      const selected = isDataNVF.find((x) => x.value === data[0].userID);
      if (selected) setSelectedNV(selected);
    } else {
      setSelectedNV(null);
    }
  }, [isDataNV, selectedPB, data]);

  useEffect(() => {
    if (optionsPB.length > 0) {
      if (data.length > 0) {
        const selected = optionsPB.find((x) => x.label === data[0].depName);
        if (selected) setSelectedPB(selected);
      } else {
        setSelectedPB(optionsPB[0]);
      }
    }
  }, [optionsPB, data]);
  useEffect(() => {
    getNhanVien();
  }, []);
  useEffect(() => {
    if (data.length > 0) {
      const d = data[0];
      setId(d.id || 0);
      setMoney(d.money || 0);
      setNote(d.note || "");
      setYear(d.year || selectedYear);
      setMonth(d.month || selectedMonth);
      setReadOnly(true);
    } else {
      setId(0);
      setMoney(0);
      setNote("");
      setYear(selectedYear);
      setMonth(selectedMonth);
      setReadOnly(false);
    }
  }, [data, selectedYear, selectedMonth]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedNV || !selectedPB) {
      iziToast.warning({
        title: "Cảnh báo",
        message: "Vui lòng chọn  nhân viên.",
        position: "topRight",
      });
      return;
    }
    setDisable(true);
    const object = {
      id,
      userID: selectedNV.value,
      money,
      note,
      year,
      month,
    };
    const response = await fetch(
      `${process.env.REACT_APP_URL_API}BestSaler/Post`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      }
    );
    const result = await response.json();
    setDisable(false);

    if (result.status === "OK") {
      iziToast.success({
        title: "Thành công",
        message: "Lưu thành công",
        position: "topRight",
      });
      setShow(false);
      setAdd((prev) => !prev);
    } else {
      iziToast.error({
        title: "Lỗi",
        message: "Lưu thất bại",
        position: "topRight",
      });
    }
  };

  return (
    <Modal
      show={setIsShow}
      dialogClassName="modal-dialog-centered custom-modal-dialog"
      aria-labelledby="popupModalHeader"
      backdrop="static"
      keyboard={false}
      className="popupModalCreateLeave"
    >
      <Modal.Body>
        <div className="card">
          <div className="card-body cardbody">
            <div className="row headerDuAn">
              <div className="col-8">
                <h2
                  className="card-title font-weight-bold"
                  style={{ fontSize: 28 }}
                >
                  Thông tin
                </h2>
              </div>
              <div className="col-4 d-flex justify-content-end">
                <button
                  onClick={() => setShow(false)}
                  className="btn-close-custom"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <form>
              <div className="row">
                <div className="col-12 col-md-6 p-2">
                  <label>Phòng ban</label>
                  <Select
                    isDisabled={isReadOnly}
                    options={optionsPB}
                    value={selectedPB}
                    onChange={setSelectedPB}
                    isSearchable
                  />
                </div>
                <div className="col-12 col-md-6 p-2">
                  <label>Nhân viên</label>
                  <Select
                    isDisabled={isReadOnly}
                    options={optionsNV}
                    value={selectedNV}
                    onChange={setSelectedNV}
                    placeholder="Chọn nhân viên"
                    isSearchable
                  />
                </div>
                <div className="col-12 col-md-6 p-2">
                  <label>Doanh số</label>
                  <input
                    type="text"
                    className="form-control"
                    value={money}
                    onChange={(e) => setMoney(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-6 p-2">
                  <label>Ghi chú</label>
                  <input
                    type="text"
                    className="form-control"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="d-flex py-2" style={{ background: "#fff" }}>
                  <button
                    disabled={isDisable}
                    onClick={handleSave}
                    style={{ marginLeft: "auto" }}
                    className="btn btn-primary mt-3"
                  >
                    <i className="fas fa-paper-plane"></i>{" "}
                    {data.length > 0 ? "Cập nhật" : "Lưu"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PopBestSaler;
