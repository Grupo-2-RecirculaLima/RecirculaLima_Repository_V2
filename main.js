function openModal(id){ document.getElementById(id).classList.remove('hidden'); }
function closeModal(id){ document.getElementById(id).classList.add('hidden'); }
function scrollToTop(){ window.scrollTo({top:0,behavior:'smooth'}); }

function showToast(msg, type='info'){
    const t=document.getElementById('toast-msg');
    t.textContent=msg;
    t.className='toast '+type+' show';
    clearTimeout(t._timer);
    t._timer=setTimeout(()=>t.classList.remove('show'),3500);
}

const hamburgerBtn=document.getElementById('hamburger-btn');
hamburgerBtn.addEventListener('click',()=>{
    hamburgerBtn.classList.toggle('open');
    document.getElementById('mobile-nav-drawer').classList.toggle('open');
});
function closeMobileNav(){
    hamburgerBtn.classList.remove('open');
    document.getElementById('mobile-nav-drawer').classList.remove('open');
}
function openAuthModal(mode){ openModal('auth-system-overlay'); setMode(mode); }

const sections=document.querySelectorAll('section[id]');
window.addEventListener('scroll',()=>{
    let current='';
    sections.forEach(s=>{ if(window.scrollY>=s.offsetTop-120) current=s.id; });
    document.querySelectorAll('.nav-links a').forEach(a=>{
        a.classList.toggle('active-link', a.getAttribute('href')==='#'+current);
    });
});

const roleTabs=document.querySelectorAll('.tab-selector-item');
let currentMode='login', currentRole='ciudadano';
const roleConfig={
    ciudadano:{ title:'Acceso Ciudadano', loginDesc:'Ingresa tus credenciales para ver tus ReciPuntos acumulados.', regDesc:'Crea tu cuenta para comenzar a reciclar y ganar ReciPuntos.', loginBtn:'Iniciar Sesión como Ciudadano', regBtn:'Crear Cuenta Ciudadana' },
    reciclador:{ title:'Acceso Reciclador', loginDesc:'Accede a tu panel de rutas, metas y estadísticas de recolección.', regDesc:'Regístrate como operador ambiental verificado para trazar rutas.', loginBtn:'Iniciar Sesión como Reciclador', regBtn:'Registrarse como Reciclador' },
    administrador:{ title:'Control de Planta — Acopio', loginDesc:'Panel exclusivo para administradores de centros de acopio.', regDesc:'Registra tu centro de acopio y gestiona el flujo de materiales.', loginBtn:'Ingresar — Administrador', regBtn:'Registrar Centro de Acopio' }
};

function setMode(mode){
    currentMode=mode;
    const isL=mode==='login';
    document.getElementById('tab-login').classList.toggle('active',isL);
    document.getElementById('tab-register').classList.toggle('active',!isL);
    document.getElementById('form-login').classList.toggle('hidden',!isL);
    document.getElementById('form-register').classList.toggle('hidden',isL);
    updateCtx();
}
function updateCtx(){
    const cfg=roleConfig[currentRole];
    document.getElementById('ctx-title').textContent=cfg.title;
    document.getElementById('ctx-desc').textContent=currentMode==='login'?cfg.loginDesc:cfg.regDesc;
    document.getElementById('btn-login-txt').textContent=cfg.loginBtn;
    document.getElementById('btn-reg-txt').textContent=cfg.regBtn;
    const isRec=currentRole==='reciclador', isAdm=currentRole==='administrador';
    document.getElementById('extra-reciclador').classList.toggle('hidden',!isRec);
    document.getElementById('extra-admin').classList.toggle('hidden',!isAdm);
    if(currentMode==='register') document.getElementById('dni-wrap').style.display=isAdm?'none':'flex';
}

document.getElementById('tab-login').addEventListener('click',()=>setMode('login'));
document.getElementById('tab-register').addEventListener('click',()=>setMode('register'));
document.getElementById('sw-to-reg').addEventListener('click',()=>setMode('register'));
document.getElementById('sw-to-login').addEventListener('click',()=>setMode('login'));

roleTabs.forEach(t=>t.addEventListener('click',()=>{
    roleTabs.forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    currentRole=t.getAttribute('data-role');
    updateCtx();
}));

