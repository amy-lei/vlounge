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
            
            // socket.on("toggleFlag", async (name) => {
            //     // toggle flag on user, tell al clients to update lists
            //     console.log("server: logging")
            //     console.log(name)
            //     const toggleUser = await User.findOne({name}); 
            //     toggleUser.is_flagged = !toggleUser.is_flagged 
            //     const toggled = await toggleUser.save();
            //     const allUsers = await User.find();
            //     socket.emit("updateUsers", allUsers)
            //     // check number of people with flags toggled
            //     flags_up = 0 
            //     for (user in allUsers) {
            //         if (user.is_flagged) {
            //             flags_up += 1
            //         }
            //     }
            //     if (flags_up > 1) {
            //         socket.getIO().sockets.emit("makeRoom", flags_up)
            //     }

            // });
        });
    },
    addUser,
    removeUser,
    getIo: () => io,
}
