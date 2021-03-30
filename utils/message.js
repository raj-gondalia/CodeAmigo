const moment = require('moment')

// Creates a message object with all required details
function formatMessage(username, text) {
    const formatedMessage = {
        username,
        text,
        time: moment().format('h:mm a')
    };

    return formatedMessage;
};

module.exports = formatMessage;