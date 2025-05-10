import React, { useState, useContext, useEffect } from "react";
import Select from "react-select";
import iziToast from "izitoast";
import dayjs from "dayjs";
const ModalUpdate = ({ setShowU, setIsShowU, data, setData, setID }) => {
  const [isName, setName] = useState("");
  const [isPhone, setPhone] = useState("");
  const [isMail, setMail] = useState("");
  const [isCountry, setCountry] = useState("");
  const [isNguonUTM, setNguonUTM] = useState("");
  const [isCDUTM, setCDUTM] = useState("");
  const [isDisable, setDisable] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();

    setDisable(true);
    var dataFi = data.map((item) =>
      item.id === setID
        ? {
            ...item,
            name: isName,
            phone: isPhone,
            mail: isMail,
            country: isCountry,
            utmSource: isNguonUTM,
            utmCampaign: isCDUTM,
          }
        : item
    );

    let object = {
      id: setID,
      date: "string",
      name: isName,
      phone: isPhone,
      mail: isMail,
      question: "string",
      utmSource: isNguonUTM,
      utmCampaign: isNguonUTM,
      country: isCountry,
      status: 0,
      preBroker: "string",
      ftd: 0,
      broker: "string",
      dealDate: "2025-05-10T15:56:05.182Z",
      note: "string",
      account: "string",
      createUser: "string",
      createDate: "2025-05-10T15:56:05.182Z",
      receiverID: "string",
      oldReceiverID: "string",
      isChecked: 0,
      isCheckDelete: 0,
    };

    PostSave(object, dataFi);
  };

  const PostSave = async (arrPost, dataF) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}MarketingData/UpdateMKTData`,
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
      setShowU(false);
      setData(dataF);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Lưu thất bại`,
        position: "topRight",
      });
    }
  };

  useEffect(() => {
    var dataF = data.find((x) => x.id === setID);
    setName(dataF?.name || "");
    setPhone(dataF?.phone || "");
    setMail(dataF?.mail || "");
    setCountry(dataF?.country || "");
    setNguonUTM(dataF?.utmSource || "");
    setCDUTM(dataF?.utmCampaign || "");
  }, [setIsShowU, setID]);

  return (
    <>
      {setIsShowU && (
        <div className="modal-backdrop fade show"></div> // Thêm lớp backdrop khi modal mở
      )}
      <div
        className={`modal ${setIsShowU ? "d-block" : "d-none"}`} // Điều khiển modal mở hay đóng
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
                onClick={() => setShowU(false)}
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
                            <label htmlFor="projectName">Tên</label>
                            <input
                              type="text"
                              className="form-control"
                              name="projectName"
                              placeholder=""
                              onChange={(e) => setName(e.currentTarget.value)}
                              value={isName}
                              autoComplete="off"
                            />
                          </div>
                          <div className="form-group col-6 m-0 p-0 ps-1">
                            <label htmlFor="projectName">Số điện thoại</label>
                            <input
                              type="text"
                              className="form-control"
                              name="projectName"
                              placeholder=""
                              onChange={(e) => setPhone(e.currentTarget.value)}
                              value={isPhone}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 m-0 p-0 my-2 ">
                        <div className="row">
                          <div className="form-group col-6 m-0 p-0 pe-1 ">
                            <label htmlFor="projectName">Mail</label>
                            <input
                              type="text"
                              className="form-control"
                              name="projectName"
                              placeholder=""
                              onChange={(e) => setMail(e.currentTarget.value)}
                              value={isMail}
                              autoComplete="off"
                            />
                          </div>
                          <div className="form-group col-6 m-0 p-0 ps-1">
                            <label htmlFor="projectName">Quốc gia</label>
                            <input
                              type="text"
                              className="form-control"
                              name="projectName"
                              placeholder=""
                              onChange={(e) =>
                                setCountry(e.currentTarget.value)
                              }
                              value={isCountry}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-12 m-0 p-0 my-2 ">
                        <div className="row">
                          <div className="form-group col-12 m-0 p-0 ">
                            <label htmlFor="projectName">Nguồn UTM</label>
                            <input
                              type="text"
                              className="form-control"
                              name="projectName"
                              placeholder=""
                              onChange={(e) =>
                                setNguonUTM(e.currentTarget.value)
                              }
                              value={isNguonUTM}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 m-0 p-0 my-2 ">
                        <div className="row">
                          <div className="form-group col-12 m-0 p-0 ">
                            <label htmlFor="projectName">Chiên dịch UTM</label>
                            <input
                              type="text"
                              className="form-control"
                              name="projectName"
                              placeholder=""
                              onChange={(e) => setCDUTM(e.currentTarget.value)}
                              value={isCDUTM}
                              autoComplete="off"
                            />
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
export default ModalUpdate;
