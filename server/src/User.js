const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    is_flagged: {
        type: Boolean,
        default: false,
    }
});

// Exports the model
module.exports = User = mongoose.model('user', UserSchema);