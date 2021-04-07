# Upgrade mongodb from 3.6.3 to 4.4.4

# STOP APPLICATION
# BACKUP DATABASE

```
mongodump --username DB_USERNAME --password DB_PASSWORD --db DB_NAME --out /var/backups/mongobackups/`date +"%m-%d-%y"`
```

# UNINSTALL OLD DATABASE

```
sudo systemctl stop mongodb
sudo apt-get purge mongodb-*
```

# INSTALL NEW ONE

```
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl status mongod
```

## VERIFY INSTALLATION

```
ubuntu@ip-172-31-1-68:~/myubi-wallet-service$ mongod --version
db version v4.4.4
Build Info: {
    "version": "4.4.4",
    "gitVersion": "8db30a63db1a9d84bdcad0c83369623f708e0397",
    "openSSLVersion": "OpenSSL 1.1.1  11 Sep 2018",
    "modules": [],
    "allocator": "tcmalloc",
    "environment": {
        "distmod": "ubuntu1804",
        "distarch": "x86_64",
        "target_arch": "x86_64"
    }
}
```

### Add user role
```
ubuntu:~$ mongo
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

### Public db
```
$ sudo nano /etc/mongod.conf

# network interfaces
net:
  port: 27017
  bindIp: 0.0.0.0

#security:
security:
  authorization: 'enabled'
```

### Restart mongodb
```
sudo systemctl restart mongod
```

# RESTORE DATABASE
```
sudo mongorestore --username DB_USERNAME --password DB_PASSWORD --db DB_NAME --drop /var/backups/mongobackups/`date +"%m-%d-%y"`/DB_NAME/
```

# RESUME APPLICATION
