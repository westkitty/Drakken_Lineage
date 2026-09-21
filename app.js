import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { meta, nodes, strains, archetypes, edges, characters, kernelStages, evidence, sourceRefs, catalogConflict } from './data/lineage.js';

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const escapeHTML = (s='') => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const preview = (s='', n=230) => String(s).length > n ? String(s).slice(0,n-1).trim() + '…' : String(s);

const views = [
  ['network','Orbital Lineage Field','01'], ['registry','Compendium Registry','02'], ['matrix','Homology Ledger','03'],
  ['kernel','Mother Kernel','04'], ['compiler','Morphogenesis Compiler','05'], ['evidence','Evidence & Paleontology','06']
];

const familyColors = {
  'CRUST-BINDER': 0xff8a3d,
  'ATMOS-ENGINE': 0x5ee4ff,
  'SEEDCARRIER': 0x7df28b,
  'FLUXBORNE': 0x347dff,
  'ORBITAL-WYRM': 0xb26cff,
  'CIVIFORMER': 0xffd166,
  'NOOSPHERE-CANTOR': 0xff66c4,
  'GLITCH-TOUCHED': 0xff4545
};

const familyGeometries = {
  'CRUST-BINDER': () => new THREE.BoxGeometry(0.42,0.26,0.42),
  'ATMOS-ENGINE': () => new THREE.IcosahedronGeometry(0.28,1),
  'SEEDCARRIER': () => new THREE.DodecahedronGeometry(0.29,0),
  'FLUXBORNE': () => new THREE.SphereGeometry(0.28,14,9),
  'ORBITAL-WYRM': () => new THREE.TorusGeometry(0.25,0.075,7,14),
  'CIVIFORMER': () => new THREE.BoxGeometry(0.34,0.34,0.34),
  'NOOSPHERE-CANTOR': () => new THREE.OctahedronGeometry(0.31,0),
  'GLITCH-TOUCHED': () => new THREE.TetrahedronGeometry(0.34,0)
};

const nodeById = Object.fromEntries(nodes.map(n=>[n.id,n]));
let threeRuntime = null;

function initNav(){
  $('#nav').innerHTML = views.map(([id,label,n]) => `<button data-view-target="${id}" class="${id==='network'?'is-active':''}"><span>${n}</span>${label}</button>`).join('');
  $('#nav').addEventListener('click', e => {
    const b=e.target.closest('button[data-view-target]'); if(!b) return;
    const target=b.dataset.viewTarget;
    $$('#nav button').forEach(x=>x.classList.toggle('is-active',x===b));
    $$('.view').forEach(v=>v.classList.toggle('is-active',v.dataset.view===target));
    location.hash=target;
    if(target==='network') requestAnimationFrame(()=>threeRuntime?.resize());
  });
}

function statusPill(status){ return `<span class="status ${status}">${escapeHTML(status)}</span>`; }
function catalogPill(tier){
  const labels = {'core-35':'core 35','locked-expansion':'locked expansion','integrated-expansion':'integrated expansion','origin':'origin','future':'future'};
  return `<span class="catalog-tier ${escapeHTML(tier)}">${escapeHTML(labels[tier] || tier || 'unclassified')}</span>`;
}

function fillControls(){
  const familyOptions = archetypes.map(a=>`<option value="${a.code}">${escapeHTML(a.name)} (${a.strainCount})</option>`).join('');
  $('#networkFocusFamily').insertAdjacentHTML('beforeend',familyOptions);
  $('#registryGroup').insertAdjacentHTML('beforeend',familyOptions);
  $('#networkFindStrain').insertAdjacentHTML('beforeend',strains.map(s=>`<option value="${s.id}">${escapeHTML(s.name)} — ${escapeHTML(s.group)}</option>`).join(''));
  $('#registryGroup').addEventListener('change',renderRegistry);
}

