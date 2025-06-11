import React, { useState, useMemo, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import iziToast from "izitoast";
import "../CongViecList/ListCV.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "../CongViecList/GridCV.css";
import SelectTable from "./select2GridTable";
import { useTable, useSortBy, usePagination } from "react-table";
import $, { data } from "jquery";
const GridWork = ({
  setDataGrid,
  handleSetting,
  setIDDeleteColumn,
  setCheckAdd,
  setPQDuyen,
}) => {
  const elementRef = useRef([]);
  const [isUser, setUser] = useState(localStorage.getItem("userID"));

  const [isTop, setTop] = useState(null);
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const [isTitleBody, setTiTleBody] = useState("");
  const [show, setShow] = useState(false);
  const [isIDData, setIDDate] = useState(null);
  const [isCheckHandle, setCheckHandle] = useState(null);
  const [isCheckPhieu, setCheckPhieu] = useState(null);
  const [isLable, setLable] = useState(null);
  const [isFeedBack, setFeedBack] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    let ID = e.currentTarget.dataset.id;
    setIDDate(ID);
    setShow(true);
  };
  const handleClickDelete = (value) => {
    setIDDeleteColumn(isIDData);
    setShow(false);
    handleSave("Delete");
  };
  window.handleFeedbackChange = function (val) {
    setFeedBack(val);
  };
  const handlesSubmit = () => {
    isCheckHandle == 0 && handleClickDelete();
    isCheckHandle == 1 && handleSave("PostHT");
    isCheckHandle == 2 && handleFeedBack();
  };
  const handleFeedBack = () => {
    const object = {
      id: isIDData,
      ticket: "string",
      workName: "string",
      description: "string",
      priority: 0,
      note: "string",
      idRequester: "string",
      createDate: "2025-04-16T16:47:16.878Z",
      fromDate: "2025-04-16T16:47:16.878Z",
      remindDate: "2025-04-16T16:47:16.878Z",
      toDate: "2025-04-16T16:47:16.878Z",
      completeDate: "2025-04-16T16:47:16.878Z",
      idResponsible: "string",
      idApprover: "string",
      feedback: isFeedBack,
      statusHT: 0,
      statusRemind: 0,
      lstIDImplementer: ["string"],
      idUserFeedback: isUser,
    };
    PostFB(object);
  };
  const PostFB = async (arrPost) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}Work/PostFeedback`,
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
        message: `Lưu thành công`,
        position: "topRight",
      });

      setCheckAdd((prev) => !prev);
      setShow(false);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Lưu thất bại`,
        position: "topRight",
      });
    }
  };
  const handleClickTD = (e, index) => {
    const element = elementRef.current[index];

    if (element) {
      const rect = element.getBoundingClientRect();
      const tdElement = element.closest("td");
      const popup = tdElement.querySelector(".gridPop");

      if (!popup.classList.contains("active")) {
        // Bỏ active ở tất cả popup khác
        document.querySelectorAll(".gridPop.active").forEach((el) => {
          el.classList.remove("active");
        });
        popup.classList.add("active");
      } else {
        document.querySelectorAll(".gridPop.active").forEach((el) => {
          el.classList.remove("active");
        });
      }

      const popupHeight = popup.offsetHeight;
      const windowHeight = window.innerHeight;

      let top = rect.top;

      if (top + popupHeight > windowHeight) {
        const overflow = top + popupHeight - windowHeight;
        top = top - overflow - 20;
      }

      if (top < 0) {
        top = 0;
      }

      setTop(top);
    }
  };

  const handleClickOutside = (e) => {
    const cartIcons = document.querySelectorAll(".cartion");

    cartIcons.forEach((cartIcon) => {
      const popup = cartIcon.querySelector(".popupsettingCart");
      if (
        popup &&
        !cartIcon.contains(e.target) &&
        !e.target.classList.contains("cartioni")
      ) {
        popup.classList.remove("active");
      }
    });
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const handleSave = (NamePort) => {
    const data = setDataGrid.filter((x) => x.id == isIDData);
    const d = data[0];
    var arrHT = [];
    const object = {
      id: d.id,
      workName: d.workName,
      description: d.description,
      priority: d.priority.toString(),
      note: d.note,
      idRequester: d.idRequester,
      lstIDImplementer: d.idImplementer.split(","),
      fromDate: moment(d.fromDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      toDate: moment(d.toDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      remindDate: moment(d.remindDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      idApprover: "",
      statusHT: 1,
      idUserFeedback: "",
    };
    arrHT.push(object);
    PostSave(object, NamePort);
  };
  const PostSave = async (arrPost, NamePort) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}Work/${NamePort}`,
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
        message: `Lưu thành công`,
        position: "topRight",
      });

      setCheckAdd((prev) => !prev);
      setShow(false);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Lưu thất bại`,
        position: "topRight",
      });
    }
  };
  const handleClick = (e) => {
    const parent = e.currentTarget.closest(".cartion");
    const child = parent.querySelector(".popupsettingCart");
    if (child) {
      child.classList.toggle("active");
    }
  };
  const getStatusSpan = (status, statusHT) => {
    if (status === "1") {
      return (
        <span className="status-icon status-pending">
          <i className="fas fa-hourglass-start"></i> Chưa thực hiện
        </span>
      );
    } else if (status === "2") {
      return (
        <span className="status-icon status-in-progress ">
          <i className="fas fa-spinner"></i> Đang thực hiện
        </span>
      );
    } else if (status === "3") {
      return (
        <span className="status-icon status-completed ">
          <i className="fas fa-check-circle"></i> Hoàn thành
          <i
            style={{
              color: `${statusHT === "1" ? "#4952b5" : "red"}`,
              margin: "0 0 0 9px",
            }}
            class="fa-solid fa-flag"
          ></i>
        </span>
      );
    } else {
      return (
        <span className="status-icon status-overdue ">
          <i className="fas fa-exclamation-circle"></i> Quá hạn
        </span>
      );
    }
  };

  const getStatusSpanUuTien = (priority) => {
    if (priority == "2") {
      return (
        <span className="status-icon status-completed">
          <i className="fas fa-check-circle"></i> Cao
        </span>
      );
    } else if (priority == "1") {
      return (
        <span className="status-icon status-in-progress">
          <i className="fas fa-exclamation-circle"></i> Trung bình
        </span>
      );
    } else {
      return (
        <span className="status-icon status-pending">
          <i className="fas fa-exclamation-triangle"></i> Thấp
        </span>
      );
    }
  };
  window.handleDownFile = (e) => {
    const id = e.getAttribute("data-id");
    const dataF = setDataGrid.filter((x) => x.id.toString() === id.toString());

    const thoigian = moment(dataF[0].createDate, "DD/MM/YYYY").format(
      "YYYYMMDD"
    );
    const file = dataF[0].requestFile;
    downLoad(thoigian, file);
  };
  const downLoad = async (thoigian, file) => {
    const url = `${process.env.REACT_APP_URL_API}Work/Download?thoiGian=${thoigian}&fileName=${file}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const blob = await response.blob(); // 👈 lấy file dưới dạng blob

      // Tạo link download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = file; // 👈 đặt tên file khi tải về
      link.click();

      // Clean up
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Lỗi khi tải file:", error.message);
    }
  };
  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id" },
      { Header: "statusHT", accessor: "statusHT" },
      { Header: "Mã ticket", accessor: "ticket" },
      { Header: "Tên công việc", accessor: "workName" },
      { Header: "Mô tả ", accessor: "description" },
      { Header: "Ưu tiên", accessor: "priority" },
      { Header: "Ghi chú", accessor: "note" },
      { Header: "Ghi chú", accessor: "fromDate" },
      { Header: "Ghi chú", accessor: "completeDate" },
      { Header: "Trạng thái", accessor: "status" },
      { Header: "Người giao việc", accessor: "implementer" },
      { Header: "Trách nhiệm", accessor: "responsible" },
      { Header: "Người giao việc", accessor: "idRequester" },
      { Header: "Người thực hiện", accessor: "requester" },
      { Header: "Deadline", accessor: "toDate" },
      { Header: "Hành động", accessor: "complete" },
      { Header: "Hành động", accessor: "remindDate" },
      { Header: "Hành động", accessor: "feedback" },
      { Header: "Hành động", accessor: "requestFile" },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: setDataGrid }, useSortBy);
  const getColumnStyle = (column) => {
    if (["priority"].includes(column.id)) {
      return {
        maxWidth: "80px",
        minWidth: "80px",
      };
    }
    if (
      ["status", "ticket", "responsible", "toDate", "requester"].includes(
        column.id
      )
    ) {
      return {
        maxWidth: "130px",
        minWidth: "130px",
      };
    }
    if (["complete"].includes(column.id)) {
      return {
        maxWidth: "120px",
        minWidth: "120px",
      };
    }
    if (
      [
        "id",
        "statusHT",
        "note",
        "fromDate",
        "completeDate",
        "remindDate",
        ,
        "feedback",
        "requestFile",
        "idRequester",
      ].includes(column.id)
    ) {
      return {
        display: "none",
      };
    }
    if (["workName"].includes(column.id)) {
      return {
        maxWidth: "145px",
        minWidth: "145px",
      };
    }
    if (["description"].includes(column.id)) {
      return {
        maxWidth: "330px",
        minWidth: "330px",
      };
    }
    return {
      maxWidth: column.id === "taskName" ? "200px" : "auto", // Tùy chỉnh chiều rộng cột "taskName"
      minWidth: "190px", // Mặc định cho các cột khác
    };
  };
  return (
    <div className="grid-table">
      {/* <div className="headerTong ">
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
        
        </div>
      </div> */}

      <div className="itemtableName">
        <div className="item-table">
          <table {...getTableProps()} className="task-table">
            <thead>
              <tr>
                {headerGroups[0].headers.map((column) => (
                  <td
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={`box-wrap ${
                      column.isSorted
                        ? column.isSortedDesc
                          ? "desc"
                          : "asc"
                        : ""
                    }`}
                    style={getColumnStyle(column)}
                    key={column.id}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </td>
                ))}
              </tr>
            </thead>

            <tbody className="tbody" {...getTableBodyProps()}>
              {rows.map((row, index) => {
                prepareRow(row);
                return (
                  <tr className="" {...row.getRowProps()}>
                    <td className="box-cv" style={{ maxWidth: "100px" }}>
                      <p>{row.values.ticket}</p>
                    </td>
                    <td className="box-wrap">{row.values.workName}</td>
                    <td
                      style={{ maxWidth: "300px", minWidth: "250px" }}
                      className=""
                    >
                      <p className="box-cv"> {row.values.description}</p>
                    </td>
                    <td style={{ maxWidth: "100px" }} className="box-wrap">
                      {getStatusSpanUuTien(row.values.priority)}
                    </td>

                    <td style={{ maxWidth: "200px" }} className="box-wrap">
                      {getStatusSpan(row.values.status, row.values.statusHT)}
                    </td>
                    <td style={{ maxWidth: "125px" }} className="">
                      <p>{row.values.requester}</p>
                    </td>
                    <td style={{ maxWidth: "125px" }} className="">
                      <p>{row.values.responsible}</p>
                    </td>

                    <td className="box-cv" style={{ maxWidth: "125px" }}>
                      <p>{row.values.implementer}</p>
                    </td>
                    <td style={{ maxWidth: "70px" }} className="">
                      {moment(row.values.fromDate, "DD/MM/YYYY").format(
                        "DD/MM"
                      )}
                      -{moment(row.values.toDate, "DD/MM/YYYY").format("DD/MM")}
                    </td>
                    <td style={{ maxWidth: "50px" }} className="box-wrap">
                      <div
                        className="d-flex"
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <i
                          onClick={(e) => handleClickTD(e, index)}
                          ref={(el) => (elementRef.current[index] = el)}
                          className="fa-solid fa-gear cartioni "
                          style={{
                            color: "#89915e",
                            fontSize: "20px",
                            cursor: "pointer",
                          }}
                        ></i>
                      </div>
                      <div
                        className="cartion "
                        style={{
                          position: "fixed",
                          top: `${isTop}px`,
                          right: "93px",
                          fontSize: "26px",
                          cursor: "pointer",
                        }}
                      >
                        <i
                          data-id={row.values.id}
                          onClick={(e) => handleClick(e)}
                          className="fa-solid fa-gear d-none"
                          style={{ color: "#89915e" }}
                        ></i>
                        <div
                          style={{
                            right: "93px",
                            position: "fixed",
                            top: `${isTop}px`,
                          }}
                          data-id={row.values.id}
                          className="popupsettingCart popupsettingCV gridPop"
                        >
                          {/* setPQDuyen !== "Member" && */}
                          {row.values.statusHT !== "1" && (
                            <div
                              data-id={row.values.id}
                              onClick={(e) => {
                                handleShow(e);
                                setTiTleBody(
                                  "<p>Bạn xác nhận hoàn thành công việc này</p>"
                                );
                                setLable("Thông báo");
                                setCheckHandle(1);
                              }}
                            >
                              <i className="fa-solid fa-street-view me-1"></i>
                              <span>Hoàn thành</span>
                            </div>
                          )}
                          <div
                            data-id={row.values.id}
                            onClick={(e) => {
                              handleShow(e);
                              setTiTleBody(`<div>
                          <p class="duan" style="font-size: 17px;font-weight: bold;">
                            <i style="color: #6ba323;" class="fa-solid fa-briefcase"></i>
                            Công việc: ${row.values.workName}
                          </p>

                         <div class="task_item item_detail" style="gap: 2px;">
                            <div class="user-names">
                              <div>
                                <i class="fa-solid fa-splotch me-1" style="color: #9b88fd;"></i>
                            Mô tả: ${row.values.description}
                              </div>
                            </div>
                          </div>    
                          <div class="task_item item_detail" style="gap: 2px;">
                            <div class="user-names">
                              <div>
                                <i style="color: #8ec311;" class="fas fa-user me-1"></i>
                                Giao việc: ${row.values.requester}
                              </div>
                            </div>
                          </div>
                    <div class="task_item item_detail" style="gap: 2px;">
                            <div class="user-names">
                              <div>
                                <i style="color: #894141;
                            font-size: 21px;" class="fa-solid fa-person-dress me-1"
                         ></i> Trách nhiệm: ${row.values.responsible}
                              </div>
                            </div>
                          </div>    
                          <div class="task_item item_detail" style="gap: 2px;">
                            <div class="user-names">
                              <fiv>
                                <i style="color: #256A9D;"  class="fa s fa-user me-1"></i> Thực hiện: ${
                                  row.values.implementer
                                }
                              </fiv>
                            </div>
                          </div>

                          <div class="task_item item_detail" style="gap: 2px;">
                            <div>
                              <i style="color: #C16262;" class="fas fa-clock"></i> Ngày: ${
                                row.values.fromDate
                              } - ${row.values.toDate}
                            </div>
                          </div>
                           <div class="task_item item_detail" style="gap: 2px;">
                            <div>
                            <i style="color:#768d1e" class="fa-solid fa-bell"></i> Ngày báo deadline: ${
                              row.values.remindDate || ""
                            }
                            </div>
                          </div>
                           <div class="task_item item_detail" style="gap: 2px;">
                          <div style="display: flex; justify-content: center; align-items: center; gap: 5px;">
                            <i style="color:#97bb27" class="fa-solid fa-folder-closed"></i> File đính kèm:
                            <div style="margin-left: 5px;">${
                              row.values.requestFile || ""
                            }</div> 
                          </div>

                          <div>
                            <i 
                              style="display: ${
                                !row.values.requestFile ? "none" : ""
                              }; color: #0d6efd; cursor: pointer; font-size: 20px;" 
                              onclick="handleDownFile(this)" 
                              data-id="${row.values.id}" 
                              class="fa-solid fa-download"
                            ></i>
                          </div>
                        </div>
                          <div class="task_item item_detail" style="gap: 2px;">
                            <div>
                             <i style="color: #354b8b;" class="fa-solid fa-calendar-plus"></i> Ngày hoàn thành: ${
                               row.values.completeDate || ""
                             }
                            </div>
                          </div>
                           <div class="task_item item_detail" style="gap: 2px;">
                            <div>
                              <i  style="color:#2746bb" class="fa-solid fa-snowflake"></i> Chi tiết : 
                              <div style="margin-left: 20px;">${
                                row.values.note || ""
                              }</div> 
                            </div>
                          </div>
                         
                            <div class="task_item item_detail" style="gap: 2px;">
                      <div style="width: 100%;">
                        <i style="color:#f39c12;" class="fa-solid fa-comment-dots"></i> Phản hồi:
                        <textarea 
                          style="width: 100%; margin-top: 5px; padding: 5px; border-radius: 5px; border: 1px solid #ccc;outline: none;" 
                          placeholder="" 
                          oninput="handleFeedbackChange(this.value)"
                        >${row.values.feedback}</textarea>  
                        </div>
                      `);
                              setLable("Xem chi tiết công việc");
                              setCheckHandle(2);
                              setFeedBack(row.values.feedback);
                            }}
                          >
                            <i class="fa-solid fa-eye me-1"></i>
                            <span> Xem </span>
                          </div>
                          {(setPQDuyen !== "Member" ||
                            row.values.idRequester === isUser) && (
                            <div
                              onClick={(e) => {
                                if (handleSetting) {
                                  handleSetting({
                                    action: 2, // Đặt tên key cho đúng
                                    id: row.values.id, // Đảm bảo truyền ID đúng
                                  });
                                  handleClick(e);
                                }
                              }}
                            >
                              <i className="fa-solid fa-pen-to-square me-1"></i>
                              <span>Sửa</span>
                            </div>
                          )}
                          {setPQDuyen === "Administrator" && (
                            <div
                              data-id={row.values.id}
                              onClick={(e) => {
                                handleShow(e);
                                setTiTleBody(
                                  "<p>Bạn muốn xóa công việc này</p>"
                                );
                                setLable("Thông báo");
                                setCheckHandle(0);
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
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-dialog-centered"
        aria-labelledby="popupModalLabel"
        className="modalHT"
      >
        <Modal.Header>
          <Modal.Title id="popupModalLabel">{isLable}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: isTitleBody }}></div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>

          <Button onClick={() => handlesSubmit()} variant="primary">
            {isLable == "Thông báo" ? "Đồng ý " : "Lưu FeedBack"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GridWork;
