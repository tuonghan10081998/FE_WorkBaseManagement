import React, { useEffect, useState } from "react";
import PopBestSaler from "./PopBestSaler";
import { Modal, Button } from "react-bootstrap";
import iziToast from "izitoast";
const BestSaler = ({ selectedYear, selectedMonth }) => {
  const IMG_API = process.env.REACT_APP_URL_IMG;
  const [isData, setData] = useState([]);
  const [isID, setID] = useState(null);
  const [isDataF, setDataF] = useState([]);
  const [isShow, setShow] = useState(false);
  const [isAdd, setAdd] = useState(null);
  const [isShowDelete, setShowDelete] = useState(false);
  const getData = async (thang, nam) => {
    const url = `${process.env.REACT_APP_URL_API}BestSaler/Get?month=${thang}&year=${nam}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();

      setData(data);
    } catch (error) {
      console.error(error.message);
    }
  };
  // useEffect(() => {
  //   getData(selectedMonth, selectedYear);
  // }, [selectedMonth, selectedYear]);
  // useEffect(() => {
  //   // if (isAdd !== null) getData(selectedMonth, selectedYear);
  // }, [isAdd]);
  useEffect(() => {
    const dataname = [
      {
        id: 1,
        userID: "896d0b1e-ae82-4872-914b-d0a0207324d2",
        userName: "Nguyễn Tường Hân",
        depCode: "IT",
        depName: "IT",
        money: 100,
        note: "AVD",
        year: 2025,
        month: 5,
      },
      {
        id: 2,
        userID: "0dfa4519-910f-4ffc-af9e-87023c152e89",
        userName: "Võ Ngọc Mạnh",
        depCode: "IT",
        depName: "IT",
        money: 200,
        note: "Chi tiền",
        year: 2025,
        month: 5,
      },
    ];
    setData(dataname);
  }, []);
  const handleClick = (id) => {
    setID(id);
    setDataF(isData.filter((x) => x.id == id));
    setShow(true);
  };
  const handleClickDelete = (id) => {
    // var object = {
    //   id: id,
    //   title1: "string",
    //   title2: "string",
    //   images: "string",
    //   year: 0,
    //   month: 0,
    // };
    // PostDelete(object);
  };
  const PostDelete = async (arrPost) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}Notification/Delete`,
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
    if (data.status == "OK") {
      iziToast.success({
        title: "Success",
        message: `Xóa thành công`,
        position: "topRight",
      });
      setShowDelete(false);
      setData(isData.filter((x) => x.id != isID));
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Xóa thất bại`,
        position: "topRight",
      });
    }
  };
  return (
    <div className="w-100">
      <div className="row g-2">
        <div className="mb-0 p-0 px-3">
          <div
            className="h5 d-flex m-0 titlePQ titleShare"
            style={{ fontSize: "20px", height: "38px" }}
          >
            Chi tiết{" "}
            <div className="settingPQ">
              <i
                onClick={() => {
                  setDataF([]);
                  setShow(true);
                }}
                class="fa-solid fa-square-plus addNoti"
              ></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-12 col-lg-12 col-xl-10 mt-0">
          <div className="card" style={{ height: "50px" }}>
            <div>
              <div className="px-3">
                <div
                  className="item-table"
                  style={{
                    maxHeight: "calc(100vh - 160px )",
                    overflow: "auto",
                  }}
                >
                  <table className="task-table">
                    <thead>
                      <tr className="trthdashboard">
                        <td scope="col">Stt</td>

                        <td scope="col">Phòng ban</td>
                        <td scope="col">Tên nhân viên</td>
                        <td scope="col">Tháng</td>
                        <td scope="col">Năm</td>
                        <td scope="col">Doanh thu</td>
                        <td scope="col">Ghi chú</td>
                        <td style={{ width: "100px" }} scope="col">
                          Hành động
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {isData?.map((x, index) => {
                        return (
                          <tr
                            key={x.id}
                            style={{
                              background: index % 2 == 0 ? "#fff" : "#f3f3f3",
                            }}
                          >
                            {" "}
                            <td style={{ whiteSpace: "nowrap" }}>
                              <p title={index + 1}>{index + 1}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              <p title={x.depName}>{x.depName}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              <p title={x.userName}>{x.userName}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "50px",
                              }}
                            >
                              <p title={x.month}>{x.month}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "50px",
                              }}
                            >
                              <p title={x.year}>{x.year}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100",
                              }}
                            >
                              <p title={x.money}>{x.money}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "200px",
                              }}
                            >
                              <p title={x.note}>{x.note}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}
                            >
                              <div className="d-flex justify-content-around gap-2 px-2">
                                <div
                                  onClick={(e) => {
                                    setShowDelete(true);
                                    setID(x.id);
                                  }}
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  title="Xóa"
                                >
                                  <i
                                    style={{
                                      fontSize: "18px",
                                      cursor: "pointer",
                                    }}
                                    className="fa-solid fa-trash text-danger"
                                  ></i>
                                </div>
                                <div
                                  onClick={(e) => handleClick(x.id)}
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  title="Chỉnh sửa"
                                >
                                  <i
                                    style={{
                                      fontSize: "18px",
                                      cursor: "pointer",
                                    }}
                                    className="fa-solid fa-pen-to-square text-success"
                                  ></i>
                                </div>
                              </div>
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
      <PopBestSaler
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        data={isDataF}
        setShow={setShow}
        setIsShow={isShow}
        setAdd={setAdd}
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
          <Button onClick={() => handleClickDelete(isID)} variant="primary">
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BestSaler;
