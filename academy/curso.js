/* Datos y progreso compartidos del curso. Una sola fuente para el índice, Mi progreso y todas las unidades.
   Al publicar una unidad nueva, cambia su `ready` a true. `lessons` debe coincidir con los .sec-head de cada HTML. */
(function(){
const UNITS=[
  {n:1,short:'Teoría',title:'Teoría musical',file:'unidad-01-teoria-musical.html',ready:true,lessons:[
    {id:'sonido',k:'1.1',title:'Sonido y ruido',lvl:1},
    {id:'propiedades',k:'1.2',title:'Propiedades del sonido',lvl:1},
    {id:'musica',k:'1.3',title:'Qué es la música',lvl:1},
    {id:'pulso',k:'1.4',title:'Pulso y tempo',lvl:1},
    {id:'practica',k:'1.5',title:'Práctica',lvl:1}]},
  {n:2,short:'Notas',title:'Notas musicales',file:'unidad-02-notas-musicales.html',ready:true,lessons:[
    {id:'doce',k:'2.1',title:'Los doce sonidos',lvl:1},
    {id:'cifrado',k:'2.2',title:'Cifrado americano',lvl:1},
    {id:'lectura',k:'2.3',title:'Lee un cifrado',lvl:2},
    {id:'digitacion',k:'2.4',title:'Digitación en el piano',lvl:1},
    {id:'practica',k:'2.5',title:'Práctica',lvl:1}]},
  {n:3,short:'Ritmo',title:'Rítmica y métrica',file:'unidad-03-ritmica-y-metrica.html',ready:true,lessons:[
    {id:'pentagrama',k:'3.1',title:'El pentagrama',lvl:1},
    {id:'figuras',k:'3.2',title:'Figuras rítmicas',lvl:1},
    {id:'claves',k:'3.3',title:'Las claves',lvl:2},
    {id:'compas',k:'3.4',title:'El compás',lvl:2},
    {id:'ligadura',k:'3.5',title:'La ligadura',lvl:2},
    {id:'practica',k:'3.6',title:'Práctica',lvl:2}]},
  {n:4,short:'Tonos',title:'Tonos y semitonos',file:'unidad-04-tonos-y-semitonos.html',ready:true,lessons:[
    {id:'semitono',k:'4.1',title:'El semitono y el tono',lvl:1},
    {id:'distancias',k:'4.2',title:'Medir distancias',lvl:2},
    {id:'alteraciones',k:'4.3',title:'Sostenidos, bemoles y becuadros',lvl:1},
    {id:'practica',k:'4.4',title:'Práctica',lvl:2}]},
  {n:5,short:'Escalas',title:'Escalas',file:'unidad-05-escalas.html',ready:true,lessons:[
    {id:'intervalos',k:'5.1',title:'Intervalos',lvl:2},
    {id:'mayores',k:'5.2',title:'Escalas mayores',lvl:2},
    {id:'menores',k:'5.3',title:'Escalas menores',lvl:2},
    {id:'laboratorio',k:'5.4',title:'Laboratorio de escalas',lvl:2},
    {id:'practica',k:'5.5',title:'Práctica',lvl:3}]},
  {n:6,short:'Acordes',title:'Acordes e inversiones',file:'unidad-06-acordes.html',ready:true,lessons:[
    {id:'que-es',k:'6.1',title:'Qué es un acorde',lvl:1},
    {id:'laboratorio',k:'6.2',title:'Laboratorio de acordes',lvl:2},
    {id:'inversiones',k:'6.3',title:'Inversiones',lvl:2},
    {id:'practica',k:'6.4',title:'Práctica',lvl:3}]},
  {n:7,short:'Transposición',title:'Transposiciones',file:'unidad-07-transposiciones.html',ready:true,lessons:[
    {id:'por-que',k:'7.1',title:'Qué es transportar',lvl:2},
    {id:'circulo',k:'7.2',title:'Círculo de quintas',lvl:3},
    {id:'grados',k:'7.3',title:'Grados y acordes de una tonalidad',lvl:3},
    {id:'transponer',k:'7.4',title:'Transponer una canción',lvl:3},
    {id:'practica',k:'7.5',title:'Práctica',lvl:3}]}
];
const COURSES=[
  {id:'teoria',name:'Teoría musical',short:'T',hue:265,meta:'Para todos los instrumentos',img:'portada-teoria.jpg',ready:true,units:UNITS},
  {id:'guitarra',name:'Guitarra',short:'G',hue:45,meta:'Desde cero',ready:false,units:[]},
  {id:'piano',name:'Piano',short:'P',hue:310,meta:'Desde cero',ready:false,units:[]},
  {id:'voz',name:'Voz',short:'V',hue:0,meta:'Desde cero',ready:false,units:[]},
  {id:'bajo',name:'Bajo',short:'B',hue:175,meta:'En preparación',ready:false,units:[]},
  {id:'bateria',name:'Batería',short:'B',hue:85,meta:'En preparación',ready:false,units:[]}
];
const LEVELS=['','Básico','Intermedio','Avanzado'];
/* Nivel de una unidad: el que más se repite entre sus lecciones (en empate, el más alto) */
function unitLevel(u){const c=[0,0,0,0];u.lessons.forEach(l=>c[l.lvl]++);let b=1;for(let i=1;i<=3;i++)if(c[i]>=c[b])b=i;return b}
UNITS.forEach(u=>{u.lvl=unitLevel(u)});
const KEY='av-curso-done',SEEN='av-lecciones-vistas',LAST='av-ultima-leccion';
function load(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
const doneRaw=()=>{const v=load(KEY,[]);return Array.isArray(v)?v:[]};
const seenAll=()=>{const v=load(SEEN,{});return v&&typeof v==='object'&&!Array.isArray(v)?v:{}};
const unit=n=>UNITS.find(u=>u.n===n);
const seen=n=>{const a=seenAll()[n];return Array.isArray(a)?a:[]};
const seenCount=n=>{const u=unit(n);return u?u.lessons.filter(l=>seen(n).includes(l.id)).length:0};
const isDone=n=>{const u=unit(n);return doneRaw().includes(n)||!!(u&&u.lessons.length&&seenCount(n)===u.lessons.length)};
/* Todas las lecciones, en orden de lectura */
const flat=()=>UNITS.filter(u=>u.ready).flatMap(u=>u.lessons.map(l=>({...l,u:u.n,unit:u})));
const find=(n,id)=>flat().find(x=>x.u===n&&x.id===id);
/* Lección a retomar: la última visitada o la primera no vista; null si no hay nada pendiente */
function resume(){
  const all=flat(),last=load(LAST,null),started=Object.keys(seenAll()).length>0||!!last;
  const at=l=>l?all.findIndex(x=>x.u===l.u&&x.id===l.id):-1,unseen=x=>!seen(x.u).includes(x.id);
  let i=last?at(last):-1,cur=i>=0?all[i]:null;
  if(!cur||!unseen(cur)){cur=all.slice(i+1).find(unseen)||all.find(unseen)||null;i=at(cur&&{u:cur.u,id:cur.id})}
  return{lesson:cur,next:cur?all[i+1]||null:null,started};
}
/* Panel deslizable accesible: foco atrapado, Esc, velo y retorno del foco al botón */
function drawer({id,title,html,opener}){
  const veil=document.createElement('div');veil.className='veil';veil.hidden=true;
  const el=document.createElement('aside');el.className='drawer';el.id=id;el.hidden=true;el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label',title);
  el.innerHTML=`<div class="drawer-head"><h2>${title}</h2><button type="button" class="drawer-x" aria-label="Cerrar">×</button></div><div class="drawer-body">${html}</div>`;
  document.body.append(veil,el);
  const reduce=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
  const focusables=()=>[...el.querySelectorAll('a[href],button:not([disabled])')];
  function open(){if(!el.hidden)return;veil.hidden=false;el.hidden=false;void el.offsetWidth;veil.classList.add('open');el.classList.add('open');document.body.classList.add('drawer-on');
    if(opener)opener.setAttribute('aria-expanded','true');const f=el.querySelector('[aria-current]')||el.querySelector('.drawer-x');f.focus({preventScroll:true});document.addEventListener('keydown',key)}
  function close(){if(el.hidden)return;veil.classList.remove('open');el.classList.remove('open');document.body.classList.remove('drawer-on');document.removeEventListener('keydown',key);
    if(opener){opener.setAttribute('aria-expanded','false');opener.focus()}
    const fin=()=>{veil.hidden=true;el.hidden=true};reduce()?fin():setTimeout(fin,230)}
  function key(e){if(e.key==='Escape'){e.preventDefault();close()}else if(e.key==='Tab'){const f=focusables();if(!f.length)return;const a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}else if(!el.contains(document.activeElement)){e.preventDefault();a.focus()}}}
  veil.onclick=close;el.querySelector('.drawer-x').onclick=close;
  if(opener){opener.setAttribute('aria-controls',id);opener.setAttribute('aria-expanded','false');opener.addEventListener('click',()=>el.hidden?open():close())}
  return{open,close,el,body:el.querySelector('.drawer-body')};
}
const NAV=[['inicio','Inicio','index.html'],['cursos','Cursos','index.html#cursos'],['progreso','Mi progreso','progreso.html']];
/* Header compacto: activo = 'inicio' | 'cursos' | 'progreso'. Se inyecta en <header class="top"> */
function header(active){
  const host=document.querySelector('header.top');if(!host||host.dataset.w)return;host.dataset.w='1';
  const links=()=>NAV.map(([k,t,h])=>`<a href="${h}"${k===active?' aria-current="page"':''}>${t}</a>`).join('');
  host.innerHTML=`<div class="hd"><a class="hd-brand" href="index.html"><img alt="" src="logo.png"><span>Academia de Música</span></a><nav class="hd-nav" aria-label="Principal">${links()}</nav><button type="button" class="hd-menu" id="hdMenu" aria-label="Abrir el menú"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg></button></div>`;
  drawer({id:'navDrawer',title:'Menú',html:`<nav class="drawer-nav" aria-label="Principal">${links()}</nav>`,opener:host.querySelector('#hdMenu')});
}
window.CURSO={
  levels:LEVELS,
  header,drawer,
  units:UNITS,courses:COURSES,
  unit,
  done:()=>UNITS.filter(u=>isDone(u.n)).map(u=>u.n),
  isDone,
  setDone(n,on){const a=doneRaw().filter(x=>x!==n);if(on)a.push(n);save(KEY,a.sort((x,y)=>x-y));
    if(!on){const s=seenAll();delete s[n];save(SEEN,s)}},
  seen,seenCount,flat,find,resume,
  isSeen:(n,id)=>seen(n).includes(id),
  markSeen(n,id){const s=seenAll(),a=seen(n);if(!a.includes(id)){a.push(id);s[n]=a;save(SEEN,s)}},
  setLast(n,id){save(LAST,{u:n,id})},
  reset(){save(KEY,[]);save(SEEN,{});try{localStorage.removeItem(LAST)}catch(e){}}
};
})();
