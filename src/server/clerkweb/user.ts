import { db } from "../db";

export const createUser = async (email: string, id: string) => {
  const user = await db.user.create({
    data: {
      id,
      email,
    },
  });
  return user;
};

export const deleteUser = async (id?: string) => {
  const user = await db.user.update({
    where: {
      id,
    },
    data: {
      allowed_to_login: false,
      updated_at: new Date().toISOString(),
    },
  });
  return user;
};
