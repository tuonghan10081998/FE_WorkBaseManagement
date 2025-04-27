import Select from "react-select";
import DateRangePicker from "../Date/DateRangePicker";
import "./ShareData.css";
const SelectOption = ({
  dataPB,
  dataCD,
  OnChangePB,
  OnChangeCD,
  selectedPB,
  selectedCD,
  handleDateChange,
  setIsChienDich,
  setChienDich,
  setClick,
}) => {
  return (
    <div
      className="d-flex justify-content-between align-items-center  mt-1 p-2 div-select"
      style={{ flexWrap: "wrap", gap: "5px" }}
    >
      <div className="d-flex flex-wrap w-100" style={{ gap: "5px" }}>
        <div className="row  w-100 m-0 p-0" style={{}}>
          <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0  col_search ItemCV">
            <label>Thời gian </label>{" "}
            <DateRangePicker onDateChange={handleDateChange} />
          </div>
          <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1 col_search ItemCV ItemCVPD itemSelect2">
            <label>Phòng ban </label>
            <Select
              options={dataPB}
              value={selectedPB}
              onChange={OnChangePB}
              isSearchable
            />
          </div>

          {/* <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1  col_search ItemCV ItemCVPD itemSelect2">
            <label>Nhân viên</label>{" "}
            <Select
              options={dataNV}
              value={selectedNV}
              onChange={OnChangeNV}
              placeholder="Tất cả"
              isSearchable
            />
          </div> */}
          <div className="col-6 col-md-6 col-lg-3 col-xl-2 col_search ItemCV itemSelect2">
            <label>Chiến dịch </label>{" "}
            <Select
              options={dataCD}
              value={selectedCD}
              onChange={OnChangeCD}
              placeholder="Tất cả"
              isSearchable
            />
          </div>
          <div className="col-6 col-md-6 col-lg-3 col-xl-6 m-0 px-1  col_search ItemCV itemadd">
            <button
              style={{ marginTop: "25px" }}
              onClick={() => {
                setClick((x) => !x);
              }}
              class="btn btn-primary mr-2"
            >
              <i class="fas fa-plus"></i> Chia tự động
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SelectOption;
