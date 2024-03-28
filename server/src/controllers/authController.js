const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    console.log('Signup request received', req.body);
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch(error) {
        res.status(500).json({ message: "Error creating the user", error: error.message });
    }
};

exports.login = async (req, res) => {
    console.log('Login request received', req.body);
    try {
        const user = await User.findOne({ email: req.body.email });
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }

        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (!isValid){
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Logged in successfully",
            token: token,
            userId: user._id
        });
    } catch(error) {
        res.status(500).json({ message: "Error logging in the user", error: error.message });
    }
};