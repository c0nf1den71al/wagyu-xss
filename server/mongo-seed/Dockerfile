FROM mongo:latest

COPY ./initUsers.json /initUsers.json
COPY ./initPayloads.json /initPayloads.json
CMD mongoimport --host mongodb --db wagyu --collection users --type json --file /initUsers.json --jsonArray; mongoimport --host mongodb --db wagyu --collection payloads --type json --file /initPayloads.json --jsonArray --mode upsert --upsertFields name