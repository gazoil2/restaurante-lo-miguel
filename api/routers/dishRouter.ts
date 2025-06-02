import express from 'express';
import { updateDishState, getMenu, getAdminMenu, postDish } from '../services/dishService';
import { Request, Response } from 'express';
import { sendJSONResponse } from '../utils/response';
import { AuthenticatedRequest, authenticatedRoute, authMiddleware } from './authRouter';
export const dishRouter = express.Router();


dishRouter.use('/admin', authMiddleware)

dishRouter.get('/', async (req: Request, res: Response) => {
    try {
        const menu = await getMenu();
        sendJSONResponse(res, 200, { menu });
    } catch (err) {
        sendJSONResponse(res, 500);
        console.log(err);
    }
})

dishRouter.get('/admin', authenticatedRoute(async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.context?.user?.admin) {
            sendJSONResponse(res, 403, 'Admin access required' )
            return;
        }
        const menu = await getAdminMenu();
        sendJSONResponse(res, 200, { menu })
    } catch (err) {
        sendJSONResponse(res, 500)
        console.log(err)
    }
}))


dishRouter.post('/admin/post', authenticatedRoute(async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.context?.user?.admin) {
            sendJSONResponse(res, 403, "Admin access required")
            return;
        }
        const name: string | undefined = req.body.name
        const desc: string | undefined = req.body.desc
        const price: number | undefined = parseFloat(req.body.price)
        const categoryId: number | undefined = req.body.categoryId
        const dishStateId: number | undefined = req.body.dishStateId
        if (!name || !desc || !price || !categoryId || !dishStateId) {
            sendJSONResponse(res, 400, "Formato de request equivocado.")
            return;
        }
        const newDish = await postDish(name, desc, price, categoryId, dishStateId);
        sendJSONResponse(res, 200, { "New Dish": newDish })
    } catch (err) {
        sendJSONResponse(res, 500)
        console.log(err)
    }
}))


dishRouter.patch('/admin/update', authenticatedRoute(async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.context?.user?.admin) {
            sendJSONResponse(res, 403, "Admin access required")
            return;
        }
        const dishId = req.body.dishId
        const dishStateId = req.body.dishStateId
        if (!dishId || !dishStateId) {
            sendJSONResponse(res, 400, "Formato de request equivocado.")
            return;
        }

        await updateDishState(dishId, dishStateId)
        sendJSONResponse(res, 200, { "dishId": dishId, "status": "actualizado" })
    } catch (err) {
        sendJSONResponse(res, 500)
        console.log(err)
    }
}))