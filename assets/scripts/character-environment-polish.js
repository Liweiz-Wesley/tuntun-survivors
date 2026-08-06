/* Character scale, idle animation, garden tiles and carrot-greatsword polish. */
(()=>{
const addPixel=(key,src)=>{const img=new Image();img.decoding="async";img.src=src;pixelArt[key]=img;};
addPixel("archerClean","assets/generated/characters/archer-idle-clean.png");
addPixel("melonIdle","assets/generated/characters/melon-idle-clean.png");
addPixel("kingdomGrass","assets/generated/environment/kingdom-grass-32.png");
addPixel("kingdomTree","assets/generated/environment/kingdom-tree-32.png");
addPixel("carrotGreatsword","assets/generated/weapons/carrot-greatsword-64.png");

const legacyDrawPixelPlayer=drawPixelPlayer;
drawPixelPlayer=function(){
  if(selectedCharacter!=="rabbit"&&selectedCharacter!=="chinchilla"&&selectedCharacter!=="tuntun")return legacyDrawPixelPlayer();
  ctx.save();ctx.fillStyle="rgba(52,61,40,.22)";ctx.fillRect(Math.round(player.x-23),Math.round(player.y+18),46,8);ctx.restore();
  if(player.inv>0&&playerAction.type!=="roll"&&Math.floor(player.inv*14)%2)return true;
  const progress=playerAction.duration?1-playerAction.timer/playerAction.duration:0;
  const actionFrame=Math.min(5,Math.max(0,Math.floor(progress*6)));
  if(selectedCharacter==="rabbit"){
    if(playerAction.type){
      const rolling=playerAction.type==="roll";
      return drawPixelFrameAt(rolling?"archerRoll":"archerAttack",6,actionFrame,player.x,player.y+42,rolling?102:92,player.facing);
    }
    const idleFrame=Math.floor(elapsed*3.15)%4;
    return drawPixelFrameAt("archerClean",4,idleFrame,player.x,player.y+42,116,player.facing);
  }
  if(selectedCharacter==="chinchilla"){
    if(playerAction.type)return drawPixelFrameAt(playerAction.type==="eat"?"melonEat":"melonAttack",6,actionFrame,player.x,player.y+42,92,player.facing);
    const idleFrame=Math.floor(elapsed*2.85)%4;
    return drawPixelFrameAt("melonIdle",4,idleFrame,player.x,player.y+42,112,player.facing);
  }
  const walkFrame=Math.floor(elapsed*2.7)%4;
  return drawPixelFrameAt("nugget",4,walkFrame,player.x,player.y+43,108,player.facing);
};

drawGround=function(){
  const viewW=W/cameraZoom,viewH=H/cameraZoom,tile=128;
  const startX=Math.floor((player.x-viewW/2)/tile)*tile-tile,endX=player.x+viewW/2+tile;
  const startY=Math.floor((player.y-viewH/2)/tile)*tile-tile,endY=player.y+viewH/2+tile;
  ctx.imageSmoothingEnabled=false;ctx.fillStyle="#90cf52";ctx.fillRect(player.x-viewW/2-96,player.y-viewH/2-96,viewW+192,viewH+192);
  const ground=pixelArt.kingdomGrass;
  if(ground&&ground.complete&&ground.naturalWidth)for(let x=startX;x<endX;x+=tile)for(let y=startY;y<endY;y+=tile)ctx.drawImage(ground,Math.round(x),Math.round(y),tile,tile);
};

const legacyUpdateGardenChunks=updateGardenChunks;
updateGardenChunks=function(force=false){
  legacyUpdateGardenChunks(force);
  for(const o of obstacles)if(o.type==="hedge")o.type="tree";
};

const legacyDrawObstacle=drawObstacle;
drawObstacle=function(o){
  if(o.type!=="tree")return legacyDrawObstacle(o);
  const sway=Math.round(Math.sin(elapsed*1.7+o.x*.013+o.y*.009));
  ctx.save();ctx.fillStyle="rgba(42,72,35,.20)";ctx.beginPath();ctx.ellipse(o.x,o.y+21,39,12,0,0,Math.PI*2);ctx.fill();ctx.restore();
  drawPixelProp("kingdomTree",o.x+sway,o.y+39,104);
};

drawGardenFeatures=function(){
  const size=820,cx=Math.floor(player.x/size),cy=Math.floor(player.y/size),decor=["daisies","dandelion","clover","blueFlowers","leafPile"];
  ctx.save();
  for(let ix=cx-2;ix<=cx+2;ix++)for(let iy=cy-2;iy<=cy+2;iy++){
    if(chunkNoise(ix,iy,70)<.58)continue;
    const ox=ix*size,oy=iy*size,key=decor[Math.floor(chunkNoise(ix,iy,72)*decor.length)];
    drawPixelProp(key,ox+100+chunkNoise(ix,iy,80)*620,oy+120+chunkNoise(ix,iy,90)*600,44);
  }
  ctx.restore();
};

const legacyDrawSwing=drawSwing;
drawSwing=function(s){
  if(!s.silverWave)return legacyDrawSwing(s);
  const k=s.life/s.maxLife,progress=1-k,bladeAngle=s.angle-1.22+progress*2.44;
  ctx.save();ctx.translate(s.x,s.y);
  drawSilverSlashWave(s.angle,s.radius,progress);
  const reach=Math.min(92,s.radius*.34);
  drawPixelProjectile("carrotGreatsword",Math.cos(bladeAngle)*reach,Math.sin(bladeAngle)*reach,112,bladeAngle,k);
  for(let i=0;i<18;i++){
    const a=s.angle-1.4+(i/17)*2.8,r=s.radius*(.45+.5*((i*7)%17)/17);
    ctx.globalAlpha=k*.82;ctx.fillStyle=i%3?"#dce8f2":"#ffffff";
    const q=3+(i%3)*2;ctx.fillRect(Math.round(Math.cos(a)*r),Math.round(Math.sin(a)*r),q,q);
  }
  ctx.restore();
};

const legacyHitEnemy=hitEnemy;
hitEnemy=function(e,dmg,source=null){
  legacyHitEnemy(e,dmg,source);
  if(source!=="carrotClub")return;
  shake=Math.max(shake,e.boss?7:4.5);
  spawnSpriteFx("weaponHit",e.x,e.y,Math.max(62,e.r*3.2),{alpha:.96,rot:Math.random()*Math.PI*2,driftY:-8});
  for(let i=0;i<10;i++){const a=i*Math.PI/5+(Math.random()-.5)*.2;particles.push({x:e.x,y:e.y,vx:Math.cos(a)*(100+Math.random()*120),vy:Math.sin(a)*(100+Math.random()*120),life:.28,r:3+(i%3),color:i%2?"#eef6ff":"#ffb347",pixel:true});}
};

function rareShot(s){
  if(!s)return false;
  if(typeof s.kind==="string"&&s.kind.endsWith("Evolved"))return true;
  return s.kind==="rocket"||(s.kind==="seed"&&evolved.seed)||(s.kind==="acorn"&&evolved.acorn)||(s.kind==="bubble"&&evolved.bubble);
}
function drawRareWeaponAura(x,y,r=32){
  ctx.save();ctx.translate(x,y);ctx.globalCompositeOperation="screen";
  const pulse=1+Math.sin(elapsed*10)*.1;ctx.strokeStyle="rgba(226,242,255,.86)";ctx.lineWidth=3;ctx.shadowBlur=12;ctx.shadowColor="#c7e7ff";ctx.beginPath();ctx.arc(0,0,r*pulse,0,Math.PI*2);ctx.stroke();
  for(let i=0;i<4;i++){const a=elapsed*2.6+i*Math.PI/2,rr=r*(.88+(i%2)*.22),q=i%2?3:5;ctx.fillStyle=i%2?"#a9d4f3":"#ffffff";ctx.fillRect(Math.round(Math.cos(a)*rr-q/2),Math.round(Math.sin(a)*rr-q/2),q,q);}
  ctx.restore();
}
const legacyDrawCarrotPolish=drawCarrot;
drawCarrot=function(s){legacyDrawCarrotPolish(s);if(rareShot(s))drawRareWeaponAura(s.x,s.y,Math.max(25,(s.r||9)*2.45));};

const legacySafeDrawWeaponFxPolish=safeDrawWeaponFx;
safeDrawWeaponFx=function(f){legacySafeDrawWeaponFxPolish(f);if(f&&f.evo)drawRareWeaponAura(f.x,f.y,Math.max(30,(f.r||f.radius||42)*.62));};

const heavy=characterDefs.find(c=>c.id==="chinchilla");
if(heavy){heavy.starterName=tr("🥕 萝卜巨剑","🥕 CARROT GREATSWORD");heavy.desc=tr("挥舞厚重萝卜巨剑释放银白剑气，造成前方180度重击与击退；吃西瓜恢复最大生命的10%。","Swing a massive carrot greatsword, releasing a silver shockwave with a 180-degree heavy strike and knockback; watermelon restores 10% maximum health.");}
})();
