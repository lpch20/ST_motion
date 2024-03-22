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
echo "Paso 1/2 Cambiando directorio: cd github"
echo ""
cd /root/src/requiro_test
echo "current dir: $(pwd)"
echo ""

echo "***************************"
echo "Paso 2/2 Actualización de código: git pull"
echo ""
cd /root/src/requiro_test
git pull
echo "current dir: $(pwd)"
echo ""

echo "***************************"
echo "***   FIN"
echo "***************************"