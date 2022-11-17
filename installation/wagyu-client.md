---
description: How to install the Wagyu client.
---

# Wagyu Client

The Wagyu client is built using electron to ensure that the application supports as many cross-platform devices as possibe. Whilst electron is known for being resource heavy, we are constantly working on optamising the client to ensure it remains lightweight.

### Binary Installation

Download the latest Wagyu Client binaries [here](https://github.com/c0nf1den71al/wagyu-xss/releases)****

### Manually Installing The Client From Source

#### Requirements

The following packages are required for the Wagyu client:

* NodeJS and NPM

{% hint style="info" %}
These packages are only required when starting the client from source. They are not required when using the Wagyu Client binary.
{% endhint %}

#### Instructions

If you want to run the client from source for development you can do so by first changing into the `client` directory and then installing the required node packages:

```shell
cd client && npm install
```

The electron client application can then be started by using:

```shell
npm start
```
