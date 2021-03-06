# Deploy

## Server
```
ssh root@1.2.3.4
```

## Setup git
```
sudo apt install git -y
```

## Setup nodejs
```
curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pm2
sudo npm install pm2 -g
pm2 install pm2-logrotate
```

## Install MongoDB
```
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list

sudo apt-get update
sudo apt-get install -y build-essential
sudo apt-get install -y mongodb-org
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

- Setup db auth
```
mongo
> use admin;
> db.createUser({
      user: "admin",
      pwd: "ADMIN_PASSWORD_HERE",
      roles: [
                { role: "userAdminAnyDatabase", db: "admin" },
                { role: "readWriteAnyDatabase", db: "admin" },
                { role: "dbAdminAnyDatabase",   db: "admin" }
             ]
  });

> use nhancv;
> db.createUser({
      user: "u_nhancv",
      pwd: "DB_PASSWORD_HERE",
      roles: [
                { role: "userAdmin", db: "nhancv" },
                { role: "dbAdmin",   db: "nhancv" },
                { role: "readWrite", db: "nhancv" }
             ]
  });
```

- Public db
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

- Restart db
```
sudo service mongod restart

# Check status to make sure db config is correct
sudo service mongod status
```

- Test connection
```
mongo -u u_nhancv -p DB_PASSWORD_HERE 127.0.0.1/nhancv
```

## (OPTIONAL FOR DOMAIN)
## Install nginx
```
sudo apt update
sudo apt install nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

## Create domain config
```
File: api.nhancv.com
```

## Setup SSL Https
```
sudo apt update
sudo apt install software-properties-common -y
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt update
sudo apt install certbot python-certbot-nginx  -y
sudo certbot --nginx

* Select redirect all request to HTTPS, nginx will update domain config automatically
```

## Prepare source
- Clone source
```
git clone https://github.com/nhancv/nhancv-api.git
cd nhancv-api
```

- Create .env
```
# env: dev, prod
ENV=prod
```

## Open firewall ports
```
sudo ufw allow 3000
```

## Run app
- In the first time
```
# Install dep
npm i
pm2 start npm --name nhancv-prod -- run start:prod
```
- Reload app
```
pm2 reload nhancv-prod
```
- View logs
```
pm2 logs nhancv-prod
```

## Api endpoint

```
api.nhancv.com
- http://1.2.3.4:3000/api
- http://1.2.3.4:3000/docs
```

## (OPTIONAL) Start dev on multi terminal on VPS with tmux

### Install tmux
```
sudo apt install tmux

#### tmux basic command
# New session
tmux

# Inside current session
## Create another session
Ctrl + B + :new<CR>
## View and select session on list
Ctrl + B + s

# Kill session (can not attach anymore)
Ctrl + D

# Detach session (can be attach again)
Ctrl + B + D

# Attach session
tmux a
tmux a -t sessionId

# View list of session
tmux ls
```

### Install local https server
```
npm i -g local-web-server
```

### Start debug mode
```
# new/attach tmux section
tmux a

# start client
cd nhancv-api/client
ws --http2

# endpoint
# https://1.2.3.4:8000/

# detach tmux
Ctrl + B + D
```
