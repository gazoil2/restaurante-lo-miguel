import express from 'express';
import { getAvailableTables, updateStateTable } from '../services/tableService';
import { table } from 'console';
import { checkUserIsAdmin } from '../services/authService';
import { updateDishState, getMenu } from '../services/dishService';
import { request } from '../utils/types';
export const dishRouter = express.Router();

dishRouter.get('/', async (req: request, res) => {
    try {
        const menu = await getMenu();

        res.status(200);
        res.json({"Menu": menu}); 
    } catch(err) {
        res.status(500).json({error: "Internal server error"});
        console.log(err);
    }
})
