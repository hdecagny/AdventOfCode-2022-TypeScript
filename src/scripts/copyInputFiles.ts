/**
 * Copies input files to dist folders
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';

const daysPath = 'src/days';
const distDaysPath = 'dist/days';
const dirs = readdirSync(daysPath, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

for (const dir of dirs) {
  if (!existsSync(`${distDaysPath}/${dir}`)) {
    console.error('dist folder not found, run build first (npm run build)');
    process.exit(1);
  }
  if (!existsSync(`${distDaysPath}/${dir}/input`)) {
    mkdirSync(`${distDaysPath}/${dir}/input`);
  }
  copyFileSync(
    `${daysPath}/${dir}/input/input.txt`,
    `${distDaysPath}/${dir}/input/input.txt`
  );
}