function inspectNode(id){
  const n=nodeById[id]; if(!n)return;
  const incoming=edges.filter(e=>e.target===id), outgoing=edges.filter(e=>e.source===id);
  const strainFields = n.tier==='strain' ? `
    <dt>Family</dt><dd>${escapeHTML(n.group)}</dd>
    <dt>Subtype</dt><dd>${escapeHTML(n.subtype)}</dd>
    <dt>Affinity</dt><dd>${escapeHTML(n.affinity)}</dd>
    <dt>Threat</dt><dd>${escapeHTML(n.threat)}</dd>
    <dt>Timescale</dt><dd>${escapeHTML(n.timescale)}</dd>
    <dt>Topology</dt><dd>${escapeHTML(n.topology)}</dd>
    <dt>Capabilities</dt><dd>${escapeHTML(n.function)}</dd>
    <dt>Tactical</dt><dd>${escapeHTML(n.tactical)}</dd>
    <dt>Lore</dt><dd>${escapeHTML(n.lore)}</dd>` : `
    <dt>Role</dt><dd>${escapeHTML(n.subtype || n.name)}</dd>
    <dt>Function</dt><dd>${escapeHTML(n.function)}</dd>
    <dt>Topology</dt><dd>${escapeHTML(n.topology)}</dd>`;
  $('#inspector').innerHTML=`<div class="inspector-head"><span>${statusPill(n.status)} ${catalogPill(n.catalogTier)}</span><span class="tiny-label">${escapeHTML(n.tier)}</span></div><h3>${escapeHTML(n.name)}</h3><dl>${strainFields}<dt>Evidence</dt><dd>${escapeHTML(n.evidence)}</dd></dl><div class="edge-summary"><b>${incoming.length}</b> incoming / <b>${outgoing.length}</b> outgoing inheritance links</div>`;
}

function hashString(value){
  let h=2166136261;
  for(let i=0;i<value.length;i++){ h^=value.charCodeAt(i); h=Math.imul(h,16777619); }
  return h>>>0;
}

function orbitLine(radius,color,opacity=.16){
  const points=[];
  for(let i=0;i<128;i++){
    const a=(i/128)*Math.PI*2;
    points.push(new THREE.Vector3(Math.cos(a)*radius,0,Math.sin(a)*radius));
  }
  return new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false})
  );
}

function makeLabel(node,kind,color){
  const el=document.createElement('div');
  el.className=`three-label ${kind} ${node.status||''}`;
  el.dataset.nodeId=node.id;
  el.textContent=node.name;
  el.style.setProperty('--node-color',`#${new THREE.Color(color).getHexString()}`);
  const label=new CSS2DObject(el);
  label.center.set(0.5,0);
  return label;
}

function createLineSegments(color,opacity=.32){
  const geometry=new THREE.BufferGeometry();
  const material=new THREE.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false});
  const lines=new THREE.LineSegments(geometry,material);
  lines.frustumCulled=false;
  return {geometry,material,lines,pairs:[]};
}

function updateLineSegments(system){
  const positions=new Float32Array(system.pairs.length*6);
  const a=new THREE.Vector3(), b=new THREE.Vector3();
  system.pairs.forEach((pair,i)=>{
    pair[0].getWorldPosition(a); pair[1].getWorldPosition(b);
    const o=i*6;
    positions[o]=a.x; positions[o+1]=a.y; positions[o+2]=a.z;
    positions[o+3]=b.x; positions[o+4]=b.y; positions[o+5]=b.z;
  });
  system.geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
}

