const router = require('express').Router();
const userRoute = require('./userRoute');
const thoughtRoutes = require('./thoughtRoute');

router.use('/users', userRoute);
router.use('/thoughts', thoughtRoutes);

module.exports = router;