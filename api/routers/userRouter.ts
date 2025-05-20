import express from 'express';
import { Request, Response } from 'express';
import { getUserById, getAllUser, postUser } from '../services/userService';
import { error } from 'console';
export const userRouter = express.Router();


userRouter.get('/admin/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await getUserById(parseInt(id));
        if (!user){
            res.status(404).json({error: "User not Found"})
        }
        res.status(200).json({user: user})
    } catch(err) {
        console.log(err)
        res.status(500).json({error: "Internal server error."})
    }
})

userRouter.get('/admin', async (req, res) => {
    try {
        const users = await getAllUser();
        res.status(200).json({users: users})
    } catch(err) {
        console.log(err)
        res.status(500).json({error: "Internal server error."})
    }
})

userRouter.post('/post', async (req, res) => {
    try {
        const { name , mail, phoneNumber, password, addressId }  = req.body
        if (!name || !mail || !phoneNumber || !password || !addressId){
            res.status(401).json({error: "Bad Request"})
        }
        const newUser = await postUser(name,mail,phoneNumber,password, addressId);
        res.status(200).json({newUser: newUser})
    } catch(err) {
        console.log(err)
        res.status(500).json({error: "Internal server error."})
    }
})