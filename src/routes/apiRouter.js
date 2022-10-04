const express = require('express');

const authRouter = require('./authRouter');

const router = express.Router();

router.use('/users', authRouter);

module.exports = router;