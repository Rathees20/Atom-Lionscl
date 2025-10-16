const fs = require('fs');
const path = require('path');

// Read the generated index.html file
const indexPath = path.join(__dirname, '..', 'dist', 'index.html');

if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Replace absolute paths with relative paths
  content = content.replace(/src="\/_expo\//g, 'src="./_expo/');
  content = content.replace(/href="\/_expo\//g, 'href="./_expo/');
  content = content.replace(/src="\/assets\//g, 'src="./assets/');
  content = content.replace(/href="\/assets\//g, 'href="./assets/');
  
  // Write the fixed content back
  fs.writeFileSync(indexPath, content);
  console.log('Fixed absolute paths in index.html');
} else {
  console.log('index.html not found in dist directory');
}
