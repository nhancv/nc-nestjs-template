# MongoDB Replica Setup

- Setup MongoDB
- Config replica

## Setup MongoDB

```
* Check linux version: lsb_release -a
sudo apt install wget
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

* https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/
* Debian 10 "Buster"
echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

* https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
* Ubuntu 20.04 (Focal)
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

sudo apt update
sudo apt install -y build-essential
sudo apt install -y mongodb-org
sudo systemctl enable mongod
sudo service mongod start

```

- Controls
```
- Start: sudo service mongod start
- Verify status: sudo cat /var/log/mongodb/mongod.log or sudo systemctl status mongod
- Stop: sudo service mongod stop
- Restart: sudo service mongod restart
- Status: sudo systemctl status mongod
```

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

#### How to access Replicate Set from external?

> "In conclusion, to support key features of replica sets, we require that the hostnames used in a replica set config are reachable from the client." So this means that the hostnames in the config have to be visible/accessible from outside.

We need specific domain or real ip instead localhost when adding replica

```
rs0:PRIMARY> rs.add("<ip_1>:2727")
rs0:PRIMARY> rs.add("<ip_2>:2737")
```

- To update replicate host name, access to PRIMARY node:
```
mongo --port 2717

rs0:PRIMARY> cfg = rs.conf()
rs0:PRIMARY> cfg.members[0].host = "192.168.1.11:2717"
rs0:PRIMARY> cfg.members[1].host = "192.168.1.11:2727"
rs0:PRIMARY> cfg.members[2].host = "192.168.1.11:2737"
rs0:PRIMARY> rs.reconfig(cfg)
```

#### How to enable authentication Replicate Set

- With `Option 2`, access to PRIMARY node create new user admin, remove `--noauth` in node's command before run. This option for test deployment only

##### Config for OPTION 1 (Separated VPS)

- Create `root` account: https://docs.mongodb.com/manual/reference/built-in-roles/

###### `root` role has `clusterAdmin` permission

```
# If you forget old access password, just update config to disable authentication and restart. After add password, enable again.
> use admin;
> db.createUser({
      user: "root",
      pwd: "ROOT_PASSWORD",
      roles: [{ role: "root", db: "admin" }]
  });
```

- Verify password after create `root` account
```
mongo -u root -p --authenticationDatabase admin

rs0:PRIMARY > rs.status()
```

- Create `admin` account and specific account for each database. Root account just use for maintain cluster only.

```
mongo
> use admin;
> db.createUser({
      user: "admin",
      pwd: "ADMIN_PASSWORD",
      roles: [
                { role: "userAdminAnyDatabase", db: "admin" },
                { role: "readWriteAnyDatabase", db: "admin" },
                { role: "dbAdminAnyDatabase",   db: "admin" }
             ]
  });

> use DB_NAME;
> db.createUser({
      user: "DB_USERNAME",
      pwd: "DB_PASSWORD",
      roles: [
                { role: "userAdmin", db: "DB_NAME" },
                { role: "dbAdmin",   db: "DB_NAME" },
                { role: "readWrite", db: "DB_NAME" }
             ]
  });
```

- Connection URI to specific Database
```
Connection URI to specific Database:
mongodb://DB_USERNAME:DB_PASSWORD@IP_NODE1:27017,IP_NODE2:27017,IP_NODE2:27017/DB_NAME?replicaSet=rs0&authSource=DB_NAME
```

- Generate key for Replicate Set
```
mkdir -p /etc/mongodb/keys
openssl rand -base64 756 > /etc/mongodb/keys/mongo-key
chmod 400 /etc/mongodb/keys/mongo-key
chown -R mongodb:mongodb /etc/mongodb
```

- Update MongoDB config

```
sudo nano /etc/mongod.conf

# network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1,<current_node_ip>

#security:
security:
  authorization: 'enabled'
  keyFile: /etc/mongodb/keys/mongo-key

#replication:
replication:
  replSetName: 'rs0'
```

- Restart MongoDB Service
```
sudo service mongod restart
sudo service mongod status

# If restart fail -> read mongo log
cat /var/log/mongodb/mongod.log
=> Solve error: "Failed to unlink socket file"
rm -rf /tmp/mongodb-27017.sock
rm -rf /var/lib/mongodb/mongod.lock
```

* Copy `mongo-key` to all node and update `mongodb config` to all as well

##### Verify connection form client

```
# Connect to default admin database:
mongo "mongodb://192.168.1.11:2717,192.168.1.11:2727,192.168.1.11:2737/?replicaSet=rs0"
```


### How to config SRV + TXT for MongoDB Replica Set URI?

- Access to Domain dashboard -> Advanced DNS
- Add some config types here:

**TYPE A**
```
TYPE A
#1
Host: rs1-dev
IP: 192.168.1.10

#2
Host: rs2-dev
IP: 192.168.1.11

#3
Host: rs3-dev
IP: 192.168.1.12
```

**TYPE SRV**
```
#1
Service: _mongodb
Protocol: _tcp.rs-dev
Priority: 0
Weight: 5
Port: 27017
Target: rs1-dev.nhancv.com
TTL: 86400

#2
Service: _mongodb
Protocol: _tcp.rs-dev
Priority: 0
Weight: 5
Port: 27017
Target: rs2-dev.nhancv.com
TTL: 86400

#3
Service: _mongodb
Protocol: _tcp.rs-dev
Priority: 0
Weight: 5
Port: 27017
Target: rs3-dev.nhancv.com
TTL: 86400
```

**TYPE TXT**
```
Host: rs-dev
Target: ssl=false&replicaSet=rs0&authSource=admin
```

- Verify hostname

```
nslookup
> set type=SRV
> _mongodb._tcp.rs-dev.nhancv.com

Non-authoritative answer:
_mongodb._tcp.rs-dev.nhancv.com	service = 0 5 27017 rs1-dev.nhancv.com.
_mongodb._tcp.rs-dev.nhancv.com	service = 0 5 27017 rs2-dev.nhancv.com.
_mongodb._tcp.rs-dev.nhancv.com	service = 0 5 27017 rs3-dev.nhancv.com.
```

- Access to PRIMARY node and update replicate host name

```
mongo -u root -p

rs0:PRIMARY> cfg = rs.conf()
rs0:PRIMARY> cfg.members[0].host = "rs1-dev.nhancv.com:27017"
rs0:PRIMARY> cfg.members[1].host = "rs2-dev.nhancv.com:27017"
rs0:PRIMARY> cfg.members[2].host = "rs3-dev.nhancv.com:27017"
rs0:PRIMARY> rs.reconfig(cfg)
```

- New connection URI
```
FULL:
mongodb://DB_USERNAME:DB_PASSWORD@rs1-dev.nhancv.com:27017,rs2-dev.nhancv.com:27017,rs3-dev.nhancv.com:27017/DB_NAME?replicaSet=rs0&authSource=DB_NAME

SHORT with SRV: (ssl=false is must)
mongodb+srv://DB_USERNAME:DB_PASSWORD@rs-dev.nhancv.com/DB_NAME?ssl=false&replicaSet=rs0&authSource=DB_NAME
```
