	const express = require('express');
	const multer = require('multer');
	const unzipper = require('unzipper');
	const helmet = require('helmet');
	const rateLimit = require('express-rate-limit');
	const dotenv = require('dotenv');
	const path = require('path');
	const fs = require('fs');
	const { analyzeFile } = require('./strategy');

	// Charger les variables d'environnement depuis le fichier .env
	dotenv.config();

	const app = express();
	const port = process.env.PORT || 3000;

	// Utiliser Helmet pour sécuriser les en-têtes HTTP
	app.use(helmet());

	// Limiteur de taux pour éviter les attaques par déni de service
	const limiter = rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // Limite chaque IP à 100 requêtes par windowMs
		message: 'Trop de requêtes provenant de cette IP, veuillez réessayer plus tard.'
	});

	app.use(limiter);

	// Configuration des répertoires d'upload et de résultats
	const uploadDir = process.env.UPLOAD_DIR || 'uploads';
	const jsonDir = process.env.JSON_DIR || 'results';
	const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB

	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true });
	}

	if (!fs.existsSync(jsonDir)) {
		fs.mkdirSync(jsonDir, { recursive: true });
	}

	// Configuration de Multer pour gérer les fichiers uploadés
	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, uploadDir);
		},
		filename: (req, file, cb) => {
			cb(null, Date.now() + '-' + file.originalname);
		}
	});

	const upload = multer({
		storage: storage,
		limits: { fileSize: maxSize },
		fileFilter: (req, file, cb) => {
			const allowedExtensions = /(\.zip)$/i;
			if (!allowedExtensions.test(file.originalname)) {
				return cb(new Error('Seuls les fichiers zip sont autorisés'));
			}
			cb(null, true);
		}
	});

	// Fonction pour analyser les fichiers extraits
	async function analyzeExtractedFiles(extractPath) {
		const filePaths = [];
		const walkDir = async (dir) => {
			const files = await fs.promises.readdir(dir);
			for (const file of files) {
				const filePath = path.join(dir, file);
				const stat = await fs.promises.stat(filePath);
				if (stat.isDirectory()) {
					await walkDir(filePath);
				} else if (filePath.endsWith('.java')) {
					filePaths.push(filePath);
				}
			}
		};
		await walkDir(extractPath);
		resultAnalysis = analyzeFile(filePaths);
		return resultAnalysis;
	}

	// Route pour uploader des fichiers et analyser le projet
	app.post('/upload', upload.single('projectZip'), async (req, res) => {

		const zipFilePath = req.file.path;
		console.log('Zip File Path : ' + zipFilePath);
  		const extractPath = path.join('extracted', path.basename(zipFilePath, '.zip'));
		console.log('Extracted Path : ' + extractPath);
		const resultFilePath = path.join(jsonDir, `${req.file.filename}.json`);
		console.log('Result File Path : ' + resultFilePath);
		
		try {
			// if (!req.file) {
			// 	return res.status(400).send('Aucun fichier uploadé.');
			// }

			// const projectDir = path.join(uploadDir, req.file.filename);
			// console.log(projectDir);
			// // Appel du strategy.js
			// const result = analyzeFile(projectDir);
			// console.log(result);
			// const resultFilePath = path.join(jsonDir, `${req.file.filename}.json`);
			// console.log(resultFilePath);

			// // Ecriture du fichier json
			// fs.writeFileSync(resultFilePath, JSON.stringify(result, null, 2));

			// // Supprimer les fichiers uploadés
			// fs.unlinkSync(projectDir);

			// res.status(200).send(`Fichier analysé avec succès. Résultats enregistrés dans ${resultFilePath}`);

			await fs.promises.mkdir(extractPath, { recursive: true });
			await fs.createReadStream(zipFilePath)
				.pipe(unzipper.Extract({ path: extractPath }))
				.promise();

			const analysisResult = await analyzeExtractedFiles(extractPath);
			res.json(analysisResult);

			fs.writeFileSync(resultFilePath, JSON.stringify(analysisResult, null, 2));
			//fs.unlinkSync(extractPath);
			//res.status(200).send(`Fichier analysé avec succès. Résultats enregistrés dans ${resultFilePath}`);

		} catch (err) {
			console.log(err);
			res.status(500).send('Erreur lors de l\'analyse du fichier.');
		} finally {
			fs.promises.unlink(zipFilePath).catch(console.error); // Supprime le fichier zip uploadé
			// fs.rm('extracted', {recursive: true, force: true}); // Supprime le folder extracted avec les fichiers uploadés
		}
	});  

	// Route pour afficher le formulaire d'upload
	app.get('/upload', (req, res) => {
		res.send(`
			<!DOCTYPE html>
			<html>
			<head>
				<title>Uploader un projet - Code Mapper</title>
			</head>
			<body>
				<h2>Uploader un fichier ZIP contenant les fichiers java</h2>
				<form action="/upload" method="post" enctype="multipart/form-data">
					<input type="file" name="projectZip" accept=".zip" />
					<button type="submit">Upload</button>
				</form>
			</body>
			</html>
		`);
	});

	// Route pour la page d'accueil
	app.get('/', (req, res) => {
		res.send(`
			<!DOCTYPE html>
			<html>
			<head>
				<title>Code Mapper</title>
			</head>
			<body>
				<h1>Bienvenue sur Code Mapper</h1>
				<p>Utilisez les liens ci-dessous pour accéder aux fonctionnalités :</p>
				<ul>
				<li><a href="/upload">Uploader un projet</a></li>
				<li><a href="/results">Voir les résultats d'analyse</a></li>
				</ul>
			</body>
			</html>
		`);
	});

	// Démarrer le serveur
	app.listen(port, () => {
		console.log(`Serveur démarré sur http://localhost:${port}`);
	});
