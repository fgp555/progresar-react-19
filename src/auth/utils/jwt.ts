// src/modules/auth/utils/jwt.ts

import { jwtDecode } from "jwt-decode";
import type  { IUserState } from "../interfaces/user.interface";
 
export const decodeToken = (accessToken: string): IUserState => {
  const decoded: IUserState = jwtDecode(accessToken);
  return decoded;
};

export const isTokenValid = (accessToken: string): boolean => {
  try {
    const decoded: IUserState = jwtDecode(accessToken);
    if (!decoded.exp) return false;
    const currentTime = Math.floor(Date.now() / 1000); // tiempo actual en segundos
    return decoded.exp > currentTime;
  } catch (err) {
    return false;
  }
};
