export type UserRole = "STUDENT" | "ADMIN";

export type AppUser = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
