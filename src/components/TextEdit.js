import React, { useRef, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";

const TextEditor = ({ setClass, setStateValue, setSetterValue, setHeight }) => {
  const editorRef = useRef(null);
  const [color, setColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#ffff00");

  // Hàm để xử lý các lệnh như bold, italic, underline, justify
  const handleCommand = (command, value = null) => {
    if (editorRef.current) {
      document.execCommand(command, false, value);
    }
  };
  const focusColorInput = () => {
    const colorInput = document.getElementById("colorPicker");
    colorInput.click(); // Mở hộp thoại chọn màu
  };
  const handleInputChange = () => {
    const currentContent = editorRef.current.innerHTML;
    setSetterValue(currentContent);
    moveCursorToEnd();
  };

  const moveCursorToEnd = () => {
    const editor = editorRef.current;

    // Đảm bảo rằng editor không rỗng
    if (editor) {
      const range = document.createRange();
      const selection = window.getSelection();

      // Đặt vị trí con trỏ xuống cuối editor
      range.selectNodeContents(editor);
      range.collapse(false); // Collapse vào cuối node
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };
  const resetText = () => {
    // Loại bỏ màu sắc và bôi đen
    document.execCommand("removeFormat", false, null);
  };
  useEffect(() => {
    // Di chuyển con trỏ xuống cuối khi lần đầu tiên render
    moveCursorToEnd();
  }, [setStateValue]); // Chạy lại khi nội dung (setStateValue) thay đổi

  // Hàm xử lý thay đổi màu chữ
  const handleColorChange = (event) => {
    const selectedColor = event.target.value; // Lấy giá trị màu sắc đã chọn
    setColor(selectedColor);
    document.execCommand("foreColor", false, selectedColor); // Áp dụng màu sắc vào văn bản
  };

  // Hàm xử lý thay đổi màu highlight (màu nền)
  const handleHighlightChange = (event) => {
    const selectedHighlightColor = event.target.value; // Lấy giá trị màu sắc đã chọn cho highlight
    setHighlightColor(selectedHighlightColor);
    document.execCommand("backColor", false, selectedHighlightColor); // Áp dụng màu nền vào văn bản
  };

  return (
    <div className="">
      <div className="">
        <div className="">
          <div className="d-flex justify-content-between mb-1 flex-wrap gap-4">
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary btn-color"
                onClick={() => handleCommand("bold")}
              >
                <i className="fas fa-bold"></i>
              </button>
              <button
                className="btn btn-success btn-color"
                onClick={() => handleCommand("italic")}
              >
                <i style={{ fontSize: "12px" }} className="fas fa-italic"></i>
              </button>
              <button
                className="btn btn-warning btn-color"
                onClick={() => handleCommand("underline")}
              >
                <i
                  style={{ fontSize: "12px" }}
                  className="fas fa-underline"
                ></i>
              </button>
              <button
                className="btn btn-secondary btn-color"
                onClick={() => handleCommand("justifyLeft")}
              >
                <i
                  style={{ fontSize: "12px" }}
                  className="fas fa-align-left"
                ></i>
              </button>
              <button
                className="btn btn-secondary btn-color"
                onClick={() => handleCommand("justifyCenter")}
              >
                <i
                  style={{ fontSize: "12px" }}
                  className="fas fa-align-center"
                ></i>
              </button>
              <button
                className="btn btn-secondary btn-color"
                onClick={() => handleCommand("justifyRight")}
              >
                <i
                  style={{ fontSize: "12px" }}
                  className="fas fa-align-right"
                ></i>
              </button>
            </div>
            <div
              className="d-flex align-items-center gap-1 "
              style={{ marginLeft: "auto" }}
            >
              <button
                onClick={resetText}
                type="button"
                className="btn btn-dark position-relative btn-color"
                title="Text Color"
                style={{ background: "#68b1dd", border: "1px solid" }}
              >
                <i className="fa-solid fa-broom"></i>
              </button>
              <button
                type="button"
                className="btn btn-dark position-relative btn-color"
                title="Text Color"
                style={{ background: "#7b42ff", border: "1px solid" }}
              >
                <i className="fas fa-palette"></i>
                <input
                  type="color"
                  value={color}
                  onChange={handleColorChange}
                  className="color-picker"
                />
              </button>
              <button
                style={{ background: "rgb(137 93 129)", border: "1px solid" }}
                type="button"
                className="btn btn-dark position-relative btn-color"
                title="Highlight Color"
              >
                <i className="fas fa-highlighter"></i>
                <input
                  type="color"
                  value={highlightColor}
                  onChange={handleHighlightChange}
                  className="color-picker"
                />
              </button>
            </div>
          </div>
          <div
            id={setClass}
            ref={editorRef}
            contentEditable="true"
            className="border p-3 rounded form-control"
            style={{
              minHeight: `${setHeight != 100 ? 150 : 100}px`,
              outline: "none",
              border: "1px solid #ccc !important",
              maxHeight: `${setHeight != 100 ? 500 : 400}px`,
              overflow: "auto",
            }}
            onInput={handleInputChange}
            dangerouslySetInnerHTML={{ __html: setStateValue }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
