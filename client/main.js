const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require("electron")
const login = require("./helpers/auth")
const { getAllEventLogs, createEventLog } = require("./helpers/eventLogs")
const { getAllImplants, deleteImplantById } = require("./helpers/implants");
const { getAllPayloads } = require("./helpers/payloads");
const { getAllHosts } = require("./helpers/hosts");
const { getAllFindings, deleteFindingById } = require("./helpers/findings");
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
        icon: path.join(__dirname, "wagyu.ico")
    })

    const store = new Store();

    ipcMain.on("login", (event, username, password, server) => {
        global.server = server;
        global.username = username;
        (async function (username, password) {
            const jwt = await login(username, password);
            if (await jwt) {
                store.set("session", await jwt);
                await createEventLog(jwt, "Team Server", `Operator ${username} joined the team server`, "info");
                await win.loadFile("index.html");
            } // else {
            // handle error here
            // }
        })(username, password, server);
    });

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

    ipcMain.handle("getAllPayloads", async (event) => {
        const jwt = store.get("session");
        const payloads = await getAllPayloads(jwt);
        event.sender.send("payloads", payloads);
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

    ipcMain.handle("processCommand", async (event, command) => {
        const jwt = store.get("session");
        try {
            const result = await processCommand(jwt, command);
            event.sender.send("refreshImplants");
            return await result;
        } catch (e) {
            return "Error: " + e;
        }
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