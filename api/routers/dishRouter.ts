import express from 'express';
import { updateDishState, getMenu, getAdminMenu, postDish } from '../services/dishService';
import { Request, Response } from 'express';
import { isRequestUserAdmin } from '../utils/checkAdmin';
export const dishRouter = express.Router();

dishRouter.get('/', async (req : Request, res : Response) => {
    try {
        const menu = await getMenu();
        res.status(200);
        res.json({"Menu": menu}); 
    } catch(err) {
        res.status(500).json({error: "Internal server error"});
        console.log(err);
    }
})

dishRouter.get('/admin', async (req : Request, res: Response) => {
    try{
        const isAdmin = await isRequestUserAdmin(req,res)
        if (!isAdmin) return;
        const menu = await getAdminMenu();
        res.status(200);
        res.json({"Menu": menu}); 
    } catch(err){
        res.status(500).json({error: "Internal server error"});
        console.log(err)
    }
})


dishRouter.post('/post', async (req : Request, res: Response) => {
    try{
        const isAdmin = await isRequestUserAdmin(req,res)
        if (!isAdmin) return;
        const name: string | undefined = req.body.name
        const desc: string | undefined = req.body.desc
        const price : number | undefined = parseFloat(req.body.price)
        const categoryId : number | undefined = req.body.categoryId
        const dishStateId : number | undefined = req.body.dishStateId
        if (!name || !desc || !price || !categoryId || !dishStateId){
            res.status(401).json("Formato de request equivocado.")
            return;
        }
        const newDish = await postDish(name, desc, price, categoryId, dishStateId);
        res.status(200).json({"Created Dish": newDish});
    } catch(err){
        res.status(500).json({error: "Internal server error"});
        console.log(err)
    }
})


dishRouter.patch('/update', async (req : Request, res: Response) => {
    try{
        const isAdmin = await isRequestUserAdmin(req,res)
        if (!isAdmin) return;
        const dishId = req.body.dishId
        const dishStateId = req.body.dishStateId 
        if (!dishId || !dishStateId){
            res.status(401).json("Formato de request equivocado.")
            return;
        }

        await updateDishState(dishId, dishStateId)
        res.status(200).json("Actualizado correctamente.")
    } catch(err){
        res.status(500).json({error: "Internal server error"});
        console.log(err)
    }
})