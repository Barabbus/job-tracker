import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'

const register = async (req, res) => {
    const { name, email, password } = req.body
    // Check to ensure name, email and password fields all contain values
    if (!name || !email || !password) {
        throw new BadRequestError("Please provide all values")
    }
    // Check to ensure duplicate email address does not already exist
    const userAlreadyExists = await User.findOne({ email })
    if (userAlreadyExists) {
        throw new BadRequestError("Email already in use")
    }

    const user = await User.create({ name, email, password })
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({
        user: {
            name: user.name,
            email: user.email,            
            location: user.location
        },
        token,
        location: user.location
    })    
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError("Please provide all values")
    }
    const user = await User.findOne({ email }).select("+password")
    // Check for invalid email 
    if (!user) {
        throw new UnAuthenticatedError("Invalid Credentials")
    }
    const isPasswordCorrect = await user.comparePassword(password)
    // Check for invalid password
    if (!isPasswordCorrect) {
        throw new UnAuthenticatedError("Invalid Credentials")
    }
    const token = user.createJWT()
    user.password = undefined  // removes password from user object before returning response 
    res.status(StatusCodes.OK).json({ user, token, location: user.location})
}

const updateUser = async (req, res) => {    
    const { email, name, lastName, location } = req.body
    if (!email || !name || !location) {
        throw new BadRequestError("Please provide all values")
    }
    // we can access userId from req.user.userId which was
    // added using authenticateUser middleware
    const user = await User.findOne({ _id: req.user.userId })

    // Overwrite email, name, lastName, location values in user object from DB with values passed in from form 
    user.email = email
    user.name = name    
    user.location = location

    // Save user to DB
    await user.save()

    // Create new JWT for updated user
    const token = user.createJWT()

    res.status(StatusCodes.OK).json({ user, token, location: user.location })
}

export { register, login, updateUser }