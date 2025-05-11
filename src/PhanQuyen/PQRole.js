import React, { useState, useMemo, useEffect } from "react";
import "../CongViecList/ListCV.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "../CongViecList/GridCV.css";
import "../PhanQuyen/PhanQuyen.css";
import ModalNVUserLeader from "./ModalNVUserLeader";
const PQRole = ({
  isData,
  onchange,
  setIsDataLeader,
  setOptionPBLeader,
  setID,
}) => {
  const [isShow, setShow] = useState(false);

  return (
    <div className="grid-table w-100" style={{ padding: "12px" }}>
      <div className="itemtableNamePQ">
        <div className="item-table">
          <table className="task-table">
            <thead>
              <tr>
                <td className="text-center theadSpan tilteLI">
                  <div>Chọn</div>
                </td>
                <td className="tilteLI">Chức năng</td>
              </tr>
            </thead>
            <tbody className="tbody">
              {isData.map((row) => {
                return (
                  <tr>
                    <td className="box-wrap">
                      <div>
                        <input
                          onChange={(e) =>
                            onchange(row.roleID, row.isChecked == 1 ? 0 : 1)
                          }
                          type="checkbox"
                          checked={row.isChecked == 1}
                        />
                      </div>
                    </td>
                    <td
                      style={{
                        maxWidth: "300px",
                        minWidth: "250px",
                        textAlign: "left",
                      }}
                      className=""
                    >
                      <div className="d-flex justify-content-between gap-2 px-2">
                        <div> {row.role}</div>
                        {row.roleID === "UnderLeader" && row.isChecked == 1 && (
                          <div
                            onClick={(e) => setShow(true)}
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
          </table>
        </div>
      </div>
      <ModalNVUserLeader
        setShow={setShow}
        setIsShow={isShow}
        dataNV={setIsDataLeader}
        dataOption={setOptionPBLeader}
        setID={setID}
      />
    </div>
  );
};

export default PQRole;
