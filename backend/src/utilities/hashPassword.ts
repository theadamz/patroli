import bcrypt from "bcrypt";

export const hashPassword = async (
  plainText: string,
  salt: number = 12
): Promise<string> => {
  const hashPassword = await bcrypt.hash(plainText, salt);
  return hashPassword;
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
