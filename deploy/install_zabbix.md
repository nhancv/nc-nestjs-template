# Install Server

- Install here: https://www.zabbix.com/download?zabbix=5.4&os_distribution=ubuntu&os_version=20.04_focal&db=postgresql&ws=nginx
- Config server:

```
nano /etc/zabbix/zabbix_server.conf
===>
Update DB information
```

- Config frontend web

```
nano /etc/zabbix/web/zabbix.conf.php
===>

# Update DB information, must be matched with server config above
....

# Integrate with server
ZBX_SERVER = '**your zabbix ip address or name**';
ZBX_SERVER_PORT = '10051';
ZBX_SERVER_NAME = '**your zabbix hostname**';

Example
$ZBX_SERVER                     = 'localhost';
$ZBX_SERVER_PORT                = '10051';
$ZBX_SERVER_NAME                = 'zabbix.nhancv.com';
```

- Restart server

```
sudo systemctl restart zabbix-server
sudo systemctl status zabbix-server
ps -ef | grep zabbix
```

# Setup Agent

- Access to vps agent -> Install zabbix-agent

```
wget https://repo.zabbix.com/zabbix/5.4/ubuntu/pool/main/z/zabbix-release/zabbix-release_5.4-1+ubuntu20.04_all.deb
dpkg -i zabbix-release_5.4-1+ubuntu20.04_all.deb
apt update
apt install zabbix-agent

# If you enable firewall -> open ufw port 10050 for agent also
```

- Public agent

```
sudo nano /etc/zabbix/zabbix_agentd.conf
===>
Server=127.0.0.1,zabbix.nhancv.com
ServerActive=127.0.0.1,zabbix.nhancv.com
Hostname=zabbix.nhancv.com
```

- Restart agent

```
systemctl enable zabbix-agent
systemctl restart zabbix-agent
systemctl status zabbix-agent
```

Add host to Server

- Access to zabbix server website
- Configuration -> Hosts -> Create host
  - Host config: Add Agent interface
  - Select Templates tab -> Select "Linux by Zabbix agent"
- Add
- Wait a minute and reload
