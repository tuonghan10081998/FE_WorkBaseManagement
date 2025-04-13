import React, { useState, useContext, useEffect } from "react";
import { TitleContext } from "../components/TitleContext";
import DateRangePicker from "../Date/DateRangePicker";
import Select2Ticket from "../CongViecList/select2Ticket";
import PurChaseCard from "./PuchaseCard";
import CreatePurChase from "./CreatePurChase";
import { Modal, Button } from "react-bootstrap";
import $ from "jquery";
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
    const dataFilter = isData;
    if (isTicketValue != "All")
      dataFilter = dataFilter.filter((x) => x.ticket?.includes(isTicketValue));
    setDataFilter(dataFilter);
  }, [isData]);
  useEffect(() => {
    let ticketFilter = isData;

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
  }, [isData]);
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
    setTitle(`Kế toán`);
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
  useEffect(() => {
    let dataPB = isData;
    if (isTicketValue != "All")
      dataPB = dataPB.filter((x) => x.ticket?.includes(isTicketValue));
    setDataFilter(dataPB);
  }, [isTicketValue]);
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
  return (
    <div>
      <div
        className="headerPur d-flex justify-content-between align-items-center  mt-1 p-2 div-select"
        style={{ flexWrap: "wrap", gap: "5px" }}
      >
        <div className="d-flex flex-wrap w-100" style={{ gap: "5px" }}>
          <div className="row  w-100 m-0 p-0" style={{}}>
            <div className="col-6 col-md-6 col-lg-4 col-xl-2 m-0  col_search ItemCV">
              <label>Thời gian </label>{" "}
              <DateRangePicker onDateChange={handleDateChange} />
            </div>
            <div className="col-6 col-md-6 col-lg-4 col-xl-2 m-0 px-1  col_search ItemCV ItemCVPD">
              <label>Mã ticket </label>{" "}
              <Select2Ticket
                dataSelect2={isTicket}
                onChangeMaTicket={onChangeMaTicket}
              />
            </div>
            <div className="col-12 col-md-12 col-lg-4 col-xl-8 m-0 px-1  col_search ItemCV itemadd">
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
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default PurChaseOrder;
