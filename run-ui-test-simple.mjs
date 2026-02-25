import { spawn } from 'child_process';

console.log('Starting UIRenderer tests...\n');

const vitestPath = './node_modules/vitest/vitest.mjs';
const testFile = 'tests/UIRenderer.test.ts';

const proc = spawn('node', [vitestPath, 'run', testFile, '--reporter=verbose'], {
  stdio: 'pipe',
  shell: false
});

let output = '';
let errorOutput = '';

proc.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  process.stdout.write(text);
});

proc.stderr.on('data', (data) => {
  const text = data.toString();
  errorOutput += text;
  process.stderr.write(text);
});

proc.on('close', (code) => {
  console.log(`\nTest process exited with code ${code}`);
  process.exit(code);
});

proc.on('error', (err) => {
  console.error('Failed to start test process:', err);
  process.exit(1);
});
