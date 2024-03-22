#echo "Paso 7/8 Ejecutando el forever"
#forever stop requiro-prod
# el forever necesita iniciarse desde el directorio root
cd /root/src/requiro_prod/server
export NODE_ENV=prod& forever start --append -o /root/.forever/requiro-prod.log -e /root/.forever/requiro-prod.err --uid "requiro-prod" bin/www_prod_https
