import React, { useState, useMemo, useEffect } from "react";
import "../CongViecList/ListCV.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "../CongViecList/GridCV.css";
import "../PhanQuyen/PhanQuyen.css";
import { Modal, Button } from "react-bootstrap";
import iziToast from "izitoast";
const PQIDGGSheet = ({ data, setData }) => {
  const [isIDGGSheet, setIDGGSheet] = useState(null);
  const [isDisable, setDisable] = useState(false);
  const handleSave = (e) => {
    e.preventDefault();
    var object = {
      id: data.id,
      googleSheetID: isIDGGSheet,
      sheetName: "string",
      userID: "string",
      createDate: "2025-05-10T16:27:59.966Z",
    };
    setDisable(true);
    PostSave(object);
  };
  const PostSave = async (arrPost) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}MarketingData/PostGGInfo`,
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
        message: `Cập nhật thành công`,
        position: "topRight",
      });
      setData(arrPost);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Cập nhật thất bại`,
        position: "topRight",
      });
    }
  };
  useEffect(() => {
    setIDGGSheet(data.googleSheetID);
  }, [data]);
  return (
    <div className="w-100">
      <div className=" row px-3 m-0">
        <div className="col-12 m-0 p-0 my-2 ">
          <div className="row p-0 m-0">
            <div className="form-group col-12 m-0 p-0 ">
              <label className="mb-2" htmlFor="projectName">
                ID GGSheet
              </label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  name="projectName"
                  placeholder=""
                  onChange={(e) => setIDGGSheet(e.currentTarget.value)}
                  value={isIDGGSheet}
                  autoComplete="off"
                />
                <button
                  disabled={isDisable}
                  onClick={(e) => handleSave(e)}
                  type="button"
                  class="save-buttonShare btn btn-primary d-flex align-items-center gap-2 "
                  style={{ backgroundColor: "#0d6efd" }}
                >
                  <i class="fas fa-download"></i>
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div
    //   className="grid-table w-100 position-relative"
    //   style={{ padding: "12px" }}
    // >
    //   <button onClick={() => true} class="btn btn-primary mr-2">
    //     <i class="fas fa-plus"></i> Thêm phòng ban
    //   </button>
    // </div>
  );
};

export default PQIDGGSheet;
