const moment = require("moment")

function formatMessage(username, message) {
    const time = moment().format("h:mm a");
    return {
        username,
        message,
        time
    }
}

module.exports = formatMessage;