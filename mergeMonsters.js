import fs from 'fs';
import path from 'path';

const dir = './monsters'; // folder where your page_*.json files are

const files = fs.readdirSync(dir).filter(file => file.startsWith('page_') && file.endsWith('.json'));

let allMonsters = [];

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
  allMonsters = allMonsters.concat(data);
}

fs.writeFileSync('monsters.json', JSON.stringify(allMonsters, null, 2));
console.log(`✅ Merged ${files.length} files into monsters.json`);
