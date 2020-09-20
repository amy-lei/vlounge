const express = require('express');
const { Socket } = require('socket.io-client');
const router = express.Router();
const User = require("./User");
const socket = require("./server-socket");

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
        socket.addUser(req.body.socketId, name);
        socket.getIo().sockets.emit('updateUsers', allUsers);
        res.send({name, allUsers});
    } catch (err) {
        console.log(err);
    }
});

router.post('/flag', async (req, res) => {
    try {
        const allUsers = await User.find();
        const target = allUsers.find(u => u.name === req.body.name);
        target.is_flagged = !target.is_flagged;
        await target.save();
        socket.getIo().sockets.emit('updateUsers', allUsers);
        res.send({allUsers});
        flags_up = 0;
        for (user of allUsers) {
            if (user.is_flagged) {
                flags_up += 1;
            }
        }
        if (flags_up > 1) {
            socket.getIo().sockets.emit("makeRoom", flags_up);
        }
    } catch (err) {
        console.log(`error from toggling flag: ${err}`);
    }
});

module.exports = router;
