const express = require('express');
const { Socket } = require('socket.io-client');
const router = express.Router();
const User = require("./User");
const Room = require('./Room');
const socket = require("./server-socket");

router.post('/users', async (req, res) => {
    try {
        // Create uniquely named user
        let name = req.body.name;
        const userInDb = await User.findOne({name});
        const oneRoom = await Room.findOne();
        if (userInDb) {
            name = name + Math.floor(Math.random() * 100).toString();
        }
        user = new User({name});
        // Return all users and emit as a socket event
        const u = await user.save();
        const allUsers = await User.find();
        socket.addUser(req.body.socketId, name);
        socket.getIo().sockets.emit('updateUsers', allUsers);
        res.send({name, allUsers, numHearts: oneRoom.numHearts});
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

router.post('/name', async (req, res) => {
    try {
        let name = req.body.name;
        const allUsers = await User.find();
        const target = allUsers.find(u => u.name === req.body.formerName);
        const dupe = allUsers.find(u => u.name === name);
        if (dupe) {
            name = name + Math.floor(Math.random() * 100).toString();
        }
        target.name = name;
        await target.save();
        socket.getIo().sockets.emit('updateUsers', allUsers);
        res.send({name});
    } catch (err) {
        console.log(`error from changing names: ${err}`);
    }
});

router.post('/hearts', async (req, res) => {
    try {
        let numHearts = req.body.numHearts;
        const r = await Room.findOne();
        r.numHearts = r.numHearts + numHearts; 
        const newRoom = await r.save();
        socket.getIo().sockets.emit('updateHearts', newRoom.numHearts);
        res.send({numHearts});
    } catch (err) {
        console.log(`error from accessing hearts: ${err}`);
    }
});

module.exports = router;
