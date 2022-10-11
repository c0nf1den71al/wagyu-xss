const fetch = require('node-fetch');

async function getAllFindings(jwt) {
    const response = await fetch(`${global.server}/api/v1/findings/get`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    })
    const data = await response.json();
    if (await data) return data;
    else return false;
};

async function deleteFindingById(jwt, id) {
    const response = await fetch(`${global.server}/api/v1/findings/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    })

    const data = await response.json();
    if (await data) return data;
    else return false;
};

module.exports = { getAllFindings, deleteFindingById };