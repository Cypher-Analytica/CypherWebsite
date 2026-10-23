import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),out=path.join(root,'dist');
fs.mkdirSync(out,{recursive:true});
for(const entry of fs.readdirSync(root,{withFileTypes:true})){
 if(entry.isFile()&&/\.(html|css|js|txt|xml)$/.test(entry.name))fs.copyFileSync(path.join(root,entry.name),path.join(out,entry.name));
 if(entry.isDirectory()&&['images','pdf','blog-pdf','review videos','Company Logo'].includes(entry.name))fs.cpSync(path.join(root,entry.name),path.join(out,entry.name),{recursive:true});
}
let failures=[];let pages=0;
for(const file of fs.readdirSync(out).filter(n=>n.endsWith('.html'))){
 pages++;let s=fs.readFileSync(path.join(out,file),'utf8');
 if(!s.includes('name="viewport"'))failures.push(file+': missing viewport');
 if(/<script[^>]*>[^<]*tailwind\.config/.test(s)||s.includes('data-stitch-injected'))failures.push(file+': prototype runtime present');
 for(const [,url]of s.matchAll(/(?:src|href)="([^"]+)"/g)){
  if(/^(https?:|mailto:|tel:|#|data:)/.test(url))continue;
  const p=decodeURIComponent(url.split('#')[0].split('?')[0]);
  if(p&&!fs.existsSync(path.join(out,p)))failures.push(file+': missing '+p);
 }
}
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log(`Production build complete: ${pages} pages. Local assets and links verified.`);
