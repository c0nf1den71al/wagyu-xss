---
description: How to setup and install the Wagyu team server.
---

# Wagyu Server

### Requirements

The `wagyu-server` binary will install all of the necerssarry requirements, however, if you are looking to manually install the team server the following packages are required

* Docker (inc. docker compose)
* NodeJS and NPM

### Configuration

There are numerous environment variables which are required for the team server to function correctly. These variables are stored under the `environment` section of the `/server/docker-compose.yml` file and must be changed before the installation of the team server.

| Variable         | Description                                                                         | Default Value                                        | Required                |
| ---------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------- |
| `MONGODB_URI`    | The connection string which the team server will use to connect to the database.    | `mongodb://mongodb:27017/wagyu`                      | Yes                     |
| `PORT`           | The port which the team server will listen on.                                      | `3000`                                               | Yes                     |
| `TOKEN_SECRET`   | The secret key used to sign JWTs.                                                   | `2d57079ad13b2779b0cd17b4fecf94b6`                   | Yes, change recommended |
| `TEAMSERVER_URI` | The public domain or IP address which users will use to connect to the team server. | ``[`http://localhost:3000`](http://localhost:3000)`` | Yes                     |

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

### Manually Installing The Server

In order to manually install the team server, you first much change into the `server` directory and install the required node packages:

```shell
cd server && npm install
```

Once the required packages are installed, the server can be brought up by using docker compose:

```shell
docker compose up
```

{% hint style="info" %}
You can add the `-d` flag to detatch the docker instance and have it run in the background.
{% endhint %}

### Database Seeding

On the first launch of the team server, the mongo database container will be seeded with an initial user `wagyu` and multiple template payloads. Whilst the default values are recommended, these can be changed by editing the two JSON files `/server/mongo-seed/initUsers.json` and `/server/mongo-seed/initPayloads.json`.
