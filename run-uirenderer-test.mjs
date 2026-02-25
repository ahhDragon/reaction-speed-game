import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runTests() {
  try {
    console.log('Running UIRenderer tests...\n');
    const { stdout, stderr } = await execAsync('npx vitest run tests/UIRenderer.test.ts', {
      env: { ...process.env, FORCE_COLOR: '0' }
    });
    
    console.log(stdout);
    if (stderr) {
      console.error(stderr);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Test execution failed:');
    console.error(error.stdout || error.message);
    process.exit(1);
  }
}

runTests();
