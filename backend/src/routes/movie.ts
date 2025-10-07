import express from 'express'
import { PrismaClient } from '@prisma/client';
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
movieRouter.post("/add", async (req, res) => {
    try {
        const movie = req.body.movie;
        const ratings = req.body.ratings;
        const review = req.body.review;

        const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie?query=${movie}`, {
                headers : {
                    Authorization : 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMmZkODk1YjlkMmM1OTJmN2ViMjg1NjQ2MDM0ZTgyNSIsIm5iZiI6MTc0NTExMjQxNi44OTYsInN1YiI6IjY4MDQ0ZDYwZTUwNmE4ZTNhMGFkOWE1YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BjlHn-15eO-NFw3nZRW90Bl0tz_mWeoOMzDCiBCDzO4'
                }
            }
        )
        res.json(response.data.results)
        await client.movie.create({
            data : {
                title : movie,
                reviews : review,
                ratings : ratings
            }
        })
    } catch {
        res.status(403).json({
            message : 'Error Finding Movie'
        })
    }
})
export default movieRouter