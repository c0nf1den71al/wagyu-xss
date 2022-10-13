# Wagyu XSS
A dynamic cross-site scripting (XSS) payload delivery system with team server abilities.

- Standalone desktop client GUI
- Collaborative Team Server

![Client Login Page](./images/client-login.png) ![Client Payloads Table](./images/client-payloads.png)

---
## Manual Installation
### Team Server
* Install [Docker](https://docs.docker.com/engine/installation/)
* Clone this repository
* `cd /server`
* `npm install`
* Modify the environment variables within the `docker-compose.yml` file:
    - `PORT` is used to define the port the teamserver will run on
    - `TOKEN_SECRET` is the secret used to sign JWTs
    - `TEAMSERVER_URI` is the IP address or domain which members will use to authenticate into the teamserver
* Run `docker compose up -d` to start the teamserver


### Client
* Install [Node.js](https://nodejs.org/en/download/)
* Clone this repository
* `cd /client`
* `npm install`
* `npm start`
* Login with the default credentials `wagyu:wagyu`
---
## To-do List
### Client
- [x] Fetch hosts from DB
- [x] Command history
- [x] Change callback to s not ms
- [x] Host changes to offline when not called back for 5 mins
- [ ] 'Login failed' UI response
- [ ] Modal windows for admin user management
- [ ] Drag to resize?
- [ ] Risk help info button
- [ ] Implant jitter?
- [ ] Command prompts are per-host (not one single prompt)
- [ ] Right click menu

### Server
- [x] Implant callback interval
- [x] Validate teamserver address when generating implants (remove trailing /, add protocol etc).
- [x] Send loot to findings tab
- [ ] Validate user session
- [ ] Account logout
- [ ] Change Password
- [ ] Account privileges (admin user can add, modify users - that's all)
- [ ] More opperations need to be added to Event log
- [ ] Export event log option
- [ ] Obfuscate/Minify payloads

### Misc
- [x] Explain env vairables in README.md
- [ ] Wiki
- [ ] Change database initial seed to a script not container. This will enable the default user to be created with a time.

## Payload Ideas

|Name|Description|Browser Compatibility|Category|Risk (Will the victim notice this? 1-5)|Done?|
|---|---|---|---|---|---|
|basic-alert|Inject a basic alert popup into the victims browser|All Browsers|Misc|5|Yes|
|screenshot|Screenshot the victims browser window||Data Exfiltration||No|
|webcam-snap|||||No|
|redirect|||||No|
|steal-cookies|||||Yes|
|cache-poison|||||No|
|port-scan|||||No|
|crash-tab|||||Yes|
|keylogger|||||No|
|rickroll|||||Yes|


## Known Issues
* If a payload redirects the user, the command to set the payload as executed is never complete. Therefore, the redirect happens whenever the user returns to the page.
* Unacknowledged alerts cause the script to hang and queue is never cleared.
