(function(){
const LW=window.TM_LW,LC=window.TM_LC;
const D=window.TM_DATA||{hoteles:[],paquetes:[],tours:[],autos:[],config:{}};
const C=Object.assign({wa:"584125805433",rif:"J-41302545-0",rtn:"21403",ttt:"TTT-840"},D.config||{});
window.TM={LW,LC,D,C};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const MES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const M3=MES.map(m=>m.slice(0,3));
const fmt=d=>d?`${d.getDate()} ${M3[d.getMonth()]} ${d.getFullYear()}`:"";
const day0=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate());
const same=(a,b)=>a&&b&&a.getTime()===b.getTime();
const I={
 bed:'<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8M2 17h20M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/>',
 mount:'<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
 waves:'<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
 coffee:'<path d="M10 2v2M14 2v2M6 2v2M6 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8zM18 10h1a3 3 0 0 1 0 6h-1"/>',
 car:'<path d="M5 17h14M3 17v-4l2-5h14l2 5v4M7 17v2M17 17v2M3 13h18"/>',
 compass:'<circle cx="12" cy="12" r="10"/><path d="m16 8-2 6-6 2 2-6z"/>',
 chev:'<path d="m6 9 6 6 6-6"/>',l:'<path d="m15 18-6-6 6-6"/>',r:'<path d="m9 18 6-6-6-6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'
};
const svg=k=>`<svg viewBox="0 0 24 24">${I[k]}</svg>`;
const SCENES={hoteles:["bed","mount","waves","coffee"],paquetes:["mount","compass","waves","mount"],tours:["compass","mount","waves","compass"],autos:["car","car","compass","car"]};
const WA='<svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2z"/></svg>';
/* ---------- chrome ---------- */
function chrome(cur){
 document.body.insertAdjacentHTML("afterbegin",'<div class="texture"></div>');
 document.body.insertBefore(TM_renderHeader(cur,"../"),document.body.children[1]);
 document.body.insertAdjacentHTML("beforeend",footerHTML());
}
window.TM.footerHTML=footerHTML;
function footerHTML(){return `<footer class="ftr"><div class="ftr-in"><img src="${LW}" alt="TransfersMérida"><p>Traslados · Hoteles · Paquetes · Tours · Rent a Car · Agencia<br>El Vigía, Mérida, Venezuela</p><div class="legal"><span><b>RIF</b>${esc(C.rif)}</span><span><b>RTN</b>${esc(C.rtn)}</span><span><b>Licencia de Turismo</b>${esc(C.ttt)}</span></div><small>© ${new Date().getFullYear()} TransfersMérida. Todos los derechos reservados.</small></div></footer>`}
/* ---------- date picker ---------- */
const DP=(()=>{
 let el,scrim,st=null,view,hover=null;
 function build(){
  scrim=document.createElement("div");scrim.className="scrim";
  el=document.createElement("div");el.className="dp";el.setAttribute("role","dialog");el.setAttribute("aria-label","Seleccionar fecha");
  document.body.append(scrim,el);
  scrim.addEventListener("click",close);
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&st)close()});
  document.addEventListener("pointerdown",e=>{if(st&&!el.contains(e.target)&&!e.target.closest(".fld"))close()});
  window.addEventListener("resize",()=>st&&place());
 }
 function place(){
  if(innerWidth<=640)return;
  const r=st.anchor.getBoundingClientRect(),w=326,h=el.offsetHeight||380;
  let l=Math.min(Math.max(10,r.left),innerWidth-w-10),t=r.bottom+8;
  if(t+h>innerHeight-10)t=Math.max(10,r.top-h-8);
  el.style.left=l+"px";el.style.top=t+"px";
 }
 function render(){
  const y=view.getFullYear(),m=view.getMonth(),today=day0(new Date());
  const first=new Date(y,m,1),off=(first.getDay()+6)%7,n=new Date(y,m+1,0).getDate();
  const {a,b,mode}=st.val;let h=`<div class="dp-h"><button data-n="-1" aria-label="Mes anterior"${new Date(y,m,0)<today?" disabled":""}>${svg("l")}</button><strong>${MES[m]} ${y}</strong><button data-n="1" aria-label="Mes siguiente">${svg("r")}</button></div><div class="dp-g">`;
  ["L","M","X","J","V","S","D"].forEach(d=>h+=`<div class="wd">${d}</div>`);
  for(let i=0;i<off;i++)h+="<span></span>";
  const end=b||(a&&hover&&hover>a?hover:null);
  for(let d=1;d<=n;d++){
   const dt=new Date(y,m,d),c=[];
   const dis=dt<today||(st.min&&dt<st.min);
   if(same(dt,today))c.push("today");
   if(a&&same(dt,a))c.push("s");
   if(mode==="range"&&end&&same(dt,end))c.push("e");
   if(mode==="range"&&a&&end&&dt>a&&dt<end)c.push("rng");
   if(mode==="range"&&a&&end&&(same(dt,a)||same(dt,end)))c.push("rng2");
   h+=`<button type="button" data-d="${y}-${m}-${d}" class="${c.join(" ")}"${dis?" disabled":""}>${d}</button>`;
  }
  h+=`</div><div class="dp-f"><span>${sum()}</span><div class="acts"><button class="clr" data-act="clr">Limpiar</button><button class="ok" data-act="ok">Listo</button></div></div>`;
  el.innerHTML=h;
 }
 function sum(){const {a,b,mode}=st.val;if(!a)return mode==="range"?"Elige la fecha de "+st.labels[0].toLowerCase():"Elige una fecha";if(mode==="single")return fmt(a);if(!b)return fmt(a)+" → elige "+st.labels[1].toLowerCase();const n=Math.round((b-a)/864e5);return `${n} ${st.unit}${n>1?"s":""} · ${fmt(a)} – ${fmt(b)}`}
 function pick(d){
  const v=st.val;
  if(v.mode==="single"){v.a=d;}
  else if(!v.a||(v.a&&v.b)){v.a=d;v.b=null;}
  else if(d>v.a){v.b=d;}
  else if(same(d,v.a)){return}
  else{v.a=d;}
  st.onChange(v);hover=null;render();
  if((v.mode==="single")||(v.mode==="range"&&v.b))setTimeout(()=>{if(st)close()},380);
 }
 function open(opts){
  if(!el)build();
  if(st&&st.anchor===opts.anchor&&el.classList.contains("on")){return}
  st=opts;const v=st.val;view=new Date((v.a||new Date()).getFullYear(),(v.a||new Date()).getMonth(),1);hover=null;
  render();el.classList.add("on");if(innerWidth<=640)scrim.classList.add("on");
  $$(".fld.act").forEach(f=>f.classList.remove("act"));opts.anchor.classList.add("act");
  requestAnimationFrame(place);
 }
 function close(){if(!el)return;el.classList.remove("on");scrim.classList.remove("on");$$(".fld.act").forEach(f=>f.classList.remove("act"));st&&st.onClose&&st.onClose();st=null}
 function ensure(){if(!el)build()}
 ensure&&document.addEventListener("DOMContentLoaded",()=>{ensure();
  el.addEventListener("click",e=>{
   const n=e.target.closest("[data-n]"),d=e.target.closest("[data-d]"),a=e.target.closest("[data-act]");
   if(n){view=new Date(view.getFullYear(),view.getMonth()+ +n.dataset.n,1);render()}
   else if(d&&!d.disabled){const[y,m,dd]=d.dataset.d.split("-").map(Number);pick(new Date(y,m,dd))}
   else if(a){if(a.dataset.act==="clr"){st.val.a=null;st.val.b=null;st.onChange(st.val);render()}else close()}
  });
  el.addEventListener("pointerover",e=>{const d=e.target.closest("[data-d]");if(d&&st&&st.val.mode==="range"&&st.val.a&&!st.val.b&&!d.disabled){const[y,m,dd]=d.dataset.d.split("-").map(Number);const nh=new Date(y,m,dd);if(!same(nh,hover)){hover=nh;render2()}}});
 });
 function render2(){ // light refresh of range classes only
  const keep=el.scrollTop;render();el.scrollTop=keep;
 }
 return{open,close};
})();
/* ---------- visor de fotos a pantalla completa ---------- */
const LB=(()=>{
 let el,imgs=[],k=0,x0=null;
 function build(){
  el=document.createElement("div");el.className="lb";
  el.innerHTML='<button class="lb-x" aria-label="Cerrar">&times;</button><button class="lb-a l" aria-label="Anterior">'+svg("l")+'</button><div class="lb-st"><img alt=""><video controls playsinline loop></video></div><button class="lb-a r" aria-label="Siguiente">'+svg("r")+'</button><div class="lb-c"></div>';
  document.body.append(el);
  el.querySelector(".lb-x").onclick=close;el.querySelector(".l").onclick=()=>show(k-1);el.querySelector(".r").onclick=()=>show(k+1);
  el.addEventListener("click",e=>{if(e.target===el||e.target.classList.contains("lb-st"))close()});
  el.addEventListener("pointerdown",e=>{x0=e.clientX});
  el.addEventListener("pointerup",e=>{if(x0==null)return;const d=e.clientX-x0;x0=null;if(Math.abs(d)>50)show(k+(d<0?1:-1))});
  document.addEventListener("keydown",e=>{if(!el.classList.contains("on"))return;if(e.key==="Escape")close();if(e.key==="ArrowLeft")show(k-1);if(e.key==="ArrowRight")show(k+1)});
 }
 function show(n){k=(n+imgs.length)%imgs.length;const isV=/\.(mp4|webm|mov)(\?|#|$)/i.test(imgs[k]),im=el.querySelector("img"),vd=el.querySelector("video");vd.pause();if(isV){im.style.display="none";vd.style.display="block";vd.src=imgs[k];vd.muted=false;vd.play().catch(()=>{vd.muted=true;vd.play().catch(()=>{})})}else{vd.style.display="none";vd.removeAttribute("src");vd.load();im.style.display="block";im.src=imgs[k]}el.querySelector(".lb-c").textContent=(k+1)+" / "+imgs.length;el.classList.toggle("one",imgs.length<2)}
 function open(list,start){if(!list.length)return;if(!el)build();imgs=list;show(start||0);el.classList.add("on");document.documentElement.style.overflow="hidden"}
 function close(){if(el){el.classList.remove("on");const v=el.querySelector("video");v.pause()}document.documentElement.style.overflow=""}
 return{open};
})();
/* ---------- slider ---------- */
function slider(photos,kind,name,idx,video){
 const sc=SCENES[kind];
 const vl=(Array.isArray(video)?video:video?[video]:[]).filter(Boolean);
 if(vl.length){const ph=(photos||[]).filter(p=>typeof p==="string"),poster=ph[0]?` poster="${esc(ph[0])}"`:"",many=vl.length>1;return `<div class="slider vid" data-n="${vl.length}" data-lb="${esc(JSON.stringify([...vl,...ph]))}">${vl.map((v,k)=>`<div class="sl"><video src="${esc(v)}"${poster} ${k===0?"autoplay ":""}muted ${many?"":"loop "}playsinline preload="${k===0?"auto":"metadata"}" aria-label="${esc(name)} video ${k+1}"></video></div>`).join("")}<button class="arw l" aria-label="Anterior">${svg("l")}</button><button class="arw r" aria-label="Siguiente">${svg("r")}</button><div class="dots">${vl.map((_,k)=>`<button aria-label="Video ${k+1}"></button>`).join("")}</div></div>`}
 const slides=(photos&&photos.length?photos:[0,1,2,3]).map((p,i)=>typeof p==="string"?`<div class="sl"><img src="${esc(p)}" alt="${esc(name)} foto ${i+1}" loading="lazy" onerror="this.parentNode.innerHTML='<div class=&quot;ph p${i%4}&quot;>'+TM.ico('${sc[i%4]}')+'</div>'"></div>`:`<div class="sl"><div class="ph p${i%4}">${svg(sc[i%4])}<small>${esc(name)}</small></div></div>`);
 const n=slides.length;
 return `<div class="slider" data-n="${n}">${slides.join("")}<button class="arw l" aria-label="Anterior">${svg("l")}</button><button class="arw r" aria-label="Siguiente">${svg("r")}</button><div class="dots">${slides.map((_,i)=>`<button aria-label="Foto ${i+1}"></button>`).join("")}</div></div>`;
}
window.TM.ico=svg;
function initSlider(s,delay){
 const sl=$$(".sl",s),dots=$$(".dots button",s),n=sl.length;let i=0,t=null,vis=true,hov=false;const vids=$$("video",s);
 const go=k=>{i=(k+n)%n;sl.forEach((x,j)=>x.classList.toggle("on",j===i));dots.forEach((x,j)=>x.classList.toggle("on",j===i));if(vids.length)vids.forEach((v,j)=>{if(j===i){if(n>1)v.currentTime=0;v.play().catch(()=>{})}else v.pause()})};
 go(0);
 const stop=()=>{clearInterval(t);t=null;if(vids.length&&vids[i])vids[i].pause()};
 const start=()=>{if(vids.length){if(vis&&vids[i])vids[i].play().catch(()=>{});return}if(n>1&&!t&&vis&&!hov)t=setInterval(()=>go(i+1),4200+delay)};
 if(vids.length&&n>1)vids.forEach(v=>v.addEventListener("ended",()=>go(i+1)));
 s.addEventListener("pointerenter",e=>{if(!vids.length&&e.pointerType==="mouse"){hov=true;stop()}});
 s.addEventListener("pointerleave",e=>{if(!vids.length&&e.pointerType==="mouse"){hov=false;start()}});
 $(".arw.l",s).onclick=()=>{go(i-1);stop();start()};$(".arw.r",s).onclick=()=>{go(i+1);stop();start()};
 dots.forEach((d,j)=>d.onclick=()=>{go(j);stop();start()});
 let x0=null;s.addEventListener("pointerdown",e=>{x0=e.clientX});
 s.addEventListener("pointerup",e=>{if(x0==null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)>40){go(i+(dx<0?1:-1));stop();start()}else if(Math.abs(dx)<=8&&!e.target.closest("button")&&s.dataset.lb){try{LB.open(JSON.parse(s.dataset.lb),i)}catch(_){}}else if(Math.abs(dx)<=8&&!e.target.closest("button")){const L=$$(".sl img",s).map(m=>m.currentSrc||m.src);if(L.length){const cur=$$(".sl",s)[i].querySelector("img");LB.open(L,Math.max(0,cur?L.indexOf(cur.currentSrc||cur.src):0))}}});
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;vis?start():stop()},{threshold:.2}).observe(s);
}
/* ---------- dropdown personalizado ---------- */
const DD=(()=>{
 let el,scrim,cur=null;
 function build(){
  scrim=document.createElement("div");scrim.className="scrim";el=document.createElement("div");el.className="ddp";el.setAttribute("role","listbox");
  document.body.append(scrim,el);scrim.addEventListener("click",close);
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&cur)close()});
  document.addEventListener("pointerdown",e=>{if(cur&&!el.contains(e.target)&&!e.target.closest(".dd"))close()});
 }
 function open(anchor,opts,val,onPick){
  if(!el)build();
  if(cur&&cur.anchor===anchor){close();return}
  if(cur)close();
  cur={anchor,onPick};
  el.innerHTML=opts.map(o=>`<button type="button" class="ddi${o===val?" sel":""}" role="option" data-v="${esc(o)}"><span>${esc(o)}</span><svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg></button>`).join("");
  el.onclick=e=>{const b=e.target.closest("[data-v]");if(b){const v=b.dataset.v;const f=cur.onPick;close();f(v)}};
  const r=anchor.getBoundingClientRect();
  if(innerWidth>640){el.style.left=Math.max(10,Math.min(r.left,innerWidth-r.width-10))+"px";el.style.width=r.width+"px";
   el.classList.add("on");const h=el.offsetHeight;let t=r.bottom+6;if(t+h>innerHeight-10)t=Math.max(10,r.top-h-6);el.style.top=t+"px"}
  else{el.style.left=el.style.top=el.style.width="";el.classList.add("on");scrim.classList.add("on")}
  anchor.classList.add("act");
 }
 function close(){if(!el)return;el.classList.remove("on");scrim.classList.remove("on");cur&&cur.anchor.classList.remove("act");cur=null}
 return{open,close};
})();
/* ---------- catalog pages ---------- */
const CFG={
 hoteles:{key:"hoteles",eyebrow:"Hospedaje",h1:"Hoteles en Mérida y alrededores",sub:"Elige tu hotel, selecciona tus fechas y consulta disponibilidad por WhatsApp.",lab:["Entrada","Salida"],unit:"noche",what:n=>`el hotel *${n}*`,search:"Buscar hotel…"},
 paquetes:{key:"paquetes",eyebrow:"Paquetes turísticos",h1:"Paquetes turísticos",sub:"Descubre Los Andes con nosotros. Elige tu paquete, calcula el precio y consulta disponibilidad.",lab:["Fecha de inicio"],what:n=>`el paquete *${n}*`,search:"Buscar paquete…"},
 tours:{key:"tours",eyebrow:"Excursiones de un día",h1:"Tours de un día",sub:"Vive Mérida en una jornada. Elige tu tour, indica la fecha y consulta disponibilidad.",lab:["Fecha"],what:n=>`el tour *${n}*`,search:"Buscar tour…"},
 autos:{key:"autos",eyebrow:"Alquiler de vehículos",h1:"Rent a Car",sub:"Elige tu vehículo, indica fechas y consulta disponibilidad.",lab:["Recogida","Devolución"],unit:"día",what:n=>`el vehículo *${n}*`,search:"Buscar vehículo…"}
};
const minPrice=L=>{const v=[];L.forEach(r=>(String(r[1]).match(/\d+(?:[.,]\d+)?/g)||[]).forEach(x=>v.push(parseFloat(x.replace(",",".")))));return v.length?Math.min(...v):null};
const money=n=>"$"+Number(n).toLocaleString("es-VE");
const GR={2:"p",3:"g3",4:"g4"};
const alta=d=>{const m=d.getMonth()+1,dd=d.getDate(),k=m*100+dd;return (k>=716&&k<=915)||k>=1116||k<=115};
const CHECK='<svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg>';
function tourFrom(it){const v=(it.matrix||[]).map(r=>r.p&&r.p[0]).filter(x=>x!=null);return v.length?Math.min(...v):null}
function card(it,c,i){
 const hot=c.key==="hoteles",tour=c.key==="paquetes",dt=c.key==="tours",auto=c.key==="autos";
 let mid="",badge="";
 if(hot){
  const R=L=>L.map(r=>`<button class="row" type="button"><span>${esc(r[0])}</span><b>${esc(r[1])}</b></button>`).join("");
  const rooms=it.rooms||[];
  mid=`<div class="rows">${R(rooms.slice(0,4))}${rooms.length>4?`<div class="more"><div>${R(rooms.slice(4))}</div></div>`:""}</div>${rooms.length>4?`<button class="toggle" type="button"><span>Ver las ${rooms.length-4} restantes</span>${svg("chev")}</button>`:""}<div class="note">${esc(it.note||"")} · toca una habitación para elegirla</div>`;
  
 }else if(tour){
  const f=tourFrom(it);if(f)badge=`Desde ${money(f)}`;
  mid=`<div class="note" style="font-weight:600">${esc(it.sub||"")}</div><ul class="chks">${(it.inc||[]).map(x=>`<li>${CHECK}<span>${esc(x)}</span></li>`).join("")}</ul>${(it.acts||[]).length?`<div class="more"><div><div class="acts-t">Actividades</div><ul class="chks acts">${it.acts.map(x=>`<li>${CHECK}<span>${esc(x)}</span></li>`).join("")}</ul></div></div><button class="toggle" type="button"><span>Ver actividades</span>${svg("chev")}</button>`:""}`;
 }else if(dt){
  const T=it.tiers?Object.keys(it.tiers).map(Number).sort((a,b)=>a-b):null,f=T?it.tiers[T[0]]:null;
  badge=T?`Desde ${money(f)}`:(it.pp?`${money(it.pp)} por persona`:"");
  mid=`<div class="note" style="font-weight:600">${esc(it.sub||"")}</div>${T?`<div class="price">${money(f)}<small> para ${T[0]} personas · tarifa por grupo</small></div>`:(it.pp?`<div class="price">${money(it.pp)}<small> por persona</small></div>`:"")}<ul class="chks">${(it.inc||[]).map(x=>`<li>${CHECK}<span>${esc(x)}</span></li>`).join("")}</ul>${(it.acts||[]).length?`<div class="more"><div><div class="acts-t">Itinerario</div><ul class="chks acts">${it.acts.map(x=>`<li>${CHECK}<span>${esc(x)}</span></li>`).join("")}</ul></div></div><button class="toggle" type="button"><span>Ver itinerario</span>${svg("chev")}</button>`:""}`;
 }else{
  badge=it.regular&&it.rate&&it.regular>it.rate?`Promo ${money(it.rate)}/día`:"";
  mid=`<div class="price">${it.regular&&it.regular>it.rate?`<s>${money(it.regular)}</s>`:""}${money(it.rate||0)}<small> por día / vehículo</small></div>${it.regular>it.rate?`<div class="save">Ahorras ${money(it.regular-it.rate)} por día</div>`:""}<div class="specs">${(it.specs||[]).map(s=>`<div><span>${esc(s[0])}</span><b>${esc(s[1])}</b></div>`).join("")}</div>`;
 }
 const date=(k,l)=>`<button class="fld" data-f="${k}" type="button"><span class="lb">${l}</span><span class="v empty">Elegir</span></button>`;
 const stp=(lb,min,max,v,span)=>`<div class="fld stp"${span?' style="grid-column:1/-1"':""}><span class="lb">${lb}</span><div class="ct"><button type="button" data-s="-1" aria-label="Menos">${svg("minus")}</button><span class="n" data-min="${min}" data-max="${max}">${v}</span><button type="button" data-s="1" aria-label="Más">${svg("plus")}</button></div></div>`;
 let flds="";
 if(hot)flds=date("a",c.lab[0])+date("b",c.lab[1])+stp("Huéspedes",1,30,2,true);
 else if(tour)flds=date("a",c.lab[0])+stp("Personas",2,30,2)+`<button class="fld dd" data-dd type="button" style="grid-column:1/-1"><span class="lb">Hotel</span><span class="v empty">Elige un hotel</span></button><div class="seg" style="grid-column:1/-1"><button type="button" data-ss="baja" class="on">Temporada baja</button><button type="button" data-ss="alta">Temporada alta</button></div>`;
 else if(dt){const T=it.tiers?Object.keys(it.tiers).map(Number).sort((a,b)=>a-b):null;flds=date("a",c.lab[0])+stp("Personas",T?T[0]:1,T?T[T.length-1]:30,T?T[0]:2)+(it.guide?`<label class="chk" style="grid-column:1/-1"><input type="checkbox" data-guide><span class="box">${CHECK}</span><span>Agregar guía turístico exclusivo (+${money(it.guide)})</span></label>`:"")}
 else flds=date("a",c.lab[0])+date("b",c.lab[1])+stp("Vehículos",1,it.max||1,1,true);
 const est=(tour||auto||dt)?`<div class="est"></div>`:"";
 return `<article class="card" data-name="${esc(it.name)}" data-i="${i}"><div class="media" style="position:relative">${badge?`<div class="badge">${esc(badge)}</div>`:""}${slider(it.photos,c.key,it.name,i,(c.key==="tours"||c.key==="paquetes")?(it.videos&&it.videos.length?it.videos:it.video):"")}</div><div class="body"><div class="loc">${esc(it.loc||"")}</div><h2>${esc(it.name)}</h2>${mid}<div class="flds">${flds}<div class="nts"></div></div>${est}<label class="chk op"><input type="checkbox"><span class="box">${CHECK}</span><span>Ya hablé con una operadora</span></label><button class="btn" type="button">${WA}Consultar disponibilidad</button></div></article>`;
}
function wire(cardEl,c,it){
 const hot=c.key==="hoteles",tour=c.key==="paquetes",dt=c.key==="tours",auto=c.key==="autos",single=tour||dt,name=cardEl.dataset.name;
 const val={mode:single?"single":"range",a:null,b:null};let people=it.tiers?Math.min(...Object.keys(it.tiers).map(Number)):2,qty=1,room=null,hotel=null,season="baja",manual=false;
 const fa=$('[data-f=a]',cardEl),fb=$('[data-f=b]',cardEl),nts=$(".nts",cardEl),est=$(".est",cardEl),ddb=$("[data-dd]",cardEl);
 const nDays=()=>val.a&&val.b?Math.round((val.b-val.a)/864e5):0;
 function calcTour(){
  if(!hotel)return null;
  const row=(it.matrix||[]).find(r=>r.hotel===hotel),g=GR[people];
  if(!row||!g)return{err:people>4?"Grupos de más de 4 personas: precio bajo consulta":"Precio bajo consulta"};
  const v=(row[g]||[])[season==="alta"?1:0];
  return v==null?{err:"Precio bajo consulta para esta temporada"}:{total:v};
 }
 function dtCalc(){
  let base=it.tiers?it.tiers[people]:(it.pp?it.pp*people:null);if(base==null)return null;
  const g=!!(it.guide&&$("[data-guide]",cardEl)&&$("[data-guide]",cardEl).checked);
  return{total:base+(g?it.guide:0),guide:g};
 }
 function upd(){
  const set=(f,d)=>{if(!f)return;const v=$(".v",f);v.textContent=d?fmt(d):"Elegir";v.classList.toggle("empty",!d)};
  set(fa,val.a);set(fb,val.b);
  const n=nDays();nts.textContent=(!single&&n>0)?`${n} ${c.unit}${n>1?"s":""}`:"";
  if(tour){
   if(val.a&&!manual){season=alta(val.a)?"alta":"baja";$$("[data-ss]",cardEl).forEach(b=>b.classList.toggle("on",b.dataset.ss===season))}
   const r=calcTour();
   est.innerHTML=!hotel?`<div class="est-empty">Elige un hotel para ver el precio del paquete</div>`:r.err?`<div class="est-empty">${r.err}. Escríbenos y te cotizamos.</div>`:`<div class="est-l">Total del paquete · ${season==="alta"?"temporada alta":"temporada baja"}</div><div class="est-v">${money(r.total)}</div><div class="est-s">${people} persona${people>1?"s":""} · ${esc(hotel)}</div><div class="est-s">Reserva con el 40%: <b>${money(Math.round(r.total*.4))}</b></div>`;
  }
  if(dt){
   if(it.minDays)nts.textContent=`Reserva con mínimo ${it.minDays} días de anticipación`;
   const r=dtCalc();
   est.innerHTML=r?`<div class="est-l">Total del grupo · ${people} personas</div><div class="est-v">${money(r.total)}</div><div class="est-s">≈ ${money(Math.round(r.total/people))} por persona${r.guide?` · incluye guía (+${money(it.guide)})`:""}</div>${it.deposit?`<div class="est-s">Reserva con el ${it.deposit}%: <b>${money(Math.round(r.total*it.deposit/100))}</b></div>`:""}`:`<div class="est-empty">Precio bajo consulta. Escríbenos y te cotizamos.</div>`;
  }
  if(auto){
   if(n<=0)est.innerHTML=val.a&&val.b?`<div class="est-empty" style="color:var(--red)">La devolución debe ser posterior a la recogida</div>`:`<div class="est-empty">Selecciona las fechas para ver el precio estimado</div>`;
   else{const tot=it.rate*n*qty,reg=(it.regular||it.rate)*n*qty;est.innerHTML=`<div class="est-l">${n} día${n>1?"s":""} × ${qty} vehículo${qty>1?"s":""}</div><div class="est-v">${money(tot)}</div>${reg>tot?`<div class="est-s"><s>${money(reg)}</s> · ahorras ${money(reg-tot)}</div>`:""}`}
  }
 }
 const minD=()=>{if(!(dt&&it.minDays))return null;const d=day0(new Date());d.setDate(d.getDate()+it.minDays);return d};
 const openDP=f=>DP.open({anchor:f,val,labels:c.lab,unit:c.unit,min:minD(),onChange:upd,onClose:upd});
 [fa,fb].forEach(f=>f&&f.addEventListener("click",()=>{if(f.classList.contains("act")){DP.close();return}DD.close();openDP(f)}));
 $$("[data-s]",cardEl).forEach(b=>b.onclick=()=>{const n=$(".n",b.parentNode),mn=+n.dataset.min,mx=+n.dataset.max;let v=Math.min(mx,Math.max(mn,+n.textContent+ +b.dataset.s));n.textContent=v;if(auto)qty=v;else people=v;upd()});
 $$(".row",cardEl).forEach(r=>r.onclick=()=>{const was=r.classList.contains("sel");$$(".row",cardEl).forEach(x=>x.classList.remove("sel"));if(!was){r.classList.add("sel");room=$("span",r).textContent+" ("+$("b",r).textContent+")"}else room=null});
 const tg=$(".toggle",cardEl);if(tg){const lab=$("span",tg).textContent;tg.onclick=()=>{const o=$(".more",cardEl).classList.toggle("open");tg.classList.toggle("open",o);$("span",tg).textContent=o?"Ver menos":lab}}
 if(ddb)ddb.onclick=()=>{DP.close();DD.open(ddb,(it.matrix||[]).map(r=>r.hotel),hotel,v=>{hotel=v;const e=$(".v",ddb);e.textContent=v;e.classList.remove("empty");upd()})};
 $$("[data-guide]",cardEl).forEach(g=>g.onchange=upd);
 $$("[data-ss]",cardEl).forEach(b=>b.onclick=()=>{season=b.dataset.ss;manual=true;$$("[data-ss]",cardEl).forEach(x=>x.classList.toggle("on",x===b));upd()});
 $(".btn",cardEl).onclick=()=>{
  const talked=$(".chk.op input",cardEl).checked;
  const miss=[];if(!talked){if(!val.a)miss.push(fa);if(!single&&!val.b)miss.push(fb)}
  if(miss.length){miss.forEach(f=>{f.classList.remove("err");void f.offsetWidth;f.classList.add("err")});openDP(val.a&&fb?fb:fa);return}
  const w=c.what(name);
  let m=talked?`Ya pude revisar la información con la operadora y me interesa ${w}. ¿Qué más me pueden decir al respecto? ¿Qué condiciones aplican?`:`Hola, quisiera consultar disponibilidad para ${w}.`;
  if(room)m+=`\n🛏️ Habitación: ${room}`;
  if(val.a)m+=`\n📅 ${c.lab[0]}: ${fmt(val.a)}`;
  if(!single&&val.b){const n=nDays();m+=`\n📅 ${c.lab[1]}: ${fmt(val.b)}${n>0?` (${n} ${c.unit}${n>1?"s":""})`:""}`}
  if(hot)m+=`\n👥 Huéspedes: ${people}`;
  if(tour){m+=`\n👥 Personas: ${people}`;if(hotel){m+=`\n🏨 Hotel: ${hotel}\n🌤️ Temporada: ${season}`;const r=calcTour();if(r&&r.total)m+=`\n💵 Precio de referencia: ${money(r.total)}`}}
  if(dt){m+=`\n👥 Personas: ${people}`;const r=dtCalc();if(r){if(r.guide)m+=`\n🧭 Guía turístico exclusivo: Sí (+${money(it.guide)})`;m+=`\n💵 Total estimado: ${money(r.total)}`;if(it.deposit)m+=`\n✅ Reserva con el ${it.deposit}%: ${money(Math.round(r.total*it.deposit/100))}`}}
  if(auto){m+=`\n🚗 Vehículos: ${qty}`;const n=nDays();if(n>0)m+=`\n💵 Total estimado: ${money(it.rate*n*qty)}`}
  window.open(`https://wa.me/${C.wa}?text=${encodeURIComponent(m)}`,"_blank");
 };
 upd();
}
function infoHTML(key){
 const f=(D.info||{})[key];if(!f||!(f.items||[]).length)return"";
 return `<section class="info"><div class="info-h"><span class="eyebrow" style="margin-bottom:10px">${esc(f.eyebrow||"Información")}</span><h2>${esc(f.title||"")}</h2>${f.sub?`<p>${esc(f.sub)}</p>`:""}</div><div class="info-g">${f.items.map(x=>`<div class="info-c"><h3>${esc(x[0])}</h3><p>${esc(x[1])}</p></div>`).join("")}</div></section>`;
}
function catalog(key){
 const c=CFG[key],list=D[c.key]||[];
 chrome({hoteles:"hoteles",paquetes:"paquetes",tours:"tours",autos:"rental-cars"}[key]);
 const main=document.createElement("main");
 const hh=((window.TM_DATA||{}).heroes||{})[c.key]||{},hi=hh.img?String(hh.img).replace(/'/g,"%27"):"";
 main.innerHTML=`<section class="hero${hi?" has-img":""}"${hi?` style="--hero-img:url('${esc(hi)}');--hero-dim:${((hh.dim==null?55:hh.dim)/100)}"`:""}><span class="eyebrow">${c.eyebrow}</span><h1>${c.h1}</h1><p>${c.sub}</p><div class="search">${svg("search")}<input type="search" placeholder="${c.search}" aria-label="${c.search}"></div></section><div class="grid"></div>${infoHTML(key)}`;
 document.body.insertBefore(main,$(".ftr"));
 const grid=$(".grid",main);
 function draw(q){
  const L=list.filter(x=>!q||(x.name+" "+(x.loc||"")).toLowerCase().includes(q));
  grid.className="grid"+(document.body.dataset.page==="paquetes"||list.length===1?" solo":list.length===2?" duo":"");
  grid.innerHTML=L.length?L.map((x,i)=>card(x,c,i)).join(""):`<div class="empty-msg">No se encontraron resultados.</div>`;
  $$(".card",grid).forEach((el,i)=>{wire(el,c,L[i]);initSlider($(".slider",el),(i%5)*350)});
  $$(".card",grid).forEach((el,i)=>{el.style.setProperty("--d",(i%3)*70+"ms")});
 }
 if(!list.length){grid.innerHTML=`<div class="soon"><h2>Próximamente</h2><p>Estamos preparando esta sección. Mientras tanto, escríbenos y te asesoramos.</p><a class="btn" style="max-width:320px;margin:0 auto;text-decoration:none" target="_blank" href="https://wa.me/${C.wa}?text=${encodeURIComponent("Hola, quisiera información sobre los tours de un día.")}">${WA}Escribir por WhatsApp</a></div>`;$(".search",main).style.display="none";return}
 if(list.length<=2)$(".search",main).style.display="none";
 draw("");
 $("input",main).addEventListener("input",e=>draw(e.target.value.trim().toLowerCase()));
}
const pg=document.body&&document.body.dataset.page;
if(pg&&CFG[pg])document.addEventListener("DOMContentLoaded",()=>catalog(pg));
})();
