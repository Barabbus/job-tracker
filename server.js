import express from 'express'
import dotenv from 'dotenv'
import 'express-async-errors'
import morgan from 'morgan'
import connectDB from './db/connect.js'

// Need these to help setup static assets middleware 
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

// Security packages
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'

import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/auth.js'

import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'

const app = express()
dotenv.config()

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"))
}

// Setup up __dirname
const __dirname = dirname(fileURLToPath(import.meta.url))

// Use when ready to deploy - middleware that serves static assets (build folder)
app.use(express.static(path.resolve(__dirname, './client/build'))) 

// Built-in middleware function in Express that parses incoming JSON requests and puts the parsed data in req.body.
app.use(express.json())

// Secures Express App by setting various HTTP headers - secure headers
app.use(helmet())

// Sanitise user input coming from POST body, GET queries and url params - prevent cross-site scripting attacks
app.use(xss())

// Sanitises user supplied data to prevent MongoDB Operator Injection
app.use(mongoSanitize())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", authenticateUser, jobsRouter)

// Use when ready to deploy - needs to come after the routes specified above
// Redirects all other routes to index.html - needed for react router to work
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})

// Middleware

// Look for requests that do not match our current routes
app.use(notFoundMiddleware)

// Picks up all other errors. This middleware needs to be placed last.   
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        })
    } catch (error) {
        console.log(error)    
    }
}

start()