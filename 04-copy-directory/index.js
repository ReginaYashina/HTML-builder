const fs = require('fs');
const path = require('path');

function copyDir() {
  fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, err => {
    if (err) throw err;
  });
  fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
    if (err) throw err;
    for (let file of files) {
      fs.unlink(path.join(__dirname, 'files-copy', file), (err) => {
        if (err) throw err;
      });
    }
  });
  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    for (let file of files) {
      fs.stat(path.join(__dirname, 'files', file), (err, type) => {
        if (type.isFile()) {
          fs.copyFile((path.join(__dirname, 'files', file)), (path.join(__dirname, 'files-copy', file)), err => {
            if (err) throw err;
          });
        }
      });
    }
  });
}
copyDir();
