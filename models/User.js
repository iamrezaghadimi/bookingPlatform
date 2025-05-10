const Joi = require('joi')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    roles: {type: [String], default:[]},
})


userSchema.pre('save', async function (next){
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS))
        this.password = await bcrypt.hash(this.password + process.env.PEPPER, salt)
    }
})

userSchema.set('toJSON', {
    transform: function (doc, ret){
        delete ret.password
        return ret
    }
})

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password + process.env.PEPPER, this.password)
}

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({_id: this._id, roles: this.roles}, process.env.JWT_SECRET)
}


const User = mongoose.model("User", userSchema)


const validateUser = (data, method) => {
    const optionalSchema = Joi.object({
        name: Joi.string().max(100),
        email: Joi.string().email().max(50),
        password: Joi.string().min(6),
        roles: Joi.array().items(Joi.string())
    })

    const requiredSchema = Joi.object({
        name: optionalSchema.name.required(),
        email: optionalSchema.email.required(),
        password: optionalSchema.password.required(),
        roles: optionalSchema.roles
    })    

    schema = (method === 'PATCH') ? optionalSchema : requiredSchema
    return schema.validate(data)
}

module.exports = {User, validateUser}


// Password: "hello123" → Hash: "5d41402abc4b2a76b9719d911017c592"
// abfg + hello123 + he12 -> hashed
// jhgf + reza1234 + he12 -> hashed
// salt + password + pepper

