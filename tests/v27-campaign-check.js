const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const docs = ['README.md','CHANGELOG.md','docs/技术手册.md','docs/玩法与系统说明.md'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
const checks = [
 ['八个 Boss 配置', (html.match(/name:'(?:苍铠守门者|墓穴收割者|深渊巫王|赤焰钟魔|霜晶巨像|荆棘女王|虚空双生|月蚀古龙)'/g)||[]).length===8],
 ['八关关卡标题', (html.match(/title:'(?:第一关|第二关|第三关|第四关|第五关|第六关|第七关|第八关)/g)||[]).length===8],
 ['Boss 血量按 1.1 指数增长', /function stageBossMax\(n=currentStage\)\{let hp=900;for\(let i=2;i<=n;i\+\+\)hp=Math\.round\(hp\*1\.1\);return hp;\}/.test(html)],
 ['Boss 攻击模式覆盖八关', ['low','dash','spread','wave','crystal','vines','rift','ultimate'].every(x=>html.includes("'"+x+"'"))],
 ['Boss 造型按关卡分支绘制', /function drawBoss\(\)[\s\S]*currentStage===8/.test(html)],
 ['击败后进入转场', /function showStageTransition\(\)/.test(html)&&/function startNextStage\(\)/.test(html)],
 ['转场自动推进', /setTimeout\(\(\)=>\{if\(stageTransitioning&&token===transitionToken\)startNextStage\(\)\},2800\)/.test(html)],
 ['保存关卡进度和计时', /world:\{currentStage,stageElapsed:Math\.max\(0,\(performance\.now\(\)-stageStartedAt\)\/1000\),stageTransitioning/.test(html)],
 ['恢复转场状态', /if\(stageTransitioning&&!won&&!gameOver&&currentStage<8\)\{showStageTransition\(\)/.test(html)],
 ['存档版本 V27', /moonlitKeepSaveV27/.test(html)&&/SAVE_VERSION=27/.test(html)],
 ['Service Worker 缓存 V27', /moonlit-keep-v27/.test(sw)],
 ['文档记录 V27', /v0\.27|V27：八关 Boss 战役/.test(docs)]
];
let failed=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failed++}
if(failed)process.exit(1);
console.log(`\n${checks.length-checks.filter(x=>!x[1]).length}/${checks.length} checks passed`);
