const {User, validateUser} = require('../models/User')

const signUp = async (req, res) => {
    const {error} = validateUser(req.body, req.method)
    if(error) return res.status(400).json({error: error.details})

    let user = await User.findOne({email: req.body.email})
    if(user) return res.status(400).json({ error: 'User already registered!'})


    try {
        const user = new User(req.body)
        await user.save()
        return res.header('x-auth-token', user.generateAuthToken()).json({ message: "User registered successfully", user})
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
        return res.header('x-auth-token', user.generateAuthToken()).json({ message: "User logged in successfully", user})
    } catch (error) {
        return res.status(500).json({error: "Failed to register the user."})
    }
};

