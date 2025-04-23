const {hashPassword, comparePassword, generateAuthToken} = require('../models/user.models');
const userModel = require('../models/user.models');

module.exports.registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const existingUser = await userModel.findOne({email});
        if (existingUser) {
            return res.status(400).json({success: false, error: 'User already exists'});
        }
        const user = await hashPassword(password);
        const newUser = new userModel({name, email, password: user});
        const savedUser = await newUser.save();
        const token = await savedUser.generateAuthToken();
        res.cookie('authToken', token, {httpOnly: true});
        res.status(201).json({success: true, data: savedUser});
    } catch (error) {
        res.status(400).json({success: false, error: error.message});
    }
}
module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid Email or Password' });
        }

        const isMatch = await user.comparePassword(password); // ✅ CALL ON INSTANCE

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid Email or Password' });
        }

        const token = await user.generateAuthToken();
        // res.cookie('authToken', token, { httpOnly: true });
        res.cookie('authToken', token, {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
            secure: process.env.NODE_ENV === 'production', // only use secure cookies in production
            sameSite: 'strict', // helps mitigate CSRF
          });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}
module.exports.logoutUser = async (req, res) => {
    try {
        res.clearCookie('authToken');
        res.status(200).json({ success: true, message: 'User Logged Out Successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}
