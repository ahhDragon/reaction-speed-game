import { spawn } from 'child_process';

const vitest = spawn('npx', ['vitest', 'run', 'tests/earlyClickHandling.test.ts'], {
  stdio: 'inherit',
  shell: true
});

vitest.on('close', (code) => {
  process.exit(code);
});
