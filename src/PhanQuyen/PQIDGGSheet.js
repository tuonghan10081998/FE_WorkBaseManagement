import React, { useState, useMemo, useEffect } from "react";
import "../CongViecList/ListCV.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "../CongViecList/GridCV.css";
import "../PhanQuyen/PhanQuyen.css";
import ModalGGSheet from "./ModalGGSheet";
import iziToast from "izitoast";
import { Modal, Button } from "react-bootstrap";
const PQIDGGSheet = ({ data, setData, setCheckGGSheet }) => {
  const [isShow, setShow] = useState(false);
  const [isID, setID] = useState(null);
  const [isDisableDelete, setDisableDelete] = useState(false);
  const [isShowDelete, setShowDelete] = useState(false);
  const handleAdd = (e) => {
    setShow(true);
    setID(0);
  };
  const handleEdit = (e, value) => {
    setShow(true);
    setID(value);
  };
  const handleDelete = () => {
    var dataFi = data.filter((x) => x.id !== isID);
    setData(dataFi);
    var object = {
      id: isID,
      title: "string",
      googleSheetID: "string",
      sheetName: "string",
      userID: "string",
      createDate: "2025-05-11T06:23:50.421Z",
    };
    setDisableDelete(true);
    PostDelete(object);
  };
  const PostDelete = async (arrPost) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}MarketingData/DeleteGGInfo`,
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
    setShowDelete(false);
    if (data.status == "OK") {
      iziToast.success({
        title: "Success",
        message: `Xóa thành công`,
        position: "topRight",
      });

      setShow(false);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Xóa thất bại`,
        position: "topRight",
      });
    }
  };
  return (
    <div className="grid-table w-100" style={{ padding: "12px" }}>
      <div className="itemtableNamePQ">
        <div className="item-table position-relative">
          <table className="task-table ">
            <thead>
              <tr>
                <td className="text-center theadSpan">
                  <div className="tilteLI justify-content-start">Tiêu đề</div>
                </td>
                <td className=" theadSpan text-left">
                  <div className="tilteLI justify-content-start">
                    <div>ID GGSheet</div>
                    <div style={{ marginLeft: "auto" }}>
                      <button
                        onClick={(e) => handleAdd(e)}
                        type="button"
                        class="save-buttonShare btn btn-primary d-flex align-items-center gap-2 "
                        style={{ backgroundColor: "#0d6efd" }}
                      >
                        <i class="fa-solid fa-plus"></i>
                        Thêm
                      </button>
                    </div>
                  </div>
                </td>
                <td className="tilteLI">Hành động</td>
              </tr>
            </thead>
            <tbody className="tbody">
              {data?.map((row) => {
                return (
                  <tr>
                    <td
                      className="box-wrap"
                      style={{
                        maxWidth: "100px",
                        minWidth: "50px",
                        textAlign: "left",
                        fontWeight: "500",
                        color: "#000",
                      }}
                    >
                      {row.title}
                    </td>
                    <td
                      style={{
                        maxWidth: "250px",
                        minWidth: "200px",
                        textAlign: "left",
                        fontWeight: "500",
                        color: "#000",
                      }}
                      className=""
                    >
                      {row.googleSheetID}
                    </td>
                    <td
                      style={{
                        maxWidth: "50px",
                        minWidth: "50px",
                        textAlign: "center",
                      }}
                      className=""
                    >
                      <div className="actionGGSheet">
                        <i
                          onClick={(e) => handleEdit(e, row.id)}
                          class="fa-solid fa-pen-to-square text-green"
                        ></i>
                        <i
                          onClick={(e) => {
                            setShowDelete(true);
                            setID(row.id);
                          }}
                          class="fa-solid fa-trash text-danger"
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
      <ModalGGSheet
        setShow={setShow}
        setIsShow={isShow}
        data={data}
        setData={setData}
        setID={isID}
        setCheckGGSheet={setCheckGGSheet}
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
          <p>Bạn muốn xóa ID GGSheet này</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Hủy
          </Button>
          <Button
            disabled={isDisableDelete}
            onClick={() => handleDelete()}
            variant="primary"
          >
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PQIDGGSheet;
