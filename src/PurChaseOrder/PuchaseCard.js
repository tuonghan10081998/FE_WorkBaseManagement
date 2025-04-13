import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import iziToast from "izitoast";
import moment from "moment";
const PurChaseCard = ({ setData, onChange }) => {
  const [show, setShow] = useState(false);
  const [isIDData, setIDData] = useState("");
  const handleSave = () => {
    const data = setData.filter((x) => x.id == isIDData);
    const d = data[0];
    let arrLeave = [];
    const object = {
      id: d.id,
      ticket: d.ticket,
      title: d.title,
      description: d.description,
      amount: d.amount,
      createDate: moment(d.createDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      idCreator: d.idCreator,
    };
    arrLeave.push(object);
    PostSave(object);
    onChange({
      action: 2,
      id: d.id,
    });
  };
  const PostSave = async (arrPost, NamePort) => {
    const request = new Request(
      `${process.env.REACT_APP_URL_API}PaymentVoucher/Delete`,
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
      setShow(false);
    } else {
      iziToast.warning({
        title: "Warning",
        message: `Xóa thất bại`,
        position: "topRight",
      });
    }
  };
  const handleClose = () => setShow(false);
  return (
    <div className="itemtableName">
      <div className="item-table">
        <table className="task-table">
          <thead>
            <tr>
              <td scope="col">Mã ticket</td>
              <td scope="col">Tiêu đề</td>
              <td scope="col">Giá</td>
              <td scope="col">Ngày </td>
              <td scope="col">Nhân viên</td>
              <td style={{ minWidth: "200px", maxWidth: "400px" }} scope="col">
                Ghi chú
              </td>

              <td style={{ width: "150px", textAlign: "center" }} scope="col">
                Hành động
              </td>
            </tr>
          </thead>
          <tbody>
            {setData?.map((x, index) => {
              return (
                <tr key={x.id}>
                  <td style={{ whiteSpace: "nowrap" }}>{x.ticket}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{x.title}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {x.amount.toLocaleString()}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{x.createDate}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{x.fullName}</td>
                  <td className="purchasetd">{x.description}</td>

                  <td>
                    <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-target btn-icon mx-1"
                        onClick={() => {
                          onChange({
                            action: 1,
                            id: x.id,
                          });
                        }}
                      >
                        <i className="fas fa-tasks"></i>
                      </button>
                      <button
                        className="btn btn-achieved btn-icon mx-1"
                        onClick={() => {
                          setIDData(x.id);
                          setShow(true);
                        }}
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
        <Modal.Body>Bạn muốn xóa đơn hàng này</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={() => handleSave()} variant="primary">
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default PurChaseCard;
