(function(){
"use strict";

const foodRoot="assets/generated/food-vivid/";
const A=(id,zh,en,art,evoArt,passive,pattern,rate,damage,speed,count,visual,pierce,motion="")=>({id,name:tr(zh,en),evoName:tr(`究极${zh}`,`Ultimate ${en}`),desc:tr(`独特的${zh}攻击路线。`,`A distinct ${en} attack pattern.`),icon:"🍽️",art:foodRoot+art,evoArt:foodRoot+(evoArt||art),passive,pattern,rate,damage,speed,count,visual,pierce,motion});
const V2_WEAPONS=[
 A("ramenVortex","拉面漩涡","Ramen Vortex","misc/ramen_bowl.png","pasta/noodle_fusili.png","magnet","orbit",3.8,17,0,3,58,9,"orbit"),
 A("lasagnaPress","千层面重压","Lasagna Press","pasta/lasagna.png","misc/sandwich_grilled.png","area","rain",4.2,38,330,3,72,3,"fall"),
 A("fusilliDrill","螺旋面钻头","Fusilli Drill","pasta/noodle_fusili.png","pasta/noodle_macaroni.png","chew","fan",2.15,18,500,3,50,4,"wave"),
 A("macaroniSwarm","通心粉蜂群","Macaroni Swarm","pasta/noodle_macaroni.png","pasta/noodle_fusili.png","cooldown","radial",2.7,11,285,8,40,2,"homing"),
 A("pretzelBoomerang","椒盐卷回旋镖","Pretzel Boomerang","misc/pretzel.png","misc/pretzel.png","speed","fan",2.9,25,430,2,60,7,"boomerang"),
 A("burritoMeteor","卷饼陨星","Burrito Meteor","misc/burrito.png","misc/shish_kabob.png","area","rain",4.8,52,360,2,78,2,"fall"),
 A("kebabLance","烤串长枪","Kebab Lance","misc/shish_kabob.png","misc/shish_kabob.png","power","single",3.05,54,650,1,78,12,""),
 A("cupcakeTurret","纸杯蛋糕炮塔","Cupcake Turret","treat/cupcake.png","treat/ice_cream_sundae_02.png","duration","orbit",3.45,16,0,2,58,8,"orbit"),
 A("donutHalo","甜甜圈光环","Donut Halo","treat/doughnut.png","treat/doughnut.png","armor","radial",2.75,18,235,7,54,4,"spiral"),
 A("popsicleBeam","冰棒光束","Popsicle Beam","treat/popsicle.png","treat/popsicle_rocket_pop.png","cooldown","fan",2.5,24,620,3,66,6,"wave"),
 A("iceSandwichBlade","冰淇淋三明治刃","Ice Sandwich Blade","treat/ice_cream_sandwich_01.png","treat/ice_cream_sandwich_02.png","speed","cross",3.1,31,390,4,64,6,"boomerang"),
 A("sundaeComet","圣代彗星","Sundae Comet","treat/ice_cream_sundae_01.png","treat/ice_cream_sundae_02.png","heart","rain",4.35,45,310,3,74,3,"fall"),
 A("shakeBubble","奶昔泡泡潮","Shake Bubble Tide","treat/shake.png","drink/strawberry_smoothie.png","duration","fan",3.3,14,190,4,60,10,"pulse"),
 A("rocketPop","火箭冰棒","Rocket Pop","treat/popsicle_rocket_pop.png","treat/popsicle_rocket_pop.png","power","single",3.65,61,720,1,78,4,"homing"),
 A("sodaRocket","汽水火箭","Soda Rocket","drink/soda_bottle.png","drink/soda_can_orange.png","cooldown","fan",2.8,30,590,2,64,4,"homing"),
 A("smoothieMine","草莓奶昔地雷","Smoothie Mine","drink/strawberry_smoothie.png","drink/soda_glass.png","regen","mine",4.6,58,0,3,72,99,"pulse"),
 A("milkWave","牛奶白浪","Milk Wave","drink/milk_carton.png","drink/soda_glass.png","heart","fan",3.15,21,345,5,58,4,"wave"),
 A("orangeBurst","橙汁爆弹","Orange Burst","drink/juice_orange.png","drink/soda_can_orange.png","luck","radial",3.55,24,360,9,50,2,"spiral"),
 A("butterRam","黄油冲车","Butter Ram","dairy/butter.png","dairy/cheese_wheel.png","armor","single",3.5,64,480,1,82,14,"boomerang"),
 A("cheeseMoon","奶酪满月","Cheese Moon","dairy/cheese_wheel.png","dairy/cheese_wedge.png","area","orbit",4.1,27,0,2,82,12,"orbit"),
 A("chickenClub","鸡腿战锤","Drumstick Hammer","meat/chicken_drumstick_01.png","meat/chicken_drumsticks.png","power","cross",3.4,43,350,4,72,5,"boomerang"),
 A("friedEggMine","太阳蛋陷阱","Sunny Egg Trap","meat/egg_fried_02.png","meat/egg_fried_03.png","regen","mine",4.0,46,0,4,68,99,"pulse"),
 A("hamDisc","火腿飞碟","Ham Disc","meat/ham.png","meat/steak.png","chew","radial",2.95,25,310,6,62,6,"spiral"),
 A("steakCrusher","牛排粉碎机","Steak Crusher","meat/steak.png","meat/chicken.png","armor","rain",4.7,67,380,2,88,3,"fall"),
 A("popcornHail","爆米花冰雹","Popcorn Hail","misc/popcorn.png","misc/popcorn.png","amount","rain",2.6,13,420,7,44,2,"fall"),
 A("submarineRam","潜艇堡冲锋","Submarine Ram","misc/sandwich_sub.png","misc/sandwich_burger.png","duration","single",3.85,70,520,1,92,15,"boomerang"),
 A("grilledWall","烤三明治墙","Grilled Sandwich Wall","misc/sandwich_grilled.png","misc/sandwich_03.png","armor","fan",3.8,31,270,6,70,8,"wave"),
 A("hotdogMissile","热狗导弹","Hotdog Missile","misc/hot_dog_02.png","misc/hot_dog_01.png","luck","fan",3.05,36,530,3,70,5,"homing"),
 A("tacoCyclone","塔可旋风","Taco Cyclone","misc/taco_02.png","misc/taco_01.png","speed","radial",2.4,17,340,10,54,3,"spiral"),
 A("pizzaMoon","披萨满月轮","Pizza Moon","misc/pizza_02.png","misc/pizza_01.png","area","cross",3.75,48,330,4,86,10,"boomerang"),
 A("burgerGuard","汉堡护卫","Burger Guard","misc/sandwich_burger.png","misc/shish_kabob.png","heart","orbit",3.65,31,0,3,78,12,"orbit"),
 A("ketchupMine","番茄酱爆袋","Ketchup Burst Bag","misc/ketchup.png","misc/french_fries.png","luck","mine",3.9,51,0,5,62,99,"pulse")
];

const V2_PASSIVES=[
 {id:"duration",name:tr("保鲜盒","Lunch Box"),desc:tr("延长武器与区域效果持续时间。","Extends weapon and zone duration."),art:foodRoot+"misc/sandwich_03.png",apply(){player.duration*=1.12;}},
 {id:"amount",name:tr("分享餐盘","Sharing Platter"),desc:tr("增加部分武器的投射物数量。","Adds projectiles to compatible weapons."),art:foodRoot+"misc/salad.png",apply(){player.projectiles++;}},
 {id:"fortune",name:tr("金币巧克力","Lucky Chocolate"),desc:tr("提高宝箱金币和稀有奖励概率。","Improves chest gold and rare rewards."),art:foodRoot+"treat/cookie_chocolate_chip.png",apply(){player.crit+=.08;}},
 {id:"shield",name:tr("餐盒护盾","Bento Shield"),desc:tr("提高护甲并获得更稳定的近身容错。","Raises armor for safer close combat."),art:foodRoot+"misc/sandwich_01.png",apply(){player.armor+=1.5;}},
 {id:"revive",name:tr("备用布丁","Backup Pudding"),desc:tr("满级时增加一次复活。","Grants one revival at maximum level."),art:foodRoot+"treat/ice_cream_sundae_01.png",apply(){if(passives.revive===5)player.revives++;}}
];

const RELICS={
 tuntun:[
  ["echoCarrots","回声胡萝卜","Echo Carrots","初始攻击额外发射两枚胡萝卜。",()=>player.projectiles+=2],
  ["resonantCore","共鸣核心","Resonant Core","尖叫冷却缩短25%。",()=>skillMaxCooldown*=.75],
  ["sonicHeart","声波心脏","Sonic Heart","尖叫时恢复4%最大生命。",()=>{}],
  ["vacuumCry","吸豆尖叫","Vacuum Cry","尖叫会把全屏经验豆拉向自己。",()=>{}],
  ["carrotOverdrive","胡萝卜超频","Carrot Overdrive","初始武器伤害提高40%。",()=>player.damage*=1.4],
  ["panicTempo","危机节拍","Panic Tempo","低生命时攻击速度显著提高。",()=>{}]
 ],
 rabbit:[
  ["piercingFletching","穿心箭羽","Piercing Fletching","胡萝卜箭额外穿透5个敌人。",()=>player.pierce+=5],
  ["splitQuiver","双生箭袋","Twin Quiver","每轮额外射出两支胡萝卜箭。",()=>player.projectiles+=2],
  ["hunterFocus","猎手专注","Hunter Focus","弓箭伤害提高45%。",()=>player.damage*=1.45],
  ["windRoll","疾风翻滚","Gale Roll","翻滚冷却缩短35%。",()=>skillMaxCooldown*=.65],
  ["rindGuard","瓜皮护身","Rind Guard","翻滚后的无敌时间更长。",()=>{}],
  ["rollingVolley","翻滚齐射","Rolling Volley","翻滚结束时向四周发射胡萝卜箭。",()=>{}]
 ],
 chinchilla:[
  ["giantCarrot","巨根大剑","Giant Carrot","胡萝卜大剑范围和伤害提高40%。",()=>{player.area*=1.4;player.damage*=1.25;}],
  ["secondHelping","再来一口","Second Helping","西瓜补给额外恢复10%最大生命。",()=>{}],
  ["seedSpray","西瓜籽雨","Seed Spray","吃西瓜时向四周喷射种子。",()=>{}],
  ["harvestCircle","圆桌收割","Harvest Circle","胡萝卜大剑升级为360度横扫。",()=>{}],
  ["crunchTempo","爽脆节拍","Crunch Tempo","吃西瓜后短暂提高攻击速度。",()=>{}],
  ["rindArmor","瓜皮重甲","Rind Armor","护甲提高3点。",()=>player.armor+=3]
 ]
};

const v2Ids=new Set(V2_WEAPONS.map(w=>w.id));
for(const def of V2_WEAPONS){
 EXTRA_FOOD_DEFS.push(def);weapons[def.id]=0;evolved[def.id]=false;
 evolutionRecipes.push({weapon:def.id,passive:def.passive,name:def.evoName,icon:def.id+"Evolved"});
 pixelIconSources[def.id]=def.art;pixelIconSources[def.id+"Evolved"]=def.evoArt;
 const key="proj"+def.id[0].toUpperCase()+def.id.slice(1),evoKey=key+"Evolved";
 pixelArtSources[key]=def.art;pixelArtSources[evoKey]=def.evoArt;
 for(const [imageKey,src] of [[key,def.art],[evoKey,def.evoArt]]){const image=new Image();image.src=src;pixelArt[imageKey]=image;}
 upgrades.push({id:def.id,icon:"🍽️",name:def.name,available(){return weapons[def.id]<8;},desc:def.desc,preview(){return weapons[def.id]?`LV.${weapons[def.id]} → LV.${weapons[def.id]+1} · ${tr("强化伤害、数量与独特运动","improves damage, amount and motion")}`:`${tr("解锁武器","Unlock weapon")} · ${def.name}`;},apply(){weapons[def.id]++;discover("weapons",def.id);}});
}
for(const def of V2_PASSIVES){
 passives[def.id]=0;pixelIconSources[def.id]=def.art;
 upgrades.push({id:def.id,icon:"◆",name:def.name,available(){return passives[def.id]<5;},desc:def.desc,preview(){return `LV.${passives[def.id]} → LV.${passives[def.id]+1}`;},apply(){passives[def.id]++;def.apply();discover("passives",def.id);}});
}

function ensureDiscovery(){
 metaSave.discoveries=metaSave.discoveries||{};
 for(const group of ["weapons","passives","evolutions","relics","enemies"])metaSave.discoveries[group]=metaSave.discoveries[group]||{};
 metaSave.discoveries.weapons.carrot=true;
 return metaSave.discoveries;
}
function discover(group,id){const d=ensureDiscovery();if(!d[group][id]){d[group][id]=true;persistSave();}}
ensureDiscovery();

const originalUpgradeApply=new WeakMap();
for(const item of upgrades)if(item.apply&&!originalUpgradeApply.has(item)){const apply=item.apply.bind(item);originalUpgradeApply.set(item,apply);item.apply=function(){apply();if(item.id in weapons)discover("weapons",item.id);if(item.id in passives)discover("passives",item.id);};}

const legacyFireExtraFoodWeapon=fireExtraFoodWeapon;
function nearestTarget(){return enemies.filter(e=>!e.dead&&isOnScreen(e.x,e.y,80)).sort((a,b)=>dist(a.x,a.y,player.x,player.y)-dist(b.x,b.y,player.x,player.y))[0];}
function addFoodShot(def,a,x=player.x,y=player.y){
 const lv=weapons[def.id],evo=evolved[def.id],speed=def.speed*(evo?1.18:1),life=(evo?4.2:3.2)*player.duration;
 shots.push({kind:evo?def.id+"Evolved":def.id,x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:(9+def.visual*.075+lv*.4)*player.area*(evo?1.2:1),damage:(def.damage+lv*4.2)*(evo?1.7:1),life,rot:a,pierce:def.pierce+Math.floor(lv/3)+(evo?4:0),hitIds:new Set(),customMotion:def.motion,originX:x,originY:y,baseAngle:a,orbitRadius:70+Math.random()*42,orbitSpeed:(Math.random()>.5?1:-1)*(1.7+Math.random()),bornAt:elapsed});
}
fireExtraFoodWeapon=function(def){
 if(!v2Ids.has(def.id))return legacyFireExtraFoodWeapon(def);
 const target=nearestTarget();if(!target)return;const lv=weapons[def.id],evo=evolved[def.id],base=Math.atan2(target.y-player.y,target.x-player.x),count=def.count+Math.floor((lv-1)/3)+(evo?2:0);
 emitWeaponFx("carrot",player.x,player.y,def.visual,evo,base);sfx("shot");
 if(def.pattern==="rain"){for(let i=0;i<count;i++){const t=enemies[(Math.random()*enemies.length)|0]||target;addFoodShot(def,Math.PI/2,t.x+(Math.random()-.5)*180,t.y-260-Math.random()*160);}return;}
 if(def.pattern==="mine"){for(let i=0;i<count;i++){const a=i*Math.PI*2/count+elapsed,rr=55+i*20;addFoodShot(def,0,player.x+Math.cos(a)*rr,player.y+Math.sin(a)*rr);const s=shots[shots.length-1];s.vx=s.vy=0;}return;}
 const angles=[];
 if(def.pattern==="radial"||def.pattern==="orbit")for(let i=0;i<count;i++)angles.push(i*Math.PI*2/count+elapsed*.35);
 else if(def.pattern==="cross")for(let i=0;i<count;i++)angles.push(i*Math.PI*2/count);
 else if(def.pattern==="fan")for(let i=0;i<count;i++)angles.push(base+(i-(count-1)/2)*.18);
 else angles.push(base);
 angles.forEach(a=>addFoodShot(def,a));
};

const legacyUpdateV2=update;
update=function(dt){
 legacyUpdateV2(dt);
 for(const s of shots){if(s.dead||!s.customMotion)continue;
  if(s.customMotion==="homing"){const t=nearestTarget();if(t){const sp=Math.hypot(s.vx,s.vy),want=Math.atan2(t.y-s.y,t.x-s.x),now=Math.atan2(s.vy,s.vx),d=Math.atan2(Math.sin(want-now),Math.cos(want-now)),a=now+d*Math.min(1,dt*2.7);s.vx=Math.cos(a)*sp;s.vy=Math.sin(a)*sp;s.rot=a;}}
  else if(s.customMotion==="boomerang"&&s.age>.65){const a=Math.atan2(player.y-s.y,player.x-s.x),sp=Math.max(330,Math.hypot(s.vx,s.vy));s.vx=Math.cos(a)*sp;s.vy=Math.sin(a)*sp;s.rot=a;}
  else if(s.customMotion==="orbit"){const age=elapsed-s.bornAt,a=s.baseAngle+age*s.orbitSpeed;s.x=player.x+Math.cos(a)*s.orbitRadius;s.y=player.y+Math.sin(a)*s.orbitRadius;s.vx=s.vy=0;s.rot=a;}
  else if(s.customMotion==="spiral"){const a=Math.atan2(s.vy,s.vx)+dt*1.35,sp=Math.hypot(s.vx,s.vy);s.vx=Math.cos(a)*sp;s.vy=Math.sin(a)*sp;s.rot=a;}
  else if(s.customMotion==="wave"){const age=elapsed-s.bornAt,perp=s.baseAngle+Math.PI/2;s.x+=Math.cos(perp)*Math.sin(age*10)*70*dt;s.y+=Math.sin(perp)*Math.sin(age*10)*70*dt;}
  else if(s.customMotion==="pulse"){s.r+=dt*18;s.rot+=dt*2;}
 }
 for(const e of enemies)if(!e.discoveryMarked){e.discoveryMarked=true;discover("enemies",e.bossId||e.type||"mouse");}
};

const legacyHitEnemyV2=hitEnemy;
hitEnemy=function(e,dmg,source=null){const before=chests.length;legacyHitEnemyV2(e,dmg,source);if(chests.length>before){const c=chests[chests.length-1];c.kind=e.boss?"boss":"elite";c.bossId=e.bossId||null;}};

window.tuntunRunRelics=[];
function relicOwned(id){return window.tuntunRunRelics.includes(id);}
function applyRelic(relic){window.tuntunRunRelics.push(relic[0]);relic[4]();discover("relics",relic[0]);renderTray();}
function showRelicDraft(){
 paused=true;keys.clear();const pool=(RELICS[selectedCharacter]||[]).filter(r=>!relicOwned(r[0])),choices=[...pool].sort(()=>Math.random()-.5).slice(0,3);
 if(!choices.length){addCoins(350);paused=false;return;}
 let overlay=document.querySelector("#relicDraft");if(!overlay){overlay=document.createElement("section");overlay.id="relicDraft";overlay.className="relic-draft";document.body.appendChild(overlay);}
 overlay.innerHTML=`<div class="relic-panel"><small>BOSS RELIC</small><h2>${tr("选择改变本局的遗物","Choose a run-changing relic")}</h2><div class="relic-options">${choices.map((r,i)=>`<button data-relic="${i}"><i>✦</i><b>${r[1]}</b><em>${r[2]}</em><span>${r[3]}</span></button>`).join("")}</div></div>`;overlay.classList.add("show");
 overlay.querySelectorAll("[data-relic]").forEach(b=>b.onclick=()=>{applyRelic(choices[+b.dataset.relic]);addCoins(100);overlay.classList.remove("show");paused=false;last=performance.now();});
}
const legacyOpenChestV2=openChest;
openChest=function(c){
 if(c.kind==="boss"){sfx("chest");return showRelicDraft();}
 if(c.kind==="elite"&&Math.random()<.38&&Object.values(weapons).filter(v=>v>0).length<MAX_WEAPONS){const fresh=upgrades.filter(u=>u.id in weapons&&weapons[u.id]===0&&(!u.available||u.available()));if(fresh.length){const reward=fresh[Math.floor(Math.random()*fresh.length)];return showChestReward(chestRewardWithGold({icon:reward.id,fallback:reward.icon,name:reward.name,desc:tr("精英宝箱发现了新武器！","Elite chest found a new weapon!"),apply(){reward.apply();}}));}}
 return legacyOpenChestV2(c);
};
const legacyDrawChestV2=drawChest;
drawChest=function(c){if(c.kind==="boss"){ctx.save();ctx.translate(c.x,c.y);ctx.shadowBlur=28;ctx.shadowColor="#ffe36c";drawPixelProp("chestRed",0,54,132,Math.sin(c.bob*3)*5);ctx.restore();return;}return legacyDrawChestV2(c);};

const legacyStartGameV2=startGame;
startGame=function(){window.tuntunRunRelics.length=0;legacyStartGameV2();discover("weapons","carrot");};

const legacyFireCarrotsV2=fireCarrots;
fireCarrots=function(){const before=shots.length;legacyFireCarrotsV2();if(selectedCharacter==="tuntun"&&relicOwned("panicTempo")&&player.hp/player.maxHp<.35)shotClock=Math.min(shotClock,player.rate*.45);if(selectedCharacter==="rabbit")for(const s of shots.slice(before)){s.kind="carrotArrow";if(relicOwned("piercingFletching"))s.pierce+=5;}};
const legacyDrawCarrotV2=drawCarrot;
drawCarrot=function(s){if(s.kind==="carrotArrow"){drawPixelProjectile("projCarrot",s.x,s.y,Math.max(58,s.r*5.4),s.rot,1);return;}return legacyDrawCarrotV2(s);};
const legacyActivateSkillV2=activateSkill;
activateSkill=function(){const before=player.hp;legacyActivateSkillV2();if(selectedCharacter==="tuntun"&&skillCooldown>0){if(relicOwned("sonicHeart"))player.hp=Math.min(player.maxHp,player.hp+player.maxHp*.04);if(relicOwned("vacuumCry"))for(const g of gems){g.x=player.x+(g.x-player.x)*.08;g.y=player.y+(g.y-player.y)*.08;}}else if(selectedCharacter==="rabbit"&&skillCooldown>0){if(relicOwned("rindGuard"))player.inv=Math.max(player.inv,1.05);if(relicOwned("rollingVolley"))for(let i=0;i<10;i++){const a=i*Math.PI/5;shots.push({kind:"carrotArrow",x:player.x,y:player.y,vx:Math.cos(a)*480,vy:Math.sin(a)*480,r:10,damage:player.damage*1.2,life:2,rot:a,pierce:3,hitIds:new Set()});}}else if(selectedCharacter==="chinchilla"&&skillCooldown>0){if(relicOwned("secondHelping"))player.hp=Math.min(player.maxHp,player.hp+player.maxHp*.1);if(relicOwned("seedSpray"))for(let i=0;i<12;i++){const a=i*Math.PI/6;shots.push({kind:"seedShard",x:player.x,y:player.y,vx:Math.cos(a)*390,vy:Math.sin(a)*390,r:7,damage:player.damage*1.3,life:1.6,rot:a,pierce:2,hitIds:new Set()});}if(relicOwned("crunchTempo"))shotClock=Math.min(shotClock,.18);}void before;};
const legacySwingCarrotClubV2=swingCarrotClub;
swingCarrotClub=function(){legacySwingCarrotClubV2();if(selectedCharacter==="chinchilla"&&relicOwned("harvestCircle")){const range=(125+weapons.carrot*12)*1.5*player.area,damage=player.damage*(1.25+weapons.carrot*.12);enemies.forEach(e=>{if(!e.dead&&dist(e.x,e.y,player.x,player.y)<range+e.r)hitEnemy(e,damage,"carrotClub");});for(let i=1;i<4;i++)swings.push({x:player.x,y:player.y,angle:i*Math.PI/2,radius:range,life:.5,maxLife:.5,carrotClub:true,silverWave:true});}};

const allRelics=Object.values(RELICS).flat();
const monsterCatalog=[
 ["mouse","工具鼠群","Tool Mice","assets/sprites/idle/mouse-fork.png"],["bombMouse","炸弹鼠","Bomb Mouse","assets/sprites/idle/bomb-mouse.png"],["bullyMouse","壮壮鼠","Bully Mouse","assets/sprites/idle/bully-mouse.png"],["bat","蝙蝠群","Bat Swarm","assets/sprites/idle/bat.png"],["sparrow","偷粮麻雀","Grain Sparrow","assets/sprites/idle/sparrow.png"],["frog","弹弹青蛙","Pouncing Frog","assets/sprites/idle/frog.png"],["fortressSnail","蜗牛堡垒","Fortress Snail","assets/sprites/idle/fortress-snail.png"],["honeySlime","蜜糖史莱姆","Honey Slime","assets/sprites/idle/honey-slime.png"],["silkSpider","吐丝蜘蛛","Silk Spider","assets/sprites/idle/silk-spider.png"],
 ...Object.entries(BOSS_DEFS).map(([id,d])=>[id,d.name[0],d.name[1],`assets/sprites/bosses/${id}.png`])
];
function collectionCard(group,id,name,art,subtitle="",description=""){
 const unlocked=!!ensureDiscovery()[group][id];return `<article class="collection-card collection-${group} ${unlocked?"":"locked"}"><i><img src="${art}" alt=""></i><b>${unlocked?name:"???"}</b><span>${unlocked?subtitle:tr("尚未发现","UNDISCOVERED")}</span>${unlocked&&description?`<em>${description}</em>`:""}</article>`;
}
const upgradeById=id=>upgrades.find(u=>u.id===id);
const recipeRule=r=>r.passive?tr("武器 LV.4 ＋ 道具 LV.4","WEAPON LV.4 + ITEM LV.4"):tr("武器 LV.5","WEAPON LV.5");
const recipeLabel=r=>`${upgradeById(r.weapon)?.name||r.weapon}${r.passive?` + ${upgradeById(r.passive)?.name||r.passive}`:""}`;
function renderCodexV2(){
 const scroll=document.querySelector(".codex-scroll");if(!scroll)return;const baseWeaponDefs=upgrades.filter(u=>u.id in weapons),passiveDefs=upgrades.filter(u=>u.id in passives),evoDefs=evolutionRecipes;
 scroll.innerHTML=`<div class="collection-summary"><b>${Object.values(ensureDiscovery()).reduce((n,g)=>n+Object.values(g).filter(Boolean).length,0)}</b><span>${tr("已收藏","DISCOVERED")}</span></div><h3>${tr("武器","WEAPONS")} · ${baseWeaponDefs.length}</h3><div class="collection-grid">${baseWeaponDefs.map(u=>{const r=evoDefs.find(x=>x.weapon===u.id);return collectionCard("weapons",u.id,u.name,pixelIconSrc(u.id),tr("最高 LV.8","MAX LV.8"),r?`${tr("融合","EVOLVE")}: ${recipeLabel(r)} · ${recipeRule(r)}`:u.desc||"");}).join("")}</div><h3>${tr("被动加强","PASSIVES")} · ${passiveDefs.length}</h3><div class="collection-grid">${passiveDefs.map(u=>collectionCard("passives",u.id,u.name,pixelIconSrc(u.id),tr("改变基础属性","BASE STAT BOOST"),u.desc||"")).join("")}</div><h3>${tr("融合形态","EVOLUTIONS")} · ${evoDefs.length}</h3><div class="collection-grid">${evoDefs.map(r=>collectionCard("evolutions",r.weapon,r.name,pixelIconSrc(r.icon),recipeLabel(r),recipeRule(r))).join("")}</div><h3>${tr("Boss 遗物","BOSS RELICS")} · ${allRelics.length}</h3><div class="collection-grid">${allRelics.map(r=>collectionCard("relics",r[0],r[1],foodRoot+"misc/shish_kabob.png",r[3])).join("")}</div><h3>${tr("怪物档案","BESTIARY")}</h3><div class="collection-grid monsters">${monsterCatalog.map(m=>collectionCard("enemies",m[0],tr(m[1],m[2]),m[3],"")).join("")}</div>`;
}
const codexBtn=document.querySelector("#codexBtn");if(codexBtn)codexBtn.onclick=()=>{renderCodexV2();ui.codex.classList.remove("hidden");};

function renderPauseArsenalV2(){
 const root=ui.pause?.querySelector(".pause-recipes");if(!root)return;
 const ownedWeaponIds=Object.keys(weapons).filter(id=>weapons[id]>0),ownedPassiveIds=Object.keys(passives).filter(id=>passives[id]>0);
 const ownedChip=(id,level,evo=false)=>`<span class="pause-owned-chip ${evo?"evolved":""}"><img src="${pixelIconSrc(evo?(evolutionRecipes.find(r=>r.weapon===id)?.icon||id):id)}" alt=""><b>${upgradeById(id)?.name||id}</b><small>${evo?tr("已融合","EVOLVED"):`LV.${level}`}</small></span>`;
 const recipeCard=r=>{const weaponLevel=weapons[r.weapon]||0,passiveLevel=r.passive?(passives[r.passive]||0):0,isEvolved=!!evolved[r.weapon],ready=!isEvolved&&evolutionReady(r),state=isEvolved?tr("已融合","EVOLVED"):ready?tr("可以融合","READY"):tr("尚未满足","NOT READY");return `<article class="pause-recipe-card ${isEvolved?"evolved":ready?"ready":""}"><div class="pause-recipe-icons"><img src="${pixelIconSrc(r.weapon)}" alt=""><b>＋</b>${r.passive?`<img src="${pixelIconSrc(r.passive)}" alt=""><b>＝</b>`:"<b>＝</b>"}<img src="${pixelIconSrc(r.icon)}" alt=""></div><strong>${r.name}</strong><span>${recipeLabel(r)}</span><small>${recipeRule(r)} · ${r.passive?`${weaponLevel}/4 + ${passiveLevel}/4`:`${weaponLevel}/5`} · ${state}</small></article>`;};
 root.innerHTML=`<section class="pause-loadout"><h3>${tr("本局装备","CURRENT LOADOUT")}</h3><div class="pause-owned-row">${ownedWeaponIds.map(id=>ownedChip(id,weapons[id],evolved[id])).join("")||`<span>${tr("暂无武器","NO WEAPONS")}</span>`}</div>${ownedPassiveIds.length?`<h3>${tr("本局道具","CURRENT ITEMS")}</h3><div class="pause-owned-row">${ownedPassiveIds.map(id=>ownedChip(id,passives[id])).join("")}</div>`:""}</section><section class="pause-all-recipes"><h3>${tr("融合图鉴","EVOLUTION GUIDE")} · ${evolutionRecipes.length}</h3><div class="pause-recipe-grid">${evolutionRecipes.map(recipeCard).join("")}</div></section>`;
}
const legacyTogglePauseV2=togglePause;
togglePause=function(){const opening=ui.pause.classList.contains("hidden");legacyTogglePauseV2();if(opening&&!ui.pause.classList.contains("hidden"))renderPauseArsenalV2();};

const style=document.createElement("style");style.textContent=`
.collection-summary{display:flex;gap:10px;align-items:baseline;padding:10px 14px;background:#20213a;color:#fff;border:3px solid #e9cf77;box-shadow:inset 0 0 0 3px #58452c}.collection-summary b{font-size:30px;color:#ffe485}.collection-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:10px}.collection-card{position:relative;min-height:158px;padding:10px 7px;background:#2a2940;border:3px solid #c9a85f;box-shadow:inset 0 0 0 2px #4f4250;color:#fff;text-align:center}.collection-card i{display:grid;place-items:center;width:56px;height:56px;margin:0 auto 6px;background:#171725;border:2px solid #806b49}.collection-card img{width:46px;height:46px;object-fit:contain;image-rendering:pixelated}.collection-card b,.collection-card span,.collection-card em{display:block}.collection-card b{font-size:13px;color:#ffe7a1}.collection-card span{font-size:10px;color:#bbb5c5;margin-top:4px}.collection-card em{font-size:9px;line-height:1.35;color:#8fdcc0;margin-top:6px;font-style:normal}.collection-card.locked i{background:#050508}.collection-card.locked img{filter:brightness(0);opacity:.9}.collection-card.locked{border-color:#514b58}.collection-evolutions:not(.locked){border-color:#dce8f1;box-shadow:inset 0 0 0 2px #73808e,0 0 12px rgba(225,242,255,.72);animation:rareCardPulse 1.8s steps(4,end) infinite}.collection-evolutions:not(.locked)::after{content:"✦";position:absolute;right:5px;top:3px;color:#fff;filter:drop-shadow(0 0 3px #a9d8ff);animation:rareSpark 1.15s steps(3,end) infinite}.collection-evolutions:not(.locked) i{border-color:#f2f8ff;background:radial-gradient(circle,#566477 0,#1a202a 68%);box-shadow:0 0 11px #d9edff}.collection-evolutions:not(.locked) b{color:#f3f8ff;text-shadow:0 0 5px #a9cff0}@keyframes rareCardPulse{50%{box-shadow:inset 0 0 0 2px #9db0c2,0 0 19px rgba(225,242,255,.95)}}@keyframes rareSpark{50%{opacity:.35;transform:scale(.75)}}.pause-card{width:min(1040px,96vw)!important}.pause-recipes{display:block!important}.pause-loadout,.pause-all-recipes{padding:10px;background:#252538;border:3px solid #c9a85f;box-shadow:inset 0 0 0 2px #4d4351;color:#fff}.pause-all-recipes{margin-top:12px}.pause-loadout h3,.pause-all-recipes h3{margin:5px 0 9px;color:#ffe597;text-align:left}.pause-owned-row{display:flex;flex-wrap:wrap;gap:7px}.pause-owned-chip{display:grid!important;grid-template-columns:38px minmax(70px,1fr);grid-template-rows:auto auto;align-items:center;min-width:142px!important;padding:5px 7px!important;background:#171725!important;border:2px solid #806b49!important;border-radius:0!important;white-space:normal!important;text-align:left}.pause-owned-chip img{grid-row:1/3;width:34px;height:34px;object-fit:contain;image-rendering:pixelated}.pause-owned-chip b,.pause-owned-chip small{padding-left:5px}.pause-owned-chip small{color:#9ed9c4}.pause-owned-chip.evolved{border-color:#e8f4ff!important;box-shadow:inset 0 0 0 2px #708093,0 0 14px #cce8ff;animation:rareCardPulse 1.8s steps(4,end) infinite}.pause-recipe-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.pause-recipe-card{min-width:0!important;padding:9px 6px!important;background:#171725!important;border:2px solid #5f5764!important;border-radius:0!important;white-space:normal!important;color:#fff;text-align:center}.pause-recipe-card.ready{border-color:#67e49d!important;box-shadow:inset 0 0 0 2px #286144}.pause-recipe-card.evolved{border-color:#e8f4ff!important;box-shadow:inset 0 0 0 2px #708093,0 0 14px #cce8ff;animation:rareCardPulse 1.8s steps(4,end) infinite}.pause-recipe-icons{display:flex;justify-content:center;align-items:center;gap:3px}.pause-recipe-icons img{width:32px;height:32px;object-fit:contain;image-rendering:pixelated}.pause-recipe-card strong,.pause-recipe-card span,.pause-recipe-card small{display:block}.pause-recipe-card strong{margin-top:5px;color:#ffe29a;font-size:12px}.pause-recipe-card span{margin-top:4px;color:#c9c4d1;font-size:9px}.pause-recipe-card small{margin-top:4px;color:#8fdcc0;font-size:9px}.relic-draft{position:fixed;inset:0;z-index:70;display:none;place-items:center;background:rgba(12,10,20,.78)}.relic-draft.show{display:grid}.relic-panel{width:min(980px,94vw);padding:28px;background:#181827;border:4px solid #f0d477;box-shadow:0 0 0 5px #59452c,0 30px 80px #000;color:#fff;text-align:center}.relic-panel h2{color:#ffe58d}.relic-options{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.relic-options button{min-height:260px;padding:20px;background:#28273a;border:3px solid #a99567;color:#fff;cursor:pointer}.relic-options button:hover{transform:translateY(-5px);border-color:#fff08f;box-shadow:0 0 24px #e7c94d}.relic-options i,.relic-options b,.relic-options em,.relic-options span{display:block}.relic-options i{font-size:48px;color:#ffe067}.relic-options b{font-size:24px;margin:12px 0 4px}.relic-options em{color:#c9b46e}.relic-options span{margin-top:20px;line-height:1.5}@media(max-width:800px){.pause-recipe-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.pause-owned-chip{min-width:120px!important}.relic-options{grid-template-columns:1fr}.relic-options button{min-height:150px}.relic-panel{max-height:92vh;overflow:auto}}
`;document.head.appendChild(style);

for(const r of evolutionRecipes){const recipeApply=()=>{evolved[r.weapon]=true;discover("evolutions",r.weapon);};r.discoverApply=recipeApply;}
const legacyShowChestRewardV2=showChestReward;
showChestReward=function(reward){if(reward&&/进化|Evolution|evolution/i.test(reward.desc||"")){const apply=reward.apply;reward.apply=function(){apply();const recipe=evolutionRecipes.find(r=>evolved[r.weapon]&&!ensureDiscovery().evolutions[r.weapon]);if(recipe)discover("evolutions",recipe.weapon);};}return legacyShowChestRewardV2(reward);};

characterDefs.find(c=>c.id==="rabbit").starterName=tr("🏹 胡萝卜箭","🏹 CARROT ARROWS");
characterDefs.find(c=>c.id==="rabbit").name=tr("弓箭豚鼠","Archer Guinea Pig");
characterDefs.find(c=>c.id==="rabbit").desc=tr("以木弓射出高伤害、高穿透的胡萝卜箭；翻滚期间短暂无敌。","Fires powerful piercing carrot arrows; briefly invulnerable while rolling.");
characterDefs.find(c=>c.id==="chinchilla").starterName=tr("🥕 胡萝卜大剑","🥕 CARROT GREATSWORD");
characterDefs.find(c=>c.id==="chinchilla").desc=tr("挥舞胡萝卜大剑进行前方180度重击；吃西瓜恢复最大生命的10%。","Sweeps a carrot greatsword through a 180-degree arc; watermelon restores 10% maximum health.");

})();
