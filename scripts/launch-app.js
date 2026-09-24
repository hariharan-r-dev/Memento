import { spawn } from 'child_process';
import path from 'path';
import os from 'os';

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
  detached: true,
  stdio: 'ignore',
  env: fullEnv,
  cwd: releaseBin,
});
child.unref();

console.log('Spawned Lucky-Charm PID:', child.pid);
