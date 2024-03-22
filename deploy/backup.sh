
#!/bin/bash
#mysqldump -u root -p'espanhaRoletti30!' --hex-blob requiro_test -r /root/db-backup/data/requiro/requiro_test_$(date +%Y-%m-%d-%H.%M.%S).sql
#mysqldump -u root -p'espanhaRoletti30!' --hex-blob requiro_mt -r /root/db-backup/data/requiro/requiro_mt_$(date +%Y-%m-%d-%H.%M.%S).sql
#mysqldump -u root -p'espanhaRoletti30!' master_stmotion -r /root/db-backup/data/requiro/master_stmotion_$(date +%Y-%m-%d-%H.%M.%S).sql

#find /root/db-backup/data/requiro/ -maxdepth 1 -type f -name '*.sql' -mtime +7 -exec mv {} /root/db-backup/data/requiro/archive/ \;
#find /root/db-backup/data/requiro/archive/ -maxdepth 1 -type f -name '*.sql' -mtime +15 -exec gzip {} \;
#find /root/db-backup/data/requiro/archive/ -maxdepth 1 -type f -name '*.gz' -mtime +180 -exec rm {} \;

#!/bin/bash
ANIO="%Y"
MES="%m"
DIA="%d"
HORA="%H"
MINUTO="%M"
SEGUNDO="%S"
FECHA="$(date +%Y-%m-%d-%H.%M.%S)"
PATH_INICIAL="/root/db-backup/data/requiro"

BD_REQUIRO_NAME="requiro_test_$FECHA"
BD_REQUIRO_SQL="$PATH_INICIAL/$BD_REQUIRO_NAME.sql"
BD_REQUIRO_ZIP="$PATH_INICIAL/$BD_REQUIRO_NAME.zip"

BD_REQUIRO_MT_NAME="requiro_mt_$FECHA"
BD_REQUIRO_MT_SQL="$PATH_INICIAL/$BD_REQUIRO_MT_NAME.sql"
BD_REQUIRO_MT_ZIP="$PATH_INICIAL/$BD_REQUIRO_MT_NAME.zip"

BD_REQUIRO_MULTIPLE_NAME="requiro_multiple3_$FECHA"
BD_REQUIRO_MULTIPLE_SQL="/$PATH_INICIAL/$BD_REQUIRO_MULTIPLE_NAME.sql"
BD_REQUIRO_MULTIPLE_ZIP="/$PATH_INICIAL/$BD_REQUIRO_MULTIPLE_NAME.zip"

BD_REQUIRO_MASTER_NAME="master_stmotion_$FECHA"
BD_REQUIRO_MASTER_SQL="/$PATH_INICIAL/$BD_REQUIRO_MASTER_NAME.sql"
BD_REQUIRO_MASTER_ZIP="/$PATH_INICIAL/$BD_REQUIRO_MASTER_NAME.zip"

echo "Respaldando BD mora tardia"
mysqldump -u root -p'espanhaRoletti30!' --hex-blob requiro_test -r $BD_REQUIRO_SQL
zip $BD_REQUIRO_ZIP $BD_REQUIRO_SQL
rm -f $BD_REQUIRO_SQL
echo "Enviando BD mora tardia"
sshpass -p "requiro*123" scp -p -r -P 5002 -oBindAddress=179.27.98.14 $BD_REQUIRO_ZIP root@200.108.253.229:/home/requiro/call/requiroTransf/data/bk/

echo "Respaldando BD mora temprana"
mysqldump -u root -p'espanhaRoletti30!' --hex-blob requiro_moratemprana -r $BD_REQUIRO_MT_SQL
zip $BD_REQUIRO_MT_ZIP $BD_REQUIRO_MT_SQL
rm -f $BD_REQUIRO_MT_SQL
echo "Enviando BD mora temprana"
sshpass -p "requiro*123" scp -p -r -P 5002 -oBindAddress=179.27.98.14 $BD_REQUIRO_MT_ZIP root@200.108.253.229:/home/requiro/call/requiroTransf/data/bk/

echo "Respaldando BD multiple"
mysqldump -u root -p'espanhaRoletti30!' --hex-blob requiro_multiple3 -r $BD_REQUIRO_MULTIPLE_SQL
zip $BD_REQUIRO_MULTIPLE_ZIP $BD_REQUIRO_MULTIPLE_SQL
rm -f $BD_REQUIRO_MULTIPLE_SQL
echo "Enviando BD multiple"
sshpass -p "requiro*123" scp -p -r -P 5002 -oBindAddress=179.27.98.14 $BD_REQUIRO_MULTIPLE_ZIP root@200.108.253.229:/home/requiro/call/requiroTransf/data/bk/

echo "Respaldando BD master"
mysqldump -u root -p'espanhaRoletti30!' master_stmotion -r $BD_REQUIRO_MASTER_SQL
zip $BD_REQUIRO_MASTER_ZIP $BD_REQUIRO_MASTER_SQL
rm -f $BD_REQUIRO_MASTER_SQL
sshpass -p "requiro*123" scp -p -r -P 5002 -oBindAddress=179.27.98.14 $BD_REQUIRO_MASTER_ZIP root@200.108.253.229:/home/requiro/call/requiroTransf/data/bk/
echo "Enviando BD master"

find db-backup/requiro/ -maxdepth 1 -type f -name '*.sql' -mtime +7 -exec mv {} db-backup/requiro/archive/ \;
find db-backup/requiro/ -maxdepth 1 -type f -name '*.zip' -mtime +7 -exec mv {} db-backup/requiro/archive/ \;
find db-backup/requiro/archive/ -maxdepth 1 -type f -name '*.sql' -mtime +15 -exec gzip {} \;
find db-backup/requiro/archive/ -maxdepth 1 -type f -name '*.zip' -mtime +15 -exec gzip {} \;
find db-backup/requiro/archive/ -maxdepth 1 -type f -name '*.gz' -mtime +180 -exec rm {} \;
