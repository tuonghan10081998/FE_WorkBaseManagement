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
  setClick,
  setCheckLate,
  onChangeLate,
  setWeek,
  onChangeWeek,
  setIsTreDeal,
  dataS,
  OnChangeS,
  selectedS,
  setIsSearch,
  OnChangeSearch,
  setIsSelectData,
  OnChangeSelectData,
}) => {
  return (
    <div
      className="d-flex justify-content-between align-items-center  mt-1 p-2 div-select"
      style={{ flexWrap: "wrap", gap: "5px" }}
    >
      <div className="btnShare">
        <button
          onClick={() => {
            setClick((x) => !x);
          }}
          class="btn btn-primary mr-2"
        >
          <i class="fas fa-plus"></i> Chia tự động
        </button>
      </div>
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
                <label>Chiến dịch </label>{" "}
                <Select
                  options={dataCD}
                  value={selectedCD}
                  onChange={OnChangeCD}
                  placeholder="Tất cả"
                  isSearchable
                />
              </div>
            </div>
          </div>

          <div className="col-12 col-md-12 col-lg-7 col-xl-5  px-1 col_search ItemCV ItemCVPD itemSelect2">
            <div className="row w-100 m-0 p-0">
              <div className="col-5 px-0">
                <label>Trạng thái </label>{" "}
                <Select
                  options={dataS}
                  value={selectedS}
                  onChange={OnChangeS}
                  placeholder="Tất cả"
                  isSearchable
                />
              </div>
              <div className="col-4 px-1">
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
              <div className="col-3 px-0">
                <label>Dữ liệu</label>{" "}
                <select
                  style={{ border: "1px solid #DEE2E6", height: "40px" }}
                  value={setIsSelectData}
                  onChange={(e) => OnChangeSelectData(e.currentTarget.value)}
                  id="select2_uutien"
                  className="select_uutien"
                >
                  <option value="1"> Tất cả </option>
                  <option value="2"> Đã chia </option>
                  <option value="3"> Chưa chia </option>
                </select>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-12 col-lg-5 col-xl-2 m-0 px-1 col_search ItemCV ItemCVPD itemSelect2">
            <div className="row  w-100 m-0 p-0">
              <div className="col-5 col-lg-5 px-0">
                <label>Tuần trễ</label>{" "}
                <select
                  style={{ border: "1px solid #DEE2E6", height: "40px" }}
                  value={setWeek}
                  onChange={(e) => onChangeWeek(e.currentTarget.value)}
                  id="select2_uutien"
                  className="select_uutien"
                >
                  <option value="1"> 1 </option>
                  <option value="2"> 2 </option>
                  <option value="3"> 3 </option>
                  <option value="4"> 4 </option>
                </select>
              </div>
              <div className="col-7 col-lg-7 px-0">
                <div className="d-flex justify-content-start align-items-center h-100 gap-2 mt-3">
                  <div
                    style={{
                      height: "38px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      style={{ width: "30px" }}
                      value={setCheckLate}
                      onChange={(e) => onChangeLate(!setCheckLate)}
                      type="checkbox"
                    />
                  </div>
                  <label style={{ whiteSpace: "nowrap" }}>
                    Trễ deal (
                    <span className="text-danger">{setIsTreDeal}</span>)
                  </label>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SelectOption;
