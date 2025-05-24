import { $db } from "../db";

export const checkUserIsAdmin = async (userId: number): Promise<boolean> => {
  const admin = await $db.admin.findFirst({
    where: { idUser: userId },
  });

  return admin ? true : false;
}