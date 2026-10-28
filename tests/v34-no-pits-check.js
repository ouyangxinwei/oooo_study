/* V34 continuous ground and fall safety regression check. */
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),physics=fs.readFileSync(path.join(root,'physics.js'),'utf8'),maps=fs.readFileSync(path.join(root,'stage-maps.js'),'utf8'),sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert.match(html,/platforms=\[\{x:0,y:226,w:worldWidth\},\.\.\.map\.platforms\.map/,'every stage includes continuous ground');
assert.equal((maps.match(/platforms:\[/g)||[]).length,8,'all eight maps define their own platforms');
assert.ok(!maps.includes("type:'pit'"),'there are no pit hazards in stage definitions');
assert.ok(!html.includes('if(player.y>H+40)hurt(100)'), 'falling out of view cannot kill the player');
assert.match(physics,/if\(p\.y>s\.H\+40\)\{p\.crouching=false;[\s\S]*?p\.y=s\.floorY-p\.h/,'offscreen fall safely returns player to ground');
assert.match(sw,/moonlit-keep-v42/,'cache version bumped');
console.log('PASS V34 continuous ground across all areas, no floor pits, safe fall recovery and cache');
