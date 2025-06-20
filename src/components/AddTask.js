import { useRef, useEffect, useState, useContext } from "react";
import { InitDate } from "./DatePicker";
import { InitDateH } from "../components/DatePickerHour";
import TextEditor from "./TextEdit";
import { TitleContext } from "../components/TitleContext";
import $, { data } from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "../components/AddTask.css";
import "select2/dist/css/select2.min.css";
import "select2/dist/js/select2.min.js";
import "izitoast/dist/css/iziToast.min.css";
import { remove as removeDiacritics } from "diacritics";
import unorm from "unorm";

import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import iziToast from "izitoast";
const AddTask = ({
  setDataNV,
  setShowPopup,
  setCheckAdd,
  setDataAddTask,
  setEdit,
  setRole,
  setisUserLeader,
}) => {
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const [isDepCode, setDepCode] = useState("");
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));

  const selectRef2 = useRef(null);
  const selectRef = useRef(null);
  const inputTGBGRef = useRef(null);
  const inputTGKTRef = useRef(null);
  const inputTGDLRef = useRef(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isPhongBan, setPhongBan] = useState([]);
  const [show, setShow] = useState(false);

  const [isNhanVien, setNhanVien] = useState([]);
  const [isNhanVienSearch, NhanVienSearch] = useState([]);
  const [search, setSearch] = useState("");
  const { setTitle, setIcon } = useContext(TitleContext);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isWorkName, setWorkName] = useState("");
  const [isThoiGianBD, setThoiGianBD] = useState("");
  const [isThoiGianKT, setThoiGianKT] = useState("");
  const [isThoiGianBao, setThoiGianBao] = useState("");
  const messageInputRef = useRef(null);
  const messageInputRefTN = useRef(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [filteredUsersTN, setFilteredUsersTN] = useState([]);
  const [isPopupVisibleTN, setIsPopupVisibleTN] = useState(false);
  const [isUuTien, setUuTien] = useState("");
  const [isGhiChu, setGhiChu] = useState("");
  const [isNoiDung, setNoiDung] = useState("");
  const [isCheckUser, setCheckUser] = useState([]);
  const [isCheckTille, setCheckTille] = useState(null);
  const [IsCheckSave, setCheckSave] = useState(null);
  const [IsHT, setISHT] = useState(0);
  const [isID, setID] = useState(0);
  const [isCheckShow, setCheckShow] = useState(null);
  const [preloadedMentions, setpreloadedMentions] = useState([]);
  const [preloadedMentionsTN, setpreloadedMentionsTN] = useState([]);
  const [isDisable, setDisable] = useState(false);
  const [isIDNV, setIDNV] = useState([]);
  const [isIDNVTN, setIDNVTN] = useState([]);
  const [isMaTicket, setMaTicket] = useState("");
  const [message, setMessage] = useState("");
  const [messageTN, setMessageTN] = useState("");
  const [isFile, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [isUserLeader, setUserLeader] = useState("");
  const [isNVMKT, setNVMKT] = useState(false);
  const inputRef = useState(null);
  useEffect(() => {
    if (selectRef2.current) {
      $(selectRef2.current).select2();

      $(selectRef2.current).on("change", function () {
        const value = $(this).val();
        setSelectedDepartment(value);
      });
    }

    return () => {
      if (selectRef2.current) {
        $(selectRef2.current).select2("destroy");
      }
    };
  }, []);

  useEffect(() => {
    if (setDataNV?.length > 0) {
      let nhanvien = setDataNV;
      var dataNVMKT = nhanvien.find((x) => x.userID == isUser);
      if (selectedDepartment != "") {
        nhanvien = nhanvien.filter((x) => x.dep_Code == selectedDepartment);
      }
      setRole === "Leader" &&
        (nhanvien = nhanvien.filter((x) => isDepCode.includes(x.dep_Code)));

      setRole === "UnderLeader" &&
        (nhanvien = nhanvien.filter((x) => setisUserLeader.includes(x.userID)));

      setRole === "Member" &&
        dataNVMKT.dep_Code !== "MKT" &&
        (nhanvien = nhanvien.filter((x) => x.userID === isUser));

      if (dataNVMKT.dep_Code == "MKT")
        nhanvien = nhanvien.filter((x) => isDepCode.includes(x.dep_Code));
      const nhanvienNew = Array.from(
        new Map(
          nhanvien.map((item) => [
            `${item.userID}-${item.fullName}-${item.dep_Code}-${item.dep_Name}`,
            {
              userID: item.userID,
              fullName: item.fullName,
              dep_Code: item.dep_Code,
              dep_Name: item.dep_Name,
            },
          ])
        ).values()
      );
      setNhanVien(nhanvienNew);
    }
  }, [selectedDepartment, setDataNV, isDepCode]);
  const handleAddTask = (e, value) => {
    e.preventDefault();
    const namesArray = message
      .split(" @") // Tách mảng theo dấu " @"
      .map((name) => name.replace(/^@/, "").trim()) // Loại bỏ dấu @ và khoảng trắng thừa
      .filter((name) => name !== "");
    const dataNhanVien = setDataNV.filter((user) => {
      return namesArray.includes(user.fullName);
    });
    const arrNv = dataNhanVien.map((user) => user.userID);

    const namesArrayTN = messageTN
      .split(" @") // Tách mảng theo dấu " @"
      .map((name) => name.replace(/^@/, "").trim()) // Loại bỏ dấu @ và khoảng trắng thừa
      .filter((name) => name !== "");
    const dataNhanVienTN = setDataNV.filter((user) => {
      return namesArrayTN.includes(user.fullName);
    });
    const arrNvTN = dataNhanVienTN.map((user) => user.userID).join(", ");
    const arrPost = [];
    if (isWorkName == "") {
      handleNotifi("nhập tên công việc");
      return;
    }
    if (isMaTicket == "") {
      handleNotifi("nhập mã ticket");
      return;
    }
    console.log(arrNv);
    const uniqueArray = [...new Set(arrNv.filter((item) => item !== ""))];
    console.log(uniqueArray);
    if (uniqueArray == null || uniqueArray.length == 0) {
      handleNotifi("chọn nhân viên ");
      return;
    }
    if (isThoiGianBD == "") {
      handleNotifi("chọn ngày bắt đầu");
      return;
    }
    if (isThoiGianKT == "") {
      handleNotifi("chọn ngày kết thúc");
      return;
    }
    if (isThoiGianBao == "") {
      handleNotifi("chọn ngày báo deadline");
      return;
    }

    if (arrNvTN == "") {
      handleNotifi("chọn người chịu trách nhiệm");
      return;
    }
    setDisable(true);

    const object = {
      id: isID,
      ticket: isMaTicket.toString(),
      workName: isWorkName,
      description: isNoiDung,
      priority: isUuTien.toString(),
      note: isGhiChu,
      idRequester: isUser,
      createDate: moment().format("YYYY-MM-DD"),
      fromDate: moment(isThoiGianBD, "DD/MM/YYYY HH:mm:ss").format(
        "YYYY-MM-DDTHH:mm:ss.SSS"
      ),
      toDate: moment(isThoiGianKT, "DD/MM/YYYY HH:mm:ss").format(
        "YYYY-MM-DDTHH:mm:ss.SSS"
      ),
      remindDate: moment(isThoiGianBao, "DD/MM/YYYY HH:mm:ss").format(
        "YYYY-MM-DDTHH:mm:ss.SSS"
      ),
      completeDate: moment().format("YYYY-MM-DDTHH:mm:ss.SSS"),
      idResponsible: arrNvTN,
      idApprover: "",
      statusHT: value,
      lstIDImplementer: uniqueArray,
      idUserFeedback: "",
    };
    setShow(false);
    arrPost.push(object);
    const namePost = isCheckShow === 0 ? "Post" : "Post";

    PostSave(object, namePost);
  };
  const PostSave = async (arrPost, namePost) => {
    const formData = new FormData();
    for (const key in arrPost) {
      if (key === "lstIDImplementer") {
        let lstIDImplementerA = arrPost[key];
        lstIDImplementerA.forEach((value, index) => {
          formData.append(`lstIDImplementer[${index}]`, value);
        });
      } else formData.append(key, arrPost[key]);
    }
    formData.append("File", isFile);
    const request = new Request(
      `${process.env.REACT_APP_URL_API}Work/Post?action=${namePost}`,
      {
        method: "POST",
        body: formData,
      }
    );

    try {
      let response = await fetch(request);
      let data = await response.json();
      setDisable(false);

      if (data.status === "OK") {
        iziToast.success({
          title: "Success",
          message: `Lưu thành công`,
          position: "topRight",
        });
        setShowPopup((prev) => !prev);
        setCheckAdd((prev) => !prev);
      } else {
        iziToast.warning({
          title: "Warning",
          message: `Lưu thất bại`,
          position: "topRight",
        });
      }
    } catch (error) {
      setDisable(false);
      iziToast.error({
        title: "Error",
        message: "Lỗi khi gọi API",
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
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    setTitle(` Thêm công việc mới`);
    setIcon(<i className="fa-solid fa-plus icontitle"></i>);
  }, []);
  useEffect(() => {
    InitDateH(".thoigian", setThoiGianBD, setThoiGianKT, setThoiGianBao);
  }, []);
  const getPhongBan = async () => {
    var url = `${process.env.REACT_APP_URL_API}Department/Get?action=get`;
    setRole !== "Administrator" &&
      (url = `${process.env.REACT_APP_URL_API}Department/Get?action=GetDept_User&para1=${isUser}`);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      setPhongBan(data);
      const depCodeJoin = data.map((x) => x.dep_Code).join(",");
      const depCodeArray = depCodeJoin.split(",");
      setDepCode(depCodeArray);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    setRole != "" && getPhongBan();
  }, [setRole]);
  const handleReturn = () => {
    setCheckTille(false);
    setCheckSave(false);
    setWorkName("");
    setThoiGianBD("");
    setThoiGianKT("");
    setUuTien(2);
    setGhiChu("");
    setNoiDung("");
    setCheckUser();
    setISHT(0);
    setID(0);
    setCheckShow(0);
    setIDNV();
    setIDNVTN("");
    setMaTicket("");
  };
  useEffect(() => {
    handleReturn();
    const dataSend = setDataAddTask;
    if (dataSend?.length > 0) {
      let d = dataSend[0];
      const userID = d.idImplementer;
      const responsible = d.idResponsible;
      const nhanvienAvaliable = setDataNV
        .map((user) => ({
          userID: user.userID,
          fullName: user.fullName,
        }))
        .filter((x) => {
          // Kiểm tra nếu userID của x có nằm trong danh sách userID của d.idImplementer không
          const userIDs = userID?.split(","); // Tạo mảng userID từ chuỗi
          return userIDs?.includes(x.userID); // Kiểm tra nếu userID của user trong mảng d.idImplementer
        });
      const nhanvienTN = setDataNV
        .map((user) => ({
          userID: user.userID,
          fullName: user.fullName,
        }))
        .filter((x) => {
          const userIDs = responsible?.split(","); // Tạo mảng userID từ chuỗi
          return userIDs?.includes(x.userID); // Kiểm tra nếu userID của user trong mảng d.idImplementer
        });
      setID(d.id);
      setWorkName(d.workName);
      setThoiGianBD(d.fromDate);
      setThoiGianKT(d.toDate);
      setThoiGianBao(d.remindDate);
      setUuTien(d.priority);
      setGhiChu(d.note);
      setNoiDung(d.description);
      setIDNV(d.idImplementer?.split(","));
      setIDNVTN(d.idRequester);
      setpreloadedMentionsTN(nhanvienTN);
      setMaTicket(d.ticket);
      setpreloadedMentions(nhanvienAvaliable);
      setCheckShow(setEdit);
      setISHT(d.statusHT);
      if (d.status != 3) setCheckTille(true);
      setCheckSave(true);
      setTitle(` Hoàn thành & Cập nhật`);
      setFileName(d.requestFile);
      setFile(null);
    } else {
      handleReturn();
    }
  }, [setDataAddTask, setDataNV]);

  useEffect(() => {
    let preloadedText = "";
    preloadedMentions &&
      preloadedMentions.forEach((user) => {
        preloadedText += `@${user.fullName} `;
      });
    setMessage(preloadedText.trim());
  }, [preloadedMentions]);
  useEffect(() => {
    let preloadedText = "";
    preloadedMentionsTN &&
      preloadedMentionsTN.forEach((user) => {
        preloadedText += `@${user.fullName} `;
      });
    console.log(preloadedText.trim());
    setMessageTN(preloadedText.trim());
  }, [preloadedMentionsTN]);
  const handleFocusInput = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleMentionSelect = (name, id) => {
    const cursorPosition = messageInputRef.current.selectionStart;
    const textBeforeCursor = message.slice(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const textAfterCursor = message.slice(cursorPosition);
      const newText =
        textBeforeCursor.slice(0, -mentionMatch[0].length) +
        "@" +
        name +
        " " +
        textAfterCursor;
      setMessage(newText);
      setIsPopupVisible(false);
      setIDNV((prevIDNV = []) => {
        if (!prevIDNV.includes(id)) {
          return [...prevIDNV, id];
        }
        return prevIDNV;
      });

      messageInputRef.current.focus();
    }
  };
  const handleMentionSelectTN = (name, id) => {
    const cursorPosition = messageInputRefTN.current.selectionStart;
    const textBeforeCursor = messageTN.slice(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const textAfterCursor = messageTN.slice(cursorPosition);
      const newText =
        textBeforeCursor.slice(0, -mentionMatch[0].length) +
        "@" +
        name +
        " " +
        textAfterCursor;
      setMessageTN(newText);
      setIsPopupVisibleTN(false);
      setIDNVTN((prevIDNV = []) => {
        if (!prevIDNV.includes(id)) {
          return [...prevIDNV, id];
        }
        return prevIDNV;
      });

      messageInputRefTN.current.focus();
    }
  };

  const handleInputChange = (event) => {
    const text = event.target.value;
    setMessage(text);
    const namesArray = message
      .split(" @") // Tách mảng theo dấu " @"
      .map((name) => name.replace(/^@/, "").trim()) // Loại bỏ dấu @ và khoảng trắng thừa
      .filter((name) => name !== "");
    const dataNhanVien = isNhanVien.filter((user) => {
      return !namesArray.includes(user.fullName);
    });
    const cursorPosition = messageInputRef.current.selectionStart;

    const textBeforeCursor = text.slice(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();

      const filtered = dataNhanVien.filter((user) => {
        const normalizedFullName = unorm
          .nfd(user.fullName)
          .replace(/[\u0300-\u036f]/g, "");
        return normalizedFullName.toLowerCase().includes(query);
      });

      setFilteredUsers(filtered);
      setIsPopupVisible(true);
    } else {
      setIsPopupVisible(false);
    }
  };
  const handleInputChangeTN = (event) => {
    const text = event.target.value;
    setMessageTN(text);

    const atCount = (text.match(/@/g) || []).length; // Đếm số lần xuất hiện dấu "@"

    if (atCount > 1) {
      // Nếu có nhiều hơn một dấu @, xóa dấu @ thứ hai và không hiển thị popup
      const newText = text.replace(/@[^@]*$/, ""); // Xóa từ dấu @ thứ hai trở đi
      setMessageTN(newText);
      setIsPopupVisibleTN(false);
      return;
    }

    const namesArray = text
      .split(" @") // Tách mảng theo dấu " @"
      .map((name) => name.replace(/^@/, "").trim()) // Loại bỏ dấu @ và khoảng trắng thừa
      .filter((name) => name !== "");

    const dataNhanVienTN = isNhanVien.filter((user) => {
      return !namesArray.includes(user.fullName);
    });

    const cursorPosition = messageInputRefTN.current.selectionStart;

    const textBeforeCursor = text.slice(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();

      const filtered = dataNhanVienTN.filter((user) => {
        const normalizedFullName = unorm
          .nfd(user.fullName)
          .replace(/[\u0300-\u036f]/g, "");
        return normalizedFullName.toLowerCase().includes(query);
      });

      setFilteredUsersTN(filtered);
      setIsPopupVisibleTN(true);
    } else {
      setIsPopupVisibleTN(false);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = [".rar", ".zip"];
    console.log(file);
    if (!file) {
      setFile(null);
      setFileName("");
      return;
    }
    if (file) {
      const fileName = file.name.toLowerCase();
      const isValidExtension = allowedExtensions.some((ext) =>
        fileName.endsWith(ext)
      );

      if (!isValidExtension) {
        iziToast.error({
          title: "Error",
          message: "Vui lòng chọn file .rar hoặc .zip",
          position: "topRight",
        });
        return;
      }

      setFile(file);
      setFileName(file.name);
    }
  };
  return (
    <div className="">
      <div className="card">
        <div className="card-body cardbody">
          <div className="row headerDuAn">
            <div className="col-8 p-0 m-0">
              <h1
                style={{ textAlign: "left", fontSize: "28px" }}
                className="card-title   font-weight-bold  "
              >
                {isCheckShow == 1
                  ? "Xác nhận hoàn thành"
                  : isCheckShow == 0
                  ? "Tạo công việc"
                  : "Sửa công việc"}
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
            <div className="col-12 m-0 p-0 my-2 ">
              <div className="row">
                <div className="form-group col-6 m-0 p-0 pe-1">
                  <label htmlFor="projectName">Tên công việc</label>
                  <input
                    type="text"
                    className="form-control"
                    id="projectName"
                    placeholder=""
                    onChange={(e) => setWorkName(e.currentTarget.value)}
                    value={isWorkName}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group col-6 m-0 p-0 ps-1">
                  <label htmlFor="projectManager">Mã ticket</label>
                  <input
                    type="text"
                    className="form-control"
                    id="projectName"
                    placeholder=""
                    onChange={(e) => setMaTicket(e.currentTarget.value)}
                    value={isMaTicket}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-xl-12 m-0 p-0 my-2  ">
              <div className="row">
                <div className="form-group col-12 m-0 p-0 ">
                  <label htmlFor="startDate">Phòng ban</label>
                  <select
                    className="form-control"
                    id="selectPD"
                    ref={selectRef2}
                    style={{ minWidth: "100px" }}
                  >
                    <option value="">Tất cả</option>
                    {isPhongBan.map((item) => (
                      <option key={item.dep_Code} value={item.dep_Code}>
                        {item.dep_Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-xl-12 m-0 p-0 my-2  ">
              <div className="row">
                <div className="form-group col-12 m-0 p-0 ">
                  <label htmlFor="endDate">Thành viên nhóm</label>
                  <div className="bg-white rounded shadow-sm position-relative">
                    <textarea
                      style={{ height: "40px" }}
                      ref={messageInputRef}
                      className="form-control"
                      rows="4"
                      placeholder=""
                      value={message}
                      onChange={handleInputChange}
                    />

                    {isPopupVisible && (
                      <div
                        id="mentionPopup"
                        className="mention-popup list-group position-absolute"
                        style={{
                          maxHeight: "200px",
                          overflowY: "auto",
                          width: "100%",
                        }}
                      >
                        {filteredUsers.map((user) => (
                          <a
                            href="#"
                            key={user.id}
                            className="list-group-item list-group-item-action"
                            onClick={() =>
                              handleMentionSelect(user.fullName, user.userID)
                            }
                          >
                            {user.fullName}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-xl-12 m-0 p-0 my-2  ">
              <div className="row">
                <div className="form-group col-12 m-0 p-0 ">
                  <label htmlFor="endDate">Chịu trách nhiệm</label>
                  <div className="bg-white rounded shadow-sm position-relative">
                    <textarea
                      style={{ height: "40px" }}
                      ref={messageInputRefTN}
                      className="form-control"
                      rows="4"
                      placeholder=""
                      value={messageTN}
                      onChange={handleInputChangeTN}
                    />

                    {isPopupVisibleTN && (
                      <div
                        id="mentionPopup"
                        className="mention-popup list-group position-absolute"
                        style={{
                          maxHeight: "200px",
                          overflowY: "auto",
                          width: "100%",
                        }}
                      >
                        {filteredUsersTN.map((user) => (
                          <a
                            href="#"
                            key={user.id}
                            className="list-group-item list-group-item-action"
                            onClick={() =>
                              handleMentionSelectTN(user.fullName, user.userID)
                            }
                          >
                            {user.fullName}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12 col-xl-12 m-0 p-0 my-2  ">
              <div className="row">
                <div className="form-group col-6 m-0 p-0 pe-1">
                  <label htmlFor="startDate">Ngày bắt đầu</label>
                  <div className="tgDate">
                    {" "}
                    <input
                      ref={inputTGBGRef}
                      value={isThoiGianBD}
                      readOnly
                      className="thoigianbd thoigian form-control"
                      type="text"
                    />
                    <i
                      onClick={() => handleFocusInput(inputTGBGRef)}
                      class="fa-duotone fa-solid fa-calendar-days"
                    ></i>
                  </div>
                </div>
                <div className="form-group col-6 m-0 p-0 ps-1">
                  <label htmlFor="endDate">Ngày dự kiến kết thúc</label>
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
            <div className="col-lg-12 col-xl-12 m-0 p-0 my-2  ">
              <div className="row">
                <div className="form-group col-6 m-0 p-0 pe-1">
                  <label htmlFor="startDate">Ngày thông báo deadline</label>
                  <div className="tgDate">
                    {" "}
                    <input
                      ref={inputTGDLRef}
                      value={isThoiGianBao}
                      readOnly
                      className="thoigian thoigiandeadline form-control"
                      type="text"
                    />
                    <i
                      onClick={() => handleFocusInput(inputTGDLRef)}
                      class="fa-duotone fa-solid fa-calendar-days"
                    ></i>
                  </div>
                </div>
                <div className="form-group col-6 m-0 p-0 ps-1">
                  <label htmlFor="startDate">Ưu tiên</label>
                  <select
                    style={{ border: "1px solid #DEE2E6" }}
                    value={isUuTien}
                    onChange={(e) => setUuTien(e.currentTarget.value)}
                    id="select2_uutien"
                    className="select_uutien"
                  >
                    <option value="2">Cao</option>
                    <option value="1">Trung bình</option>
                    <option value="0">Thấp</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-xl-12 m-0 p-0 my-2  ">
              <div className="row">
                <div className="p-0">
                  <label htmlFor="projectDescription">Mô tả </label>

                  <input
                    type="text"
                    className="form-control"
                    id="projectName"
                    placeholder=""
                    onChange={(e) => setNoiDung(e.currentTarget.value)}
                    value={isNoiDung}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-xl-12 m-0 p-0 my-2  ">
              <div className="row">
                <div className="p-0">
                  <label htmlFor="projectDescription">Chi tiết công việc</label>
                  <TextEditor
                    setStateValue={isGhiChu}
                    setSetterValue={setGhiChu}
                    setClass={"Ghichu"}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-xl-12 m-0 p-0 my-2  ">
              <div className="row">
                <div className="form-group col-6 m-0 p-0 pe-1 d-none">
                  <label htmlFor="endDate">File</label>
                  <input
                    ref={inputRef}
                    type="file"
                    className="form-control"
                    onChange={(e) => handleFileChange(e)}
                    autoComplete="off"
                    accept=".rar,.zip"
                  />
                </div>
                <div className="form-group col-12 m-0 p-0  ">
                  <div className="position-relative">
                    <label htmlFor="endDate">File đính kèm</label>
                    <input
                      type="text"
                      className="form-control"
                      autoComplete="off"
                      onClick={() => handleFocusInput(inputRef)}
                      value={fileName || ""}
                    />
                    <i
                      style={{
                        position: "absolute",
                        top: "40px",
                        right: "11px",
                        fontSize: "20px",
                        color: " #9cb12b",
                        cursor: "pointer",
                      }}
                      onClick={() => handleFocusInput(inputRef)}
                      className="fa-solid fa-file-medical"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="d-flex"
              style={{ background: "#Fff", paddingBottom: "4px" }}
            >
              {" "}
              {isCheckShow == 1 && (
                <button
                  style={{ marginLeft: "auto" }}
                  onClick={handleShow}
                  className="btn btn-complete btn-lg btn-success"
                >
                  <i className="fas fa-check icon" /> Hoàn thành
                </button>
              )}
              {isCheckShow !== 1 && (
                <button
                  disabled={isDisable}
                  onClick={(e) => handleAddTask(e, IsHT)}
                  style={{ marginLeft: "auto" }}
                  type="submit"
                  className={`btn btn-primary ${
                    isCheckShow == 1 ? "d-none" : ""
                  }`}
                >
                  <i className="fas fa-paper-plane"></i>{" "}
                  {isCheckShow === 0 ? "Thêm việc mới" : "Cập nhật"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
