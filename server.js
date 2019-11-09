const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
var multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();

// Getting authentication routes
const auth = require('./routes/api/auth');
// Getting user routes
const users = require('./routes/api/users');

//Getting admin routes
const admin = require('./routes/api/admin/auth');

const app = express();
const upload = multer();

app.use(cors({origin: '*'}));

// for parsing multipart/form-data
app.use(upload.any());

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require('./config/key').mongoURI;

// Connect to mongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// User route
app.use('/api/auth', auth);
app.use('/api/user', users);

// Admin route
app.use('/api/admin/auth', admin);
// app.use('/api/user', passport.authenticate('jwt', {session: false}), users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));