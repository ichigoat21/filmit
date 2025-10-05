import express from 'express'
import { Prisma, PrismaClient } from '@prisma/client';
import axios from 'axios'


const movieRouter = express.Router()
const client = new PrismaClient()


movieRouter.get('/movies', async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=e2fd895b9d2c592f7eb285646034e825&language=en-US&page=1`
        )
        res.json(response.data.results)
    } catch (e){
        res.status(200).json({
            message : 'Failed Fetching Movies'
        })
    }
})

export default movieRouter