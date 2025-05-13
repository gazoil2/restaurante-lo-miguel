import express from 'express';
import { getAvailableTables } from '../services/tableService';
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
 *                       mesaStateId:
 *                         type: integer
 *                       state:
 *                         type: string
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