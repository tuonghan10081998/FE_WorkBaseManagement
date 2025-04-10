import React, { useState, useEffect, useContext } from "react";
import PQPhongBan from "./PQPhongBan";
import PQRole from "./PQRole";
import PQModule from "./PQModule";
import { TitleContext } from "../components/TitleContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../PhanQuyen/PhanQuyen.css";
import iziToast from "izitoast";
const PhanQuyen = () => {
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));

  const { setTitle, setIcon } = useContext(TitleContext);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isData, setData] = useState([]);
  const [isDataNV, setDataNV] = useState([]);
  const [isID, setID] = useState(null);
  const [isTab, setTab] = useState("1");
  const [islstUserDep, setlstUserDep] = useState([]);
  const [islstUserPage, setlstUserPage] = useState([]);
  const [islstUserRole, setlstUserRole] = useState([]);
  const [isNhanVien, setNhanVien] = useState("");
  const [isCheckAdd, setCheckAdd] = useState(false);
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
      setData(staffData);
      staffData && setID(staffData[0].userID);
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
    console.log(roleID);
    const updatedData = islstUserRole.map((item) =>
      item.roleID == roleID ? { ...item, isChecked: isChecked } : item
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
    isID && getPhanQuyen();
  }, [isID, isCheckAdd]);
  useEffect(() => {
    let dataNV = isData.filter(
      (x) =>
        x.fullName &&
        x.fullName.toLowerCase().includes(isNhanVien.toLowerCase())
    );
    setDataNV(dataNV);
  }, [isNhanVien, isData]);
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
  return (
    <div className="py-2 px-2">
      <div className="row g-2">
        {/* Danh sách tài khoản */}
        <div className="col-md-12 col-lg-6 position-relative">
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
              <div>
                {" "}
                <input
                  type="text"
                  id="projectFilter"
                  className="form-control mr-2 mb-2"
                  placeholder="Tìm kiếm nhân viên ..."
                  value={isNhanVien}
                  onChange={(e) => setNhanVien(e.currentTarget.value)}
                />
              </div>
              <div>
                <li className="list-group-item ">
                  <div className="tilteLI sttPQ">Stt</div>
                  <div className="gridUL row m-0 p-0  w-100">
                    <span className="tilteLI pqul col-4"> Họ tên</span>
                    <span className="tilteLI pqul col-4"> Tài khoản</span>
                    <span className="tilteLI pqul col-4"> Email</span>
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
                    }}
                  >
                    <div className="sttPQ">{index + 1}</div>
                    <div className="gridUL row m-0 p-0  w-100">
                      <span className=" pqul col-4">
                        {account.fullName || ""}
                      </span>
                      <span className="pqul col-4">
                        {" "}
                        {account.userName || ""}{" "}
                      </span>
                      <span className="pqul col-4">{account.Email || ""}</span>
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
        <div className="col-md-12 col-lg-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhanQuyen;
