import { execSync } from 'child_process';

const out = execSync('tasklist /FI "IMAGENAME eq Lucky-Charm.exe" /FO CSV /NH').toString().trim();
console.log('Tasklist output for Lucky-Charm.exe:');
console.log(out);

const out2 = execSync('tasklist /FI "IMAGENAME eq lucky_charm.exe" /FO CSV /NH').toString().trim();
console.log('Tasklist output for lucky_charm.exe:');
console.log(out2);
