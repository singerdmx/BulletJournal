0 0 * * * sh /root/ws/BulletJournal/deployment/db_backup.sh 2>&1 | tee /tmp/cronjob.log
30 12 2 * * /usr/bin/find /root/docker/volumes/db_backup/ -type f -mtime +30  -exec rm {} +h