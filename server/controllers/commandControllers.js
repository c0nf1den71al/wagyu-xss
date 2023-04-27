const { addPayloadToQueue } = require("../controllers/hostControllers");
const { getPayloadByName } = require("../controllers/payloadControllers");

const User = require("../models/User");

async function getCommandHistory(username) {
    const user = await User.findOne({ username: username });
    return user.commandHistory;
}

module.exports.processCommand = async (req, res) => {
    try {
        let { command, username, currentTerminalId } = req.body;
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
execute <payload> - Add a payload to an impant's queue.`,
            type: "info",
            history: await getCommandHistory(username)});
        } else if (command.includes("execute")) {
            const payload = command[1];
            const hostId = currentTerminalId
            if (payload && hostId) {
                const payloadExists = await getPayloadByName(payload);
                if (payloadExists) {
                    res.json({
                        message: `Adding payload to queue for host: ${hostId}`,
                        type: "info",
                        history: await getCommandHistory(username)
                    });
                    addPayloadToQueue(payload, hostId, username);
                } else {
                    res.json({
                        message: `Payload '${payload}' does not exist.`,
                        type: "error",
                        history: await getCommandHistory(username)
                    })
                }
            } else {
                res.json({
                    message: "Incorrect usage of execute command. Usage: execute <payload>",
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