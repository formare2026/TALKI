const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- USUÁRIO ATUAL (cada conta tem seus próprios dados) ---------- */
let currentEmail = '';
const userKey = base => base + '_' + (currentEmail || 'visitante');

/* ---------- ÍCONES ---------- */
const IC = {
home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
chat:'<path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6A8 8 0 1 1 21 12z"/>',
cal:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.2l-5.5 3 1-6.2L3 9.6l6.2-.9z"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
check:'<path d="m5 12 5 5 9-10"/>',
pin:'<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
send:'<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
coffee:'<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h2a2 2 0 0 1 0 4h-2M7 2v3M11 2v3"/>',
book:'<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 19.5v-15"/>',
pen:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
vol:'<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
x:'<path d="M18 6 6 18M6 6l12 12"/>',
globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
camera:'<path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.5"/>',
logout:'<path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>',
moon:'<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5z"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>'
};

const ic = n => `<svg class="ic" viewBox="0 0 24 24">${IC[n]}</svg>`;

document.querySelectorAll('[data-i]').forEach(e => e.innerHTML = ic(e.dataset.i));

/* ---------- TEMA CLARO/ESCURO ---------- */
const THEME_KEY = 'talki_tema';

function applyTheme(theme){
  const dark = theme === 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';

  // Troca a logo automaticamente conforme o tema selecionado.
  const logo = $('talkiLogo');
  if(logo){
    logo.src = dark ? logo.dataset.logoDark : logo.dataset.logoLight;
  }

  $('themeIcon').innerHTML = ic(dark ? 'sun' : 'moon');

  if($('themeText')){
    $('themeText').textContent = dark ? 'Modo claro' : 'Modo escuro';
  }

  $('themeToggle').setAttribute('aria-label',dark ? 'Ativar modo claro' : 'Ativar modo escuro');
}

function toggleTheme(){
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  try{localStorage.setItem(THEME_KEY,next)}catch(e){}
  applyTheme(next);
}

(function initTheme(){
  let saved = 'light';
  try{saved = localStorage.getItem(THEME_KEY) || 'light'}catch(e){}
  applyTheme(saved);
})();

/* ---------- IDENTIFICAÇÃO DO USUÁRIO ---------- */
function updateSideUser(name){
  const clean = (name || '').trim();
  $('sideName').textContent = clean || 'Visitante';
  $('sideAvatar').innerHTML = foto ? `<img src="${foto}" alt="">` : clean ? esc(clean.charAt(0).toUpperCase()) : ic('user');
}

/* ---------- NOME COMPARTILHADO ---------- */
const me = {name:''};
const ini = n => n.trim().charAt(0).toUpperCase();

document.addEventListener('input',e=>{
  if(e.target.classList.contains('nm')){
    me.name = e.target.value;
    document.querySelectorAll('.nm').forEach(i=>{
      if(i !== e.target) i.value = me.name;
    });
  }
});

function setName(n){
  me.name = n;
  document.querySelectorAll('.nm').forEach(i=>i.value=n);
}

const L = ['Inglês','Espanhol','Francês','Português'];

/* ---------- FEEDBACK ---------- */
function sendFb(){
  const n = $('fbname').value.trim();
  const m = $('fbmsg').value.trim();

  if(!n){$('fberr').textContent='Digite seu nome.';return}
  if(!m){$('fberr').textContent='Escreva sua mensagem.';return}

  $('fberr').textContent='';
  $('fbform').style.display='none';
  $('fbok').style.display='block';
  $('fbok').innerHTML = ic('check')+' Feedback enviado! Obrigado, '+esc(n.split(' ')[0])+'. <button class="btn alt" style="margin-left:8px" onclick="newFb()">Enviar outro</button>';
}

function newFb(){
  $('fbmsg').value='';
  $('fbform').style.display='';
  $('fbok').style.display='none';
}

/* ---------- ESPAÇO DE SOCIALIZAÇÃO ---------- */

let here = [
  {n:'Mariana Costa',l:'Inglês'},
  {n:'Lucas Almeida',l:'Espanhol'},
  {n:'Camille Dubois',l:'Português'},
  {n:'Sofía Ramírez',l:'Francês'},
  {n:'Gabriel Santos',l:'Inglês'},
  {n:'Beatriz Oliveira',l:'Espanhol'},
  {n:'Pedro Henrique',l:'Francês'},
  {n:'Ana Clara',l:'Português'},
  {n:'Juliana Martins',l:'Inglês'},
  {n:'Thiago Lima',l:'Português'}
], inHere = false;


