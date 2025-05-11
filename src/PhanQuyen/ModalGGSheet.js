import React, { useState, useContext, useEffect } from "react";
import Select from "react-select";
import iziToast from "izitoast";
const ModalGGSheet = ({
  setShow,
  setIsShow,
  data,
  setData,
  setID,
  setCheckGGSheet,
}) => {
  const [isTitle, setTile] = useState("");
  const [isIDGGSheet, setIDGGSheet] = useState(null);
  const [isDisable, setDisable] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    var dataFi = data.map((item) =>
      item.id === setID
        ? {
            ...item,
            title: isTitle,
            googleSheetID: isIDGGSheet,
          }
        : item
    );
    var object = {
      id: setID,
      title: isTitle,
      googleSheetID: isIDGGSheet,
      sheetName: "string",
      userID: "string",
      createDate: "2025-05-10T16:27:59.966Z",
    };
    setDisable(true);
    PostSave(object, dataFi);
  };
  const PostSave = async (arrPost, dataFi) => {
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
        message: `${setID === 0 ? "Lưu" : "Cập nhật"} thành công`,
        position: "topRight",
      });
      setID === 0 ? setCheckGGSheet((x) => !x) : setData(dataFi);
      setShow(false);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `${setID === 0 ? "Lưu" : "Cập nhật"} thất bại`,
        position: "topRight",
      });
    }
  };
  useEffect(() => {
    if (!setIsShow) return;
    var dataF = data?.find((x) => x.id === setID);
    if (!dataF) {
      setIDGGSheet("");
      setTile("");
      return;
    }
    setIDGGSheet(dataF.googleSheetID);
    setTile(dataF.title);
  }, [setIsShow]);
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
                ID GGSheet
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
                          <div className="form-group col-12 m-0 p-0  ">
                            <label htmlFor="projectName">Tiêu đề</label>
                            <input
                              type="text"
                              className="form-control"
                              id="projectName"
                              placeholder=""
                              onChange={(e) => setTile(e.currentTarget.value)}
                              value={isTitle}
                              autoComplete="off"
                            />
                          </div>
                          <div className="form-group col-12 m-0 p-0">
                            <label htmlFor="projectName">ID GGSheet</label>
                            <input
                              type="text"
                              className="form-control"
                              id="projectName"
                              placeholder=""
                              onChange={(e) =>
                                setIDGGSheet(e.currentTarget.value)
                              }
                              value={isIDGGSheet}
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
                            <i className="fas fa-paper-plane"></i>{" "}
                            {setID === 0 ? "Lưu" : "Cập nhật"}
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
export default ModalGGSheet;
