import React, { useState, useEffect, useContext } from "react";
import PQPhongBan from "./PQPhongBan";

import PQRole from "./PQRole";
import PQModule from "./PQModule";
import { TitleContext } from "../components/TitleContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../PhanQuyen/PhanQuyen.css";
import iziToast from "izitoast";
import Select from "react-select";
import PQPositon from "./PQPositon";
import PQIDGGSheet from "./PQIDGGSheet";
const PhanQuyen = () => {
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const [showPopup, setshowPopup] = useState(false);
  const [isNhanVienP, setNhanVienP] = useState("");
  const { setTitle, setIcon } = useContext(TitleContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isData, setData] = useState([]);
  const [isDataNV, setDataNV] = useState([]);
  const [isID, setID] = useState(null);
  const [isTab, setTab] = useState("1");
  const [islstUserDep, setlstUserDep] = useState([]);
  const [islstUserPage, setlstUserPage] = useState([]);
  const [islstUserRole, setlstUserRole] = useState([]);
  const [isNhanVien, setNhanVien] = useState("");
  const [isCheckAdd, setCheckAdd] = useState(false);
  const [options, setOption] = useState([]);
  const [isPhongBanValue, setPhongBanValue] = useState("");
  const [isUserID, setUserID] = useState("");
  const [isPosition, setPosition] = useState("");
  const [isPositionA, setPositionA] = useState(false);
  const [isGGSheet, setGGSheet] = useState([]);
  useEffect(() => {
    getPhongBan();
  }, []);
  const getPhongBan = async () => {
    const url = `${process.env.REACT_APP_URL_API}Department/Get?action=get`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      const formattedOptions = data.map((dep) => ({
        value: dep.dep_Code,
        label: dep.dep_Name,
      }));
      formattedOptions.unshift({
        value: "all",
        label: "-- Tất cả --",
      });
      setOption(formattedOptions);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getIDGGSheet();
  }, []);
  const getIDGGSheet = async () => {
    const url = `${process.env.REACT_APP_URL_API}MarketingData/GetGGInfo`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setGGSheet(data);
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleChange = (option) => {
    setPhongBanValue(option);
  };

  useEffect(() => {
    setTitle(` Phân quyền `);
    setIcon(<i class="fa-solid fa-window-restore"></i>);
  }, []);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const url = `${process.env.REACT_APP_URL_API}User/Get?action=Get`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const staffData = await response.json();
      let dataNV = staffData.filter(
        (x) => x.fullName.toLowerCase() !== "admin"
      );
      setData(dataNV);
    } catch (error) {
      console.error(error.message);
    }
  };
  const getPhanQuyen = async () => {
    const url = `${process.env.REACT_APP_URL_API}User/GetRole?action=GEt&para1=${isID}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      setlstUserDep(data.lstUserDep);
      setlstUserPage(data.lstUserPage);
      setlstUserRole(data.lstUserRole);
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleCheckPB = (dep_Code, isChecked) => {
    const updatedData = islstUserDep.map((item) =>
      item.dep_Code == dep_Code ? { ...item, isChecked: isChecked } : item
    );
    setlstUserDep(updatedData);
  };
  const handleCheckRole = (roleID, isChecked) => {
    const updatedData = islstUserRole.map((item) =>
      item.roleID == roleID
        ? { ...item, isChecked: isChecked }
        : { ...item, isChecked: 0 }
    );
    setlstUserRole(updatedData);
  };
  const handleCheckModule = (pageID, isChecked) => {
    const updatedData = islstUserPage.map((item) =>
      item.pageID == pageID ? { ...item, isChecked: isChecked } : item
    );
    setlstUserPage(updatedData);
  };
  useEffect(() => {
    if (isDataNV.length > 0 && isID !== null) getPhanQuyen();
  }, [isID, isCheckAdd, isDataNV]);
  useEffect(() => {
    let dataNV = isData.filter(
      (x) =>
        x.fullName &&
        x.fullName.toLowerCase().includes(isNhanVien.toLowerCase()) &&
        x.fullName !== "Admin"
    );
    if (isPhongBanValue.value && isPhongBanValue.value != "all") {
      dataNV = dataNV.filter((x) => x.dep_Code === isPhongBanValue.value);
    }
    if (dataNV.length > 0) {
      setID(dataNV[0].userID);
      setActiveIndex(0);
    } else {
      setlstUserDep([]);
      setlstUserPage([]);
      setlstUserRole([]);
    }

    setDataNV(dataNV);
  }, [isNhanVien, isData, isPhongBanValue]);
  const handleSave = async () => {
    let arrUserDep = [];
    let arrUserPage = [];
    let arrUserRole = [];
    islstUserDep.map((x) => {
      const object = {
        id: x.id,
        userID: isID.toString(),
        dep_Code: x.dep_Code.toString(),
        isChecked: x.isChecked,
      };
      arrUserDep.push(object);
    });
    islstUserPage.map((x) => {
      const object = {
        id: x.id,
        userID: isID.toString(),
        pageID: x.pageID.toString(),
        isChecked: x.isChecked,
      };
      arrUserPage.push(object);
    });
    islstUserRole.map((x) => {
      const object = {
        id: x.id,
        userID: isID.toString(),
        roleID: x.roleID.toString(),
        isChecked: x.isChecked,
      };
      arrUserRole.push(object);
    });

    const dataToSend = JSON.stringify({
      userDeps: arrUserDep,
      userPages: arrUserPage,
      useRoles: arrUserRole,
    });
    await PostSave(dataToSend);
  };
  const PostSave = async (dataToSend) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}User/PostRole?action=Post`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: dataToSend,
      }
    );
    let response = await fetch(request);
    let data = await response.json();
    if (data.statusCode == "200") {
      iziToast.success({
        title: "Success",
        message: `Lưu thành công`,
        position: "topRight",
      });
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Lưu thất bại`,
        position: "topRight",
      });
    }
  };
  useEffect(() => {
    setData((prevData) =>
      prevData.map((d) =>
        d.userID === isUserID ? { ...d, position: isPosition } : d
      )
    );
  }, [isPositionA]);
  return (
    <div className="py-2 px-2 contentItem">
      <div className="row g-2">
        {/* Danh sách tài khoản */}
        <div className="col-md-12 col-lg-7 position-relative">
          <div className="card">
            <div className="">
              <div className="h5 d-flex m-0 titlePQ">
                Danh sách{" "}
                <div className="settingPQ">
                  {/* <i class="fa-solid fa-gear"></i> */}
                </div>
              </div>
            </div>
            <ul className="list-group list-group-flush">
              <div className="row">
                {" "}
                <div className="col-6">
                  <label style={{ fontWeight: "bold", fontSize: "17px" }}>
                    Phòng ban{" "}
                  </label>{" "}
                  <Select
                    options={options}
                    value={isPhongBanValue}
                    onChange={handleChange}
                    placeholder="-- Tất cả --"
                    isSearchable
                  />
                </div>
                <div className="col-6">
                  <label style={{ fontWeight: "bold", fontSize: "17px" }}>
                    Nhân viên
                  </label>{" "}
                  <input
                    type="text"
                    id="projectFilter"
                    className="form-control mr-2 mb-2"
                    placeholder=""
                    value={isNhanVien}
                    onChange={(e) => setNhanVien(e.currentTarget.value)}
                  />
                </div>
              </div>
              <div>
                <li className="list-group-item ">
                  <div className="tilteLI sttPQ">Stt</div>
                  <div className="gridUL row m-0 p-0  w-100">
                    <span className="tilteLI pqul col-4"> Họ tên</span>
                    <span className="tilteLI pqul col-4"> Email</span>
                    <span className="tilteLI pqul col-4"> Chức vụ</span>
                  </div>
                </li>
              </div>
              <div className="listTK">
                {" "}
                {isDataNV.map((account, index) => (
                  <li
                    key={index}
                    className={`list-group-item ${
                      activeIndex === index ? "active" : ""
                    }`}
                    onClick={() => {
                      setActiveIndex(index);
                      setID(account.userID);
                      setNhanVienP(account.fullName);
                      setUserID(account.userID);
                      setPosition(account.position);
                    }}
                  >
                    <div className="sttPQ">{index + 1}</div>
                    <div className="gridUL row m-0 p-0  w-100">
                      <span className=" pqul  col-4">
                        {account.fullName || ""}
                      </span>

                      <span className="pqul  pqul2 col-4">
                        {account.email || ""}
                      </span>
                      <span className="pqul  col-4">
                        {account.position || ""}
                        <i
                          onClick={() => setshowPopup(true)}
                          class="fa-solid fa-circle-plus"
                        ></i>
                      </span>
                    </div>
                  </li>
                ))}
              </div>
            </ul>
          </div>
          {/* <div className="popupsettingCart popupsettingCV">
            <div>
              <i className="fa-solid fa-pen-to-square me-1"></i>
              <span>Đổi mật khẩu</span>
            </div>

            {isIDLogin == "VNManh" && (
              <div
                onClick={(e) => {
                  // handleShow(e);
                  // setLableBody("Bạn muốn xóa dự án này");
                  // setLable("Thông báo");
                  // setCheckView(1);
                }}
                style={{ boxShadow: "none" }}
              >
                <i
                  style={{ color: "REd" }}
                  className="fa-solid fa-trash me-1"
                ></i>
                <span> Xóa </span>
              </div>
            )}
          </div> */}
        </div>

        {/* Chi tiết tài khoản */}
        <div className="col-md-12 col-lg-5">
          <div className="card" style={{ height: "50px" }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0 ">Chi tiết </h2>
              <div>
                <button onClick={handleSave} className="save-button">
                  <i className="fas fa-save" />
                  Lưu
                </button>
              </div>
            </div>
            <div>
              <div className="tab-table">
                <div
                  onClick={() => setTab(1)}
                  className={`item-table ${isTab == 1 ? "active" : ""}`}
                >
                  {" "}
                  <i class="fa-solid fa-list-ol"></i>
                  Phòng ban
                </div>
                <div
                  onClick={() => setTab(2)}
                  className={`item-table ${isTab == 2 ? "active" : ""}`}
                >
                  {" "}
                  <i class="fa-solid fa-server"></i>
                  Trang
                </div>
                <div
                  onClick={() => setTab(3)}
                  className={`item-table ${isTab == 3 ? "active" : ""}`}
                >
                  {" "}
                  <i class="fa-solid fa-gamepad"></i>
                  Chức năng
                </div>
                {isUser === "a640ab6a-30d6-40bc-8bd2-7ecd1534e0db" && (
                  <div
                    onClick={() => setTab(4)}
                    className={`item-table ${isTab == 4 ? "active" : ""}`}
                  >
                    {" "}
                    <i class="fa-brands fa-google-drive"></i>
                    ID GGSheet
                  </div>
                )}
              </div>
              <div className={` ${isTab == 1 ? "d-flex" : "d-none"}`}>
                <PQPhongBan
                  isData={islstUserDep}
                  onchange={handleCheckPB}
                  setCheckAdd={setCheckAdd}
                />
              </div>
              <div className={` ${isTab == 2 ? "d-flex" : "d-none"}`}>
                <PQModule isData={islstUserPage} onchange={handleCheckModule} />
              </div>
              <div className={` ${isTab == 3 ? "d-flex" : "d-none"}`}>
                <PQRole isData={islstUserRole} onchange={handleCheckRole} />
              </div>
              <div className={` ${isTab == 4 ? "d-flex" : "d-none"}`}>
                <PQIDGGSheet data={isGGSheet} setData={setGGSheet} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <PQPositon
          setNhanVien={isNhanVienP}
          setShowPopup={setshowPopup}
          showPopup={showPopup}
          setUserID={isUserID}
          setPosition={setPosition}
          setIsPosition={isPosition}
          setPositionA={setPositionA}
        />
      </div>
    </div>
  );
};

export default PhanQuyen;
