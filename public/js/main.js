const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.getElementById('chat-form');
const generateNewProblemButton = document.getElementById('generate-new-problem-button');

const socket = io();

//Get username and room from url 
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join Room
socket.emit('joinRoom', { username, room });


// message-blue means a user receives message from other user or bot
socket.on('message-blue', (message) => {

    outputMessage(message, 'message-blue', 'message-timestamp-left');

});


// message-orange means that the user has sent the message
socket.on('message-orange', (message) => {

    // console.log(message);

    outputMessage(message, 'message-orange', 'message-timestamp-right');

});


// Display the room users and name
socket.on('roomDetails', ({ room, users }) => {
    
    document.getElementById('room-name').innerHTML = room;

    document.getElementById('users').innerHTML = "";

    users.forEach(user => {
        const li = document.createElement('li');
        li.innerText = user.username;
        document.getElementById('users').appendChild(li);
    });

});


// Display the problem link
socket.on('problemLink', problemLink => {
    // console.log(problemLink);

    document.getElementById('problem-link').innerHTML = `<a href=${problemLink}>${problemLink}</a>`;
});


// When a user sends a message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Getting message
    const message = e.target.elements.msg.value;

    message.trim();

    // If the message is empty
    if (!message) {
        return false;
    }

    // console.log(message);

    // Emit to the server
    socket.emit('chatMessage', message);


    // Making the input field empty
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


// Genrates new problem link 
generateNewProblemButton.addEventListener('click', () => {
    // console.log("clikced");
    socket.emit('generateProblem', room);
});


// Display the message
function outputMessage(message, messageType, timestampPosition) {

    const div = document.createElement('div');
    div.classList.add(messageType);

    const p = document.createElement('p');
    p.classList.add('message-content');
    p.innerText = message.text;
    
    const innerDiv = document.createElement('div');
    innerDiv.classList.add(timestampPosition);
    innerDiv.innerText = `${message.username} ${message.time}`;

    div.appendChild(p);
    div.appendChild(innerDiv);

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
