import { useRef, useEffect, useState, useContext } from "react";
import iziToast from "izitoast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import moment from "moment";
import Select from "react-select";
const Info = ({ setCheck, setShowInfo, setSaveInfo }) => {
  const [isFullName, setFullName] = useState(localStorage.getItem("fullName"));
  const [isUser, setUser] = useState(localStorage.getItem("userID"));

  const [isPhongBan, setPhongBan] = useState([]);
  const [isTaiKhoan, setTaiKhoan] = useState(
    localStorage.getItem("usernameID")
  );
  const [isEmail, setEmail] = useState("");
  const [isTele, setTele] = useState("");
  const [isData, setData] = useState("");
  const [isAvatar, setAvatar] = useState("");
  const [isAvatarS, setAvatarS] = useState("");
  const [isDisable, setDisable] = useState(false);
  const [isPhongBanValue, setPhongBanValue] = useState(null);
  const [options, setOption] = useState([]);
  const inputRef = useState(null);
  const IMG_API = process.env.REACT_APP_URL_IMG;

  const getPhongBan = async () => {
    const url = `${process.env.REACT_APP_URL_API}Department/Get?action=get`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);

      const data = await response.json();
      const formattedOptions = data.map((dep) => ({
        value: dep.dep_Code,
        label: dep.dep_Name,
      }));
      setOption(formattedOptions);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getPhongBan();
  }, []);
  const getData = async () => {
    if (isUser == "") return;
    const url = `${process.env.REACT_APP_URL_API}User/Get?action=get&para1=${isUser}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);

      const data = await response.json();
      const d = data[0];
      setTele(d.telegram);
      setEmail(d.email);
      setPhongBan(d.dep_Code);
      const imageUrl = `${IMG_API}${
        d.avatar?.trim() ? d.avatar : "Default/UserDefault.png"
      }`;
      const imageWithTimestamp = `${imageUrl}?t=${Date.now()}`;
      setAvatar(imageWithTimestamp);
      setAvatarS(`${d.avartar ?? "Default/UserDefault.png"}`);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getData();
  }, [setCheck]);
  useEffect(() => {
    if (isPhongBan == "") return;
    const defaultOption = options.find((opt) => opt.value === isPhongBan);
    setPhongBanValue(defaultOption);
  }, [options, isPhongBan]);
  useEffect(() => {});
  const handleChange = (option) => {
    setPhongBanValue(option);
  };
  const handleSave = (e) => {
    e.preventDefault();

    if (isTaiKhoan == "") {
      handleNotifi("nhập tài khoản");
      return;
    }
    if (isFullName == "") {
      handleNotifi("nhập họ tên");
      return;
    }
    if (isEmail == "") {
      handleNotifi("nhập email");
      return;
    }
    if (isTele == "") {
      handleNotifi("nhập telegram");
      return;
    }
    const object = {
      userName: isTaiKhoan,
      fullName: isFullName,
      passWord: "",
      email: isEmail,
      telegram: isTele,
      department: isPhongBanValue.value,
      userID: isUser,
      avartar: isAvatarS,
    };
    PostFB(object);
  };
  const PostFB = async (arrPost) => {
    const request = new Request(`${process.env.REACT_APP_URL_API}User/Post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arrPost),
    });
    let response = await fetch(request);
    let data = await response.json();
    if (data.statusCode == "200") {
      iziToast.success({
        title: "Success",
        message: data.message,
        position: "topRight",
      });
      setShowInfo((d) => !d);
      setSaveInfo((x) => !x);
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
  const handleFocusInput = (inputRef) => {
    if (inputRef.current) {
      console.log(1);
      inputRef.current.click();
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setAvatar(evt.target.result);
        setAvatarS(evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="">
      <div className="card px-2">
        <div className="col-12 col-md-6 p-2 d-none">
          <label className="form-label" htmlFor="imageInput">
            Chọn hình ảnh
          </label>
          <input
            ref={inputRef}
            className="form-control"
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="card-body  px-4 py-2">
          <form>
            <div className="col-12 m-0 p-0 my-2 ">
              <div className="row">
                <div className="form-group col-12 m-0 p-0 ">
                  <label htmlFor="projectName">Tài khoản</label>
                  <input
                    type="text"
                    className="form-control"
                    id="projectName"
                    placeholder=""
                    onChange={(e) => setTaiKhoan(e.currentTarget.value)}
                    value={isTaiKhoan}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className="col-12 m-0 p-0 my-2 ">
              <div className="row">
                <div className="form-group col-12 m-0 p-0 ">
                  <label htmlFor="projectName">Họ tên</label>
                  <input
                    type="text"
                    className="form-control"
                    id="projectName"
                    placeholder=""
                    onChange={(e) => setFullName(e.currentTarget.value)}
                    value={isFullName}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className="col-12 m-0 p-0 my-2 ">
              <div className="row">
                <div className="form-group col-12 m-0 p-0 ">
                  <label htmlFor="projectName">Phòng ban</label>
                  <Select
                    isDisabled={true}
                    options={options}
                    value={isPhongBanValue}
                    onChange={handleChange}
                    placeholder=""
                    isSearchable
                  />
                </div>
              </div>
            </div>
            <div className="col-12 m-0 p-0 my-2 ">
              <div className="row">
                <div className="form-group col-12 m-0 p-0 ">
                  <label htmlFor="projectName">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    id="projectName"
                    placeholder=""
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    value={isEmail}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className="col-12 m-0 p-0 my-2 ">
              <div className="row">
                <div className="form-group col-12 m-0 p-0 ">
                  <label
                    htmlFor="projectName"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Avatar</span>
                    <div style={{ cursor: "pointer" }}>
                      <i
                        onClick={() => handleFocusInput(inputRef)}
                        class="fa-solid fa-user-astronaut"
                      ></i>
                    </div>
                  </label>
                  <div className="d-flex justify-content-center align-items-center">
                    <img
                      src={isAvatar}
                      alt={`Logo ${isAvatar}`}
                      width={80}
                      height={80}
                      className="rounded-circle"
                      style={{
                        objectFit: "cover",
                        boxShadow: "0 0 6px rgb(0 0 0 / 0.15)",
                      }}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 m-0 p-0 my-2 d-none">
              <div className="row">
                <div className="form-group col-12 m-0 p-0 ">
                  <label htmlFor="projectName">Telegram</label>
                  <input
                    type="number"
                    className="form-control"
                    id="projectName"
                    placeholder=""
                    onChange={(e) => setTele(e.currentTarget.value)}
                    value={isTele}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div
                className="d-flex  p-0 py-2"
                style={{ background: "#Fff", paddingBottom: "4px" }}
              >
                <button
                  disabled={isDisable}
                  onClick={(e) => handleSave(e)}
                  style={{ marginLeft: "auto" }}
                  type="submit"
                  className={`btn btn-primary  mt-3
                 
                }`}
                >
                  <i className="fas fa-paper-plane"></i> Cập nhật
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Info;
