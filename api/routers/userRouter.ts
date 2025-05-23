import express from 'express';
import { Request, Response } from 'express';
import { getUserById, getAllUser, postUser } from '../services/userService';
import { error } from 'console';
import { sendJSONResponse } from '../utils/response';
import { send } from 'process';
import { postAddress } from '../services/addressService';
export const userRouter = express.Router();


userRouter.get('/admin/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await getUserById(parseInt(id));
        if (!user){
            sendJSONResponse(res, 404, "User not found")
        }
        sendJSONResponse(res, 200, {user})
    } catch(err) {
        console.log(err)
        sendJSONResponse(res, 500)
    }
})

userRouter.get('/admin', async (req, res) => {
    try {
        const users = await getAllUser();
        sendJSONResponse(res, 200, {users})
    } catch(err) {
        console.log(err)
        sendJSONResponse(res, 500)
    }
})

userRouter.post('/post', async (req, res) => {
    try {
        const { name , mail, phoneNumber, password, province, city, street, number, otherDetails }  = req.body
        if (!name || !mail || !phoneNumber || !password || !province || !city || !street || !number || !otherDetails){
            sendJSONResponse(res, 400, "Bad Request")
        }
        const newAdress = await postAddress(province, city, street, number, otherDetails)
        const newUser = await postUser(name,mail,phoneNumber,password, newAdress.id);
        sendJSONResponse(res, 200, {newUser: newUser})
    } catch(err) {
        console.log(err)
        sendJSONResponse(res, 500)
    }
})