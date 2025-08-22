import "./GoogleProfileChip.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const GoogleProfileChip: React.FC = () => {
  const { userState } = useAuth();

  return (
    <NavLink to={`/dashboard/setting/profile`} className="GoogleProfile">
      <img src={userState?.photo} alt={userState?.name} />
      <span>{userState?.name}</span>
    </NavLink>
  );
};

export default GoogleProfileChip;
