import { $db } from "../db";

export const getAvailableTables  = async() => {
    return await $db.table.findMany({
        where: {
            mesaState: {
                state: "Libre"
            }
        }
    })
}