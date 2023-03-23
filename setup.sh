#!/bin/bash

USER="your_username"

sed -i "s/{{USER}}/$USER/g" script.sh fixer.js

# Here's the heredoc for the crontab entry
read -r -d '' ENTRY << EOF
*/30 * * * * /home/$USER/ssl_point_port/script.sh >> /home/$USER/ssl_point_port/history.log 2>&1
EOF

(crontab -l 2>/dev/null; echo -e "$ENTRY\n") | crontab -

echo "Setup complete."
