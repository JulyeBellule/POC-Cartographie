const Parser = require('tree-sitter');
const Java = require('tree-sitter-java');
const fs = require('fs');

function analyzeJava(filePath) {
    const parser = new Parser();
    parser.setLanguage(Java);

    // Lire le fichier Java
    const code = fs.readFileSync(filePath, 'utf8');
    const tree = parser.parse(code);

    const classes = [];
    const constructor = [];
    const methods = [];
    const interfaces = [];
    const int_decl = [];
    const ext = [];

    // Fonction de traversée pour parcourir l'arbre syntaxique
    function traverse(node) {

        // Trouver la classe
         if (node.type === 'class_declaration') {
            const className = node.childForFieldName('name').text;
            classes.push({
                name: className,
            });
        }

        // Trouver le constructeur
        if (node.type === 'constructor_declaration') {
            const construct = node.childForFieldName('name').text;
            constructor.push({name: construct,});
        }

        // Trouver les méthodes de la classe (hors interface)
        if (node.type === 'method_declaration' && node.parent.type === 'class_body') {
            for (let child of node.namedChildren) {
                if (child.type === 'identifier') {
                    methods.push(child.text);
                }
            }
        }

        // Trouver les héritages
        if (node.type === 'superclass') {
            for (let child of node.namedChildren) {
                ext.push(child.text);
            }
        }
        
        // Catch des interfaces
        if (node.type === 'super_interfaces') {
            node.namedChildren.forEach(interfaceNode => {
                interfaces.push(interfaceNode.text);
            });
        }

        // Trouver les méthodes d'interface
        if (node.type === 'method_declaration' && node.parent.type === 'interface_body') {
            for (let child of node.namedChildren) {
                if (child.type === 'identifier') {
                    int_decl.push(child.text);
                }
            }
        }

        node.children.forEach(traverse);
    }

    // Démarrer la traversée à partir du nœud racine
    traverse(tree.rootNode);

    // console.log('--- Classes parsés ---');
    // console.log(classes);
    // console.log(ext);
    // console.log(interfaces);
    // console.log(methods);
    // console.log(filePath.split('\\').slice(1).join('\\'));
    // console.log('----------------------');

    return {
        language: 'Java',
        classes: classes,
        extends: ext,
        interfaces : interfaces,
        interface_methods : int_decl,
        constructor: constructor,
        methods: methods,
        filePath: filePath.split('\\').slice(1).join('\\'),
    };
}

module.exports = { analyzeJava };