function rHere(){
  $('here').innerHTML = here.map(p=>`
    <div class="person">
      <div class="av">${esc(ini(p.n))}</div>
      <div>
        <b>${esc(p.n)}${p.me?' (você)':''}</b><br>
        <span class="tag">Quer conversar em ${p.l}</span>
      </div>
    </div>
  `).join('');

  $('cnt').textContent = here.length;
  $('hbtn').innerHTML = inHere ? ic('x')+'Sair do local' : ic('pin')+'Estou no local';
}

function toggleForm(){
  if(inHere){
    here = here.filter(p=>!p.me);
    inHere = false;
    rHere();
    return;
  }
  $('cform').classList.toggle('open');
}

function sendHere(){
  const n = me.name.trim();

  if(!n){
    $('cerr').textContent='Digite seu nome para entrar no local.';
    return;
  }

  $('cerr').textContent='';
  here.push({n,l:$('clang').value,me:1});
  inHere = true;
  $('cform').classList.remove('open');
  rHere();
}

/* ---------- ENCONTROS ---------- */
const E = [
  {d:'05',m:'Mar 2027',t:'Encontro de Começo',w:'Sexta-feira',c:['Mariana Costa','Lucas Almeida','Camille Dubois','Sofía Ramírez']},
  {d:'05',m:'Jun 2027',t:'Encontro de Meio',w:'Sábado',c:['Lucas Almeida','Camille Dubois']},
  {d:'05',m:'Set 2027',t:'Encontro de Fim',w:'Domingo',c:[]}
];

const mine = {};

function rE(){
  $('elist').innerHTML = E.map((e,i)=>`
    <div class="card">
      <div class="date">
        <div class="day"><b>${e.d}</b><span>${e.m}</span></div>
        <div>
          <h2 style="margin:0">${e.t}</h2>
          <span class="small">${e.w} · Coffee break incluso</span>
        </div>
      </div>
      <p>${L.slice().sort().map(l=>`<span class="tag">${l}</span>`).join(' ')}</p>
      <p class="small"><b>Confirmados (${e.c.length}):</b> ${e.c.length?e.c.map(esc).join(', '):'Nenhuma confirmação ainda'}</p>
      <button class="btn ${mine[i]?'alt':''}" onclick="conf(${i})">${mine[i]?ic('x')+'Cancelar presença':ic('check')+'Confirmar presença'}</button>
    </div>
  `).join('');
}

function conf(i){
  if(mine[i]){
    E[i].c = E[i].c.filter(x=>x!==mine[i]);
    delete mine[i];
  }else{
    const n = me.name.trim();

    if(!n){
      $('eerr').textContent='Digite seu nome acima para confirmar.';
      $('ename').focus();
      return;
    }

    $('eerr').textContent='';
    E[i].c.push(n);
    mine[i] = n;
  }

  rE();
}

/* ---------- TALKIGO ---------- */
const ACT = [
  {t:'Complete a frase',i:'pen',d:'Escolha a palavra certa.',k:'F'},
  {t:'Vocabulário',i:'book',d:'Descubra o significado.',k:'V'},
  {t:'Ouça e escolha',i:'vol',d:'Ouça a frase e escolha o significado.',k:'P',l:1}
];

const NV = ['Fácil','Médio','Difícil'];

