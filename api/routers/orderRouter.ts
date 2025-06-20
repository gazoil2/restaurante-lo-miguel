import express from "express";
import { addOrderDetail, getAllOrders, getOrderById, getOrderDetails, getOrderState, postOrder, updateOrderState } from "../services/orderService";
import { Response } from 'express';
import { sendJSONResponse } from '../utils/response';
import { getUserById } from "../services/userService";
import { authMiddleware, authenticatedRoute, AuthenticatedRequest } from "./authRouter"
export const orderRouter = express.Router();

orderRouter.use('/admin', authMiddleware)

orderRouter.get('/admin', authenticatedRoute(async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.context?.user?.admin) {
            sendJSONResponse(res, 403, "Admin access required")
            return;
        }
        const orders = await getAllOrders();

        sendJSONResponse(res, 200, { orders })
    } catch (e) {
        console.log("Error: ", e);

        sendJSONResponse(res, 500)
    }
}))

orderRouter.get('/:id', authenticatedRoute(async (req: AuthenticatedRequest, res: Response) => {
    try {
        const isAdmin = req.context.user.admin;
        const { id } = req.params
        const idUser = parseInt(req.context.user.id)
        const details = await getOrderDetails(parseInt(id));
        const orderheader = await getOrderById(parseInt(id));

        if (!isAdmin && orderheader?.userId != idUser) {
            sendJSONResponse(res, 403, "Cannot access that order (permission denied)");

            return;
        };

        sendJSONResponse(res, 200, { header: orderheader, details: details })
    } catch (e) {
        console.log(e);
        sendJSONResponse(res, 500);
    }
}))

orderRouter.post('/post', authenticatedRoute(async (req: AuthenticatedRequest, res: Response) => {
    try {

        const idUser = parseInt(req.context.user.id)
        if (!idUser) return;

        const userData = await getUserById(idUser);
        if (!userData?.addressId) {
            sendJSONResponse(res, 500);
            return;
        }

        const newOrder = await postOrder(idUser, userData?.addressId);

        sendJSONResponse(res, 200, { newOrder })
    } catch (err) {
        sendJSONResponse(res, 500)
        console.log(err);
    }
}))

orderRouter.post('/add-detail', authenticatedRoute(async (req: AuthenticatedRequest, res: Response) => {
    try {

        const isAdmin = req.context.user.admin;
        const idUser = parseInt(req.context.user.id)
        const { orderHeaderId, dishId, amount } = req.body
        const orderHeaderData = await getOrderById(parseInt(orderHeaderId))
        if (!isAdmin && orderHeaderData?.userId != idUser) {
            sendJSONResponse(res, 403, "Cannot modify that order (permission denied)")
            return;
        }

        const newOrderDetail = await addOrderDetail(parseInt(orderHeaderId), parseInt(dishId), parseInt(amount));

        sendJSONResponse(res, 200, { newOrderDetail })

    } catch (err) {
        sendJSONResponse(res, 500)
        console.log(err)
    }
}))

orderRouter.get('/state/:id', authenticatedRoute(async (req: AuthenticatedRequest, res: Response) => {
    try {
        const isAdmin = req.context.user.admin;
        const idUser = parseInt(req.context.user.id)
        const { id } = req.params
        const order = await getOrderState(parseInt(id));

        if (!isAdmin && order?.userId != idUser) {
            sendJSONResponse(res, 403, "Cannot access that order state (permission denied)")
            return;
        }

        sendJSONResponse(res, 200, {
            orderId: id,
            state: order?.orderState.state,
        })
    } catch (err) {
        console.log(err)
        sendJSONResponse(res, 500)
    }
}))


orderRouter.patch('/request/:id', authenticatedRoute(async (req: AuthenticatedRequest, res: Response) => {
    try {
        const isAdmin = req.context.user.admin;
        const idUser = parseInt(req.context.user.id)
        const { id } = req.params
        const order = await getOrderState(parseInt(id));

        if (!isAdmin && order?.userId != idUser) {
            sendJSONResponse(res, 403, "Cannot access that order state (permission denied)")
            return;
        }
        const readyToBeCookedState = 2;
        const newState = await updateOrderState(parseInt(id), readyToBeCookedState)
        sendJSONResponse(res, 200, {
            orderId: id,
            state: newState.orderState.state,
        })
    } catch (err) {
        console.log(err)
        sendJSONResponse(res, 500)
    }
}))

orderRouter.patch('/admin/update', authenticatedRoute(async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.context?.user?.admin) {
            sendJSONResponse(res, 403, "Admin access required")
            return;
        }
        const { id, state } = req.body;
        const updatedOrder = await updateOrderState(parseInt(id), parseInt(state));
        sendJSONResponse(res, 200, { updatedOrder })
    } catch (err) {
        sendJSONResponse(res, 500)
        console.log(err);
    }
}))