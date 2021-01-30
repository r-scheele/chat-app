const mongoose = require("mongoose");

const chatSChema = new mongoose.Schema({
    message: {
        type: String
    },
    username: {
        type: String
    },
    room:{
        type: String
    },
    time: {
        type: String
    }
});

module.exports = Chat = mongoose.model("chat", chatSChema);
