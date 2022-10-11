import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide full name"],
        minlength: 3,
        maxlength: 40,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email"
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: 6,
        select: false
    },    
    location: {
        type: String,        
        maxlength: 20,
        trim: true,
        default: "my city"
    },
})

// Mongoose middleware
// Note:  Using 'this' allows us to access the document and its fields

// Note: this middleware is only triggered when we create or save a user
UserSchema.pre('save', async function () {
    // console.log(this.modifiedPaths())
    // console.log(this.isModified('name'))

    // V Imp: if password has been modified, a new hashed
    // password will be created.  If not, we simply return.
    // Similarly, if any other field has been modified (eg name) we return.
    
    if (!this.isModified("password")) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Create JSON web token
UserSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
}

// Compare user login password with password in DB
UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

export default mongoose.model("User", UserSchema)