document.getElementById('open-login-btn').addEventListener('click',()=>{ openModal('auth-system-overlay'); setMode('login'); });
['open-register-btn','open-register-btn-nav','open-login-btn2'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.addEventListener('click',()=>{
        openModal('auth-system-overlay');
        setMode(id==='open-login-btn2'?'login':'register');
    });
});
document.getElementById('close-auth-modal').addEventListener('click',()=>closeModal('auth-system-overlay'));
document.getElementById('auth-system-overlay').addEventListener('click',e=>{ if(e.target.id==='auth-system-overlay') closeModal('auth-system-overlay'); });

function openRecyclerReg(){
    openModal('auth-system-overlay'); setMode('register');
    roleTabs.forEach(t=>t.classList.toggle('active',t.getAttribute('data-role')==='reciclador'));
    currentRole='reciclador'; updateCtx();
}
function toggleAsociacion(checkbox){
    const campo = document.getElementById('campo-asociacion');
    if(campo) campo.style.display = checkbox.checked ? 'none' : 'flex';
}

document.getElementById('footer-recicladores-link').addEventListener('click',e=>{ e.preventDefault(); openRecyclerReg(); });

const dniInput=document.getElementById('reg-dni');
dniInput.addEventListener('input',()=>{
    dniInput.value=dniInput.value.replace(/\D/g,'').slice(0,8);
    const bad=dniInput.value.length>0&&dniInput.value.length!==8;
    dniInput.classList.toggle('error-field',bad);
    dniInput.classList.toggle('ok-field',dniInput.value.length===8);
    document.getElementById('err-rd').classList.toggle('visible',bad);
});

document.getElementById('form-login').addEventListener('submit',e=>{
    e.preventDefault();
    const email=document.getElementById('login-email').value.trim();
    const pass=document.getElementById('login-pass').value;
    let ok=true;
    const setE=(id,fid,show)=>{ document.getElementById(id).classList.toggle('visible',show); document.getElementById(fid).classList.toggle('error-field',show); };
    const badE=!email||!/\S+@\S+\.\S+/.test(email);
    setE('err-le','login-email',badE); if(badE) ok=false;
    setE('err-lp','login-pass',!pass); if(!pass) ok=false;
    if(!ok) return;
    showSession(email.split('@')[0], currentRole);
    closeModal('auth-system-overlay');
    showToast('¡Bienvenido/a de nuevo!','success');
});

document.getElementById('form-register').addEventListener('submit',e=>{
    e.preventDefault();
    const name=document.getElementById('reg-name').value.trim();
    const dni=document.getElementById('reg-dni').value.trim();
    const email=document.getElementById('reg-email').value.trim();
    const pass=document.getElementById('reg-pass').value;
    const pass2=document.getElementById('reg-pass2').value;
    let ok=true;
    const setE=(id,fid,show)=>{ document.getElementById(id).classList.toggle('visible',show); document.getElementById(fid).classList.toggle('error-field',show); };
    setE('err-rn','reg-name',!name); if(!name) ok=false;
    const badD=currentRole!=='administrador'&&(dni.length!==8||!/^\d{8}$/.test(dni));
    setE('err-rd','reg-dni',badD); if(badD) ok=false;
    const badE=!/\S+@\S+\.\S+/.test(email);
    setE('err-re','reg-email',badE); if(badE) ok=false;
    setE('err-rp','reg-pass',pass.length<8); if(pass.length<8) ok=false;
    setE('err-rp2','reg-pass2',pass!==pass2); if(pass!==pass2) ok=false;
    if(!ok) return;
    showSession(name.split(' ')[0], currentRole);
    closeModal('auth-system-overlay');
    showToast(`✅ ¡Bienvenido/a, ${name.split(' ')[0]}! Tu cuenta ha sido creada.`,'success');
});

function doLogout(){
    document.getElementById('session-active-area').classList.add('hidden');
    document.getElementById('auth-btn-group').classList.remove('hidden');
    document.getElementById('desktop-nav').classList.remove('hidden');
    document.getElementById('hamburger-btn').classList.remove('hidden');
    ['dash-ciudadano','dash-reciclador','dash-admin'].forEach(d=>document.getElementById(d).classList.add('hidden'));
    document.getElementById('landing-page').classList.remove('hidden');
    showToast('👋 Sesión cerrada correctamente.','info');
    window.scrollTo({top:0,behavior:'smooth'});
}

