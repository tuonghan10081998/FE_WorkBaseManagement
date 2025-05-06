import React, { useState, useEffect, useContext } from "react";
import ModalShare from "./ModalShare";
import ModalShareReport from "./ModalShareReport";
import moment from "moment";
import StatusForm from "./StatusForm";
const GridShareReport = ({
  data,
  setChienDich,
  setNhanVien,
  setPhongBan,
  setTrangThai,
  setTimKiem,
  setIsShowS,
  setShowS,
  setIsRole,
}) => {
  const [listData, setListData] = useState([]);
  const [isID, setID] = useState(null);
  const [isShow, setShow] = useState(false);
  const [isDataF, setDataF] = useState([]);
  useEffect(() => {
    const dataF = listData?.filter((x) => {
      const matchChienDich =
        setChienDich === "all"
          ? true
          : x.utmCampaign.toUpperCase().includes(setChienDich.toUpperCase());

      const matchReceiver =
        setNhanVien === "all"
          ? x.dep_Code === setPhongBan
          : x.receiverID === setNhanVien;

      const matchTrangThai =
        setTrangThai === "all" ? true : x.status === setTrangThai;
      const matchSearch =
        x.name.toUpperCase().includes(setTimKiem.toUpperCase()) ||
        x.phone.toUpperCase().includes(setTimKiem.toUpperCase()) ||
        x.mail.toUpperCase().includes(setTimKiem.toUpperCase());

      return matchChienDich && matchReceiver && matchTrangThai && matchSearch;
    });

    setDataF(dataF);
  }, [
    listData,
    setChienDich,
    setNhanVien,
    setPhongBan,
    setTrangThai,
    setTimKiem,
  ]);
  useEffect(() => {
    data && setListData(data);
  }, [data]);
  const handleClick = (id) => {
    setID(id);
    setShow(true);
  };
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
                  style={{
                    maxHeight: "calc(100vh - 160px )",
                    overflow: "auto",
                  }}
                >
                  <table className="task-table">
                    <thead>
                      <tr className="trthdashboard">
                        <td scope="col">Stt</td>
                        <td scope="col">Ngày</td>
                        <td scope="col">Tên</td>
                        <td scope="col">SĐT</td>
                        <td scope="col">Mail</td>
                        <td scope="col">Câu hỏi</td>

                        <td scope="col">Nguồn UTM</td>
                        <td scope="col">Chiến dịch UTM</td>
                        <td scope="col">Tên sales</td>
                        <td scope="col">Trạng thái</td>
                        <td scope="col">Ftd</td>
                        <td scope="col">Sàn trước đây</td>

                        <td scope="col">Sàn đầu tư</td>
                        <td scope="col">Ngày chốt</td>

                        <td style={{ width: "100px" }} scope="col">
                          Hành động
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {isDataF?.map((x, index) => {
                        return (
                          <tr
                            key={x.id}
                            style={{
                              background: index % 2 == 0 ? "#fff" : "#f3f3f3",
                            }}
                          >
                            <td style={{ whiteSpace: "nowrap" }}>
                              <p
                                style={{
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {index + 1}
                              </p>
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
                                minWidth: "120px",
                                color: "#F40925",
                                fontWeight: "bold",
                              }}
                            >
                              <p>{x.name}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                                color: "#0207F7",
                                fontWeight: "bold",
                              }}
                            >
                              <p>{x.phone}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                                color: "#0207F7",
                                fontWeight: "bold",
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
                              <p>{x.receiver}</p>
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
                                minWidth: "100px",
                                color: "#FA1235",
                                fontWeight: "bold",
                              }}
                            >
                              <p>{!x.ftd ? "" : x.ftd.toLocaleString()}</p>
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
                              {(x.status !== 1 ||
                                setIsRole === "Administrator") && (
                                <div
                                  onClick={(e) => handleClick(x.id)}
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
                                    className="fa-solid fa-user-pen" // ⚠️ class -> className
                                  ></i>
                                </div>
                              )}
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
      <ModalShareReport
        setShow={setShow}
        setIsShow={isShow}
        setData={setListData}
        data={listData}
        setID={isID}
      />
      <StatusForm data={isDataF} setIsShowS={setIsShowS} setShowS={setShowS} />
    </div>
  );
};
export default GridShareReport;
