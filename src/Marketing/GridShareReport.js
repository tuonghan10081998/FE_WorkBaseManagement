import React, { useState, useEffect, useContext } from "react";
import ModalShare from "./ModalShare";
import ModalShareReport from "./ModalShareReport";
import moment from "moment";
import StatusForm from "./StatusForm";
import ModalShareReportHis from "./ModalShareReportHis";
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
  setIsExport,
}) => {
  const [listData, setListData] = useState([]);
  const [isID, setID] = useState(null);
  const [isShow, setShow] = useState(false);
  const [isShowH, setShowH] = useState(false);
  const [isDataF, setDataF] = useState([]);
  const [isNameKH, setNameKH] = useState("");
  const [isSortNgay, setSortNgay] = useState(false);
  const [ispreBroker, setpreBroker] = useState(false);
  const [isBroker, setBroker] = useState(false);
  useEffect(() => {
    const dataF = listData?.filter((x) => {
      const matchChienDich =
        setChienDich === "all"
          ? true
          : (x.utmCampaign ?? "")
              .toUpperCase()
              .includes(setChienDich.toUpperCase());

      const matchReceiver =
        setNhanVien === "all"
          ? x.dep_Code === setPhongBan
          : x.receiverID === setNhanVien;

      const matchTrangThai =
        setTrangThai === "all" ? true : x.status === setTrangThai;
      const matchSearch =
        (x.name ?? "").toUpperCase().includes(setTimKiem.toUpperCase()) ||
        (x.phone ?? "").toUpperCase().includes(setTimKiem.toUpperCase()) ||
        (x.mail ?? "").toUpperCase().includes(setTimKiem.toUpperCase()) ||
        (x.preBroker ?? "").toUpperCase().includes(setTimKiem.toUpperCase()) ||
        (x.broker ?? "").toUpperCase().includes(setTimKiem.toUpperCase());
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
  const handleSortNgay = (value) => {
    const dataSort = isDataF.sort((a, b) => {
      const dateA = moment(a.date, "DD/MM/YYYY");
      const dateB = moment(b.date, "DD/MM/YYYY");
      return value ? dateB - dateA : dateA - dateB; // Sắp xếp giảm dần
    });
    setDataF(dataSort);
  };
  const handleSortPreBroker = (value, valueSort) => {
    const sortedData = [...isDataF].sort((a, b) =>
      value
        ? (a[valueSort] || "").localeCompare(b[valueSort] || "")
        : (b[valueSort] || "").localeCompare(a[valueSort] || "")
    );
    setDataF(sortedData);
  };
  useEffect(() => {
    if (!setIsExport) return;
    const result = ["Name|Phone|Mail|Country"];

    isDataF.forEach((row) => {
      const combined = `${(row.name ?? "").trim() || "null"}|${
        (row.phone ?? "").trim() || "null"
      }|${(row.mail ?? "").trim() || "null"}|${
        (row.country ?? "").trim() || "null"
      }`;

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
  }, [setIsExport]);
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

                        <td scope="col">Nguồn UTM</td>
                        <td scope="col">Chiến dịch UTM</td>
                        <td scope="col">Quốc gia</td>
                        <td scope="col">Tên sales</td>
                        <td scope="col">Trạng thái</td>
                        <td scope="col">Ftd</td>
                        <td scope="col">MT4/MT5</td>
                        <td scope="col">
                          Sàn trước đây
                          <i
                            onClick={() => {
                              setpreBroker(!ispreBroker);
                              handleSortPreBroker(!ispreBroker, "preBroker");
                            }}
                            className="fa-solid fa-sort icon-sort"
                          ></i>
                        </td>

                        <td scope="col">
                          Sàn đầu tư
                          <i
                            onClick={() => {
                              setBroker(!isBroker);
                              handleSortPreBroker(!isBroker, "broker");
                            }}
                            className="fa-solid fa-sort icon-sort"
                          ></i>
                        </td>
                        <td scope="col">Ngày chốt</td>
                        <td scope="col">Ghi chú</td>
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
                                minWidth: "150px",
                                color: "#F40925",
                                fontWeight: "bold",
                              }}
                            >
                              <div
                                onClick={(e) => {
                                  setID(x.id);
                                  setNameKH(x.name);
                                  setShowH(true);
                                }}
                                style={{
                                  cursor: "pointer",
                                }}
                                className="d-flex  justify-content-around gap-2 px-2"
                              >
                                <p>{x.name}</p>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {/* <i
                                    style={{
                                      fontSize: "15px",
                                      cursor: "pointer",
                                      color: "#743abb",
                                    }}
                                    className="fa-solid fa-clock-rotate-left" // ⚠️ class -> className
                                  ></i> */}
                                </div>
                              </div>
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
                                minWidth: "80px",
                              }}
                            >
                              <p>{x.country}</p>
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
                                minWidth: "120px",
                                color: "#0207F7",
                                fontWeight: "bold",
                              }}
                            >
                              <p>{x.account}</p>
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
                                minWidth: "150px",
                              }}
                            >
                              <p>{x.note}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}
                            >
                              <div className="d-flex justify-content-around gap-2 px-2">
                                {(x.status !== 1 ||
                                  setIsRole ===
                                    "a640ab6a-30d6-40bc-8bd2-7ecd1534e0db") && (
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
                                        fontSize: "18px",
                                        cursor: "pointer",
                                      }}
                                      className="fa-solid fa-user-pen" // ⚠️ class -> className
                                    ></i>
                                  </div>
                                )}
                              </div>
                            </td>
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
                        ></td>
                        <td
                          style={{
                            whiteSpace: "nowrap",
                            fontWeight: "700",
                          }}
                          colSpan="1"
                        ></td>
                        <td colSpan="14"></td>
                      </tr>
                    </tfoot>
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
      <ModalShareReportHis
        setIsShowH={isShowH}
        setShowH={setShowH}
        setID={isID}
        setTenKH={isNameKH}
      />
    </div>
  );
};
export default GridShareReport;
