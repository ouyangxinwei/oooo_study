(function(root){'use strict';function create(s){function update(dt){ s.enemies.forEach(e=>{
  if(!e.alive)return;e.cd=Math.max(0,e.cd-dt);e.phase+=dt;
  const dx=s.player.x-e.x,dist=Math.abs(dx),notice=e.kind==='mage'?235:e.kind==='bat'?175:150;
  if(dist<notice){e.state='chase';e.alert=2.8}else if(e.alert>0){e.alert=Math.max(0,e.alert-dt);e.state=e.alert>0?'return':'patrol'}else if(Math.abs(e.x-e.homeX)>6)e.state='return';else e.state='patrol';
  if(e.kind==='bat')e.y=174+Math.sin(e.phase*4)*8;
  if(e.state==='chase'){
   if(e.kind==='mage'){
    if(dist>105)e.x+=Math.sign(dx)*38*dt;
    if(dist<notice&&e.cd<=0){s.projectiles.push({x:e.x+(dx<0?-5:e.w),y:e.y+10,vx:(dx<0?-1:1)*105,life:2,hostile:true,attackType:'mage',source:'mage'});e.cd=1.8;e.state='attack'}
   }else if(e.kind==='knight'){
    if(dist>25)e.x+=Math.sign(dx)*48*dt;
    // Melee damage is resolved below from the enlarged s.player/enemy hurtboxes.
   }else if(e.kind==='bat'){
    if(dist>14)e.x+=Math.sign(dx)*72*dt;
    // Contact damage is resolved below from the enlarged s.player/enemy hurtboxes.
   }else{
    if(dist>24)e.x+=Math.sign(dx)*55*dt;
    // Contact damage is resolved below from the enlarged s.player/enemy hurtboxes.
   }
  }else if(e.state==='return'){
   const homeDx=e.homeX-e.x;if(Math.abs(homeDx)>4)e.x+=Math.sign(homeDx)*35*dt;else{e.x=e.homeX;e.state='patrol'}
  }else if(e.state==='patrol'){
   e.x+=e.vx*60*dt;if(Math.abs(e.x-e.homeX)>62)e.vx*=-1;
  }
  e.x=Math.max(0,Math.min(s.worldWidth-e.w,e.x));
  if(s.overlaps(s.playerHurtbox(),s.enemyHurtbox(e))&&e.cd<=0&&e.kind!=='mage'){s.hurt(e.kind==='knight'?17:e.kind==='bat'?9:11);e.cd=e.kind==='knight'?1.15:.85}
 });
 if(s.player.x>s.stageMap().bossGateX&&!s.bossSpawned){s.bossSpawned=true;s.hud.lootText.textContent=s.loot+' · '+s.stageProfile().name+'出现！';s.updateBossHud()}
 if(s.bossSpawned&&s.boss.alive){
  s.boss.phase=s.boss.hp>s.boss.max*.66?1:s.boss.hp>s.boss.max*.33?2:3;
  s.boss.cd=Math.max(0,s.boss.cd-dt);s.boss.flash=Math.max(0,s.boss.flash-dt);
  if(s.boss.dashTimer>0){s.boss.dashTimer=Math.max(0,s.boss.dashTimer-dt);s.boss.x+=Math.sign(s.player.x-s.boss.x)*245*dt;if(!s.boss.dashHit&&s.overlaps(s.playerHurtbox(),s.bossHurtbox())){s.hurt(22);s.boss.dashHit=true}if(s.boss.dashTimer===0){s.boss.attackType='low';s.boss.cd=.55}}
  else {s.boss.x+=s.boss.vx*(s.boss.phase===1?42:s.boss.phase===2?58:68)*dt;if(s.boss.x<s.stageMap().bossArena[0]||s.boss.x>s.stageMap().bossArena[1])s.boss.vx*=-1}
  if(s.boss.aoeTimer>0){s.boss.aoeTimer=Math.max(0,s.boss.aoeTimer-dt);if(s.boss.aoeTimer<.18&&!s.boss.aoeHit){s.boss.aoeHit=true;const dist=Math.abs((s.player.x+s.player.w/2)-(s.boss.x+s.boss.w/2));if(dist<(s.currentStage===6?150:118))s.hurt((s.currentStage===8?26:s.currentStage===6?20:18)+s.boss.phase*2)}}
  if(s.boss.cd<=0&&s.boss.dashTimer<=0){
   s.boss.attackSeq++;const profile=s.stageProfile();let mode=profile.attack;
   if(s.currentStage===1)mode=s.boss.attackSeq%2?'high':'low';
   else if(s.currentStage===2)mode=s.boss.attackSeq%3===0?'low':'dash';
   else if(s.currentStage===3)mode='spread';
   else if(s.currentStage===4)mode='wave';
   else if(s.currentStage===5)mode='crystal';
   else if(s.currentStage===6)mode='vines';
   else if(s.currentStage===7)mode='rift';
   else mode=['ultimate','dash','wave','spread'][s.boss.attackSeq%4];
   s.boss.attackType=mode;
   const dir=s.player.x<s.boss.x?-1:1,originX=s.boss.x+(dir<0?-8:s.boss.w),baseCd=s.boss.phase===3?.92:s.boss.phase===2?1.18:1.42;
   if(mode==='dash'){s.boss.dashTimer=s.currentStage===2?.95:.72;s.boss.dashHit=false;s.boss.cd=s.currentStage===2?1.15:1.5}
   else if(['wave','vines'].includes(mode)){s.boss.aoeTimer=mode==='vines'?.85:.68;s.boss.aoeHit=false;s.boss.cd=mode==='vines'?1.55:1.65;}
   else if(mode==='spread'||mode==='crystal'||mode==='rift'||mode==='ultimate'){
    const count=mode==='spread'?3:mode==='crystal'?4:mode==='rift'?2:5;
    for(let j=0;j<count;j++){const offset=j-(count-1)/2;const speed=(mode==='rift'?185:mode==='crystal'?145:mode==='ultimate'?175:132);s.projectiles.push({x:originX,y:mode==='crystal'?160+Math.abs(offset)*8:mode==='rift'?172+offset*8:(s.boss.attackSeq%2?178:198),vx:dir*speed,vy:mode==='spread'?offset*35:mode==='crystal'?offset*24:mode==='rift'?offset*48:offset*28,life:2.4,hostile:true,attackType:mode,source:'boss'});}
    s.boss.cd=baseCd*(mode==='ultimate'?.78:1.12);
   }else if(mode==='low'||mode==='high'){
    s.projectiles.push({x:originX,y:mode==='high'?213:202,vx:dir*(s.boss.phase===3?165:125),vy:0,life:2,hostile:true,attackType:mode,source:'boss'});s.boss.cd=baseCd;
   }
   if(s.currentStage===3&&s.boss.attackSeq%3===0&&s.boss.summonCount<2){const sx=Math.max(s.stageMap().bossArena[0],Math.min(s.stageMap().bossArena[1],s.boss.x+(Math.random()<.5?-65:65)));const minion={x:sx,spawnX:sx,homeX:sx,y:174,w:22,h:20,hp:38,max:38,vx:.5,kind:'bat',alive:true,cd:.5,state:'chase',alert:3,phase:Math.random()*6,hitFlash:0,bossSummon:true};s.enemies.push(minion);s.boss.summonCount++;}
   if(s.currentStage===6&&s.boss.attackSeq%2===0){s.projectiles.push({x:Math.max(s.stageMap().bossArena[0],Math.min(s.stageMap().bossArena[1],s.player.x+70)),y:198,vx:-40,vy:0,life:1.5,hostile:true,attackType:'vines',source:'boss'});}
  }
 }
 s.updateBossHud();
}return {update}}root.MoonlitEnemyAI={create}})(window);

