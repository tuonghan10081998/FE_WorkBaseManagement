import React, { useState, useContext, useEffect } from "react";
import { TitleContext } from "../components/TitleContext";
import DateRangePicker from "../Date/DateRangePicker";
import Select2Ticket from "../CongViecList/select2Ticket";
import SelectTable from "../CongViecList/select2GridTable";
import PurChaseCard from "./PuchaseCard";
import CreatePurChase from "./CreatePurChase";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
const PurChaseOrder = () => {
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const [isIDLogin, setIDLogin] = useState(localStorage.getItem("usernameID"));
  const [dateRange, setDateRange] = useState({
    from: moment().startOf("month").format("YYYY-MM-DD"), // Ngày đầu tháng
    to: moment().endOf("month").format("YYYY-MM-DD"), // Ngày cuối tháng
  });
  const { setTitle, setIcon, setIconAdd } = useContext(TitleContext);

  const [showPopup, setShowPopup] = useState(false);
  const [isCheckAdd, setCheckAdd] = useState(false);
  const [isID, setID] = useState("");
  const [isData, setData] = useState([]);

  const [isDataFilter, setDataFilter] = useState([]);
  const [isTicket, setTicket] = useState([]);
  const [isRole, setRole] = useState("");
  const [isopera, setopera] = useState(true);
  const [isLeader, setLeader] = useState("");
  const [isTicketValue, setTicketValue] = useState("All");
  const [isCheckSave, setCheckSave] = useState(false);
  const [isPhongBanValue, setPhongBanValue] = useState("");
  const [isPhongBan, setPhongBan] = useState(null);
  const getPhanQuyen = async () => {
    const url = `${process.env.REACT_APP_URL_API}User/GetRole?action=GEt&para1=${isUser}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();

      const priorityRoles = data.lstUserRole.map((item) => item.roleID);
      const currentHighestRole =
        priorityRoles.find((roleID) =>
          data.lstUserRole.some(
            (item) => item.roleID === roleID && item.isChecked === 1
          )
        ) || "Member";
      if (currentHighestRole === "Leader") {
        const selectedDepCodes = data.lstUserDep
          .filter((dep) => dep.isChecked === 1) // Lọc những phòng ban được chọn
          .map((dep) => dep.dep_Code) // Lấy mã phòng ban
          .join(",");
        setLeader(selectedDepCodes);
      }
      currentHighestRole === "Member" && setopera(false);
      setRole(currentHighestRole);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    isUser != "" && getPhanQuyen();
  }, []);
  useEffect(() => {
    var dataFilter = isData;
    if (isTicketValue != "All")
      dataFilter = dataFilter.filter((x) => x.ticket?.includes(isTicketValue));

    dataFilter = dataFilter.filter((x) => x.idDepartment == isPhongBanValue);
    setDataFilter(dataFilter);
  }, [isData, isTicketValue, isPhongBanValue]);
  useEffect(() => {
    let ticketFilter = isData;
    ticketFilter = ticketFilter.filter(
      (x) => x.idDepartment === isPhongBanValue
    );
    const dataticket = Array.from(
      new Map(
        ticketFilter.map((item) => [
          `${item.ticket}`,
          {
            ticket: item.ticket,
          },
        ])
      ).values()
    );
    setTicket(dataticket);
  }, [isData, isPhongBanValue]);
  const getPhongBan = async () => {
    var url = `${process.env.REACT_APP_URL_API}Department/Get?action=get`;
    // isRole !== "Administrator" &&
    //   (url = `${process.env.REACT_APP_URL_API}Department/Get?action=GetDept_User&para1=${isUser}`);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      let object = {
        dep_Code: "Clara",
        dep_Name: "Clara",
        id: 999,
      };
      data.push(object);
      setPhongBan(data);
      setPhongBanValue(data[0].dep_Code);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    isRole != "" && getPhongBan();
  }, [isRole]);
  const getPayment = async () => {
    const url = `${process.env.REACT_APP_URL_API}PaymentVoucher/Get?action=Get&para1=${dateRange.from}&para2=${dateRange.to}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const getTable = await response.json();
      setData(getTable);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getPayment();
  }, [isCheckAdd, dateRange]);
  const handleDateChange = async (from, to) => {
    await setDateRange({ from, to });
  };
  const funTitle = () => {
    setTitle(`Chi tiêu`);
    setIcon(<i className="fa-duotone fa-solid fa-briefcase"></i>);
    setIconAdd();
  };

  useEffect(() => {
    funTitle();
  }, [setTitle, setIcon]);
  const handleClose = () => {
    setShowPopup(false);
  };

  const onChangeMaTicket = async (value) => {
    setTicketValue(value);
  };

  const handleOnChange = (pur) => {
    if (pur.action == 2) {
      setData(isData.filter((x) => x.id !== pur.id));
      setDataFilter(isDataFilter.filter((x) => x.id !== pur.id));
    } else {
      setID(pur.id);
      setShowPopup(true);
      setCheckSave(false);
    }
  };
  const handlePBChange = (value) => {
    setPhongBanValue(value);
  };
  return (
    <div className="contentItem">
      <div
        className="headerPur d-flex justify-content-between align-items-center  mt-1 p-2 div-select"
        style={{ flexWrap: "wrap", gap: "5px" }}
      >
        <div className="d-flex flex-wrap w-100" style={{ gap: "5px" }}>
          <div className="row  w-100 m-0 p-0" style={{}}>
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0  col_search ItemCV">
              <label>Thời gian </label>{" "}
              <DateRangePicker onDateChange={handleDateChange} />
            </div>
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1  col_search ItemCV ItemCVPD">
              <label>Phòng ban </label>{" "}
              <SelectTable
                setCheckAll={false}
                dataSelect2={isPhongBan}
                onPhongBanChange={handlePBChange}
              />
            </div>
            <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1  col_search ItemCV ItemCVPD">
              <label>Mã ticket </label>{" "}
              <Select2Ticket
                dataSelect2={isTicket}
                onChangeMaTicket={onChangeMaTicket}
              />
            </div>
            <div className="col-6 col-md-6 col-lg-3 col-xl-6 m-0 px-1  col_search ItemCV itemadd">
              <button
                style={{ marginTop: "25px" }}
                onClick={() => {
                  setShowPopup(!showPopup);
                  setCheckSave(true);
                }}
                class="btn btn-primary mr-2"
              >
                <i class="fas fa-plus"></i> Tạo phiếu
              </button>
            </div>
          </div>
        </div>
      </div>
      <PurChaseCard setData={isDataFilter} onChange={handleOnChange} />
      <Modal
        show={showPopup}
        onHide={handleClose}
        dialogClassName="modal-dialog-centered"
        aria-labelledby="popupModalHeader"
        backdrop="static" // Ngăn không cho modal đóng khi click ngoài
        keyboard={false}
        className="popupModalCreateLeave"
      >
        <Modal.Body>
          <CreatePurChase
            setData={isDataFilter.filter((x) => x.id == isID)}
            setCheckAdd={setCheckAdd}
            setShowPopup={setShowPopup}
            setCheckSave={isCheckSave}
            setPhongBanValueA={isPhongBanValue}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default PurChaseOrder;
