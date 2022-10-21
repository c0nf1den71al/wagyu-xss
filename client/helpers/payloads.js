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

async function createPayload(jwt, name, description, compatibility, type, risk, payload) {
    const response = await fetch(`${global.server}/api/v1/payloads/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            description: description,
            payload: payload,
            compatibility: compatibility,
            type: type,
            author: global.username,
            risk: Number(risk)
        })
    })

    const data = await response.json();
    if (await data) return data;
    else return false;
}

async function updatePayloadById(jwt, id, name, description, compatibility, type, risk, payload) {
    const response = await fetch(`${global.server}/api/v1/payloads/update/${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            description: description,
            payload: payload,
            compatibility: compatibility,
            type: type,
            risk: risk
        })
    })

    const data = await response.json();
    if (await data) return data;
    else return false;
}

async function deletePayloadById(jwt, id) {
    const response = await fetch(`${global.server}/api/v1/payloads/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    })
    const data = await response.json();
    if (await data) return data;
    else return false;
}

module.exports = { getAllPayloads, createPayload, updatePayloadById, deletePayloadById };