function toggleSidebar(prefix){
    const nav=document.getElementById('nav-'+prefix);
    const toggle=document.getElementById('toggle-'+prefix);
    const logoutMap={'dc':'action-logout-trigger2','dr':'action-logout-trigger3','da':'action-logout-trigger4'};
    const logout=document.getElementById(logoutMap[prefix]);
    if(!nav) return;
    const isOpen=nav.classList.contains('open');
    nav.classList.toggle('open',!isOpen);
    if(logout) logout.classList.toggle('open',!isOpen);
    if(toggle) toggle.classList.toggle('open',!isOpen);
}

function showSession(name, role){
    document.getElementById('auth-btn-group').classList.add('hidden');
    document.getElementById('session-active-area').classList.remove('hidden');
    document.getElementById('session-user-info').textContent=`🟢 ${name}`;
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('desktop-nav').classList.add('hidden');
    document.getElementById('hamburger-btn').classList.add('hidden');
    document.getElementById('mobile-nav-drawer').classList.remove('open');
    hamburgerBtn.classList.remove('open');
    ['dash-ciudadano','dash-reciclador','dash-admin'].forEach(d=>{
        document.getElementById(d).classList.add('hidden');
    });
    document.querySelectorAll('.dash-tab').forEach(t=>{ t.style.display='none'; t.classList.remove('active'); });
    ['dc-home','dr-home','da-home'].forEach(id=>{ const t=document.getElementById(id); if(t){ t.style.display='block'; t.classList.add('active'); } });
    if(role==='ciudadano'){
        document.getElementById('dash-ciudadano').classList.remove('hidden');
        document.getElementById('dash-ciudadano-name').textContent=name;
    } else if(role==='reciclador'){
        document.getElementById('dash-reciclador').classList.remove('hidden');
        document.getElementById('dash-reciclador-name').textContent=name;
        setTimeout(genQRReciclador, 300);
    } else if(role==='administrador'){
        document.getElementById('dash-admin').classList.remove('hidden');
        document.getElementById('dash-admin-name').textContent=name;
    }
    window.scrollTo({top:0,behavior:'smooth'});
}

const logoutNavBtn = document.getElementById('action-logout-trigger');
if(logoutNavBtn) logoutNavBtn.addEventListener('click', doLogout);

document.getElementById('btn-forgot').addEventListener('click',()=>{ closeModal('auth-system-overlay'); openModal('recovery-modal'); });
document.getElementById('btn-send-recovery').addEventListener('click',()=>{
    const email=document.getElementById('recovery-email').value.trim();
    if(!email||!/\S+@\S+\.\S+/.test(email)){ document.getElementById('recovery-email').classList.add('error-field'); return; }
    document.getElementById('recovery-email').classList.remove('error-field');
    document.getElementById('recovery-success').classList.add('show');
    document.getElementById('btn-send-recovery').disabled=true;
    setTimeout(()=>closeModal('recovery-modal'),3200);
});
document.getElementById('recovery-modal').addEventListener('click',e=>{ if(e.target.id==='recovery-modal') closeModal('recovery-modal'); });

let qrObj=null;
function genQR(){
    const el=document.getElementById('qr-code-display');
    el.innerHTML=''; qrObj=null;
    const tok='LIMA-'+Math.floor(Math.random()*900000+100000);
    document.getElementById('qr-random-token').textContent=tok;
    qrObj=new QRCode(el,{text:'recirculalima://validar/'+tok,width:150,height:150,colorDark:'#34472C',colorLight:'#ffffff'});
}
document.getElementById('trigger-qr-generator').addEventListener('click',()=>{ openModal('qr-modal-overlay'); genQR(); });
document.getElementById('close-qr-modal').addEventListener('click',()=>closeModal('qr-modal-overlay'));
document.getElementById('btn-regenerate-qr').addEventListener('click',()=>{ genQR(); showToast('🔄 Nuevo QR generado','info'); });
document.getElementById('qr-modal-overlay').addEventListener('click',e=>{ if(e.target.id==='qr-modal-overlay') closeModal('qr-modal-overlay'); });

