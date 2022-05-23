const fs = require('fs');
const path = require('path');

fs.unlink(path.join(__dirname, 'project-dist', 'bundle.css'), function (err) {
  if (err && err.code == 'ENOENT') {
    console.info('File does not exist');
  } else if (err) {
    console.error('Error occurred while trying to remove file');
  } else {
    console.info('removed');
  }
});

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  for (let file of files) {
    fs.stat(path.join(__dirname, 'styles', file), (err, type) => {
      if (type.isFile() && path.extname(file).slice(1) == 'css') {
        let styles = fs.ReadStream(path.join(__dirname, 'styles', file), 'utf-8');
        styles.on('data', function (data) {
          fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), data, (err) => {
            if (err) throw err;
          });
        });
      }
    });
  }
});


