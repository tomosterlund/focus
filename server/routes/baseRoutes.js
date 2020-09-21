const express = require('express');
const router = express.Router();
const User = require('./../Models/User');
const Group = require('./../Models/Group');

router.post('/register', async (req, res) => {
    try {
        console.log(req.body);
        res.json({success: true});
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

module.exports = router;