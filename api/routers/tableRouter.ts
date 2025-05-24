import express, { NextFunction } from 'express';
import { Request, Response, RequestHandler } from 'express';
import { getAllTables, getAvailableTables, postTable, reserveTable, updateStateTable } from '../services/tableService';
import { error } from 'console';
import { sendJSONResponse } from '../utils/response';
import { send } from 'process';
import { AuthenticatedRequest, authenticatedRoute, authMiddleware } from './authRouter';
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

tableRouter.use("/admin", authMiddleware);


tableRouter.get("/admin", authenticatedRoute(async (req: AuthenticatedRequest, res: Response) => {
    try {

        if (!req.context?.user?.admin) {
            res.status(403).json({ error: 'Admin access required' });
            return;
        }

        const allTables = await getAllTables();
        sendJSONResponse(res, 200, { Tables: allTables });
    } catch (error) {
        console.error(error);
        sendJSONResponse(res, 500);
    }
}));

tableRouter.patch("/reserve", async (req: Request, res: Response) => {
    try {
        const tableId = req.body.tableId
        if (!tableId) {
            sendJSONResponse(res, 400, "Formato de update equivocado.")
            return;
        }
        await reserveTable(tableId)
        sendJSONResponse(res, 200, { "table": "Reservada correctamente" })
    } catch (err) {
        console.error(err);
        sendJSONResponse(res, 500)
    }
});

tableRouter.patch("/admin/update", authenticatedRoute(async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.context?.user?.admin) {
            res.status(403).json({ error: 'Admin access required' });
            return;
        }

        const tableId = req.body.tableId
        const tableStateId = req.body.tableStateId
        if (!tableId || !tableStateId) {
            sendJSONResponse(res, 400, "Formato de update equivocado.")
            return;
        }

        await updateStateTable(tableId, tableStateId)
        sendJSONResponse(res, 200, { "table": "updated" })
    } catch (err) {
        console.error(err);
        sendJSONResponse(res, 500)
    }
}));