import { meta, nodes, strains, archetypes, edges, characters, kernelStages, evidence, sourceRefs, catalogConflict } from './data/lineage.js';

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const escapeHTML = (s='') => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const preview = (s='', n=230) => String(s).length > n ? String(s).slice(0,n-1).trim() + '…' : String(s);

const views = [
  ['network','Lineage Network','01'], ['registry','Compendium Registry','02'], ['matrix','Homology Ledger','03'],
  ['kernel','Mother Kernel','04'], ['compiler','Morphogenesis Compiler','05'], ['evidence','Evidence & Paleontology','06']
];

let edgeMode = 'all';
let graphGroup = 'overview';

function initNav(){
  $('#nav').innerHTML = views.map(([id,label,n]) => `<button data-view-target="${id}" class="${id==='network'?'is-active':''}"><span>${n}</span>${label}</button>`).join('');
  $('#nav').addEventListener('click', e => {
    const b=e.target.closest('button[data-view-target]'); if(!b) return;
    const target=b.dataset.viewTarget;
    $$('#nav button').forEach(x=>x.classList.toggle('is-active',x===b));
    $$('.view').forEach(v=>v.classList.toggle('is-active',v.dataset.view===target));
    location.hash=target;
  });
}

function statusPill(status){ return `<span class="status ${status}">${escapeHTML(status)}</span>`; }
function catalogPill(tier){
  const labels = {'core-35':'core 35','locked-expansion':'locked expansion','integrated-expansion':'integrated expansion','origin':'origin','future':'future'};
  return `<span class="catalog-tier ${escapeHTML(tier)}">${escapeHTML(labels[tier] || tier || 'unclassified')}</span>`;
}

function fillFamilyControls(){
  const options = archetypes.map(a=>`<option value="${a.code}">${escapeHTML(a.name)} (${a.strainCount})</option>`).join('');
  $('#networkGroup').insertAdjacentHTML('beforeend',options);
  $('#registryGroup').insertAdjacentHTML('beforeend',options);
  $('#networkGroup').addEventListener('change',e=>{ graphGroup=e.target.value; renderGraph(); });
  $('#registryGroup').addEventListener('change',renderRegistry);
}

function graphLayout(group){
  const layout = {};
  if(group==='overview'){
    const h = Math.max(760, archetypes.length*86+120);
    const mid = h/2;
    layout.mother={x:100,y:mid}; layout.egg={x:300,y:mid};
    archetypes.forEach((a,i)=> layout[a.id]={x:680,y:90+i*((h-180)/Math.max(1,archetypes.length-1))});
    layout['postwall-unknown']={x:1080,y:mid};
    return {layout,width:1200,height:h,visible:new Set(['mother','egg',...archetypes.map(a=>a.id),'postwall-unknown'])};
  }
  const family = archetypes.find(a=>a.code===group);
  const familyStrains = strains.filter(s=>s.group===group);
  const h = Math.max(760, familyStrains.length*88+140), mid=h/2;
  layout.mother={x:90,y:mid}; layout.egg={x:280,y:mid}; layout[family.id]={x:485,y:mid};
  familyStrains.forEach((s,i)=> layout[s.id]={x:790,y:80+i*((h-160)/Math.max(1,familyStrains.length-1))});
  layout['postwall-unknown']={x:1110,y:mid};
  return {layout,width:1220,height:h,visible:new Set(['mother','egg',family.id,...familyStrains.map(s=>s.id),'postwall-unknown'])};
}

function renderGraph(){
  const svg=$('#lineageGraph');
  const nodeById=Object.fromEntries(nodes.map(n=>[n.id,n]));
  const {layout,width,height,visible}=graphLayout(graphGroup);
  svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
  svg.style.minWidth = graphGroup==='overview' ? '980px' : '1040px';
  svg.style.height = `${Math.min(Math.max(height,650),1200)}px`;
  let visibleEdges = edges.filter(e=>visible.has(e.source)&&visible.has(e.target));
  if(graphGroup==='overview') visibleEdges = visibleEdges.filter(e=>e.source==='mother'||e.source==='egg');
  if(edgeMode!=='all') visibleEdges=visibleEdges.filter(e=>e.type===edgeMode);

  const defs=`<defs><marker id="arrow-body" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" class="arrow-body"/></marker><marker id="arrow-macro" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" class="arrow-macro"/></marker></defs>`;
  const edgeMarkup=visibleEdges.map(e=>{const a=layout[e.source],b=layout[e.target]; if(!a||!b)return ''; const bend=e.type==='macro'?75:0; return `<path class="edge ${e.type} ${e.status||''}" d="M ${a.x+66} ${a.y} Q ${(a.x+b.x)/2} ${(a.y+b.y)/2-bend} ${b.x-66} ${b.y}" marker-end="url(#arrow-${e.type})"><title>${escapeHTML(e.label)}</title></path>`}).join('');
  const nodeMarkup=[...visible].map(id=>nodeById[id]).filter(Boolean).map(n=>{const p=layout[n.id]; const label=n.name.length>22?n.name.slice(0,21)+'…':n.name; return `<g class="node ${n.tier} ${n.status}" data-node="${n.id}" tabindex="0" role="button"><rect x="${p.x-68}" y="${p.y-31}" width="136" height="62" rx="3"></rect><text x="${p.x}" y="${p.y-5}" text-anchor="middle">${escapeHTML(label)}</text><text class="node-sub" x="${p.x}" y="${p.y+15}" text-anchor="middle">${escapeHTML((n.group||n.tier).toUpperCase())}</text></g>`}).join('');
  svg.innerHTML=defs+edgeMarkup+nodeMarkup;
  $$('.node',svg).forEach(g=>{ const act=()=>inspectNode(g.dataset.node); g.addEventListener('click',act); g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act();}})});
  const defaultId = graphGroup==='overview' ? 'mother' : archetypes.find(a=>a.code===graphGroup)?.id;
  inspectNode(defaultId || 'mother');
}

function inspectNode(id){
  const n=nodes.find(x=>x.id===id); if(!n)return;
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
  $$('.node').forEach(x=>x.classList.toggle('selected',x.dataset.node===id));
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
  initNav(); fillFamilyControls(); renderGraph(); renderRegistry(); renderMatrix(); renderKernel(); setupCompiler(); renderEvidence();
  $('#strainCount').textContent=strains.length;
  $('#coreCount').textContent=strains.filter(n=>n.catalogTier==='core-35').length;
  $('#expandedCount').textContent=strains.filter(n=>n.catalogTier!=='core-35').length;
  $('#registrySearch').addEventListener('input',renderRegistry); $('#registryStatus').addEventListener('change',renderRegistry);
  $$('[data-edge-mode]').forEach(b=>b.addEventListener('click',()=>{edgeMode=b.dataset.edgeMode; $$('[data-edge-mode]').forEach(x=>x.classList.toggle('is-active',x===b));renderGraph();}));
  const hash=location.hash.slice(1); if(views.some(v=>v[0]===hash)) $(`#nav button[data-view-target="${hash}"]`).click();
  document.documentElement.dataset.ready='true';
  console.info(`${meta.project}: ${strains.length} source-backed strain records loaded; catalog conflict tracked`);
}
init();
