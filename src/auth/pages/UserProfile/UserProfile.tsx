"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/config/axiosInstance";
import "./UserProfile.css";

interface User {
  _id: string;
  email: string;
  username: string;
  name: string;
  role: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  wardrobes: any[];
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res: any = await axiosInstance.get("/api/auth/me");
        console.log("res", res);
        setUser(res.data.user);
      } catch (err) {
        console.error("Error al obtener el perfil:", err);
        setError("No se pudo obtener el perfil del usuario.");
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return <div className="user-profile-error">{error}</div>;
  }

  if (!user) {
    return <div className="user-profile-loading">Cargando...</div>;
  }

  return (
    <div className="user-profile">
      <h2>Perfil del Usuario</h2>
      <p>
        <strong>Nombre:</strong> {user.name}
      </p>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Rol:</strong> {user.role}
      </p>
      <p>
        <strong>Cuenta Pública:</strong> {user.isPublic ? "Sí" : "No"}
      </p>
      <p>
        <strong>Registrado el:</strong> {new Date(user.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default UserProfile;
