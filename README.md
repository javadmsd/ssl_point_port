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

4. Open the `script.sh` and `fixer.js` files and change any instance of `{{USER}}` to the user's account.

5. Use the command `crontab -e` to open the cron jobs.

6. Press `i` on the keyboard to insert a new line.

7. Type the following line and replace `{{USER}}` with the user's account name:

```
*/30 * * * * /home/{{USER}}/ssl_point_port/script.sh >> /home/{{USER}}/ssl_point_port/history.log 2>&1
```

8. Press `Esc`.

9. Type `:wq` and press `Enter` to save the changes.

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
