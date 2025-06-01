import React, { useEffect, useState } from "react";

const Notifi = () => {
  const IMG_API = process.env.REACT_APP_URL_IMG;
  const [isData, setData] = useState([]);

  const [isID, setID] = useState(null);
  const [isDataF, setDataF] = useState([]);
  const [isShow, setShow] = useState(false);
  useEffect(() => {
    const initialData = [
      {
        id: 2,
        title1: "A",
        title2: "B",
        images: "Notification/Image_31052025_085232.png",
        year: 2025,
        month: 5,
      },

      {
        id: 3,
        title1: "c",
        title2: "a",
        images: "Notification/Image_31052025_085232.png",
        year: 2025,
        month: 5,
      },
    ];

    const withImageApi = initialData.map((item) => ({
      ...item,
      imageapi: `${IMG_API}${item.images}`,
    }));

    setData(withImageApi);
  }, [IMG_API]);
  const handleClick = (id) => {
    setID(id);
    setDataF(isData.filter((x) => x.id == id));
  };
  return (
    <div className="w-100">
      <div className="row g-2">
        {/* Danh sách tài khoản */}

        <div className="col-12 col-md-12 col-lg-12 col-xl-10">
          <div className="card" style={{ height: "50px" }}>
            <div>
              <div className=" ">
                <div
                  className="item-table"
                  style={{
                    maxHeight: "calc(100vh - 160px )",
                    overflow: "auto",
                  }}
                >
                  <table className="task-table">
                    <thead>
                      <tr className="trthdashboard">
                        <td scope="col">Stt</td>

                        <td scope="col">Tiêu đề 1</td>
                        <td scope="col">Tiêu đề 2</td>
                        <td scope="col">Tháng</td>
                        <td scope="col">Năm</td>
                        <td scope="col">Hình ảnh</td>

                        <td style={{ width: "100px" }} scope="col">
                          Hành động
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {isData?.map((x, index) => {
                        return (
                          <tr
                            key={x.id}
                            style={{
                              background: index % 2 == 0 ? "#fff" : "#f3f3f3",
                            }}
                          >
                            {" "}
                            <td style={{ whiteSpace: "nowrap" }}>
                              <p title={index + 1}>{index + 1}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              <p title={x.title1}>{x.title1}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              <p title={x.title2}>{x.title2}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "50px",
                              }}
                            >
                              <p title={x.month}>{x.month}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "50px",
                              }}
                            >
                              <p title={x.year}>{x.year}</p>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "200px",
                              }}
                            >
                              <div className="col-12 col-md-6 d-flex align-items-center justify-content-start">
                                <img
                                  src={x.imageapi}
                                  className="img-fluid border rounded"
                                  style={{
                                    maxHeight: "52px",
                                    width: "100px",
                                  }}
                                />
                              </div>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}
                            >
                              <div className="d-flex justify-content-around gap-2 px-2">
                                <div
                                  onClick={(e) => handleClick(x.id)}
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  title="Chỉnh sửa"
                                >
                                  <i
                                    style={{
                                      fontSize: "18px",
                                      cursor: "pointer",
                                    }}
                                    className="fa-solid fa-pen-to-square"
                                  ></i>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifi;
