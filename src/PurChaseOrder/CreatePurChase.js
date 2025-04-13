import { useRef, useEffect, useState, useContext } from "react";
import iziToast from "izitoast";
import unorm from "unorm";
import $, { data } from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import moment from "moment";
import { InitDate } from "../components/DatePicker";

const CreatePurChase = ({
  setData,
  setCheckAdd,
  setShowPopup,
  setCheckSave,
}) => {
  const [isFullName, setFullName] = useState(localStorage.getItem("fullName"));
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const selectRef2 = useRef(null);
  const [isDisable, setDisable] = useState(false);
  const inputTGBGRef = useRef(null);
  const inputTGKTRef = useRef(null);
  const [isThoiGianBD, setThoiGianBD] = useState("");
  const [isThoiGianKT, setThoiGianKT] = useState(moment().format("DD/MM/YYYY"));
  const [isMaTicket, setMaTicket] = useState("");
  const [isTitle, setTile] = useState("");
  const [isPrice, setPrice] = useState("");
  const [isDescript, setDescript] = useState("");
  const [isCheckShow, setCheckShow] = useState(true);
  const [isID, setID] = useState(0);
  useEffect(() => {
    InitDate(".thoigian", setThoiGianBD, setThoiGianKT);
  }, []);
  const handleFocusInput = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const handlePur = (e) => {
    e.preventDefault();
    if (isTitle == "") {
      handleNotifi("nhập tiêu đề");
      return;
    }
    if (isMaTicket == "") {
      handleNotifi("nhập mã ticket");
      return;
    }

    if (isThoiGianKT == "") {
      handleNotifi("chọn ngày ");
      return;
    }
    if (isPrice == "") {
      handleNotifi("nhập giá ");
      return;
    }
    setDisable(true);
    const object = {
      id: isID,
      ticket: isMaTicket,
      title: isTitle,
      description: isDescript,
      amount: isPrice,
      createDate: moment(isThoiGianKT, "DD/MM/YYYY").format("YYYY-MM-DD"),
      idCreator: isUser,
    };
    PostSave(object);
  };
  const PostSave = async (arrPost) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}PaymentVoucher/Post`,
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

      setShowPopup((prev) => !prev); // Tắt form khi thêm task
      setCheckAdd((prev) => !prev);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Lưu thất bại`,
        position: "topRight",
      });
    }
  };
  const handleNotifi = (value) => {
    iziToast.warning({
      title: "Warning",
      message: `Vui lòng  ${value}`,
      position: "topRight",
    });
  };
  useEffect(() => {
    if (!setCheckSave) {
      const d = setData[0];
      setID(d.id);
      setDescript(d.description);
      setMaTicket(d.ticket);
      setPrice(d.amount);
      setTile(d.title);
      setThoiGianKT(d.createDate);
      setCheckShow(false);
    } else {
      setID(0);
      setDescript("");
      setMaTicket("");
      setPrice("");
      setTile("");
      setThoiGianKT(moment().format("DD/MM/YYYY"));
      setCheckShow(true);
    }
  }, [setCheckSave]);
  return (
    <div className="">
      <div className="card">
        <div className="card-body">
          <div className="row headerDuAn">
            <div className="col-8 p-0 m-0">
              <h1
                style={{ textAlign: "left", fontSize: "28px" }}
                className="card-title   font-weight-bold  "
              >
                {isCheckShow ? "Tạo phiếu" : "Cập nhật"}
              </h1>
            </div>
            <div className="col-4 p-0 m-0 d-flex justify-content-end">
              <button
                onClick={() => setShowPopup((prev) => !prev)}
                class="btn-close-custom"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <form>
            <div className="col-lg-12 col-xl-12 m-0 p-0 my-2  ">
              <div className="row">
                <div className="form-group col-6 m-0 p-0 pe-1">
                  <label htmlFor="projectManager">Mã ticket</label>
                  <input
                    type="text"
                    className="form-control"
                    id="projectName"
                    placeholder="Nhập mã ticket"
                    onChange={(e) => setMaTicket(e.currentTarget.value)}
                    value={isMaTicket}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group col-6 m-0 p-0 ps-1">
                  <label htmlFor="endDate">Ngày </label>
                  <div className="tgDate">
                    {" "}
                    <input
                      ref={inputTGKTRef}
                      value={isThoiGianKT}
                      readOnly
                      className="thoigiankt thoigian form-control"
                      type="text"
                    />
                    <i
                      onClick={() => handleFocusInput(inputTGKTRef)}
                      class="fa-duotone fa-solid fa-calendar-days"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 m-0 p-0 my-2 ">
              <div className="row">
                <div className="form-group col-12 m-0 p-0 ">
                  <label htmlFor="projectName">Tiêu đề</label>
                  <input
                    type="text"
                    className="form-control"
                    id="projectName"
                    placeholder="Nhập tiêu đề"
                    onChange={(e) => setTile(e.currentTarget.value)}
                    value={isTitle}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            <div className="col-12 m-0 p-0 my-2 ">
              <div className="row">
                <div className="form-group col-12 m-0 p-0 ">
                  <label htmlFor="projectName">Giá</label>
                  <input
                    type="number"
                    className="form-control"
                    id="projectName"
                    placeholder="Nhập tiêu đề"
                    onChange={(e) => setPrice(e.currentTarget.value)}
                    value={isPrice}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-xl-12 m-0 p-0 my-2  ">
              <div className="row">
                <div className="p-0">
                  <label htmlFor="projectDescription">Mô tả </label>
                  <textarea
                    class="form-control"
                    id="noteInput"
                    rows="3"
                    placeholder="Nhập mô tả"
                    value={isDescript}
                    onChange={(e) => setDescript(e.currentTarget.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            <div
              className="d-flex"
              style={{ background: "#Fff", paddingBottom: "4px" }}
            >
              <button
                disabled={isDisable}
                onClick={(e) => handlePur(e)}
                style={{ marginLeft: "auto" }}
                type="submit"
                className={`btn btn-primary  mt-3
                 
                }`}
              >
                <i className="fas fa-paper-plane"></i>{" "}
                {isCheckShow ? "Lưu" : "Cập nhật"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreatePurChase;
