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
                const name = socketToUser[socket.id];
                console.log(`${name} disconnected`);

                const deletedUser = await User.deleteOne({name});
                io.emit('userLeft', {user: deletedUser});
                removeUser(socket.id);
            });
            socket.on("nameChange", (data) => {
                // toggle flag on user, tell al clients to update lists
                    
                // check number of people with flags toggled
            });

            socket.on("toggleFlag", async (name) => {
                // toggle flag on user, tell al clients to update lists
                console.log("server: logging")
                console.log(name)
                const toggleUser = await User.findOne({name}); 
                toggleUser.is_flagged = !toggleUser.is_flagged 
                const toggled = await toggleUser.save();
                const allUsers = await User.find();
                socket.emit("updateUsers", allUsers)
                // check number of people with flags toggled
            });
        });
    },
    addUser,
    removeUser,
    getIo: () => io,
}
