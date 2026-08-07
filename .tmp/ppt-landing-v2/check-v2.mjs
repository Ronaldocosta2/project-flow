import fs from 'node:fs/promises';
const dir='C:/Users/Ronaldo/Desktop/Projectflow/project-flow/.tmp/ppt-landing-v2/qa'; let count=0;
for(let n=1;n<=15;n++){
 const d=JSON.parse(await fs.readFile(`${dir}/slide-${n}.layout.json`,'utf8')); const issues=[];
 for(const e of d.elements||[]){const b=e.bbox;if(!b)continue;const[x,y,w,h]=b;if(x<0||y<0||x+w>1280.5||y+h>720.5)issues.push(`canvas:${e.textPreview||e.id}`);const scale=e.resolvedTextStyle?.autoFitScale;if(typeof scale==='number'&&scale<0.78)issues.push(`scale:${e.textPreview||e.id}:${scale}`);}
 if(issues.length){count+=issues.length;console.log(`Slide ${n}: ${issues.join('; ')}`);}
}
if(count)process.exitCode=1;else console.log('15 slides dentro do canvas; sem redução crítica de texto.');
