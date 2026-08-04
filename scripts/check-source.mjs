import { readFile } from "node:fs/promises";

const sources=["source/Tuntun-Survivors-Chinese.html","source/Tuntun-Survivors-English.html"];
for(const file of sources){
  const html=await readFile(file,"utf8");
  const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(match=>match[1]);
  if(!scripts.length)throw new Error(`${file}: no inline scripts found`);
  scripts.forEach((script,index)=>{try{new Function(script);}catch(error){throw new Error(`${file}: inline script ${index+1}: ${error.message}`);}});
  for(const marker of ["<canvas id=\"game\"","requestAnimationFrame(loop)","imageSmoothingEnabled=false","boss-farm-expansion.js"]){
    if(!html.includes(marker))throw new Error(`${file}: missing required marker ${marker}`);
  }
  console.log(`${file}: ${scripts.length} inline scripts parsed`);
}

const merged=await readFile("index.html","utf8");
for(const marker of ["id=\"gameFrame\"","const pages={zh:","en:","languageSelect"]){
  if(!merged.includes(marker))throw new Error(`index.html: missing ${marker}`);
}
console.log("index.html: bilingual wrapper markers present");
