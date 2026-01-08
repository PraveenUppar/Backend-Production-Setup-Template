interface UserData {
  email: string;
  password: string;
}
declare const createUserService: (userData: UserData) => Promise<{
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}>;
declare const findUserService: (email: string) => Promise<{
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
} | null>;
declare const verifyUserService: (
  password: string,
  hashedPassword: string,
) => Promise<boolean>;
export { createUserService, findUserService, verifyUserService };
//# sourceMappingURL=user.service.d.ts.map
