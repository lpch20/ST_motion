echo "*****************************************************"
echo "***"
echo "***    TEST    TEST    TEST    TEST    TEST    TEST"
echo "***"
echo "*** Scripts para actualizar codigo fuente de Requiro"
echo "***"
echo "***    TEST    TEST    TEST    TEST    TEST    TEST"
echo "***"
echo "*****************************************************"
echo ""
read -p "Presionar cualquier tecla para continuar (Ctrl + C para cancelar)... " -n1 -s

echo ""
echo "Hora comienzo: $(date +%Y-%m-%d-%H.%M.%S)"

echo "***************************"
echo "Paso 1/4 Cambiando directorio: cd github"
echo ""
cd /root/src/requiro_test
echo "current dir: $(pwd)"
echo ""

echo "***************************"
echo "Paso 2/4 Cambiar a branch master: git checkout master & git branch --set-upstream-to=origin/master master"
echo ""
cd /root/src/requiro_test
git checkout master
git branch --set-upstream-to=origin/master master
echo "current dir: $(pwd)"
echo ""

echo "***************************"
echo "Paso 3/4 Actualización de código: git pull"
echo ""
cd /root/src/requiro_test
git pull
echo "current dir: $(pwd)"
echo ""

echo "***************************"
echo "Paso 4/4 Modificados permisos a scripts: chmod 777 deploy/*.sh"
echo ""
cd /root/src/requiro_test
chmod 777 deploy/*.sh
ls deploy
echo "current dir: $(pwd)"
echo ""

echo "***************************"
echo "***   FIN"
echo "***************************"