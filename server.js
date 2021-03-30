const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');
const { getProblemLink, generateProblemLink } = require('./utils/problemLink');
const { addUser, getUser, removeUser, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'BotAmigo';

// When a new connection established
io.on('connection', socket => {

    // When a new user joins
    socket.on('joinRoom', async user => {

        await generateProblemLink(user.room);

        addUser(socket.id, user.username, user.room);

        socket.join(user.room);

        // Emits welcome message the client side of the user
        socket.emit('message-blue', formatMessage(botName, 'Welcome to the CodeAmigo.'));

        // Sends message the all other users in the room
        socket.to(user.room).emit('message-blue', formatMessage(botName, `New Amigo! ${user.username} has just joined.`));

        // Get problem link for the user
        socket.emit('problemLink', getProblemLink(user.room));

        // To update the room users name
        io.to(user.room).emit('roomDetails',{
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });


    // To generate new problem link
    socket.on('generateProblem', async room => {
        
        await generateProblemLink(room);

        socket.emit('problemLink', getProblemLink(room));
    });


    // Send a message in the chat
    socket.on('chatMessage', message => {

        const user = getUser(socket.id);

        // To the user
        socket.emit('message-orange', formatMessage(user.username, message));

        // To all other users in the room 
        socket.to(user.room).emit('message-blue', formatMessage(user.username, message));
    });

    // When the user disconnects
    socket.on('disconnect', () => {

        const user = getUser(socket.id);

        if (user) {

            socket.to(user.room).emit('message-blue', formatMessage(botName, `${user.username} left the room.`));

            // Removes user from the list of users
            removeUser(socket.id);

            // Update users
            io.to(user.room).emit('roomDetails', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    })
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));