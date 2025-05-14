import express from 'express';
import { getAvailableTables, updateStateTable } from '../services/tableService';
import { table } from 'console';
import { checkUserIsAdmin } from '../services/authService';
import { updateDishState } from '../services/dishService';
import { request } from '../utils/types';
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
tableRouter.get("/", async (req,res) => {
    try {
        const availableTables = await getAvailableTables();
        res.status(200)
        res.json({"Tables: ": availableTables})
    } catch (error){
        res.status(500).json({error: error});
    }
})

tableRouter.get("/update-table", async(req: request,res) => {
    try{
        const idUser = req.body.idUser
        const tableId = req.body.tableId
        const tableStateId = req.body.tableStateId 
        if (!idUser|| !tableId || !tableStateId){
            res.status(401).json("Formato de request equivocado.")
            return;
        }
        const isAdmin = await checkUserIsAdmin(idUser)
        if (isAdmin){
            await updateStateTable(tableId, tableStateId)
            res.status(200).json("Actualizado correctamente.")
        } else {
            res.status(403).json("Usuario no tiene los permisos para realizar esta accion.")
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
})