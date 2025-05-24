import { Request, Response } from 'express';
import { checkUserIsAdmin } from '../services/authService';

export async function isRequestUserAdmin (req: Request, res?: Response) : Promise<boolean> {

    const idUser = getHeaderUserId(req)
    if (!idUser) {
        if (res) res.status(400).json({error: "Formato de request equivocado. Falta idUser."})
        return false;
    };

    const isAdmin = await checkUserIsAdmin(idUser);
    if (!isAdmin) {
        if (res) res.status(403).json({ error: "Usuario no tiene permisos suficientes para acceder a la ruta" });
        return false;
    }
    return true;
}

export function getHeaderUserId(req: Request) : number | undefined {
    const idUserHeader = req.headers.iduser;
    const idUser = idUserHeader ? parseInt(idUserHeader as string) : undefined;

    return idUser
}