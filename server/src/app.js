import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import apiRouter from './routes/index.js'
import projectRouter from './routes/project.routes.js'
import errorHandler from './middlewares/error.middleware.js'
 const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/api/v1',apiRouter)
app.use('/api/v1/project',projectRouter)

app.use(errorHandler)

export default app