const _el_footer_contacto=document.getElementById('footer-contacto');if(_el_footer_contacto) _el_footer_contacto.addEventListener('click',e=>{ e.preventDefault(); openModal('modal-contacto'); });
const _el_footer_privacidad=document.getElementById('footer-privacidad');if(_el_footer_privacidad) _el_footer_privacidad.addEventListener('click',e=>{ e.preventDefault(); openModal('modal-privacidad'); });
const _el_footer_terminos=document.getElementById('footer-terminos');if(_el_footer_terminos) _el_footer_terminos.addEventListener('click',e=>{ e.preventDefault(); openModal('modal-terminos'); });
['modal-contacto','modal-privacidad','modal-terminos'].forEach(id=>{
    document.getElementById(id).addEventListener('click',e=>{ if(e.target.id===id) closeModal(id); });
});

document.getElementById('btn-send-contact').addEventListener('click',()=>{
    const name=document.getElementById('c-name').value.trim();
    const email=document.getElementById('c-email').value.trim();
    const subject=document.getElementById('c-subject').value.trim();
    const msg=document.getElementById('c-msg').value.trim();
    let ok=true;
    [['c-name',name],['c-subject',subject],['c-msg',msg]].forEach(([id,val])=>{
        document.getElementById(id).classList.toggle('error-field',!val);
        if(!val) ok=false;
    });
    const badE=!/\S+@\S+\.\S+/.test(email);
    document.getElementById('c-email').classList.toggle('error-field',badE);
    if(badE) ok=false;
    if(!ok){ showToast('! Por favor completa todos los campos correctamente.','warning'); return; }
    document.getElementById('contact-form-fields').style.display='none';
    document.getElementById('contact-success').classList.add('show');
    showToast('✅ ¡Mensaje enviado!','success');
});

const _bvr=document.getElementById('btn-ver-recicladores'); if(_bvr) _bvr.addEventListener('click',()=>openModal('modal-recicladores'));
const _mr=document.getElementById('modal-recicladores'); if(_mr) _mr.addEventListener('click',e=>{ if(e.target.id==='modal-recicladores') closeModal('modal-recicladores'); });

document.getElementById('btn-red-local').addEventListener('click',()=>openModal('modal-descuentos'));
const _md=document.getElementById('modal-descuentos'); if(_md) _md.addEventListener('click',e=>{ if(e.target.id==='modal-descuentos') closeModal('modal-descuentos'); });

document.getElementById('btn-ver-horarios').addEventListener('click',()=>openModal('modal-horarios'));
const _mh=document.getElementById('modal-horarios'); if(_mh) _mh.addEventListener('click',e=>{ if(e.target.id==='modal-horarios') closeModal('modal-horarios'); });

const _bnp=document.getElementById('btn-navegar-parada'); if(_bnp) _bnp.addEventListener('click',()=>openModal('modal-navegar'));
const _mn=document.getElementById('modal-navegar'); if(_mn) _mn.addEventListener('click',e=>{ if(e.target.id==='modal-navegar') closeModal('modal-navegar'); });

function openStoreModal(platform){
    const isIOS=platform==='ios';
    document.getElementById('store-title').textContent=isIOS?'Descargar en App Store':'Descargar en Google Play';
    document.getElementById('store-desc').textContent=isIOS
        ?'RecirculaLima está disponible para iPhone y iPad con iOS 14 o superior.'
        :'RecirculaLima está disponible para Android 8.0 o superior.';
    document.getElementById('store-primary-btn').textContent=isIOS?'🍎 Ir a App Store':'🤖 Ir a Google Play';
    document.getElementById('store-primary-btn').onclick=()=>{
        showToast(isIOS?'🍎 Redirigiendo a App Store...':'🤖 Redirigiendo a Google Play...','info');
        setTimeout(()=>closeModal('modal-store'),1200);
    };
    openModal('modal-store');
}
const _ios=document.getElementById('btn-ios'); if(_ios) _ios.addEventListener('click',()=>openStoreModal('ios'));
const _and=document.getElementById('btn-android'); if(_and) _and.addEventListener('click',()=>openStoreModal('android'));
const _ms=document.getElementById('modal-store'); if(_ms) _ms.addEventListener('click',e=>{ if(e.target.id==='modal-store') closeModal('modal-store'); });

updateCtx();

