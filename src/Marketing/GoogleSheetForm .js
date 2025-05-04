import React, { useState } from "react";
import iziToast from "izitoast";
const GoogleSheetForm = ({
  setIsShow,
  setShow,
  setData,
  setIsWeek,
  setGGSheet,
}) => {
  const [link, setLink] = useState(
    "1l7ixGEkBvPZGeQz9qPaKhu8DcEYtd0EM6P_ZTIiIHMQ"
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    getData();
  };
  const getData = async () => {
    const url = `${process.env.REACT_APP_URL_API}MarketingData/GetGGSheetData?spreadsheetId=${link}&weeknumber=${setIsWeek}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      if (data.statusCode === 200) {
        setData(data.data);
        setShow(false);
        setGGSheet((x) => !x);
        iziToast.success({
          title: "Success",
          message: data.message,
          position: "topRight",
        });
      } else {
        iziToast.warning({
          message: data.message,
          position: "topRight",
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <>
      {setIsShow && (
        <div className="modal-backdrop fade show"></div> // Thêm lớp backdrop khi modal mở
      )}
      <div
        className={`modal ${setIsShow ? "d-block" : "d-none"}`} // Điều khiển modal mở hay đóng
        tabIndex={-1}
        role="dialog"
        id="customModal"
        aria-labelledby="popupModalHeader"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div style={{ padding: "10px 20px" }} className="modal-header">
              <h5 className="modal-title" id="popupModalHeader">
                ID Google Sheet
              </h5>
              <button
                onClick={() => setShow(false)}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body cardleave" style={{ padding: "2px" }}>
              <div className="">
                <div className="card px-2">
                  <div className="card-body  px-2 py-2">
                    <form
                      className="bg-white p-1 p-md-1 rounded shadow-sm w-100"
                      onSubmit={handleSubmit}
                    >
                      <div className="mb-3">
                        <label
                          htmlFor="gsheet-link"
                          className="form-label fw-medium text-secondary"
                        >
                          ID Google Sheet
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="gsheet-link"
                          name="gsheet-link"
                          required
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary w-100 fw-semibold"
                      >
                        Lấy dữ liệu
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GoogleSheetForm;
