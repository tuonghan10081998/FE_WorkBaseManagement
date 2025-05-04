import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TitleContext } from "../components/TitleContext";
import SelectOption from "./SelectOption";
import GridShare from "../Marketing/GridShare";
import moment from "moment";
const ShareData = () => {
  const [isUser, setUser] = useState(localStorage.getItem("userID"));
  const { setTitle, setIcon, setIconAdd } = useContext(TitleContext);
  const navigate = useNavigate();
  const [options, setOption] = useState([]);
  const [optionsNV, setOptionNV] = useState([]);
  const [optionsCD, setOptionCD] = useState([]);
  const [isNVValue, setNVValue] = useState("");
  const [isDataNVF, setDataNVF] = useState([]);
  const [isDataNV, setDataNV] = useState([]);
  const [selectedPB, setSelectedPB] = useState(null);
  const [selectedNV, setSelectedNV] = useState(null);
  const [selectedCD, setSelectedCD] = useState(null);
  const [isChienDich, setChienDich] = useState("");
  const [isData, setData] = useState(null);
  const [isDataF, setDataF] = useState(null);
  const [isClick, setClick] = useState(false);
  const [isCheckLate, setCheckLate] = useState(false);
  const [isWeek, setWeek] = useState(3);
  const [isTreDeal, setTreDeal] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: moment().startOf("month").format("YYYY-MM-DD"), // Ngày đầu tháng
    to: moment().endOf("month").format("YYYY-MM-DD"), // Ngày cuối tháng
  });
  const funTitle = () => {
    setTitle(`Chia data`);
    setIcon(<i className="fa-duotone fa-solid fa-briefcase"></i>);
    setIconAdd();
  };

  useEffect(() => {
    funTitle();
  }, [setTitle, setIcon]);
  useEffect(() => {
    !isUser && navigate("/");
  }, [isUser]);

  useEffect(() => {
    getPhongBan();
  }, []);
  const getPhongBan = async () => {
    const url = `${process.env.REACT_APP_URL_API}Department/Get?action=get`;
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
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
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
    if (!isDataNV?.length || !selectedPB?.value) return;
    var dataNV = isDataNV;
    dataNV = dataNV.filter((x) => x.dep_Code === selectedPB.value);

    setDataNVF(dataNV);
  }, [isDataNV, selectedPB, selectedNV]);

  const OnChangePB = (selectedOption) => {
    setSelectedPB(selectedOption);
  };
  useEffect(() => {
    if (options.length > 0 && !selectedPB) {
      setSelectedPB(options[0]);
    }
  }, [options, selectedPB]);

  const OnChangeCD = (selectedOption) => {
    setSelectedCD(selectedOption);
  };
  useEffect(() => {
    if (optionsCD.length > 0 && !selectedCD) {
      setSelectedCD(optionsCD[0]);
    }
  }, [optionsCD, selectedCD]);

  const handleDateChange = async (from, to) => {
    await setDateRange({ from, to });
  };

  const getData = async () => {
    const url = `${process.env.REACT_APP_URL_API}MarketingData/Get?action=GetShare&para1=${dateRange.from}&para2=${dateRange.to}&para3=${isWeek}`;
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
  }, [dateRange, isWeek]);

  useEffect(() => {
    if (isData == null || isData.length === 0) return;
    var dataF = isData;
    setTreDeal(isData.filter((x) => x.dataStatus !== 1).length);
    if (!isCheckLate) dataF = dataF?.filter((x) => x.dataStatus === 1);
    else dataF = dataF.filter((x) => x.dataStatus !== 1);
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
    console.log(dataF);
    setOptionCD(formattedOptions);

    setDataF(dataF);
  }, [isData, isCheckLate]);
  const handleCheckLate = (value) => {
    setCheckLate(value);
  };
  const handleWeek = (value) => {
    setWeek(value);
  };

  return (
    <div className="contentItem">
      <SelectOption
        dataPB={options}
        dataCD={optionsCD}
        OnChangePB={OnChangePB}
        OnChangeCD={OnChangeCD}
        selectedPB={selectedPB}
        selectedNV={selectedNV}
        handleDateChange={handleDateChange}
        setClick={setClick}
        setCheckLate={isCheckLate}
        onChangeLate={handleCheckLate}
        setWeek={isWeek}
        onChangeWeek={handleWeek}
        setIsTreDeal={isTreDeal}
      />
      <GridShare
        dataNV={isDataNVF}
        data={isDataF}
        setChienDich={selectedCD?.value || "all"}
        setIsClick={isClick}
        setClick={setClick}
        setIsWeek={isWeek}
        setData={setData}
      />
    </div>
  );
};
export default ShareData;