const D = {
'Inglês':{
V:`airport|aeroporto; breakfast|café da manhã; house|casa; water|água; friend|amigo;
neighbor|vizinho; schedule|horário; weather|clima; lawyer|advogado; borrow|pedir emprestado;
reluctant|relutante; thorough|minucioso; overwhelmed|sobrecarregado; achievement|conquista; deadline|prazo`,
P:`Nice to meet you|Prazer em conhecer você; Good morning|Bom dia; Thank you very much|Muito obrigado; See you tomorrow|Até amanhã; How are you?|Como você está?;
Where is the bathroom?|Onde fica o banheiro?; I would like a coffee|Eu gostaria de um café; Can you help me?|Você pode me ajudar?; What time does it start?|A que horas começa?; I don’t understand|Eu não entendo;
I’ve been learning English for two years|Estou aprendendo inglês há dois anos; Could you speak more slowly, please?|Você poderia falar mais devagar, por favor?; I’m looking forward to meeting you|Estou ansioso para conhecer você; It depends on the situation|Depende da situação; Let’s keep in touch|Vamos manter contato`,
F:`I ___ coffee every morning.|drink|drinks|drinking; She ___ to work by bus.|goes|go|going; They ___ my friends.|are|is|am; We ___ in São Paulo.|live|lives|living; He ___ a student.|is|are|be;
I ___ English since 2020.|have studied|studied|am studying; She is ___ than her brother.|taller|more tall|tallest; If it rains, we ___ at home.|will stay|stay|stayed; I’m interested ___ music.|in|on|at; He ___ TV when I called.|was watching|watched|watches;
If I ___ more time, I would travel.|had|have|would have; She suggested that he ___ a doctor.|see|sees|saw; By next year, I ___ here for ten years.|will have lived|will live|have lived; Hardly ___ arrived when it started to rain.|had we|we had|did we; I wish I ___ speak French.|could|can|will`
},
'Espanhol':{
V:`ventana|janela; desayuno|café da manhã; cuchara|colher; llave|chave; leche|leite;
vecino|vizinho; tienda|loja; cumpleaños|aniversário; sobrino|sobrinho; cita|encontro marcado;
ahorrar|economizar; huella|pegada; aunque|embora; lograr|conseguir; sin embargo|no entanto`,
P:`Mucho gusto|Muito prazer; Buenos días|Bom dia; Muchas gracias|Muito obrigado; Hasta mañana|Até amanhã; ¿Cómo estás?|Como você está?;
¿Cuánto cuesta?|Quanto custa?; ¿Dónde está el baño?|Onde fica o banheiro?; Quisiera un café|Eu gostaria de um café; ¿Puede ayudarme?|Você pode me ajudar?; No entiendo|Eu não entendo;
Llevo dos años aprendiendo español|Faz dois anos que estou aprendendo espanhol; ¿Podría hablar más despacio, por favor?|Você poderia falar mais devagar, por favor?; Tengo muchas ganas de conocerte|Estou muito ansioso para te conhecer; Depende de la situación|Depende da situação; Mantengámonos en contacto|Vamos manter contato`,
F:`Yo ___ en São Paulo.|vivo|vives|vive; Ellas ___ español.|hablan|habla|hablo; Nosotros ___ amigos.|somos|son|soy; Tú ___ un libro.|tienes|tengo|tiene; Él ___ estudiante.|es|eres|soy;
Ayer ___ al cine.|fui|voy|iré; Mi hermana es ___ que yo.|más alta|más alto|altísimo; Si llueve mañana, ___ en casa.|me quedaré|me quedé|me quedaba; Estoy interesado ___ la música.|en|a|de; Cuando llamaste, yo ___ la tele.|estaba mirando|miré|miraré;
Si tuviera más tiempo, ___.|viajaría|viajaré|viajo; Espero que ___ pronto.|vengas|vienes|venir; Ojalá ___ hablar francés.|pudiera|puedo|podré; Me alegra que ___ aquí.|estés|estás|estar; Aunque ___ cansado, fui al trabajo.|estaba|esté|estaría`
},
'Francês':{
V:`pain|pão; lait|leite; maison|casa; eau|água; ami|amigo;
voisin|vizinho; magasin|loja; anniversaire|aniversário; clé|chave; chaussure|sapato;
épargner|poupar; empreinte|pegada; pourtant|no entanto; réussir|ter êxito; quoique|embora`,
P:`Enchanté|Prazer; Bonjour|Bom dia; Merci beaucoup|Muito obrigado; À demain|Até amanhã; Comment ça va ?|Como vai?;
Combien ça coûte ?|Quanto custa?; Où sont les toilettes ?|Onde fica o banheiro?; Je voudrais un café|Eu gostaria de um café; Pouvez-vous m’aider ?|Você pode me ajudar?; Je ne comprends pas|Eu não entendo;
J’apprends le français depuis deux ans|Aprendo francês há dois anos; Pourriez-vous parler plus lentement ?|Você poderia falar mais devagar?; J’ai hâte de vous rencontrer|Mal posso esperar para conhecer você; Ça dépend de la situation|Depende da situação; Restons en contact|Vamos manter contato`,
F:`Je ___ un café.|prends|prend|prenons; Nous ___ français.|parlons|parle|parlez; Ils ___ mes amis.|sont|est|suis; Tu ___ étudiant.|es|est|suis; Elle ___ à Paris.|habite|habites|habitons;
Hier, je ___ au cinéma.|suis allé|vais|irai; Ma sœur est ___ que moi.|plus grande|plus grand|la plus grande; S’il pleut, nous ___ à la maison.|resterons|restions|sommes restés; Je m’intéresse ___ la musique.|à|de|en; Il ___ la télé quand j’ai appelé.|regardait|regarde|a regardé;
Si j’avais plus de temps, je ___.|voyagerais|voyagerai|voyage; Il faut que tu ___ vite.|viennes|viens|venir; J’aimerais que tu ___ ici.|sois|es|seras; Bien qu’il ___ fatigué, il travaille.|soit|est|sera; Je doute qu’elle ___ raison.|ait|a|aura`
},
'Português':{
V:`casa|house; água|water; amigo|friend; livro|book; cachorro|dog;
vizinho|neighbor; saudade|longing; aniversário|birthday; geladeira|refrigerator; calçada|sidewalk;
desabafar|to vent; aproveitar|to take advantage of; cotidiano|everyday life; esforço|effort; conquista|achievement`,
P:`Muito prazer|Nice to meet you; Bom dia|Good morning; Muito obrigado|Thank you very much; Até amanhã|See you tomorrow; Tudo bem?|How are you?;
Onde fica o banheiro?|Where is the bathroom?; Eu gostaria de um café|I would like a coffee; Você pode me ajudar?|Can you help me?; Quanto custa?|How much is it?; Eu não entendo|I don’t understand;
Estou aprendendo português há dois anos|I have been learning Portuguese for two years; Você poderia falar mais devagar?|Could you speak more slowly?; Estou ansioso para te conhecer|I’m looking forward to meeting you; Depende da situação|It depends on the situation; Vamos manter contato|Let’s keep in touch`,
F:`Eu ___ no centro da cidade.|moro|mora|moramos; Nós ___ português.|falamos|falo|fala; Eles ___ meus amigos.|são|é|sou; Você ___ estudante.|é|são|sou; Ela ___ café todo dia.|toma|tomo|tomamos;
Ontem eu ___ ao cinema.|fui|vou|irei; Minha irmã é ___ do que eu.|mais alta|mais alto|altíssimo; Se chover amanhã, nós ___ em casa.|ficaremos|ficaram|ficou; Eu gosto ___ música.|de|em|a; Ele ___ TV quando eu liguei.|assistia|assistirá|assistir;
Se eu ___ mais tempo, viajaria.|tivesse|tenho|terei; Espero que você ___ logo.|venha|vem|vir; Quero que ele ___ aqui.|esteja|está|estar; Embora ___ cansado, ele trabalhou.|estivesse|estava|estará; Duvido que ela ___ razão.|tenha|tem|terá`
}
};

