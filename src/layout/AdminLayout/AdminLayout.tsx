import "./AdminLayout.css";
import { Layout } from "@/components/Layout/Layout";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/hooks/useAuth";
import LoagingComp from "@/components/LoagingComp/LoagingComp";
import type { JSX } from "react";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, hydrated } = useAuth();
  const location = useLocation();

  if (!hydrated) return <LoagingComp />;

  if (!isAuthenticated) {
    const redirectPath = encodeURIComponent(location.pathname + location.search);
    // return <Navigate to={`/login?redirectURL=${redirectPath}`} replace />;
    return <Navigate to={`/?redirectURL=${redirectPath}`} replace />;
  }
  return <>{children}</>;
};

const AdminLayout: React.FC = () => {
  // const {  logout, isLoading } = useAuth();
  // const userOperatorId = useSelector((state: any) => state.user?.user?.operator?.id);
  // console.log("userOperatorId", userOperatorId);
  return (
    <PrivateRoute>
      <Layout>
        <Outlet />
      </Layout>
    </PrivateRoute>
  );
};

export default AdminLayout;
