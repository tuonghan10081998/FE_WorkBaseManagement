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
  OnChangeExport,
  setCheckDub,
  handleOnCheckDub,
}) => {
  return (
    <div
      className="d-flex justify-content-between align-items-center  mt-1 p-2 div-select"
      style={{ flexWrap: "wrap", gap: "5px" }}
    >
      <div className="d-flex flex-wrap w-100" style={{ gap: "5px" }}>
        <div className="row  w-100 m-0 p-0" style={{}}>
          <div className="col-12 col-md-12 col-lg-4 col-xl-2 m-0  col_search ItemCV">
            <label>Thời gian </label>{" "}
            <DateRangePicker onDateChange={handleDateChange} />
          </div>
          <div className="col-12 col-md-12 col-lg-8 col-xl-3 m-0 px-1 col_search ItemCV ItemCVPD itemSelect2">
            <div className="row w-100 m-0 p-0">
              <div className="col-6 px-0 pe-1">
                <label>Phòng ban </label>
                <Select
                  options={dataPB}
                  value={selectedPB}
                  onChange={OnChangePB}
                  isSearchable
                />
              </div>
              <div className="col-6 px-0 ps-1">
                <label>Nhân viên</label>{" "}
                <Select
                  options={dataNV}
                  value={selectedNV}
                  onChange={OnChangeNV}
                  placeholder="Tất cả"
                  isSearchable
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-12 col-xl-7  px-1 col_search ItemCV ItemCVPD itemSelect2">
            <div className="row w-100 m-0 p-0">
              <div className="col-12 col-lg-8 px-0">
                <div className="row w-100 m-0 p-0">
                  <div className="col-4 col-lg-4 px-0">
                    <label>Chiến dịch </label>{" "}
                    <Select
                      options={dataCD}
                      value={selectedCD}
                      onChange={OnChangeCD}
                      placeholder="Tất cả"
                      isSearchable
                    />
                  </div>
                  <div className="col-4 col-lg-4 px-1">
                    <label>Trạng thái </label>{" "}
                    <Select
                      options={dataS}
                      value={selectedS}
                      onChange={OnChangeS}
                      placeholder="Tất cả"
                      isSearchable
                    />
                  </div>
                  <div className="col-4 col-lg-4 px-0">
                    <label>Tìm kiếm </label>{" "}
                    <input
                      style={{ height: "38px" }}
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
              <div className="col-12 col-lg-4 d-flex justify-content-between px-0">
                <div>
                  <label style={{ whiteSpace: "nowrap" }}>Trùng data</label>{" "}
                  <div
                    style={{
                      height: "38px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      style={{ width: "30px" }}
                      value={setCheckDub}
                      onChange={(e) => handleOnCheckDub(!setCheckDub)}
                      type="checkbox"
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    onClick={OnClickView}
                    type="button"
                    class="btn-view"
                    aria-label="Xem"
                  >
                    <i class="fas fa-eye" aria-hidden="true"></i>
                    Phân tích
                  </button>
                  <button
                    onClick={(e) => OnChangeExport(e)}
                    type="button"
                    class="save-buttonShare btn btn-primary d-flex align-items-center gap-2 "
                    style={{
                      backgroundColor: "rgb(174 217 91)",
                      color: "#000",
                      marginTop: "30px",
                      padding: "6px 10px",
                      fontDize: "16px",
                      borderRadius: "7px",
                    }}
                  >
                    <i
                      style={{ marginRight: "2px" }}
                      class="fa-solid fa-file-export"
                    ></i>
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SelectOptionReport;
