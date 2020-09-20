const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a Schema
const RoomSchema = new Schema({
    numHearts: {type: Number, default:0},
    messages: {type: Array, default: []},
});

// Exports the model
module.exports = Room = mongoose.model('room', RoomSchema);