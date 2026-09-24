import { spawn, execSync } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';

// 1. Kill any zombie instances first
try {
  execSync('taskkill /F /IM Lucky-Charm.exe /T', { stdio: 'ignore' });
} catch (_) {}
try {
  execSync('taskkill /F /IM lucky_charm.exe /T', { stdio: 'ignore' });
} catch (_) {}

// 2. Remove stale lockfiles if present
const ebWebView = path.join(os.homedir(), 'AppData', 'Local', 'com.luckycharm.desktop', 'EBWebView');
try {
  const mainLock = path.join(ebWebView, 'lockfile');
  if (fs.existsSync(mainLock)) {
    fs.unlinkSync(mainLock);
  }
} catch (_) {}

const exe = path.join(process.cwd(), 'release-bin', 'Lucky-Charm.exe');
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
const releaseBin = path.join(process.cwd(), 'release-bin');
const fullEnv = {
  ...process.env,
  PATH: `${releaseBin};${mingwBin};${process.env.PATH || ''}`,
  Path: `${releaseBin};${mingwBin};${process.env.Path || ''}`,
};

const child = spawn(exe, [], {
  env: fullEnv,
  cwd: releaseBin,
});

child.stdout.on('data', (d) => console.log('STDOUT:', d.toString()));
child.stderr.on('data', (d) => console.error('STDERR:', d.toString()));
child.on('exit', (code) => console.log('Process exited with code:', code));

console.log('Lucky Charm running as active daemon PID:', child.pid);