const VC = {'Inglês':'en-US','Espanhol':'es-ES','Francês':'fr-FR','Português':'pt-BR'};
const PROGRESS_KEY = 'talkigo_progresso';

let lang = 'Inglês', lvl = 0, done = {}, cur = null;

function loadProgress(){
  try{
    done = JSON.parse(localStorage.getItem(userKey(PROGRESS_KEY))||'{}') || {};
  }catch(e){
    done = {};
  }
}
loadProgress();

const sh = a => a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
const parse = t => t.split(';').map(x=>x.trim().split('|'));

/* LIBERAÇÃO PROGRESSIVA DOS NÍVEIS */
function nivelLiberado(k){
  if(k===0)return true;
  return ACT.every((a,i)=>done[lang+(k-1)+i]!=null);
}

function salvarProgresso(){
  try{localStorage.setItem(userKey(PROGRESS_KEY),JSON.stringify(done))}catch(e){}
}

/* 15 PERGUNTAS POR ATIVIDADE */
function makeQ(i){
  const k = ACT[i].k;
  const all = parse(D[lang][k]);
  const part = all.slice(lvl*5,lvl*5+5);
  const pool = m => sh(all.map(x=>x[1]).filter(y=>y!==m)).slice(0,2);

  return sh(part.map(x=>{
    if(k==='F')return [x[0],[x[1],x[2],x[3]],0];
    return [k==='V'?`Qual é o significado de “${x[0]}”?`:x[0],[x[1],...pool(x[1])],0];
  }));
}

