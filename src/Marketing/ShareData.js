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
  const [isClick, setClick] = useState(false);
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

    // const formattedOptions = [
    //   { value: "all", label: " Tất cả " },
    //   ...dataNV.map((x) => ({
    //     value: x.userID,
    //     label: x.fullName,
    //   })),
    // ];
    // setOptionNV(formattedOptions);

    // if (selectedNV?.value && selectedNV.value !== "all") {
    //   console.log(selectedNV.value);
    //   dataNV = dataNV.filter((x) => x.userID === selectedNV.value);
    // }
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
    const url = `${process.env.REACT_APP_URL_API}MarketingData/Get?action=GetShare&para1=${dateRange.from}&para2=${dateRange.to}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const getTable = await response.json();
      const uniqueDataNV = getTable.filter(
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
      setData(getTable);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getData();
  }, [dateRange]);

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
        setIsChienDich={isChienDich}
        setChienDich={setChienDich}
        setClick={setClick}
      />
      <GridShare
        dataNV={isDataNVF}
        data={isData}
        setChienDich={selectedCD?.value || "all"}
        setIsClick={isClick}
        setClick={setClick}
      />
    </div>
  );
};
export default ShareData;
