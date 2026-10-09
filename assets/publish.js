/* Publicar en el sitio: guarda un archivo directo en GitHub (Netlify actualiza el sitio solo) */
(function(){
const KEY="tm_gh",DEF={token:"",repo:"publibeve/transfersmda",branch:"main"};
const P=window.TMPublish={
 cfg(){try{return Object.assign({},DEF,JSON.parse(localStorage.getItem(KEY)||"{}"))}catch(e){return Object.assign({},DEF)}},
 setCfg(c){localStorage.setItem(KEY,JSON.stringify(c))},
 clear(){localStorage.removeItem(KEY)},
 b64(text){const b=new TextEncoder().encode(text);let s="";for(let i=0;i<b.length;i+=0x8000)s+=String.fromCharCode.apply(null,b.subarray(i,i+0x8000));return btoa(s)},
 async api(path,opt){
  const c=P.cfg();
  const r=await fetch("https://api.github.com/repos/"+c.repo+path,Object.assign({},opt,{headers:Object.assign({Authorization:"Bearer "+c.token,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"},(opt&&opt.headers)||{})}));
  let j=null;try{j=await r.json()}catch(e){}
  if(!r.ok){const e=new Error((j&&j.message)||("Error "+r.status));e.status=r.status;throw e}
  return j;
 },
 async commit(path,text,msg,isB64){
  const c=P.cfg();if(!c.token)throw new Error("Falta la clave de GitHub.");
  const url="/contents/"+path.split("/").map(encodeURIComponent).join("/");
  for(let t=0;t<2;t++){
   let sha;try{const g=await P.api(url+"?ref="+encodeURIComponent(c.branch));sha=g.sha}catch(e){if(e.status!==404)throw e}
   try{return await P.api(url,{method:"PUT",body:JSON.stringify({message:msg||"Actualización desde el editor",content:isB64?text:P.b64(text),branch:c.branch,sha})})}
   catch(e){if(t===0&&(e.status===409||e.status===422))continue;throw e}
  }
 },
 friendly(e){
  if(e.status===401)return "La clave de GitHub no es válida o venció. Pulsa «Configurar GitHub» y pega una nueva.";
  if(e.status===403||e.status===404)return "GitHub no dejó guardar: revisa que la clave tenga permiso «Contents: Read and write» sobre el repositorio "+P.cfg().repo+".";
  return e.message||"No se pudo publicar.";
 },
 setup(){
  return new Promise(res=>{
   const c=P.cfg(),o=document.createElement("div");
   o.style.cssText="position:fixed;inset:0;z-index:99999;background:rgba(0,15,40,.6);display:grid;place-items:center;padding:16px;font-family:Inter,system-ui,sans-serif";
   o.innerHTML=`<div style="background:#fff;color:#0a1a33;border-radius:20px;max-width:460px;width:100%;padding:22px;box-shadow:0 30px 70px rgba(0,0,0,.4);max-height:92vh;overflow:auto">
   <h3 style="margin:0 0 6px;font-size:18px">Conectar con GitHub (una sola vez)</h3>
   <ol style="font-size:13px;line-height:1.55;margin:8px 0 12px 18px;padding:0;color:#34455f">
   <li>Entra a <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener" style="color:#00337F;font-weight:700">github.com/settings/personal-access-tokens/new</a>.</li>
   <li>Nombre: <b>Editor TransfersMérida</b>. Expiración: la más larga que permita.</li>
   <li>En «Repository access» elige <b>Only select repositories</b> y marca <b>transfersmda</b>.</li>
   <li>En «Permissions → Repository permissions» pon <b>Contents: Read and write</b>.</li>
   <li>Pulsa «Generate token», copia la clave (empieza con <code>github_pat_</code>) y pégala aquí.</li></ol>
   <label style="font-size:11px;font-weight:800;text-transform:uppercase;color:#5a6b85">Clave (token)</label>
   <input id="tmgT" type="password" autocomplete="off" value="${c.token.replace(/"/g,"")}" style="width:100%;box-sizing:border-box;margin:4px 0 10px;padding:11px;border:1.5px solid #cbd8ec;border-radius:12px;font:inherit">
   <label style="font-size:11px;font-weight:800;text-transform:uppercase;color:#5a6b85">Repositorio</label>
   <input id="tmgR" value="${c.repo}" style="width:100%;box-sizing:border-box;margin:4px 0 6px;padding:11px;border:1.5px solid #cbd8ec;border-radius:12px;font:inherit">
   <p style="font-size:12px;color:#6b4e00;background:#fff8e6;border-radius:10px;padding:8px 10px;margin:8px 0">La clave se guarda solo en este navegador. No la compartas con nadie.</p>
   <div id="tmgM" style="font-size:13px;min-height:18px;margin-bottom:8px"></div>
   <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap">
   <button id="tmgX" style="padding:10px 16px;border-radius:12px;border:0;background:#eef4fc;font-weight:700;cursor:pointer">Cancelar</button>
   <button id="tmgS" style="padding:10px 18px;border-radius:12px;border:0;background:#00337F;color:#fff;font-weight:700;cursor:pointer">Guardar y probar</button></div></div>`;
   document.body.append(o);const q=s=>o.querySelector(s);
   q("#tmgX").onclick=()=>{o.remove();res(null)};
   q("#tmgS").onclick=async()=>{
    const t=q("#tmgT").value.trim(),r=q("#tmgR").value.trim();
    if(!t||!/^[^/\s]+\/[^/\s]+$/.test(r)){q("#tmgM").style.color="#cc1b1b";q("#tmgM").textContent="Pega la clave y revisa el repositorio (usuario/nombre).";return}
    P.setCfg({token:t,repo:r,branch:"main"});q("#tmgM").style.color="#34455f";q("#tmgM").textContent="Probando…";
    try{const j=await P.api("");if(j.permissions&&j.permissions.push===false)throw Object.assign(new Error("La clave no tiene permiso de escritura."),{status:403});
     q("#tmgM").style.color="#15803D";q("#tmgM").textContent="Conectado ✓";setTimeout(()=>{o.remove();res(P.cfg())},700)}
    catch(e){q("#tmgM").style.color="#cc1b1b";q("#tmgM").textContent=P.friendly(e)}
   };
  });
 },
 async ensure(){return P.cfg().token?P.cfg():await P.setup()}
};
})();
