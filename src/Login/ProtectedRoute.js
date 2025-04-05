import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("authenticated");

  // Nếu người dùng chưa đăng nhập, chuyển hướng tới trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Nếu đã đăng nhập, hiển thị trang yêu cầu
  return children;
};

export default ProtectedRoute;
