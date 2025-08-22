import { useNavigate } from "react-router-dom";

export const useRedirectToLastURL = () => {
  const navigate = useNavigate();

  return () => {
    const lastURL = localStorage.getItem("lastURL") || "/dashboard";
    localStorage.removeItem("lastURL");
    navigate(lastURL);
  };
};
