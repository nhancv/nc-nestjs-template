## DB backup
https://www.digitalocean.com/community/tutorials/how-to-back-up-restore-and-migrate-a-mongodb-database-on-ubuntu-14-04

# Backup:

## Create backup directory
```
sudo mkdir /var/backups/mongobackups/
```

## Backup command
```
sudo mongodump --username DB_USERNAME --password DB_PASSWORD --db nhancv --db nhancv --out /var/backups/mongobackups/`date +"%m-%d-%y"`
```

## Create daily backup
```
sudo crontab -e
```

## Inside the crontab prompt insert the following mongodump command:
```
## Create daily backup
# Every day at 12:00 AM
0 0 * * * mongodump --username DB_USERNAME --password DB_PASSWORD --db nhancv --out /var/backups/mongobackups/`date +"%m-%d-%y"`
```

### Delete all the backups older than 7 days you can use the following bash command:
```
find /var/backups/mongobackups/ -mtime +7 -exec rm -rf {} \;
```

### Config auto delete old backups
```
sudo crontab -e

### Config auto delete old backups
# At 12:00:01 AM
1 0 * * * find /var/backups/mongobackups/ -mtime +7 -exec rm -rf {} \;
```

# Restoring and Migrating a MongoDB Database
```
sudo mongorestore --username DB_USERNAME --password DB_PASSWORD --db nhancv --drop /var/backups/mongobackups/10-09-20/nhancv/
```






