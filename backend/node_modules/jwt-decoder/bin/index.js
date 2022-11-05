#!/usr/bin/env node
var fs = require('fs');
var jwt = require('green-jwt');

if (process.argv.length === 3) {
  if (fs.existsSync(process.argv[2])) {
    console.log(jwt.decode(fs.readFileSync(process.argv[2], { encoding: 'utf-8' })));
  } else {
    console.log(jwt.decode(process.argv[2]));
  }
}

