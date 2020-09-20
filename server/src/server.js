const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const User = require("./User");
const socket = require('socket.io');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
MONGO_URI = process.env.MONGO_URI

app.use(express.json());
app.use(bodyParser.json());

// connect to database
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    dbName: "vlounge",
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(`${err}: Failed to connect to MongoDB`));

// console.log that your server is up and running
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
const io = socket(server);
io.on("connection", (socket) => {
    console.log('Made a connection');
});

app.io = io;
app.post('/api/users', (req, res) => {
    // Create uniquely named user
    let name = req.body.name;
    console.log(name);
    while (true) {
        const userInDb = User.findOne({name});
        if (!userInDb) {
            break;
        }
        name = name + Math.floor(Math.random() * 10).toString();
    }
    user = new User({name});

    // Return all users and emit as a socket event
    user.save()
        .then((u) => {
            User.find({})
                .then(allUser => {
                    console.log(allUser);
                    req.app.io.emit('newUserList', {allUser});
                    res.send({allUser, name});
                });
        });
    res.send({});
});

// create a GET route
app.get('/', (req, res) => {
  res.send("Hello world");
});
