const { execSync } = require('child_process');

try {
  execSync('node ./node_modules/vitest/vitest.mjs --run tests/GameController.test.ts', {
    stdio: 'inherit',
    shell: true
  });
} catch (error) {
  process.exit(error.status || 1);
}
