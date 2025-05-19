import { $db } from "../db";

export const getAllOrders = async () => {
    return await $db.orderHeader.findMany({
        select: {
            id: true,
            total: true,
        },

        where: {
            orderState: {
                state: "En preparación",
            }
        }
    })
}

export const getOrderById = async (id: number) => {
    return await $db.orderHeader.findFirst({
        select: {
            id: true,
            total: true,
            discount: true,
        },

        where: {
            id: id,
        }
    })
}

export const getOrderDetails = async (id: number) => {
    return await $db.orderDetail.findMany({
        select: {
            id: true,
            amount: true,
            total: true,
            discount: true,
            detailDish: {
                select: {
                    name: true, 
                }
            },
        },

        where: {
            orderHeaderId: id,
        }
    })
}