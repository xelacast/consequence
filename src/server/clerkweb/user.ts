import { db } from "../db";

export const createUser = async (email: string, id: string) => {
  const user = await db.user.create({
    data: {
      clerk_id: id,
      email,
    },
  });
  return user;
};

export const deleteUser = async (id?: string) => {
  const user = await db.user.update({
    where: {
      clerk_id: id,
    },
    data: {
      allowed_to_login: false,
      updated_at: new Date().toISOString(),
    },
  });
  return user;
};
