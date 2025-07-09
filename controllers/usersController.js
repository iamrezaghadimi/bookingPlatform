const {User, validateUser} = require('../models/User')
const {createSession} = require("../middlewares/session")
const { ValidationError, BadRequestError, AuthError, NotFoundError } = require('../utils/errors');

const signUp = async (req, res) => {
    const {error} = validateUser(req.body, req.method)
    if(error) throw new ValidationError(error.details)

     console.log(req.body);   
    let user = await User.findOne({email: req.body.email})
    if(error) throw new BadRequestError('User already registered!')

    user = new User(req.body)
    await user.save()
    await createSession(req, user)
    return res.json({ message: "User registered successfully", user})

};

const signIn = async (req, res) => {
    const {email, password} = req.body

    let user = await User.findOne({email: email})
    if(!user) throw new AuthError('Invalid email or password!')
    
    const validPassword = await user.comparePassword(password)
    if(!validPassword) throw new AuthError('Invalid email or password!')

    await createSession(req, user)
    return res.json({ message: "User logged in successfull", user})       
};

const signOut = (req, res) => {
    if(!req.session) throw new AuthError('No active session.')
    req.session.destroy(err => {
        if(err) throw new AuthError('Failed to destroy the session')
        res.clearCookie("connect.sid",{
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        })
        res.json({message: "Signed out successfully!"});
    })
}


const updateUser= async (req, res) => {
    const {error} = validateUser(req.body, req.method)
    if(error) throw new ValidationError(error.details)

    const user = await User.findById(req.session.userId)
    if(!user) throw new NotFoundError('User not found.')

    const {name, email, password, roles} = req.body
    if(email){
        let check = await User.findOne({email})
        if(check) throw new BadRequestError('Email already taken.')
        user.email = email
    }
    if(name) user.name = name
    if(password) user.password = password
    if(roles) user.roles = roles

    await user.save()
    return res.json({message: "User updated successfully!", user});
}

const deleteUser = async (req, res) => {

    const user = await User.findByIdAndDelete(req.session.userId)
    if(!user) throw new NotFoundError('User not found.')
    return signOut(req, res)    
}

module.exports = {
    signUp,
    signIn,
    signOut,
    updateUser,
    deleteUser
}
