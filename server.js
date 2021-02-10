const moment = require("moment");
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessages = require("./utills/messages.js");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utills/users.js");
const Chat = require("./models/Chat");
const connectDB = require("./config/db");


//Connect to Database
connectDB()



//Initialize express App
const app = express();

//Connect to socket.io
const server = http.createServer(app)
const io = socketio(server)

//set static folder
app.use(express.static(path.join(__dirname,"public")))


app.get('/', (req, res) => {
    res.sendFile("index.html");
})

const botName = "ChatPro"

//Handles client connection
io.on("connection", socket => {
    //Client joins room
    socket.on("joinRoom", async ({ username , room }) => {

    //Handles joining of users to a room
    const user = userJoin(socket.id, username, room);
    socket.join(user.room)

    //Welcome current user
    socket.emit("message", formatMessages(botName,"welcome to ChatPro "));

    //Broadcast when a user connects
    socket.broadcast.to(user.room).emit("message", formatMessages(botName,`${user.username} has joined the chat`));



    //send Users and room info
   io.to(user.room).emit("roomUsers",{
    room: user.room,
    users: getRoomUsers(user.room)
});
    try {
    const chat = await Chat.find({ room });

    if (chat) {
        const newChat = chat.filter((individualChat) => individualChat.room == room);
        socket.emit("preMessages", newChat);
    }
    } catch (err) {
        console.error(err.message);
    }
});
    
  

    
//listen for chat message
socket.on("chatMessage",async msgText => {
    const user = getCurrentUser(socket.id);

try {

    const textMessage = formatMessages(user.username , msgText);
    if (user) io.to(user.room).emit("message", textMessage);
        
    const message = {};
    if (textMessage.username) message.username = textMessage.username;
    if (user.room) message.room = user.room;
    if (textMessage.message) message.message = textMessage.message;
    message.time = moment().format("h:mm a");

    const chat = new Chat(message);

    await chat.save(); 
} catch (err) {
    console.error(err.message);
}
   
});

//When user disconnects
socket.on("disconnect",() => {
    const user = userLeave(socket.id);

    if(user){
        io.to(user.room).emit("message",formatMessages(botName,`${user.
        username} has left the chat`));

                
        io.to(user.room).emit("roomUsers",{
        room: user.room,
        users: getRoomUsers(user.room)
        });
    }
});
});



const port = process.env.PORT || 4000

server.listen(port, () => {
    console.log(`server running on port ${port}`);
});