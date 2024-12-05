# Code Mapper

Code Mapper est une application de cartographie de code source qui analyse les fichiers d'un projet pour extraire des métadonnées sur les classes, les objets, et les relations entre eux. Elle supporte actuellement les langages Java, JavaScript, TypeScript, et PHP, et génère des fichiers JSON contenant les informations extraites. L'application utilise le Strategy Pattern pour sélectionner dynamiquement les parsers nécessaires en fonction des types de fichiers détectés.

## Prérequis

Avant de pouvoir utiliser Code Mapper, assurez-vous d'avoir installé les éléments suivants :

- [Node.js](https://nodejs.org/) (version 14 ou supérieure)
- [npm](https://www.npmjs.com/)

## Structure du projet

```bash
project/
├── parsers/
│   ├── javaParser.js
│   ├── javascriptParser.js
│   ├── phpParser.js
│   ├── typescriptParser.js
├── uploads/
├── results/
├── server.js
├── strategy.js
├── package.json
└── .env
```

## Installation

Clonez ce dépôt, puis installez les dépendances nécessaires :

```bash
git clone https://github.com/votre-utilisateur/code-mapper.git
cd code-mapper
npm install
```

```bash
npm install express multer helmet express-rate-limit dotenv tree-sitter tree-sitter-java tree-sitter-javascript tree-sitter-typescript
```
```bash
Créez un fichier .env à la racine du projet et configurez les variables d'environnement comme suit :
UPLOAD_DIR=uploads
JSON_DIR=results
MAX_FILE_SIZE=10485760 # 10MB
PORT=3000
```

## Fonctionnalités
- Upload de code source : Uploadez un fichier contenant le code source de votre projet.
- Analyse de code : Analysez le code source pour extraire les classes, objets, méthodes, etc.
- Support multilingue : Supporte Java, JavaScript, TypeScript, et PHP, etc.
- Generation de métadonnées : Génère un fichier JSON contenant les métadonnées extraites.
- Sécurité : Utilise des pratiques de sécurité pour protéger les fichiers uploadés et les données.

## Utilisation
Démarrer le Serveur
- Pour démarrer le serveur, exécutez la commande suivante :

```bash
node server.js
```

Le serveur démarrera sur le port défini dans votre fichier .env (par défaut, 3000).

## Upload de Code Source
Pour uploader un fichier contenant le code source de votre projet, utilisez une requête POST vers l'endpoint /upload. Vous pouvez utiliser un outil comme Postman ou curl :

```bash
curl -X POST -F "file=@/chemin/vers/votre/projet.zip" http://localhost:3000/upload
```

## Analyse et Résultats
Après avoir uploadé un fichier, l'application analysera le code source et générera un fichier JSON dans le répertoire configuré (results par défaut). Le fichier JSON contiendra les métadonnées extraites.

## Exemple de Sortie
Un exemple de fichier JSON généré pourrait ressembler à ceci :

```json
{
  "language": "Java",
  "classes": [
    {
      "name": "MyClass",
      "methods": ["myMethod1", "myMethod2"],
      "fields": ["myField1", "myField2"]
    }
  ]
}
```

## Contribution
Les contributions sont les bienvenues ! Si vous souhaitez ajouter des fonctionnalités ou améliorer l'application, veuillez ouvrir une pull request.

## Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

```bash
Ce fichier `README.md` fournit une description complète de votre projet, y compris les prérequis, les instructions d'installation, les fonctionnalités, et des exemples d'utilisation. N'oubliez pas d'ajuster les liens et les informations spécifiques à votre projet, comme l'URL du dépôt GitHub, si nécessaire.
```