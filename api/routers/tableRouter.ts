import express from 'express';
import { Request, Response } from 'express';
import { getAllTables, getAvailableTables, postTable, updateStateTable } from '../services/tableService';
import { isRequestUserAdmin } from '../utils/checkAdmin';
import { error } from 'console';
export const tableRouter = express.Router();

tableRouter.get("/", async (req: Request, res: Response) => {
    try {
        const availableTables = await getAvailableTables();
        res.status(200).json({ Tables: availableTables });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

tableRouter.get("/admin", async (req: Request, res: Response) => {
    try {
        const isAdmin = await isRequestUserAdmin(req,res)
        if (!isAdmin) return;

        const allTables = await getAllTables();
        res.status(200).json({ Tables: allTables });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
  
tableRouter.post("/post", async(req: Request,res: Response) => {
    try{
        const isAdmin = await isRequestUserAdmin(req,res)
        if (!isAdmin) return;

        const tableSize = req.body.size
        if (!tableSize){
            res.status(401).json({error: "Formato de request equivocado."})
            return;
        }
        const newTable = await postTable(tableSize)
        res.status(200).json({"Created Table": newTable})
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

tableRouter.patch("/update", async(req: Request,res: Response) => {
    try{
        const isAdmin = await isRequestUserAdmin(req,res)
        if (!isAdmin) return;

        const tableId = req.body.tableId
        const tableStateId = req.body.tableStateId 
        if (!tableId || !tableStateId){
            res.status(401).json("Formato de request equivocado.")
            return;
        }

        await updateStateTable(tableId, tableStateId)
        res.status(200).json("Actualizado correctamente.")
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
})