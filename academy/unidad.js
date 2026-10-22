/* Utilidades compartidas de las unidades: audio, teclado SVG, teoría, práctica y navegación. */
(function(){
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const $=s=>document.querySelector(s);
let ac=null,master=null,voices=[];
function actx(){if(!ac){try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ac=new C();master=ac.createGain();master.gain.value=.7;master.connect(ac.destination)}if(ac.state==='suspended')ac.resume();return ac}
function note(abs,when,dur,amp){
  const c=actx();if(!c)return;
  const f=130.81*Math.pow(2,abs/12),g=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;
  g.gain.setValueAtTime(0.0001,when);g.gain.exponentialRampToValueAtTime(amp,when+0.012);g.gain.exponentialRampToValueAtTime(amp*0.3,when+0.35);g.gain.exponentialRampToValueAtTime(0.0001,when+dur);
  const oscs=[];[[1,'triangle',1],[2,'sine',.3],[3,'sine',.1],[4,'sine',.05]].forEach(([m,t,a])=>{const o=c.createOscillator(),og=c.createGain();o.type=t;o.frequency.value=f*m;og.gain.value=a;o.connect(og);og.connect(lp);o.start(when);o.stop(when+dur+.05);oscs.push(o)});
  lp.connect(g);g.connect(master);
  voices=voices.filter(v=>v.end>c.currentTime);voices.push({g,oscs,end:when+dur+.05});
}
function stopAll(){if(!ac)return;const t=ac.currentTime;voices.forEach(v=>{try{v.g.gain.cancelScheduledValues(t);v.g.gain.setValueAtTime(Math.max(v.g.gain.value,0.0001),t);v.g.gain.exponentialRampToValueAtTime(0.0001,t+.06);v.oscs.forEach(o=>o.stop(t+.08))}catch(e){}});voices=[]}
function playSet(list,arp){const c=actx();if(!c||!list.length)return;stopAll();const t=c.currentTime+.03,amp=.32/Math.sqrt(list.length);
  list.forEach((a,i)=>note(a,arp?t+i*.22:t,arp?1.3:2.2,arp?.3:amp));
  if(arp)list.forEach(a=>note(a,t+list.length*.22+.1,2.2,amp))}
const BLACK_AFTER={0:1,1:3,3:6,4:8,5:10}, WHITE_PC=[0,2,4,5,7,9,11];
function svgEl(t,attrs,txt){const e=document.createElementNS('http://www.w3.org/2000/svg',t);for(const k in attrs)e.setAttribute(k,attrs[k]);if(txt!=null)e.textContent=txt;return e}
const R12S=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
let kfocus=null;
function refocus(){if(!kfocus)return;const el=document.querySelector(kfocus);kfocus=null;if(el)el.focus({preventScroll:true})}
function keyboard({octaves=2,marks=new Map(),clickable=false,onKey=null,W=24,H=118,ctx='',minKey=24}){
  const BW=W*.6,BH=H*.62,nW=octaves*7,pad=2;
  const svg=svgEl('svg',{viewBox:`0 0 ${nW*W+pad*2} ${H+pad*2}`,role:clickable?'group':'img'});
  if(clickable)svg.style.minWidth=(nW*minKey)+'px';
  const g=svgEl('g',{transform:`translate(${pad},${pad})`});svg.appendChild(g);const desc=[],keys=[];
  const mono='Instrument Sans, sans-serif';
  for(let i=0;i<nW;i++){const abs=Math.floor(i/7)*12+WHITE_PC[i%7],m=marks.get(abs);
    const r=svgEl('rect',{x:i*W,y:0,width:W,height:H,rx:3,fill:m?(m.root?'var(--violet)':'var(--navy)'):'var(--key-white)',stroke:'var(--key-edge)','stroke-width':1});
    if(clickable){r.setAttribute('class','k');r.dataset.abs=abs;keys.push({abs,el:r,m})}g.appendChild(r);
    if(m){g.appendChild(svgEl('text',{x:i*W+W/2,y:H-26,'text-anchor':'middle','font-size':W*.5,'font-family':mono,'font-weight':700,fill:'var(--on-navy)','pointer-events':'none'},m.label));
      if(m.deg)g.appendChild(svgEl('text',{x:i*W+W/2,y:H-9,'text-anchor':'middle','font-size':Math.max(W*.4,9),'font-family':mono,fill:'var(--on-navy)',opacity:.9,'pointer-events':'none'},m.deg));desc.push(m.label)}}
  for(let i=0;i<nW;i++){const wi=i%7;if(!(wi in BLACK_AFTER))continue;
    const abs=Math.floor(i/7)*12+BLACK_AFTER[wi],m=marks.get(abs),x=(i+1)*W-BW/2;
    const r=svgEl('rect',{x,y:0,width:BW,height:BH,rx:2,fill:m?(m.root?'var(--violet)':'var(--navy)'):'var(--key-black)',stroke:m?'var(--key-black)':'none','stroke-width':1});
    if(clickable){r.setAttribute('class','k');r.dataset.abs=abs;keys.push({abs,el:r,m})}g.appendChild(r);
    if(m){g.appendChild(svgEl('text',{x:x+BW/2,y:BH-12,'text-anchor':'middle','font-size':Math.max(W*.42,10),'font-family':mono,'font-weight':700,fill:'var(--on-navy)','pointer-events':'none'},m.label));desc.push(m.label)}}
  if(!clickable)svg.setAttribute('aria-label',desc.length?'Teclado con las notas '+desc.join(', '):'Teclado');
  else{
    svg.setAttribute('aria-label','Teclado. Flechas para moverte, Enter para tocar una nota.');
    keys.sort((p,q)=>p.abs-q.abs);
    let start=keys.findIndex(k=>k.m&&k.m.root);if(start<0)start=keys.findIndex(k=>k.m);if(start<0)start=0;
    keys.forEach((k,i)=>{k.el.setAttribute('role','button');k.el.setAttribute('tabindex',i===start?'0':'-1');
      k.el.setAttribute('aria-label',(k.m?k.m.label:R12S[k.abs%12])+(k.m?', en el acorde':''));k.el.setAttribute('aria-pressed',k.m?'true':'false')});
    const go=(i,j)=>{j=Math.max(0,Math.min(keys.length-1,j));keys[i].el.tabIndex=-1;keys[j].el.tabIndex=0;keys[j].el.focus()};
    svg.addEventListener('keydown',e=>{const t=e.target.closest('.k');if(!t)return;const i=keys.findIndex(k=>k.el===t);
      if(e.key==='ArrowRight'||e.key==='ArrowUp'){e.preventDefault();go(i,i+1)}
      else if(e.key==='ArrowLeft'||e.key==='ArrowDown'){e.preventDefault();go(i,i-1)}
      else if(e.key==='Home'){e.preventDefault();go(i,0)}
      else if(e.key==='End'){e.preventDefault();go(i,keys.length-1)}
      else if((e.key==='Enter'||e.key===' ')&&onKey){e.preventDefault();kfocus=`${ctx} .k[data-abs="${t.dataset.abs}"]`;onKey(+t.dataset.abs);refocus()}});
    const ring=svgEl('g',{'pointer-events':'none',display:'none'}),r1=svgEl('rect',{fill:'none',stroke:'#161a33','stroke-width':4}),r2=svgEl('rect',{fill:'none',stroke:'#fff','stroke-width':1.5});ring.append(r1,r2);g.appendChild(ring);
    svg.addEventListener('focusin',e=>{const t=e.target.closest('.k');if(!t||!t.matches(':focus-visible'))return;['x','y','width','height','rx'].forEach(a=>{r1.setAttribute(a,t.getAttribute(a));r2.setAttribute(a,t.getAttribute(a))});ring.removeAttribute('display')});
    svg.addEventListener('focusout',()=>ring.setAttribute('display','none'));
    let down=null;
    svg.addEventListener('pointerdown',e=>{const t=e.target.closest('.k');down=t?{t,x:e.clientX,y:e.clientY}:null});
    svg.addEventListener('pointercancel',()=>{down=null});
    svg.addEventListener('pointerup',e=>{if(!down||!onKey)return;const d=down;down=null;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)<8)onKey(+d.t.dataset.abs)});
  }
  return svg;
}
const ACC=a=>a>0?'#'.repeat(a):a<0?'b'.repeat(-a):'';
const LET=['C','D','E','F','G','A','B'],LPC=[0,2,4,5,7,9,11];
const nm=(l,a)=>LET[l]+ACC(a);
const ES={C:'Do',D:'Re',E:'Mi',F:'Fa',G:'Sol',A:'La',B:'Si'};
const esName=n=>ES[n[0]]+n.slice(1).replace('#','♯').replace(/b/g,'♭');
const pretty=n=>n.replace(/##/g,'𝄪').replace(/#/g,'♯').replace(/bb/g,'𝄫').replace(/b/g,'♭');
function parseNote(s){const m=String(s).match(/^([A-G])(#{1,2}|b{1,2})?/);if(!m)return null;return{l:LET.indexOf(m[1]),a:m[2]?(m[2][0]==='#'?m[2].length:-m[2].length):0,len:m[0].length}}
function scale(l,a,minor){const rpc=((LPC[l]+a)%12+12)%12,st=minor?[0,2,3,5,7,8,10]:[0,2,4,5,7,9,11];
  return st.map((s,i)=>{const L=(l+i)%7,tgt=(rpc+s)%12;let d=((tgt-LPC[L])%12+12)%12;if(d>6)d-=12;return{l:L,a:d,pc:tgt,abs:rpc+s,name:nm(L,d)}})}
const TRI_MAJ=['','m','m','','','m','dim'],TRI_MIN=['m','dim','','m','m','',''];
const DEG_NAMES=['Tónica','Supertónica','Mediante','Subdominante','Dominante','Submediante o superdominante','Sensible'];
const ROMAN=['I','II','III','IV','V','VI','VII'];
const triads=(l,a,minor)=>scale(l,a,minor).map((n,i)=>({...n,deg:ROMAN[i],dname:DEG_NAMES[i],sym:n.name+(minor?TRI_MIN:TRI_MAJ)[i],q:(minor?TRI_MIN:TRI_MAJ)[i]}));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=(a,n)=>shuffle(a).slice(0,n);
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const ICON_SPK='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/></svg>';

function quizShell(root,title){root.classList.add('quiz');root.innerHTML=`<div class="qbar"><span class="lbl">${title}</span><span class="best"></span></div><div class="qbody"></div>`;return{body:root.querySelector('.qbody'),best:root.querySelector('.best')}}
function finish(sh,id,score,total,again,missedN,review){
  let best=store.get(id+'-best',null);if(best==null||score>best){best=score;store.set(id+'-best',best)}
  sh.best.textContent=`Tu mejor resultado: ${best} de ${total}`;
  const sec=sh.body.closest('section');if(sec&&unitNo&&window.CURSO){CURSO.markSeen(unitNo,sec.id);document.dispatchEvent(new Event('av-progress'))}
  const msg=score===total?'¡Perfecto! Todas salieron a la primera.':score>=total*.75?'Muy bien: ya dominas casi todo.':'Cada intento afina el oído. Repasa el tema y vuelve a intentarlo cuando quieras.';
  sh.body.innerHTML=`<div class="done"><b>${score} de ${total} correctas</b><p>${msg}</p><div class="qactions">${missedN?`<button type="button" class="btn" id="qrev">Repasar las falladas (${missedN})</button>`:''}<button type="button" class="${missedN?'pbtn':'btn'}" id="qagain">Repetir</button></div></div>`;
  sh.body.querySelector('#qagain').onclick=again;const r=sh.body.querySelector('#qrev');if(r)r.onclick=review}
function playList(q){if(q.play&&q.play.length)playSet(q.play.slice(),!!q.arp)}
/* Práctica de opción múltiple. make(n) devuelve [{q,vis?,opts,ans,why,play?}] */
function mcq({root,id,title='Práctica',total=8,make}){
  const el=typeof root==='string'?$(root):root,sh=quizShell(el,title),b0=store.get(id+'-best',null);
  if(b0!=null)sh.best.textContent=`Tu mejor resultado: ${b0} de ${total}`;
  let st;
  const start=qs=>{st={i:0,score:0,qs:(qs||make(total)).map(q=>{if(q.fixed)return q;const o=shuffle(q.opts.map((t,k)=>({t,k})));return{...q,opts:o.map(x=>x.t),ans:o.findIndex(x=>x.k===q.ans)}}),missed:[],full:!qs};draw()};
  function draw(){
    if(st.i>=st.qs.length){if(st.full)finish(sh,id,st.score,st.qs.length,()=>start(),st.missed.length,()=>start(st.missed.map(q=>({...q,fixed:false,opts:q.opts,ans:q.ans}))));else{sh.body.innerHTML=`<div class="done"><b>${st.score} de ${st.qs.length} en el repaso</b><div class="qactions"><button type="button" class="btn" id="qagain">Volver a empezar</button></div></div>`;sh.body.querySelector('#qagain').onclick=()=>start()}return}
    const q=st.qs[st.i];
    sh.body.innerHTML=`<div class="qhead"><div class="cap">Pregunta ${st.i+1} de ${st.qs.length}</div><div class="progress"><span>${st.score} correctas</span><div class="bar"><i style="width:${Math.round(st.i/st.qs.length*100)}%"></i></div></div></div><div class="qtext" tabindex="-1">${q.q}</div>${q.vis?'<div class="qvis"></div>':''}${q.play?`<div><button type="button" class="ibtn solid" id="qhear" aria-label="Escuchar" title="Escuchar">${ICON_SPK}</button></div>`:''}<div class="opts" role="group" aria-label="Respuestas"></div><div class="qactions"><span class="feedback" id="qfb" aria-live="polite"></span><button type="button" class="btn" id="qnext" hidden>Siguiente</button></div><p class="cap" id="qwhy"></p>`;
    if(q.vis)sh.body.querySelector('.qvis').appendChild(typeof q.vis==='function'?q.vis():q.vis);
    const h=sh.body.querySelector('#qhear');if(h)h.onclick=()=>playList(q);
    const box=sh.body.querySelector('.opts');
    const allShort=q.opts.every(t=>t.replace(/<[^>]*>/g,'').length<=6);
    q.opts.forEach((t,k)=>{const b=document.createElement('button');b.type='button';b.className='opt'+(allShort?' big':'');b.innerHTML=t;b.onclick=()=>{
      box.querySelectorAll('.opt').forEach((x,j)=>{x.disabled=true;if(j===q.ans)x.classList.add('good')});
      const ok=k===q.ans;if(!ok)b.classList.add('bad');if(ok)st.score++;else if(st.full&&!st.missed.includes(q))st.missed.push(q);
      const fb=sh.body.querySelector('#qfb');fb.className='feedback '+(ok?'ok':'err');fb.textContent=ok?'¡Correcto!':'Casi: la respuesta correcta está en verde.';
      sh.body.querySelector('#qwhy').textContent=q.why||'';const nx=sh.body.querySelector('#qnext');nx.hidden=false;nx.textContent=st.i===st.qs.length-1?'Ver resultado':'Siguiente';nx.onclick=()=>{st.i++;draw();const t=sh.body.querySelector('.qtext');if(t)t.focus({preventScroll:true})};nx.focus({preventScroll:true})};box.appendChild(b)});
  }
  start();return{restart:()=>start()}}
/* Práctica en el piano. make(n) devuelve [{q,targets:[pc],need,why?,play?}]; el orden y la octava no importan */
function keyQuiz({root,id,title='Práctica con el instrumento',total=8,make,octaves=2}){
  const el=typeof root==='string'?$(root):root,sh=quizShell(el,title),b0=store.get(id+'-best',null);
  if(b0!=null)sh.best.textContent=`Tu mejor resultado: ${b0} de ${total}`;
  let st,inst='piano';const start=qs=>{st={i:0,score:0,qs:qs||make(total),picked:[],checked:false,missed:[],full:!qs};draw()};
  const nmS=pc=>R12S[pc];
  function draw(){
    if(st.i>=st.qs.length){if(st.full)finish(sh,id,st.score,st.qs.length,()=>start(),st.missed.length,()=>start(st.missed.slice()));else{sh.body.innerHTML=`<div class="done"><b>${st.score} de ${st.qs.length} en el repaso</b><div class="qactions"><button type="button" class="btn" id="qagain">Volver a empezar</button></div></div>`;sh.body.querySelector('#qagain').onclick=()=>start()}return}
    const q=st.qs[st.i],tg=new Set(q.targets);
    sh.body.innerHTML=`<div class="qhead"><div class="cap">Pregunta ${st.i+1} de ${st.qs.length}</div><div class="progress"><span>${st.score} correctas</span><div class="bar"><i style="width:${Math.round(st.i/st.qs.length*100)}%"></i></div></div></div><div class="qtext" tabindex="-1">${q.q}</div><div class="tabs" role="group" aria-label="Instrumento"><button type="button" data-inst="piano" aria-pressed="${inst==='piano'}">Piano</button><button type="button" data-inst="guitar" aria-pressed="${inst==='guitar'}">Guitarra</button></div><div class="kb" style="max-width:680px;overflow-x:auto"></div><div class="qactions"><button type="button" class="btn" id="qcheck">Revisar</button><button type="button" class="pbtn" id="qclr">Borrar</button><button type="button" class="ibtn solid" id="qhear" aria-label="Escuchar" title="Escuchar">${ICON_SPK}</button><span class="feedback" id="qfb" aria-live="polite"></span></div><p class="cap" id="qhint"></p>`;
    const kb=sh.body.querySelector('.kb'),chk=sh.body.querySelector('#qcheck'),pcs=()=>[...new Set(st.picked.map(a=>((a%12)+12)%12))],upd=()=>{if(!st.checked)chk.disabled=pcs().length!==q.need};
    sh.body.querySelectorAll('[data-inst]').forEach(b=>b.onclick=()=>{if(b.dataset.inst===inst)return;inst=b.dataset.inst;if(!st.checked)st.picked=[];draw()});
    const marks=new Map();
    if(st.checked)q.targets.forEach(pc=>{marks.set(pc,{label:nmS(pc),root:true});marks.set(pc+12,{label:nmS(pc),root:true})});
    else st.picked.forEach(a=>marks.set(a,{label:nmS(a%12),root:false}));
    if(inst==='guitar'){const fb=fretboard(kb,{blank:true,label:'Diapasón para responder',onPlay:({midi})=>{if(st.checked)return;const abs=midi-48,at=st.picked.indexOf(abs);if(at>=0)st.picked.splice(at,1);else st.picked.push(abs);fb.setPicked(new Set(st.picked.map(x=>x+48)));upd()}});
      if(st.checked)fb.setPcs(new Map(q.targets.map(pc=>[pc,{root:true}])));else fb.setPicked(new Set(st.picked.map(x=>x+48)))}
    else kb.appendChild(keyboard({octaves,marks,clickable:!st.checked,W:26,H:120,minKey:22,ctx:'.kb',onKey:abs=>{const c=actx();if(c)note(abs,c.currentTime+.01,1,.3);const at=st.picked.indexOf(abs);if(at>=0)st.picked.splice(at,1);else st.picked.push(abs);draw()}}));
    const ok=()=>{const p=pcs();return p.length===tg.size&&p.every(x=>tg.has(x))};
    sh.body.querySelector('#qhear').onclick=()=>{const l=(q.play||q.targets.map(p=>p).sort((x,y)=>x-y));playSet(l.slice(),l.length>1)};
    if(st.checked){const good=ok(),fb=sh.body.querySelector('#qfb');fb.className='feedback '+(good?'ok':'err');
      fb.textContent=good?'¡Correcto!':(inst==='guitar'?'Las notas correctas están en violeta: ':'Las teclas correctas están en violeta: ')+q.targets.map(nmS).join(' – ')+'.';sh.body.querySelector('#qhint').textContent=q.why||'';
      sh.body.querySelector('#qclr').hidden=true;chk.textContent=st.i===st.qs.length-1?'Ver resultado':'Siguiente';chk.onclick=()=>{st.i++;st.picked=[];st.checked=false;draw();const t=sh.body.querySelector('.qtext');if(t)t.focus({preventScroll:true})}}
    else{chk.disabled=pcs().length!==q.need;sh.body.querySelector('#qhint').textContent='';
      chk.onclick=()=>{st.checked=true;if(ok())st.score++;else if(st.full)st.missed.push(q);draw()};sh.body.querySelector('#qclr').onclick=()=>{st.picked=[];draw()}}
  }
  start();return{restart:()=>start()}}

/* Lección: temario, pestañas por tema, modo enfoque (≤1023 px) y progreso por lección */
const TABS=[['ver','Ver'],['leer','Leer'],['practicar','Practicar'],['recursos','Recursos']];
const SEL_LEER='.prose,.note,.tbl,.tblwrap,.cards,.figs,.scale-box,.inv-grid,[data-carousel],.car-host';
const SEL_PRAC='.lab,.panel,.quiz,.kbd-box,#kq,#mq,#quiz,#q1,#q2';
function tabOf(el,prev){
  if(el.dataset.tab)return el.dataset.tab;
  if(el.matches('video,iframe,.video')||el.querySelector('video,iframe'))return'ver';
  if(el.matches('audio,.recursos,a[href$=".pdf"]'))return'recursos';
  if(el.matches(SEL_LEER))return'leer';
  if(el.matches(SEL_PRAC))return'practicar';
  if(el.classList.contains('cap')&&prev)return prev;
  return el.querySelector('button,input,select,textarea')?'practicar':'leer';
}
let unitNo=null;
const focusMQ=window.matchMedia('(max-width:1023px)');
function course(ME){
  const C=window.CURSO;if(!C)return;
  if(course.on){document.dispatchEvent(new Event('av-progress'));return}
  course.on=true;unitNo=ME;
  C.header('cursos');
  const num=n=>String(n).padStart(2,'0'),unit=C.unit(ME),secs=[...document.querySelectorAll('main>section[id]')];
  const lessons=secs.map(s=>({id:s.id,k:s.querySelector('.sec-head .k').textContent,title:s.querySelector('.sec-head h2').textContent}));
  const all=C.flat(),idxOf=id=>all.findIndex(x=>x.u===ME&&x.id===id);
  const intro=document.querySelector('.unit-intro h1');if(intro&&!document.querySelector('.unit-intro .lvl'))intro.insertAdjacentHTML('beforebegin',`<span class="lvl lvl-${unit.lvl}">${C.levels[unit.lvl]}</span>`);
  const cr=$('#crumbs');if(cr)cr.innerHTML=`<li><a href="curso.html?c=teoria">Teoría musical</a></li><li aria-current="page">Unidad ${num(ME)} – ${unit.title}</li>`;

  /* Temario: columna fija en escritorio y panel deslizable en tablet/celular */
  const chev='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.6 6L15 12l-6.4 6-1.4-1.4 5-4.6-5-4.6z"/></svg>',chevD='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8.6L12 15l6-6.4 1.4 1.4L12 17.8 4.6 10z"/></svg>';
  const tick='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 16.2L5.3 12l-1.4 1.4 5.6 5.6L20.1 8.4 18.7 7z"/></svg>';
  let curId=null;
  function temario(drawer){
    const done=C.done(),nd=done.length;
    const units=C.units.map(u=>{
      const d=done.includes(u.n),cur=u.n===ME,ic=`<span class="su-ic">${d?tick:num(u.n)}</span>`;
      const end=drawer?`<span class="su-n">${u.lessons.length} lecc.</span>`:(cur?chevD:chev);
      const row=`${ic}<span class="su-t">${u.title}</span>${u.ready?end:'<span class="su-n">Pronto</span>'}`;
      const ls=cur?`<ol class="sl-list">${lessons.map(l=>{const seen=C.isSeen(ME,l.id),on=l.id===curId;
        return `<li><a class="sl${on?' on':''}${seen?' seen':''}" href="#${l.id}"${on?' aria-current="location"':''}><span class="sl-dot" aria-hidden="true"></span><span class="sl-t">${l.k} ${l.title}${seen?'<span class="sr"> (vista)</span>':''}</span></a></li>`}).join('')}</ol>`:'';
      const a=!u.ready?`<span class="su off">${row}</span>`:cur?`<a class="su cur${d?' done':''}" href="#${curId||lessons[0].id}" aria-current="page">${row}</a>`:`<a class="su${d?' done':''}" href="${u.file}">${row}</a>`;
      return `<li>${a}${ls}</li>`}).join('');
    return `<div class="syl-head"><span class="syl-dot" aria-hidden="true"></span><a class="syl-name" href="curso.html?c=teoria">Teoría musical</a><a href="index.html#cursos">Cambiar ▾</a></div><div class="mbar v" role="progressbar" aria-label="Unidades terminadas" aria-valuemin="0" aria-valuemax="${C.units.length}" aria-valuenow="${nd}"><i style="width:${Math.round(nd/C.units.length*100)}%"></i></div><p class="syl-cap">${nd} de ${C.units.length} unidades</p><ol class="syl-units">${units}</ol>${drawer?'<nav class="drawer-nav syl-links" aria-label="Principal"><a href="index.html">Inicio</a><a href="progreso.html">Mi progreso</a></nav>':''}`;
  }
  const syl=$('#syl');
  const bar=document.createElement('div');bar.className='fbar';
  bar.innerHTML=`<a class="fb-back" href="curso.html?c=teoria" aria-label="Volver a Teoría musical"><span class="t-long">← Teoría musical</span><span class="t-short" aria-hidden="true">‹</span></a><div class="fb-title"><small class="t-short">TEORÍA MUSICAL</small><b><span class="t-long">${unit.title}</span><span class="t-short">Unidad ${num(ME)} – ${unit.short}</span></b></div><button type="button" class="fb-menu" id="fbMenu" aria-label="Abrir el temario"><span class="t-long">☰ Temario</span><span class="t-short" aria-hidden="true">☰</span></button>`;
  document.querySelector('header.top').after(bar);
  const dw=window.CURSO.drawer({id:'sylDrawer',title:'Temario – Teoría musical',html:temario(true),opener:bar.querySelector('#fbMenu')});
  dw.body.addEventListener('click',e=>{if(e.target.closest('a'))dw.close()});
  const paint=()=>{syl.innerHTML=temario(false);dw.body.innerHTML=temario(true);strip();bottom()};

  /* Tira de pasos (modo enfoque) */
  const stripEl=document.createElement('nav');stripEl.className='steps-strip';stripEl.setAttribute('aria-label','Lecciones de la unidad');stripEl.style.setProperty('--n',lessons.length);
  document.querySelector('main').prepend(stripEl);
  const strip=()=>{stripEl.innerHTML=lessons.map(l=>`<a href="#${l.id}" class="${l.id===curId?'on':''}${C.isSeen(ME,l.id)?' seen':''}"${l.id===curId?' aria-current="step"':''} aria-label="${l.k} ${l.title}"><i></i><span>${l.title}</span></a>`).join('')};

  /* Secciones: pestañas Ver / Leer / Practicar / Recursos (solo se ven en modo enfoque) */
  secs.forEach(s=>{
    const head=s.querySelector('.sec-head'),kids=[...s.children].filter(c=>c!==head&&!c.classList.contains('sec-body'));
    const body=document.createElement('div');body.className='sec-body';body.id='p-'+s.id;let prev=null;
    kids.forEach(k=>{k.dataset.tab=prev=tabOf(k,prev);body.appendChild(k)});
    const present=TABS.filter(([k])=>kids.some(c=>c.dataset.tab===k));
    let first=present.some(([k])=>k==='ver')?'ver':'leer';
    const leer=kids.filter(c=>c.dataset.tab==='leer');
    if(first==='leer'&&present.some(([k])=>k==='practicar')&&leer.length<=1&&leer.every(c=>c.textContent.trim().length<180))first='practicar';
    if(!present.some(([k])=>k===first))first=present[0]?present[0][0]:'leer';
    s.dataset.active=first;s.appendChild(body);
    if(present.length>1){
      const tl=document.createElement('div');tl.className='seg-tabs';tl.setAttribute('role','tablist');tl.setAttribute('aria-label','Contenido de la lección');
      tl.innerHTML=present.map(([k,t])=>`<button type="button" role="tab" id="t-${s.id}-${k}" data-t="${k}" aria-controls="p-${s.id}" aria-selected="${k===first}" tabindex="${k===first?0:-1}">${t}</button>`).join('');
      head.after(tl);body.setAttribute('role','tabpanel');body.setAttribute('aria-labelledby',`t-${s.id}-${first}`);
      const tabs=[...tl.querySelectorAll('button')];
      const set=(k,f)=>{s.dataset.active=k;tabs.forEach(b=>{const on=b.dataset.t===k;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;if(on&&f)b.focus()});body.setAttribute('aria-labelledby',`t-${s.id}-${k}`);window.dispatchEvent(new Event('resize'))};
      tabs.forEach((b,i)=>{b.onclick=()=>set(b.dataset.t);b.onkeydown=e=>{const j={ArrowRight:i+1,ArrowLeft:i-1,Home:0,End:tabs.length-1}[e.key];if(j==null)return;e.preventDefault();set(tabs[(j+tabs.length)%tabs.length].dataset.t,true)}});
    }
  });

  /* Navegación entre lecciones */
  const ref=l=>l.u===ME?`#${l.id}`:`${l.unit.file}#${l.id}`;
  const cur=()=>idxOf(curId),prevL=()=>all[cur()-1],nextL=()=>all[cur()+1];
  function complete(){
    C.markSeen(ME,curId);const n=nextL();
    if(!n||n.u!==ME)C.setDone(ME,true);
    document.dispatchEvent(new Event('av-progress'));
    if(!n){location.href='progreso.html';return}
    go(n);
  }
  function go(l){if(l.u!==ME){location.href=ref(l);return}try{history.pushState(null,'','#'+l.id)}catch(e){}show(l.id)}
  secs.forEach((s,i)=>{
    const f=document.createElement('div');f.className='lfoot';
    const p=all[idxOf(s.id)-1],n=all[idxOf(s.id)+1];
    f.innerHTML=`${p?`<a class="lprev" href="${ref(p)}">← ${p.k} ${p.title}</a>`:'<span></span>'}<button type="button" class="lnext">${n?(n.u===ME?'Completar y seguir →':'Completar unidad y seguir →'):'Completar el curso →'}</button>`;
    f.querySelector('.lnext').onclick=()=>{curId=s.id;complete()};
    s.appendChild(f)});

  /* Barra inferior (modo enfoque) */
  const bot=document.createElement('nav');bot.className='fbottom';bot.setAttribute('aria-label','Navegación de la lección');
  bot.innerHTML=`<a class="fb-prev" href="#"><span class="t-long">← Anterior</span><span class="t-short" aria-hidden="true">←</span></a><span class="fb-pos"></span><button type="button" class="fb-next"><span class="t-long"></span><span class="t-short"></span></button>`;
  document.body.appendChild(bot);
  const bp=bot.querySelector('.fb-prev'),bn=bot.querySelector('.fb-next');
  bn.onclick=complete;
  function bottom(){
    const p=prevL(),n=nextL(),i=lessons.findIndex(l=>l.id===curId);
    bp.setAttribute('aria-label',p?`Anterior: ${p.k} ${p.title}`:'Anterior');
    if(p){bp.href=ref(p);bp.removeAttribute('aria-disabled')}else{bp.removeAttribute('href');bp.setAttribute('aria-disabled','true')}
    bot.querySelector('.fb-pos').textContent=`Lección ${i+1} de ${lessons.length} – Unidad ${ME} de ${C.units.length}`;
    bn.querySelector('.t-long').textContent=n?'Siguiente →':'Terminar curso →';
    bn.querySelector('.t-short').textContent=n?`Siguiente: ${n.k} ${n.title} →`:'Terminar curso →';
    bn.setAttribute('aria-label',n?`Siguiente: ${n.k} ${n.title}`:'Terminar el curso');
  }

  /* Lección actual: hash, scroll (escritorio) y modo enfoque */
  function setCur(id,quiet){
    if(curId===id)return;curId=id;
    secs.forEach(s=>{s.classList.toggle('cur',s.id===id)});
    C.setLast(ME,id);
    if(!quiet){try{history.replaceState(null,'','#'+id)}catch(e){}}
    paint();
  }
  function show(id){
    setCur(id,true);const s=document.getElementById(id);
    if(focusMQ.matches){window.scrollTo(0,0);const h=s.querySelector('h2');h.tabIndex=-1;h.focus({preventScroll:true})}
    else s.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
  }
  const fromHash=()=>{const id=decodeURIComponent(location.hash.slice(1));return secs.some(s=>s.id===id)?id:null};
  window.addEventListener('hashchange',()=>{const id=fromHash();if(id)show(id)});
  document.addEventListener('av-progress',()=>paint());
  focusMQ.addEventListener&&focusMQ.addEventListener('change',()=>{const s=document.getElementById(curId);if(!focusMQ.matches&&s)s.scrollIntoView()});
  const h0=fromHash();curId=null;setCur(h0||secs[0].id,true);
  if(h0){const jump=()=>{if(focusMQ.matches)window.scrollTo(0,0);else document.getElementById(h0).scrollIntoView()};requestAnimationFrame(jump);window.addEventListener('load',jump,{once:true})}
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(focusMQ.matches)return;es.forEach(e=>{if(e.isIntersecting)setCur(e.target.id)})},{rootMargin:'-30% 0px -60% 0px'});secs.forEach(s=>io.observe(s))}
}
/* Carrusel: convierte los hijos de un contenedor en diapositivas */
function carousel(el,label){
  if(!el||el.dataset.car)return;const slides=[...el.children];if(slides.length<2)return;el.dataset.car='1';
  const N=slides.length,car=document.createElement('div');car.className='car';car.setAttribute('role','region');car.setAttribute('aria-roledescription','carrusel');car.setAttribute('aria-label',label||'Carrusel');
  const track=document.createElement('div');track.className='car-track';track.tabIndex=0;
  slides.forEach((s,i)=>{s.classList.add('car-slide');s.setAttribute('role','group');s.setAttribute('aria-roledescription','diapositiva');s.setAttribute('aria-label',`${i+1} de ${N}`);track.appendChild(s)});
  const chev=d=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const bar=document.createElement('div');bar.className='car-bar';
  bar.innerHTML=`<button type="button" class="ibtn" aria-label="Anterior">${chev('M15.4 6L9 12l6.4 6 1.4-1.4L11.8 12l5-4.6z')}</button><div class="car-dots">${slides.map((_,i)=>`<button type="button" class="car-dot" aria-label="Ir a ${i+1} de ${N}"></button>`).join('')}</div><span class="car-count" aria-hidden="true"></span><button type="button" class="ibtn" aria-label="Siguiente">${chev('M8.6 6L15 12l-6.4 6-1.4-1.4 5-4.6-5-4.6z')}</button>`;
  car.append(track,bar);el.className='car-host';el.appendChild(car);
  const [pv,nx]=bar.querySelectorAll('.ibtn'),dots=[...bar.querySelectorAll('.car-dot')],cnt=bar.querySelector('.car-count');
  const cur=()=>{let b=0,m=1e9;slides.forEach((s,i)=>{const d=Math.abs(s.offsetLeft-track.offsetLeft-track.scrollLeft);if(d<m){m=d;b=i}});return b};
  const upd=()=>{const i=cur();dots.forEach((d,j)=>j===i?d.setAttribute('aria-current','true'):d.removeAttribute('aria-current'));cnt.textContent=`${i+1} / ${N}`;pv.disabled=i===0;nx.disabled=i===N-1};
  const go=i=>{i=Math.max(0,Math.min(N-1,i));track.scrollTo({left:slides[i].offsetLeft-track.offsetLeft,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})};
  pv.onclick=()=>go(cur()-1);nx.onclick=()=>go(cur()+1);dots.forEach((d,i)=>d.onclick=()=>go(i));
  track.addEventListener('scroll',()=>{clearTimeout(track._t);track._t=setTimeout(upd,60)},{passive:true});
  track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(cur()+1)}else if(e.key==='ArrowLeft'){e.preventDefault();go(cur()-1)}});
  window.addEventListener('resize',upd);upd()}
