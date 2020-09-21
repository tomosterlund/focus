const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

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
