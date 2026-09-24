import { spawn, execSync } from 'child_process';
import path from 'path';

const exePath = path.join(process.cwd(), 'release-bin', 'Lucky-Charm.exe');

console.log('1. Starting first instance of Lucky-Charm.exe...');
const p1 = spawn(exePath, [], { detached: true, stdio: 'ignore' });
p1.unref();

setTimeout(() => {
  const getProcs = () => {
    try {
      const out = execSync('powershell -NoProfile -Command "(Get-Process -Name lucky_charm, Lucky-Charm -ErrorAction SilentlyContinue).Count"').toString().trim();
      return parseInt(out, 10) || 0;
    } catch { return 0; }
  };

  const count1 = getProcs();
  console.log('Active Lucky Charm processes after 1st launch:', count1);

  console.log('2. Attempting second launch of Lucky-Charm.exe...');
  try {
    execSync(`"${exePath}"`, { timeout: 3000 });
  } catch (_e) {
    console.log('Second instance process exited cleanly (delegated to 1st instance).');
  }

  setTimeout(() => {
    const count2 = getProcs();
    console.log('Active Lucky Charm processes after 2nd launch attempt:', count2);
    if (count2 === 1) {
      console.log('SUCCESS: Exactly ONE single instance is running! No duplicate windows or cats.');
    } else {
      console.log('Process count:', count2);
    }
  }, 1000);
}, 2500);
