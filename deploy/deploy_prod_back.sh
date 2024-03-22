echo "********************************************"
echo "***"
echo "***    PROD    PROD    PROD    PROD    PROD"
echo "***"
echo "*** Scripts para hacer deploy de Requiro"
echo "***"
echo "***    PROD    PROD    PROD    PROD    PROD"
echo "***"
echo "********************************************"
echo ""

echo "*************************"
echo "*    ADVERTENCIA"
echo "El scripts no actualiza el código desde el repositorio!!"
echo "Es necesario ejecutar update-code.sh primero."
read -p "Presionar cualquier tecla para continuar (Ctrl + C para cancelar)... " -n1 -s
echo ""
echo "*************************"

echo "Hora comienzo: $(date +%Y-%m-%d-%H.%M.%S)"

echo "***************************"
echo "Paso 1/4 Cambiando directorio:"
cd /root/src/requiro_prod
echo "current dir: $(pwd)"
echo ""

cd server
npm install
echo "current dir: $(pwd)"
echo ""

echo "***************************"
echo "Paso 2/4 Compilando TypeScrip servidor: tsc"
tsc
echo "current dir: $(pwd)"
echo ""

echo "***************************"
echo "Paso 3/4 Ejecutando el forever"
forever stop requiro-prod
# el forever necesita iniciarse desde el directorio root
cd /root/src/requiro_prod/server
export NODE_ENV=prod& forever start --append -o /root/.forever/requiro-prod.log -e /root/.forever/requiro-prod.err --uid "requiro-prod" bin/www_prod_https

echo "current dir: $(pwd)"
echo ""

echo "***************************"
echo "Paso 4/4 Instalación concluída"
forever list
echo "current dir: $(pwd)"
echo ""

echo "***************************"
echo "***   FIN"
echo "***************************"
