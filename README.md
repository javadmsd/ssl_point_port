This Node.js script automates updating SSL certificates for multiple virtual hosts on an Apache web server. After AutoSSL runs in cPanel, this script updates new SSL file paths in virtual host configuration by reading the configuration information which includes file paths for SSL certificates, hosting files, and virtual host configuration, and compares it against an SSL database file for the server.

# Dependencies

- Cpanel
- Centos
- Node 16

# How to use

In order to use this script, follow these simple steps:

1. Run the following command in /home/`{{USER}}`

- Note: Replace {{USER}} with the actual account's user.

```
git clone https://github.com/javadmsd/ssl_point_port.git
```

2. Type `cd ssl_point_port` and press enter. You should now be in the ssl_point_port directory

3. Type `npm i` in the terminal to install the necessary dependencies.

4. Type chmod +x `script.sh` and chmod +x `certbot_renew.sh` in the terminal and press enter. This will make the script executable.

5. Open the `script.sh` and `fixer.js` files and change any instance of `{{USER}}` to the user's account.

6. Use the command `crontab -e` to open the cron jobs.

7. Press `i` on the keyboard to insert a new line.

8. Type the following line and replace `{{USER}}` with the user's account name:

```
*/30 * * * * /home/{{USER}}/ssl_point_port/script.sh >> /home/{{USER}}/ssl_point_port/history.log 2>&1
*/15 * * * * /home/{{USER}}/ssl_point_port/certbot_renew.sh >> /home/{{USER}}/ssl_point_port/history_certbot.log 2>&1
```

9. Press `Esc`.

10. Type `:wq` and press `Enter` to save the changes.

Now the script is ready to be used.

---

## Apache configuration

`pre_virtualhost_global.conf`

### Sample

```
<VirtualHost example.com:80>
        ServerName example.com
        Redirect / https://example.com/
</VirtualHost>

<VirtualHost example.com:443>
    ServerName example.com
    SSLEngine on
    SSLCertificateFile /home/example/ssl/certs/_example.com_db26....crt
    SSLCertificateKeyFile /home/example/ssl/keys/db2....key
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```