function dashTab(e, tabId){
    if(e && e.preventDefault) e.preventDefault();
    const link = e && e.currentTarget ? e.currentTarget : e;
    const wrapper = link.closest('.dash-wrapper');
    wrapper.querySelectorAll('.dash-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    wrapper.querySelectorAll('.dash-tab').forEach(t => {
        t.style.display = 'none';
        t.classList.remove('active');
    });
    const tab = document.getElementById(tabId);
    if(tab){
        tab.style.display = 'block';
        tab.classList.add('active');
    }
    if(tabId === 'dr-qr'){
        setTimeout(()=>{ if(document.getElementById('dr-qr-display').children.length===0) genQRReciclador(); }, 100);
    }
}
function toggleChip(el){ el.classList.toggle('active'); }

function setDashDates(){
    const d=new Date();
    const str=d.toLocaleDateString('es-PE',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
    ['dash-date-c','dash-date-r','dash-date-a'].forEach(id=>{ const el=document.getElementById(id); if(el) el.textContent=str; });
}
setDashDates();

['action-logout-trigger2','action-logout-trigger3','action-logout-trigger4'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.addEventListener('click', doLogout);
});

function genQRReciclador(){
    const el=document.getElementById('dr-qr-display');
    if(!el) return;
    el.innerHTML='';
    const tok='REC-'+Math.floor(Math.random()*900000+100000);
    const tkEl=document.getElementById('dr-qr-token');
    if(tkEl) tkEl.textContent=tok;
    new QRCode(el,{text:'recirculalima://reciclador/'+tok,width:140,height:140,colorDark:'#34472C',colorLight:'#ffffff'});
}

function solicitarRecojo(){
    const dir=document.getElementById('sol-dir').value.trim();
    if(!dir){ document.getElementById('sol-dir').classList.add('error-field'); showToast('⚠️ Completa los campos obligatorios','warning'); return; }
    document.getElementById('sol-dir').classList.remove('error-field');
    showToast('✅ ¡Solicitud publicada! Los recicladores de tu zona ya pueden verla.','success');
    document.getElementById('sol-dir').value='';
}

const dashObserver=new MutationObserver(()=>{
    const sInfo=document.getElementById('session-user-info');
    if(!sInfo) return;
    const uname=sInfo.textContent.replace('🟢 ','');
    const dr=document.getElementById('dash-reciclador');
    if(dr&&!dr.classList.contains('hidden')){
        if(dr.querySelector('#dr-qr-display')&&dr.querySelector('#dr-qr-display').children.length===0) genQRReciclador();
        ['dr-qr-name','dr-perfil-name'].forEach(id=>{ const e=document.getElementById(id); if(e&&!e.textContent) e.textContent=uname; });
    }
    const dc=document.getElementById('dash-ciudadano');
    if(dc&&!dc.classList.contains('hidden')){
        const e=document.getElementById('dc-perfil-name'); if(e&&!e.textContent) e.textContent=uname;
    }
});
dashObserver.observe(document.body,{attributes:true,subtree:true,attributeFilter:['class']});

function toggleEditarMeta(){
    const form = document.getElementById('meta-edit-form');
    form.classList.toggle('hidden');
    const input = document.getElementById('meta-input');
    if(!form.classList.contains('hidden')) input.focus();
}

function guardarMeta(){
    const val = parseInt(document.getElementById('meta-input').value);
    if(!val || val < 1){ showToast('⚠️ Ingresa un valor válido','warning'); return; }
    document.getElementById('meta-valor-display').textContent = val;
    document.getElementById('meta-edit-form').classList.add('hidden');
    document.getElementById('meta-input').value = '';
    showToast('✅ Meta actualizada a ' + val + ' kg','success');
}

function abrirPerfilReciclador(nombre, distancia, horario, calificacion, recojos, materiales, foto){
    document.getElementById('prm-nombre').textContent = nombre;
    document.getElementById('prm-distancia').textContent = distancia;
    document.getElementById('prm-horario').textContent = horario;
    document.getElementById('prm-calificacion').textContent = '⭐ ' + calificacion;
    document.getElementById('prm-recojos').textContent = recojos;
    document.getElementById('prm-materiales').textContent = materiales;
    document.getElementById('prm-foto').src = foto;
    openModal('modal-perfil-reciclador');
}

function irASolicitarRecojo(){
    closeModal('modal-perfil-reciclador');
    const ciudadanoWrapper = document.getElementById('dash-ciudadano');
    const link = ciudadanoWrapper.querySelector('[onclick*="dc-solicitar"]');
    if(link) link.click();
}