/* V32 targeted regressions for combat lanes, interaction and scoped cache cleanup. */
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),combat=fs.readFileSync(path.join(root,'combat.js'),'utf8'),ai=fs.readFileSync(path.join(root,'enemy-ai.js'),'utf8'),sw=fs.readFileSync(path.join(root,'sw.js'),'utf8'),manual=fs.readFileSync(path.join(root,'docs','技术手册.md'),'utf8');
assert.match(ai,/mode==='high'\?213:202/,'Boss shot lanes align with crouch/jump responses');
assert.match(html,/attackType==='high'\|\|!crouchClears/,'high shots require jump and crouch-safe shots trigger crouch');
assert.match(html,/keys=\{[^}]*up:false[^}]*interact:false/,'jump and interaction have separate input state');
assert.match(html,/if\(keys\.interact\)\{interactWithStage\(\);keys\.interact=false\}/,'chest and portal interactions use the interaction key');
const demo=html.match(/function driveDemo\(dt\)\{([\s\S]*?)\n\}/)[1];
assert.ok(!/target\.hp\s*-=/ .test(demo)&&!/boss\.hp\s*-=/ .test(demo),'demo no longer applies hidden direct damage');
assert.match(combat,/vy=dy\/d\*190/,'demo magic can aim at elevated enemies');
assert.match(sw,/key\.startsWith\(CACHE_PREFIX\)/,'service worker only clears the game cache namespace');
assert.match(manual,/moonlitKeepSaveV37/,'save debugging instructions use the current save key');
console.log('PASS V32 combat lanes, independent interact input, real demo hit path, scoped caches and current save docs');

