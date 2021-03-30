const users = [];


// Adds new user to the array
function addUser(id, username, room) {
    const newUser = {
        id,
        username,
        room
    }
    users.push(newUser);
}


// Get all the users in a room
function getRoomUsers(room) {
    const roomUsers = users.filter(user => user.room === room);
    return (roomUsers);
}


// Removes user from the array
function removeUser(id) {
    const index = users.findIndex(user => user.id === id);
    if(index !== -1) {
        users.splice(index, 1);
    }
}


// Gets user details from the id
function getUser(id) {
    const reqUser = users.find(user => user.id === id);
    return (reqUser);
}

module.exports = {
    addUser,
    getRoomUsers,
    removeUser,
    getUser
};