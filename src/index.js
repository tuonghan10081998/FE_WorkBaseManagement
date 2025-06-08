import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { TitleProvider } from "./components/TitleContext";
import Layout from "./components/Layout";
import AddTask from "./components/AddTask";
import ListWork from "./CongViecList/ListCV";
import Login from "./Login/Login"; // Trang đăng nhập
import PhanQuyen from "./PhanQuyen/PhanQuyen";
import KPI from "./KPI/KPI";
import Leave from "./Leave/Leave";
import Project from "./Project/Project";
import Dashboard from "./DashBoard/DashBoard";
import ShareData from "./Marketing/ShareData";
import PurChaseOrder from "./PurChaseOrder/PurChaseOrder";
import Revenue from "./Revenue/Revenue";
import ShareDataReport from "./Marketing/ShareDataReport";
import Setting from "./SettingDashboard/Setting";
import DashBoardUser from "./SettingDashboard/DashboardUser";
export default function App() {
  return (
    <BrowserRouter>
      <TitleProvider>
        {" "}
        {/* ✅ Đặt TitleProvider bọc Layout */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/layout" element={<Layout />}>
            <Route path="/layout/addtask" element={<AddTask />} />
            <Route path="/layout/phanquyen" element={<PhanQuyen />} />
            <Route path="/layout/listcongviec" element={<ListWork />} />
            <Route path="/layout/listleave" element={<Leave />} />
            <Route path="/layout/project" element={<Project />} />
            <Route path="/layout/KPI" element={<KPI />} />
            <Route path="/layout/Dashboard" element={<Dashboard />} />
            <Route path="/layout/PurChase" element={<PurChaseOrder />} />
            <Route path="/layout/Revenue" element={<Revenue />} />
            <Route path="/layout/Marketing" element={<ShareData />} />
            <Route path="/layout/Setting" element={<Setting />} />
            <Route path="/layout/DashBoardUser" element={<DashBoardUser />} />
            <Route
              path="/layout/MarketingReport"
              element={<ShareDataReport />}
            />
          </Route>
        </Routes>
      </TitleProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