function go(){
  $('langs').innerHTML = L.map(l=>`
    <button type="button" class="chip ${l===lang?'on':''}" onclick="selecionarIdioma('${l}')">${l}</button>
  `).join('');

  $('lvls').innerHTML = NV.map((n,k)=>{
    const liberado = nivelLiberado(k);
    return `
      <button class="chip ${k===lvl?'on':''}"
        ${liberado?'':'disabled title="Conclua todas as atividades do nível anterior para liberar este nível." style="opacity:.45;cursor:not-allowed"'}
        onclick="selecionarNivel(${k})">
        ${liberado?'':'🔒 '}${n}
      </button>
    `;
  }).join('');

  if(cur){
    rq();
    return;
  }

  $('quiz').style.display='none';
  $('acts').style.display='grid';

  const aviso = !nivelLiberado(lvl)
    ? `<div class="card"><p class="small">🔒 Este nível ainda está bloqueado. Conclua as três atividades do nível anterior para desbloqueá-lo.</p></div>`
    : '';

  $('acts').innerHTML = aviso + ACT.map((a,i)=>{
    const d = done[lang+lvl+i];

    return `
      <div class="card">
        <h2>${ic(a.i)}${a.t}</h2>
        <p class="small">${a.d}</p>
        <p>
          <span class="tag">${ic('clock')}5 perguntas</span>
          <span class="tag">${NV[lvl]}</span>
          ${d!=null?`<span class="tag ok">${ic('check')}${d}/5 acertos</span>`:''}
        </p>
        <button type="button" class="btn"
          ${nivelLiberado(lvl)?'':'disabled style="opacity:.45;cursor:not-allowed"'}
          onclick="start(${i})">
          ${d!=null?'Refazer':'Começar'}
        </button>
      </div>
    `;
  }).join('');
}

function selecionarIdioma(id){
  if(!D[id])return;
  lang=id;
  cur=null;
  if(!nivelLiberado(lvl))lvl=0;
  go();
}

function selecionarNivel(k){
  if(!nivelLiberado(k))return;
  lvl=k;
  cur=null;
  go();
}

function start(i){
  if(!nivelLiberado(lvl))return;
  cur={i,qs:makeQ(i),q:0,s:0,o:null,p:null,show:0};
  rq();
}

/* ÁUDIO */
function say(){
  const s = $('sp');

  try{
    if(!window.speechSynthesis || !window.SpeechSynthesisUtterance)throw 0;

    const u = new SpeechSynthesisUtterance(cur.qs[cur.q][0]);
    u.lang = VC[lang];

    const v = speechSynthesis.getVoices().find(x=>x.lang.replace('_','-').startsWith(VC[lang].slice(0,2)));
    if(v)u.voice=v;

    u.onerror=()=>{s.textContent='O áudio não tocou neste navegador. Use “Mostrar frase”.'};
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    s.textContent='';

  }catch(e){
    s.textContent='Este navegador não toca áudio aqui. Use “Mostrar frase”.';
  }
}

