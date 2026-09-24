import { execSync } from 'child_process';
import path from 'path';
import os from 'os';

const homeDir = os.homedir();
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
const objdump = path.join(mingwBin, 'objdump.exe');
const exe = path.join(process.cwd(), 'release-bin', 'Lucky-Charm.exe');

try {
  const out = execSync(`"${objdump}" -p "${exe}"`, { maxBuffer: 10 * 1024 * 1024 }).toString();
  const dlls = out.split('\n').filter(l => l.includes('DLL Name:')).map(l => l.trim());
  console.log('Dependent DLLs:');
  console.log(dlls);
} catch (e) {
  console.error(e.message);
}
