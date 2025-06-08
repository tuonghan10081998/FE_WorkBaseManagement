import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import iziToast from "izitoast";

const PopBestTeam = ({
  selectedYear,
  selectedMonth,
  data,
  setShow,
  setIsShow,
  setAdd,
}) => {
  const [formData, setFormData] = useState({
    id: 0,
    team: "",
    money: 0,
    note: "",
    year: "",
    month: "",
    images: "",
    imageapi: "",
  });
  const IMG_API = process.env.REACT_APP_URL_IMG;
  const inputRef = useState(null);
  const [isDisable, setDisable] = useState(false);
  const handleFocusInput = (inputRef) => {
    if (inputRef.current) {
      console.log(1);
      inputRef.current.click();
    }
  };
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setFormData({
        id: data[0].id || 0,
        team: data[0].team || "",
        money: data[0].money || 0,
        note: data[0].note || "",
        year: data[0].year,
        month: data[0].month,
        images: data[0].images || "",
        imageapi: data[0].imageapi || null,
      });
    } else {
      setFormData({
        id: 0,
        team: "",
        money: 0,
        note: "",
        year: selectedYear,
        month: selectedMonth,
        images: "",
        imageapi: null,
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "money" ? parseFloat(value) : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.team) {
      alert("Vui lòng nhập tên team.");
      return;
    }

    setDisable(true);
    const object = {
      id: formData.id,
      team: formData.team,
      money: formData.money || 0,
      images: formData.images,
      note: formData.note,
      year: formData.year,
      month: formData.month,
    };

    PostSave(object);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setFormData((prev) => ({
          ...prev,
          images: evt.target.result,
          imageapi: evt.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const PostSave = async (arrPost) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}BestTeam/Post`,
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
    if (data.status === "OK") {
      iziToast.success({
        title: "Success",
        message: `Lưu thành công`,
        position: "topRight",
      });
      setShow(false);
      setAdd((x) => !x);
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
              <div className="col-8 p-0 m-0">
                <h2 className="card-title font-weight-bold">Thông tin</h2>
              </div>
              <div className="col-4 p-0 m-0 d-flex justify-content-end">
                <button
                  onClick={() => setShow(false)}
                  className="btn-close-custom"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="col-12 col-md-6 p-2 d-none">
              <label className="form-label" htmlFor="imageInput">
                Chọn hình ảnh
              </label>
              <input
                ref={inputRef}
                className="form-control"
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <form>
              <div className="row">
                <div className="col-12 col-md-6 p-2">
                  <label className="form-label" htmlFor="team">
                    Tên đội
                  </label>
                  <input
                    className="form-control"
                    id="team"
                    type="text"
                    value={formData.team}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-12 col-md-6 p-2">
                  <label className="form-label" htmlFor="money">
                    Thưởng (VNĐ)
                  </label>
                  <input
                    className="form-control"
                    id="money"
                    type="number"
                    value={formData.money}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-12 col-md-6 p-2">
                  <label
                    htmlFor="projectName"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Avatar</span>
                    <div style={{ cursor: "pointer" }}>
                      <i
                        onClick={() => handleFocusInput(inputRef)}
                        class="fa-solid fa-user-astronaut"
                      ></i>
                    </div>
                  </label>
                  <div className="d-flex justify-content-center align-items-center">
                    <img
                      src={formData.imageapi}
                      width={100}
                      height={100}
                      className="rounded-circle"
                      style={{
                        objectFit: "cover",
                        boxShadow: "0 0 6px rgb(0 0 0 / 0.15)",
                      }}
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 p-2">
                  <label className="form-label" htmlFor="note">
                    Ghi chú
                  </label>
                  <textarea
                    className="form-control"
                    id="note"
                    rows="3"
                    value={formData.note}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>

              <div className="row">
                <div className="d-flex p-0 py-2" style={{ background: "#Fff" }}>
                  <button
                    disabled={isDisable}
                    onClick={handleSave}
                    style={{ marginLeft: "auto" }}
                    type="submit"
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

export default PopBestTeam;
