const contactusModel = require('../models/message.model');

const createContactUs = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const contact = new contactusModel({
            name,
            email,
            subject,
            message
        });
        const savedContact = await contact.save();
        res.status(201).json({ success: true, data: savedContact });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// ✅ Properly export the controller function



const getContactUs = async (req, res) => {
    try {
        const contacts = await contactusModel.find();
        res.status(200).json({ success: true, data: contacts });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = {
    createContactUs,
    getContactUs
};