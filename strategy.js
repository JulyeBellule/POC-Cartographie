const { analyzeJava } = require('./parsers/javaParser');
const { analyzeJavaScript } = require('./parsers/javascriptParser');
const path = require('path');
// Ajouter d'autres parsers ici

const fileExtensions = {
  '.java': analyzeJava,
  '.js': analyzeJavaScript,
  // Ajouter d'autres extensions et parsers ici
};

function analyzeFile(filePath) {

    let parserResult = [];

    filePath.forEach((pathChild) => {
        
        let ext = path.extname(pathChild);
        let parser = fileExtensions[ext];
        if (parser) {
            parserResult.push(parser(pathChild));
        } else {
            throw new Error(`Aucun parser pour l'extention : ${ext}`);
        }
    });

    return parserResult;

}

module.exports = { analyzeFile };
