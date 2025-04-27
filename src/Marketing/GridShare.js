import React, { useState, useEffect, useContext } from "react";
import ModalShare from "./ModalShare";
import GoogleSheetForm from "./GoogleSheetForm ";
const GridShare = ({ dataNV, data, setChienDich, setClick, setIsClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDataF, setDataF] = useState([]);
  const [listData, setListData] = useState([]);
  const [isID, setID] = useState(null);
  const [isChange, setChange] = useState(null);
  const [isNVNew, setNVNew] = useState(null);
  const [isCheckAll, setCheckAll] = useState(1);
  const [isShow, setShow] = useState(false);
  const [isDisable, setDisable] = useState(false);
  const handleChangeCheck = (e, id, isChecked) => {
    e.preventDefault();
    const newData = listData.map((x) => {
      if (x.id === id) {
        return { ...x, isChecked: isChecked, receiverID: isID };
      }
      return x;
    });
    setListData(newData);
  };
  const handleCheckUser = (id) => {
    const newData = isNVNew.map((x) =>
      x.userID === id ? { ...x, isChecked: x.isChecked === 1 ? 0 : 1 } : x
    );
    setNVNew(newData);
  };
  const handleClick = (e, index, userID) => {
    setActiveIndex(index);
    setID(userID);
  };
  useEffect(() => {
    setActiveIndex(0);
    setID(dataNV[0]?.userID);
    const updatedNV = dataNV.map((item) => ({
      ...item,
      isChecked: 1, // hoặc 0 tùy bạn muốn kiểu gì
    }));
    setNVNew(updatedNV);
  }, [dataNV]);
  useEffect(() => {
    const dataF = listData?.filter((x) => {
      const matchChienDich =
        setChienDich === "all"
          ? true
          : x.utmCampaign.toUpperCase().includes(setChienDich.toUpperCase());

      const matchReceiver =
        x.isChecked !== 1 || (x.isChecked === 1 && x.receiverID === isID);
      // ||
      // x.oldReceiverID === isID

      return matchChienDich && matchReceiver;
    });

    setDataF(dataF);
  }, [isID, listData, setChienDich, isChange]);
  useEffect(() => {
    data && setListData(data);
  }, [data]);
  const handleSave = async (e) => {
    e.preventDefault();
    setDisable(true);
  };
  const handleCheckAll = () => {
    const Check = isCheckAll === 1 ? 0 : 1;
    setCheckAll(Check);
    setNVNew((pre) =>
      pre.map((x) => ({
        ...x,
        isChecked: Check,
      }))
    );
  };
  const handleGet = () => {
    setShow(true);
  };
  return (
    <div className="py-2 px-2 ">
      <div className="row g-2">
        {/* Danh sách tài khoản */}
        <div className="col-md-12 col-lg-3 col-xl-2 position-relative">
          <div className="card">
            <div className="">
              <div className="h5 d-flex m-0 titlePQ titleShare">
                Danh sách{" "}
                <div className="settingPQ">
                  {/* <i class="fa-solid fa-gear"></i> */}
                </div>
              </div>
            </div>
            <ul className="list-group list-group-flush">
              <div>
                <li className="list-group-item ">
                  <div className="gridUL row m-0 p-0  w-100">
                    <span
                      style={{ borderBottom: "1px solid #ccc" }}
                      className="tilteLI pqul col-3"
                    >
                      <div style={{ marginTop: "8px" }}>
                        <input
                          style={{ width: "20px", height: "20px" }}
                          type="checkbox"
                          checked={isCheckAll}
                          onChange={() => handleCheckAll()}
                        />
                      </div>
                    </span>
                    <span
                      style={{ borderBottom: "1px solid #ccc" }}
                      className="tilteLI pqul col-9"
                    >
                      {" "}
                      Tên
                    </span>
                  </div>
                </li>
              </div>
              <div
                className="listTK"
                style={{ maxHeight: "calc(100vh - 270px)" }}
              >
                {" "}
                {isNVNew?.map((account, index) => (
                  <li
                    key={index}
                    className={`list-group-item ${
                      activeIndex === index ? "active" : ""
                    }`}
                    onClick={(e) => {
                      handleClick(e, index, account.userID);
                    }}
                  >
                    <div className="gridUL row m-0 p-0  w-100">
                      <span className=" pqul  col-3">
                        {" "}
                        <div>
                          <input
                            style={{ width: "20px", height: "20px" }}
                            onChange={() => handleCheckUser(account.userID)}
                            type="checkbox"
                            checked={account.isChecked === 1}
                          />
                        </div>
                      </span>
                      <span className=" pqul  col-9">
                        {account.fullName || ""}
                      </span>
                    </div>
                  </li>
                ))}
              </div>
            </ul>
          </div>
        </div>
        <div className="col-md-12 col-lg-9 col-xl-10">
          <div className="card" style={{ height: "50px" }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0 ">Chia data </h2>
              <div className="d-flex " style={{ gap: "10px" }}>
                <button
                  onClick={(e) => handleGet(e)}
                  type="button"
                  class="save-button btn btn-primary d-flex align-items-center gap-2 "
                  style={{ backgroundColor: "#0d6efd" }}
                >
                  <i class="fas fa-download"></i>
                  Lấy dữ liệu
                </button>

                <button
                  disabled={isDisable}
                  onClick={(e) => handleSave(e)}
                  className="save-button"
                >
                  <i className="fas fa-save" />
                  Lưu
                </button>
              </div>
            </div>
            <div>
              <div className=" ">
                <div
                  className="item-table"
                  style={{ maxHeight: "calc(100vh - 230px)", overflow: "auto" }}
                >
                  <table className="task-table">
                    <thead>
                      <tr className="trthdashboard">
                        <td scope="col">Chọn </td>
                        <td scope="col">Ngày</td>
                        <td scope="col">Tên</td>
                        <td scope="col">SĐT</td>
                        <td scope="col">Mail</td>
                        <td scope="col">Câu hỏi</td>
                        <td scope="col">Người nhận cũ</td>
                        <td scope="col">Nguồn UTM</td>
                        <td scope="col">Chiến dịch UTM</td>
                      </tr>
                    </thead>
                    <tbody>
                      {isDataF?.map((x, index) => {
                        return (
                          <tr key={x.id}>
                            <td style={{ whiteSpace: "nowrap" }}>
                              <div style={{ marginTop: "8px" }}>
                                <input
                                  style={{ width: "20px", height: "20px" }}
                                  onChange={(e) =>
                                    handleChangeCheck(
                                      e,
                                      x.id,
                                      x.isChecked == 1 ? 0 : 1
                                    )
                                  }
                                  type="checkbox"
                                  checked={x.isChecked == 1}
                                />
                              </div>
                            </td>
                            <td style={{ whiteSpace: "nowrap" }}>
                              <p
                                style={{
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {x.date}
                              </p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "160px",
                              }}
                            >
                              <p>{x.name}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "160px",
                              }}
                            >
                              <p>{x.phone}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "200px",
                              }}
                            >
                              <p>{x.mail}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "160px",
                              }}
                            >
                              <p>{x.question}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "140px",
                              }}
                            >
                              <p>{x.oldReceiver}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "140px",
                              }}
                            >
                              <p>{x.utmSource}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "250px",
                              }}
                            >
                              <p>{x.utmCampaign}</p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalShare
        data={listData}
        setIsClick={setIsClick}
        setClick={setClick}
        dataNV={isNVNew}
        setData={setListData}
        setChange={setChange}
      />
      <GoogleSheetForm
        setIsShow={isShow}
        setShow={setShow}
        setData={setListData}
      />
    </div>
  );
};
export default GridShare;
