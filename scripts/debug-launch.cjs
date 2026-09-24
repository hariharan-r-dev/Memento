const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

const mingwBin = path.join(
  os.homedir(),
  'AppData',
  'Local',
  'Microsoft',
  'WinGet',
  'Packages',
  'BrechtSanders.WinLibs.POSIX.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe',
  'mingw64',
  'bin'
);
const releaseBin = path.join(__dirname, '..', 'release-bin');
const fullEnv = {
  ...process.env,
  PATH: `${releaseBin};${mingwBin};${process.env.PATH || ''}`,
  Path: `${releaseBin};${mingwBin};${process.env.Path || ''}`,
};

const exePath = path.join(releaseBin, 'Lucky-Charm.exe');
console.log('Launching:', exePath);

const child = spawn(exePath, [], {
  env: fullEnv,
  cwd: releaseBin,
  stdio: 'pipe'
});

child.stdout.on('data', d => console.log('STDOUT:', d.toString()));
child.stderr.on('data', d => console.error('STDERR:', d.toString()));
child.on('exit', code => console.log('EXIT CODE:', code));

setTimeout(() => {
  console.log('After 3s, child PID:', child.pid, 'killed:', child.killed);
}, 3000);
