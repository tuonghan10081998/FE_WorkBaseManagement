import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TitleContext } from "../components/TitleContext";
import SelectOptionReport from "./SelectOptionReport";
import GridShareReport from "./GridShareReport";
import moment from "moment";
const ShareDataReport = () => {
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const { setTitle, setIcon, setIconAdd } = useContext(TitleContext);
  const navigate = useNavigate();
  const [options, setOption] = useState([]);
  const [optionsNV, setOptionNV] = useState([]);
  const [optionsCD, setOptionCD] = useState([]);
  const [selectedPB, setSelectedPB] = useState(null);
  const [selectedNV, setSelectedNV] = useState(null);
  const [selectedCD, setSelectedCD] = useState(null);
  const [isLeader, setLeader] = useState("");
  const [isData, setData] = useState(null);
  const [isopera, setopera] = useState(true);
  const [isRole, setRole] = useState("");
  const [isDataNV, setDataNV] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: moment().startOf("month").format("YYYY-MM-DD"), // Ngày đầu tháng
    to: moment().endOf("month").format("YYYY-MM-DD"), // Ngày cuối tháng
  });
  const funTitle = () => {
    setTitle(`Báo cáo`);
    setIcon(<i className="fa-duotone fa-solid fa-briefcase"></i>);
    setIconAdd();
  };
  useEffect(() => {
    funTitle();
  }, [setTitle, setIcon]);
  useEffect(() => {
    !isUser && navigate("/");
  }, [isUser]);
  //phân quyền
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
    getPhanQuyen();
  }, [isUser]);
  //phòng ban
  useEffect(() => {
    getPhongBan();
  }, []);
  const getPhongBan = async () => {
    var url = `${process.env.REACT_APP_URL_API}Department/Get?action=get`;
    isRole !== "Administrator" &&
      (url = `${process.env.REACT_APP_URL_API}Department/Get?action=GetDept_User&para1=${isUser}`);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      const formattedOptions = data.map((dep) => ({
        value: dep.dep_Code,
        label: dep.dep_Name,
      }));

      setOption(formattedOptions);
    } catch (error) {
      console.error(error.message);
    }
  };
  const getNVData = async () => {
    const url = `${process.env.REACT_APP_URL_API}User/Get?action=Get`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const staffData = await response.json();
      let dataNV = staffData.filter(
        (x) => x.fullName.toLowerCase() !== "admin"
      );
      setDataNV(dataNV);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    isRole != "" && getNVData();
  }, [isRole]);

  useEffect(() => {
    if (!isDataNV?.length || !selectedPB?.value) return;
    let filteredData = isDataNV.filter((x) => x.dep_Code === selectedPB.value);

    isRole === "Member" &&
      (filteredData = filteredData.filter((x) => x.userID == isUser));

    isRole === "Leader" &&
      (filteredData = filteredData.filter((x) =>
        isLeader.includes(x.dep_Code)
      ));

    let formattedOptions = filteredData.map((x) => ({
      value: x.userID,
      label: x.fullName,
    }));

    isRole !== "Member" &&
      (formattedOptions = [
        { value: "all", label: "Tất cả" },
        ...formattedOptions,
      ]);

    setOptionNV(formattedOptions);
  }, [isDataNV, selectedPB, isRole, isUser, isLeader]);
  const OnChangePB = (selectedOption) => {
    setSelectedPB(selectedOption);
  };
  useEffect(() => {
    if (options.length > 0 && !selectedPB) {
      setSelectedPB(options[0]);
    }
  }, [options, selectedPB]);

  const OnChangeNV = (selectedOption) => {
    setSelectedNV(selectedOption);
  };
  useEffect(() => {
    if (optionsNV.length > 0 && !selectedNV) {
      setSelectedNV(optionsNV[0]);
    }
  }, [optionsNV, selectedNV]);
  useEffect(() => {
    if (optionsNV.length > 0) {
      setSelectedNV(optionsNV[0]);
    } else {
      setSelectedNV(null);
    }
  }, [optionsNV]);
  const handleDateChange = async (from, to) => {
    await setDateRange({ from, to });
  };

  const getData = async () => {
    const url = `${process.env.REACT_APP_URL_API}MarketingData/Get?action=getview&para1=${dateRange.from}&para2=${dateRange.to}`;
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
    getData();
  }, [dateRange]);
  useEffect(() => {
    if (!isData?.length) return;
    var dataF = isData.filter((x) => {
      const matchReceiver =
        selectedNV?.value === "all"
          ? x.dep_Code === selectedPB?.value
          : x.receiverID === selectedNV?.value;

      return matchReceiver;
    });
    const uniqueDataNV = dataF.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.utmCampaign === item.utmCampaign)
    );

    const formattedOptions = [
      { value: "all", label: " Tất cả " },
      ...uniqueDataNV.map((x) => ({
        value: x.utmCampaign,
        label: x.utmCampaign,
      })),
    ];

    setOptionCD(formattedOptions);
  }, [isData, selectedNV]);
  const OnChangeCD = (selectedOption) => {
    setSelectedCD(selectedOption);
  };
  useEffect(() => {
    if (optionsCD.length > 0 && !selectedCD) {
      setSelectedCD(optionsCD[0]);
    }
  }, [optionsCD, selectedCD]);
  useEffect(() => {
    if (optionsCD.length > 0) {
      setSelectedCD(optionsCD[0]);
    } else {
      setSelectedCD(null);
    }
  }, [optionsCD]);
  return (
    <div className="contentItem">
      <SelectOptionReport
        dataPB={options}
        dataNV={optionsNV}
        OnChangePB={OnChangePB}
        OnChangeNV={OnChangeNV}
        selectedPB={selectedPB}
        selectedNV={selectedNV}
        handleDateChange={handleDateChange}
        dataCD={optionsCD}
        OnChangeCD={OnChangeCD}
        selectedCD={selectedCD}
      />
      <GridShareReport
        data={isData}
        setChienDich={selectedCD?.value || "all"}
        setNhanVien={selectedNV?.value || "all"}
        setPhongBan={selectedPB?.value || "all"}
      />
    </div>
  );
};
export default ShareDataReport;
