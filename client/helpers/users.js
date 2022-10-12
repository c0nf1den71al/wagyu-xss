const fetch = require('node-fetch');

async function getAllUsers(jwt) {
    const response = await fetch(`${global.server}/api/v1/users/get`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    })
    const data = await response.json();
    if (await data) return data;
    else return false;
};

async function deleteUserById(jwt, id) {
    const response = await fetch(`${global.server}/api/v1/users/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    })

    const data = await response.json();
    if (await data) return data;
    else return false;
};

module.exports = { getAllUsers, deleteUserById };