const http = require('http');
const fs = require('fs');
const path = require('path');

// Configurer le port
const port = process.env.PORT || 3000;

// Créer le serveur HTTP
const server = http.createServer((req, res) => {
    // Chemin vers le fichier demandé
    let filePath = '.' + req.url;
    if (filePath == './') {
        filePath = './public/index.html'; // Page d'accueil
    }

    // Déterminer le type de contenu (MIME type)
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Lire le fichier
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                // Si le fichier n'est pas trouvé, renvoyer une page 404
                fs.readFile('./public/404.html', (err404, content404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content404, 'utf-8');
                });
            } else {
                // Autre erreur
                res.writeHead(500);
                res.end(`Erreur de serveur : ${error.code} ..\n`);
            }
        } else {
            // Si le fichier est trouvé, l'envoyer avec le bon content-type
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Lancer le serveur
server.listen(port, () => {
    console.log(`Le serveur est lancé sur http://localhost:${port}`);
});