/* Metrónomo simple con acento en el primer tiempo */
function metro({bpm,beats,onBeat}){let t=null,next=0,i=0;
  return{start(){const c=actx();if(!c)return;i=0;next=c.currentTime+.05;const sched=()=>{while(next<c.currentTime+.12){const b=i%beats(),acc=b===0,when=next,o=c.createOscillator(),g=c.createGain();o.frequency.value=acc?1500:1000;g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(acc?.5:.3,when+.003);g.gain.exponentialRampToValueAtTime(.0001,when+.06);o.connect(g);g.connect(master);o.start(when);o.stop(when+.08);
      const idx=b,delay=Math.max(0,(when-c.currentTime)*1000);setTimeout(()=>onBeat&&onBeat(idx),delay);next+=60/bpm();i++}};sched();t=setInterval(sched,25)},
    stop(){clearInterval(t);t=null},get on(){return t!=null}}}
const ICON_PAUSE='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
let src=null;const _note=note,_stop=stopAll;
note=function(abs,when,dur,amp){_note(abs,when,dur,amp);if(ac)hold(when-ac.currentTime+dur)};
function hold(s){if(src)src._hold=Math.max(src._hold||0,s)}
function reg(g,oscs,end){voices=voices.filter(v=>v.end>ac.currentTime);voices.push({g,oscs,end})}
function setPlaying(b,on){
  if(on){if(!b.classList.contains('playing')){b._ico=b.innerHTML;b._lab=b.getAttribute('aria-label');b._tit=b.title}b.innerHTML=ICON_PAUSE;b.classList.add('playing');b.setAttribute('aria-label','Detener');b.title='Detener';if(b.hasAttribute('data-toggle'))b.setAttribute('aria-pressed','true')}
  else{if(!b.classList.contains('playing'))return;b.innerHTML=b._ico;b.classList.remove('playing');b.setAttribute('aria-label',b._lab);b.title=b._tit||b._lab;if(b.hasAttribute('data-toggle'))b.setAttribute('aria-pressed','false')}}
