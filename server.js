const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const app = express();

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
        app.listen(PORT, () => {
            console.log('Connected to MongoDB Atlas');
            console.log('Server is listening on port: ' + PORT);
        });
    })

// Routes
const baseRoutes = require('./server/routes/baseRoutes');
app.use('/focusapi', baseRoutes);
const groupRoutes = require('./server/routes/groupRoutes');
app.use('/focusapi/groups', groupRoutes);
const chatRoutes = require('./server/routes/chatRoutes');
app.use('/focusapi/chat', chatRoutes);
const eventRoutes = require('./server/routes/eventRoutes');
app.use('/focusapi/events', eventRoutes);