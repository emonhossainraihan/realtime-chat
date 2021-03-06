const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

// utils 
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');

const app = express();
// Directly use http server in order to use socket.io
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))
const botName = 'Bot';

// Run when client connects
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {

        // User join a room
        const user = userJoin(socket.id, username, room);
        socket.join(room);

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to EulerianChat!'));

        // Broadcast when a user connects /disconnects
        socket.broadcast
            .to(room)
            .emit('message',
                formatMessage(botName, `${username} has joined the chat`)
            );
        // Send users and room info
        io.to(room)
            .emit('roomUsers', {
                room,
                users: getRoomUsers(room)
            })
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room)
            .emit('message', formatMessage(user.username, msg));
    });

    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // Send users and room info
            io.to(user.room)
                .emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                })
        };
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})
