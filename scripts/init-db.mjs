import { execFileSync } from 'child_process';

try {
  execFileSync(
    'docker-compose',
    [
      '-f',
      'docker-compose.yml',
      'exec',
      'mongo',
      'mongo',
      '--eval',
      'rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "127.0.0.1:27017" }] })',
    ],
    {
      stdio: 'inherit',
    },
  );
} catch (e) {
  process.stderr.write(e.stderr);
  process.exit(1);
}
