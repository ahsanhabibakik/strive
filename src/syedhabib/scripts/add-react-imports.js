const fs = require('fs');
const path = require('path');

// Directory containing the SEO components
const seoDir = path.join(__dirname, '..', 'src', 'components', 'seo');

// Get all TypeScript/TSX files in the directory
const files = fs.readdirSync(seoDir).filter(file => file.endsWith('.tsx'));

// Process each file
files.forEach(file => {
  const filePath = path.join(seoDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if the file already has a React import
  if (!content.includes("import React")) {
    // Add React import after 'use client' directive
    content = content.replace(
      /'use client';(\r?\n+)import/,
      "'use client';\r\n\r\nimport React from 'react';\r\nimport"
    );
    
    // If there are no other imports, add React import after 'use client'
    if (!content.includes("import React")) {
      content = content.replace(
        /'use client';(\r?\n+)/,
        "'use client';\r\n\r\nimport React from 'react';\r\n\r\n"
      );
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content);
    console.log(`Added React import to ${file}`);
  } else {
    console.log(`${file} already has React import`);
  }
});

console.log('Done adding React imports to SEO components');