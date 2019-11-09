const mongoose = require('mongoose');
const gravatar = require('gravatar');
const TwinBcrypt = require('twin-bcrypt');

// DB Config
const db = require('./config/key').mongoURI;

// Connect to mongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.log(err);
        process.exit();
    });

const Admin = require('./models/Admin');

const data = {
    email: 'admin@qotd.com',
    name: 'Admin',
    password: 'qotd@1234'
}

Admin.findOne({ email: data.email })
    .then( admin => {
      if(admin) {
        console.log('Admin already exists.');
        process.exit();
      } else {
        const avatar = gravatar.url(data.email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm' // Default
        });

        const newAdmin = new Admin({
          name: data.name,
          email: data.email,
          avatar,
          password: data.password
        });

        TwinBcrypt.hash(newAdmin.password, function(hash) {
          // Store hash in your password DB.
          newAdmin.password = hash;
            newAdmin
              .save()
              .then(admin => {
                console.log('DB successfully migrated.');
                process.exit();
              })
              .catch(err => {
                console.log(err);
                process.exit();
              });
        });

      }
    });

