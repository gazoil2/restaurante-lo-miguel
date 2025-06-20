import { $db } from "../db";

export const getAllOrders = async () => {
    return await $db.orderHeader.findMany({
        select: {
            id: true,
            total: true,
            userId: true
        }
    })
}

export const getOrderById = async (id: number) => {
    return await $db.orderHeader.findFirst({
        select: {
            userId: true,
            id: true,
            total: true,
            discount: true,
            orderState: {
                select: {
                    state: true,
                }
            }
        },

        where: {
            id: id,
        }
    })
}

export const getOrderState = async (id: number) => {
    return await $db.orderHeader.findUnique({
        select: {
            userId: true,
            orderState: {
                select: {
                    state: true,
                }
            }
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

export const postOrder = async (user: number, address: number) => {
    return await $db.orderHeader.create({
        data: {
            userId: user,
            orderAddressId: address,
            orderStateId: 1,
        },

        select: {
            id: true,
            userId: true,
            headerAddress: {
                select: {
                    province: true,
                    city: true,
                    street: true,
                    number: true,
                }
            },

            total: true,
            discount: true,
        }
    })
}

export const addOrderDetail = async (orderHeaderId: number, dishId: number, amount: number) => {
    const dish = await $db.dish.findFirst({
        select: {
            price: true,
        },

        where: {
            id: dishId,
        }
    })

    const orderHeader = await $db.orderHeader.findUnique({
        where: { id: orderHeaderId }
    })

    if (!dish) {
        throw new Error("Dish does not exist")
    };

    if (!orderHeader) {
        throw new Error("Order does not exist")
    }

    const dishPrice = dish?.price * amount;
    const newTotal = dishPrice + orderHeader.total

    await $db.orderHeader.update({
        data: {
            total: newTotal,
        },
        where: { id: orderHeaderId }
    })

    return await $db.orderDetail.create({
        data: {
            orderHeaderId,
            dishId,
            amount,
            total: dishPrice,
            discount: 0,
        },

        select: {
            detailDish: {
                select: {
                    name: true,
                    menuFoodCategory: {
                        select: {
                            category: true,
                        }
                    }
                }
            },

            amount: true,
            total: true,
            discount: true,
        }
    })
}


export const updateOrderState = async (orderHeaderId: number, orderStateId: number) => {
    return await $db.orderHeader.update({
        data: {
            orderStateId,
        },

        where: { id: orderHeaderId },
        select: {
            orderState: {
                select: {
                    state: true,
                }
            },
        }
    })
}