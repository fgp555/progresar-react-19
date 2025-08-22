import { Outlet } from "react-router-dom";
import "./EmptyLayout.css";

const EmptyLayout = () => {
  return (
    <div className="empty-layout">
      <Outlet />
    </div>
  );
};

export default EmptyLayout;
