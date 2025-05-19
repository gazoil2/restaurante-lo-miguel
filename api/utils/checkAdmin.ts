import { Request, Response } from 'express';
import { checkUserIsAdmin } from '../services/authService';

export async function isRequestUserAdmin (req: Request, res: Response) : Promise<boolean> {

    const idUserHeader = req.headers.iduser;
    const idUser = idUserHeader ? parseInt(idUserHeader as string) : undefined;
    if (!idUser) {
        res.status(401).json({error: "Formato de request equivocado. Falta idUser."})
        return false;
    };
    const isAdmin = await checkUserIsAdmin(idUser);
    if (!isAdmin) {                
        res.status(403).json({ error: "Usuario no tiene permisos para ver todas las mesas." });
        return false;
    }
    return true;
}