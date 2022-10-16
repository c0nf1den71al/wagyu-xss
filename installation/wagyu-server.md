---
description: How to install the Wagyu team server
---

# Wagyu Server

### Requirements

The `wagyu-server` binary will install all of the necerssarry requirements, however, if you are looking to manually install the team server the following packages are required

* Docker (inc. docker compose)
* NodeJS and NPM

### Configuration

There are numerous environment variables which are required for the team server to function correctly. These variables are stored under the `environment` section of the `/server/docker-compose.yml` file.

| Variable | Description | Required |
| -------- | ----------- | -------- |
|          |             |          |
|          |             |          |
|          |             |          |

### wagyu-server

The `wagyu-server` binary has been created to provide an easy way to install and manage the team server. Whilst this binary is currently in development the following commands are available:

{% code title="Install and start the team server" %}
```shell
./wagyu-server.source install
```
{% endcode %}

{% hint style="warning" %}
This command does not currently install the requirements.
{% endhint %}

{% code title="Start the team server" %}
```shell
./wagyu-server.source start
```
{% endcode %}

{% code title="Stop the team server" %}
```shell
./wagyu-server.source stop
```
{% endcode %}
