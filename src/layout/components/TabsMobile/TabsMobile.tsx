import { useAuth } from "@/auth/hooks/useAuth";;
import "./TabsMobile.css";
import { NavLink } from "react-router-dom";

const TabsMobile = () => {
  const {  logout } = useAuth();

  return (
    <nav className="dn-desktop TabsComp">
      <NavLink to={"/dashboard/order/list"}><i className="fa-solid fa-list-check"></i></NavLink>
      <NavLink to={"/dashboard/user/list"}><i className="fa-solid fa-users"></i></NavLink>
      <NavLink to={"/dashboard/operator/list"}><i className="fa-solid fa-briefcase"></i></NavLink>
      <NavLink to={"/dashboard/order/wa-report"}><i className="fa-brands fa-whatsapp"></i></NavLink>
      <span onClick={logout} className='icon-tab'><i className="fa-solid fa-right-from-bracket"></i></span>
    </nav>
  );
};

export default TabsMobile;
