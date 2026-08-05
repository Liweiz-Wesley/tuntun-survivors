(function(){
"use strict";

const expansionImages={
  bossMantisMove:"assets/sprites/bosses/mantis-animation/move-strip.png",
  bossMantisSkill0:"assets/sprites/bosses/mantis-animation/dual-slash-strip.png",
  bossMantisSkill1:"assets/sprites/bosses/mantis-animation/leaf-dash-strip.png",
  bossMantisSkill2:"assets/sprites/bosses/mantis-animation/hide-leaves-strip.png",
  bossMantisSkill3:"assets/sprites/bosses/mantis-animation/blade-spin-strip.png",
  chiliFlame:"assets/retro32/sprites/effects/chili-flamethrower-strip.png",
  ...Object.fromEntries(["mole","toycar","snake","spider","weasel","wildcat","raccoon","hand","owl","fox","mower","foot"].flatMap(id=>[
    [`boss_${id}_move`,`assets/sprites/bosses/${id}-animation/move-strip.png`],
    ...[0,1,2,3].map(skill=>[`boss_${id}_skill${skill}`,`assets/sprites/bosses/${id}-animation/skill-${skill}-strip.png`])
  ]))
};
for(const [key,src] of Object.entries(expansionImages)){const image=new Image();image.src=src;pixelArt[key]=image;}

const legacyPixelEnemySpec=pixelEnemySpec;
const legacyDrawPixelEnemy=drawPixelEnemy;
const legacyExecuteBossSkill=executeTierBossSkill;
const legacyActivateCropSkill=activateCropSkill;
const legacyUpdate=update;
const legacyDraw=draw;
const legacyRenderFarm=renderFarm;
const legacyFarmPlotProgress=farmPlotProgress;
const legacyEndGame=endGame;

const BOSS_ACTIONS={
  mantis:{move:["bossMantisMove",6],skills:[["bossMantisSkill0",8],["bossMantisSkill1",8],["bossMantisSkill2",8],["bossMantisSkill3",8]]},
  ...Object.fromEntries(["mole","toycar","snake","spider","weasel","wildcat","raccoon","hand","owl","fox","mower","foot"].map(id=>[id,{move:[`boss_${id}_move`,6],skills:[0,1,2,3].map(skill=>[`boss_${id}_skill${skill}`,8])}]))
};
const DEFAULT_SKILL_TIMINGS=[
  {trigger:.48,total:1.16},{trigger:.42,total:1.03},{trigger:.55,total:1.22},{trigger:.5,total:1.2}
];
const bossImpactWarnings=[];
let chiliLongTick=0;
let chiliEffectElapsed=0;

// Tier 4 remains the elite animal tier. The two environment-scale machines become the final tier.
BOSS_DEFS.mower.tier=5;BOSS_DEFS.mower.hp=36000;BOSS_DEFS.mower.damage=40;BOSS_DEFS.mower.drawSize=520;BOSS_DEFS.mower.r=174;
BOSS_DEFS.foot.tier=5;BOSS_DEFS.foot.hp=42000;BOSS_DEFS.foot.damage=44;BOSS_DEFS.foot.drawSize=620;BOSS_DEFS.foot.r=204;
BOSS_POOLS[1].splice(0,BOSS_POOLS[1].length,"mole","mantis");
BOSS_POOLS[4].splice(0,BOSS_POOLS[4].length,"owl","fox");
BOSS_POOLS[5]=["mower","foot"];

pixelEnemySpec=function(e){
  if(e.boss&&e.bossId&&BOSS_DEFS[e.bossId]){const def=BOSS_DEFS[e.bossId];return {key:def.sprite,frames:1,fps:1,size:def.drawSize};}
  return legacyPixelEnemySpec(e);
};

function frameFromProgress(frames,p){return Math.max(0,Math.min(frames-1,Math.floor(Math.max(0,Math.min(.999,p))*frames)));}
function drawBossStrip(key,frames,frame,size,facing){
  return drawPixelFrameAt(key,frames,frame,0,Math.round(size*.52),size,facing);
}
function drawProceduralBossPose(e,def,facing){
  const image=pixelArt[def.sprite];if(!image||!image.complete||!image.naturalWidth)return false;
  const anim=e.anim,p=anim?Math.max(0,Math.min(1,anim.t/anim.total)):0,skill=anim?anim.skill:-1;
  let ox=0,oy=0,rot=0,sx=1,sy=1;
  if(!anim){
    const pace=e.bossId==="foot"?2.4:e.bossId==="mower"?11:e.bossId==="owl"?4.2:6.4;
    oy=Math.round(Math.sin(elapsed*pace+e.seed)*(e.bossId==="foot"?2:5));
    rot=Math.sin(elapsed*(pace*.55)+e.seed)*(e.bossId==="weasel"?.09:e.bossId==="fox"?.045:.025);
    if(e.bossId==="mower")sx=1+Math.sin(elapsed*18)*.012;
  }else if(skill===0){
    const strike=Math.sin(Math.min(1,p/.68)*Math.PI);
    rot=(p<.38?-.12:p<.72?.18:-.04)*facing;sx=1+strike*.13;sy=1-strike*.08;ox=strike*18*facing;
  }else if(skill===1){
    const rush=Math.sin(Math.min(1,p/.78)*Math.PI);rot=.18*facing;ox=rush*28*facing;sx=1+rush*.22;sy=1-rush*.12;
  }else if(skill===2){
    const hide=Math.sin(p*Math.PI);oy=hide*18;sy=1-hide*.2;sx=1+hide*.13;rot=Math.sin(p*Math.PI*4)*.055;
  }else{
    rot=p*Math.PI*2*facing;sx=1+Math.sin(p*Math.PI)*.12;sy=1-Math.sin(p*Math.PI)*.07;oy=-Math.sin(p*Math.PI)*10;
  }
  if(e.bossId==="weasel")rot+=Math.sin((elapsed+(anim?.t||0))*10)*.07;
  if(e.bossId==="owl"&&anim)oy-=Math.sin(p*Math.PI)*24;
  if(e.bossId==="foot"&&e.lifted)return true;
  ctx.save();ctx.translate(Math.round(ox),Math.round(oy));ctx.rotate(rot);ctx.scale(facing*sx,sy);ctx.imageSmoothingEnabled=false;
  ctx.drawImage(image,Math.round(-def.drawSize/2),Math.round(-def.drawSize*.5),Math.round(def.drawSize),Math.round(def.drawSize));ctx.restore();
  return true;
}
function drawBossActionFx(e,def){
  if(!e.anim)return;const p=Math.max(0,Math.min(1,e.anim.t/e.anim.total)),skill=e.anim.skill,r=e.r;
  ctx.save();ctx.globalAlpha=Math.sin(p*Math.PI)*.82;ctx.lineCap="square";ctx.lineJoin="miter";
  if(skill===0){ctx.strokeStyle=def.tier>=4?"#ffb56b":"#d8ef70";ctx.lineWidth=Math.max(6,r*.1);for(const off of [-.18,.18]){ctx.beginPath();ctx.arc(0,0,r*(1.15+p*.7),-1.15+off,1.15+off);ctx.stroke();}}
  else if(skill===1){ctx.fillStyle=def.tier>=4?"#f0a05f":"#91c95e";for(let i=0;i<6;i++){const x=-e.r*(.7+i*.32),y=(i%2?1:-1)*r*.18;ctx.fillRect(Math.round(x),Math.round(y),Math.round(r*.28),Math.max(4,Math.round(r*.07)));}}
  else if(skill===2){ctx.fillStyle=def.tier===2?"#c5df7a":"#7cb85b";for(let i=0;i<12;i++){const a=i*Math.PI/6+p*2,rr=r*(.8+(i%3)*.22);ctx.fillRect(Math.round(Math.cos(a)*rr),Math.round(Math.sin(a)*rr*.55),Math.max(4,Math.round(r*.08)),Math.max(4,Math.round(r*.06)));}}
  else{ctx.strokeStyle=def.tier>=4?"#ff936a":"#b6e267";ctx.lineWidth=Math.max(8,r*.12);ctx.beginPath();ctx.arc(0,0,r*(1.35+p*.35),0,Math.PI*2);ctx.stroke();}
  ctx.restore();
}

drawPixelEnemy=function(e,facing){
  if(!e.boss)return legacyDrawPixelEnemy(e,facing);
  if(e.visible===false||e.lifted)return true;
  if(!e.visualFacing)e.visualFacing=facing;
  if(!e.turnTarget)e.turnTarget=e.visualFacing;
  if(facing!==e.turnTarget){e.turnFrom=e.visualFacing;e.turnTarget=facing;e.turnStarted=elapsed;}
  let turnScale=1;
  if(Number.isFinite(e.turnStarted)){
    const turnDuration={mole:.36,mantis:.25,snake:.44,spider:.38,weasel:.27,wildcat:.3,raccoon:.36,hand:.48,owl:.32,fox:.28,mower:.42,foot:.52}[e.bossId]||.34,p=Math.min(1,Math.max(0,(elapsed-e.turnStarted)/turnDuration));
    if(p<.5){e.visualFacing=e.turnFrom;turnScale=1-Math.sin(p*Math.PI)*.82;}
    else{e.visualFacing=e.turnTarget;turnScale=.18+Math.sin((p-.5)*Math.PI)*.82;}
    if(p>=1){e.visualFacing=e.turnTarget;e.turnStarted=NaN;turnScale=1;}
  }
  facing=e.visualFacing;
  const def=BOSS_DEFS[e.bossId];if(!def)return legacyDrawPixelEnemy(e,facing);
  const sw=Math.round(def.drawSize*.58),sh=Math.max(7,Math.round(def.drawSize*.07));ctx.fillStyle="rgba(52,61,40,.24)";ctx.fillRect(-Math.round(sw/2),Math.round(e.r*.65),sw,sh);
  if(e.hitFlash>0&&Math.floor(e.hitFlash*24)%2)return true;
  ctx.save();ctx.scale(turnScale,1+(1-turnScale)*.08);
  const action=BOSS_ACTIONS[e.bossId];let ok=false;
  if(action){
    if(e.anim){const spec=action.skills[e.anim.skill],frame=frameFromProgress(spec[1],e.anim.t/e.anim.total);ok=drawBossStrip(spec[0],spec[1],frame,def.drawSize,facing);}
    else{const frame=critterWalkFrame(e.walkPhase||0,action.move[1]);ok=drawBossStrip(action.move[0],action.move[1],frame,def.drawSize,facing);}
  }else ok=drawProceduralBossPose(e,def,facing);
  drawBossActionFx(e,def);ctx.restore();return ok;
};

function timingFor(e,skill){
  if(e.bossId==="foot"&&skill===0)return {trigger:.82,total:3.55};
  if(e.bossId==="mower")return {trigger:.48,total:1.34};
  if(e.bossId==="owl")return {trigger:.56,total:1.3};
  return DEFAULT_SKILL_TIMINGS[skill];
}
function startBossAction(e,skill){
  const timing=timingFor(e,skill);e.anim={skill,t:0,trigger:timing.trigger,total:timing.total,triggered:false};e.pendingSkill=skill;e.skillCharge=0;
  const def=BOSS_DEFS[e.bossId],name=def.skills[skill];texts.push({x:e.x,y:e.y-e.r-25,text:`⚠ ${tr(name[0],name[1])}`,color:def.tier>=4?"#e64f48":"#d96a48",life:1.2});
  particles.push({x:e.x,y:e.y,vx:0,vy:0,life:timing.trigger,ring:true,r:8,maxR:e.r*1.35,color:def.tier>=4?"#ffb070":"#9fd061",duration:timing.trigger});
}

updateAnimalBoss=function(e,dt){
  if(freezeTimer>0)return;const def=BOSS_DEFS[e.bossId];if(!def)return;e.kx=e.kx||0;e.ky=e.ky||0;e.releaseAnim=0;
  if(e.anim){
    e.anim.t+=dt;
    if(!e.anim.triggered&&e.anim.t>=e.anim.trigger){e.anim.triggered=true;executeTierBossSkill(e,e.anim.skill);}
    if(!e.lifted){e.x+=e.kx*dt;e.y+=e.ky*dt;}e.kx*=Math.pow(.05,dt);e.ky*=Math.pow(.05,dt);
    if(e.anim.t>=e.anim.total&&!e.lifted){e.anim=null;e.aiTimer=2.55+Math.random()*.7;}
    return;
  }
  const a=Math.atan2(player.y-e.y,player.x-e.x);e.aiTimer-=dt;e.x+=(Math.cos(a)*e.speed+e.kx)*dt;e.y+=(Math.sin(a)*e.speed+e.ky)*dt;e.kx*=Math.pow(.05,dt);e.ky*=Math.pow(.05,dt);
  if(e.aiTimer<=0)startBossAction(e,e.skillCycle++%4);
};

executeTierBossSkill=function(e,skill){
  if(e.bossId==="foot"&&skill===0){
    const tx=player.x,ty=player.y;e.lifted=true;e.visible=false;e.x=-999999;e.y=-999999;sfx("skill");
    bossImpactWarnings.push({owner:e,x:tx,y:ty,r:285,timer:2.15,total:2.15,damage:56,dead:false});return;
  }
  legacyExecuteBossSkill(e,skill);
};

updateFinalBoss=function(e,dt){updateAnimalBoss(e,dt);};
startFinalBattle=function(){
  finalPhase=true;elapsed=1200;enemies.forEach(e=>splatter(e));enemies=[];shots=[];swings=[];bottles=[];zones=[];chests=[];
  const id=BOSS_POOLS[5][Math.floor(Math.random()*BOSS_POOLS[5].length)],def=BOSS_DEFS[id],a=-Math.PI/2,rad=Math.max(W,H)/cameraZoom*.52+180,hp=def.hp;
  enemies.push({type:"vacuum",boss:true,finalBoss:true,bossId:id,bossTier:5,major:true,name:`FINAL · ${tr(def.name[0],def.name[1])}`,x:player.x+Math.cos(a)*rad,y:player.y+Math.sin(a)*rad,r:def.r,hp,maxHp:hp,speed:def.speed,damage:def.damage,xp:0,orbitHit:0,hitFlash:0,seed:Math.random()*10,aiTimer:2.2,skillCycle:Math.floor(Math.random()*4),kx:0,ky:0,visible:true});
  flash=.72;shake=18;sfx("boss");texts.push({x:player.x,y:player.y-100,text:`⚠ ${tr("最终决战","FINAL BATTLE")}：${tr(def.name[0],def.name[1])}！`,color:"#b34f38",life:3.5});
};

function updateExpansionFx(dt){
  chiliLongTick-=dt;
  if(cropEffectTimer>0&&equippedCrop==="chili")chiliEffectElapsed+=dt;
  if(cropEffectTimer>0&&equippedCrop==="chili"&&chiliLongTick<=0){
    chiliLongTick=.12;const aim=player.facing>0?0:Math.PI,range=650,damage=player.damage*.92;
    enemies.forEach(e=>{const dx=e.x-player.x,dy=e.y-player.y,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx),delta=Math.abs(Math.atan2(Math.sin(a-aim),Math.cos(a-aim)));if(d<range+e.r&&delta<.5)hitEnemy(e,damage);});
    pots.forEach(p=>{if(!p.dead){const dx=p.x-player.x,dy=p.y-player.y,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx),delta=Math.abs(Math.atan2(Math.sin(a-aim),Math.cos(a-aim)));if(d<range+p.r&&delta<.5)hitPot(p,damage);}});
  }
  for(const w of bossImpactWarnings){
    if(w.dead)continue;w.timer-=dt;
    if(w.timer<=0){w.dead=true;const e=w.owner;e.x=w.x;e.y=w.y;e.lifted=false;e.visible=true;shake=28;flash=.32;sfx("explode");bossBlast(e,w.r,w.damage,"#d5a16d",w.x,w.y);bossRadial(e,22,225,13,.035,30);pixelExplosion(w.x,w.y,w.r,["#6f4f35","#c9985f","#f0d49a"]);}
  }
  for(let i=bossImpactWarnings.length-1;i>=0;i--)if(bossImpactWarnings[i].dead)bossImpactWarnings.splice(i,1);
}

