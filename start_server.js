const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const out = fs.openSync(path.join(__dirname, 'next-stdout.log'), 'a');
const err = fs.openSync(path.join(__dirname, 'next-stderr.log'), 'a');

const child = spawn(process.execPath, [path.join(__dirname, 'node_modules/next/dist/bin/next'), 'start', '-p', '3000'], {
  detached: true,
  stdio: ['ignore', out, err],
  cwd: __dirname
});

child.unref();
console.log('Spawned detached Next.js server with PID:', child.pid);
