const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const http = require('http');
const cors = require('cors');
const api = require('./api.js');
const User = require("./User");

const socket = require('./server-socket');
const User = require('./User.js');
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

const server = http.createServer(app);
socket.init(server);
app.io = socket.getIo();

app.get('/', (req, res) => {
    res.send("Hello world");
});
server.listen(port, () => {
    console.log('listening on *:5000');
});