function setupThreeLineage(){
  const stage=$('#threeStage');
  const fallback=$('#threeFallback');
  const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try{
    renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
  }catch(error){
    fallback.hidden=false;
    console.error(error);
    return null;
  }

  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x020608);
  scene.fog=new THREE.FogExp2(0x020608,0.0085);

  const camera=new THREE.PerspectiveCamera(46,1,0.1,260);
  const homePosition=new THREE.Vector3(0,31,58);
  camera.position.copy(homePosition);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.domElement.className='three-canvas';
  renderer.domElement.setAttribute('aria-hidden','true');
  stage.prepend(renderer.domElement);

  const labelRenderer=new CSS2DRenderer();
  labelRenderer.domElement.className='three-label-layer';
  labelRenderer.domElement.setAttribute('aria-hidden','true');
  stage.append(labelRenderer.domElement);

  const controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;
  controls.dampingFactor=0.055;
  controls.minDistance=12;
  controls.maxDistance=115;
  controls.autoRotate=!prefersReduced;
  controls.autoRotateSpeed=0.28;
  controls.target.set(0,0,0);

  scene.add(new THREE.AmbientLight(0xbfefff,0.48));
  const keyLight=new THREE.PointLight(0x56dfff,44,130,2);
  keyLight.position.set(0,10,16);
  scene.add(keyLight);
  const rimLight=new THREE.PointLight(0xff4c48,24,110,2);
  rimLight.position.set(-25,-8,-24);
  scene.add(rimLight);

  const interactive=[];
  const objectById=new Map();
  const labelById=new Map();
  const strainObjects=new Map();
  const familySystems=[];
  const strainSystems=[];
  const sharedGeometries=new Map();
  let systemMotion=!prefersReduced;
  let selected=null;
  let cameraTween=null;

  const mother=new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.1,2),
    new THREE.MeshStandardMaterial({color:0x07161a,emissive:0x0a7d97,emissiveIntensity:1.15,roughness:.48,metalness:.18})
  );
  mother.userData={nodeId:'mother',kind:'origin'};
  scene.add(mother); interactive.push(mother); objectById.set('mother',mother);
  const motherLabel=makeLabel(nodeById.mother,'origin-label',0x35d8ff); motherLabel.position.set(0,2.7,0); mother.add(motherLabel); labelById.set('mother',motherLabel.element);

  const motherHalo1=new THREE.Mesh(new THREE.TorusGeometry(3.3,.025,5,160),new THREE.MeshBasicMaterial({color:0x35d8ff,transparent:true,opacity:.36,depthWrite:false}));
  motherHalo1.rotation.x=Math.PI/2.35; scene.add(motherHalo1);
  const motherHalo2=motherHalo1.clone(); motherHalo2.rotation.x=Math.PI/1.7; motherHalo2.rotation.y=.8; scene.add(motherHalo2);

  const eggPlane=new THREE.Group(); eggPlane.rotation.z=.32; eggPlane.rotation.x=.18; scene.add(eggPlane);
  const eggRing=orbitLine(5.4,0xcdf7ff,.2); eggPlane.add(eggRing);
  const eggRotor=new THREE.Group(); eggPlane.add(eggRotor);
  const eggRoot=new THREE.Group(); eggRoot.position.x=5.4; eggRotor.add(eggRoot);
  const eggMesh=new THREE.Mesh(new THREE.DodecahedronGeometry(.9,0),new THREE.MeshStandardMaterial({color:0xcff8ff,emissive:0x166b78,emissiveIntensity:.8,roughness:.3}));
  eggMesh.userData={nodeId:'egg',kind:'origin'}; eggRoot.add(eggMesh); interactive.push(eggMesh); objectById.set('egg',eggRoot);
  const eggLabel=makeLabel(nodeById.egg,'origin-label',0xcff8ff); eggLabel.position.set(0,1.15,0); eggRoot.add(eggLabel); labelById.set('egg',eggLabel.element);

  archetypes.forEach((family,index)=>{
    const color=familyColors[family.code] ?? 0x88aab0;
    const plane=new THREE.Group();
    plane.rotation.x=(-.34)+(index%4)*.19;
    plane.rotation.z=(-.28)+Math.floor(index/4)*.44;
    scene.add(plane);

    const radius=16.5+(index%4)*4.4+(Math.floor(index/4)*1.8);
    plane.add(orbitLine(radius,color,.11));

    const rotor=new THREE.Group(); plane.add(rotor);
    const hubRoot=new THREE.Group(); hubRoot.position.x=radius; rotor.add(hubRoot);
    const hubMesh=new THREE.Mesh(
      new THREE.IcosahedronGeometry(.72,1),
      new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.22,roughness:.55,metalness:.08})
    );
    hubMesh.userData={nodeId:family.id,kind:'family'}; hubRoot.add(hubMesh); interactive.push(hubMesh); objectById.set(family.id,hubRoot);
    const hubLabel=makeLabel(family,'family-label',color); hubLabel.position.set(0,1.12,0); hubRoot.add(hubLabel); labelById.set(family.id,hubLabel.element);

    const seed=hashString(family.id);
    const familySystem={family,plane,rotor,hubRoot,hubMesh,phase:(seed%628)/100,speed:.018+(index*.0024)};
    familySystems.push(familySystem);

    if(!sharedGeometries.has(family.code)) sharedGeometries.set(family.code,(familyGeometries[family.code]||familyGeometries['FLUXBORNE'])());

    const familyStrains=strains.filter(s=>s.group===family.code);
    for(const strain of familyStrains){
      const h=hashString(strain.id);
      const orbitPlane=new THREE.Group();
      orbitPlane.rotation.x=((h%71)-35)/105;
      orbitPlane.rotation.z=(((h>>>7)%61)-30)/110;
      hubRoot.add(orbitPlane);
      const strainRotor=new THREE.Group(); orbitPlane.add(strainRotor);
      const orbitalRadius=2.15+((h>>>5)%19)/10;
      const mesh=new THREE.Mesh(
        sharedGeometries.get(family.code),
        new THREE.MeshStandardMaterial({
          color,
          emissive:color,
          emissiveIntensity:strain.status==='canon'?.18:.08,
          roughness:.6,
          metalness:.06,
          transparent:true,
          opacity:strain.status==='canon'?.96:.76
        })
      );
      mesh.position.x=orbitalRadius;
      mesh.userData={nodeId:strain.id,kind:'strain'};
      strainRotor.add(mesh);
      interactive.push(mesh); objectById.set(strain.id,mesh); strainObjects.set(strain.id,mesh);

      const label=makeLabel(strain,'strain-label',color);
      label.position.set(0,.48,0);
      mesh.add(label); labelById.set(strain.id,label.element);

      strainSystems.push({
        strain,rotor:strainRotor,mesh,
        phase:(h%628)/100,
        speed:.17+((h>>>9)%27)/160,
        bobPhase:((h>>>15)%628)/100
      });
    }
  });

  const postwallRoot=new THREE.Group(); postwallRoot.position.set(0,-14,0); scene.add(postwallRoot);
  const postwallMesh=new THREE.Mesh(new THREE.OctahedronGeometry(.7,0),new THREE.MeshBasicMaterial({color:0x050607,wireframe:true,transparent:true,opacity:.78}));
  postwallMesh.userData={nodeId:'postwall-unknown',kind:'unknown'}; postwallRoot.add(postwallMesh); interactive.push(postwallMesh); objectById.set('postwall-unknown',postwallRoot);
  const postwallLabel=makeLabel(nodeById['postwall-unknown'],'unknown-label',0xff4c48); postwallLabel.position.set(0,1.1,0); postwallRoot.add(postwallLabel); labelById.set('postwall-unknown',postwallLabel.element);

  const bodyLines=createLineSegments(0x2d7584,.26); scene.add(bodyLines.lines);
  const macroLines=createLineSegments(0xd7a44a,.48); scene.add(macroLines.lines);
  for(const edge of edges){
    const a=objectById.get(edge.source), b=objectById.get(edge.target);
    if(!a||!b) continue;
    (edge.type==='macro'?macroLines:bodyLines).pairs.push([a,b]);
  }

  if(strainObjects.size!==strains.length){
    throw new Error(`Three.js lineage incomplete: ${strainObjects.size}/${strains.length} strain nodes resident.`);
  }
  if([...strainObjects.keys()].some(id=>!labelById.has(id))){
    throw new Error('Three.js lineage incomplete: one or more strain labels are missing.');
  }
  $('#networkResidentCount').textContent=`${strainObjects.size}/${strains.length}`;

  const raycaster=new THREE.Raycaster();
  const pointer=new THREE.Vector2();
  let downPoint=null;

  function selectNode(id,obj=null,focus=false){
    inspectNode(id);
    if(selected){
      selected.scale.setScalar(1);
      const oldLabel=labelById.get(selected.userData.nodeId);
      oldLabel?.classList.remove('is-selected');
    }
    selected=obj || objectById.get(id) || null;
    if(selected){
      selected.scale.setScalar(selected.userData.kind==='strain'?1.7:1.24);
      labelById.get(id)?.classList.add('is-selected');
      if(focus) focusObject(selected);
    }
  }

  function focusObject(obj){
    const target=new THREE.Vector3(); obj.getWorldPosition(target);
    const currentDirection=camera.position.clone().sub(controls.target);
    if(currentDirection.lengthSq()<.001) currentDirection.set(0,.45,1);
    currentDirection.normalize();
    const distance=obj.userData.kind==='strain'?8.5:obj.userData.kind==='family'?13:17;
    cameraTween={
      start:camera.position.clone(), end:target.clone().add(currentDirection.multiplyScalar(distance)),
      targetStart:controls.target.clone(), targetEnd:target.clone(),
      started:performance.now(), duration:720
    };
  }

  function tweenHome(){
    cameraTween={
      start:camera.position.clone(),end:homePosition.clone(),
      targetStart:controls.target.clone(),targetEnd:new THREE.Vector3(0,0,0),
      started:performance.now(),duration:850
    };
  }

  function pointerToNdc(event){
    const rect=renderer.domElement.getBoundingClientRect();
    pointer.x=((event.clientX-rect.left)/rect.width)*2-1;
    pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;
  }

  renderer.domElement.addEventListener('pointerdown',e=>{downPoint={x:e.clientX,y:e.clientY};});
  renderer.domElement.addEventListener('pointerup',e=>{
    if(!downPoint) return;
    const moved=Math.hypot(e.clientX-downPoint.x,e.clientY-downPoint.y); downPoint=null;
    if(moved>7) return;
    pointerToNdc(e); raycaster.setFromCamera(pointer,camera);
    const hit=raycaster.intersectObjects(interactive,false)[0];
    if(hit) selectNode(hit.object.userData.nodeId,hit.object,true);
  });
  renderer.domElement.addEventListener('pointermove',e=>{
    pointerToNdc(e); raycaster.setFromCamera(pointer,camera);
    renderer.domElement.style.cursor=raycaster.intersectObjects(interactive,false).length?'pointer':'grab';
  });

  controls.addEventListener('start',()=>{cameraTween=null;});

  $('#networkFocusFamily').addEventListener('change',e=>{
    if(e.target.value==='all'){ tweenHome(); return; }
    const family=archetypes.find(a=>a.code===e.target.value);
    const obj=family?objectById.get(family.id):null;
    if(obj) selectNode(family.id,obj,true);
  });
  $('#networkFindStrain').addEventListener('change',e=>{
    if(!e.target.value) return;
    const obj=strainObjects.get(e.target.value);
    if(obj) selectNode(e.target.value,obj,true);
  });

  const systemButton=$('#toggleSystemMotion');
  const cameraButton=$('#toggleCameraOrbit');
  function syncMotionButtons(){
    systemButton.setAttribute('aria-pressed',String(systemMotion));
    systemButton.textContent=`System motion: ${systemMotion?'on':'off'}`;
    cameraButton.setAttribute('aria-pressed',String(controls.autoRotate));
    cameraButton.textContent=`Camera orbit: ${controls.autoRotate?'on':'off'}`;
  }
  systemButton.addEventListener('click',()=>{systemMotion=!systemMotion; syncMotionButtons();});
  cameraButton.addEventListener('click',()=>{controls.autoRotate=!controls.autoRotate; syncMotionButtons();});
  $('#resetOrbit').addEventListener('click',()=>{tweenHome();});
  syncMotionButtons();

  const resize=()=>{
    const rect=stage.getBoundingClientRect();
    if(rect.width<2||rect.height<2) return;
    camera.aspect=rect.width/rect.height; camera.updateProjectionMatrix();
    renderer.setSize(rect.width,rect.height,false);
    labelRenderer.setSize(rect.width,rect.height);
  };
  const resizeObserver=new ResizeObserver(resize); resizeObserver.observe(stage); resize();

  const tempPos=new THREE.Vector3();
  const originPos=new THREE.Vector3();
  const animate=(time)=>{
    const seconds=time/1000;
    if(systemMotion){
      eggRotor.rotation.y=seconds*.11;
      familySystems.forEach((system,i)=>{
        system.rotor.rotation.y=system.phase+seconds*system.speed;
        system.hubMesh.rotation.y=seconds*(.16+i*.014);
      });
      strainSystems.forEach((system,i)=>{
        system.rotor.rotation.y=system.phase+seconds*system.speed;
        system.mesh.rotation.x=seconds*(.08+(i%5)*.008);
        system.mesh.rotation.y=seconds*(.12+(i%7)*.007);
        system.mesh.position.y=Math.sin(seconds*.48+system.bobPhase)*.18;
      });
      mother.rotation.y=seconds*.045;
      motherHalo1.rotation.z=seconds*.025;
      motherHalo2.rotation.z=-seconds*.018;
    }

    if(cameraTween){
      const p=Math.min(1,(performance.now()-cameraTween.started)/cameraTween.duration);
      const eased=1-Math.pow(1-p,3);
      camera.position.lerpVectors(cameraTween.start,cameraTween.end,eased);
      controls.target.lerpVectors(cameraTween.targetStart,cameraTween.targetEnd,eased);
      if(p>=1) cameraTween=null;
    }

    updateLineSegments(bodyLines);
    updateLineSegments(macroLines);
    controls.update();

    if($('#view-network').classList.contains('is-active') && !document.hidden){
      renderer.render(scene,camera);
      labelRenderer.render(scene,camera);
    }
  };
  renderer.setAnimationLoop(animate);

  const dispose=()=>{
    renderer.setAnimationLoop(null);
    resizeObserver.disconnect();
    controls.dispose();
    renderer.dispose();
    sharedGeometries.forEach(g=>g.dispose());
    scene.traverse(obj=>{ if(obj.material && obj.material.dispose) obj.material.dispose(); });
  };
  window.addEventListener('pagehide',dispose,{once:true});

  selectNode('mother',mother,false);
  return {resize,focusObject,dispose,strainObjects};
}

