---
description: How to compromise a host and execute payloads on the target browser
---

# Hosts

The "**Hosts**" tab within the Wagyu client will display all of the hosts currently calling back to the Wagyu server.

<figure><img src="https://raw.githubusercontent.com/c0nf1den71al/wagyu-xss/main/images/client-hosts.png" alt=""><figcaption><p>Hosts Tab</p></figcaption></figure>

Within the "**Hosts**" tab the following can be found for each host:

* **ID** - The ID of the host
* **Current Status** - The current status of the host. See [Host Status](./#undefined)
* **Public IP** - The public IPv4 address of the target host
* **OS** - The operating system of the target host. This is parsed from the user agent
* **Browser** - The browser which the implant is running in. This is parsed from the user agent
* **Current Tab** - The `title` of the tab the implant is executing in
* **Last Seen** - The time since the host last called back
* **Actions** - Quick actions including copying the host ID, marking the host as `Offline` and deleting the host&#x20;

### Host Status

A host can either be `Online` or `Offline`, this will be indicated in the "**Current Status**" column within the "**Hosts**" tab.

The status can be used to determine whether or not a host is calling back or not, if the status is `Online` it is safe to assume the host is calling back and healthy. Hosts will be marked offline automatically if they do not callback after the implant callback interval + the maximum jitter + 5 seconds.

It is also possible to manually mark hosts as `Offline` using the skull and crossbones icon within the "**Actions**" column of the "**Hosts**" tab.

### Host-Server Communication

To learn more about how hosts use implants to communicate with the Wagyu server, please [click here](../implants/#implant-structure-and-communication)
