# Dependencies

- Cpanel
- Centos
- Node 16

# How to use

In order to use this script, follow these simple steps:

1. Create a directory called `ssl_point_port` in the user's account dir by typing mkdir /home/`{{USER}}`/ssl_point_port in the terminal.

2. Type `npm i` in the terminal to install the necessary dependencies.

3. Open the `script.sh` and `fixer.js` files and change any instance of `{{USER}}` to the user's account.

4. Use the command `crontab -e` to open the cron jobs.

5. Press `i` on the keyboard to insert a new line.

6. Type the following line and replace `{{USER}}` with the user's account name:

```
*/30 * * * * /home/{{USER}}/ssl_point_port/script.sh >> /home/{{USER}}/ssl_point_port/history.log 2>&1
```

7. Press `Esc`.

8. Type `:wq` and press `Enter` to save the changes.

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
