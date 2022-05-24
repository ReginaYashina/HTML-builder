const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

fs.writeFile(
  path.join(__dirname, 'text.txt'),
  '',
  (err) => {
    if (err) throw err;
    stdout.write('Hey! Write something\n');
    stdin.on('data', data => {
      if (data.toString().trim() === 'exit') {
        exit();
      }
      stdout.write(data);
      fs.appendFile(
        path.join(__dirname, 'text.txt'),
        data,
        err => {
          if (err) throw err;
        },
      );
    });
    process.on('exit', () => stdout.write('Thank you! Good luck)'));
    process.on('SIGINT', () => process.exit());
  }
);