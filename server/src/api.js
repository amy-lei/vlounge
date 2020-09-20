const express = require('express');
const { Socket } = require('socket.io-client');
const router = express.Router();
const User = require("./User");

router.post('/users', async (req, res) => {
    try {
        // Create uniquely named user
        let name = req.body.name;
        const userInDb = await User.findOne({name});
        if (userInDb) {
            name = name + Math.floor(Math.random() * 100).toString();
        }
        user = new User({name});
        // Return all users and emit as a socket event
        const u = await user.save();
        const allUsers = await User.find();
        req.app.io.emit('newUser', {user: u, allUsers});
        res.send({name, allUsers});
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;