export interface IUserProfile {
  _id: string;
  name: string;
  email: string;
  password: string;
  photo?: string;
  role: string;
  isVisible: boolean;
  wardrobes?: IWardrobes[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface IWardrobes {
  id: number;
  slug: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserState {
  _id: string;
  username?: string;
  name: string;
  email: string;
  role: string;
  photo?: string;
  wardrobes: IWardrobes[];
  iat?: number;
  exp?: number;
}

export interface IAuthState {
  accessToken: string | null;
  userState: IUserState | null;
  loading: boolean;
  error: string | null;
}
