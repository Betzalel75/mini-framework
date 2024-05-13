# Créer le fichier de documentation
touch documentation.md

# Créer les dossiers src, todoMVC et test
mkdir src todoMVC test

# Créer la structure dans le dossier src
cd src
mkdir core components router
cd core
touch dom.js state.js events.js
cd ..
cd components
touch button.js form.js todoList.js
cd ..
cd router
touch router.js
cd ../..

# Créer la structure dans le dossier todoMVC
cd todoMVC
touch index.html styles.css app.js
cd ..

# Créer la structure dans le dossier test
cd test
touch unit_tests.js integration_tests.js
mkdir todoMVC_test
cd todoMVC_test
touch index.html styles.css app.js
cd ../..

echo "Architecture créée avec succès!"
