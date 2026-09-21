import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../dist/',import.meta.url));
const mime={
  '.html':'text/html; charset=utf-8',
  '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.txt':'text/plain; charset=utf-8'
};

const server=createServer(async(req,res)=>{
  try{
    const urlPath=new URL(req.url,'http://localhost').pathname;
    const relative=urlPath==='/'?'index.html':urlPath.replace(/^\/+/, '');
    const safe=normalize(relative).replace(/^(\.\.([/\\]|$))+/, '');
    const path=join(root,safe);
    const data=await readFile(path);
    res.writeHead(200,{'content-type':mime[extname(path)]||'application/octet-stream'});
    res.end(data);
  }catch{
    res.writeHead(404,{'content-type':'text/plain'}); res.end('Not found');
  }
});

await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const {port}=server.address();

const detected=spawnSync('bash',['-lc','command -v google-chrome || command -v chromium || command -v chromium-browser'],{encoding:'utf8'});
const chrome=(process.env.CHROME_BIN||detected.stdout||'').trim();
if(!chrome){
  server.close();
  throw new Error('No Chrome/Chromium binary available for Three.js smoke test.');
}

const args=[
  '--headless=new','--no-sandbox','--disable-dev-shm-usage',
  '--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist',
  '--virtual-time-budget=6500','--dump-dom',
  `http://127.0.0.1:${port}/`
];

const child=spawn(chrome,args,{stdio:['ignore','pipe','pipe']});
let stdout='',stderr='';
child.stdout.on('data',d=>stdout+=d);
child.stderr.on('data',d=>stderr+=d);
const timeout=setTimeout(()=>child.kill('SIGKILL'),20000);
const code=await new Promise(resolve=>child.on('close',resolve));
clearTimeout(timeout);
await new Promise(resolve=>server.close(resolve));

if(code!==0) throw new Error(`Headless Chrome exited ${code}: ${stderr.slice(-2000)}`);
if(!/data-three-ready="true"/.test(stdout)) throw new Error('Three.js scene did not reach ready state.');
if(!/data-strain-resident="58"/.test(stdout)) throw new Error('Three.js scene did not instantiate all 58 strains.');
if(!/>58\/58</.test(stdout)) throw new Error('Visible resident counter did not report 58/58.');

console.log('PASS: headless Chrome initialized Three.js and instantiated 58/58 strain nodes.');
