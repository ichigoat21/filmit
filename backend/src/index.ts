import express from "express"
import userRouter from "./routes/auth"
import movieRouter from "./routes/movie"

const app = express()

app.use(express.json())
app.use('/users', userRouter)
app.use('/m', movieRouter)

app.listen(3000, ()=> {
    console.log("Server has Started")
})

