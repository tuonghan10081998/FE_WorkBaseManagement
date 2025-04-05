import React, { useState, useMemo, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import iziToast from "izitoast";
import "../CongViecList/ListCV.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "../CongViecList/GridCV.css";
import SelectTable from "./select2GridTable";
import { useTable, useSortBy, usePagination } from "react-table";

const GridWork = ({
  setDataGrid,
  handleSetting,
  setIDDeleteColumn,
  setCheckAdd,
  setPQDuyen,
}) => {
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const [isTitleBody, setTiTleBody] = useState("");
  const [show, setShow] = useState(false);
  const [isIDData, setIDDate] = useState(null);
  const [isCheckHandle, setCheckHandle] = useState(null);
  const [isCheckPhieu, setCheckPhieu] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    let ID = e.currentTarget.dataset.id;
    setIDDate(ID);
    setShow(true);
  };
  const handleClickDelete = (value) => {
    setIDDeleteColumn(isIDData);
    setShow(false);
  };
  const handlesSubmit = () => {
    isCheckHandle == 0 && handleClickDelete();
    isCheckHandle == 1 && handleSave();
  };
  const handleSave = () => {
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
      implementDate: moment(d.implementDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      completeDate: moment(d.completeDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      statusHT: 1,
    };
    arrHT.push(object);
    PostSave(arrHT);
  };
  const PostSave = async (arrPost) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}Work/Post?action=PostHT`,
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
  const getStatusSpan = (status) => {
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
          <i className="fas fa-exclamation-circle"></i> Thấp
        </span>
      );
    } else {
      return (
        <span className="status-icon status-pending">
          <i className="fas fa-exclamation-triangle"></i> Trung bình
        </span>
      );
    }
  };

  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id" },
      { Header: "statusHT", accessor: "statusHT" },
      { Header: "Tên công việc", accessor: "workName" },
      { Header: "Mô tả ", accessor: "description" },
      { Header: "Ưu tiên", accessor: "priority" },
      // { Header: "Ghi chú", accessor: "note" },
      { Header: "Trạng thái", accessor: "status" },
      { Header: "Người thực hiện", accessor: "requester" },
      { Header: "Người giao việc", accessor: "implementer" },
      { Header: "Deadline", accessor: "completeDate" },
      { Header: "H.Thành", accessor: "complete" },
      { Header: "Sửa", accessor: "edit" },
      { Header: "Xóa", accessor: "delete" },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: setDataGrid }, useSortBy);
  const getColumnStyle = (column) => {
    // Kiểm tra nếu column là "priority", "edit" hoặc "complete"
    if (["priority", "edit", "complete"].includes(column.id)) {
      return {
        maxWidth: "80px",
        minWidth: "80px",
      };
    }
    if (["id", "statusHT"].includes(column.id)) {
      return {
        display: "none",
      };
    }
    if (["delete"].includes(column.id.trim()) && isIDLogin.trim() != "VNManh") {
      return {
        display: "none",
      };
    } else {
      return {
        maxWidth: "80px",
        minWidth: "80px",
      };
    }
    // Nếu không phải 3 cột trên, áp dụng chiều rộng mặc định
    return {
      maxWidth: column.id === "taskName" ? "200px" : "auto", // Tùy chỉnh chiều rộng cột "taskName"
      minWidth: "150px", // Mặc định cho các cột khác
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
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
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
                    {/* <td style={{ maxWidth: "200px" }} className="box-cv">
                      <p> {row.values.note || ""} </p>
                    </td> */}
                    <td className="box-wrap">
                      {getStatusSpan(row.values.status)}
                    </td>
                    <td className="box-cv" style={{ maxWidth: "125px" }}>
                      <p>{row.values.implementer}</p>
                    </td>
                    <td style={{ maxWidth: "125px" }} className="box-cv">
                      <p>{row.values.requester}</p>
                    </td>
                    <td style={{ maxWidth: "70px" }} className="box-wrap">
                      {row.values.completeDate}
                    </td>
                    <td style={{ maxWidth: "50px" }} className="box-wrap">
                      {setPQDuyen &&
                        row.values.status != 1 &&
                        row.values.statusHT != 1 && (
                          <button
                            data-id={row.values.id}
                            onClick={(e) => {
                              handleShow(e);
                              setTiTleBody(
                                "Bạn xác nhận hoàn thành công việc này"
                              );
                              setCheckHandle(1);
                            }}
                            style={{ padding: "5px 4px" }}
                            class="btn-customGrid btn-approve"
                          >
                            <i class="fas fa-check-circle"></i> H.Thành
                          </button>
                        )}
                    </td>
                    <td style={{ maxWidth: "50px" }} className="box-wrap">
                      {" "}
                      <button
                        onClick={(e) => {
                          if (handleSetting) {
                            handleSetting({
                              action: 2,
                              id: row.values.id,
                            });
                            // handleClick(e);
                          }
                        }}
                        class="btn-customGrid btn-edit mr-3"
                      >
                        <i class="fas fa-edit"></i> Sửa
                      </button>
                    </td>
                    {isIDLogin == "VNManh" && (
                      <td style={{ maxWidth: "50px" }} className="box-wrap">
                        <button
                          data-id={row.values.id}
                          onClick={(e) => {
                            handleShow(e);
                            setTiTleBody("Bạn xác nhận xóa công việc này");
                            setCheckHandle(0);
                          }}
                          class="btn-customGrid btn-delete"
                        >
                          <i class="fas fa-trash"></i> Xóa
                        </button>
                      </td>
                    )}
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
          <Modal.Title id="popupModalLabel">Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{isTitleBody}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={() => handlesSubmit()} variant="primary">
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GridWork;
