import { $db } from "../db"

export const getMenu = async() => {
    return await $db.dish.findMany({
        select: {
            name: true,
            desc: true,
            price: true,
            menuFoodCategory: {
                select: {
                    category: true,
                }
            }
        },
        where: {
            dishState: {
                name: "Stockeado"
            }
        }
    })
}

export const updateDishState = async (dishId: number, stateId: number) => {
    return await $db.dish.update({
      where: {
        id: dishId,
      },
      data: {
        dishStateId: stateId,
      },
    });
  };
  