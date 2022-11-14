# Wagyu XSS
A dynamic cross-site scripting (XSS) payload delivery system with team server abilities.

- Standalone desktop client GUI
- Collaborative Team Server

![Client Login Page](./images/client-login.png) ![Client Payloads Table](./images/client-payloads.png)
---
## Installation
Please check out the [Wiki](https://wagyu-docs.jamiepegg.com/) for installation instructions.

## To-do List
### Client
- [ ] Delete Hosts
- [ ] Mark host as offline
- [ ] Drag to resize?
- [ ] Implant jitter?
- [ ] Command prompts are per-host (not one single prompt)
- [ ] Right click menu

### Server
- [ ] More operations need to be added to the event log
- [ ] Export event log option
- [ ] Obfuscate/Minify payloads
- [ ] Change database initial seed to a script not container. This will enable the default user to be created with a time.