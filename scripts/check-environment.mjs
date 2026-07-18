import { execFileSync } from 'node:child_process';

function run(command, args) {
  try {
    const output = execFileSync(command, args, { encoding: 'utf8' }).trim();
    console.log(`${command} ${args.join(' ')} -> ${output}`);
  } catch (error) {
    console.error(`Cannot run ${command} ${args.join(' ')}`);
    process.exitCode = 1;
  }
}

run('node', ['-v']);
run('npm', ['-v']);
console.log('ตรวจสอบเสร็จแล้ว หากติดตั้ง dependency แล้วให้รัน npx playwright install ต่อ');
