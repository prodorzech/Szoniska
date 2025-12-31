const fs = require('fs');
const path = require('path');

function addDynamicExport(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      addDynamicExport(fullPath);
    } else if (file.name === 'route.ts') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Sprawdź czy już ma export dynamic
      if (!content.includes("export const dynamic")) {
        // Dodaj na początku po importach
        const lines = content.split('\n');
        let insertIndex = 0;
        
        // Znajdź ostatni import
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('import ')) {
            insertIndex = i + 1;
          } else if (lines[i].trim() === '' && insertIndex > 0) {
            insertIndex = i;
            break;
          }
        }
        
        // Wstaw export dynamic po importach
        lines.splice(insertIndex, 0, '', "export const dynamic = 'force-dynamic';");
        content = lines.join('\n');
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

addDynamicExport('./app/api');
console.log('Done!');
