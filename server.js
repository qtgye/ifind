const path = require('path');
const fs = require('fs-extra');
const express = require('express');
const app = express();
const PORT = 9999;

const paths = require('./config/paths');

const staticRoots = {
    '/coverage': path.resolve(paths.coverage),
    '/': path.resolve(paths.appBuild),
};

// Register static  folders
Object.entries(staticRoots).forEach(([ path, directory ]) => {
    app.use(path, express.static(directory));
});

// app.get('/coverage', (req, res) => {
//     res.send('Test');
// });

// app.get('/*', (req, res) => {
//     const indexFile = fs.readFileSync(path.resolve(paths.appBuild, 'index.html'));
//     res.send(indexFile);
// });


app.listen(PORT, () => {
console.log(`Example app listening at http://localhost:${PORT}`)
})