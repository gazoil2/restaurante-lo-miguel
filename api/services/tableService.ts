import { $db } from "../db";

export const getAvailableTables  = async() => {
    return await $db.table.findMany({
        select: {
            id: true,
            size: true,
        },
        where: {
            mesaState: {
                state: "Libre"
            }
        }
    })
}


export const updateStateTable = async (id: number, tableStateId: number) => {
    return await $db.table.update({
      where: {
        id: id,
      },
      data: {
        tableStateId: tableStateId,
      },
    });
};

