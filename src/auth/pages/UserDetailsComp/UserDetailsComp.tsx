import "./UserDetailsComp.css";
import { apiUserService } from "../../service/apiUser";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { validateImgPath } from "@/utils/validateImgPath";
import Swal from "sweetalert2";
import BackButtonComponent from "@/components/Buttons/BackButtonComponent";
import { BreadcrumbsComponent } from "@/components/BreadcrumbsComponent/BreadcrumbsComponent";
import LoagingComp from "@/components/LoagingComp/LoagingComp";

const UserDetailsComp = ({ userId }: any) => {
  const [loading, setLoading] = useState(false);
  const [dataUser, setDataUser] = useState<any>();
  const isAdmin = useSelector(
    (state: any) => state.user?.user?.role === "admin" || state.user?.user?.role === "superadmin"
  );

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await apiUserService.getUserById(userId);
      setDataUser(response);
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar la información del usuario", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    // return <SpinnerComp />;
    return <LoagingComp mensaje="Cargando información del usuario..." />;
  }

  if (!dataUser) {
    return <p>No se encontraron datos del usuario.</p>;
  }

  const breadcrumbItems = [{ label: "Usuarios", link: "/dashboard/user/list" }, { label: "Detalles del Usuario" }];

  return (
    <div className="UserDetail">
      <section className="breadcrumbs-container">
        <div className="header-actions">
          {isAdmin && (
            <aside className="dn-mobile">
              <BackButtonComponent navigateLink="/dashboard/user/list" />
              <BreadcrumbsComponent items={breadcrumbItems} />
            </aside>
          )}
          <NavLink to={`/dashboard/user/${userId}/update`}>
            <button className="btn btn-primary icon">
              <i className="fa-solid fa-pen-to-square"> </i>
              Editar
            </button>
          </NavLink>
        </div>
      </section>

      <div className="user-card">
        <img src={validateImgPath(dataUser.photo)} alt="Foto del usuario" className="user-image" />
        <div className="user-info">
          <h2>{dataUser.displayName}</h2>
          <p>
            <strong>Nombre:</strong> {dataUser.name}
          </p>
          <p>
            <strong>Apellido:</strong> {dataUser.lastName}
          </p>
          <p>
            <strong>Email:</strong> {dataUser.email}
          </p>
          <p>
            <strong>WhatsApp:</strong> {dataUser.whatsapp || "No disponible"}
          </p>
          <p>
            <strong>Rol:</strong> {dataUser.role}
          </p>
          <p>
            <strong>Visible:</strong> {dataUser.isVisible ? "Sí" : "No"}
          </p>
          <p>
            <strong>Creado:</strong> {new Date(dataUser.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Actualizado:</strong> {new Date(dataUser.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsComp;