function rq(){
  if(!cur)return;

  const a = ACT[cur.i];
  const z = $('quiz');
  const n = cur.qs.length;

  $('acts').style.display='none';
  z.style.display='block';

  if(cur.q>=n){
    done[lang+lvl+cur.i]=cur.s;
    salvarProgresso();

    const proximoNivel = lvl<2 && !nivelLiberado(lvl+1);
    const liberouProximo = lvl<2 && nivelLiberado(lvl+1);

    z.innerHTML = `
      <div class="card pv">
        <h2>Atividade concluída!</h2>
        <p class="score">${cur.s}/${n}</p>
        <p class="small">${cur.s===n?'Excelente! Você acertou tudo.':'Bom trabalho! Tente de novo para melhorar.'}</p>
        ${liberouProximo?`<p class="small">🎉 Você concluiu todas as atividades do nível ${NV[lvl]} e desbloqueou o nível ${NV[lvl+1]}!</p>`:proximoNivel?`<p class="small">Continue! Conclua as outras atividades deste nível para desbloquear o próximo.</p>`:''}
        <button class="btn" onclick="cur=null;go()">Voltar às atividades</button>
        <button class="btn alt" onclick="start(${cur.i})">Refazer</button>
      </div>
    `;
    return;
  }

  const [p,o,r] = cur.qs[cur.q];

  if(!cur.o)cur.o=sh(o);

  const ok = o[r];
  const pk = cur.p;

  z.innerHTML = `
    <div class="card">
      <div class="row">
        <h2 style="margin:0">${ic(a.i)}${a.t} <span class="tag">${NV[lvl]}</span></h2>
        <span class="small">Pergunta ${cur.q+1} de ${n}</span>
      </div>

      <div class="bar"><i style="width:${cur.q/n*100}%"></i></div>

      ${a.l?`
        <button class="btn alt" onclick="say()">${ic('vol')}Ouvir</button>
        <button class="btn alt" onclick="cur.show=1;rq()">Mostrar frase</button>
        <span class="small" id="sp"></span>
        ${(pk!=null||cur.show)?`<p><b>“${esc(p)}”</b></p>`:''}
      `:`<p style="font-size:18px;font-weight:600;margin:0">${esc(p)}</p>`}

      ${cur.o.map((t,k)=>`
        <button class="opt ${pk!=null?(t===ok?'right':(k===pk?'wrong':'')):''}" onclick="pick(${k})">${esc(t)}</button>
      `).join('')}

      ${pk!=null?`
        <p style="margin:14px 0 10px;font-weight:600;color:${cur.o[pk]===ok?'#1f8a52':'#d6393f'}">
          ${cur.o[pk]===ok?'Correto!':'Resposta certa: '+esc(ok)}
        </p>
        <button class="btn" onclick="nx()">${cur.q+1<n?'Próxima':'Ver resultado'}</button>
      `:''}

      <p style="margin:14px 0 0">
        <button class="btn alt" onclick="cur=null;go()">Sair da atividade</button>
      </p>
    </div>
  `;
}

function pick(k){
  if(!cur || cur.p!=null)return;
  cur.p=k;

  const a = cur.qs[cur.q];
  if(cur.o[k]===a[1][a[2]])cur.s++;

  rq();
}

function nx(){
  if(!cur)return;
  cur.q++;
  cur.o=null;
  cur.p=null;
  cur.show=0;
  rq();
}

/* ---------- PERFIL ---------- */
const sel = new Map();
const NIV = ['Nativo','Básico','Intermediário','Fluente'];
let foto = '';
const KEY = 'talki_perfil';

function rChips(){
  $('pl').innerHTML = L.map(l=>{
    const on = sel.has(l);

    return `
      <div class="lrow">
        <button type="button" class="chip ${on?'on':''}" onclick="togLang('${l}')">${l}</button>
        <select ${on?'':'disabled'} aria-label="Nível em ${l}" onchange="setLv('${l}',this.value)">
          ${NIV.map(n=>`<option ${on&&sel.get(l)===n?'selected':''}>${n}</option>`).join('')}
        </select>
      </div>
    `;
  }).join('');
}

function togLang(l){
  sel.has(l) ? sel.delete(l) : sel.set(l,'Básico');
  rChips();
}

function setLv(l,v){
  if(sel.has(l))sel.set(l,v);
}

function avatarHtml(n){
  return foto ? `<img src="${foto}" alt="Foto de perfil">` : (n?esc(ini(n)):ic('user'));
}

function rAv(){
  $('pav').innerHTML=avatarHtml($('pname').value.trim());
}

$('pfoto').addEventListener('change',e=>{
  const f = e.target.files && e.target.files[0];
  if(!f)return;

  const r = new FileReader();

  r.onload=()=>{
    const im = new Image();

    im.onload=()=>{
      const S=256,c=document.createElement('canvas');
      const m=Math.min(im.width,im.height);
      const sx=(im.width-m)/2,sy=(im.height-m)/2;

      c.width=c.height=S;
      c.getContext('2d').drawImage(im,sx,sy,m,m,0,0,S,S);

      foto=c.toDataURL('image/jpeg',.85);
      rAv();
      updateSideUser($('pname').value||'');
    };

    im.src=r.result;
  };

  r.readAsDataURL(f);
});

