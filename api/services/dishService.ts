import { $db } from "../db"

export const getMenu = async () => {
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
export const getAdminMenu = async () => {
    return await $db.dish.findMany({
        select: {
            name: true,
            desc: true,
            price: true,
            dishState: {
                select: {
                    name: true,
                }
            },
            menuFoodCategory: {
                select: {
                    category: true,
                }
            }
        }
    })
}

export const postDish = async (name: string, desc: string, price: number, categoryId: number, dishStateId: number) => {
    return $db.dish.create({
        data: {
            name,
            desc,
            price,
            categoryId,
            dishStateId
        },
        select: {
            id: true,
            name: true,
            desc: true,
            price: true,
            menuFoodCategory: {
                select: { category: true }
            },
            dishState: {
                select: { name: true }
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
