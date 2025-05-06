import Select from "react-select";
import DateRangePicker from "../Date/DateRangePicker";
import "./ShareData.css";
const SelectOptionReport = ({
  dataPB,
  dataNV,
  OnChangePB,
  OnChangeNV,
  selectedPB,
  selectedNV,
  handleDateChange,
  dataCD,
  OnChangeCD,
  selectedCD,
  dataS,
  OnChangeS,
  selectedS,
  setIsSearch,
  OnChangeSearch,
  OnClickView,
}) => {
  return (
    <div
      className="d-flex justify-content-between align-items-center  mt-1 p-2 div-select"
      style={{ flexWrap: "wrap", gap: "5px" }}
    >
      <button
        onClick={OnClickView}
        type="button"
        class="btn-view"
        aria-label="Xem"
      >
        <i class="fas fa-eye" aria-hidden="true"></i>
        Phân tích
      </button>
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

          <div className="col-6 col-md-6 col-lg-3 col-xl-2 m-0 px-1  col_search ItemCV ItemCVPD itemSelect2">
            <label>Nhân viên</label>{" "}
            <Select
              options={dataNV}
              value={selectedNV}
              onChange={OnChangeNV}
              placeholder="Tất cả"
              isSearchable
            />
          </div>
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
          <div className="col-6 col-md-6 col-lg-3 col-xl-2 col_search ItemCV itemSelect2">
            <label>Trạng thái </label>{" "}
            <Select
              options={dataS}
              value={selectedS}
              onChange={OnChangeS}
              placeholder="Tất cả"
              isSearchable
            />
          </div>
          <div className="col-6 col-md-6 col-lg-3 col-xl-2 col_search ItemCV itemSelect2">
            <label>Tìm kiếm </label>{" "}
            <input
              style={{ height: "40px" }}
              type="text"
              id="projectFilter"
              className="form-control mr-2"
              placeholder=""
              value={setIsSearch}
              onChange={(e) => OnChangeSearch(e.currentTarget.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SelectOptionReport;
