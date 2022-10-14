const fetch = require('node-fetch');

async function login (username, password) {
    const response = await fetch(`${global.server}/api/v1/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"username": username, "password": password})
    })
    const data = await response.json();
    if (await data.jwt) return data;
    else return false;
}

// Implement me!
async function checkUser(session) {
    return session
}
module.exports = login