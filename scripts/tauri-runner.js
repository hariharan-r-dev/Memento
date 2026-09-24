import { spawn } from 'child_process';
import path from 'path';
import os from 'os';

const homeDir = os.homedir();
const cargoBin = path.join(homeDir, '.cargo', 'bin');
const mingwBin = path.join(
  homeDir,
  'AppData',
  'Local',
  'Microsoft',
  'WinGet',
  'Packages',
  'BrechtSanders.WinLibs.POSIX.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe',
  'mingw64',
  'bin'
);
const nodeBin = path.dirname(process.execPath);
const npmGlobal = path.join(homeDir, 'AppData', 'Roaming', 'npm');

const pathEntries = [
  cargoBin,
  mingwBin,
  nodeBin,
  npmGlobal,
  'C:\\Windows\\system32',
  'C:\\Windows',
  'C:\\Windows\\System32\\Wbem',
  'C:\\Windows\\System32\\WindowsPowerShell\\v1.0',
];

const existingPath = process.env.Path || process.env.PATH || '';
const fullPath = `${pathEntries.join(';')};${existingPath}`;

const env = { ...process.env };
env.Path = fullPath;
env.PATH = fullPath;
env.path = fullPath;

// Use space-free temp target dir to avoid MinGW windres path space issues without virtual drives
env.CARGO_TARGET_DIR = path.join(os.tmpdir(), 'lucky-charm-target');

const args = process.argv.slice(2);
const tauriCli = path.join(process.cwd(), 'node_modules', '@tauri-apps', 'cli', 'tauri.js');

const child = spawn(process.execPath, [tauriCli, ...args], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env,
  shell: false,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
