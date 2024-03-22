echo "********************************************"
echo "***"
echo "***    PROD    PROD    PROD    PROD    PROD"
echo "***"
echo "*** Scripts para actualizar codigo fuente de Requiro"
echo "***"
echo "***    PROD    PROD    PROD    PROD    PROD"
echo "***"
echo "********************************************"
echo ""
read -p "Presionar cualquier tecla para continuar (Ctrl + C para cancelar)... " -n1 -s

echo ""
echo "Hora comienzo: $(date +%Y-%m-%d-%H.%M.%S)"

echo "***************************"
echo "Paso 1/3 Cambiando directorio: cd requiro_prod"
echo ""
cd /root/src/requiro_prod
echo "current dir: $(pwd)"
echo ""

echo "***************************"
echo "Paso 2/3 Copiar de respaldo del código: cp github github_backup"
echo ""
cd ..
cp -rf requiro_prod/ requiro_backups/requiro_prod_backup_$(date +%Y-%m-%d-%H.%M.%S)
ls
echo "current dir: $(pwd)"
echo ""

echo "***************************"
echo "Paso 3/3 Actualización de código: git pull"
echo ""
cd /root/src/requiro_prod
git pull
echo "current dir: $(pwd)"
echo ""

echo "***************************"
echo "***   FIN"
echo "***************************"
