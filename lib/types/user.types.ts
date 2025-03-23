export enum RoleType {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  MEMBER = "MEMBER",
}

export enum PermissionEnum {
  VIEW_RESTAURANTS = "VIEW_RESTAURANTS",
  CREATE_ORDER = "CREATE_ORDER",
  PLACE_ORDER = "PLACE_ORDER",
  CANCEL_ORDER = "CANCEL_ORDER",
  UPDATE_PAYMENT = "UPDATE_PAYMENT",
}

export interface Country {
  id: string;
  name: string;
}

export interface UserCountry {
  id: string;
  country: Country;
}

export interface Permission {
  id: string;
  name: PermissionEnum;
}

export interface RolePermission {
  id: string;
  permission: Permission;
}

export interface Role {
  id: string;
  name: RoleType;
  rolePermissions: RolePermission[];
}

export interface UserRole {
  id: string;
  role: Role;
}

export interface User {
  id: string;
  email: string;
  name: string;
  userRoles: UserRole[];
  userCountries: UserCountry[];
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenPayload {
  userId: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
