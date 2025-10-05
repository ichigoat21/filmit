import express from 'express'
import z, { email } from 'zod'
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config'


const userRouter = express.Router()
const client = new PrismaClient()

const User = z.object({
    username : z.string(),
    password : z.string(),
    email : z.email()
})

userRouter.post("/signup", async (req, res) => {
    try {
    const parsedUser = User.safeParse(req.body)
    if (!parsedUser.success){
       res.status(400).json({
        message : 'Incorrect Inputs'
       })
    }
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email

    const hashedPassword = await bcrypt.hash(password, 5)
    
    const userId = await client.user.create({
        data : {
            username : username,
            password : hashedPassword,
            email : email
        }
    })

    res.status(200).json({
        message : "You are Signed Up",
        user : userId.id
    })
    } catch(e) {
     res.status(500).json({
        message : "Something went wrong"
     })
   }
})

userRouter.post("/signup", async (req, res) => {
      try {
          const email = req.body.email
          const password = req.body.password
          const user = await client.user.findFirst({
            where : {
              email : email
            }
          })
          if (!user){
            res.status(403).json({
                message : 'User Not Found'
            })
          }
          if (typeof(user?.password) !== "string"){
            res.status(403).json({
                message : "Bad Request"
            })
            return;
    
          }
          const decoded = await bcrypt.compare(user?.password, password)
          if (!decoded){
            res.status(403).json({
                message : 'Wrong Password'
            })
            return;
          }
          const token =jwt.sign({
            id : user.id
          }, JWT_SECRET)

          res.status(200).json({
            message : 'You are signed in',
            token
          })

      } catch (e){
        res.status(403).json({
            message : "Bad Request"
        })
      }
})

export default userRouter