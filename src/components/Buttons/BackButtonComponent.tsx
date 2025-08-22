import { useNavigate } from "react-router-dom";

const BackButtonComponent = ({ navigateLink = "/dashboard/order/list" }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(navigateLink);
  };

  return (
    <button onClick={handleBackClick} className="BackButtonComponent btn btn-primary">
      <i className="fa-solid fa-arrow-left"></i> Atrás
    </button>
  );
};

export default BackButtonComponent;
