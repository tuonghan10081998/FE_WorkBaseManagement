import React, { useState, useMemo, useEffect } from "react";
import "../CongViecList/ListCV.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "../CongViecList/GridCV.css";
import "../PhanQuyen/PhanQuyen.css";

const PQModule = ({ isData, onchange }) => {
  return (
    <div className="grid-table w-100" style={{ padding: "12px" }}>
      <div className="itemtableNamePQ">
        <div className="item-table">
          <table className="task-table">
            <thead>
              <tr>
                <td className="text-center theadSpan">
                  <div className="tilteLI">Chọn</div>
                </td>
                <td className="tilteLI">Module</td>
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
                            onchange(row.id, row.isChecked == 1 ? 0 : 1)
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
                      {row.page}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PQModule;
