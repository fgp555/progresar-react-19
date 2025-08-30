import "./Navbar2.css";

interface IUser {
  _id: string;
  username: string;
  name: string;
  lastName: string;
  email: string;
  whatsapp: string;
  photo: string;
  role: string;
  isVisible: boolean;
  isActive: boolean;
  googleId: string;
  displayName: string;
  rawGoogle: string;
  createdAt: string;
  updatedAt: string;
}

const Navbar2 = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}") as IUser;

  const handleGoBack = () => {
    console.log("Navegando hacia atrás");
    history.back();
  };

  return (
    <nav className="navbar2-container">
      {/* Botón de retroceder */}
      <button className="back-button" onClick={handleGoBack} aria-label="Volver atrás">
        <i className="fas fa-arrow-left"></i>
      </button>

      {/* Información del usuario */}
      <div className="user-info">
        <div className="user-details-navbar2">
          <h2 className="user-name">
            {user.name} {user.lastName}
          </h2>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;
