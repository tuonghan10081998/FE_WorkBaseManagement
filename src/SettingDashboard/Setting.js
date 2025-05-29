import React, { useState, useEffect, useContext } from "react";

const Setting = () => {
  return (
    <div className="col-md-12 col-lg-12">
      <div className="card" style={{ height: "50px" }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="h5 mb-0 ">Chi tiết </h2>
          <div>
            <button onClick={handleSave} className="save-button">
              <i className="fas fa-save" />
              Lưu
            </button>
          </div>
        </div>
        <div>
          <div className="tab-table">
            <div
              onClick={() => setTab(1)}
              className={`item-table ${isTab == 1 ? "active" : ""}`}
            >
              {" "}
              <i class="fa-solid fa-list-ol"></i>
              Phòng ban
            </div>
            <div
              onClick={() => setTab(2)}
              className={`item-table ${isTab == 2 ? "active" : ""}`}
            >
              {" "}
              <i class="fa-solid fa-server"></i>
              Trang
            </div>
            <div
              onClick={() => setTab(3)}
              className={`item-table ${isTab == 3 ? "active" : ""}`}
            >
              {" "}
              <i class="fa-solid fa-gamepad"></i>
              Chức năng
            </div>
            {isUser === "a640ab6a-30d6-40bc-8bd2-7ecd1534e0db" && (
              <div
                onClick={() => setTab(4)}
                className={`item-table ${isTab == 4 ? "active" : ""}`}
              >
                {" "}
                <i class="fa-brands fa-google-drive"></i>
                ID GGSheet
              </div>
            )}
          </div>
          <div className={` ${isTab == 1 ? "d-flex" : "d-none"}`}>
            {/* <PQPhongBan
              isData={islstUserDep}
              onchange={handleCheckPB}
              setCheckAdd={setCheckAdd}
            /> */}
          </div>
          <div className={` ${isTab == 2 ? "d-flex" : "d-none"}`}>
            {/* <PQModule isData={islstUserPage} onchange={handleCheckModule} /> */}
          </div>
          <div className={` ${isTab == 3 ? "d-flex" : "d-none"}`}>
            {/* <PQRole
              isData={islstUserRole}
              onchange={handleCheckRole}
              setIsDataLeader={isUserLeader}
              setOptionPBLeader={isOptionPBLeader}
              setID={isID}
            /> */}
          </div>
          <div className={` ${isTab == 4 ? "d-flex" : "d-none"}`}>
            {/* <PQIDGGSheet
              data={isGGSheet}
              setData={setGGSheet}
              setCheckGGSheet={setCheckGGSheet}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Setting;
