const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), (err, files) => {
  for (let file of files) {
    fs.stat(path.join(__dirname, 'secret-folder', file), (err, type) => {
      if (type.isFile()) {
        let name = path.basename(file, path.extname(file));
        let extname = path.extname(file).slice(1);
        let size = type.size + 'b';
        console.log(name + ' - ' + extname + ' - ' + size);
      }
    });
  }
});

