import { useState, useEffect } from "react";

const StatusForm = ({ setIsShowS, setShowS, data }) => {
  const [trangThaiList, settrangThaiList] = useState([]);
  useEffect(() => {
    getStatus();
  }, []);

  const getStatus = async () => {
    const url = `${process.env.REACT_APP_URL_API}MarketingData/GetDealStatus`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      const formattedOptions = [
        ...data.map((x) => ({
          value: x.statusID,
          label: x.name,
        })),
        { value: 0, label: " Chưa xác định " },
      ];

      settrangThaiList(formattedOptions);
    } catch (error) {
      console.error(error.message);
    }
  };
  const colorList = [
    "#22c55e",
    "#ef4444",
    "#facc15",
    "#9ca3af",
    "#0d6efd",
    "#8b5cf6",
    "#ec4899",
    "#10b981",
    "#f97316",
    "#6b7280",
  ];

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
              {trangThaiList?.map((item, index) => {
                const color = colorList[index % colorList.length];
                const count = data.filter(
                  (row) => row.status === item.value
                ).length;

                return (
                  <div
                    key={item.value}
                    className="mb-3 d-flex align-items-center"
                  >
                    <span
                      className="status-indicator"
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    ></span>
                    <label className="form-label flex-grow-1 mb-0 fw-medium text-secondary">
                      {item.label}
                    </label>
                    <input
                      type="text"
                      value={count}
                      readOnly
                      className="form-control w-25 ms-3 inputS"
                    />
                  </div>
                );
              })}

              <hr className="my-4" />

              <div className="d-flex align-items-center">
                <span
                  className="status-indicator"
                  style={{ backgroundColor: "#0d6efd" }}
                  aria-hidden="true"
                ></span>
                <label className="form-label flex-grow-1 mb-0 fw-semibold text-dark">
                  Tổng data hiện có
                </label>
                <input
                  type="text"
                  value={data.length}
                  readOnly
                  className="form-control w-25 ms-3 fw-semibold text-primary inputS"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default StatusForm;
