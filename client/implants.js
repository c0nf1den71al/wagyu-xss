const fetch = require('node-fetch');

async function getAllImplants(jwt) {
    const response = await fetch(`${global.server}/api/v1/implants/get`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    })
    const data = await response.json();
    if (await data) return data;
    else return false;
}

async function deleteImplantById(jwt, id) {
    const response = await fetch(`${global.server}/api/v1/implants/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    })
    const data = await response.json();
    if (await data) return data;
    else return false;
};

module.exports = { getAllImplants, deleteImplantById };