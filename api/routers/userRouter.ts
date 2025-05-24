import express from 'express';
import { Request, Response } from 'express';
import { getUserById, getAllUser, postUser, loginUser } from '../services/userService';
import { sendJSONResponse } from '../utils/response';
import { postAddress } from '../services/addressService';
import { generateToken } from '../utils/jwtToken';
import { checkUserIsAdmin } from '../services/authService';
import { authMiddleware, authenticatedRoute, AuthenticatedRequest } from './authRouter';
export const userRouter = express.Router();

userRouter.use('', authMiddleware)

userRouter.get('/admin/:id', authenticatedRoute(async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.context?.user?.admin) {
            res.status(403).json({ error: 'Admin access required' });
            return;
        }

        const { id } = req.params
        const user = await getUserById(parseInt(id));

        if (!user) {
            sendJSONResponse(res, 404, "User not found")
        }
        sendJSONResponse(res, 200, { user })
    } catch (err) {
        console.log(err)
        sendJSONResponse(res, 500)
    }
}))

userRouter.get('/admin', authenticatedRoute(async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.context?.user?.admin) {
            res.status(403).json({ error: 'Admin access required' });
            return;
        }

        const users = await getAllUser();
        console.log("corales")
        sendJSONResponse(res, 200, { users })
        console.log("corales")
    } catch (err) {
        console.log(err)
        sendJSONResponse(res, 500)
    }
}))

userRouter.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, mail, phoneNumber, password, province, city, street, number, otherDetails } = req.body
        if (!name || !mail || !phoneNumber || !password || !province || !city || !street || !number || !otherDetails) {
            sendJSONResponse(res, 400, "Bad Request")
        }
        const newAdress = await postAddress(province, city, street, number, otherDetails)
        const newUser = await postUser(name, mail, phoneNumber, password, newAdress.id);
        sendJSONResponse(res, 200, { newUser: newUser })
    } catch (err) {
        console.log(err)
        sendJSONResponse(res, 500)
    }
})

userRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const { mail, password } = req.body;

        if (!mail || !password) {
            return sendJSONResponse(res, 400, { message: "Email and password are required" });
        }

        const user = await loginUser(mail, password);

        if (!user?.id) {
            return sendJSONResponse(res, 401, { message: "Invalid credentials" });
        }
        const isAdmin = await checkUserIsAdmin(user.id);
        const token = generateToken(user.id, isAdmin);

        return sendJSONResponse(res, 200, {
            token: token,
            user: user
        });

    } catch (err) {
        console.error('Login error:', err);
        return sendJSONResponse(res, 500, { message: "Internal server error" });
    }
});