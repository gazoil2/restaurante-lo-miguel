import express from 'express';
import { Request, Response } from 'express';
import { getAllTables, getAvailableTables, postTable, reserveTable, updateStateTable } from '../services/tableService';
import { isRequestUserAdmin } from '../utils/checkAdmin';
import { error } from 'console';
import { sendJSONResponse } from '../utils/response';
import { send } from 'process';
import { authMiddleware } from './authRouter';
export const tableRouter = express.Router();

tableRouter.get("/", async (req: Request, res: Response) => {
    try {
        const availableTables = await getAvailableTables();
        sendJSONResponse(res, 200, { Tables: availableTables })
    } catch (error) {
        console.error(error);
        sendJSONResponse(res, 500)
    }
});

tableRouter.use("/admin", (req,res, next) => {
    authMiddleware(req,res,next)
})

tableRouter.get("/admin", async (req: Request, res: Response) => {
    try {
        const isAdmin = await isRequestUserAdmin(req,res)
        if (!isAdmin) return;

        const allTables = await getAllTables();

        sendJSONResponse(res, 200, { Tables: allTables })

    } catch (error) {
        console.error(error);
        sendJSONResponse(res, 500)
    }
});

tableRouter.post("/post", async(req: Request,res: Response) => {
    try{
        const isAdmin = await isRequestUserAdmin(req,res)
        if (!isAdmin) return;

        const tableSize = req.body.size
        if (!tableSize){
            sendJSONResponse(res, 400, "Formato de post equivocado.")
            return;
        }
        const newTable = await postTable(tableSize)
        sendJSONResponse(res, 200, { "Created Table": newTable })
    } catch (err) {
        console.error(err);
        sendJSONResponse(res, 500)
    }
})

tableRouter.patch("/reserve", async(req: Request,res: Response) => {
    try{
        const tableId = req.body.tableId
        if (!tableId){
            sendJSONResponse(res, 400, "Formato de update equivocado.")
            return;
        }
        await reserveTable(tableId)
        sendJSONResponse(res, 200, {"table": "Reservada correctamente"})
    } catch (err) {
        console.error(err);
        sendJSONResponse(res, 500)
    }
})

tableRouter.patch("/admin/update", async(req: Request,res: Response) => {
    try{
        const isAdmin = await isRequestUserAdmin(req,res)
        if (!isAdmin) return;

        const tableId = req.body.tableId
        const tableStateId = req.body.tableStateId 
        if (!tableId || !tableStateId){
            sendJSONResponse(res, 400, "Formato de update equivocado.")
            return;
        }

        await updateStateTable(tableId, tableStateId)
        sendJSONResponse(res, 200, {"table": "updated"})
    } catch (err) {
        console.error(err);
        sendJSONResponse(res, 500)
    }
})