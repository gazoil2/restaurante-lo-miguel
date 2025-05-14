import { $db } from "../db";

export const checkUserIsAdmin = async(userId: number):Promise<Boolean> => {
    const admin = await $db.admin.findFirst({
        where: { idUser: userId },
      });
    
    return admin ? true : false;
}