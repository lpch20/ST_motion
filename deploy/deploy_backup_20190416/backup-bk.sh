
#!/bin/bash
mysqldump -u root -p'espanhaRoletti30!' --hex-blob requiro -r /root/db-backup/data/requiro/requiro_$(date +%Y-%m-%d-%H.%M.%S).sql
mysqldump -u root -p'espanhaRoletti30!' --hex-blob requiro_test -r /root/db-backup/data/requiro/requiro_test_$(date +%Y-%m-%d-%H.%M.%S).sql
mysqldump -u root -p'espanhaRoletti30!' master_stmotion -r /root/db-backup/data/requiro/master_stmotion_$(date +%Y-%m-%d-%H.%M.%S).sql

find /root/db-backup/data/requiro/ -type f -name '*.sql' -mtime +10 -exec mv {} /root/db-backup/data/requiro/archive/ \;
find /root/db-backup/data/requiro/archive/ -type f -name '*.sql' -mtime +30 -exec rm {} \;
