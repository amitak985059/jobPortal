const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);

// Protected routes (require login)
router.get('/profile', authMiddleware, userController.getProfile);
router.post('/save-job/:jobId', authMiddleware, userController.saveJob);
router.get('/saved-jobs', authMiddleware, userController.getSavedJobs);
router.put('/lazy-apply-profile', authMiddleware, userController.updateLazyApplyProfile);

module.exports = router;