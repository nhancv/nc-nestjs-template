# Moving app and domain

## Context

- Current domain `nhancv.com`
- Current nginx server `1.1.1.1`
- Application running on current server
- Destination nginx server `2.2.2.2`
- Target: move application form current to destination without any interruption when access via domain

## How?
- Setup application on destination server `2.2.2.2`
- Setup nginx virtual domain -> Copy all domain config from `1.1.1.1` to `2.2.2.2`
  + /etc/nginx/sites-available/nhancv.com -> /etc/nginx/sites-available/nhancv.com
  + /etc/letsencrypt/`live`/nhancv.com/fullchain.pem -> /etc/letsencrypt/`tmp`/nhancv.com/fullchain.pem
  + /etc/letsencrypt/`live`/nhancv.com/privkey.pem -> /etc/letsencrypt/`tmp`/nhancv.com/privkey.pem
- Create Certbot ssl config if it does not exist
- Reload nginx on `2.2.2.2`
- Wait dns record update
- Check and make sure app domain work on new server
- Generate new cert+key by new Certbot instance on `2.2.2.2`
- Stop application process on `1.1.1.1`


### Script
```
# Setup nginx virtual domain -> Copy all domain config from `1.1.1.1` to `2.2.2.2`
1.1.1.1 > sudo cat /etc/nginx/sites-available/nhancv.com
2.2.2.2 > sudo nano /etc/nginx/sites-available/nhancv.com

# Copy cert + key from `1.1.1.1` to `2.2.2.2`
1.1.1.1 > sudo cat /etc/letsencrypt/live/nhancv.com/fullchain.pem
2.2.2.2 > sudo mkdir -p /etc/letsencrypt/tmp/nhancv.com
2.2.2.2 > sudo nano /etc/letsencrypt/tmp/nhancv.com/fullchain.pem
1.1.1.1 > sudo cat /etc/letsencrypt/live/nhancv.com/privkey.pem
2.2.2.2 > sudo nano /etc/letsencrypt/tmp/nhancv.com/privkey.pem

# Create Certbot ssl config if it does not exist
2.2.2.2 > sudo cat /etc/letsencrypt/options-ssl-nginx.conf
If not exist, copy from 1.1.1.1
  1.1.1.1 > sudo cat /etc/letsencrypt/options-ssl-nginx.conf
  2.2.2.2 > sudo nano /etc/letsencrypt/options-ssl-nginx.conf
  1.1.1.1 > sudo cat /etc/letsencrypt/ssl-dhparams.pem
  2.2.2.2 > sudo nano /etc/letsencrypt/ssl-dhparams.pem

** Make sure domain config file of SSL similar like this
    listen [::]:443 ssl; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/tmp/nhancv.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/tmp/nhancv.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


# Make domain symbol
2.2.2.2 > sudo ln -s /etc/nginx/sites-available/abc.finalroundx.com /etc/nginx/sites-enabled/
# Reload nginx on `2.2.2.2`
2.2.2.2 > sudo nginx -t
2.2.2.2 > sudo service nginx reload

# Wait dns record update
nslookup nhancv.com

# Check and make sure app domain work on new server
access nhancv.com on browser

# Generate new cert+key and link to current Certbot.
sudo certbot --nginx -d nhancv.com

# Check that domain can be renew. (expect dont see red warning)
sudo certbot renew

# Stop application process on `1.1.1.1`
1.1.1.1 > pm2 stop <process id>
```
