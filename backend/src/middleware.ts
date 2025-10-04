import { NextFunction, Request } from "express"
import { Response } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from "./config";


export const userMiddleware = async (req : Request,res : Response, next : NextFunction)  => {
    try {
    const headers = req.headers['authorization'];
    const decoded = jwt.verify(headers as string, JWT_SECRET)
    if (decoded){
        req.id = (decoded as JwtPayload).id
        next()
    }} catch {
        res.json({
            message : 'Authorization Failed'
        })
    }
}