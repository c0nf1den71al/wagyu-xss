const fetch = require('node-fetch');

async function getAllEventLogs (jwt) {
    const response = await fetch(`${global.server}/api/v1/events/get`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    })
    const data = await response.json();
    if (await data) return data;
    else return false;
}

async function createEventLog(jwt, createdBy, message, type) {
    const response = await fetch(`${global.server}/api/v1/events/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            createdBy: createdBy,
            message: message,
            type: type
        })
    })
    const data = await response.json();
    if (await data._id) return data;
    else return false;
}

module.exports = { getAllEventLogs, createEventLog };