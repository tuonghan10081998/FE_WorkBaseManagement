import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import iziToast from "izitoast";
const PopAchivement = ({
  selectedYear,
  selectedMonth,
  data,
  setShow,
  setIsShow,
  setAdd,
}) => {
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    year: "",
    month: "",
    images: "",
    imageapi: "",
  });
  const [isDisable, setDisable] = useState(false);
  const IMG_API = process.env.REACT_APP_URL_IMG;

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setFormData({
        id: data[0].id || "",
        title: data[0].title || "",
        images: data[0].images || "",
        imageapi: data[0].imageapi || null,
        year: data[0].year,
        month: data[0].month,
      });
    } else {
      setFormData({
        id: 0,
        title: "",
        images: "",
        imageapi: null,
        year: selectedYear,
        month: selectedMonth,
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
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

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert("Vui lòng nhập đầy đủ tiêu đề.");
      return;
    }
    setDisable(true);

    var object = {
      id: formData.id,
      title: formData.title,
      images: formData.images,
      year: formData.year,
      month: formData.month,
    };
    PostSave(object);
  };
  const PostSave = async (arrPost) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}Achivement/Post`,
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
    if (data.status == "OK") {
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
                    onClick={() => setShow(false)}
                    class="btn-close-custom"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <form>
                <div className="row">
                  <div className="col-12 col-md-12 p-2">
                    <label className="form-label" htmlFor="title1">
                      Tiêu đề
                    </label>
                    <input
                      className="form-control"
                      id="title"
                      type="text"
                      placeholder=""
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6 p-2">
                    <label className="form-label" htmlFor="imageInput">
                      Chọn hình ảnh
                    </label>
                    <input
                      className="form-control"
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="col-12 col-md-6 p-2 d-flex align-items-center justify-content-center">
                    <img
                      src={formData.imageapi}
                      className="img-fluid "
                      style={{ height: "200px" }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div
                    className="d-flex  p-0 py-2"
                    style={{
                      background: "#Fff",
                      paddingBottom: "4px",
                    }}
                  >
                    <button
                      disabled={isDisable}
                      onClick={(e) => handleSave(e)}
                      style={{ marginLeft: "auto" }}
                      type="submit"
                      className={`btn btn-primary  mt-3
                 
                          }`}
                    >
                      <i className="fas fa-paper-plane"></i>{" "}
                      {data.length > 0 ? "Cập nhật" : "Lưu"}
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

export default PopAchivement;
