# Deploy

## Server
```
ssh root@1.2.3.4

# Add user
:~# adduser nhancv
:~# adduser nhancv sudo
:~# usermod -aG sudo nhancv

# Config sudo without password
:~# sudo visudo
=> Add to bottom of file
nhancv ALL=(ALL) NOPASSWD: ALL

:~# su - nhancv
:~# exit

ssh nhancv@1.2.3.4
:~$

# Add authorized key to login via ssh key on client
:~$ mkdir ~/.ssh
:~$ ssh-keygen -t rsa
-> copy ssh to register for git version system: cat ~/.ssh/id_rsa.pub

:~$ nano ~/.ssh/authorized_keys
-> copy ~/.ssh/id_rsa.pub on mac client to vps server

```

## Setup timezone (optional)
```
# View current timezone info
timedatectl

# Show all Available Timezones
timedatectl list-timezones

# Set timezone
sudo timedatectl set-timezone Asia/Ho_Chi_Minh

# Confirm Timezone Change
timedatectl
```

## Setup git
```
sudo apt install git -y
```

## Setup nodejs
```
curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt install -y nodejs

# Install pm2
sudo npm install pm2 -g
pm2 install pm2-logrotate
```

## Install MongoDB
```
* Check linux version: lsb_release -a

https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

* Ubuntu 20.04 (Focal)
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
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

- Setup db auth
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
mongo -u DB_USERNAME -p DB_PASSWORD 127.0.0.1/DB_NAME
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
