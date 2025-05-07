import React, { useState, useContext, useEffect } from "react";
import Select from "react-select";
import iziToast from "izitoast";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import dayjs from "dayjs";
const ModalShareReport = ({ setShow, setIsShow, data, setData, setID }) => {
  const [isdealdate, setdealdate] = useState(dayjs());
  const [isPrebroker, setPrebroker] = useState("");
  const [isBroker, setBroker] = useState("");
  const [isFtd, setFtd] = useState("");
  const [isNote, setNote] = useState("");
  const [isMT, setMT] = useState("");
  const [isDisable, setDisable] = useState(false);
  const [optionS, setOptionS] = useState([]);
  const [isStatusV, setStatusV] = useState(null);

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
      const formattedOptions = data.map((dep) => ({
        value: dep.statusID,
        label: dep.name,
      }));
      setOptionS(formattedOptions);
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleChange = (option) => {
    setStatusV(option);
  };
  const handleSave = (e) => {
    e.preventDefault();

    if (!isStatusV || !isStatusV.value) {
      iziToast.warning({
        title: "Warning",
        message: "Vui lòng chọn trạng thái",
        position: "topRight",
      });
      return;
    }
    if (isStatusV.value == 1 && !isFtd) {
      iziToast.warning({
        title: "Warning",
        message: `Vui lòng nhập FTD`,
        position: "topRight",
      });
      return;
    }
    setDisable(true);
    var dataFi = data.map((item) =>
      item.id === setID
        ? {
            ...item,
            dealDate: isdealdate.format("DD/MM/YYYY"),
            broker: isBroker,
            ftd: isFtd || 0,
            note: isNote,
            account: isMT,
            preBroker: isPrebroker,
            status: isStatusV?.value,
            statusName: isStatusV?.label,
          }
        : item
    );
    setData(dataFi);
    let object = {
      id: setID,
      date: "string",
      name: "string",
      phone: "string",
      mail: "string",
      question: "string",
      utmSource: "string",
      utmCampaign: "string",
      status: isStatusV?.value,
      preBroker: isPrebroker,
      ftd: isFtd || 0,
      broker: isBroker,
      dealDate: isdealdate.format("YYYY-MM-DD"),
      note: isNote,
      account: isMT,
      createUser: "string",
      createDate: "2025-04-28T16:04:56.506Z",
      receiverID: "string",
      oldReceiverID: "string",
      isChecked: 0,
    };
    PostSave(object);
  };

  const PostSave = async (arrPost, dataF) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}MarketingData/PostDeal`,
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
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Lưu thất bại`,
        position: "topRight",
      });
    }
  };
  useEffect(() => {
    const defaultOption = optionS.find((opt) => opt.value === 3);
    if (defaultOption) {
      setStatusV(defaultOption);
    }
  }, []);
  useEffect(() => {
    if (!setIsShow) return;
    var dataF = data.find((x) => x.id === setID);
    if (!dataF) return;
    const defaultOption = optionS.find((opt) => opt.value === dataF.status);

    if (defaultOption) {
      setStatusV(defaultOption);
    } else {
      setStatusV(null);
    }
    if (dataF.dealDate !== null)
      setdealdate(dayjs(dataF.dealDate, "DD/MM/YYYY"));
    else setdealdate(dayjs());
    setBroker(dataF.broker || "");
    setFtd(dataF.ftd || "");
    setNote(dataF.note || "");
    setPrebroker(dataF.preBroker || "");
    setMT("");
  }, [setIsShow, setID]);

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
                Thông tin
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
                  <div className="card-body  px-4 py-2">
                    <form>
                      <div className="col-12 m-0 p-0 my-2 ">
                        <div className="row">
                          <div className="form-group col-6 m-0 p-0 pe-1 ">
                            <label htmlFor="projectName">Thời gian</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                views={["year", "month", "day"]}
                                openTo="day"
                                value={isdealdate}
                                onChange={(newValue) => setdealdate(newValue)}
                                format="DD/MM/YYYY"
                              />
                            </LocalizationProvider>
                          </div>
                          <div className="form-group col-6 m-0 p-0 ps-1 ">
                            <label htmlFor="projectName">Trạng thái</label>
                            <Select
                              options={optionS}
                              value={isStatusV}
                              onChange={handleChange}
                              placeholder=""
                              isSearchable
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 m-0 p-0 my-2 ">
                        <div className="row">
                          <div className="form-group col-6 m-0 p-0 pe-1 ">
                            <label htmlFor="projectName">Sàn trước đây</label>
                            <input
                              type="text"
                              className="form-control"
                              id="projectName"
                              placeholder=""
                              onChange={(e) =>
                                setPrebroker(e.currentTarget.value)
                              }
                              value={isPrebroker}
                              autoComplete="off"
                            />
                          </div>
                          <div className="form-group col-6 m-0 p-0 ps-1">
                            <label htmlFor="projectName">Sàn đầu tư</label>
                            <input
                              type="text"
                              className="form-control"
                              id="projectName"
                              placeholder=""
                              onChange={(e) => setBroker(e.currentTarget.value)}
                              value={isBroker}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 m-0 p-0 my-2 ">
                        <div className="row">
                          <div className="form-group col-12 m-0 p-0 ">
                            <label htmlFor="projectName">FTD</label>
                            <input
                              type="number"
                              className="form-control"
                              id="projectName"
                              placeholder=""
                              value={isFtd}
                              onChange={(e) => setFtd(e.currentTarget.value)}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 m-0 p-0 my-2 ">
                        <div className="row">
                          <div className="form-group col-12 m-0 p-0 ">
                            <label htmlFor="projectName">MT4/MT5</label>
                            <input
                              type="text"
                              className="form-control"
                              id="projectName"
                              placeholder=""
                              value={isMT}
                              onChange={(e) => setMT(e.currentTarget.value)}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 m-0 p-0 my-2 ">
                        <div className="row">
                          <div className="form-group col-12 m-0 p-0 ">
                            <label htmlFor="projectName">Ghi chú</label>
                            <textarea
                              className="form-control"
                              rows="3"
                              placeholder=""
                              value={isNote}
                              onChange={(e) => setNote(e.currentTarget.value)}
                            ></textarea>
                          </div>
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
                            <i className="fas fa-paper-plane"></i> Lưu
                          </button>
                        </div>
                      </div>
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
export default ModalShareReport;