function renderRegistry(){
  const q=$('#registrySearch').value.trim().toLowerCase(), st=$('#registryStatus').value, group=$('#registryGroup').value;
  const rows=strains.filter(n=>(st==='all'||n.status===st)&&(group==='all'||n.group===group)&&(!q||JSON.stringify(n).toLowerCase().includes(q)));
  $('#registryGrid').innerHTML=rows.map(n=>`<article class="specimen-card panel"><div class="specimen-top"><span>${statusPill(n.status)} ${catalogPill(n.catalogTier)}</span><span class="tiny-label">${escapeHTML(n.group)}</span></div><h3>${escapeHTML(n.name)}</h3><p class="strain-subtype">${escapeHTML(n.subtype)}</p><div class="spec-grid"><span><b>AFFINITY</b>${escapeHTML(n.affinity)}</span><span><b>THREAT</b>${escapeHTML(n.threat)}</span><span><b>TIMESCALE</b>${escapeHTML(n.timescale)}</span></div><div class="divider"></div><p><b>BODY PLAN</b><br>${escapeHTML(preview(n.topology))}</p><p><b>FUNCTION</b><br>${escapeHTML(preview(n.function))}</p><p class="source"><b>EVIDENCE</b><br>${escapeHTML(n.evidence)}</p></article>`).join('') || `<div class="panel empty-state">No strain records match this filter.</div>`;
}