function saveP(){
  const n = $('pname').value.trim();

  if(!n){
    $('perr').textContent='Digite seu nome completo.';
    return;
  }

  $('perr').textContent='';

  const b = $('pbio').value.trim();

  setName(n);
  updateSideUser(n);

  try{
    localStorage.setItem(userKey(KEY),JSON.stringify({n,b,foto,langs:[...sel]}));
  }catch(e){}

  showP(n,b);
}

function showP(n,b){
  $('pview').innerHTML = `
    <div class="av big">${avatarHtml(n)}</div>
    <h2>${esc(n)}</h2>
    <p>
      ${sel.size?L.filter(l=>sel.has(l)).map(l=>`<span class="tag">${ic('globe')}${l} — ${esc(sel.get(l))}</span>`).join(' '):'<span class="small">Nenhum idioma selecionado</span>'}
    </p>
    <p class="bio">${b?esc(b):'<span class="small">Sem bio ainda.</span>'}</p>
    <button class="btn alt" onclick="editP()">${ic('pen')}Editar perfil</button>
  `;

  $('pform').style.display='none';
  $('pview').style.display='block';
}

function editP(){
  $('pform').style.display='';
  $('pview').style.display='none';
  rAv();
}

$('pname').addEventListener('input',()=>{
  if(!foto)rAv();
});

function loadP(){
  sel.clear(); foto=''; setName('');
  $('pname').value=''; $('pbio').value='';

  try{
    const d = JSON.parse(localStorage.getItem(userKey(KEY))||'null');

    if(d && d.n){
      $('pname').value=d.n;
      $('pbio').value=d.b||'';
      foto=d.foto||'';

      (d.langs||[]).forEach(x=>Array.isArray(x)?sel.set(x[0],x[1]):sel.set(x,'Básico'));

      setName(d.n);
      updateSideUser(d.n);
      rChips();
      rAv();
      showP(d.n,d.b||'');
      return;
    }
  }catch(e){}

  rChips();
  rAv();
  updateSideUser('');
}

/* ---------- NAVEGAÇÃO ---------- */
function route(){
  const h = (location.hash||'#home').slice(1);
  const p = document.getElementById(h) && document.getElementById(h).classList.contains('page') ? h : 'home';

  document.querySelectorAll('.page').forEach(s=>s.classList.toggle('on',s.id===p));
  document.querySelectorAll('aside a').forEach(a=>a.classList.toggle('on',a.dataset.p===p));

  if(p==='talkigo'){
    cur=null;
    go();
  }

  window.scrollTo(0,0);
}

addEventListener('hashchange',route);

rHere();
rE();
go();
loadP();
updateSideUser($('pname').value||'');
route();

/* ---------- LOGIN E CONTA LOCAL (várias contas, cada uma com seus dados) ---------- */
const AUTH_KEY  = 'talki_conta_demo';   // formato antigo (uma conta só)
const USERS_KEY = 'talki_contas';       // formato novo (várias contas)

function getUsers(){
  try{
    let users = JSON.parse(localStorage.getItem(USERS_KEY)||'null');

    if(!users){
      users = {};

      // migra a conta antiga (única), se existir
      const old = JSON.parse(localStorage.getItem(AUTH_KEY)||'null');
      if(old && old.email) users[old.email] = old;

      localStorage.setItem(USERS_KEY,JSON.stringify(users));
      localStorage.removeItem(AUTH_KEY);

      // perfil e progresso antigos eram compartilhados entre todos: descartados
      localStorage.removeItem('talki_perfil');
      localStorage.removeItem('talkigo_progresso');
    }

    return users;
  }catch(e){
    return {};
  }
}

function saveUsers(users){
  localStorage.setItem(USERS_KEY,JSON.stringify(users));
}

function getAuthUser(email){
  return getUsers()[(email||'').trim().toLowerCase()] || null;
}

async function hashTalkiPassword(password){
  if(!window.crypto || !crypto.subtle){
    throw new Error('Use o projeto em localhost para habilitar a proteção de senha.');
  }

  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256',bytes);

  return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
}

function togglePassword(id,btn){
  const field = $(id);
  const showing = field.type==='text';
  field.type = showing ? 'password' : 'text';
  btn.textContent = showing ? 'Mostrar' : 'Ocultar';
}

function showRegister(){
  $('loginForm').classList.add('auth-hidden');
  $('registerForm').classList.remove('auth-hidden');
  $('registerError').textContent='';
  $('registerName').focus();
}

