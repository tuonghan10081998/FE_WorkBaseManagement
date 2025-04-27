import React, { useState, useEffect, useContext } from "react";
import ModalShare from "./ModalShare";

const GridShareReport = ({ data, setChienDich, setNhanVien, setPhongBan }) => {
  const [listData, setListData] = useState([]);
  const [isID, setID] = useState(null);
  const [isShow, setShow] = useState(false);
  const [isDataF, setDataF] = useState([]);
  useEffect(() => {
    console.log(listData);
    const dataF = listData?.filter((x) => {
      const matchChienDich =
        setChienDich === "all"
          ? true
          : x.utmCampaign.toUpperCase().includes(setChienDich.toUpperCase());

      const matchReceiver =
        setNhanVien === "all"
          ? x.dep_Code === setPhongBan
          : x.oldReceiverID === setNhanVien;

      return matchChienDich && matchReceiver;
    });

    setDataF(dataF);
  }, [listData, setChienDich, setNhanVien, setPhongBan]);
  useEffect(() => {
    data && setListData(data);
  }, [data]);

  return (
    <div className="py-2 px-2 ">
      <div className="row g-2">
        {/* Danh sách tài khoản */}

        <div className="col-12 ">
          <div className="card" style={{ height: "50px" }}>
            <div>
              <div className=" ">
                <div
                  className="item-table"
                  style={{ maxHeight: "calc(100vh - 230px)", overflow: "auto" }}
                >
                  <table className="task-table">
                    <thead>
                      <tr className="trthdashboard">
                        <td scope="col">Ngày</td>
                        <td scope="col">Tên</td>
                        <td scope="col">SĐT</td>
                        <td scope="col">Mail</td>
                        <td scope="col">Câu hỏi</td>
                        <td scope="col">Sàn trước đây</td>
                        <td scope="col">Ftd</td>
                        <td scope="col">Sàn đầu tư</td>
                        <td scope="col">Ngày deal</td>
                        <td scope="col">Người nhận cũ</td>
                        <td scope="col">Nguồn UTM</td>
                        <td scope="col">Chiến dịch UTM</td>
                        <td style={{ width: "100px" }} scope="col">
                          Hành động
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {isDataF?.map((x, index) => {
                        return (
                          <tr key={x.id}>
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
                                minWidth: "120px",
                              }}
                            >
                              <p>{x.name}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
                              <p>{x.phone}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              <p>{x.mail}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "130px",
                              }}
                            >
                              <p>{x.question}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}
                            >
                              <p>{x.preBroker}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100",
                              }}
                            >
                              <p>{x.ftd.toLocaleString()}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}
                            >
                              <p>{x.broker}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}
                            >
                              <p>{x.dealDate || ""}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}
                            >
                              <p>{x.oldReceiver}</p>
                            </td>

                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}
                            >
                              <p>{x.utmSource}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "200px",
                              }}
                            >
                              <p>{x.utmCampaign}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <i
                                  style={{
                                    fontSize: "20px",
                                    cursor: "pointer",
                                  }}
                                  class="fa-solid fa-user-pen"
                                ></i>
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
    </div>
  );
};
export default GridShareReport;
