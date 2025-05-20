import { Response } from "express";

export const sendJSONResponse = (res: Response, status: number, data?: string | {}) => {
    if (status === 200) {
        res.status(200).json({
            "status": "success",
            "data": data,
        })
    } else {
        res.status(status).json({
            "status": "fail",
            "data": data ? {error: data} : {
                error: "Internal server error",
            },
        })
    }
}