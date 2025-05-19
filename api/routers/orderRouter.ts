import express from "express";
import { getAllOrders, getOrderById, getOrderDetails } from "../services/orderService";
import { Request, Response} from 'express';
export const orderRouter = express.Router();

orderRouter.get('/', async (req: Request, res: Response) => {
    try {
        const orders = await getAllOrders();

        res.status(200).json({Orders: orders});
    } catch(e) {
        console.log("Error: ", e);

        res.status(500).json({error: "Internal server error"});
    }
})

orderRouter.get('/:id', async (req, res) => {
    try {
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