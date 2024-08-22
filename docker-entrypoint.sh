#!/bin/bash
set -e

SETUP_SCRIPT=/root/setup.sh

# Set # of hard links to 1 to keep cron happy.
touch /etc/cron.d/php /var/spool/cron/crontabs/www-data /etc/crontab

if [ -x $SETUP_SCRIPT ]; then
	echo 'Running one-time setup.'
	source $SETUP_SCRIPT
	rm -f $SETUP_SCRIPT
fi

exec /usr/bin/supervisord -c /etc/supervisor/supervisord.conf
