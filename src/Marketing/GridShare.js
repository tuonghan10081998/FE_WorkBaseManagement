import React, { useState, useEffect, useContext } from "react";
import ModalShare from "./ModalShare";
import GoogleSheetForm from "./GoogleSheetForm ";
import iziToast from "izitoast";
import { Modal, Button } from "react-bootstrap";
import ModalUpdate from "./ModalUpdate";
import moment from "moment";
const GridShare = ({
  dataNV,
  data,
  setChienDich,
  setClick,
  setIsClick,
  setIsWeek,
  setData,
  setTrangThai,
  setTimKiem,
  setIsSelectData,
  setRole,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const [isDataF, setDataF] = useState([]);
  const [listData, setListData] = useState([]);
  const [isID, setID] = useState(null);
  const [isChange, setChange] = useState(null);
  const [isNVNew, setNVNew] = useState(null);
  const [isCheckAll, setCheckAll] = useState(1);
  const [isShow, setShow] = useState(false);
  const [isShowU, setShowU] = useState(false);
  const [isDisable, setDisable] = useState(false);
  const [isCheckAllData, setCheckAllData] = useState(false);
  const [isGGSheet, setGGSheet] = useState(false);
  const [isShowDelete, setShowDelete] = useState(false);
  const [isSortNgay, setSortNgay] = useState(false);
  const [isSorCheck, setSortCheck] = useState(false);
  const [isIDU, setIDU] = useState("");
  const [isDisableDelete, setDisableDelete] = useState(false);
  const handleChangeCheck = (e, id, isChecked) => {
    e.preventDefault();
    const newData = listData.map((x) => {
      if (
        x.id === id &&
        !x.oldReceiverID?.split(",").includes(isID.toString())
      ) {
        return { ...x, isChecked: isChecked, receiverID: isID };
      }
      return x;
    });
    setListData(newData);
  };
  const handleChangeCheckDelete = (e, id, isChecked) => {
    e.preventDefault();
    const newData = listData.map((x) => {
      return x.id === id ? { ...x, isCheckDelete: isChecked } : x;
    });
    setListData(newData);
  };
  const handleCheckUser = (id) => {
    const newData = isNVNew.map((x) =>
      x.userID === id ? { ...x, isChecked: x.isChecked === 1 ? 0 : 1 } : x
    );
    setNVNew(newData);
  };
  const handleCheckData = (checked) => {
    const updated = listData.map((item) => {
      if (checked) {
        if (
          item.isChecked === 0 &&
          !item.oldReceiverID?.split(",").includes(isID.toString())
        ) {
          return { ...item, isChecked: 1, receiverID: isID };
        }
        return item;
      } else {
        if (
          item.receiverID === isID &&
          !item.oldReceiverID?.split(",").includes(isID.toString())
        ) {
          return { ...item, isChecked: 0, receiverID: "" };
        }
        return item;
      }
    });
    setListData(updated);
    setCheckAllData(checked);
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

      const matchTrangThai =
        setTrangThai === "all" ? true : x.status === setTrangThai;
      const matchSearch =
        x.name.toUpperCase().includes(setTimKiem.toUpperCase()) ||
        x.phone.toUpperCase().includes(setTimKiem.toUpperCase()) ||
        x.mail.toUpperCase().includes(setTimKiem.toUpperCase());
      const matchShareData =
        setIsSelectData.toString() === "1"
          ? true
          : x.isChecked === (setIsSelectData.toString() === "3" ? 0 : 1);
      return (
        matchChienDich &&
        matchReceiver &&
        matchSearch &&
        matchTrangThai &&
        matchShareData
      );
    });
    setDataF(dataF);
  }, [isID, listData, setChienDich, isChange]);
  useEffect(() => {
    const dataF = listData?.filter((x) => {
      const matchChienDich =
        setChienDich === "all"
          ? true
          : x.utmCampaign.toUpperCase().includes(setChienDich.toUpperCase());

      const matchTrangThai =
        setTrangThai === "all" ? true : x.status === setTrangThai;
      const matchSearch =
        x.name.toUpperCase().includes(setTimKiem.toUpperCase()) ||
        x.phone.toUpperCase().includes(setTimKiem.toUpperCase()) ||
        x.mail.toUpperCase().includes(setTimKiem.toUpperCase());
      const matchShareData =
        setIsSelectData.toString() === "1"
          ? true
          : x.isChecked === (setIsSelectData.toString() === "3" ? 0 : 1);

      return matchChienDich && matchTrangThai && matchSearch && matchShareData;
    });
    setDataF(dataF);

    setDataF(dataF);
  }, [setTimKiem, setTrangThai, setIsSelectData]);
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setListData(data);
      const isAllChecked = data.every((item) => item.isChecked === 1);

      setCheckAllData(isAllChecked);
    }
  }, [data]);
  const handleSave = async (e) => {
    e.preventDefault();

    var arrSave = [];
    var dataSave = listData.filter((x) => x.isChecked === 1);
    dataSave.map((x) => {
      let object = {
        id: x.id,
        date: "string",
        name: "string",
        phone: "string",
        mail: "string",
        question: "string",
        utmSource: "string",
        utmCampaign: "string",
        status: 0,
        preBroker: "string",
        ftd: 0,
        broker: "string",
        dealDate: "2025-04-28T13:49:17.047Z",
        note: "string",
        createUser: "string",
        createDate: "2025-04-28T13:49:17.047Z",
        receiverID: x.receiverID,
        oldReceiverID: "string",
        isChecked: 1,
      };
      arrSave.push(object);
    });
    arrSave && PostSave(arrSave, ...data);
  };
  const PostSave = async (arrPost, dataF) => {
    setDisable(true);
    const request = new Request(
      `${process.env.REACT_APP_URL_API}MarketingData/PostShare`,
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
      // setData(dataF);
      setClick(false);
      setChange((x) => !x);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Lưu thất bại`,
        position: "topRight",
      });
    }
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
  useEffect(() => {
    setData(listData);
  }, [isGGSheet]);
  const ExportCsv = () => {
    const result = ["Name|Phone|Mail|Country"];
    console.log(isDataF);
    isDataF.forEach((row) => {
      const combined = `${(row.name ?? "").trim()}|${(
        row.phone ?? ""
      ).trim()}|${(row.mail ?? "").trim()}|${(row.country ?? "").trim()}`;

      // console.log(combined);
      result.push(combined);
    });
    let dataToSend = JSON.stringify({
      ArrBody: result,
    });
    const url = `${process.env.REACT_APP_URL_API}MarketingData/export-csv`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: dataToSend,
    })
      .then((response) => response.blob())
      .then((blob) => {
        const csvUrl = window.URL.createObjectURL(
          new Blob([blob], { type: "text/plain" })
        );
        const a = document.createElement("a");
        a.href = csvUrl;
        a.download = "ExportedData.txt";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(csvUrl);
        document.body.removeChild(a);
      });
  };
  const handleDelete = () => {
    const dataDelete = listData.filter((x) => x.isCheckDelete === 1);
    setListData(listData.filter((x) => x.isCheckDelete !== 1));
    var arrDelete = [];
    dataDelete.map((x) => {
      let object = {
        id: x.id,
        date: "string",
        name: "string",
        phone: "string",
        mail: "string",
        question: "string",
        utmSource: "string",
        utmCampaign: "string",
        status: 0,
        preBroker: "string",
        ftd: 0,
        broker: "string",
        dealDate: "2025-05-07T13:44:49.189Z",
        note: "string",
        createUser: "string",
        createDate: "2025-05-07T13:44:49.189Z",
        receiverID: "string",
        oldReceiverID: "string",
        isChecked: 0,
        isCheckDelete: 1,
      };
      arrDelete.push(object);
    });
    if (arrDelete.length == 0) {
      setShowDelete(false);
      return;
    }
    PostDelete(arrDelete);
  };

  const handleSortNgay = (value) => {
    const dataSort = isDataF.sort((a, b) => {
      const dateA = moment(a.date, "DD/MM/YYYY");
      const dateB = moment(b.date, "DD/MM/YYYY");
      return value ? dateB - dateA : dateA - dateB; // Sắp xếp giảm dần
    });
    setDataF(dataSort);
  };
  const handleSortCheck = (value) => {
    const sortedData = isDataF.sort((a, b) =>
      value ? a.isChecked - b.isChecked : b.isChecked - a.isChecked
    );
    setDataF(sortedData);
  };
  const PostDelete = async (arrPost) => {
    setDisableDelete(true);
    const request = new Request(
      `${process.env.REACT_APP_URL_API}MarketingData/PostDelete`,
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
    setDisableDelete(false);
    if (data.status == "OK") {
      iziToast.success({
        title: "Success",
        message: `Xóa thành công`,
        position: "topRight",
      });
      setShowDelete(false);
      setListData(listData.filter((x) => x.isCheckDelete !== 1));
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Xóa thất bại`,
        position: "topRight",
      });
    }
  };
  const handleUpdateData = (value) => {
    setIDU(value);
    setShowU(true);
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
              <div className="d-flex gap-2">
                <h2 className="h5 mb-0 ">Chia data </h2>
                {isUser === "a640ab6a-30d6-40bc-8bd2-7ecd1534e0db" && (
                  <button
                    disabled={isDisableDelete}
                    onClick={(e) => setShowDelete(true)}
                    type="button"
                    class="save-buttonShare btn btn-primary d-flex align-items-center gap-2 "
                    style={{ backgroundColor: "rgb(255 0 82)" }}
                  >
                    <i class="fa-solid fa-trash"></i>
                    Xóa
                  </button>
                )}
              </div>
              <div className="d-flex " style={{ gap: "10px" }}>
                <button
                  onClick={(e) => ExportCsv(e)}
                  type="button"
                  class="save-buttonShare btn btn-primary d-flex align-items-center gap-2 "
                  style={{ backgroundColor: "rgb(174 217 91)", color: "#000" }}
                >
                  <i class="fa-solid fa-file-export"></i>
                  Export
                </button>

                <button
                  onClick={(e) => handleGet(e)}
                  type="button"
                  class="save-buttonShare btn btn-primary d-flex align-items-center gap-2 "
                  style={{ backgroundColor: "#0d6efd" }}
                >
                  <i class="fas fa-download"></i>
                  Lấy dữ liệu
                </button>

                <button
                  disabled={isDisable}
                  onClick={(e) => handleSave(e)}
                  className="save-buttonShare"
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
                        <td scope="col">
                          {" "}
                          <div
                            style={{
                              display: "flex",

                              justifyContent: "center",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <input
                              style={{ width: "20px", height: "20px" }}
                              type="checkbox"
                              checked={isCheckAllData}
                              onChange={(e) =>
                                handleCheckData(e.target.checked)
                              }
                            />
                            <i
                              onClick={() => {
                                setSortCheck(!isSorCheck);
                                handleSortCheck(!isSorCheck);
                              }}
                              class="fa-solid fa-sort icon-sort"
                            ></i>
                          </div>{" "}
                        </td>
                        <td scope="col">
                          Ngày{" "}
                          <i
                            onClick={() => {
                              setSortNgay(!isSortNgay);
                              handleSortNgay(!isSortNgay);
                            }}
                            class="fa-solid fa-sort icon-sort"
                          ></i>
                        </td>
                        <td scope="col">Tên</td>
                        <td scope="col">SĐT</td>
                        <td scope="col">Mail</td>
                        <td scope="col">Câu hỏi</td>
                        <td scope="col">Người nhận cũ</td>
                        <td scope="col">Trạng thái</td>
                        <td scope="col">Nguồn UTM</td>
                        <td scope="col">Chiến dịch UTM</td>
                        <td scope="col">Quốc gia</td>
                        {isUser === "a640ab6a-30d6-40bc-8bd2-7ecd1534e0db" && (
                          <td scope="col">Xóa</td>
                        )}
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
                              onClick={(e) => handleUpdateData(x.id)}
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "160px",
                                color: "#F40925",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                            >
                              <p>{x.name}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "160px",
                                color: "#0207F7",
                                fontWeight: "bold",
                              }}
                            >
                              <p>{x.phone}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "200px",
                                color: "#0207F7",
                                fontWeight: "bold",
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
                                minWidth: "120px",
                                color: x.status === 1 ? "green" : "orange",
                                fontWeight: "bold",
                              }}
                            >
                              <p>{x.statusName}</p>
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
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "80px",
                              }}
                            >
                              <p>{x.country}</p>
                            </td>
                            {isUser ===
                              "a640ab6a-30d6-40bc-8bd2-7ecd1534e0db" && (
                              <td
                                className="text-center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                <div style={{ marginTop: "8px" }}>
                                  <input
                                    style={{ width: "20px", height: "20px" }}
                                    onChange={(e) =>
                                      handleChangeCheckDelete(
                                        e,
                                        x.id,
                                        x.isCheckDelete == 1 ? 0 : 1
                                      )
                                    }
                                    type="checkbox"
                                    checked={x.isCheckDelete == 1}
                                  />
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="trtfdashboard">
                        <td
                          style={{
                            whiteSpace: "nowrap",
                            fontWeight: "700",
                          }}
                          colSpan="2"
                        >
                          Data:{" "}
                          <span className="text-danger">{isDataF.length}</span>
                        </td>
                        <td
                          style={{
                            whiteSpace: "nowrap",
                            fontWeight: "700",
                          }}
                          colSpan="1"
                        >
                          Đã chia:{" "}
                          <span className="text-danger">
                            {isDataF.filter((x) => x.isChecked === 1).length}
                          </span>
                        </td>
                        <td
                          style={{
                            whiteSpace: "nowrap",
                            fontWeight: "700",
                          }}
                          colSpan="1"
                        >
                          Chưa chia:{" "}
                          <span className="text-danger">
                            {isDataF.filter((x) => x.isChecked === 0).length}
                          </span>
                        </td>
                        <td
                          colSpan={
                            isUser === "a640ab6a-30d6-40bc-8bd2-7ecd1534e0db"
                              ? 8
                              : 7
                          }
                        ></td>
                      </tr>
                    </tfoot>
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
        setChienDich={setChienDich}
        setTrangThai={setTrangThai}
        setTimKiem={setTimKiem}
        setIsSelectData={setIsSelectData}
      />
      <GoogleSheetForm
        setIsShow={isShow}
        setShow={setShow}
        setData={setListData}
        setIsWeek={setIsWeek}
        setGGSheet={setGGSheet}
      />
      <ModalUpdate
        setShowU={setShowU}
        setIsShowU={isShowU}
        data={listData}
        setData={setListData}
        setID={isIDU}
      />
      <Modal
        show={isShowDelete}
        // onHide={false}
        dialogClassName="modal-dialog-centered"
        aria-labelledby="popupModalLabel"
        backdrop="static"
        keyboard={false}
        className="modalHT"
      >
        <Modal.Header closeButton={false}>
          <Modal.Title id="popupModalLabel">Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn muốn xóa các data này</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Hủy
          </Button>
          <Button onClick={() => handleDelete()} variant="primary">
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default GridShare;
