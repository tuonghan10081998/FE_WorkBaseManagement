import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Login.css";
// import { PostEmail, PostAccount, getAccount } from "../api/web";
import "bootstrap/dist/css/bootstrap.css";
import Select from "react-select";
import Swal from "sweetalert2";
import iziToast from "izitoast";

import $ from "jquery";
const Login = () => {
  const selectRef = useRef(null);
  const { para1 } = useParams();

  const [isPhongBanValue, setPhongBanValue] = useState("");
  const [isPhongBan, setPhongBan] = useState([]);
  const [isRegister, setIsRegister] = useState(true);
  const [isPPwlogin, setisPPwlogin] = useState(false);
  const [isPwSign, setisPwSign] = useState(false);
  const [isPwConfirm, setiisPwConfirm] = useState(false);
  const [isAgree, setAgree] = useState(false);
  const navigate = useNavigate();
  const pwlogin = useRef(null);
  const pwSign = useRef(null);
  const pwConfirm = useRef(null);
  const [showModal, setshowMoadl] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameLogin, setUsernameLogin] = useState("");
  const [ispwLogin, setpwLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAccept, setIsAccpet] = useState("");
  const [isCodeTele, setCodeTele] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isHoTen, setHoTen] = useState("");
  const [isTele, setTele] = useState("");
  const [isDisable, setDisable] = useState(false);
  const [isForget, setForget] = useState(true);
  const [options, setOption] = useState([]);
  const [isDisableLM, setDisableLM] = useState(false);
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
      console.log(formattedOptions);
      setOption(formattedOptions);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    console.log(options);
  }, [options]);
  const handleChange = (option) => {
    setPhongBanValue(option);
  };
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedRememberMe) {
      setUsernameLogin(savedUsername);
      setpwLogin(savedPassword);
      setRememberMe(savedRememberMe);
    }
  }, []);

  const handleLoginSubmit = async () => {
    if (usernameLogin == "" || ispwLogin == "") {
      iziToast.warning({
        title: "Warning",
        message: `Vui lòng điền đầy đủ thông tin .`,
        position: "topRight",
      });
      return;
    }
    const object = {
      userName: usernameLogin.toString(),
      fullName: "",
      passWord: ispwLogin.toString(),
      email: "",
      telegram: "",
      department: "",
    };
    PostLogin(object);
  };
  const PostLogin = async (object) => {
    const request = new Request(`${process.env.REACT_APP_URL_API}User/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(object),
    });
    let response = await fetch(request);
    let data2 = await response.json();
    if (data2.statusCode != "200") {
      iziToast.warning({
        title: "Warning",
        message: data2.message,
        position: "topRight",
      });
      return;
    }
    if (rememberMe) {
      localStorage.setItem("username", usernameLogin);
      localStorage.setItem("password", ispwLogin);

      localStorage.setItem("rememberMe", true);
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.setItem("rememberMe", false);
    }
    localStorage.setItem("usernameID", usernameLogin);
    localStorage.setItem("passwordID", ispwLogin);
    localStorage.setItem("userID", data2.data.userID);
    localStorage.setItem("fullName", data2.data.fullName);
    if (data2.data.lstPage?.includes("DB")) navigate("/layout/Dashboard");
    else navigate("/layout/listcongviec");
  };
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };
  const loadUseState = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setHoTen("");
    setAgree(false);
  };

  const btnSignUp = useRef(null);
  const btnSignIn = useRef(null);
  const connexionSection = useRef(null);
  const enregistrerSection = useRef(null);
  const agree = async (event) => {
    setAgree(!isAgree);
  };
  const handleClose = async () => {
    setshowMoadl(false);
  };
  const handleAccpet = async () => {
    setshowMoadl(false);
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!isRegister) {
      isForget && regicter();
      !isForget && handleChangePW();
    }

    if (isRegister) {
      handleLoginSubmit();
    }
  };
  const handleChangePW = () => {
    if (isCodeTele == "") {
      iziToast.warning({
        title: "Warning",
        message: `Vui lòng điều mã xác nhận telegram .`,
        position: "topRight",
      });
      setDisable(false);
      return;
    }
    if (username == "" || password == "" || confirmPassword == "") {
      iziToast.warning({
        title: "Warning",
        message: `Vui lòng điền đầy đủ thông tin .`,
        position: "topRight",
      });
      setDisable(false);
      return;
    }
    if (password !== confirmPassword) {
      iziToast.warning({
        title: "Warning",
        message: `Vui lòng nhập đúng mật khẩu .`,
        position: "topRight",
      });
      setDisable(false);
      return;
    }
    const object = {
      userName: username.toString(),
      fullName: "",
      passWord: password.toString(),
      email: "",
      telegram: "",
      department: "",
      userID: "string",
      codeResetPass: isCodeTele,
    };
    setDisable(false);
    PostForgot(object, "ResetPass");
  };
  const handlegetcode = async () => {
    setDisableLM(true);
    if (username === "") {
      iziToast.warning({
        title: "Warning",
        message: `Vui lòng nhập tài khoản .`,
        position: "topRight",
      });
      setDisableLM(false);
      return;
    }
    const object = {
      userName: username.toString(),
      fullName: "",
      passWord: "",
      email: "",
      telegram: "",
      department: "",
      userID: "string",
      codeResetPass: 0,
    };
    PostForgot(object, "ForgotPass");
  };
  const PostForgot = async (object, NamePort) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}User/${NamePort}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(object),
      }
    );
    let response = await fetch(request);
    let data = await response.json();
    setDisableLM(false);
    if (data.statusCode == "200") {
      iziToast.success({
        title: "Success",
        message: data.message,
        position: "topRight",
      });
      if (NamePort == "ResetPass") {
        loadUseState();
        setIsRegister(true);
        setForget(true);
        btnSignIn.current.classList.remove("active");
        btnSignUp.current.classList.add("active");
        enregistrerSection.current.classList.add("active-section");
        connexionSection.current.classList.remove("remove-section");
      }
    } else {
      iziToast.warning({
        title: "Warning",
        message: data.message,
        position: "topRight",
      });
    }
  };
  const regicter = async () => {
    if (
      username == "" ||
      password == "" ||
      confirmPassword == "" ||
      email == "" ||
      isPhongBanValue.value == undefined ||
      isHoTen == "" ||
      isTele == ""
    ) {
      iziToast.warning({
        title: "Warning",
        message: `Vui lòng điền đầy đủ thông tin .`,
        position: "topRight",
      });
      setDisable(false);
      return;
    }

    if (password !== confirmPassword) {
      iziToast.warning({
        title: "Warning",
        message: `Vui lòng nhập đúng mật khẩu .`,
        position: "topRight",
      });
      setDisable(false);
      return;
    }
    const object = {
      userName: username.toString(),
      fullName: isHoTen.toString(),
      passWord: password.toString(),
      email: email,
      telegram: isTele,
      department: isPhongBanValue.toString(),
    };
    PostRegister(object);
  };
  const PostRegister = async (object) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}User/Register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(object),
      }
    );
    let response = await fetch(request);
    let data = await response.json();
    setDisable(false);
    if (data.statusCode == "200") {
      iziToast.success({
        title: "Success",
        message: data.message,
        position: "topRight",
      });
      loadUseState();
      setIsRegister(true);

      btnSignIn.current.classList.remove("active");
      btnSignUp.current.classList.add("active");
      enregistrerSection.current.classList.add("active-section");
      connexionSection.current.classList.remove("remove-section");
    } else {
      iziToast.warning({
        title: "Warning",
        message: data.message,
        position: "topRight",
      });
    }
  };
  const showpwlogin = async (event) => {
    event.preventDefault();
    setisPPwlogin(!isPPwlogin);
  };
  const showpwSign = async (event) => {
    event.preventDefault();
    setisPwSign(!isPwSign);
  };
  const showpwComfirm = async (event) => {
    event.preventDefault();
    setiisPwConfirm(!isPwConfirm);
  };
  const handleSignIN = async (event) => {
    event.preventDefault();
    setForget(true);
    setIsRegister(true);
    btnSignIn.current.classList.remove("active");
    btnSignUp.current.classList.add("active");
    enregistrerSection.current.classList.add("active-section");
    connexionSection.current.classList.remove("remove-section");
  };
  const handleSignUp = async (event) => {
    event.preventDefault();
    setIsRegister(false);
    setForget(true);
    btnSignIn.current.classList.add("active");
    btnSignUp.current.classList.remove("active");
    enregistrerSection.current.classList.remove("active-section");
    connexionSection.current.classList.add("remove-section");
  };
  const handleForget = async (e) => {
    e.preventDefault();
    setIsRegister(false);
    setForget(false);
    btnSignIn.current.classList.add("active");
    btnSignUp.current.classList.remove("active");
    enregistrerSection.current.classList.remove("active-section");
    connexionSection.current.classList.add("remove-section");
  };
  return (
    <>
      <div className="content">
        <div className="item_container">
          <div className="container2">
            <img className="bg-img" src="/img/bg.jpg" alt="" />
            <div className="menu">
              <a
                onClick={handleSignIN}
                href="#connexion"
                ref={btnSignIn}
                className="btn-connexion"
              >
                <h2 className="text-white">Đăng nhập</h2>
              </a>
              <a
                onClick={handleSignUp}
                href="#enregistrer"
                ref={btnSignUp}
                className="btn-enregistrer active"
              >
                <h2 className="text-white">
                  {isForget ? "Đăng ký" : "Mật khẩu"}
                </h2>
              </a>
            </div>
            <div className="connexion" ref={connexionSection}>
              <div className="contact-form">
                <label>Tài khoản</label>
                <input
                  placeholder=""
                  type="text"
                  value={usernameLogin}
                  onChange={(e) => setUsernameLogin(e.target.value)}
                  autoComplete="off"
                />
                <label>Mật khẩu</label>
                <div className="item_father ">
                  <input
                    placeholder=""
                    value={ispwLogin}
                    type={!isPPwlogin ? "password" : "text"}
                    onChange={(e) => setpwLogin(e.target.value)}
                    autoComplete="off"
                  />
                  <i
                    ref={pwlogin}
                    onClick={showpwlogin}
                    className={`fa-sharp fa-solid ${
                      !isPPwlogin ? "fa-eye-slash" : "fa-eye"
                    }  login_eye`}
                  ></i>
                </div>
                <div className="list_check">
                  <div className="check">
                    <label>
                      <input
                        onChange={handleRememberMeChange}
                        checked={rememberMe}
                        id="check"
                        type="checkbox"
                        className="checkbox"
                        autoComplete="off"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26px"
                        height="23px"
                      >
                        <path
                          className="path-back"
                          d="M1.5,6.021V2.451C1.5,2.009,1.646,1.5,2.3,1.5h18.4c0.442,0,0.8,0.358,0.8,0.801v18.398c0,0.442-0.357,0.801-0.8,0.801H2.3c-0.442,0-0.8-0.358-0.8-0.801V6"
                        />
                        <path
                          className="path-moving"
                          d="M24.192,3.813L11.818,16.188L1.5,6.021V2.451C1.5,2.009,1.646,1.5,2.3,1.5h18.4c0.442,0,0.8,0.358,0.8,0.801v18.398c0,0.442-0.357,0.801-0.8,0.801H2.3c-0.442,0-0.8-0.358-0.8-0.801V6"
                        />
                      </svg>
                    </label>
                    <h3 className="text-white">Nhớ mật khẩu</h3>
                  </div>
                  <div className="coin">
                    <span className="engraving">
                      <i className="fa-light fa-house"></i>
                    </span>
                  </div>
                </div>

                <input
                  onClick={submit}
                  className="submit"
                  defaultValue="SIGN IN"
                  type="submit"
                  autoComplete="off"
                />
              </div>
              <hr />
              <a onClick={(e) => handleForget(e)} target="_blank">
                <h4 className="textLogin">Quên mật khẩu</h4>
              </a>
            </div>
            <div
              className="enregistrer active-section"
              ref={enregistrerSection}
            >
              <div
                style={{ marginTop: `${isForget ? "0" : "100px"}` }}
                className="contact-form "
              >
                {isForget && (
                  <div className="col-12 m-0 p-0 my-2 mt-4">
                    <div className="row">
                      <div className="form-group col-12 m-0">
                        <Select
                          options={options}
                          value={isPhongBanValue}
                          onChange={handleChange}
                          placeholder="Chọn phòng ban..."
                          isSearchable
                        />
                      </div>
                    </div>
                  </div>
                )}
                <input
                  className="mt-4"
                  placeholder="Tài khoản"
                  value={username}
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                />

                {isForget && (
                  <>
                    {" "}
                    <input
                      className="mt-4"
                      placeholder="Họ tên"
                      value={isHoTen}
                      type="text"
                      onChange={(e) => setHoTen(e.target.value)}
                      autoComplete="off"
                    />
                    <input
                      className="mt-4"
                      placeholder="E-mail"
                      value={email}
                      type="text"
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="off"
                    />
                    <input
                      className="mt-4"
                      placeholder="Telegram"
                      value={isTele}
                      type="text"
                      onChange={(e) => setTele(e.target.value)}
                      autoComplete="off"
                    />
                  </>
                )}

                <div className="item_father ">
                  <input
                    className="mt-4"
                    placeholder="Mật khẩu"
                    value={password}
                    type={!isPwSign ? "password" : "text"}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
                  />
                  <i
                    onClick={showpwSign}
                    ref={pwSign}
                    className={`fa-sharp fa-solid ${
                      !isPwSign ? "fa-eye-slash" : "fa-eye"
                    }  login_eye`}
                  ></i>
                </div>
                <div className="item_father ">
                  <input
                    className="mt-4"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    type={!isPwConfirm ? "password" : "text"}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="off"
                  />
                  <i
                    onClick={showpwComfirm}
                    ref={pwConfirm}
                    className={`fa-sharp fa-solid ${
                      !isPwConfirm ? "fa-eye-slash" : "fa-eye"
                    }  login_eye`}
                  ></i>
                </div>

                {!isForget && (
                  <div className="list_getCode mt-4">
                    <input
                      style={{ height: "40px" }}
                      placeholder="Nhập mã telegram"
                      value={isCodeTele}
                      type="text"
                      disabled={isDisableLM}
                      onChange={(e) => {
                        setCodeTele(e.target.value);
                      }}
                    />
                    <button onClick={handlegetcode}>Lấy mã</button>
                  </div>
                )}

                <input
                  disabled={isDisable}
                  onClick={submit}
                  className="submit mt-4"
                  defaultValue="SIGN UP"
                  type="submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
