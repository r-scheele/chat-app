
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.querySelector("#room-name");
const userList = document.getElementById("users");
const darkIcon = document.querySelector(".dark-mode");




//Get username and room name from URL
const qs = location.search.replace("?","").replace("+name","").split("&");

//const socket = io('http://localhost:4000');
const socket = io.connect( 'http://127.0.0.1:4000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: 99999
} );
//join chat room
socket.emit("joinRoom",{
    username: qs[0].split("=")[1],
    room: qs[1].split("=")[1]
});

//get room users
socket.on("roomUsers",({ room, users })=>{
    outputRoomName(room);
    outputUsers(users);
})
//Message from server
socket.on("message", message => {
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("preMessages", chats => {
        chats.forEach(chat => {
            outputMessage(chat);
        });
});


chatForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    //Get message text
    const msg = e.target.elements.msg.value;

    //Emit chat message to the server
    socket.emit("chatMessage", msg);
    
    //clear input field
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();

});


//output message to Dom

function outputMessage(message){
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.message}
    </p>`
    document.querySelector(".chat-messages").appendChild(div);
}


//Add room name to dom
function outputRoomName(room){
 roomName.innerText = room;
}

//add users to dom
function outputUsers(users){
    const text = users.map(user => {
        return `<li class="fas fa-user"> ${user.username} </li>`
})
    userList.innerHTML = `${text.join("")}`;
}
