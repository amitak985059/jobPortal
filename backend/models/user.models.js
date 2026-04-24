const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job'
    }],
    lazyApplyProfile: {
        phone: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        portfolio: { type: String, default: '' },
        resumeUrl: { type: String, default: '' },
        yearsOfExperience: { type: Number, default: 0 }
    }
}, { timestamps: true });

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, {expiresIn: '7d'})
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password){
    return await bcrypt.hash(password, 10)
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;