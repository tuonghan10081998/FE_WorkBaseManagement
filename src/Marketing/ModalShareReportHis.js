import React, { useState, useContext, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
const ModalShareReportHis = ({ setShowH, setIsShowH, setID, setTenKH }) => {
  console.log(setID);
  return (
    <Modal
      show={setIsShowH}
      // onHide={setShowH(false)}
      dialogClassName="modal-dialog-centered custom-modal-dialog"
      aria-labelledby="popupModalHeader"
      backdrop="static"
      keyboard={false}
      className="popupModalCreateLeave"
    >
      <Modal.Body>
        {" "}
        <div className="">
          <div className="card">
            <div className="card-body cardbody">
              <div className="row headerDuAn">
                <div className="col-8 p-0 m-0">
                  <h2
                    style={{ textAlign: "left", fontSize: "28px" }}
                    className="card-title   font-weight-bold  "
                  >
                    Lịch sử
                  </h2>
                </div>
                <div className="col-4 p-0 m-0 d-flex justify-content-end">
                  <button
                    onClick={() => setShowH((prev) => !prev)}
                    class="btn-close-custom"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <form>
                <div className="col-lg-12 col-xl-12 m-0 p-0 my-2">
                  <div className="row">
                    <div className="form-group col-6 m-0 p-0">
                      <label htmlFor="endDate">Khách hàng</label>
                      <input
                        readOnly={true}
                        type="text"
                        className="form-control"
                        id="projectName"
                        value={setTenKH}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-xl-12 m-0 p-0 my-2">
                  <div className="row">
                    <div className="p-0">
                      <div
                        className="item-table"
                        style={{ maxHeight: "500px", overflow: "auto" }}
                      >
                        <table className="task-table">
                          <thead>
                            <tr className="trthdashboard">
                              <td scope="col">Thời gian</td>
                              <td scope="col">Trạng thái</td>
                              <td scope="col">FTD</td>
                              <td scope="col">MT4/MT5</td>
                              <td scope="col">Ghi chú</td>
                            </tr>
                          </thead>
                          <tbody>
                            {/* {dataDepDT?.map((x, index) => {
                                return (
                                  <tr key={x.id}>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                      {x.dep_Name}
                                    </td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                      {x.totalExpenses.toLocaleString()}
                                    </td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                      {x.totalRevenue.toLocaleString()}
                                    </td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                      {x.profit.toLocaleString()}
                                    </td>
                                  </tr>
                                );
                              })} */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default ModalShareReportHis;
