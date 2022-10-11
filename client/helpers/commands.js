const fetch = require('node-fetch');

async function processCommand (jwt, command) {
    const response = await fetch(`${global.server}/api/v1/command/process`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({command: command, username: global.username})
    })
    const data = await response;
    if (await data) return data.json();
    else return "Error";
}

module.exports = processCommand;