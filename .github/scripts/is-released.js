const { execSync } = require('child_process');

const LAST_COMMIT_MSG = execSync('git show -s --format=%s').toString();
const LAST_TAG = execSync('git describe --tags --abbrev=0').toString();

console.log(LAST_COMMIT_MSG === `chore(release): v${LAST_TAG}`);
process.exit(0);
