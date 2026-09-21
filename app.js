import { meta, nodes, edges, characters, kernelStages, evidence } from './data/lineage.js';

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const escapeHTML = (s='') => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const views = [
  ['network','Lineage Network','01'], ['registry','Specimen Registry','02'], ['matrix','Homology Ledger','03'],
  ['kernel','Mother Kernel','04'], ['compiler','Morphogenesis Compiler','05'], ['evidence','Evidence & Paleontology','06']
];

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

function renderGraph(mode='all'){
  const svg=$('#lineageGraph');
  const visibleEdges=edges.filter(e=>mode==='all'||e.type===mode);
  const nodeById=Object.fromEntries(nodes.map(n=>[n.id,n]));
  const defs=`<defs><marker id="arrow-body" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" class="arrow-body"/></marker><marker id="arrow-macro" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" class="arrow-macro"/></marker></defs>`;
  const edgeMarkup=visibleEdges.map(e=>{const a=nodeById[e.source],b=nodeById[e.target]; const bend=e.type==='macro'?80:0; return `<path class="edge ${e.type}" d="M ${a.x+65} ${a.y} Q ${(a.x+b.x)/2} ${(a.y+b.y)/2-bend} ${b.x-65} ${b.y}" marker-end="url(#arrow-${e.type})"><title>${escapeHTML(e.label)}</title></path>`}).join('');
  const nodeMarkup=nodes.map(n=>`<g class="node ${n.tier} ${n.status}" data-node="${n.id}" tabindex="0" role="button"><rect x="${n.x-66}" y="${n.y-30}" width="132" height="60" rx="3"></rect><text x="${n.x}" y="${n.y-4}" text-anchor="middle">${escapeHTML(n.name.length>19?n.name.slice(0,18)+'…':n.name)}</text><text class="node-sub" x="${n.x}" y="${n.y+15}" text-anchor="middle">${escapeHTML(n.tier.toUpperCase())}</text></g>`).join('');
  svg.innerHTML=defs+edgeMarkup+nodeMarkup;
  $$('.node',svg).forEach(g=>{ const act=()=>inspectNode(g.dataset.node); g.addEventListener('click',act); g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act();}})});
  inspectNode('mother');
}

function inspectNode(id){
  const n=nodes.find(x=>x.id===id); if(!n)return;
  const incoming=edges.filter(e=>e.target===id), outgoing=edges.filter(e=>e.source===id);
  $('#inspector').innerHTML=`<div class="inspector-head">${statusPill(n.status)}<span class="tiny-label">${escapeHTML(n.tier)}</span></div><h3>${escapeHTML(n.name)}</h3><dl><dt>Role</dt><dd>${escapeHTML(n.archetype)}</dd><dt>Function</dt><dd>${escapeHTML(n.function)}</dd><dt>Topology</dt><dd>${escapeHTML(n.topology)}</dd><dt>Evidence</dt><dd>${escapeHTML(n.evidence)}</dd></dl><div class="edge-summary"><b>${incoming.length}</b> incoming / <b>${outgoing.length}</b> outgoing inheritance links</div>`;
  $$('.node').forEach(x=>x.classList.toggle('selected',x.dataset.node===id));
}

function renderRegistry(){
  const q=$('#registrySearch').value.trim().toLowerCase(), st=$('#registryStatus').value;
  const rows=nodes.filter(n=>(st==='all'||n.status===st)&&(!q||JSON.stringify(n).toLowerCase().includes(q)));
  $('#registryGrid').innerHTML=rows.map(n=>`<article class="specimen-card panel"><div class="specimen-top">${statusPill(n.status)}<span class="tiny-label">${escapeHTML(n.tier)}</span></div><h3>${escapeHTML(n.name)}</h3><p class="function">${escapeHTML(n.function)}</p><div class="divider"></div><p><b>TOPOLOGY</b><br>${escapeHTML(n.topology)}</p><p class="source"><b>EVIDENCE</b><br>${escapeHTML(n.evidence)}</p></article>`).join('') || `<div class="panel empty-state">No records match this filter.</div>`;
}

function renderMatrix(){
  $('#matrixTable tbody').innerHTML=characters.map(c=>`<tr><td><code>${c.id}</code></td><td>${escapeHTML(c.structure)}</td><td>${escapeHTML(c.warFunction)}</td><td>${escapeHTML(c.state)}</td><td>${escapeHTML(c.mechanism)}</td><td>${escapeHTML(c.confidence)}</td></tr>`).join('');
}

function renderKernel(){
  $('#kernelGrid').innerHTML=kernelStages.map(s=>`<article class="panel kernel-card ${s.status}"><div class="kernel-index">${s.stage}</div><div>${statusPill(s.status)}<h3>${escapeHTML(s.title)}</h3><p>${escapeHTML(s.body)}</p></div></article>`).join('');
}

