const express = require('express');
const router = express.Router();
const Group = require('./../Models/Group');
const Event = require('./../Models/Event');

router.post('/create-new', async (req, res) => {
    const parsedBody = req.body;
    try {
        const newEvent = new Event({
            name: parsedBody.name,
            text: parsedBody.text,
            date: parsedBody.date,
            time: parsedBody.time,
            location: parsedBody.location,
            authorName: req.session.user.name,
            authorImageUrl: req.session.user.imageUrl,
            authorId: req.session.user._id,
            groupId: parsedBody.groupId
        });
        const savedEvent = await newEvent.save();
        const event = await Event.findById(savedEvent._id);
        const foundGroup = await Group.findById(parsedBody.groupId);
        foundGroup.eventIds.push(event._id);
        const updatedGroup = await foundGroup.save();
        const groupEvents = await Event
            .find({ _id: [...updatedGroup.eventIds] })
            .lean();
        res.json({ groupEvents });
    } catch (error) {
        console.log(error);
    }
})

router.get('/:eventId', async (req, res) => {
    const eventId = req.params.eventId;
    try {
        const event = await Event.findById(eventId).lean();
        res.json({ event });
    } catch (error) {
        console.log(error);
    }
})

router.post('/edit/:eventId', async (req, res) => {
    const eventId = req.params.eventId;
    const name = req.body.name;
    const text = req.body.text;
    const date = req.body.date;
    const time = req.body.time;
    const location = req.body.location;
    const groupId = req.body.groupId;
    try {
        const loadedEvent = await Event.findById(eventId);
        loadedEvent.name = name;
        loadedEvent.text = text;
        loadedEvent.date = date || loadedEvent.date;
        loadedEvent.time = time;
        loadedEvent.location = location;
        loadedEvent.groupId = groupId;
        await loadedEvent.save();
        const group = await Group.findById(groupId).lean();
        const groupEvents = await Event
            .find({ _id: [...group.eventIds] })
            .lean();
        res.json({ groupEvents });
    } catch (error) {
        console.log(error);
    }
})

router.delete('/delete/:eventId', async (req, res) => {
    const eventId = req.params.eventId;
    try {
        const eventToDelete = await Event.findByIdAndDelete(eventId);
        const groupId = eventToDelete.groupId;
        const group = await Group.findById(groupId).lean();
        const groupEvents = await Event
            .find({ _id: [...group.eventIds] })
            .lean();
        res.json({ groupEvents });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;