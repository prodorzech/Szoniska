const fs = require('fs');
const path = require('path');

function updateImports(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      updateImports(fullPath);
    } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      // Zamień wszystkie warianty importu authOptions
      content = content.replace(
        /import\s*{\s*authOptions\s*}\s*from\s*['"][^'"]*auth\/\[\.\.\.nextauth\]\/route['"]/g,
        "import { authOptions } from '@/lib/auth'"
      );
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

updateImports('./app/api');
console.log('Done!');
