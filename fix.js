const fs = require('fs');
const path = require('path');
const levelsDir = path.join('e:/web porjects/Web security/2 nd/levels');
fs.readdirSync(levelsDir).forEach(file => {
    if (file.endsWith('.html')) {
        let p = path.join(levelsDir, file);
        let content = fs.readFileSync(p, 'utf8');
        content = content.replace(/href="\.\.\/css\/style\.css"/g, 'href="../public/css/style.css"');
        content = content.replace(/src="\.\.\/js\/script\.js"/g, 'src="../public/js/script.js"');
        content = content.replace(/href="\.\.\/index\.html"/g, 'href="../public/index.html"');
        fs.writeFileSync(p, content);
        console.log('Updated ' + file);
    }
});

const indexFile = path.join('e:/web porjects/Web security/2 nd/public/index.html');
let indexContent = fs.readFileSync(indexFile, 'utf8');
indexContent = indexContent.replace(/href="levels\//g, 'href="../levels/');
fs.writeFileSync(indexFile, indexContent);
console.log('Updated index.html');
