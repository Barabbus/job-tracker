import express from 'express'
import { register, login, updateUser } from '../controllers/authController.js'
import authenticateUser from '../middleware/auth.js'

// Rate-limiting middleware for Express used to limit repeated requests to public APIs and/or endpoints
import rateLimiter from 'express-rate-limit'

const router = express.Router()

const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,  // Limit each IP to 10 requests per window (15 minutesh)
    message: 'Too many requests from this IP, please try again after 15 minutes',
})

router.route("/register").post(apiLimiter, register)
router.route("/login").post(apiLimiter, login)
router.route("/updateUser").patch(authenticateUser, updateUser)

export default router