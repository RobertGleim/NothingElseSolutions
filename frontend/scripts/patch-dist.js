const fs = require('fs');
const path = require('path');

const distPath = path.resolve(__dirname, '../dist/assets/index-CUI5fFqA.js');
if (!fs.existsSync(distPath)) {
  console.error('Dist file not found:', distPath);
  process.exit(1);
}

let src = fs.readFileSync(distPath, 'utf8');
let orig = src;

// Targeted replacements
src = src.replace(/24\/7 Online Support/g, 'Dedicated Support');
src = src.replace(/24\/7 Support/g, 'Dedicated Support');
// Replace remaining standalone "24/7" occurrences (as a last resort)
src = src.replace(/\b24\/7\b/g, 'Dedicated Support');

if (src === orig) {
  console.log('No changes made — strings not found.');
  process.exit(0);
}

fs.writeFileSync(distPath, src, 'utf8');
console.log('Patched', distPath);
process.exit(0);
