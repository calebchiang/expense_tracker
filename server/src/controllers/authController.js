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

    // Check if email was provided
    if (!req.body.email) {
        console.log('No email provided');
        return res.status(400).json({ message: "Email is required" });
    }

    // Check if password was provided
    if (!req.body.password) {
        console.log('No password provided');
        return res.status(400).json({ message: "Password is required" });
    }

    try {
        const user = await User.findOne({ email: req.body.email.toLowerCase() });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        } else {
            console.log(`User found for email: ${req.body.email}, attempting password comparison`);
        }

        const isValid = await bcrypt.compare(req.body.password, user.password);

        if (!isValid) {
            console.log('Invalid password provided');
            return res.status(400).json({ message: "Invalid password" });
        } else {
            console.log('Password valid, generating JWT');
        }

        // Ensure the JWT_SECRET is not undefined
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Server misconfiguration" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log(`JWT generated successfully for user: ${user.email}`);
        res.status(200).json({
            message: "Logged in successfully",
            token: token,
            userId: user._id,
            isBankConnected: user.isBankConnected
        });

    } catch (error) {
        console.error("Error during login process:", error);
        res.status(500).json({ message: "Error logging in the user", error: error.toString() });
    }
};
