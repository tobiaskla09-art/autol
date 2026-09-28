for (const clave of ['autos','chat','contactos','consultas']) {
  localStorage.removeItem('Auto Libre:' + clave);
}
const leer = (clave) => { try { return JSON.parse(localStorage.getItem('Auto Libre:'+clave)) || []; } catch { return []; } };
const guardar = (clave, valor) => localStorage.setItem('Auto Libre:'+clave, JSON.stringify(valor));
const agregar = (clave, dato) => { const lista=leer(clave); lista.push(dato); guardar(clave,lista); };
const estado = (id, texto) => { const el=document.getElementById(id); if(el) el.textContent=texto; };
const valor = (form,nombre) => form.elements.namedItem(nombre)?.value.trim() || '';
const fecha = () => new Date().toLocaleString('es-AR');
const crear = (tag,texto,clase) => { const el=document.createElement(tag); el.textContent=texto; if(clase)el.className=clase; return el; };

document.getElementById('form-vender')?.addEventListener('submit', e => {
  e.preventDefault();
  window.location.href='exito.html';
});
document.getElementById('form-reserva')?.addEventListener('submit', e => {
  e.preventDefault();
  localStorage.removeItem('Auto Libre:reservas');
  window.location.href='exito.html';
});
document.getElementById('form-favorito')?.addEventListener('submit', e => {
  e.preventDefault();const f=e.currentTarget;
  const lista=leer('favoritos');
  if(!lista.some(x=>x.modelo==='Peugeot 208'))agregar('favoritos',{modelo:'Peugeot 208',version:valor(f,'version'),anio:valor(f,'anio')});
  estado('estado-favorito','Peugeot 208 guardado. Abrí Favoritos para verlo.');
});
document.getElementById('form-consulta')?.addEventListener('submit', e => {
  e.preventDefault();
  e.currentTarget.reset();
  estado('estado-consulta','Consulta enviada correctamente.');
});
document.getElementById('form-registro')?.addEventListener('submit', e => {
  e.preventDefault();const f=e.currentTarget;
  const nombre=f.querySelector('#registro-nombre').value.trim(),email=f.querySelector('#registro-email').value.trim().toLowerCase();
  const usuarios=leer('usuarios');
  if(usuarios.some(x=>x.email===email)){estado('estado-cuenta','Ese correo ya está registrado en este navegador.');return;}
  agregar('usuarios',{nombre,email});guardar('sesion',{nombre,email});f.reset();
  estado('estado-cuenta','Cuenta creada. Hola, '+nombre+'.');
});
document.getElementById('form-login')?.addEventListener('submit', e => {
  e.preventDefault();const f=e.currentTarget,email=f.querySelector('#login-email').value.trim().toLowerCase();
  const usuario=leer('usuarios').find(x=>x.email===email);
  if(!usuario){estado('estado-cuenta','No hay cuenta local con ese correo. Creá una primero.');return;}
  guardar('sesion',usuario);f.reset();estado('estado-cuenta','Sesión iniciada. Hola, '+usuario.nombre+'.');
});
const caja=document.getElementById('mensajes-chat');
document.getElementById('form-chat')?.addEventListener('submit', e => {
  e.preventDefault();const f=e.currentTarget,texto=valor(f,'mensaje');if(!texto)return;
  caja.append(crear('p',texto,'bubble outgoing'));
  f.reset();
});
const fav=document.getElementById('favoritos-dinamicos');
if(fav){
  const lista=leer('favoritos');
  if(lista.length)fav.replaceChildren();
  lista.forEach((a,i)=>{
    const row=crear('div','','saved-row');
    row.append(crear('strong',a.modelo+' · '+(a.version||'Versión estándar')+' · '+(a.anio||'Año actual')));
    const btn=crear('button','Quitar','button button-secondary');
    btn.type='button';btn.addEventListener('click',()=>{lista.splice(i,1);guardar('favoritos',lista);location.reload()});
    row.append(btn);fav.append(row);
  });
}
const actividad=document.getElementById('actividad-dinamica');