function endPlay(b){clearTimeout(b._t);const f=b._end;b._end=null;setPlaying(b,false);if(f)f()}
function startPlay(b,sec){clearTimeout(b._t);setPlaying(b,true);b._t=setTimeout(()=>endPlay(b),sec*1000+60)}
stopAll=function(){_stop();document.querySelectorAll('.ibtn.playing:not([data-toggle])').forEach(endPlay)};
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.ibtn.solid');if(!b||b.disabled||b.hasAttribute('data-toggle'))return;
  if(b.classList.contains('playing')&&!b.hasAttribute('data-restart')){e.stopImmediatePropagation();e.preventDefault();stopAll();endPlay(b);return}
  src=b;b._hold=0;setTimeout(()=>{if(src===b)src=null},0)},true);
document.addEventListener('click',()=>{const b=src;if(!b)return;src=null;if(b._hold>0)startPlay(b,b._hold)});
const ksCache=new Map();
function ksBuffer(freq){const key=freq.toFixed(2);if(ksCache.has(key))return ksCache.get(key);
  const sr=ac.sampleRate,len=Math.floor(sr*2.6),buf=ac.createBuffer(1,len,sr),d=buf.getChannelData(0),N=Math.max(3,Math.round(sr/freq)),ring=new Float32Array(N);
  // soft excitation: smoothed noise, like a fingertip on nylon
  let lp=0;for(let i=0;i<N;i++){lp+=0.35*((Math.random()*2-1)-lp);ring[i]=lp}
  for(let pass=0;pass<2;pass++)for(let i=0;i<N;i++)ring[i]=0.5*(ring[i]+ring[(i+1)%N]);
  const damp=Math.min(.99995,Math.pow(.84,1/freq)/(.5+.5*Math.cos(2*Math.PI/N)));let idx=0,peak=0;
  for(let i=0;i<len;i++){const p=(idx+N-1)%N,nx=(idx+1)%N,v=ring[idx];d[i]=v;ring[idx]=damp*(0.25*ring[p]+0.5*v+0.25*ring[nx]);idx=nx;const a=Math.abs(v);if(a>peak)peak=a}
  const atk=Math.floor(sr*.004);for(let i=0;i<len;i++){d[i]/=peak||1;if(i<atk)d[i]*=i/atk}
  ksCache.set(key,buf);return buf}
