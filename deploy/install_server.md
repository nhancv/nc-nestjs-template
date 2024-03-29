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

# [Optional] Sync time
sudo date -s "$(wget -qSO- --max-redirect=0 google.com 2>&1 | grep Date: | cut -d' ' -f5-8)Z"

# Confirm Timezone Change
timedatectl
```

## Setup git

```
sudo apt install -y git
```

## Setup nodejs

```
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

** Note for conflict version 12.18.2~dfsg-1ubuntu2:
Unpacking nodejs (15.14.0-deb-1nodesource1) over (12.18.2~dfsg-1ubuntu2) ...
dpkg: error processing archive /var/cache/apt/archives/nodejs_15.14.0-deb-1nodesource1_amd64.deb (--unpack):
 trying to overwrite '/usr/share/doc/nodejs/api/cli.json.gz', which is also in package nodejs-doc 12.18.2~dfsg-1ubuntu2
dpkg-deb: error: paste subprocess was killed by signal (Broken pipe)
Errors were encountered while processing:
 /var/cache/apt/archives/nodejs_15.14.0-deb-1nodesource1_amd64.deb
E: Sub-process /usr/bin/dpkg returned an error code (1)

---> Solved:
- Uninstall old version
sudo apt-get purge -y nodejs npm
sudo apt-get purge -y nodejs-legacy npm

- Install required lib and upgrade:
sudo apt install libnode72
sudo apt update
sudo apt upgrade

- Install new version:
+ Read the cache apt node path from error, replace to below command:
sudo dpkg -i --force-overwrite /var/cache/apt/archives/nodejs_15.14.0-deb-1nodesource1_amd64.deb
+ Re-install with command above

** Note for error: "The certificate is NOT trusted"
- Install ca-certificates, then install nodejs again
sudo apt install ca-certificates

# [Optional] Install yarn
sudo npm install --global yarn

# Install pm2
sudo npm install pm2 -g
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:retain 10
```

## Install MongoDB

- Uninstall previous version

```
sudo apt-get purge mongodb-*
```

- Install new

```
* Check linux version: lsb_release -a
sudo apt install wget
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

* https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/
* Debian 10 "Buster"
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

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
- Get version: mongod --version
- Start: sudo service mongod start
- Verify status: sudo cat /var/log/mongodb/mongod.log or sudo systemctl status mongod
- Stop: sudo service mongod stop
- Restart: sudo service mongod restart
- Status: sudo systemctl status mongod
```

- Create `admin` account

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
npm i
```

- Start app

```
pm2 --name nhancv-prod start npm -- run start:prod

# Custom log date
pm2 --log-date-format="YYYY-MM-DD HH:mm Z" --name nhancv-prod start npm -- run start:prod

# No Auto Restart
# https://pm2.keymetrics.io/docs/usage/restart-strategies/
pm2 --name nhancv-prod --no-autorestart start npm -- run start:prod

```

- Reload app

```
pm2 reload nhancv-prod --update-env
```

- View logs

```
pm2 logs nhancv-prod
```

- Monitor

```
pm2 monit
```

- Stop/Delete all

```
pm2 stop all
pm2 delete all
```

- Stop and start

```
PROJECT_ID=nhancv-prod
pm2 delete -s $PROJECT_ID || :
pm2 --name $PROJECT_ID start npm -- run start:prod
```

## Autostart after reboot

```
Save current process or Freeze a process list on reboot via:
$ pm2 save

Register Startup Script
$ pm2 startup

Un-register startup on boot:
$ pm2 unstartup systemd

After save process list, you can manually restore list after reboot instead of restart each process or use Startup Script
$ pm2 resurrect

Check system log here
sudo cat /var/log/syslog
```

## [Optional] Run app in Cluster mode

Make sure your application is stateless: share database/cache, cronjob

https://www.youtube.com/watch?v=t6YOCZ_XAhI

```
# Start all applications
pm2 start ecosystem.config.js

or
pm2 --name nhancv-prod -i max start npm -- run start:prod

# Stop all
pm2 stop ecosystem.config.js

# Restart all
pm2 restart ecosystem.config.js

# Reload all
pm2 reload ecosystem.config.js

# Delete all
pm2 delete ecosystem.config.js
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

### Stress test

```
JOUT=jmeter_`date +"%y%m%d_%H%M%S"` && mkdir -p $JOUT && jmeter -n -t jmeter_test.jmx -l $JOUT/result.log -j $JOUT/out.log -e -o $JOUT/html
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

[api.nhancv.com](./api.nhancv.com)

```
File: api.nhancv.com
```

## Setup SSL Https

```
[OBSOLETED]
sudo apt update
sudo apt install software-properties-common -y
sudo add-apt-repository universe
# Ubuntu < 20.04
  sudo add-apt-repository ppa:certbot/certbot
# Ubuntu 20.04
  sudo apt-add-repository -r ppa:certbot/certbot
sudo apt update
sudo apt install certbot python-certbot-nginx  -y

[LATEST WAY]
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx

* Select redirect all request to HTTPS, nginx will update domain config automatically

--- Deal with error when add ppa:cerbot, try install nginx from source
** Install certbot from source:
curl -o- https://raw.githubusercontent.com/vinyll/certbot-install/master/install.sh | bash

# To list all domain can be review
sudo certbot renew

# To manually renew all certs
sudo certbot renew --dry-run
```

## (Optional) Setup Nginx HTTP load balancer

https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/

[api.nhancv.com_cluster](./api.nhancv.com_cluster)
