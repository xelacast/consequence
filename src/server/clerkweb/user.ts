import { PrismaClient } from "@prisma/client/extension";
const prisma = new PrismaClient();

export const createUser = async (email: string, id: string) => {
  const user = await prisma.user.create({
    data: {
      id,
      email,
    },
  });
  return user;
};

export const deleteUser = async (id?: string) => {
  const user = await prisma.user.update({
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
