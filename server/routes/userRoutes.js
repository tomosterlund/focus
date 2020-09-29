const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

// Configuring AWS-SDK & Multer
AWS.config.loadFromPath('./config.json');
AWS.config.getCredentials(err => {
    if (err) {
        console.log('Error', err);
    } else {
        console.log('Access key loaded');
    }
});
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const getDate = require('../util/get-date');

let uploadPic = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'focus-app-testfiles',
        acl: 'public-read',
        key: function (req, file, cb) {
        cb(null, getDate() + file.originalname)
        }
    })
});

// Importing Models
const User = require('../Models/User');
const Group = require('../Models/Group');
const Message = require('../Models/Message');

// API endpoints + controller functions
router.post('/register', uploadPic.single('image'), async (req, res) => {
    try {
        const parsedUser = JSON.parse(req.body.details);

        // Check if e-mail is already in use
        const emailIsTaken = await User.findOne({ email: parsedUser.email });
        if (emailIsTaken) {
            return res.json({ emailTaken: true });
        }

        // Password encryption
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(parsedUser.password, salt);

        // Handling file name
        let image = '';
        if (req.file) {
            image = getDate() + req.file.originalname;
        } else if (!req.file) {
            image = 'randomuser.png';
        }

        // Saving user
        const newUser = new User({
            name: parsedUser.name,
            email: parsedUser.email,
            password: hashedPassword,
            imageUrl: image
        });
        await newUser.save();
        res.json({success: true});
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const foundUser = await User.find({ email: email }).lean();
        if (!foundUser[0]) {return res.json({ error: 'email' })};
        if (foundUser[0]) {
            let pwBoolean = await bcrypt.compare(password, foundUser[0].password);
            if (pwBoolean) {
                req.session.user = foundUser[0];
                return res.json({ loginSuccess: true, sessionUser: req.session.user });
            }
            return res.json({ error: 'password' });
        }
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});

router.get('/verified', (req, res) => {
    res.json({ sessionUser: req.session.user || null });
});

router.get('/signout', (req, res) => {
    req.session.destroy();
    return res.json({ signoutSuccess: true });
});

router.get('/edit-user', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id).lean();
        res.json({ user });
    } catch (error) {
        console.log(error);
    }
});

router.post('/edit-user', uploadPic.single('image'), async (req, res) => {
    try {
        const parsedUser = JSON.parse(req.body.details);

        // Password encryption
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(parsedUser.password, salt);

        // Handling file name
        let image = '';
        if (req.file) {
            image = getDate() + req.file.originalname;
        }

        // Saving user
        const user = await User.findById(req.session.user._id);
        user.name = parsedUser.name || req.session.user.name,
        user.email = parsedUser.email || req.session.user.email,
        user.password = hashedPassword || req.session.user.password,
        user.imageUrl = image || req.session.user.imageUrl
        const updatedUser = await user.save();
        const userMessages = await Message.updateMany(
            { authorId: req.session.user._id },
            {"$set": { authorName: parsedUser.name || req.session.user.name, authorImageUrl: image || req.session.user.imageUrl }}
            );
        res.json({ updatedUser });
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

module.exports = router;