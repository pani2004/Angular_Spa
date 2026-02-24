export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: number;
  lastLogin?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  department: string;
  status: string;
  joinDate: string;
}

export interface RecordsResponse {
  success: boolean;
  message: string;
  data: {
    records: UserRecord[];
    count: number;
    userRole: UserRole;
  };
}
