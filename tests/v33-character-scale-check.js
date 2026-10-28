/* V33 character scale and pixel-grid regression check. */
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),renderer=fs.readFileSync(path.join(root,'renderer.js'),'utf8'),sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert.match(renderer,/expandPixelGrid\(rows,factor=6\)/,'pixel art uses a sixfold native grid');
assert.match(renderer,/pixelSpritesMax=Object\.fromEntries/,'high-resolution character sprites are prepared');
assert.match(renderer,/drawPixelSprite\(rows,drawX,drawY,pixelPalettes\.hero,1/,'hero sprite is drawn at native pixel precision');
assert.match(renderer,/game\.ctx\.scale\(3,3\)/,'Boss silhouette is rendered at 3x');
assert.match(renderer,/barY=baseY\+game\.boss\.h-\(artBottom-artTop\)\*3/,'Boss HUD follows the enlarged silhouette');
assert.match(renderer,/barW=width/,'enemy health bars follow enlarged sprites');
assert.match(sw,/moonlit-keep-v42/,'cache version updated');
console.log('PASS V33 3x characters and Boss, native pixel grid, aligned HUD and cache version');
