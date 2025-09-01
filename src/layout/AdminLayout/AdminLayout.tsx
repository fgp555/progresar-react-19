import "./AdminLayout.css";
import { Layout } from "@/components/Layout/Layout";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/hooks/useAuth";
import LoagingComp from "@/components/LoagingComp/LoagingComp";
import type { JSX } from "react";
import SoloAdmins from "@/components/SoloAdmins";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, hydrated, isAdmin } = useAuth();
  const location = useLocation();

  if (!hydrated) return <LoagingComp />;

  if (!isAuthenticated) {
    const redirectPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/?redirectURL=${redirectPath}`} replace />;
  }

  if (!isAdmin) {
    return <SoloAdmins />; // 👈 si no es admin mostramos el componente
  }

  return <>{children}</>;
};

const AdminLayout: React.FC = () => {
  return (
    <PrivateRoute>
      <Layout>
        <Outlet />
      </Layout>
    </PrivateRoute>
  );
};

export default AdminLayout;
