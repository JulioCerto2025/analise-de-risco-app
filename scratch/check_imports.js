
import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('.');

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const hasUseState = content.includes('useState(');
    const hasImport = content.includes("from 'react'") || content.includes('from "react"');
    const hasExplicitImport = content.includes('useState') && hasImport;
    const hasReactPrefix = content.includes('React.useState');

    if (hasUseState && !hasExplicitImport && !hasReactPrefix) {
        console.log(`MISSING IMPORT in: ${file}`);
    }
});