function setupCompiler(){
  const candidates=nodes.filter(n=>n.tier==='strain');
  $('#ancestorSelect').innerHTML=candidates.map(n=>`<option value="${n.id}">${escapeHTML(n.name)} — ${escapeHTML(n.function)}</option>`).join('');
  $('#macroSelect').innerHTML=`<option value="none">No cross-lineage Macro proposed</option>`+candidates.map(n=>`<option value="${n.id}">${escapeHTML(n.name)} architecture</option>`).join('');
  $('#compilerForm').addEventListener('submit',e=>{e.preventDefault(); compileDescendant();});
  $('#clearCompiler').addEventListener('click',()=>{$('#compilerForm').reset(); $('#compilerOutput').className='panel compiler-output empty-state'; $('#compilerOutput').innerHTML='<p>Supply ancestry and selection pressure. The compiler will test derivation before describing appearance.</p>';});
}

function compileDescendant(){
  const ancestor=nodes.find(n=>n.id===$('#ancestorSelect').value);
  const macro=$('#macroSelect').value==='none'?null:nodes.find(n=>n.id===$('#macroSelect').value);
  const niche=$('#nicheInput').value.trim(), pressure=$('#pressureInput').value.trim(), retained=$('#retainInput').value.trim(), loss=$('#lossInput').value.trim();
  const flags=[];
  if(retained.length<12) flags.push('Retained homology is too vague to establish visible ancestry.');
  if(loss.length<12) flags.push('Loss/reduction needs a causal anatomical statement, not a label.');
  if(ancestor.topology.toLowerCase().includes('source-backed strain; full morphology deliberately deferred')) flags.push('Ancestor morphology is incompletely extracted; derivation confidence is limited.');
  if(macro && macro.id===ancestor.id) flags.push('Macro donor duplicates the body ancestor; no cross-lineage inheritance is demonstrated.');
  const verdict=flags.length?'PROVISIONAL / INCOMPLETE':'DERIVATION PLAUSIBLE — NOT CANON';
  const record={
    status:'provisional', ancestry:{body:[ancestor.id],macro:macro?[macro.id]:[]},
    niche, selection_pressure:pressure,
    morphology:{retained:[retained],reduced:[loss],lost:[],repurposed:[]},
    evidence:[ancestor.evidence], verdict, caveats:flags
  };
  $('#compilerOutput').className='panel compiler-output';
  $('#compilerOutput').innerHTML=`<div class="compiler-verdict ${flags.length?'warn':'pass'}">${verdict}</div><h3>Derived from ${escapeHTML(ancestor.name)}</h3><dl><dt>Ancestral job</dt><dd>${escapeHTML(ancestor.function)}</dd><dt>Post-Wall niche</dt><dd>${escapeHTML(niche)}</dd><dt>Selection pressure</dt><dd>${escapeHTML(pressure)}</dd><dt>Retained homology</dt><dd>${escapeHTML(retained)}</dd><dt>Loss / reduction</dt><dd>${escapeHTML(loss)}</dd><dt>Macro ancestry</dt><dd>${macro?escapeHTML(macro.name):'None proposed'}</dd></dl>${flags.length?`<div class="flags"><b>BLOCKERS / UNCERTAINTY</b>${flags.map(f=>`<p>— ${escapeHTML(f)}</p>`).join('')}</div>`:''}<button id="exportRecord">Export JSON</button>`;
  $('#exportRecord').addEventListener('click',()=>downloadJSON(record,`drakken-descendant-${Date.now()}.json`));
}

function downloadJSON(obj,name){
  const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}

function renderEvidence(){
  $('#evidenceList').innerHTML=`<div class="evidence-head"><span>Claim</span><span>Authorial truth</span><span>Drakken reconstruction</span><span>Source</span></div>`+evidence.map(x=>`<div class="evidence-row"><p>${escapeHTML(x.claim)}</p><p>${escapeHTML(x.authorial)}</p><p>${escapeHTML(x.scholarly)}</p><p>${escapeHTML(x.source)}</p></div>`).join('');
}

function init(){
  initNav(); renderGraph(); renderRegistry(); renderMatrix(); renderKernel(); setupCompiler(); renderEvidence();
  $('#canonCount').textContent=nodes.filter(n=>n.status==='canon').length;
  $('#unknownCount').textContent=nodes.filter(n=>n.status==='unknown').length;
  $('#registrySearch').addEventListener('input',renderRegistry); $('#registryStatus').addEventListener('change',renderRegistry);
  $$('[data-edge-mode]').forEach(b=>b.addEventListener('click',()=>{$$('[data-edge-mode]').forEach(x=>x.classList.toggle('is-active',x===b));renderGraph(b.dataset.edgeMode);}));
  const hash=location.hash.slice(1); if(views.some(v=>v[0]===hash)) $(`#nav button[data-view-target="${hash}"]`).click();
  document.documentElement.dataset.ready='true';
  console.info(`${meta.project}: canon firewall active`);
}

init();
