import { spawn } from 'child_process';

const child = spawn('node', ['node_modules/vitest/vitest.mjs', 'run', 'tests/gameConfig.test.ts'], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code);
});

child.on('error', (err) => {
  console.error('Error:', err);
  process.exit(1);
});
