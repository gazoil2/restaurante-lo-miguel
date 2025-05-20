import express from "express";
import { addOrderDetail, getAllOrders, getOrderById, getOrderDetails, getOrderState, postOrder, updateOrderState } from "../services/orderService";
import { Request, Response} from 'express';
import { isRequestUserAdmin } from "../utils/checkAdmin"
import { sendJSONResponse } from '../utils/response';
export const orderRouter = express.Router();

/*
 *@swagger
 *paths:
 *  /orders:
 *      get:
 *          summary: Get a user by ID
 *
*/


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

orderRouter.get('/:id', async (req, res) => {
    try {
        const isAdmin = await isRequestUserAdmin(req, res);
        if (!isAdmin) return;

        const { id } = req.params
        const details = await getOrderDetails(parseInt(id));
        const orderheader = await getOrderById(parseInt(id));

        sendJSONResponse(res, 200, {header: orderheader, details: details})
    } catch(e) {
        console.log(e);
        sendJSONResponse(res, 500);
    }
})

orderRouter.post('/post', async (req, res) => {
    try {
        const isAdmin = await isRequestUserAdmin(req, res);
        if (!isAdmin) return;

        const { user, address } = req.body

        const newOrder = await postOrder(parseInt(user), parseInt(address));

        sendJSONResponse(res, 200, {newOrder})
    } catch(err) {
        sendJSONResponse(res, 500)
        console.log(err);
    }
})

orderRouter.post('/add-detail', async (req, res) => {
    try {
        const isAdmin = isRequestUserAdmin(req, res);
        if (!isAdmin) return;

        const { orderHeaderId, dishId, amount } = req.body
        const newOrderDetail = await addOrderDetail(parseInt(orderHeaderId), parseInt(dishId), parseInt(amount));

        sendJSONResponse(res, 200, {newOrderDetail})

    } catch(err) {
        sendJSONResponse(res, 500)
        console.log(err)
    }
})

orderRouter.get('/state/:id', async(req, res) => {
    try {
        const {id} = req.params
        const order = await getOrderState(parseInt(id));

        sendJSONResponse(res, 200, {
            orderId: id,
            state: order?.orderState.state,
        })
    } catch(err) {
        console.log(err)
        sendJSONResponse(res, 500)
    }
})

orderRouter.patch('/update', async(req, res) => {
    try {
        const { id, state } = req.body;

        console.log(id, state);
        const updatedOrder = await updateOrderState(parseInt(id), parseInt(state));
        sendJSONResponse(res, 200, {updatedOrder})
    } catch(err) {
        sendJSONResponse(res, 500)
        console.log(err);
    }
})