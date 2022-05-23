const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
  if (err) throw err;
});

fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true }, err => {
  if (err) throw err;
});

function removeFolder(dist) {
  fs.readdir(dist, (err, files) => {
    if (err) throw err;
    for (let file of files) {
      fs.stat(path.join(dist, file), (err, type) => {
        if (err) throw err;
        if (type.isDirectory()) {
          removeFolder(path.join(dist, file));
        } else if (type.isFile()) {
          fs.unlink(path.join(dist, file), (err) => {
            if (err) throw err;
          });
        }
      });
    }
  });
}
removeFolder(path.join(__dirname, 'project-dist', 'assets'));

function copyFiles(src, dist) {
  fs.readdir(src, (err, files) => {
    for (let file of files) {
      fs.stat(path.join(src, file), (err, type) => {
        if (err) throw err;
        if (type.isDirectory()) {
          fs.mkdir(path.join(dist, file), { recursive: true }, (err) => {
            copyFiles(path.join(src, file), path.join(dist, file));
          });

        } else if (type.isFile()) {
          fs.copyFile((path.join(src, file)), (path.join(dist, file)), err => {
            if (err) throw err;
          });
        }
      });
    }
  });
}
copyFiles(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));

// styles
fs.unlink(path.join(__dirname, 'project-dist', 'style.css'), function (err) {
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
          fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), data, (err) => {
            if (err) throw err;
          });
        });
      }
    });
  }
});

// html
fs.unlink(path.join(__dirname, 'project-dist', 'index.html'), function (err) {
  if (err && err.code == 'ENOENT') {
    console.info('File does not exist');
  } else if (err) {
    console.error('Error occurred while trying to remove file');
  } else {
    console.info('removed');
  }
});

fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err, data) => {
  let tag = data;
  data.match(/{{(.*)}}/g).forEach(function (template) {
    fs.readFile(path.join(__dirname, 'components', `${template.match(/{{(.*)}}/)[1]}.html`), 'utf-8', (err, newCode) => {
      tag = tag.replace(template, newCode);
      fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), tag, () => { });
    });
  });
});