const Parser = require('tree-sitter');
const JavaScript = require('tree-sitter-javascript');

function analyzeJavaScript(filePath) {
  const parser = new Parser();
  parser.setLanguage(JavaScript);

  const sourceCode = fs.readFileSync(filePath, 'utf8');
  const tree = parser.parse(sourceCode);

  const functions = [];
  const visitNode = (node) => {
    if (node.type === 'function_declaration') {
      functions.push({ name: node.childForFieldName('name').text });
    }
    node.children.forEach(visitNode);
  };
  visitNode(tree.rootNode);

  return { language: 'JavaScript', functions };
}

module.exports = { analyzeJavaScript };
