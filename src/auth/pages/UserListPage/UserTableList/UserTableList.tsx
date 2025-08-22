import "./UserTableList.css";
import { useNavigate } from "react-router-dom";
import { validateImgPath } from "@/utils/validateImgPath";
// import { apiUserService } from "@/auth/service/apiUser";
import type { IUserProfile } from "@/auth/interfaces/user.interface";

export const UserTableList = ({ data /* fetchUsers */ }: any) => {
  const navigate = useNavigate();

  const handleDelete = async (ItemId: any) => {
    console.log("ItemId", ItemId);
    // if (!ItemId) {
    //   // Si no se ingresa un id, mostramos un error
    //   Swal.fire({
    //     title: "Error",
    //     text: "Por favor, ingresa un ID de usuario válido.",
    //     icon: "error",
    //     confirmButtonText: "Aceptar",
    //   });
    //   return;
    // }
    // // Confirmar si desea eliminar
    // const result = await Swal.fire({
    //   title: "¿Estás seguro?",
    //   text: "Esta acción no se puede deshacer.",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonText: "Sí, eliminar",
    //   cancelButtonText: "Cancelar",
    // });
    // if (result.isConfirmed) {
    //   try {
    //     // Llamada a la API para eliminar el usuario
    //     await apiUserService.deleteUser(ItemId);
    //     // Mostrar alerta de éxito
    //     Swal.fire({
    //       title: "¡Usuario eliminado!",
    //       text: "El usuario ha sido eliminado con éxito.",
    //       icon: "success",
    //       confirmButtonText: "Aceptar",
    //     });
    //     // Limpiar el campo después de eliminar
    //   } catch (error: any) {
    //     // Si el error es 404 (usuario no encontrado), lo mostramos
    //     if (error.response && error.response.status === 404) {
    //       Swal.fire({
    //         title: "Error",
    //         text: error.response.data.message || "Usuario no encontrado.",
    //         icon: "error",
    //         confirmButtonText: "Aceptar",
    //       });
    //     } else {
    //       // En caso de otro error, mostrar un mensaje genérico
    //       Swal.fire({
    //         title: "Error",
    //         text: error.message || "Hubo un error al eliminar el usuario.",
    //         icon: "error",
    //         confirmButtonText: "Aceptar",
    //       });
    //     }
    //   } finally {
    //     console.log("Cerrando loading");
    //     fetchUsers();
    //   }
    // }
  };

  return (
    <div className="UserTableRespoComp">
      <table>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Creado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: IUserProfile, index: any) => (
            <tr
              key={index}
              onClick={() => navigate(`/dashboard/user/${item._id}/details`)}
              style={{ cursor: "pointer" }}
            >
              <td data-label="Foto">
                <img src={validateImgPath(item.photo)} alt={item.name} className="user-photo" />
              </td>
              <td data-label="Nombre">{item.name}</td>
              <td data-label="Correo">{item.email}</td>
              <td data-label="Rol">
                {item.role === "admin"
                  ? "Administrador"
                  : item.role === "superadmin"
                  ? "SuperAdmin"
                  : item.role === "collaborator"
                  ? "Colaborador"
                  : "Usuario"}
              </td>
              <td data-label="Creado">
                {new Date(item.createdAt).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td data-label="Acciones" onClick={(event) => event.stopPropagation()}>
                <div className="actions">
                  {/* <NavLink to={`/dashboard/user/${item._id}/update/`}>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </NavLink> */}
                  <i className="fa-solid fa-trash-can" onClick={() => handleDelete(item._id)}></i>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
