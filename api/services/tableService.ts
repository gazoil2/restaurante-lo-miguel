import { error } from "console";
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

export const getAllTables = async() => {
  return await $db.table.findMany({
    select: {
      id: true,
      size:true,
      mesaState: {
        select: {state: true},
      }
    }
  })
}

export const postTable = async (size: number) => {
  return await $db.table.create({
    data: {
      size : size,
      tableStateId: 1,
    },
    select: {
      id: true,
      size: true,
      mesaState: {
        select: { state: true },
      },
    },
  });
};

export const reserveTable = async(id: number) => {
  const stateId = await $db.table.findFirst({
    where: {id: id},
    select: {
      tableStateId: true
    }
  })
  const freeStateId = 1;
  if (stateId?.tableStateId === freeStateId){
    const reservedStateId = 3;
    return await $db.table.update({
      where: {
        id: id,
      },
      data: {
        tableStateId: reservedStateId,
      },
    });

  } else {
    throw error("No se puede reservar una mesa que no este libre")
  }
  
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

