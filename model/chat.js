const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    epoch: {
        type: String,
        required: true,
    },
    nickName: {
        type: String,
        required: true,
    },
    msg: {
        type: String,
        required: true,
    }
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;