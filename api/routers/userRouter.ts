import express from 'express';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { getUserById, getAllUser, postUser, loginUser } from '../services/userService';
import { sendJSONResponse } from '../utils/response';
import { postAddress } from '../services/addressService';
import { generateToken } from '../utils/jwtToken';
import { checkUserIsAdmin } from '../services/authService';
import { authMiddleware, authenticatedRoute, AuthenticatedRequest } from './authRouter';
export const userRouter = express.Router();

userRouter.use('/admin', authMiddleware)

userRouter.get('/admin/:id', authenticatedRoute(async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.context?.user?.admin) {
            
            sendJSONResponse(res, 403, "Admin access required")
            return;
        }

        const { id } = req.params
        const user = await getUserById(parseInt(id));

        if (!user) {
            sendJSONResponse(res, 404, "User not found")
            return;
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
            sendJSONResponse(res, 403, "Admin access required")
            return;
        }

        const users = await getAllUser();
        sendJSONResponse(res, 200, { users })
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
            return;
        }
        const newAdress = await postAddress(province, city, street, number, otherDetails)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await postUser(name, mail, phoneNumber, hashedPassword, newAdress.id);
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
            sendJSONResponse(res, 400, { message: "Email and password are required" });
            return;
        }

        
        const user = await loginUser(mail);

        
       

        if (!user) {
            sendJSONResponse(res, 401, { message: "Invalid credentials" });
            return;
        }

        const passwordMatches = await bcrypt.compare(password, user.password); 

        if (!passwordMatches) {
            sendJSONResponse(res, 401, { message: "Invalid credentials" });
            return;
        }
        const isAdmin = await checkUserIsAdmin(user.id);
        const token = generateToken(user.id, isAdmin);

        sendJSONResponse(res, 200, {
            token: token,
            user: {id: user.id, name: user.name}
        });
        return;

    } catch (err) {
        console.error('Login error:', err);
        sendJSONResponse(res, 500, { message: "Internal server error" });
        return;
    }
});