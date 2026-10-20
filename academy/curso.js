/* Datos y progreso compartidos del curso. Una sola fuente para el índice y todas las unidades.
   Al publicar una unidad nueva, cambia su `ready` a true. */
(function(){
const UNITS=[
  {n:1,short:'Teoría',title:'Teoría musical',file:'unidad-01-teoria-musical.html',ready:true},
  {n:2,short:'Notas',title:'Notas musicales',file:'unidad-02-notas-musicales.html',ready:true},
  {n:3,short:'Ritmo',title:'Rítmica y métrica',file:'unidad-03-ritmica-y-metrica.html',ready:true},
  {n:4,short:'Tonos',title:'Tonos y semitonos',file:'unidad-04-tonos-y-semitonos.html',ready:true},
  {n:5,short:'Escalas',title:'Escalas',file:'unidad-05-escalas.html',ready:true},
  {n:6,short:'Acordes',title:'Acordes e inversiones',file:'unidad-06-acordes.html',ready:true},
  {n:7,short:'Transposición',title:'Transposiciones',file:'unidad-07-transposiciones.html',ready:true}
];
const KEY='av-curso-done';
function read(){try{const v=JSON.parse(localStorage.getItem(KEY));return Array.isArray(v)?v:[]}catch(e){return[]}}
function write(a){try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}}
window.CURSO={
  units:UNITS,
  unit:n=>UNITS.find(u=>u.n===n),
  done:()=>read(),
  isDone:n=>read().includes(n),
  setDone(n,on){const a=read().filter(x=>x!==n);if(on)a.push(n);write(a.sort((x,y)=>x-y))},
  reset(){write([])}
};
})();
