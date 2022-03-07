import { io } from "./http";

interface UserRoom {
  socket_id: string;
  username: string;
  room: string;
}

interface Message {
  room: string;
  username: string;
  text: string;
  createdAt: Date;
}

const users: UserRoom[] = [];
const messages: Message[] = [];

io.on("connection", (socket) => {
  socket.on("join-room", (data, callback) => {
    socket.join(data.room);

    const userInRoom = users.find(
      (user) => user.username === data.username && user.room === data.room
    );

    if (userInRoom) {
      userInRoom.socket_id = socket.id;
    } else {
      users.push({
        socket_id: socket.id,
        username: data.username,
        room: data.room,
      });
    }

    const messagesRoom = getMessagesRoom(data.room);
    callback(messagesRoom);
  });

  socket.on("send-message", (data) => {
    // Salva as mensagens
    const message: Message = {
      room: data.room,
      username: data.username,
      text: data.message,
      createdAt: new Date(),
    };

    messages.push(message);

    // Envia para tela de usuários com base na sala
    io.to(data.room).emit("message", message);
  });
});

function getMessagesRoom(room: string) {
  const messagesRoom = messages.filter((message) => message.room === room);

  return messagesRoom;
}
