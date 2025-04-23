import { useRef, useEffect, useState, useContext } from "react";
import { InitDateH } from "../components/DatePickerHour";
import "bootstrap/dist/css/bootstrap.min.css";
import "izitoast/dist/css/iziToast.min.css";
import iziToast from "izitoast";
import moment from "moment";
const Createleave = ({
  setCheckAdd,
  setshowPopup,
  setdataFilter,
  setEdit,
  setFullName,
}) => {
  const [reason, setReason] = useState("");
  const [isTitle, setTitle] = useState("Đơn xin nghỉ phép");
  const inputTGBGRef = useRef(null);
  const inputTGKTRef = useRef(null);
  const [isThoiGianBD, setThoiGianBD] = useState("");
  const [isThoiGianKT, setThoiGianKT] = useState("");
  const [isCheckShow, setCheckShow] = useState("0");
  const [isStatus, setStatus] = useState("");
  const [isID, setID] = useState("");
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const [isDisable, setDisable] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    InitDateH(".thoigian", setThoiGianBD, setThoiGianKT);
  }, []);
  useEffect(() => {
    if (setdataFilter.length > 0) {
      const d = setdataFilter[0];
      setReason(d.reason);
      setTitle(d.title);
      setThoiGianBD(d.fromDate);
      setThoiGianKT(d.toDate);
      setStatus(d.status);
      setCheckShow(setEdit);
      setID(d.id);
    } else {
      setReason("");
      setThoiGianBD("");
      setThoiGianKT("");
      setStatus(0);
      setCheckShow(0);
      setTitle("Đơn xin nghỉ phép");
      setID(0);
    }
  }, [setdataFilter, setEdit]);

  const handleFocusInput = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const handleSave = async (e, isSave, checkSave) => {
    e.preventDefault();
    if (isTitle == "") {
      handleNotifi("nhập tiêu đề");
      return;
    }
    if (isThoiGianBD == "") {
      handleNotifi("chọn ngày bắt đầu nghỉ");
      return;
    }
    if (isThoiGianKT == "") {
      handleNotifi("chọn ngày kết thúc nghỉ");
      return;
    }
    if (reason == "") {
      handleNotifi("nhập lí do nghỉ");
      return;
    }
    setDisable(true);
    let arrLeave = [];
    const object = {
      id: isID,
      title: isTitle,
      reason: reason.toString(),
      fromDate: moment(isThoiGianBD, "DD/MM/YYYY HH:mm:ss").format(
        "YYYY-MM-DDTHH:mm:ss.SSSZ"
      ),
      toDate: moment(isThoiGianKT, "DD/MM/YYYY HH:mm:ss").format(
        "YYYY-MM-DDTHH:mm:ss.SSSZ"
      ),
      status: isSave.toString(),
      createDate: moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      idRequester: checkSave == 0 ? isUser : "",
      idManager: checkSave != 0 ? isUser : "",
      approvalDate: null,
    };
    const namePost = checkSave == 0 ? "Post" : "UpdateStatus";
    arrLeave.push(object);
    await PostSave(object, namePost);
  };
  useEffect(() => {
    console.log(isThoiGianBD);
    console.log();
  }, [isThoiGianBD]);
  const handleNotifi = (value) => {
    iziToast.warning({
      title: "Warning",
      message: `Vui lòng  ${value}`,
      position: "topRight",
    });
  };
  const PostSave = async (arrPost, namePost) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}Leave/Post?action=${namePost}`,
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
      setCheckAdd((x) => !x);
      setshowPopup((x) => !x);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Lưu thất bại`,
        position: "topRight",
      });
    }
  };
  return (
    <div className="m-p p-0">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body" style={{ padding: " 2px 20px 10px" }}>
              <form onSubmit={handleSubmit}>
                <div className="col-12 my-2">
                  <label htmlFor="fullName" className="form-label">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    value={setFullName}
                    // onChange={(e) => setFullName(e.target.value)}
                    placeholder=""
                  />
                </div>
                <div className="col-12 my-2">
                  <label htmlFor="fullName" className="form-label">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    value={isTitle}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder=""
                    autoComplete="off"
                  />
                </div>
                <div className="col-12 my-2">
                  <label htmlFor="startDate" className="form-label">
                    Từ ngày
                  </label>
                  <div className="tgDate">
                    {" "}
                    <input
                      ref={inputTGBGRef}
                      value={isThoiGianBD}
                      readOnly
                      className="thoigianbd thoigian thoigianleave w-100"
                      type="text"
                    />
                    <i
                      onClick={() => handleFocusInput(inputTGBGRef)}
                      class="fa-duotone fa-solid fa-calendar-days"
                    ></i>
                  </div>
                </div>
                <div className="col-12 my-2">
                  <label htmlFor="endDate" className="form-label">
                    Đến ngày
                  </label>
                  <div className="tgDate">
                    {" "}
                    <input
                      ref={inputTGKTRef}
                      value={isThoiGianKT}
                      readOnly
                      className="thoigiankt thoigian thoigianleave w-100"
                      type="text"
                    />
                    <i
                      onClick={() => handleFocusInput(inputTGKTRef)}
                      class="fa-duotone fa-solid fa-calendar-days"
                    ></i>
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="reason" className="form-label">
                    Lý do nghỉ phép
                  </label>
                  <textarea
                    className="form-control"
                    id="reason"
                    rows="4"
                    placeholder=""
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>
                </div>

                <div className="d-flex justify-content-between mt-3">
                  <button
                    onClick={() => handleSave(2, 1)}
                    type="button"
                    className={`btn btn-danger ${
                      isCheckShow != 1 ? "d-none" : ""
                    }`}
                  >
                    <i className="fas fa-times"></i> Không duyệt
                  </button>
                  <button
                    disabled={isDisable}
                    onClick={(e) => handleSave(e, isStatus, 0)}
                    type="submit"
                    className={`btn btn-primary itemsaveLeave ${
                      isCheckShow == 1 ? "d-none" : ""
                    }`}
                  >
                    <i className="fas fa-paper-plane "></i>{" "}
                    {isCheckShow == 0 ? "Tạo  " : "Lưu "}
                  </button>
                  <button
                    style={{ marginLeft: "auto" }}
                    onClick={() => handleSave(1, 1)}
                    type="submit"
                    className={`btn btn-primary ${
                      isCheckShow != 1 ? "d-none" : ""
                    }`}
                  >
                    <i className="fas fa-paper-plane"></i> Duyệt phiếu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Createleave;
