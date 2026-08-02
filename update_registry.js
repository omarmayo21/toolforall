const fs = require('fs');
let code = fs.readFileSync('src/components/tools/registry.ts', 'utf8');

let newRegistryItems = [];

const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"](\.\/[^'"]+)['"]/g;
let match;
while ((match = importRegex.exec(code)) !== null) {
  const components = match[1].split(',').map(s => s.trim()).filter(Boolean);
  const file = match[2];
  components.forEach(comp => {
    newRegistryItems.push(`  ${comp}: dynamic(() => import('${file}').then(mod => mod.${comp}))`);
  });
}

let newCode = `import dynamic from 'next/dynamic';
import type { ComponentRegistry } from '@/lib/types';

export const TOOL_REGISTRY: ComponentRegistry = {
${newRegistryItems.join(',\n')}
};
`;

fs.writeFileSync('src/components/tools/registry.ts', newCode);
console.log('Registry updated.');
