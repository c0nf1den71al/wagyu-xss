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
    else return await data;
}

async function checkUser(session, username) {
    const response = await fetch(`${global.server}/api/v1/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"jwt": session})
    })
    if (await response.status == 200) {
        const data = await response.json();
        if (await data.username == username) return true;
        else return false;
    } else return false;
    
}

module.exports = { login, checkUser };