let gBus=null;
function guitarBus(){if(gBus)return gBus;const c=ac;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2200;lp.Q.value=0.5;
  const body=c.createBiquadFilter();body.type='peaking';body.frequency.value=180;body.Q.value=1.2;body.gain.value=4;
  const air=c.createBiquadFilter();air.type='highshelf';air.frequency.value=3500;air.gain.value=-6;
  lp.connect(body);body.connect(air);air.connect(master);gBus=lp;return gBus}
function pluck(midi,when,amp){const c=actx();if(!c)return;U.hold(when-c.currentTime+2.6);const f=440*Math.pow(2,(midi-69)/12);
  const src=c.createBufferSource();src.buffer=ksBuffer(f);const g=c.createGain();
  g.gain.setValueAtTime(amp,when);g.gain.setTargetAtTime(amp*.55,when+.05,.6);src.connect(g);g.connect(guitarBus());src.start(when);src.stop(when+2.6);
  voices=voices.filter(v=>v.end>c.currentTime);voices.push({g,oscs:[src],end:when+2.6})}

const OPEN_MIDI=[40,45,50,55,59,64];
const _pluck=pluck;pluck=function(m,w,a){_pluck(m,w,a);if(ac)hold(w-ac.currentTime+2.6)};
/* Diapasón de guitarra interactivo.
   marks: Map(pc -> {label, root}) para mostrar solo esas notas; null = todas.
   blank: círculos vacíos (para prácticas); labelFn: transforma el nombre mostrado.
   Devuelve {svg, setPcs(Map pc->{root}), setPicked(Set midi)} para resaltar sin reconstruir. */
