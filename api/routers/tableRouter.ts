import express from 'express';
import { Request, Response } from 'express';
import { getAllTables, getAvailableTables, updateStateTable } from '../services/tableService';
import { checkUserIsAdmin } from '../services/authService';
import { isRequestUserAdmin } from '../utils/checkAdmin';
export const tableRouter = express.Router();

/**
 * @swagger
 * /tables:
 *   get:
 *     summary: Obtiene todas las mesas disponibles
 *     description: Este endpoint devuelve todas las mesas que están en estado "Libre".
 *     responses:
 *       200:
 *         description: Lista de mesas disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Tables:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       Size:
 *                         type: integer
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

tableRouter.get("/", async (req: Request, res: Response) => {
    try {
        const availableTables = await getAvailableTables();
        res.status(200).json({ Tables: availableTables });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
        return;
    }
});

tableRouter.get("/admin", async (req: Request, res: Response) => {
    try {
        const isAdmin = await isRequestUserAdmin(req,res)
        if (!isAdmin) return;

        const allTables = await getAllTables();
        res.status(200).json({ Tables: allTables });
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
        return;
    }
});
  

tableRouter.get("/update", async(req: Request,res: Response) => {
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