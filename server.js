const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const Group = require('./server/Models/Group');
const Message = require('./server/Models/Message');

io.on('connection', socket => {
    console.log('Client connected to websocket');
    io.emit('hello world');
    app.post('/focusapi/chat/create-message', async (req, res) => {
        const text = req.body.text;
        const authorId = req.session.user._id;
        const authorName = req.session.user.name;
        const authorImageUrl = req.session.user.imageUrl;
        const groupId = req.body.groupId;
        try {
            const newMessage = new Message({
                text,
                authorId,
                authorName,
                authorImageUrl,
                groupId
            })
            const savedMessage = await newMessage.save();
            const group = await Group
                .findById(groupId);
            group.chatIds.push(savedMessage._id);
            const updatedGroup = await group.save();
            const groupMessages = await Message
                .find({ _id: [...updatedGroup.chatIds] })
                .sort({ createdAt: -1 })
                .lean();
            io.emit('chat message', { groupMessages, groupId });
            res.json({ savedMessage: true, updatedGroup: updatedGroup, groupMessages: groupMessages });
        } catch (error) {
            console.error();
        }
    })
})

app.use(cors());

//session
app.use(session({
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        collection: 'sessions'
    }),
    secret: 'shhhhh',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

// Initializing packages
app.use(bodyParser.json());
const dbUri = process.env.MONGO_KEY;
const warningHandling =  { useNewUrlParser: true, useUnifiedTopology: true }

mongoose.connect(dbUri, warningHandling)
.then(() => {
        let PORT = process.env.PORT || 5000;
        http.listen(PORT, () => {
            console.log('Connected to MongoDB Atlas');
            console.log('Server is listening on port: ' + PORT);
        });
    })



// Routes
const userRoutes = require('./server/routes/userRoutes');
app.use('/focusapi', userRoutes);
const groupRoutes = require('./server/routes/groupRoutes');
app.use('/focusapi/groups', groupRoutes);
const chatRoutes = require('./server/routes/chatRoutes');
app.use('/focusapi/chat', chatRoutes);
const eventRoutes = require('./server/routes/eventRoutes');
app.use('/focusapi/events', eventRoutes);