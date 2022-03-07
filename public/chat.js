const socket = io();

var roomSelect = document.querySelector('#room-id');
var usernameInput = document.querySelector('#username-id');
var username = 'anonymous';
var room = 'room-1';

// emit -> emitir informação
// on -> escutando informação

function joinRoom(){
    socket.emit("join-room", {username, room}, (response) => {
        response.map((data) => {
            createMessage(data);
        })
    });
}

roomSelect.addEventListener('change', (e) => {
    room = e.target.value;
    joinRoom()
})

usernameInput.addEventListener('change', (e) => {
    username = e.target.value ?? 'anonymous';
    joinRoom()
})

document.querySelector('#message-id').addEventListener('keypress', (e) => {
    if(e.key === 'Enter' && e.target.value !== ''){
     const message = e.target.value;   
     const data = {room, message, username};
     e.target.value = '';
     socket.emit("send-message", data);
    }
})

socket.on('message', (data) => {
    createMessage(data)
})
function createMessage(data){
    const message = document.createElement('p');
    const messageContainer = document.querySelector('#chat');
    message.innerHTML = `<b>${data.username}:</b> ${data.text}`;
    messageContainer.append(message);
}