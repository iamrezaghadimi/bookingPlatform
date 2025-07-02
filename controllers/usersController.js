const {User, validateUser} = require('../models/User')
const {createSession} = require("../middlewares/session")

const signUp = async (req, res) => {
    const {error} = validateUser(req.body, req.method)
    if(error) return res.status(400).json({error: error.details})

     console.log(req.body);   
    let user = await User.findOne({email: req.body.email})
    if(user) return res.status(400).json({ error: 'User already registered!'})


    try {
        const user = new User(req.body)
        await user.save()

        await createSession(req, user)
        return res.json({ message: "User registered successfully", user})
        // return res.header('x-auth-token', user.generateAuthToken()).json({ message: "User registered successfully", user})
    } catch (error) {
        return res.status(500).json({error: "Failed to register the user."})
    }
};

const signIn = async (req, res) => {
    const {email, password} = req.body

    let user = await User.findOne({email: email})
    if(!user) return res.status(400).json({ error: 'Invalid email or password!'})    
    
    const validPassword = await user.comparePassword(password)
    if(!validPassword) return res.status(400).json({ error: 'Invalid email or password!'})   

    try {
        await createSession(req, user)
        return res.json({ message: "User logged in successfull", user})       
        // return res.header('x-auth-token', user.generateAuthToken()).json({ message: "User logged in successfully", user})
    } catch (error) {
        return res.status(500).json({error: "Failed to register the user."})
    }
};

const signOut = (req, res) => {
    if(!req.session) return res.status(401).json({error: 'No active session.'})
    req.session.destroy(err => {
        if(err) return res.status(500).json({error: 'Failed to destroy the session'})
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
    if(error) return res.status(400).json({error: error.details})

    const user = await User.findById(req.session.userId)
    if(!user) return res.status(404).json({error: 'User not found.'})

    const {name, email, password, roles} = req.body
    if(email){
        let check = await User.findOne({email})
        if(check) return res.status(400).json({error: 'Email already taken.'})
        user.email = email
    }
    if(name) user.name = name
    if(password) user.password = password
    if(roles) user.roles = roles

    await user.save()
    return res.json({message: "User updated successfully!", user});
}

const deleteUser = async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.session.userId)
        if(!user) return res.status(404).json({error: 'User not found.'})
        return signOut(req, res)    
    } 
    catch(err){
        return res.status(500).json({error: "Failed to delete the user."})
    }
}

module.exports = {
    signUp,
    signIn,
    signOut,
    updateUser,
    deleteUser
}
