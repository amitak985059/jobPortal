const userModel = require('../models/user.models');
const jobModel = require('../models/job.model');

module.exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'An account with this email already exists' });
        }
        const hashedPassword = await userModel.hashPassword(password);
        const newUser = new userModel({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();
        const token = savedUser.generateAuthToken();
        res.cookie('authToken', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(201).json({ success: true, token, data: { _id: savedUser._id, name: savedUser.name, email: savedUser.email, role: savedUser.role } });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid Email or Password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid Email or Password' });
        }

        const token = user.generateAuthToken();
        res.cookie('authToken', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(200).json({ success: true, token, data: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

module.exports.logoutUser = async (req, res) => {
    try {
        res.clearCookie('authToken');
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

module.exports.getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select('-password').populate('savedJobs');
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

module.exports.saveJob = async (req, res) => {
    try {
        const userId = req.user._id;
        const { jobId } = req.params;

        const job = await jobModel.findById(jobId);
        if (!job) return res.status(404).json({ success: false, error: 'Job not found' });

        const user = await userModel.findById(userId);
        const alreadySaved = user.savedJobs.includes(jobId);

        if (alreadySaved) {
            // Unsave the job (toggle)
            await userModel.findByIdAndUpdate(userId, { $pull: { savedJobs: jobId } });
            return res.status(200).json({ success: true, saved: false, message: 'Job removed from saved' });
        } else {
            // Save the job
            await userModel.findByIdAndUpdate(userId, { $addToSet: { savedJobs: jobId } });
            return res.status(200).json({ success: true, saved: true, message: 'Job saved successfully' });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

module.exports.getSavedJobs = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).populate('savedJobs');
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        res.status(200).json({ success: true, data: user.savedJobs });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

module.exports.updateLazyApplyProfile = async (req, res) => {
    try {
        const { phone, linkedin, github, portfolio, resumeUrl, yearsOfExperience } = req.body;
        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    lazyApplyProfile: {
                        phone: phone || '',
                        linkedin: linkedin || '',
                        github: github || '',
                        portfolio: portfolio || '',
                        resumeUrl: resumeUrl || '',
                        yearsOfExperience: yearsOfExperience || 0
                    }
                }
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}
