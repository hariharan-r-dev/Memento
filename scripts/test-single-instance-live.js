import { spawn, spawnSync, execSync } from 'child_process';
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

console.log('=== Step 1: Starting First Instance ===');
const child = spawn(exe, [], {
  detached: true,
  stdio: 'ignore',
  env: fullEnv,
  cwd: releaseBin,
});
child.unref();

setTimeout(() => {
  const getRunning = () => {
    try {
      const out = execSync('tasklist /FI "IMAGENAME eq Lucky-Charm.exe" /FO CSV /NH').toString().trim();
      if (!out || out.includes('INFO: No tasks')) return [];
      return out.split('\n').filter(line => line.includes('Lucky-Charm.exe'));
    } catch {
      return [];
    }
  };

  const procs1 = getRunning();
  console.log('Processes running after first launch:', procs1.length);
  console.log(procs1);

  console.log('\n=== Step 2: Attempting Second Launch (should delegate & exit) ===');
  const result = spawnSync(exe, [], { encoding: 'utf-8', timeout: 5000, env: fullEnv, cwd: releaseBin });
  console.log('Second instance exit code:', result.status);

  setTimeout(() => {
    const procs2 = getRunning();
    console.log('\n=== Step 3: Verifying Final State ===');
    console.log('Processes running after second launch:', procs2.length);
    console.log(procs2);

    if (procs2.length === 1) {
      console.log('\n TEST PASSED: Single-instance strictly enforced! Exactly one instance is running.');
    } else {
      console.log('\n TEST FAILED: Found', procs2.length, 'processes.');
    }
  }, 1000);
}, 2500);
