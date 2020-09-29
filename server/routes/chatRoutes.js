const express = require('express');
const router = express.Router();
const Group = require('./../Models/Group');
const Message = require('./../Models/Message');

// router.post('/create-message', async (req, res) => {
//     const text = req.body.text;
//     const authorId = req.session.user._id;
//     const authorName = req.session.user.name;
//     const authorImageUrl = req.session.user.imageUrl;
//     const groupId = req.body.groupId;
//     try {
//         const newMessage = new Message({
//             text,
//             authorId,
//             authorName,
//             authorImageUrl,
//             groupId
//         })
//         const savedMessage = await newMessage.save();
//         const group = await Group
//             .findById(groupId);
//         group.chatIds.push(savedMessage._id);
//         const updatedGroup = await group.save();
//         const groupMessages = await Message
//             .find({ _id: [...updatedGroup.chatIds] })
//             .sort({ createdAt: -1 })
//             .lean();
//         res.json({ savedMessage: true, updatedGroup: updatedGroup, groupMessages: groupMessages });
//     } catch (error) {
//         console.error();
//     }
// })

router.delete('/delete-message/:messageId', async (req, res) => {
    const messageId = req.params.messageId;
    try {
        const messageToDelete = await Message.findByIdAndDelete(messageId);
        let group = await Group.findById(messageToDelete.groupId);
        let newChatArr = []
        for (let m of group.chatIds) {
            if (m != messageId) {
                newChatArr.push(m);
            }
        }
        group.chatIds = newChatArr;
        let updatedGroup = await group.save();
        res.json({ updatedGroup });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;