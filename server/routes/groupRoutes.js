const express = require('express');
const router = express.Router();
const Group = require('./../Models/Group');
const User = require('./../Models/User');
const Message = require('./../Models/Message');
const Event = require('./../Models/Event');
const shortid = require('shortid');

const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

// Configuring AWS-SDK & Multer
AWS.config.loadFromPath('./config.json');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const getDate = require('./../util/get-date');

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

router.post('/create-group', uploadPic.single('image'), async (req, res) => {
    // Handling file name
    let image = '';
    if (req.file) {
        image = getDate() + req.file.originalname;
    } else if (!req.file) {
        image = 'randomuser.png';
    }

    try {
        const parsedBody = JSON.parse(req.body.groupdetails);
        const newGroup = new Group({
            name: parsedBody.name,
            description: parsedBody.description,
            imageUrl: image,
            members: [req.session.user._id],
            admins: [req.session.user._id],
            ownerId: req.session.user._id,
            joinCode: shortid.generate()
        });
        const savedGroup = await newGroup.save();
        const loggedInUser = await User.findById(req.session.user._id);
        loggedInUser.groups.push(savedGroup._id);
        const updatedUser = await loggedInUser.save();
        res.json({ savedGroup: true });
    } catch (err) {
        console.log(err);
    }
})

router.get('/groups', async (req, res) => {
    const userId = req.session.user._id;
    try {
        const loggedInUser = await User.findById(userId).lean();
        const userGroupsIds = [...loggedInUser.groups];
        const userGroups = await Group.find({ _id: [...userGroupsIds] });
        res.json({ userGroups }); 
    } catch (error) {
        console.log(error);
    }
})

router.get('/:groupId', async (req, res) => {
    const routeParam = req.params.groupId;
    try {
        const loadedGroup = await Group.findById(routeParam).lean();
        const groupMessages = await Message
            .find({ _id: [...loadedGroup.chatIds] })
            .sort({ createdAt: -1 })
            .lean();
        const groupMembers = await User
            .find({ _id: [...loadedGroup.members] })
            .lean();
        const loadedEvents = await Event
            .find({ groupId: loadedGroup._id })
            .lean();
        res.json({ loadedGroup, groupMessages, groupMembers, loadedEvents });
    } catch (error) {
        console.error();
    }
})

router.post('/join', async (req, res) => {
    const joinCode = req.body.joinCode;
    try {
        const foundGroup = await Group.find({ joinCode: joinCode });
        foundGroup[0].members.push(req.session.user._id);
        await foundGroup[0].save();
        const thisUser = await User.findById(req.session.user._id);
        thisUser.groups.push(foundGroup[0]._id);
        await thisUser.save();
        res.json({ success: true });
    } catch (error) {
        // console.error();
        console.log(error)
    }
})

module.exports = router;