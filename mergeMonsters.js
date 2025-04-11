import fs from 'fs';
import path from 'path';

const dir = './monsters'; // folder where your page_*.json files are

const files = fs.readdirSync(dir).filter(file => file.startsWith('page_') && file.endsWith('.json'));

let allMonsters = [];

for (const file of files) {
  // Extract page number from filename (assuming format is page_X.json)
  const pageMatch = file.match(/page_(\d+)\.json/);
  const pageNumber = pageMatch ? parseInt(pageMatch[1]) : null;
  
  const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
  
  // Add page property to each monster
  const monstersWithPage = data.map(monster => ({
    ...monster,
    page: pageNumber + 9
  }));
  
  allMonsters = allMonsters.concat(monstersWithPage);
}

fs.writeFileSync('monsters.json', JSON.stringify(allMonsters, null, 2));
console.log(`✅ Merged ${files.length} files into monsters.json`);