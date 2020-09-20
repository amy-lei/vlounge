const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const http = require('http');
const cors = require('cors');
const api = require('./api.js');
const User = require("./User");

const socket = require('socket.io');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
MONGO_URI = process.env.MONGO_URI

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "text/*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());
app.use("/api", api);
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

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
const server = http.createServer(app);
const io = socket(server);
io.on("connection", (socket) => {
    console.log("new connection");

    socket.on("nameChange", (data) => {
        // toggle flag on user, tell al clients to update lists
            
        // check number of people with flags toggled
    });

    socket.on("toggleFlag", async (name) => {
        // toggle flag on user, tell al clients to update lists
        const toggleUser = await User.findOne({name}); 
        toggleUser.is_flagged = !toggleUser.is_flagged 
        const toggled = await toggleUser.save();
        const allUsers = await User.find();
        socket.emit("updateUsers", allUsers)
        // check number of people with flags toggled
    });

});
app.io = io;

// create a GET route
app.get('/', (req, res) => {
    res.send("Hello world");
});
server.listen(port, () => {
    console.log('listening on *:5000');
});