activateCropSkill=function(){
  if(equippedCrop!=="chili")return legacyActivateCropSkill();
  if(!running||paused||cropCooldown>0)return;cropCooldown=20;cropMaxCooldown=20;cropEffectTimer=8;cropTick=0;chiliLongTick=0;chiliEffectElapsed=0;sfx("skill");
  texts.push({x:player.x,y:player.y-45,text:tr("辣椒喷射！","CHILI JET!"),color:"#ff713d",life:.9});
};

function drawExpansionWorldFx(){
  ctx.save();ctx.translate(W/2,H/2);ctx.scale(cameraZoom,cameraZoom);ctx.translate(-player.x,-player.y);
  for(const w of bossImpactWarnings){
    const p=1-w.timer/w.total,pulse=1+Math.sin(p*36)*.045;ctx.save();ctx.translate(Math.round(w.x),Math.round(w.y));ctx.scale(pulse,pulse);ctx.globalAlpha=.22+.42*p;ctx.fillStyle="#211b17";ctx.beginPath();ctx.ellipse(0,0,w.r,w.r*.62,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.85;ctx.strokeStyle=p>.72?"#ff4f38":"#e4b56c";ctx.lineWidth=8;ctx.setLineDash([18,11]);ctx.beginPath();ctx.ellipse(0,0,w.r*(.72+.28*p),w.r*(.44+.18*p),0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  }
  if(cropEffectTimer>0&&equippedCrop==="chili"){
    const image=pixelArt.chiliFlame;if(image&&image.complete&&image.naturalWidth){const frames=8,fw=image.naturalWidth/frames;let frame;if(chiliEffectElapsed<.65)frame=Math.min(3,Math.floor(chiliEffectElapsed/.65*4));else if(cropEffectTimer<.85)frame=Math.min(7,5+Math.floor((.85-cropEffectTimer)/.85*3));else frame=2+Math.floor(chiliEffectElapsed*10)%3;ctx.save();ctx.translate(Math.round(player.x),Math.round(player.y));ctx.scale(player.facing,1);ctx.imageSmoothingEnabled=false;ctx.globalCompositeOperation="lighter";ctx.drawImage(image,frame*fw,0,fw,image.naturalHeight,18,-116,650,232);ctx.restore();}
  }
  ctx.restore();
}

update=function(dt){legacyUpdate(dt);updateExpansionFx(dt);};
draw=function(){legacyDraw();drawExpansionWorldFx();};

// --- Farm: run-based growth, plot backpack and a persistent full-screen merchant. ---
const CROP_PRICES={chili:120,carrot:70,pumpkin:125,tomato:90,blueberry:135,garlic:105,watermelon:150,corn:80,mushroom:130,sunflower:115};
const CROP_STAGE_COLORS={chili:"#d84b35",carrot:"#ee8b31",pumpkin:"#e29a36",tomato:"#df5746",blueberry:"#536ac4",garlic:"#ead9a3",watermelon:"#5eaa54",corn:"#f1ca4f",mushroom:"#d9c3a6",sunflower:"#e8b83f"};
const cropCooldowns={chili:20,carrot:24,pumpkin:30,tomato:28,blueberry:32,garlic:26,watermelon:35,corn:22,mushroom:32,sunflower:28};
for(const crop of CROP_DEFS){crop.cd=cropCooldowns[crop.id]||crop.cd;if(crop.id==="chili")crop.desc=["向前持续喷出超远距离高伤害火焰 8 秒，冷却 20 秒。","Sustain a long-range, high-damage flame jet for 8 seconds. 20-second cooldown."];}

function randomShopOffers(){const ids=[...cropIds];for(let i=ids.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}return {offers:ids.slice(0,3),specialIndex:Math.floor(Math.random()*3)};}
function ensureFarmV3(){
  const f=metaSave.farm=metaSave.farm||freshFarm();f.seeds={...Object.fromEntries(cropIds.map(id=>[id,0])),...(f.seeds||{})};f.mysterySeeds=Math.max(0,Number(f.mysterySeeds)||0);f.inventory={...Object.fromEntries(cropIds.map(id=>[id,0])),...(f.inventory||{})};f.supplies={fertilizer:0,pesticide:0,...(f.supplies||{})};f.plots=Array.from({length:6},(_,i)=>{const p=f.plots?.[i];if(!p)return null;if(p.runsLeft==null){const q=legacyFarmPlotProgress(p);p.runsLeft=q>=1?0:(p.fertilized?1:2);}return p;});if(!f.shop||!Array.isArray(f.shop.offers)||f.shop.offers.length!==3)f.shop=randomShopOffers();f.runSerial=Number(f.runSerial)||0;return f;
}
farmPlotProgress=function(p){if(!p)return 0;return Math.max(0,Math.min(1,(2-(Number(p.runsLeft)||0))/2));};

let farmBagPlot=-1,farmBagSelection=null;
function ensureFarmOverlay(){
  const world=document.querySelector(".farm-world");if(!world||document.querySelector("#farmPlotBag"))return;
  const bag=document.createElement("section");bag.id="farmPlotBag";bag.className="farm-plot-bag hidden";world.appendChild(bag);
}
function closeFarmBag(){document.querySelector("#farmPlotBag")?.classList.add("hidden");farmBagPlot=-1;farmBagSelection=null;}
function openFarmBag(index){
  ensureFarmOverlay();const f=ensureFarmV3(),plot=f.plots[index],bag=document.querySelector("#farmPlotBag");farmBagPlot=index;
  if(plot){
    const crop=CROP_DEFS.find(c=>c.id===plot.cropId),ready=plot.runsLeft<=0;
    bag.innerHTML=`<div class="farm-bag-panel"><button class="farm-bag-close">✕</button><img class="farm-bag-crop" src="assets/sprites/farm/crops/${plot.cropId}.png">${plot.pest?'<i class="farm-pest-large"></i>':''}<div class="farm-growth-pips"><i class="on"></i><i class="${plot.runsLeft<=1?"on":""}"></i><i class="${ready?"on":""}"></i></div><div class="farm-bag-actions">${!ready&&!plot.fertilized&&f.supplies.fertilizer>0?`<button data-farm-manage="fertilize">${tr("施肥 ×1","FERTILIZE ×1")}</button>`:""}${plot.pest&&f.supplies.pesticide>0?`<button data-farm-manage="pesticide">${tr("除虫 ×1","PEST CONTROL ×1")}</button>`:""}${ready?`<button data-farm-manage="harvest">${tr("收割","HARVEST")}</button>`:""}<button data-farm-manage="cancel">${tr("取消","CANCEL")}</button></div></div>`;
  }else{
    farmBagSelection=f.mysterySeeds>0?"mystery":cropIds.find(id=>(f.seeds[id]||0)>0)||null;
    bag.innerHTML=`<div class="farm-bag-panel seed-bag"><button class="farm-bag-close">✕</button><div class="farm-seed-grid"><button class="farm-seed-card mystery-seed-card ${farmBagSelection==="mystery"?"selected":""}" data-seed-pick="mystery" ${f.mysterySeeds<=0?"disabled":""}><span class="mystery-seed-art"><i></i><b>?</b></span><strong>${tr("未知种子","MYSTERY SEED")}</strong><span>🌱 ${f.mysterySeeds}</span><small>${tr("成熟时揭晓","REVEALS AT HARVEST")}</small></button>${CROP_DEFS.map(c=>`<button class="farm-seed-card ${farmBagSelection===c.id?"selected":""}" data-seed-pick="${c.id}" ${(f.seeds[c.id]||0)<=0?"disabled":""}><img src="assets/sprites/farm/crops/${c.id}.png"><b>${tr(c.name[0],c.name[1])}</b><span>🌱 ${f.seeds[c.id]||0}</span><small>🎒 ${f.inventory[c.id]||0}</small></button>`).join("")}</div><div class="farm-bag-actions"><button data-farm-manage="sow" ${farmBagSelection?"":"disabled"}>${tr("播种","SOW")}</button><button data-farm-manage="cancel">${tr("取消","CANCEL")}</button></div></div>`;
  }
  bag.classList.remove("hidden");bag.querySelector(".farm-bag-close").onclick=closeFarmBag;
  bag.querySelectorAll("[data-seed-pick]").forEach(button=>button.onclick=()=>{farmBagSelection=button.dataset.seedPick;openFarmBag(index);});
  bag.querySelectorAll("[data-farm-manage]").forEach(button=>button.onclick=()=>manageFarmBag(button.dataset.farmManage));
}
function manageFarmBag(action){
  const f=ensureFarmV3(),plot=f.plots[farmBagPlot];
  if(action==="cancel")return closeFarmBag();
  if(action==="sow"&&farmBagSelection){
    if(farmBagSelection==="mystery"&&f.mysterySeeds>0){f.mysterySeeds--;const cropId=cropIds[Math.floor(Math.random()*cropIds.length)];f.plots[farmBagPlot]={cropId,mystery:true,runsLeft:2,fertilized:false,pest:false};spawnFarmFeedback(farmBagPlot,"plant");}
    else if((f.seeds[farmBagSelection]||0)>0){f.seeds[farmBagSelection]--;f.plots[farmBagPlot]={cropId:farmBagSelection,mystery:false,runsLeft:2,fertilized:false,pest:false};spawnFarmFeedback(farmBagPlot,"plant");}
  }
  else if(action==="fertilize"&&plot&&!plot.fertilized&&f.supplies.fertilizer>0){f.supplies.fertilizer--;plot.fertilized=true;plot.runsLeft=Math.min(1,plot.runsLeft);spawnFarmFeedback(farmBagPlot,"fertilize");}
  else if(action==="pesticide"&&plot&&plot.pest&&f.supplies.pesticide>0){f.supplies.pesticide--;plot.pest=false;plot.protected=true;spawnFarmFeedback(farmBagPlot,"pesticide");}
  else if(action==="harvest"&&plot&&plot.runsLeft<=0){f.inventory[plot.cropId]=(f.inventory[plot.cropId]||0)+(plot.fertilized?2:1);f.plots[farmBagPlot]=null;spawnFarmFeedback(farmBagPlot,"harvest");sfx("chest");}
  persistSave();closeFarmBag();renderFarm();
}

renderFarmPlots=function(){
  const f=ensureFarmV3(),el=document.querySelector("#farmPlots");if(!el)return;
  el.innerHTML=f.plots.map((p,i)=>{if(!p)return `<button class="farm-plot empty" data-plot="${i}" aria-label="${tr("打开种子背包","Open seed backpack")}"><span class="soil-plus">＋</span></button>`;const stage=p.runsLeft<=0?2:p.runsLeft===1?1:0,accent=p.mystery&&stage<2?"#d4c56b":CROP_STAGE_COLORS[p.cropId]||"#e4b84f";return `<button class="farm-plot planted stage-${stage} ${stage===2?"ready":""} ${p.mystery?"mystery-crop":""} ${p.pest?"pest":""}" data-plot="${i}" data-crop="${p.cropId}" style="--crop-accent:${accent}"><span class="farm-stage-plant"><i class="stem"></i><i class="leaf leaf-a"></i><i class="leaf leaf-b"></i><i class="leaf leaf-c"></i><i class="leaf leaf-d"></i><i class="crop-bud"></i></span><img src="assets/sprites/farm/crops/${p.cropId}.png"><span class="farm-stage-shadow"></span>${p.fertilized?'<i class="fertilized-spark">✦</i>':''}${p.pest?'<i class="farm-pest-mark"></i>':''}</button>`;}).join("");
  el.querySelectorAll("[data-plot]").forEach(button=>button.onclick=()=>{const i=Number(button.dataset.plot),p=f.plots[i];if(p&&p.runsLeft<=0){farmBagPlot=i;manageFarmBag("harvest");}else openFarmBag(i);});
};

function renderFarmMerchant(){
  const f=ensureFarmV3(),merchant=document.querySelector("#farmMerchant");if(!merchant)return;
  merchant.innerHTML=`<div class="merchant-full-panel"><button id="closeMerchantBtn" class="icon-btn farm-merchant-close">✕</button><div class="merchant-character"><img src="assets/sprites/farm/farmer-uncle.png" alt=""><div><small>OLD TUNTUN'S SEED SHOP</small><h2>${tr("老豚鼠的种子铺","OLD TUNTUN'S SEED SHOP")}</h2><b>🪙 ${metaSave.coins}</b></div></div><div class="merchant-offers">${f.shop.offers.map((id,i)=>{const c=CROP_DEFS.find(x=>x.id===id),base=CROP_PRICES[id],price=Math.round(base*(i===f.shop.specialIndex ? .75 : 1));return `<button class="merchant-card ${i===f.shop.specialIndex?"special":""}" data-seed-offer="${i}" ${metaSave.coins<price?"disabled":""}><img src="assets/sprites/farm/crops/${id}.png"><b>${tr(c.name[0],c.name[1])}</b>${i===f.shop.specialIndex?'<em>75%</em>':''}<span>🪙 ${price}</span></button>`;}).join("")}</div><div class="merchant-supplies"><button data-supply="fertilizer" data-price="70"><span>🌿</span><b>${tr("速生肥料","FAST FERTILIZER")}</b><small>${tr("成熟时间缩短为一局","HARVEST AFTER ONE RUN")}</small><strong>🪙 70</strong></button><button data-supply="pesticide" data-price="45"><span>🧴</span><b>${tr("温和除虫剂","GENTLE PESTICIDE")}</b><small>${tr("保护作物","PROTECT CROPS")}</small><strong>🪙 45</strong></button></div></div>`;
  merchant.querySelector("#closeMerchantBtn").onclick=()=>merchant.classList.add("hidden");merchant.querySelectorAll("[data-seed-offer]").forEach(button=>button.onclick=()=>buyFarmSeedOffer(Number(button.dataset.seedOffer)));merchant.querySelectorAll("[data-supply]").forEach(button=>button.onclick=()=>buyFarmSupplyV3(button.dataset.supply,Number(button.dataset.price)));
}
function buyFarmSeedOffer(index){const f=ensureFarmV3(),id=f.shop.offers[index],price=Math.round(CROP_PRICES[id]*(index===f.shop.specialIndex ? .75 : 1));if(metaSave.coins<price)return;metaSave.coins-=price;f.seeds[id]=(f.seeds[id]||0)+1;persistSave();updateCoinUI();renderFarmMerchant();renderFarm();sfx("chest");}
function buyFarmSupplyV3(type,price){if(metaSave.coins<price)return;metaSave.coins-=price;const f=ensureFarmV3();f.supplies[type]=(f.supplies[type]||0)+1;persistSave();updateCoinUI();renderFarmMerchant();sfx("chest");}

renderFarm=function(){ensureFarmV3();legacyRenderFarm();renderFarmPlots();renderFarmMerchant();const bank=document.querySelector("#farmCoinBank");if(bank)bank.textContent="🪙 "+metaSave.coins;};
function advanceFarmAfterRun(){const f=ensureFarmV3();for(const p of f.plots){if(!p||p.runsLeft<=0)continue;if(p.pest)continue;if(!p.protected&&Math.random()<.12){p.pest=true;continue;}p.runsLeft--;}f.runSerial++;f.shop=randomShopOffers();persistSave();}
endGame=function(win){if(running)advanceFarmAfterRun();return legacyEndGame(win);};

ensureFarmOverlay();ensureFarmV3();
const npc=document.querySelector("#farmerNpc");if(npc)npc.onclick=()=>{renderFarmMerchant();document.querySelector("#farmMerchant").classList.remove("hidden");};
const npcLabel=npc?.querySelector("span");if(npcLabel)npcLabel.remove();
const merchant=document.querySelector("#farmMerchant");if(merchant)merchant.classList.add("hidden");
const farmDock=document.querySelector(".farm-dock");if(farmDock)farmDock.classList.add("farm-dock-minimal");

})();
