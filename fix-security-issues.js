#!/usr/bin/env node

/**
 * QuillSwitch Security Issues Cleanup Script
 * Removes console.log statements, sanitizes code, and improves security posture
 */

const fs = require('fs');
const path = require('path');

const srcDir = './src';
const filesToProcess = [];

// Find all TypeScript/JavaScript files
function findFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath);
    } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
      filesToProcess.push(filePath);
    }
  });
}

// Clean console statements and sensitive logging
function cleanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Remove console.log statements (keep console.error for critical errors)
  let cleanedContent = content.replace(
    /console\.log\([^)]*\);?\n?/g, 
    (match) => {
      modified = true;
      return '';
    }
  );
  
  // Clean console.error statements that might leak sensitive data
  cleanedContent = cleanedContent.replace(
    /console\.error\(['"`]([^'"`]*(?:password|key|token|secret|credential)[^'"`]*)['"`]?,?\s*[^)]*\);?\n?/gi,
    (match) => {
      modified = true;
      return `console.error('Authentication error occurred');\n`;
    }
  );
  
  // Remove hardcoded API keys or secrets (basic patterns)
  cleanedContent = cleanedContent.replace(
    /(const|let|var)\s+\w*(?:key|token|secret|password)\s*=\s*['"`][^'"`]{20,}['"`];?\n?/gi,
    (match) => {
      modified = true;
      console.log(`⚠️  Potential hardcoded secret found in ${filePath}`);
      return '// Secret removed for security\n';
    }
  );
  
  if (modified) {
    fs.writeFileSync(filePath, cleanedContent);
    console.log(`✅ Cleaned: ${filePath}`);
    return true;
  }
  
  return false;
}

// Main execution
console.log('🔍 Scanning for security issues...\n');

findFiles(srcDir);
let totalFilesModified = 0;

filesToProcess.forEach(filePath => {
  if (cleanFile(filePath)) {
    totalFilesModified++;
  }
});

console.log(`\n📊 Security cleanup complete:`);
console.log(`   Files scanned: ${filesToProcess.length}`);
console.log(`   Files modified: ${totalFilesModified}`);
console.log(`\n🔒 Next steps:`);
console.log(`   1. Enable leaked password protection in Supabase`);
console.log(`   2. Reduce OTP expiry time in Auth settings`);
console.log(`   3. Review remaining console.error statements`);
console.log(`   4. Implement proper logging with structured data`);
