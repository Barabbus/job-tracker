import { StatusCodes } from 'http-status-codes'

const errorHandlerMiddleware = (err, req, res, next) => {
    const defaultError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong. Try again later"
    }
    // Check to ensure all required fields have been filled in and that email is valid 
    if (err.name === "ValidationError") {
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        // defaultError.msg = err.message
        defaultError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(",")
    }
    // Check to ensure data in field is unique. eg. email address is unique
    if (err.code && err.code === 11000) {
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`
    }    
    res.status(defaultError.statusCode).json({msg: defaultError.msg})
}

export default errorHandlerMiddleware