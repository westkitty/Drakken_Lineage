import fs from 'node:fs';
import { nodes, strains, archetypes, edges, characters, kernelStages, evidence, sourceRefs, catalogConflict } from '../data/lineage.js';

const fail = msg => { console.error(`FAIL: ${msg}`); process.exitCode = 1; };
const ids = new Set(nodes.map(n => n.id));
if (ids.size !== nodes.length) fail('node IDs are not unique');
if (strains.length !== 58) fail(`expected 58 integrated strain records, found ${strains.length}`);
if (archetypes.length !== 8) fail(`expected 8 integrated family labels, found ${archetypes.length}`);
if (strains.filter(s=>s.catalogTier==='core-35').length !== 35) fail('core-count roster must contain exactly 35 strains');
if (strains.filter(s=>s.catalogTier!=='core-35').length !== 23) fail('integrated expansion must contain exactly 23 additional strains');
if (catalogConflict.integratedEntries !== 60 || catalogConflict.laterMetaEntries !== 37) fail('catalog-count conflict is not encoded correctly');

for (const locked of ['RINGTHROAT','GOREVAULT']) {
  const s=strains.find(x=>x.name===locked);
  if (!s || s.status!=='canon' || s.catalogTier!=='locked-expansion') fail(`${locked} must remain a locked expansion entry`);
}
for (const e of edges) {
  if (!ids.has(e.source)) fail(`missing edge source ${e.source}`);
  if (!ids.has(e.target)) fail(`missing edge target ${e.target}`);
  if (!['body','macro'].includes(e.type)) fail(`invalid edge type ${e.type}`);
}
for (const n of nodes) {
  if (!['canon','unknown','provisional'].includes(n.status)) fail(`invalid node status ${n.status}`);
  for (const key of ['name','function','topology','evidence']) if (!n[key]) fail(`${n.id} missing ${key}`);
}
for (const s of strains) {
  for (const key of ['group','subtype','affinity','threat','timescale','topology','function','tactical','lore','catalogTier']) if (!s[key]) fail(`${s.name} missing ${key}`);
  if (!s.sourceBacked) fail(`${s.name} must retain sourceBacked=true`);
}
if (!characters.length) fail('character matrix is empty');
if (!kernelStages.some(s=>s.status==='unknown')) fail('Mother Kernel must preserve unknown states');
if (!evidence.some(e=>/37 entries|35 strains/i.test(e.claim))) fail('catalog count conflict evidence is missing');
if (sourceRefs.length < 4) fail('source cross-check inventory is incomplete');

const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
if (pkg.dependencies?.three !== '0.186.0') fail('Three.js must be pinned to 0.186.0');

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
if (!html.includes('id="threeStage"')) fail('Three.js stage missing');
if (!html.includes('"three": "./vendor/three.module.js"')) fail('local Three.js import map missing');
if (html.includes('id="lineageGraph"')) fail('legacy SVG lineage chart still present');
if (!html.includes('58 / 58')) fail('all-strain residency statement missing');
if (!app.includes("import * as THREE from 'three'")) fail('Three.js runtime import missing');
if (!app.includes('OrbitControls')) fail('OrbitControls integration missing');
if (!app.includes('CSS2DRenderer')) fail('3D label renderer missing');
if (!app.includes('for(const strain of familyStrains)')) fail('Three.js strain construction loop missing');
if (!app.includes('strainObjects.size!==strains.length')) fail('runtime 58-strain residency assertion missing');
if (!app.includes('controls.autoRotate')) fail('interactive camera orbit missing');
if (!app.includes('systemMotion')) fail('orbital lineage motion missing');
if (!app.includes('raycaster.intersectObjects')) fail('3D node selection missing');
if (html.match(/https?:\/\/[^"' ]+\.js/i) || app.match(/https?:\/\/[^"' ]+/i)) fail('runtime hotlink detected');

for (const file of ['dist/index.html','dist/styles.css','dist/app.js','dist/data/lineage.js','dist/vendor/three.module.js','dist/vendor/addons/controls/OrbitControls.js','dist/vendor/addons/renderers/CSS2DRenderer.js','dist/vendor/THREE-LICENSE.txt']) {
  if(!fs.existsSync(new URL(`../${file}`,import.meta.url))) fail(`missing built artifact ${file}`);
}

const publicData = JSON.stringify({nodes,strains,archetypes,sourceRefs,evidence});
const forbidden = [/drive\.google\.com/i,/\/Users\//i,/file_[0-9a-f]{12,}/i,/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i];
for (const p of forbidden) if (p.test(publicData)) fail(`private source metadata leaked: ${p}`);

if (!process.exitCode) console.log(`PASS: ${strains.length}/${strains.length} strains resident by construction; Three.js r186 pinned; orbital controls/build artifacts present.`);
