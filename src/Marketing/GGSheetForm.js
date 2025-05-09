import { useState, useEffect } from "react";

const GGSheetForm = ({ setIsShowS, setShowS, data }) => {
  return (
    <>
      {setIsShowS && (
        <div className="modal-backdrop fade show"></div> // Thêm lớp backdrop khi modal mở
      )}
      <div
        className={`modal ${setIsShowS ? "d-block" : "d-none"}`} // Điều khiển modal mở hay đóng
        tabIndex={-1}
        role="dialog"
        id="customModal"
        aria-labelledby="popupModalHeader"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div style={{ padding: "10px 20px" }} className="modal-header">
              <h5 className="modal-title" id="popupModalHeader">
                Thông tin
              </h5>
              <button
                onClick={() => setShowS(false)}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form className="bg-white rounded-3 shadow p-4 w-100">
              <div className="mb-3 d-flex align-items-center">
                <span
                  className="status-indicator"
                  style={{ backgroundColor: "#ef4444" }}
                  aria-hidden="true"
                ></span>
                <label className="form-label flex-grow-1 mb-0 fw-medium text-secondary">
                  Thành công
                </label>
                <input
                  type="text"
                  value={data?.insertQuantity ?? 0}
                  readOnly
                  className="form-control w-25 ms-3 inputS text-danger"
                />
              </div>
              <div className="mb-3 d-flex align-items-center ">
                <span
                  className="status-indicator"
                  style={{ backgroundColor: "#22c55e" }}
                  aria-hidden="true"
                ></span>
                <label className="form-label flex-grow-1 mb-0 fw-medium text-secondary">
                  Trùng dữ liệu đầu vào
                </label>
                <input
                  type="text"
                  value={data?.lstInputDuplicate.length ?? 0}
                  readOnly
                  className="form-control w-25 ms-3 inputS text-danger"
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <span
                  className="status-indicator"
                  style={{ backgroundColor: "#9ca3af" }}
                  aria-hidden="true"
                ></span>
                <label className="form-label flex-grow-1 mb-0 fw-medium text-secondary">
                  Trùng dữ liệu database
                </label>
                <input
                  type="text"
                  value={data?.lstInputDuplicateDB.length ?? 0}
                  readOnly
                  className="form-control w-25 ms-3 inputS text-danger"
                />
              </div>
              <hr className="my-4" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default GGSheetForm;
