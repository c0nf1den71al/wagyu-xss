const fetch = require('node-fetch');

async function getAllPayloads(jwt) {
    const response = await fetch(`${global.server}/api/v1/payloads/get`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    })
    const data = await response.json();
    if (await data) return data;
    else return false;
}

module.exports = { getAllPayloads };