import express from "express";
import { addOrderDetail, getAllOrders, getOrderById, getOrderDetails, postOrder, updateOrderState } from "../services/orderService";
import { Request, Response} from 'express';
import { isRequestUserAdmin } from "../utils/checkAdmin"
import { parse } from "path";
export const orderRouter = express.Router();

orderRouter.get('/', async (req: Request, res: Response) => {
    try {
        const isAdmin = await isRequestUserAdmin(req, res);
        if (!isAdmin) return;

        const orders = await getAllOrders();

        res.status(200).json({Orders: orders});
    } catch(e) {
        console.log("Error: ", e);

        res.status(500).json({error: "Internal server error"});
    }
})

orderRouter.get('/:id', async (req, res) => {
    try {
        const isAdmin = await isRequestUserAdmin(req, res);
        if (!isAdmin) return;

        const { id } = req.params
        const details = await getOrderDetails(parseInt(id));
        const orderheader = await getOrderById(parseInt(id));

        res.status(200).json({
            header: orderheader,
            details: details
        })
    } catch(e) {
        console.log(e);
        res.status(500).json({error: "Internal server error"})
    }
})

orderRouter.post('/post', async (req, res) => {
    try {
        const isAdmin = await isRequestUserAdmin(req, res);
        if (!isAdmin) return;
        
        const { user, address } = req.body

        const newOrder = await postOrder(parseInt(user), parseInt(address));

        res.status(200).json({
            newOrder
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
})

orderRouter.post('/add-detail', async (req, res) => {
    try {
        const isAdmin = isRequestUserAdmin(req, res);
        if (!isAdmin) return;

        const { orderHeaderId, dishId, amount } = req.body
        const newOrderDetail = await addOrderDetail(parseInt(orderHeaderId), parseInt(dishId), parseInt(amount));

        res.status(200).json({
            newOrderDetail
        })

    } catch(err) {
        console.log(err)

    }
})

orderRouter.patch('/update', async(req, res) => {
    try {
        const { id, state } = req.body;

        console.log(id, state);
        const updatedOrder = await updateOrderState(parseInt(id), parseInt(state));
        res.status(200).json({
            updatedOrder
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"})
    }
})