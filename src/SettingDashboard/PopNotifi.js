import React, { useEffect, useState } from "react";

const PopNotifi = ({ selectedYear, selectedMonth, data }) => {
  const [formData, setFormData] = useState({
    id: 0,
    title1: "",
    title2: "",
    year: "",
    month: "",
    image: "",
    imageapi: "",
  });

  const IMG_API = process.env.REACT_APP_URL_IMG;

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setFormData({
        id: data[0].id || "",
        title1: data[0].title1 || "",
        title2: data[0].title2 || "",
        image: data[0].image || "",
        imageapi: data[0].imageapi || null,
        year: data[0].year,
        month: data[0].month,
      });
    } else {
      setFormData({
        id: 0,
        title1: "",
        title2: "",
        image: "",
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
          image: evt.target.result,
          imageapi: evt.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title1 || !formData.title2) {
      alert("Vui lòng nhập đầy đủ tiêu đề.");
      return;
    }

    const updatedData = [
      {
        id: 2,
        title1: formData.title1,
        title2: formData.title2,
        year: selectedYear,
        month: selectedMonth,
        image: formData.imageData,
      },
    ];
    console.log(updatedData);
    alert("Đã lưu dữ liệu thành công!");
  };

  return (
    <div className="w-100">
      <div className="w-100">
        <div className="px-2">
          <form className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="title1">
                Tiêu đề 1
              </label>
              <input
                className="form-control"
                id="title1"
                type="text"
                placeholder="Nhập tiêu đề 1"
                value={formData.title1}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="title2">
                Tiêu đề 2
              </label>
              <input
                className="form-control"
                id="title2"
                type="text"
                placeholder="Nhập tiêu đề 2"
                value={formData.title2}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-12 col-md-6">
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
            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
              <img
                src={formData.imageSrc}
                className="img-fluid border rounded"
                style={{ maxHeight: "500px", maxWidth: "100%" }}
              />
            </div>
          </form>

          {/* {data.length > 0 && (
        <div className="mt-4">
          <h3>Dữ liệu đã lưu</h3>
          <p>
            <strong>Tiêu đề 1:</strong> {data[0].title1}
          </p>
          <p>
            <strong>Tiêu đề 2:</strong> {data[0].title2}
          </p>
          <img
            src={data[0].imageapi}
            alt="Hình ảnh thông báo nổi bật đã lưu của công ty"
            className="img-fluid border rounded"
            style={{ maxHeight: "300px", maxWidth: "100%" }}
          />
        </div>
      )} */}
        </div>
      </div>
    </div>
  );
};

export default PopNotifi;
