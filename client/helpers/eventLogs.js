const { dialog } = require('electron/main');
const fetch = require('node-fetch');
const fs = require('fs');

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

async function exportEventLog(jwt) {
    const response = await fetch(`${global.server}/api/v1/events/export`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json();
    if (await data) {
        let date = new Date();
        let dateStr = `${String(date.getMonth()+1).padStart(2, '0')+String(date.getDate()).padStart(2,'0')+date.getFullYear()}`;
        dialog.showSaveDialog({
            title: 'Export Event Logs',
            defaultPath: `wagyu_logs_${dateStr}.log`,
            buttonLabel: 'Export',
            filters: [
                { name: 'Log Files', extensions: ['log'] }
            ]
        }).then(file => {
            if (!file.canceled) {
                fs.writeFile(file.filePath.toString(), JSON.stringify(data), (err) => {
                    if (err) throw err;
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }
}

module.exports = { getAllEventLogs, createEventLog, exportEventLog };