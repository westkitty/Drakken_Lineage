import { strains, archetypes } from './data/lineage.js';
import { visualProfiles, featuredVisualIds, visualSourceNote } from './data/visual-profiles.js';

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const strainById = Object.fromEntries(strains.map(s => [s.id, s]));
const familyHex = {
  'CRUST-BINDER':'#ff8a3d','ATMOS-ENGINE':'#5ee4ff','SEEDCARRIER':'#7df28b','FLUXBORNE':'#347dff',
  'ORBITAL-WYRM':'#b26cff','CIVIFORMER':'#ffd166','NOOSPHERE-CANTOR':'#ff66c4','GLITCH-TOUCHED':'#ff4545'
};
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let currentId = strains[0] ? strains[0].id : null;
let tourTimer = null;
let atlasSeed = 0;

function esc(v){ return String(v == null ? '' : v).replace(/[&<>\"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]; }); }
function preview(v,n){ v=String(v||''); return v.length>n ? v.slice(0,n-1).trim()+'…' : v; }
function colorFor(s){ return familyHex[s.group] || '#8ea9ac'; }
function morphFor(s){
  if(visualProfiles[s.id]) return visualProfiles[s.id].morph;
  var p=(s.topology+' '+s.function+' '+s.subtype).toLowerCase();
  if(/ring|loop|coil|halo/.test(p)) return 'ring-form';
  if(/mouth|maw|gullet|throat/.test(p)) return 'maw-form';
  if(/tower|city|fort|bastion|arch|grid|habitat/.test(p)) return 'architectural';
  if(/seed|pod|petal|pollen|nest/.test(p)) return 'radial-seed';
  if(/serpent|elongat|ribbon|spine|worm/.test(p)) return 'long-form';
  if(/swarm|colony|distributed|choir|mycel/.test(p)) return 'distributed';
  if(/void|null|singular|umbral/.test(p)) return 'void-crescent';
  return ({'CRUST-BINDER':'lithic-low','ATMOS-ENGINE':'aerial-lobed','SEEDCARRIER':'radial-seed','FLUXBORNE':'fluid-crown','ORBITAL-WYRM':'ring-form','CIVIFORMER':'architectural','NOOSPHERE-CANTOR':'signal-crown','GLITCH-TOUCHED':'fracture-form'})[s.group] || 'fracture-form';
}

function ring(cx,cy,rx,ry,c,w){ return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="none" stroke="'+c+'" stroke-width="'+(w||4)+'"/>'; }
function line(x1,y1,x2,y2,c,w){ return '<path d="M'+x1+' '+y1+'L'+x2+' '+y2+'" fill="none" stroke="'+c+'" stroke-width="'+(w||4)+'" stroke-linecap="round"/>'; }
function circle(cx,cy,r,fill,stroke,w){ return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+fill+'" stroke="'+(stroke||fill)+'" stroke-width="'+(w||2)+'"/>'; }
function polygon(points,fill,stroke,w){ return '<polygon points="'+points+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+(w||4)+'" stroke-linejoin="round"/>'; }

function specimenSvg(s, theatre){
  var c=colorFor(s), morph=morphFor(s), a='#e6fcff', d='#061014', out=[];
  out.push('<svg viewBox="0 0 360 230" role="img" aria-label="Interpretive morphogram of '+esc(s.name)+'" xmlns="http://www.w3.org/2000/svg">');
  out.push('<rect width="360" height="230" rx="18" fill="#020708"/>');
  out.push('<path d="M0 171H360" stroke="'+c+'" stroke-opacity=".13"/>');
  out.push('<path d="M14 40V14h26 M320 14h26v26 M14 190v26h26 M320 216h26v-26" fill="none" stroke="'+c+'" stroke-opacity=".52" stroke-width="2"/>');
  out.push('<g class="morph-body">');

  if(morph==='magma-arch'){
    out.push('<path d="M45 163C73 53 213 30 316 143" fill="none" stroke="'+c+'" stroke-width="7"/>');
    for(var i=0;i<9;i++){var x=66+i*29,y=116-Math.sin(i/8*Math.PI)*59;out.push('<ellipse cx="'+x+'" cy="'+y+'" rx="11" ry="20" fill="'+d+'" stroke="'+c+'" stroke-width="4"/>');out.push(circle(x,y,4,c,a,1));out.push(line(x-6,y+16,x-19,y+39,c,3));out.push(line(x+6,y+16,x+20,y+39,c,3));}
  } else if(morph==='crystal-spire'){
    out.push('<path d="M184 190C145 138 194 76 166 28" fill="none" stroke="'+c+'" stroke-width="6"/>');
    for(var j=0;j<10;j++){var yy=173-j*14,xx=180+Math.sin(j*.8)*15,dir=j%2?1:-1;out.push(polygon(xx+','+yy+' '+(xx+dir*40)+','+(yy-31)+' '+(xx+dir*16)+','+(yy+9),c,a,1));}
    out.push(line(172,166,128,219,c,4));out.push(line(192,165,234,219,c,4));
  } else if(morph==='fortress-beast'){
    out.push(polygon('54,141 88,75 184,51 301,102 278,160 107,171',d,c,5));out.push('<rect x="151" y="85" width="65" height="42" rx="9" fill="'+c+'" stroke="'+a+'" stroke-width="2"/>');out.push(line(104,155,74,218,c,6));out.push(line(255,151,292,218,c,6));out.push(line(184,158,190,220,c,5));out.push('<path d="M123 79V33h31v41M217 77V20h31v68" fill="none" stroke="'+c+'" stroke-width="6"/>');
  } else if(morph==='storm-maw' || morph==='maw-form'){
    out.push('<path d="M35 103C87 38 253 42 325 111C251 186 91 189 35 103Z" fill="'+d+'" stroke="'+c+'" stroke-width="6"/>');out.push('<path d="M90 112Q180 180 275 111" fill="#010303" stroke="'+a+'" stroke-width="3"/>');for(var t=0;t<13;t++){var tx=104+t*13;out.push(polygon((tx-5)+',108 '+tx+',130 '+(tx+5)+',108',a,a,0));}out.push('<path d="M300 126C346 133 339 193 274 186" fill="none" stroke="'+c+'" stroke-width="5"/>');
  } else if(morph==='loop-serpent' || morph==='vertebral-loop' || morph==='singularity-coil'){
    out.push(ring(180,115,107,67,c,5));for(var q=0;q<16;q++){var ang=q/16*Math.PI*2,qx=180+Math.cos(ang)*107,qy=115+Math.sin(ang)*67;out.push('<rect x="'+(qx-8)+'" y="'+(qy-7)+'" width="16" height="14" rx="3" fill="'+d+'" stroke="'+c+'" stroke-width="3" transform="rotate('+(ang*180/Math.PI)+' '+qx+' '+qy+')"/>');if(morph==='vertebral-loop'){out.push(line(qx,qy,qx+Math.cos(ang)*23,qy+Math.sin(ang)*23,c,2));}}if(morph==='singularity-coil')out.push(circle(180,115,22,'#000',c,5));
  } else if(morph==='canopy-antlers'){
    out.push(polygon('120,139 150,93 215,96 244,138 221,171 139,171',d,c,5));out.push(line(145,160,110,219,c,5));out.push(line(218,160,252,219,c,5));out.push('<path d="M158 101C95 87 76 45 122 27M203 101C265 87 285 44 240 27M119 59L75 45M126 42L110 15M242 59L286 44M235 42L250 15" fill="none" stroke="'+c+'" stroke-width="5" stroke-linecap="round"/>');
  } else if(morph==='radial-seed'){
    for(var p=0;p<10;p++){out.push('<path d="M180 104C151 73 154 37 180 16C206 37 209 73 180 104Z" fill="'+d+'" stroke="'+c+'" stroke-width="4" transform="rotate('+(p*36)+' 180 115)"/>');}out.push(circle(180,115,26,c,a,2));
  } else if(morph==='solar-orbit'){
    out.push(circle(180,115,35,c,a,2));out.push('<ellipse cx="180" cy="115" rx="122" ry="40" fill="none" stroke="'+c+'" stroke-width="5" transform="rotate(-18 180 115)"/>');out.push('<ellipse cx="180" cy="115" rx="88" ry="81" fill="none" stroke="'+c+'" stroke-width="5" transform="rotate(35 180 115)"/>');for(var o=0;o<8;o++){out.push(polygon('180,74 196,25 210,65',d,c,3).replace('<polygon','<polygon transform="rotate('+(o*45)+' 180 115)"'));}
  } else if(morph==='void-crescent'){
    out.push('<path d="M241 29C111 17 48 111 111 188C169 251 296 174 257 91C235 145 165 151 143 111C119 67 185 35 241 29Z" fill="'+d+'" stroke="'+c+'" stroke-width="6"/>');out.push(circle(211,118,18,'#000',c,4));
  } else if(morph==='data-maw'){
    out.push(polygon('60,95 180,45 305,94 270,157 180,188 87,157','#010303',c,5));for(var m=0;m<15;m++){var mx=91+m*13;out.push(polygon((mx-5)+',104 '+mx+',127 '+(mx+5)+',104',a,a,0));out.push(polygon((mx-5)+',151 '+mx+',129 '+(mx+5)+',151',a,a,0));}
  } else if(morph==='cracked-cradle'){
    out.push('<path d="M180 18C106 34 92 166 180 214C268 166 254 34 180 18Z" fill="'+d+'" stroke="'+c+'" stroke-width="6"/>');out.push('<path d="M179 32L161 74L190 99L163 137L188 171L178 204" fill="none" stroke="'+c+'" stroke-width="8"/>');out.push(circle(190,118,18,c,a,2));
  } else if(morph==='glitch-howler' || morph==='fracture-form'){
    out.push(polygon('45,153 112,80 182,63 290,107 245,146 173,163 108,179',d,c,5));out.push(line(105,164,72,219,c,5));out.push(line(215,153,250,219,c,5));out.push(line(277,113,323,78,c,4));for(var g=0;g<12;g++){out.push('<rect x="'+(78+g*19)+'" y="'+(66+(g%3)*30)+'" width="'+(10+(g%4)*8)+'" height="'+(5+(g%2)*6)+'" fill="'+(g%2?c:a)+'" opacity="'+(.4+(g%4)*.13)+'"/>');}
  } else if(morph==='walking-bastion' || morph==='architectural'){
    out.push(polygon('126,144 126,68 157,27 224,27 250,72 250,152',d,c,5));out.push('<rect x="149" y="78" width="44" height="31" fill="'+c+'" stroke="'+a+'" stroke-width="2"/>');out.push('<rect x="205" y="112" width="36" height="27" fill="'+c+'" stroke="'+a+'" stroke-width="2"/>');out.push(line(143,148,98,220,c,6));out.push(line(232,148,274,220,c,6));out.push(line(188,151,188,221,c,5));
  } else if(morph==='long-form'){
    out.push('<path d="M53 171C104 34 200 196 311 58" fill="none" stroke="'+c+'" stroke-width="6"/>');for(var l=0;l<11;l++){out.push(circle(68+l*22,139+Math.sin(l*.9)*34,9,d,c,3));}
  } else if(morph==='distributed'){
    for(var d0=0;d0<15;d0++){var da=d0/15*Math.PI*2,dr=34+(d0%5)*14;out.push(circle(180+Math.cos(da)*dr,115+Math.sin(da)*dr*.6,6+(d0%3)*3,d0%4===0?c:d,c,2));}out.push(circle(180,115,19,c,a,2));
  } else if(morph==='signal-crown'){
    out.push(circle(180,122,27,d,c,4));for(var s0=0;s0<9;s0++){var sa=s0/9*Math.PI*2;out.push(line(180+Math.cos(sa)*24,122+Math.sin(sa)*24,180+Math.cos(sa)*87,122+Math.sin(sa)*87,c,3));out.push(circle(180+Math.cos(sa)*92,122+Math.sin(sa)*92,4,c,a,1));}
  } else if(morph==='aerial-lobed'){
    for(var a0=0;a0<7;a0++){out.push('<ellipse cx="'+(102+a0*26)+'" cy="'+(112+Math.sin(a0)*18)+'" rx="38" ry="20" fill="'+d+'" stroke="'+c+'" stroke-width="4"/>');}out.push('<path d="M75 153Q180 210 292 153" fill="none" stroke="'+c+'" stroke-width="5"/>');
  } else if(morph==='fluid-crown'){
    out.push(circle(180,115,23,c,a,2));for(var f=0;f<8;f++){out.push('<path d="M180 91C149 62 161 27 180 12" fill="none" stroke="'+c+'" stroke-width="5" stroke-linecap="round" transform="rotate('+(f*45)+' 180 115)"/>');}
  } else if(morph==='ring-form'){
    out.push(ring(180,115,108,54,c,5));out.push(circle(287,115,13,c,a,1));out.push(line(70,115,24,115,c,4));out.push(line(291,115,339,115,c,4));
  } else {
    out.push(polygon('58,156 113,83 176,66 287,112 249,170 109,177',d,c,5));out.push(line(116,168,84,220,c,5));out.push(line(237,164,270,220,c,5));
  }
  out.push('</g>');
  if(theatre) out.push('<text x="20" y="213" fill="#e8ffff" font-family="ui-monospace,monospace" font-size="14" font-weight="800" letter-spacing="2">'+esc(s.name)+'</text>');
  out.push('</svg>');
  return out.join('');
}

function ensureAtlasNav(){
  var nav=$('#nav'); if(!nav || nav.querySelector('[data-view-target="atlas"]')) return;
  var b=document.createElement('button'); b.dataset.viewTarget='atlas'; b.innerHTML='<span>02</span>Specimen Atlas';
  var first=nav.querySelector('button[data-view-target="network"]'); if(first) first.insertAdjacentElement('afterend',b); else nav.appendChild(b);
  var buttons=$$('#nav button'); buttons.forEach(function(btn,i){ var sp=btn.querySelector('span'); if(sp) sp.textContent=String(i+1).padStart(2,'0'); });
}

function renderAtlas(){
  var root=$('#atlasGrid'); if(!root) return;
  var q=($('#atlasSearch')&&$('#atlasSearch').value||'').trim().toLowerCase();
  var family=$('#atlasFamily') ? $('#atlasFamily').value : 'all';
  var study=$('#atlasStudy') ? $('#atlasStudy').value : 'all';
  var rows=strains.filter(function(s){
    var studyPass=study==='all' || (study==='matched' ? !!visualProfiles[s.id] : !visualProfiles[s.id]);
    return (family==='all'||s.group===family) && studyPass && (!q || JSON.stringify(s).toLowerCase().includes(q));
  });
  if(atlasSeed) rows=rows.slice().sort(function(a,b){ return ((hash(a.id)+atlasSeed)%997)-((hash(b.id)+atlasSeed)%997); });
  if($('#atlasVisibleCount')) $('#atlasVisibleCount').textContent=rows.length;
  root.innerHTML=rows.map(function(s,i){
    var matched=!!visualProfiles[s.id], c=colorFor(s);
    return '<article class="atlas-card panel '+(matched?'is-matched':'')+'" style="--card-accent:'+c+';--delay:'+(Math.min(i,18)*28)+'ms"><button type="button" class="atlas-card-button" data-open-theatre="'+esc(s.id)+'" aria-label="Open '+esc(s.name)+' specimen theatre"><div class="atlas-visual">'+specimenSvg(s,false)+'</div><div class="atlas-copy"><span class="tiny-label">'+esc(s.group)+'</span><h3>'+esc(s.name)+'</h3><p>'+esc(preview(s.topology,115))+'</p><span class="study-line">'+(matched?'◈ Drive-calibrated':'◇ source-text study')+'</span></div></button></article>';
  }).join('') || '<div class="panel empty-state">No strains match these filters.</div>';
  bindTilt();
}
function hash(v){ var h=2166136261; for(var i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619);} return h>>>0; }
function bindTilt(){
  if(reducedMotion) return;
  $$('.atlas-card').forEach(function(card){
    card.onpointermove=function(e){var r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.setProperty('--ry',(x*7)+'deg');card.style.setProperty('--rx',(-y*6)+'deg');};
    card.onpointerleave=function(){card.style.setProperty('--ry','0deg');card.style.setProperty('--rx','0deg');};
  });
}
function animateAtlas(){ $$('.atlas-card').forEach(function(c){c.classList.remove('enter');void c.offsetWidth;c.classList.add('enter');}); }

function openTheatre(id){
  var s=strainById[id]; if(!s) return; currentId=id; var p=visualProfiles[id], c=colorFor(s);
  document.documentElement.style.setProperty('--accent-live',c);
  $('#theatreVisual').innerHTML='<div class="theatre-plate '+(p?'matched-study':'procedural-study')+'">'+specimenSvg(s,true)+'<div class="plate-scan"></div></div>';
  $('#theatreCopy').innerHTML='<span class="eyebrow">'+(p?'DRIVE-CALIBRATED VISUAL STUDY':'SOURCE-TEXT MORPHOGRAM')+'</span><h2 id="theatreTitle">'+esc(s.name)+'</h2><p class="theatre-family">'+esc(s.group)+' · '+esc(s.subtype)+'</p>'+(p?'<div class="cue-box"><b>BODY-PLAN CUE</b><p>'+esc(p.cue)+'</p></div>':'')+'<dl><dt>Affinity</dt><dd>'+esc(s.affinity)+'</dd><dt>Threat</dt><dd>'+esc(s.threat)+'</dd><dt>Timescale</dt><dd>'+esc(s.timescale)+'</dd><dt>Topology</dt><dd>'+esc(s.topology)+'</dd><dt>Capabilities</dt><dd>'+esc(s.function)+'</dd><dt>Tactical behavior</dt><dd>'+esc(s.tactical)+'</dd><dt>Lore</dt><dd>'+esc(s.lore)+'</dd><dt>Evidence</dt><dd>'+esc(s.evidence)+'</dd></dl>';
  var d=$('#specimenTheatre'); if(d && !d.open) d.showModal();
}
function theatreStep(delta){ var i=strains.findIndex(function(s){return s.id===currentId;}); openTheatre(strains[(i+delta+strains.length)%strains.length].id); }

function decorateInspector(){
  var root=$('#inspector'); if(!root) return; var h=root.querySelector('h3'); if(!h) return;
  var s=strains.find(function(x){return x.name===h.textContent.trim();}); if(!s || root.querySelector('.museum-injected')) return;
  var p=visualProfiles[s.id]; var visual=document.createElement('div'); visual.className='museum-injected dock-visual '+(p?'matched-study':'procedural-study'); visual.innerHTML=specimenSvg(s,false)+'<span class="study-badge">'+(p?'DRIVE-CALIBRATED STUDY':'SOURCE-TEXT MORPHOGRAM')+'</span>'; root.prepend(visual);
  var actions=document.createElement('div'); actions.className='museum-injected dock-actions'; actions.innerHTML='<button class="primary" type="button" data-open-theatre="'+esc(s.id)+'">Enter specimen theatre</button><button type="button" data-jump-atlas="'+esc(s.id)+'">Open in Atlas</button>'; root.appendChild(actions);
  if(p){var cue=document.createElement('p');cue.className='museum-injected visual-cue';cue.innerHTML='<b>VISUAL CUE</b> '+esc(p.cue);var sub=root.querySelector('.strain-subtype');if(sub)sub.insertAdjacentElement('afterend',cue);}
}

function focusOrbit(id){
  var select=$('#networkFindStrain'); if(!select) return; select.value=id; select.dispatchEvent(new Event('change',{bubbles:true}));
}
function activateAtlas(){
  ensureAtlasNav(); var btn=$('#nav button[data-view-target="atlas"]'); if(btn) btn.click(); renderAtlas(); requestAnimationFrame(animateAtlas);
}
function startTour(){
  stopTour(); var i=0, seq=featuredVisualIds.filter(function(id){return !!strainById[id];});
  var run=function(){var id=seq[i++%seq.length]; var d=$('#specimenTheatre'); if(d&&d.open)d.close(); var network=$('#nav button[data-view-target="network"]'); if(network)network.click(); focusOrbit(id); setTimeout(function(){openTheatre(id);},650);};
  run(); tourTimer=setInterval(run,6500);
}
function stopTour(){ if(tourTimer){clearInterval(tourTimer);tourTimer=null;} }

function init(){
  ensureAtlasNav();
  if($('#visualMatchCount')) $('#visualMatchCount').textContent=featuredVisualIds.length;
  var family=$('#atlasFamily'); if(family && family.options.length===1) family.insertAdjacentHTML('beforeend',archetypes.map(function(a){return '<option value="'+esc(a.code)+'">'+esc(a.name)+' ('+a.strainCount+')</option>';}).join(''));
  renderAtlas();
  if($('#visualSourceCard')) $('#visualSourceCard').innerHTML='<span class="eyebrow">VISUAL SOURCE DISCIPLINE</span><h3>'+featuredVisualIds.length+' named Drive-calibrated studies</h3><p>'+esc(visualSourceNote)+'</p>';
  var observer=new MutationObserver(function(){setTimeout(decorateInspector,0);}); if($('#inspector')) observer.observe($('#inspector'),{childList:true,subtree:true}); decorateInspector();
  document.addEventListener('click',function(e){
    var t=e.target.closest('[data-open-theatre]'); if(t){openTheatre(t.dataset.openTheatre);return;}
    var a=e.target.closest('[data-jump-atlas]'); if(a){activateAtlas(); if($('#atlasSearch')){$('#atlasSearch').value=strainById[a.dataset.jumpAtlas]?strainById[a.dataset.jumpAtlas].name:'';renderAtlas();}return;}
  });
  if($('#atlasSearch')) $('#atlasSearch').addEventListener('input',renderAtlas);
  if($('#atlasFamily')) $('#atlasFamily').addEventListener('change',renderAtlas);
  if($('#atlasStudy')) $('#atlasStudy').addEventListener('change',renderAtlas);
  if($('#shuffleAtlas')) $('#shuffleAtlas').addEventListener('click',function(){atlasSeed=(atlasSeed+137)%997;renderAtlas();animateAtlas();});
  if($('#closeTheatre')) $('#closeTheatre').addEventListener('click',function(){var d=$('#specimenTheatre');if(d)d.close();stopTour();});
  if($('#theatrePrev')) $('#theatrePrev').addEventListener('click',function(){theatreStep(-1);});
  if($('#theatreNext')) $('#theatreNext').addEventListener('click',function(){theatreStep(1);});
  if($('#theatreOrbit')) $('#theatreOrbit').addEventListener('click',function(){var d=$('#specimenTheatre');if(d)d.close();var b=$('#nav button[data-view-target="network"]');if(b)b.click();focusOrbit(currentId);});
  if($('#specimenTheatre')) $('#specimenTheatre').addEventListener('click',function(e){if(e.target===$('#specimenTheatre'))$('#specimenTheatre').close();});
  if($('#openTour')) $('#openTour').addEventListener('click',startTour);
  if(location.hash==='#atlas') setTimeout(activateAtlas,0);
}

setTimeout(init,0);
