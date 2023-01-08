const { app, BrowserWindow, ipcMain } = require("electron")
const { login, checkUser } = require("./helpers/auth")
const { getAllEventLogs, createEventLog, exportEventLog } = require("./helpers/eventLogs")
const { getAllImplants, deleteImplantById, generateImplant } = require("./helpers/implants");
const { getAllPayloads, createPayload, updatePayloadById, deletePayloadById } = require("./helpers/payloads");
const { getAllHosts, markHostAsOffline } = require("./helpers/hosts");
const { getAllFindings, deleteFindingById } = require("./helpers/findings");
const { getAllUsers, deleteUserById, createUser, updateUserById } = require("./helpers/users");
const processCommand = require("./helpers/commands");
const path = require("path")
const Store = require("electron-store");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1600,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: path.join(__dirname, "build/wagyu.ico")
    })

    const store = new Store();

    try {
        global.server = store.get("server");
        global.username = store.get("username");
    } catch {
        global.server = "";
        global.username = "";
    }
    
    ipcMain.on("login", (event, username, password, server) => {
        store.set("server", server);
        global.server = server;
        
        (async function (username, password) {
            const data = await login(username, password);
            if (await data.jwt && await data.role && await data.username) {
                store.set("session", await data.jwt);
                store.set("role", await data.role);
                store.set("username", await data.username);
                global.username = username;
                await createEventLog(data.jwt, "Team Server", `Operator ${data.username} joined the team server`, "info");
                await win.loadFile("index.html");
            } else if(data.error){
                event.sender.send("errorMessage", data.error);
            }
        })(username, password, server);
    });

    ipcMain.handle("checkLogin", async (event) => {
        const jwt = store.get("session");
        if (await jwt !== undefined) {
            if(await checkUser(jwt, store.get("username"))) return {username: store.get("username"), role: store.get("role")};
            else return false;
        } else {
            return false
        }
    })

    ipcMain.handle("getStore", async (event) => {
        return { server: store.get("server"), username: store.get("username") }
    })
    
    ipcMain.on("logout", async (event) => {
        // await createEventLog(jwt, "Team Server", `Operator ${global.username} left the team server`, "warning") HAS ISSUES
        store.delete("session");
        win.loadFile("login.html");
    })

    ipcMain.handle("generateImplant", async (event, server, initialPayload, callbackInterval, minJitter, maxJitter, hostCookie) => {
        const jwt = store.get("session");
        await generateImplant(jwt, server, initialPayload, callbackInterval * 1000, minJitter * 1000, maxJitter * 1000, hostCookie);
        event.sender.send("refreshImplants");
    })

    ipcMain.handle("getAllImplants", async (event) => {
        const jwt = store.get("session");
        const implants = await getAllImplants(jwt);
        event.sender.send("implants", implants, global.server);
    })

    ipcMain.handle("deleteImplantById", async (event, id) => {
        const jwt = store.get("session");
        await deleteImplantById(jwt, id);
        event.sender.send("refreshImplants");
    })

    ipcMain.handle("getAllHosts", async (event) => {
        const jwt = store.get("session");
        const hosts = await getAllHosts(jwt);
        event.sender.send("hosts", hosts, global.server);
    })

    ipcMain.handle("markHostAsOffline", async (event, id) => {
        const jwt = store.get("session");
        await markHostAsOffline(jwt, id);
        event.sender.send("refreshHosts");
    })

    ipcMain.handle("getAllPayloads", async (event) => {
        const jwt = store.get("session");
        const payloads = await getAllPayloads(jwt);
        event.sender.send("payloads", payloads);
        return {payloads: payloads, server: global.server};
    })

    ipcMain.handle("getAllEventLogs", async (event) => {
        const jwt = store.get("session");
        const eventLogs = await getAllEventLogs(jwt);
        event.sender.send("eventLogs", eventLogs);
    });

    ipcMain.handle("getAllFindings", async (event) => {
        const jwt = store.get("session");
        const findings = await getAllFindings(jwt);
        event.sender.send("findings", findings);
    })

    ipcMain.handle("deleteFindingById", async (event, id) => {
        const jwt = store.get("session");
        await deleteFindingById(jwt, id);
        event.sender.send("refreshFindings");
    })

    ipcMain.handle("createEventLog", async (event, message, type) => {
        const jwt = store.get("session");
        try {
            await createEventLog(jwt, global.username, message, type);
            await event.sender.send("chatSent")
        } catch (err) {
            console.log(err);
        }
    })

    ipcMain.handle("processCommand", async (event, command, currentTerminalId) => {
        const jwt = store.get("session");
        try {
            const result = await processCommand(jwt, command, currentTerminalId);
            event.sender.send("refreshImplants");
            return await result;
        } catch (e) {
            return "Error: " + e;
        }
    })

    ipcMain.handle("getAllUsers", async (event) => {
        const jwt = store.get("session");
        const users = await getAllUsers(jwt);
        event.sender.send("users", users);
    })

    ipcMain.handle("deleteUserById", async (event, id) => {
        const jwt = store.get("session");
        await deleteUserById(jwt, id);
        event.sender.send("refreshUsers");
    })

    ipcMain.handle("createUser", async (event, username, password, confirmpassword, role) => {
        const jwt = store.get("session");
        if(password === confirmpassword) {
            await createUser(jwt, username, password, role);
            event.sender.send("refreshUsers");
        } else {
            // Handle errors here
            // event.sender.send("passwordsDontMatch");
        }
    })

    ipcMain.handle("updateUser", async (event, id, username, password, confirmpassword, role) => {
        const jwt = store.get("session");
        if(password === confirmpassword) {
            await updateUserById(jwt, id, username, password, role);
            event.sender.send("refreshUsers");
        } else {
            // Handle errors here
            // event.sender.send("passwordsDontMatch");
        }
    })

    ipcMain.handle("createPayload", async (event, name, description, compatibility, type, risk, payload, notes) => {
        const jwt = store.get("session");
        await createPayload(jwt, name, description, compatibility, type, risk, payload, notes);
        event.sender.send("refreshPayloads");
    });

    ipcMain.handle("updatePayload", async (event, id, name, description, compatibility, type, risk, payload, notes) => {
        const jwt = store.get("session");
        await updatePayloadById(jwt, id, name, description, compatibility, type, risk, payload, notes);
        event.sender.send("refreshPayloads");
    });

    ipcMain.handle("deletePayload", async (event, id) => {
        const jwt = store.get("session");
        await deletePayloadById(jwt, id);
        event.sender.send("refreshPayloads");
    });

    ipcMain.on("exportEventLog", (event) => {
        const jwt = store.get("session");
        exportEventLog(jwt)
    })

    // win.openDevTools(); // Open DevTools
    win.loadFile("login.html");
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});