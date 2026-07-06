const fs = require('fs');
const path = require('path');

function copyFolderRecursiveSync(source, target) {
  var files = [];

  var targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        fs.copyFileSync(curSource, path.join(targetFolder, file));
      }
    });
  }
}

try {
  console.log('Copying static and public folders to standalone directory...');
  
  const root = path.join(__dirname, '..');
  const standaloneNext = path.join(root, '.next', 'standalone', '.next');
  const standaloneRoot = path.join(root, '.next', 'standalone');

  const staticSrc = path.join(root, '.next', 'static');
  if (fs.existsSync(staticSrc)) {
    if (!fs.existsSync(standaloneNext)) {
      fs.mkdirSync(standaloneNext, { recursive: true });
    }
    copyFolderRecursiveSync(staticSrc, standaloneNext);
    console.log('Copied .next/static successfully!');
  } else {
    console.warn('Warning: .next/static not found.');
  }

  const publicSrc = path.join(root, 'public');
  if (fs.existsSync(publicSrc)) {
    copyFolderRecursiveSync(publicSrc, standaloneRoot);
    console.log('Copied public folder successfully!');
  } else {
    console.warn('Warning: public folder not found.');
  }
  
  console.log('Standalone assets preparation complete.');
} catch (error) {
  console.error('Error copying standalone assets:', error);
  process.exit(1);
}