function showLogin(){
  $('registerForm').classList.add('auth-hidden');
  $('loginForm').classList.remove('auth-hidden');
  $('loginError').textContent='';
  $('loginEmail').focus();
}

function finishLogin(user,remember){
  const displayName = user.name || user.email.split('@')[0];
  const sessao = JSON.stringify({email:user.email,name:displayName});

  currentEmail = user.email;

  try{
    if(remember){
      localStorage.setItem('talki_sessao',sessao);
    }else{
      sessionStorage.setItem('talki_sessao',sessao);
      localStorage.removeItem('talki_sessao');
    }
  }catch(e){}

  // carrega os dados DESTA conta (perfil e progresso do TalkiGO)
  loadP();
  loadProgress();

  // conta nova, sem perfil salvo: começa com o nome do cadastro
  if(!$('pname').value.trim()){
    $('pname').value = displayName;
    setName(displayName);
  }

  rAv();
  updateSideUser($('pname').value.trim() || displayName);

  document.body.classList.add('authenticated');

  go();
  location.hash = location.hash || '#home';
}

async function loginTalki(event){
  event.preventDefault();

  const email = $('loginEmail').value.trim().toLowerCase();
  const password = $('loginPassword').value;
  const user = getAuthUser(email);

  if(!user){
    $('loginError').textContent='Não encontramos uma conta com esse e-mail. Clique em “Criar conta” para começar.';
    return;
  }

  try{
    const hash = await hashTalkiPassword(password);

    if(hash!==user.passwordHash){
      $('loginError').textContent='E-mail ou senha incorretos. Confira seus dados e tente novamente.';
      return;
    }
  }catch(err){
    $('loginError').textContent=err.message;
    return;
  }

  $('loginError').textContent='';
  finishLogin(user,$('rememberTalki').checked);
}

async function registerTalki(event){
  event.preventDefault();

  const name = $('registerName').value.trim();
  const email = $('registerEmail').value.trim().toLowerCase();
  const password = $('registerPassword').value;
  const confirmPassword = $('registerConfirm').value;

  if(name.length<2){
    $('registerError').textContent='Digite seu nome completo.';
    return;
  }

  if(password.length<6){
    $('registerError').textContent='A senha precisa ter pelo menos 6 caracteres.';
    return;
  }

  if(password!==confirmPassword){
    $('registerError').textContent='As senhas não coincidem.';
    return;
  }

  if(getAuthUser(email)){
    $('registerError').textContent='Já existe uma conta cadastrada com esse e-mail.';
    return;
  }

  try{
    const user = {
      name,
      email,
      passwordHash:await hashTalkiPassword(password)
    };

    const users = getUsers();
    users[email] = user;
    saveUsers(users);

    $('registerError').textContent='Conta criada! Entrando no TALKI...';
    $('registerError').classList.add('auth-success');

    finishLogin(user,true);

  }catch(err){
    $('registerError').textContent=err.message||'Não foi possível salvar a conta neste navegador.';
  }
}

async function forgotTalki(){
  const email = prompt('Digite o e-mail cadastrado na sua conta:');
  if(!email)return;

  const user = getAuthUser(email);

  if(!user){
    alert('Não encontramos uma conta com esse e-mail neste navegador.');
    return;
  }

  const newPassword = prompt('Digite sua nova senha (mínimo de 6 caracteres):');
  if(newPassword===null)return;

  if(newPassword.length<6){
    alert('A senha precisa ter pelo menos 6 caracteres.');
    return;
  }

  try{
    user.passwordHash=await hashTalkiPassword(newPassword);

    const users = getUsers();
    users[user.email] = user;
    saveUsers(users);

    alert('Senha atualizada! Você já pode entrar com a nova senha.');
  }catch(e){
    alert(e.message||'Não foi possível atualizar a senha neste navegador.');
  }
}


/* ---------- SAIR DA CONTA ---------- */

function logoutTalki(){
  $('logoutModal').classList.add('show');
}

function cancelLogout(){
  $('logoutModal').classList.remove('show');
}

function confirmLogout(){
  try{
    localStorage.removeItem('talki_sessao');
    sessionStorage.removeItem('talki_sessao');
  }catch(e){}

  currentEmail = '';

  location.hash = '#home';
  location.reload();
}
