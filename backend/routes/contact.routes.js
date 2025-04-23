const express = require('express');
const router = express.Router();



const contactController = require('../controllers/contactus.controller');

// This works because createContactUs is now properly exported
router.post('/', contactController.createContactUs);
router.get('/getcontactus', contactController.getContactUs);
module.exports = router;