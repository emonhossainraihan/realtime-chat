const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

// utils 
const formatMessage = require('./utils/messages');

const app = express();
// Directly use http server in order to use socket.io
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))
const botName = 'Bot';

// Run when client connects
io.on('connection', socket => {

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    // Broadcast when a user connects /disconnects
    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'));
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user has left the chat'));
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage('USER', msg));
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})
