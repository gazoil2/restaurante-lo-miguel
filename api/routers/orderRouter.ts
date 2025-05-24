import express from "express";
import { addOrderDetail, getAllOrders, getOrderById, getOrderDetails, getOrderState, postOrder, updateOrderState } from "../services/orderService";
import { Request, Response} from 'express';
import { getHeaderUserId, isRequestUserAdmin } from "../utils/checkAdmin"
import { sendJSONResponse } from '../utils/response';
import { checkUserIsAdmin } from "../services/authService";
import { getUserById } from "../services/userService";
export const orderRouter = express.Router();

orderRouter.get('/', async (req: Request, res: Response) => {
    try {
        const isAdmin = await isRequestUserAdmin(req, res);
        //if (!isAdmin) return;

        console.log("oye bro")
        const orders = await getAllOrders();

        sendJSONResponse(res, 200, {orders})
    } catch(e) {
        console.log("Error: ", e);

        sendJSONResponse(res, 500)
    }
})

orderRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const isAdmin = await isRequestUserAdmin(req);

        const { id } = req.params
        const idUser = getHeaderUserId(req)
        const details = await getOrderDetails(parseInt(id));
        const orderheader = await getOrderById(parseInt(id));

        if (!isAdmin && orderheader?.userId != idUser) {
            sendJSONResponse(res, 403, "Cannot access that order (permission denied)");

            return;
        };

        sendJSONResponse(res, 200, {header: orderheader, details: details})
    } catch(e) {
        console.log(e);
        sendJSONResponse(res, 500);
    }
})

orderRouter.post('/post', async (req : Request, res: Response) => {
    try {

        const idUser = getHeaderUserId(req);
        if (!idUser) return;

        const userData = await getUserById(idUser);
        if (!userData?.addressId) {
            sendJSONResponse(res, 500);
            return;
        }

        const newOrder = await postOrder(idUser, userData?.addressId);

        sendJSONResponse(res, 200, {newOrder})
    } catch(err) {
        sendJSONResponse(res, 500)
        console.log(err);
    }
})

orderRouter.post('/add-detail', async (req: Request, res: Response) => {
    try {

        const isAdmin = await isRequestUserAdmin(req);
        const idUser = getHeaderUserId(req)
        const { orderHeaderId, dishId, amount } = req.body
        const orderHeaderData = await getOrderById(parseInt(orderHeaderId))
        if (!isAdmin && orderHeaderData?.userId != idUser) {
            sendJSONResponse(res, 403, "Cannot modify that order (permission denied)")
            return;
        }
        
        const newOrderDetail = await addOrderDetail(parseInt(orderHeaderId), parseInt(dishId), parseInt(amount));

        sendJSONResponse(res, 200, {newOrderDetail})

    } catch(err) {
        sendJSONResponse(res, 500)
        console.log(err)
    }
})

orderRouter.get('/state/:id', async(req: Request, res: Response) => {
    try {
        const isAdmin = await isRequestUserAdmin(req)
        const idUser = getHeaderUserId(req)
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
    } catch(err) {
        console.log(err)
        sendJSONResponse(res, 500)
    }
})

orderRouter.patch('/update', async(req: Request, res: Response) => {
    try {
        const isAdmin = await isRequestUserAdmin(req, res);
        if (!isAdmin) return;
        const { id, state } = req.body;

        console.log(id, state);
        const updatedOrder = await updateOrderState(parseInt(id), parseInt(state));
        sendJSONResponse(res, 200, {updatedOrder})
    } catch(err) {
        sendJSONResponse(res, 500)
        console.log(err);
    }
})