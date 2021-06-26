# MongoDB Replica Setup

- Setup MongoDB
- Config replica

## Setup MongoDB

[Install doc](./install_server.md)

## Config replica

- Option 1: Use separate 3 vps - 3 instances mongod
- Option 2: (For test) Use 1 vps and create 3 instances mongod with difference db path and port

## Demonstration with `Option 2`

### Replicaset information
```
N1: Primary Node 1
- Port: 2717
- DB Path: $HOME/mongos/db1
- Command: mkdir -p $HOME/mongos/db1; mongod --noauth --bind_ip_all --port 2717 --dbpath $HOME/mongos/db1 --replSet rs0

N2: Secondary Node 2
- Port: 2727
- DB Path: $HOME/mongos/db2
- Command: mkdir -p $HOME/mongos/db2; mongod --noauth --bind_ip_all --port 2727 --dbpath $HOME/mongos/db2 --replSet rs0

N3: Secondary Node 3
- Port: 2737
- DB Path: $HOME/mongos/db3
- Command: mkdir -p $HOME/mongos/db3; mongod --noauth --bind_ip_all --port 2737 --dbpath $HOME/mongos/db3 --replSet rs0
```

### Useful commands for Primary Node
- rs.status(): Tells the status of replica set
- rs.initiate(): Initiates a replica set on primary node
- rs.add("localhost:2727"): Adds a member to replica set
- rs.remove("localhost:2727"): Removes a member from replica set

### Setup

- Open 3 terminal sessions to create 3 instances mongodb as 3 nodes (no auth, allow access from all ip). Run node's command
- Open 3 more terminal sessions to access 3 nodes
- Go with Primary Node: N1
```
mongo --port 2717
> rs.status()
> rs.initiate()
rs0:SECONDARY> <enter>
rs0:PRIMARY> rs.status()
# check member info, current has only primary node
rs0:PRIMARY> rs.add("localhost:2727")
rs0:PRIMARY> rs.add("localhost:2737")
```
- Go to N2
```
mongo --port 2727
> rs.secondaryOk()
```

- Go to N3
```
mongo --port 2737
> rs.secondaryOk()
```

### Verify


- Ctrl + C to terminal N1 port 2717
- Access to node 2727 via `mongo --port 2727` and N2 now become a primary node, instance 2717 status is "not reachable/healthy"
- Run N1's command to resume 2717 instance and check `rs.status()` -> N2 still is a primary node and 2717 is Secondary Node
- Create new sample db test
```
Primary node:
rs0:PRIMARY> show dbs
rs0:PRIMARY> use test
rs0:PRIMARY> db.users.insert({"name":"nhancv"})
WriteResult({ "nInserted" : 1 })
rs0:PRIMARY> db.users.find()
{ "_id" : ObjectId("60d7035e05a5bc7636da0dbf"), "name" : "nhancv" }

Secondary node:
rs0:SECONDARY> show dbs
rs0:SECONDARY> db.users.find()
{ "_id" : ObjectId("60d7035e05a5bc7636da0dbf"), "name" : "nhancv" }
```

### Check mongodb instance info

```
sudo lsof -i | grep mongo
```

### Connecting to replica set

- MongoDB URI typically:
```mongodb://localhost:27017```

- Now for Replica sets:
```mongodb://localhost:2717,localhost:2727,localhost:2737/?replicaSet=rs0```

### Security Replica Set

#### Enable ufw and open specific port
```
sudo ufw status
# Enable firewall on server without SSH disconnect
sudo ufw default allow
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw default deny

# Allow from anywhere access to mongodb ports
sudo ufw allow 2717,2727,2737/tcp

# Or allow from specific host access to specific port 27017
sudo ufw allow from <client_ip_address> to any port 27017
```

### How to access Replicate Set from external?

> The last sentence is important: "In conclusion, to support key features of replica sets, we require that the hostnames used in a replica set config are reachable from the client." So this means that the hostnames in the config have to be visible/accessible from outside.

We need specific domain or real ip instead localhost when adding replica

```
rs0:PRIMARY> rs.add("<ip_1>:2727")
rs0:PRIMARY> rs.add("<ip_2>:2737")
```

- To update replicate host name, access to PRIMARY node first
```
mongo --port 2717

rs0:PRIMARY> cfg = rs.conf()
rs0:PRIMARY> cfg.members[0].host = "192.168.1.11:2717"
rs0:PRIMARY> cfg.members[1].host = "192.168.1.11:2727"
rs0:PRIMARY> cfg.members[2].host = "192.168.1.11:2737"
rs0:PRIMARY> rs.reconfig(cfg)
```

### How to enable authentication Replicate Set

- With `Option 2`, access to PRIMARY node create new user admin, remove `--noauth` in node's command before run. This option for test deployment only

#### Config for OPTION 1 (Separated VPS)

- Create `admin` account: [install_server.md](./install_server.md)

- Generate key for Replicate Set
```
mkdir -p /etc/mongodb/keys
openssl rand -base64 756 > /etc/mongodb/keys/mongo-key
chmod 400 /etc/mongodb/keys/mongo-key
chown -R mongodb:mongodb /etc/mongodb
```

- Update mongodb config

```
$ sudo nano /etc/mongod.conf

# network interfaces
net:
  port: 27017
  bindIp: <current_node_ip>

#security:
security:
  authorization: 'enabled'
  keyFile:  /etc/mongodb/keys/mongo-key

#replication:
replication:
  replSetName: 'rs0'
```

- Restart MongoDB Service
```
sudo systemctl restart mongod
```

* Copy `mongo-key` to all node and update `mongodb config` to all as well

#### Verify connection form client

```
mongo "mongodb://192.168.1.11:2717,192.168.1.11:2727,192.168.1.11:2737/?replicaSet=rs0"
```

