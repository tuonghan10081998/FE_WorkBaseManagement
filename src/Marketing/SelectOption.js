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
          <div className="col-6 col-md-6 col-lg-2 col-xl-2 m-0 px-1 col_search ItemCV ItemCVPD itemSelect2">
            <label>Phòng ban </label>
            <Select
              options={dataPB}
              value={selectedPB}
              onChange={OnChangePB}
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
          <div className="col-6 col-md-6 col-lg-2 col-xl-3 m-0 px-1  col_search ItemCV ItemCVPD itemSelect2">
            <div className="row">
              <div className="col-4 col-lg-5">
                <label style={{ whiteSpace: "nowrap" }}>
                  Trễ deal (<span className="text-danger">{setIsTreDeal}</span>)
                </label>{" "}
                <div
                  style={{
                    height: "38px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    value={setCheckLate}
                    onChange={(e) => onChangeLate(!setCheckLate)}
                    type="checkbox"
                  />
                </div>
              </div>
              <div className="col-8 col-lg-7">
                <label>Tuần trễ</label>{" "}
                <select
                  style={{ border: "1px solid #DEE2E6" }}
                  value={setWeek}
                  onChange={(e) => onChangeWeek(e.currentTarget.value)}
                  id="select2_uutien"
                  className="select_uutien"
                >
                  <option value="1"> 1 tuần</option>
                  <option value="2"> 2 tuần</option>
                  <option value="3"> 3 tuần</option>
                  <option value="4"> 4 tuần</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-2 col-xl-3 m-0 px-1  col_search ItemCV itemadd">
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