function fretboard(host,{frets=12,flat=false,marks=null,onPlay=null,label='Diapasón de la guitarra',blank=false,labelFn=null}={}){
  const X0=46,FW=48,Y0=34,RH=30,W=X0+frets*FW+14,H=Y0+5*RH+40,SHn=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],FLn=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
  const svg=svgEl('svg',{viewBox:`0 0 ${W} ${H}`,role:'group','aria-label':`${label}. Seis cuerdas y ${frets} trastes. Flechas para moverte, Enter para tocar una nota.`});
  svg.style.minWidth=(frets*38+60)+'px';
  const xf=f=>f===0?X0/2-3:X0+(f-.5)*FW,yr=r=>Y0+r*RH,mono='Instrument Sans, sans-serif',fmt=labelFn||pretty;
  [3,5,7,9].forEach(f=>svg.appendChild(svgEl('circle',{cx:xf(f),cy:yr(2.5),r:7,fill:'var(--line)'})));
  if(frets>=12)[1.5,3.5].forEach(k=>svg.appendChild(svgEl('circle',{cx:xf(12),cy:yr(k),r:7,fill:'var(--line)'})));
  for(let k=1;k<=frets;k++)svg.appendChild(svgEl('line',{x1:X0+k*FW,y1:yr(0)-6,x2:X0+k*FW,y2:yr(5)+6,stroke:'var(--line-strong)','stroke-width':1.4}));
  svg.appendChild(svgEl('rect',{x:X0-3,y:yr(0)-6,width:5,height:5*RH+12,fill:'var(--ink)'}));
  for(let r=0;r<6;r++)svg.appendChild(svgEl('line',{x1:6,y1:yr(r),x2:W-8,y2:yr(r),stroke:'var(--muted)','stroke-width':[1,1.2,1.6,2,2.4,2.8][r]}));
  for(let f=0;f<=frets;f++)svg.appendChild(svgEl('text',{x:xf(f),y:yr(5)+32,'text-anchor':'middle','font-size':12,'font-family':mono,fill:'var(--muted)'},f===0?'0':String(f)));
  const KINDS={root:['var(--violet)','var(--violet)','var(--on-navy)'],nav:['var(--navy)','var(--navy)','var(--on-navy)'],alt:['var(--navy-soft)','var(--navy)','var(--navy)'],plain:['var(--bg)','var(--navy)','var(--navy)'],blank:['var(--bg)','var(--line-strong)','var(--navy)']};
  const hl=new Map(),picked=new Set(),cells=[],grid=[];let first=null,rootMidi=null;
  function paint(c){const h=hl.get(c.pc),pk=picked.has(c.midi);let k=c.base;if(h)k=h.root?'root':'nav';if(pk)k=c.midi===rootMidi?'root':'nav';const [f,s,t]=KINDS[k],show=!blank||k!=='blank';
    c.circ.setAttribute('fill',f);c.circ.setAttribute('stroke',s);c.txt.setAttribute('fill',t);c.txt.textContent=show?c.pn:''}
  for(let r=0;r<6;r++){grid[r]=[];for(let f=0;f<=frets;f++){const midi=OPEN_MIDI[5-r]+f,pc=midi%12,m=marks&&marks.get(pc);if(marks&&!m){grid[r][f]=null;continue}
    const name=m?m.label:(flat?FLn:SHn)[pc],alt=!m&&name.length>1,pn=m?pretty(name):fmt(name);
    const g=svgEl('g',{class:'fb',role:'button',tabindex:'-1','aria-label':`Cuerda ${r+1}, ${f===0?'al aire':'traste '+f}${blank?'':', '+pn}`});
    g.appendChild(svgEl('rect',{x:f===0?2:X0+(f-1)*FW,y:yr(r)-RH/2,width:f===0?X0-6:FW,height:RH,fill:'transparent',style:'cursor:pointer'}));
    const circ=svgEl('circle',{cx:xf(f),cy:yr(r),r:11,'stroke-width':1.6}),txt=svgEl('text',{x:xf(f),y:yr(r)+3.5,'text-anchor':'middle','font-size':pn.length>2?8.5:10.5,'font-weight':700,'font-family':mono,'pointer-events':'none'},'');
    g.append(circ,txt);
    const c={g,circ,txt,midi,pc,pn,base:blank?'blank':m?(m.root?'root':'nav'):alt?'alt':'plain'};paint(c);cells.push(c);
    const play=()=>{const ctx=actx();if(!ctx)return;pluck(midi,ctx.currentTime+.01,.3);g.classList.add('hit');clearTimeout(g._h);g._h=setTimeout(()=>g.classList.remove('hit'),650);if(onPlay)onPlay({r,f,midi,pc,name:pn})};
    g.addEventListener('click',play);g._play=play;svg.appendChild(g);grid[r][f]=g;if(!first)first=g}}
  if(first)first.setAttribute('tabindex','0');
  svg.addEventListener('keydown',e=>{const t=e.target.closest&&e.target.closest('.fb');if(!t)return;let r=-1,f=-1;grid.forEach((row,i)=>row.forEach((c,j)=>{if(c===t){r=i;f=j}}));
    const d={ArrowRight:[0,1],ArrowLeft:[0,-1],ArrowUp:[-1,0],ArrowDown:[1,0]}[e.key];
    if(d){e.preventDefault();let a=r+d[0],b=f+d[1];while(a>=0&&a<6&&b>=0&&b<=frets&&!grid[a][b]){a+=d[0];b+=d[1]}if(a>=0&&a<6&&b>=0&&b<=frets&&grid[a][b]){t.setAttribute('tabindex','-1');grid[a][b].setAttribute('tabindex','0');grid[a][b].focus()}}
    else if(e.key==='Enter'||e.key===' '){e.preventDefault();t._play()}});
  const box=document.createElement('div');box.className='fb-scroll';box.appendChild(svg);const hint=document.createElement('p');hint.className='cap';hint.hidden=true;hint.textContent='Desliza para ver todos los trastes →';
  host.innerHTML='';host.append(box,hint);const upd=()=>{hint.hidden=!(box.scrollWidth>box.clientWidth+2)};requestAnimationFrame(upd);window.addEventListener('resize',upd);
  return{svg,setPcs(m){hl.clear();if(m)m.forEach((v,k)=>hl.set(k,v));cells.forEach(paint)},setPicked(s,r){rootMidi=r==null?null:r;picked.clear();if(s)s.forEach(x=>picked.add(x));cells.forEach(paint)}}}
window.U={header:n=>window.CURSO&&window.CURSO.header(n),fretboard,pluck,OPEN_MIDI,setPlaying,hold,reg,carousel,store,$,svgEl,keyboard,actx,note,playSet,stopAll,out:()=>{actx();return master},LET,LPC,nm,ES,esName,pretty,parseNote,scale,triads,ROMAN,DEG_NAMES,shuffle,pick,rnd,R12S,mcq,keyQuiz,course,metro,ICON_SPK,ACC};
})();
