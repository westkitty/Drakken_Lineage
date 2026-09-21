import { cp, copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, 'data'), { recursive: true });
await mkdir(join(dist, 'vendor', 'addons', 'controls'), { recursive: true });
await mkdir(join(dist, 'vendor', 'addons', 'renderers'), { recursive: true });

for (const file of ['index.html', 'styles.css', 'app.js']) {
  await copyFile(join(root, file), join(dist, file));
}

await cp(join(root, 'data'), join(dist, 'data'), { recursive: true });

await copyFile(
  join(root, 'node_modules', 'three', 'build', 'three.module.js'),
  join(dist, 'vendor', 'three.module.js')
);
await copyFile(
  join(root, 'node_modules', 'three', 'examples', 'jsm', 'controls', 'OrbitControls.js'),
  join(dist, 'vendor', 'addons', 'controls', 'OrbitControls.js')
);
await copyFile(
  join(root, 'node_modules', 'three', 'examples', 'jsm', 'renderers', 'CSS2DRenderer.js'),
  join(dist, 'vendor', 'addons', 'renderers', 'CSS2DRenderer.js')
);
await copyFile(
  join(root, 'node_modules', 'three', 'LICENSE'),
  join(dist, 'vendor', 'THREE-LICENSE.txt')
);

await writeFile(join(dist, '.nojekyll'), '');
console.log('Built dist/ with pinned Three.js runtime assets.');
