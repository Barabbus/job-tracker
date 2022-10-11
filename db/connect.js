import mongoose from 'mongoose'

// connectDB returns a Promise so need to use async in server.js to connect to DB
const connectDB = (url) => {
    return mongoose.connect(url)
}

export default connectDB