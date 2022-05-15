const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    pwd: {
        type: String,
        required: true,
    },
    nickName: {
        type: String,
        required: true,
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;