function renderMatrix(){
  $('#matrixTable tbody').innerHTML=characters.map(c=>`<tr><td><code>${c.id}</code></td><td>${escapeHTML(c.structure)}</td><td>${escapeHTML(c.warFunction)}</td><td>${escapeHTML(c.state)}</td><td>${escapeHTML(c.mechanism)}</td><td>${escapeHTML(c.confidence)}</td></tr>`).join('');
}
function renderKernel(){
  $('#kernelGrid').innerHTML=kernelStages.map(s=>`<article class="panel kernel-card ${s.status}"><div class="kernel-index">${s.stage}</div><div>${statusPill(s.status)}<h3>${escapeHTML(s.title)}</h3><p>${escapeHTML(s.body)}</p></div></article>`).join('');
}
function setupCompiler(){
  const candidateOptions=strains.map(n=>`<option value="${n.id}">${escapeHTML(n.name)} — ${escapeHTML(n.group)} — ${escapeHTML(n.status)}</option>`).join('');
  $('#ancestorSelect').innerHTML=candidateOptions;
  $('#macroSelect').innerHTML=`<option value="none">No cross-lineage Macro proposed</option>`+candidateOptions;
  $('#compilerForm').addEventListener('submit',e=>{e.preventDefault(); compileDescendant();});
  $('#clearCompiler').addEventListener('click',()=>{$('#compilerForm').reset(); $('#compilerOutput').className='panel compiler-output empty-state'; $('#compilerOutput').innerHTML='<p>Supply ancestry and selection pressure. The compiler will test derivation before describing appearance.</p>';});
}
function compileDescendant(){
  const ancestor=strains.find(n=>n.id===$('#ancestorSelect').value);
  const macro=$('#macroSelect').value==='none'?null:strains.find(n=>n.id===$('#macroSelect').value);
  const niche=$('#nicheInput').value.trim(), pressure=$('#pressureInput').value.trim(), retained=$('#retainInput').value.trim(), loss=$('#lossInput').value.trim();
  const flags=[];
  if(retained.length<12) flags.push('Retained homology is too vague to establish visible ancestry.');
  if(loss.length<12) flags.push('Loss/reduction needs a causal anatomical statement, not a label.');
  if(ancestor.status==='provisional') flags.push('Body ancestor is source-backed but sits inside the unresolved integrated-expansion count conflict.');
  if(macro?.status==='provisional') flags.push('Macro donor is source-backed but sits inside the unresolved integrated-expansion count conflict.');
  if(macro && macro.id===ancestor.id) flags.push('Macro donor duplicates the body ancestor; no cross-lineage inheritance is demonstrated.');
  const verdict=flags.length?'PROVISIONAL / REVIEW REQUIRED':'DERIVATION PLAUSIBLE — NOT CANON';
  const record={status:'provisional',ancestry:{body:[ancestor.id],macro:macro?[macro.id]:[]},source_catalog_state:{body:ancestor.catalogTier,macro:macro?macro.catalogTier:null},niche,selection_pressure:pressure,morphology:{retained:[retained],reduced:[loss],lost:[],repurposed:[]},evidence:[ancestor.evidence],verdict,caveats:flags};
  $('#compilerOutput').className='panel compiler-output';
  $('#compilerOutput').innerHTML=`<div class="compiler-verdict ${flags.length?'warn':'pass'}">${verdict}</div><h3>Derived from ${escapeHTML(ancestor.name)}</h3><dl><dt>Family</dt><dd>${escapeHTML(ancestor.group)}</dd><dt>Ancestral job</dt><dd>${escapeHTML(ancestor.function)}</dd><dt>Post-Wall niche</dt><dd>${escapeHTML(niche)}</dd><dt>Selection pressure</dt><dd>${escapeHTML(pressure)}</dd><dt>Retained homology</dt><dd>${escapeHTML(retained)}</dd><dt>Loss / reduction</dt><dd>${escapeHTML(loss)}</dd><dt>Macro ancestry</dt><dd>${macro?escapeHTML(macro.name):'None proposed'}</dd></dl>${flags.length?`<div class="flags"><b>BLOCKERS / UNCERTAINTY</b>${flags.map(f=>`<p>— ${escapeHTML(f)}</p>`).join('')}</div>`:''}<button id="exportRecord">Export JSON</button>`;
  $('#exportRecord').addEventListener('click',()=>downloadJSON(record,`drakken-descendant-${Date.now()}.json`));
}
function downloadJSON(obj,name){
  const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function renderEvidence(){
  $('#catalogConflictCard').innerHTML=`<div><span class="eyebrow">CATALOG CONFLICT ${escapeHTML(catalogConflict.id)}</span><h3>${catalogConflict.integratedStrains} direct strain entries vs. ${catalogConflict.laterMetaStrains} later declared strains</h3><p>The integrated Compendium contains <b>${catalogConflict.integratedEntries}</b> full entries across <b>${catalogConflict.integratedFamilies}</b> family labels. Later meta-canon still states <b>${catalogConflict.laterMetaEntries}</b> entries / <b>${catalogConflict.laterMetaStrains}</b> strains / <b>${catalogConflict.laterMetaFamilies}</b> archetypes. Nothing is silently discarded: all direct entries are visible, while unresolved expansion records are marked provisional.</p></div>`;
  $('#sourceList').innerHTML=sourceRefs.map(s=>`<article class="panel source-card"><span class="tiny-label">${escapeHTML(s.date)} · ${escapeHTML(s.role)}</span><h3>${escapeHTML(s.label)}</h3><p>${escapeHTML(s.scope)}</p></article>`).join('');
  $('#evidenceList').innerHTML=`<div class="evidence-head"><span>Claim</span><span>Authorial truth</span><span>Drakken reconstruction</span><span>Source</span></div>`+evidence.map(x=>`<div class="evidence-row"><p>${escapeHTML(x.claim)}</p><p>${escapeHTML(x.authorial)}</p><p>${escapeHTML(x.scholarly)}</p><p>${escapeHTML(x.source)}</p></div>`).join('');
}

function init(){
  initNav(); fillControls(); renderRegistry(); renderMatrix(); renderKernel(); setupCompiler(); renderEvidence();
  $('#strainCount').textContent=strains.length;
  $('#coreCount').textContent=strains.filter(n=>n.catalogTier==='core-35').length;
  $('#expandedCount').textContent=strains.filter(n=>n.catalogTier!=='core-35').length;
  $('#registrySearch').addEventListener('input',renderRegistry);
  $('#registryStatus').addEventListener('change',renderRegistry);

  threeRuntime=setupThreeLineage();

  const hash=location.hash.slice(1);
  if(views.some(v=>v[0]===hash)) $(
    `#nav button[data-view-target="${hash}"]`
  ).click();
  document.documentElement.dataset.ready='true';
  console.info(`${meta.project}: ${strains.length} source-backed strains resident in Three.js lineage field.`);
}
init();
