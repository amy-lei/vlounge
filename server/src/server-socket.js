const User = require('./User');
let io;

const socketToUser = {};

const addUser = (socketId, name) => {
    console.log('adding', socketId, name);
    socketToUser[socketId] = name;
} 

const removeUser = (socketId) => {
    delete socketToUser[socketId];
}

module.exports = {
    init: (http) => {
        io = require("socket.io")(http);
        io.on('connection', socket => {
            socket.on('disconnect', async (reason) => {
                try {
                    const name = socketToUser[socket.id];
                    console.log(`${name} disconnected`);
    
                    const deletedUser = await User.deleteOne({name});
                    io.sockets.emit('userLeft', name);
                    removeUser(socket.id);
                } catch (err) {
                    console.log(`error from deleting: ${err}`);
                }
            });
        });
    },
    addUser,
    removeUser,
    getIo: () => io,
}
