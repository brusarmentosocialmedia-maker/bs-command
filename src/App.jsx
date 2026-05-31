import { useState, useMemo, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL = import.meta?.env?.VITE_SUPABASE_URL || "";
const SUPA_KEY = import.meta?.env?.VITE_SUPABASE_ANON_KEY || "";
const supabase = SUPA_URL && SUPA_KEY ? createClient(SUPA_URL, SUPA_KEY) : null;

async function db(table, op, params = {}) {
  if (!supabase) return null;
  try {
    let q = supabase.from(table);
    if (op === "select") { const { data, error } = await q.select(params.cols||"*").order(params.order||"created_at", { ascending: !!params.asc }).limit(params.limit||1000); if (error) throw error; return data; }
    if (op === "insert") { const { data, error } = await q.insert([params.row]).select().single(); if (error) throw error; return data; }
    if (op === "update") { const { data, error } = await q.update(params.row).eq("id", params.id).select().single(); if (error) throw error; return data; }
    if (op === "delete") { const { error } = await q.delete().eq("id", params.id); if (error) throw error; return true; }
  } catch (e) { console.error(`DB ${op} ${table}:`, e); return null; }
}

const buildMeta = () => [
  { id:"107650042674983", name:"Olímpico Materiais", business:"Olimpico", status:"ACTIVE", context:"Otimização: REPLIES · Prospecção · Funil consideração", anomalies:[], trends:[{name:"Mix Completo Reel 17-04",metric:"CTR",change:"+231%",trend:"GOOD",id:"6910128162577"},{name:"AUTO Mai/26",metric:"CTR",change:"+61%",trend:"BAD",id:"6920809188777"},{name:"FACHADA",metric:"CTR",change:"+32%",trend:"BAD",id:"6888324253777"}] },
  { id:"115440998870166", name:"Marini Bem Viver", business:"Marini Bem Viver", status:"ACTIVE", context:"Otimização: REPLIES · Prospecção · Funil consideração", anomalies:[{type:"narrow_audience",label:"Público estreito",detail:"Conjunto 'Público Quente' com audiência 36.3k–42.7k. Recomendado expandir.",link:"https://adsmanager.facebook.com/adsmanager/manage/adsets?act=115440998870166&selected_adset_ids=52546312344020"}], trends:[{name:"AD3",metric:"CTR",change:"+6%",trend:"GOOD",id:"52546290502020"},{name:"AD5",metric:"CTR",change:"+127%",trend:"GOOD",id:"52546290501420"},{name:"AD4",metric:"CTR",change:"+97%",trend:"BAD",id:"52546290502220"}] },
  { id:"672680225051337", name:"Rio Pardo Materiais", business:"Rio Pardo Materiais", status:"ACTIVE", context:"Otimização: REPLIES · Prospecção · Foco em volume", anomalies:[{type:"narrow_audience",label:"Público estreito",detail:"Conjunto 'Novo Conj. Engajamento' com audiência 22.1k–26k.",link:"https://adsmanager.facebook.com/adsmanager/manage/adsets?act=672680225051337&selected_adset_ids=120243336234950534"}], trends:[{name:"AD07",metric:"CTR",change:"+84%",trend:"GOOD",id:"120243336382140534"},{name:"AD04",metric:"CTR",change:"+16%",trend:"BAD",id:"120243336364660534"},{name:"AD11",metric:"CTR",change:"+46%",trend:"BAD",id:"120244298526000534"}] },
  { id:"668402146064238", name:"Pemaco Cacoal", business:"Pemaco Cacoal", status:"ACTIVE", context:"Sem anomalias detectadas.", anomalies:[], trends:[] },
  { id:"975633001314208", name:"CA - Pemaco Ariquemes", business:"Pemaco materiais", status:"ACTIVE", context:"Otimização: REACH · Ads recém iniciados", anomalies:[], trends:[{name:"AD02",metric:"Alcance",change:"—",trend:"NEW",id:"120251355336270367"},{name:"AD03",metric:"Alcance",change:"—",trend:"NEW",id:"120251355358760367"}] },
  { id:"1506877747699190", name:"00 84 Materiais", business:"84materiais", status:"ACTIVE", context:"Ads recém iniciados", anomalies:[], trends:[{name:"Obra não para 26-05",metric:"CTR",change:"—",trend:"NEW",id:"120248633854000653"}] },
  { id:"979039898320664", name:"BM - Bru Sarmento", business:"Brunna Sarmento", status:"ACTIVE", context:"Sem dados de tendência.", anomalies:[], trends:[] },
  { id:"2454764984809611", name:"Conta desativada", business:"—", status:"DISABLED", context:"Conta desativada — ação necessária.", anomalies:[{type:"account_disabled",label:"Conta suspensa",detail:"Atividade incomum detectada pelo Meta. Todos os anúncios pausados.",link:"https://www.facebook.com/help/contact/143610459613936"}], trends:[] },
];

const COLS=[{id:"todo",label:"TO DO"},{id:"progress",label:"IN PROGRESS"},{id:"review",label:"IN REVIEW"},{id:"approved",label:"APPROVED"},{id:"done",label:"DONE"}];
const TIPOS=["Post redes sociais","Reels/Vídeo","Campanha completa","Flyer/Banner","Story","Outro"];
const PRIORIDADES=["Highest","High","Medium","Low","Lowest"];
const PRIO_C={Highest:"#00E5C3",High:"#00C9AB",Medium:"#9CE0D8",Low:"#5B7F7A",Lowest:"#3A5550"};
const PRIO_I={Highest:"▲▲",High:"▲",Medium:"●",Low:"▽",Lowest:"▽▽"};
const TAG_BG={"Post redes sociais":"rgba(0,229,195,0.1)","Reels/Vídeo":"rgba(0,229,195,0.07)","Campanha completa":"rgba(0,229,195,0.13)","Flyer/Banner":"rgba(0,229,195,0.06)","Story":"rgba(0,229,195,0.09)","Outro":"rgba(255,255,255,0.05)"};
const TAG_TXT={"Post redes sociais":"#00E5C3","Reels/Vídeo":"#7EEEE3","Campanha completa":"#00E5C3","Flyer/Banner":"#9CE0D8","Story":"#5DD6CC","Outro":"#7A9A96"};
const EMP_CORES=["#00E5C3","#00C9AB","#009982","#007A68","#00BFA8","#3AFFD3"];
const AV_COLORS=["#00E5C3","#00C9AB","#009982","#007A68","#00BFA8","#3AFFD3","#5DD6CC"];
const STATUS_META={ACTIVE:{label:"Ativo",color:"#00E5C3",bg:"rgba(0,229,195,0.1)"},UNSETTLED:{label:"Pendente",color:"#FFB800",bg:"rgba(255,184,0,0.1)"},DISABLED:{label:"Desativada",color:"#FF4D4D",bg:"rgba(255,77,77,0.1)"}};
const LEMBRETES={todo:(n,t)=>`Olá ${n}! 👋\nNova demanda: *"${t}"*. Inicie no BS Command! 🚀`,progress:(n,t)=>`Olá ${n}! 🎨\nJá iniciou *"${t}"*?\nMova para In Review quando pronto!`,review:(n,t)=>`Olá ${n}! 🔍\n*"${t}"* aguarda revisão.`,approved:(n,t)=>`Olá ${n}! ✅\n*"${t}"* aprovada! Mova para Done.`,done:(n,t)=>`Olá ${n}! 📅\n*"${t}"* programada! 🎉`};

function isAtrasado(p){return p&&new Date(p+"T23:59:59")<new Date();}
function diasAtraso(p){return Math.ceil((new Date()-new Date(p+"T23:59:59"))/86400000);}
function diasRest(p){return p?Math.ceil((new Date(p+"T23:59:59")-new Date())/86400000):null;}
function waLink(m){return"https://wa.me/?text="+encodeURIComponent(m);}
function initials(n){return(n||"").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)||"??";}
function avColor(n){let h=0;for(let c of(n||""))h=c.charCodeAt(0)+h;return AV_COLORS[h%AV_COLORS.length];}
function msgAtraso(nome,titulo,dias){return `⚠️ Olá ${nome}!\n\nVocê está em atraso com a demanda *"${titulo}"*.\nHá *${dias} dia${dias>1?"s":""} de atraso — se atente ao dia da entrega!\n\nAtualize assim que possível. 🙏`;}
function fmtTime(d){return d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});}
function toCard(r){return{id:r.id,cardId:r.card_id,titulo:r.titulo,tipo:r.tipo,responsavel:r.responsavel,prazo:r.prazo||"",descricao:r.descricao||"",cliente:r.cliente||"",prioridade:r.prioridade||"Medium",col:r.col||"todo",briefing:r.briefing||"",empresaId:r.empresa_id,comentarios:r.comentarios||[],criadoEm:r.created_at};}
function toEmp(r){return{id:r.id,nome:r.nome,cor:r.cor||"#00E5C3",responsaveis:r.responsaveis||[]};}
function toCont(r){return{id:r.id,nome:r.nome,numero:r.numero||"",tipo:r.tipo||"equipe"};}
let localCounter=200;

const T={bg:"#050D0B",bg2:"#0A1512",bg3:"#0F1E1A",border:"rgba(0,229,195,0.12)",borderHover:"rgba(0,229,195,0.3)",accent:"#00E5C3",accentDim:"rgba(0,229,195,0.15)",accentGlow:"0 0 24px rgba(0,229,195,0.12)",txt:"#E8F5F3",txtSub:"#7AADA6",txtMuted:"#3D6560",white:"#fff",red:"#FF4D4D",redBg:"rgba(255,77,77,0.08)",warn:"#FFB800",warnBg:"rgba(255,184,0,0.08)"};
const fT="Georgia,'Times New Roman',serif";
const fS="system-ui,-apple-system,sans-serif";

export default function App(){
  const [dbReady,setDbReady]=useState(false);
  const [loading,setLoading]=useState(true);
  const [empresas,setEmpresas]=useState([]);
  const [empAtiva,setEmpAtiva]=useState(null);
  const [cards,setCards]=useState([]);
  const [contatos,setContatos]=useState([]);
  const [notifLog,setNotifLog]=useState([]);
  const [metaAccounts]=useState(buildMeta());
  const [metaLastUpdate,setMetaLastUpdate]=useState(new Date());
  const [metaInsight,setMetaInsight]=useState({});
  const [metaInsightLoading,setMetaInsightLoading]=useState(false);
  const [metaRefreshing,setMetaRefreshing]=useState(false);
  const [view,setView]=useState("home");
  const [metaView,setMetaView]=useState("overview");
  const [metaAcc,setMetaAcc]=useState(null);
  const [sideOpen,setSideOpen]=useState(true);
  const [modalDem,setModalDem]=useState(false);
  const [modalEmp,setModalEmp]=useState(false);
  const [modalContato,setModalContato]=useState(false);
  const [detail,setDetail]=useState(null);
  const [editCard,setEditCard]=useState(null);
  const [editContato,setEditContato]=useState(null);
  const [loadingAI,setLoadingAI]=useState(false);
  const [drag,setDrag]=useState(null);
  const [dragOver,setDragOver]=useState(null);
  const [search,setSearch]=useState("");
  const [fTipo,setFTipo]=useState("all");
  const [fResp,setFResp]=useState("all");
  const [comentario,setComentario]=useState("");
  const [novaEmp,setNovaEmp]=useState({nome:"",cor:"#00E5C3",responsaveis:""});
  const [novoContato,setNovoContato]=useState({nome:"",numero:"",tipo:"equipe"});
  const [form,setForm]=useState({titulo:"",tipo:TIPOS[0],responsavel:"",prazo:"",descricao:"",cliente:"",prioridade:"Medium"});
  const [notifPopup,setNotifPopup]=useState(null);
  const [saveStatus,setSaveStatus]=useState("");

  const empresa=useMemo(()=>empresas.find(e=>e.id===empAtiva),[empresas,empAtiva]);
  const empCards=useMemo(()=>cards.filter(c=>c.empresaId===empAtiva),[cards,empAtiva]);
  const atrasados=useMemo(()=>empCards.filter(c=>isAtrasado(c.prazo)&&c.col!=="done").length,[empCards]);
  const filtered=useMemo(()=>empCards.filter(c=>{
    if(search&&!c.titulo.toLowerCase().includes(search.toLowerCase())&&!c.responsavel.toLowerCase().includes(search.toLowerCase()))return false;
    if(fTipo!=="all"&&c.tipo!==fTipo)return false;
    if(fResp!=="all"&&c.responsavel!==fResp)return false;
    return true;
  }),[empCards,search,fTipo,fResp]);
  const totalAlertas=metaAccounts.reduce((a,acc)=>a+acc.anomalies.length,0);
  const activeAccounts=metaAccounts.filter(a=>a.status==="ACTIVE");

  function showSave(s){setSaveStatus(s);if(s!=="saving")setTimeout(()=>setSaveStatus(""),2500);}

  useEffect(()=>{
    async function load(){
      setLoading(true);
      if(!supabase){
        setEmpresas([{id:"demo-1",nome:"Agência BS",cor:"#00E5C3",responsaveis:["Ana","Bruno","Carla"]},{id:"demo-2",nome:"Loja XYZ",cor:"#00C9AB",responsaveis:["Diego","Lia"]}]);
        setEmpAtiva("demo-1");
        setCards([{id:"d1",cardId:"BSC-001",titulo:"Post Copa do Mundo",tipo:"Post redes sociais",responsavel:"Ana",prazo:"2026-06-10",col:"todo",prioridade:"High",briefing:"",empresaId:"demo-1",criadoEm:new Date().toISOString(),comentarios:[]},{id:"d2",cardId:"BSC-002",titulo:"Reels lançamento",tipo:"Reels/Vídeo",responsavel:"Bruno",prazo:"2026-06-05",col:"progress",prioridade:"Highest",briefing:"",empresaId:"demo-1",criadoEm:new Date().toISOString(),comentarios:[]}]);
        setContatos([{id:"c1",nome:"Você (Business)",numero:"",tipo:"business"},{id:"c2",nome:"Ana",numero:"",tipo:"equipe"},{id:"c3",nome:"Bruno",numero:"",tipo:"equipe"}]);
        setDbReady(false);setLoading(false);return;
      }
      setDbReady(true);
      const [emps,dems,conts,notifs]=await Promise.all([
        db("empresas","select",{order:"created_at",asc:true}),
        db("demandas","select",{order:"created_at",asc:false}),
        db("contatos_wa","select",{order:"created_at",asc:true}),
        db("notificacoes","select",{order:"created_at",asc:false,limit:50}),
      ]);
      const empList=(emps||[]).map(toEmp);
      setEmpresas(empList);setEmpAtiva(empList[0]?.id||null);
      setCards((dems||[]).map(toCard));setContatos((conts||[]).map(toCont));setNotifLog(notifs||[]);
      setLoading(false);
    }
    load();
  },[]);

  useEffect(()=>{
    if(!supabase||!dbReady)return;
    const ch=supabase.channel("bs-realtime")
      .on("postgres_changes",{event:"*",schema:"public",table:"demandas"},()=>{db("demandas","select",{order:"created_at",asc:false}).then(d=>{if(d)setCards(d.map(toCard));});})
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"notificacoes"},payload=>{setNotifLog(p=>[payload.new,...p].slice(0,50));})
      .subscribe();
    return()=>supabase.removeChannel(ch);
  },[dbReady]);

  async function dispararNotif(card,tipo){
    const emp=empresas.find(e=>e.id===card.empresaId);
    const msg=tipo==="atraso"?msgAtraso(card.responsavel,card.titulo,diasAtraso(card.prazo)):LEMBRETES[card.col]?.(card.responsavel,card.titulo)||"";
    const log={titulo:card.titulo,responsavel:card.responsavel,empresa:emp?.nome||"",tipo,msg,hora:fmtTime(new Date()),link:waLink(msg),created_at:new Date().toISOString()};
    setNotifLog(p=>[{id:Date.now(),...log},...p].slice(0,50));
    setNotifPopup({id:Date.now(),...log});setTimeout(()=>setNotifPopup(null),5000);
    if(dbReady)await db("notificacoes","insert",{row:log});
  }

  useEffect(()=>{const iv=setInterval(()=>{cards.forEach(c=>{if(c.col!=="done"&&isAtrasado(c.prazo))dispararNotif(c,"atraso");});},30000);return()=>clearInterval(iv);},[cards,dbReady]);

  const refreshMeta=useCallback(async(silent=false)=>{if(!silent)setMetaRefreshing(true);setMetaLastUpdate(new Date());if(!silent)setMetaRefreshing(false);},[]);
  useEffect(()=>{const iv=setInterval(()=>refreshMeta(true),5*60*1000);return()=>clearInterval(iv);},[refreshMeta]);

  async function gerarInsightMeta(acc){
    if(metaInsight[acc.id])return;setMetaInsightLoading(true);
    try{
      const key=import.meta?.env?.VITE_ANTHROPIC_KEY||"";
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:350,messages:[{role:"user",content:`Especialista Meta Ads. Dados (${new Date().toLocaleDateString("pt-BR")}):\nConta: ${acc.name}\nContexto: ${acc.context}\nTendências: ${acc.trends.map(t=>`${t.name}: ${t.metric} ${t.change} (${t.trend})`).join(", ")||"sem dados"}\nAlertas: ${acc.anomalies.map(a=>a.detail).join("; ")||"nenhum"}\n\nDê 2-3 insights práticos focados em CPA/CPL. Máximo 100 palavras.`}]})});
      const d=await r.json();setMetaInsight(p=>({...p,[acc.id]:d.content?.map(b=>b.text||"").join("")||""}));
    }catch{setMetaInsight(p=>({...p,[acc.id]:"Erro ao gerar insight."}));}finally{setMetaInsightLoading(false);}
  }

  async function gerarBriefing(card){
    setLoadingAI(true);
    try{
      const key=import.meta?.env?.VITE_ANTHROPIC_KEY||"";
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:`Gere um briefing profissional para:\nTítulo: ${card.titulo}\nCliente: ${card.cliente||empresa?.nome}\nTipo: ${card.tipo}\nResponsável: ${card.responsavel}\nPrazo: ${card.prazo||"a definir"}\nDescrição: ${card.descricao}\n\nInclua: objetivo, público-alvo, formato, tom e pontos de atenção.`}]})});
      const d=await r.json();return d.content?.map(b=>b.text||"").join("")||"Erro.";
    }catch{return"Erro.";}finally{setLoadingAI(false);}
  }

  async function handleSubmit(){
    if(!form.titulo.trim()||!form.responsavel)return;showSave("saving");
    const id=++localCounter;
    const novo={...form,id,cardId:"BSC-"+String(id).padStart(3,"0"),col:"todo",briefing:"",empresaId:empAtiva,criadoEm:new Date().toISOString(),comentarios:[]};
    const briefing=await gerarBriefing(novo);novo.briefing=briefing;
    if(dbReady){const saved=await db("demandas","insert",{row:{card_id:novo.cardId,titulo:novo.titulo,tipo:novo.tipo,responsavel:novo.responsavel,prazo:novo.prazo||null,descricao:novo.descricao,cliente:novo.cliente,prioridade:novo.prioridade,col:novo.col,briefing:novo.briefing,empresa_id:novo.empresaId,comentarios:[]}});if(saved){novo.id=saved.id;showSave("saved");}else showSave("error");}
    setCards(p=>[novo,...p]);setForm({titulo:"",tipo:TIPOS[0],responsavel:empresa?.responsaveis[0]||"",prazo:"",descricao:"",cliente:"",prioridade:"Medium"});setModalDem(false);
    setTimeout(()=>dispararNotif(novo,"lembrete"),500);
  }

  async function moverCard(id,col){
    setCards(p=>p.map(c=>c.id===id?{...c,col}:c));if(detail?.id===id)setDetail(p=>({...p,col}));
    if(dbReady){showSave("saving");const r=await db("demandas","update",{id,row:{col,updated_at:new Date().toISOString()}});showSave(r?"saved":"error");}
    const card=cards.find(c=>c.id===id);if(card)setTimeout(()=>dispararNotif({...card,col},"lembrete"),300);
  }

  async function deletarCard(id){setCards(p=>p.filter(c=>c.id!==id));setDetail(null);setEditCard(null);if(dbReady)await db("demandas","delete",{id});}

  async function saveEdit(){
    showSave("saving");setCards(p=>p.map(c=>c.id===editCard.id?{...editCard}:c));setDetail({...editCard});
    if(dbReady){const r=await db("demandas","update",{id:editCard.id,row:{titulo:editCard.titulo,tipo:editCard.tipo,responsavel:editCard.responsavel,prazo:editCard.prazo||null,prioridade:editCard.prioridade,col:editCard.col,updated_at:new Date().toISOString()}});showSave(r?"saved":"error");}
    setEditCard(null);
  }

  async function addComentario(){
    if(!comentario.trim()||!detail)return;
    const novos=[...(detail.comentarios||[]),{texto:comentario,data:new Date().toLocaleString("pt-BR"),autor:"Você"}];
    const u={...detail,comentarios:novos};setCards(p=>p.map(c=>c.id===u.id?u:c));setDetail(u);setComentario("");
    if(dbReady){showSave("saving");const r=await db("demandas","update",{id:detail.id,row:{comentarios:novos,updated_at:new Date().toISOString()}});showSave(r?"saved":"error");}
  }

  async function criarEmpresa(){
    if(!novaEmp.nome.trim())return;showSave("saving");
    const resps=novaEmp.responsaveis.split(",").map(r=>r.trim()).filter(Boolean);
    const nova={id:Date.now(),nome:novaEmp.nome,cor:novaEmp.cor,responsaveis:resps.length?resps:["Responsável"]};
    if(dbReady){const saved=await db("empresas","insert",{row:{nome:nova.nome,cor:nova.cor,responsaveis:nova.responsaveis}});if(saved){nova.id=saved.id;showSave("saved");}else showSave("error");}
    setEmpresas(p=>[...p,nova]);setEmpAtiva(nova.id);setNovaEmp({nome:"",cor:"#00E5C3",responsaveis:""});setModalEmp(false);
  }

  async function salvarContato(){
    const num=novoContato.numero.replace(/\D/g,"");if(!novoContato.nome.trim())return;showSave("saving");
    if(editContato){
      setContatos(p=>p.map(c=>c.id===editContato.id?{...c,...novoContato,numero:num}:c));
      if(dbReady){const r=await db("contatos_wa","update",{id:editContato.id,row:{nome:novoContato.nome,numero:num,tipo:novoContato.tipo}});showSave(r?"saved":"error");}
    }else{
      const novo={id:Date.now(),nome:novoContato.nome,numero:num,tipo:novoContato.tipo};
      if(dbReady){const saved=await db("contatos_wa","insert",{row:{nome:novo.nome,numero:num,tipo:novo.tipo}});if(saved){novo.id=saved.id;showSave("saved");}else showSave("error");}
      setContatos(p=>[...p,novo]);
    }
    setNovoContato({nome:"",numero:"",tipo:"equipe"});setEditContato(null);setModalContato(false);
  }

  function abrirWhats(numero,msg=""){const n=(numero||"").replace(/\D/g,"");window.open(n?`https://wa.me/${n}${msg?"?text="+encodeURIComponent(msg):""}`:waLink(msg),"_blank");}

  const inp={background:"rgba(0,229,195,0.04)",border:"1px solid rgba(0,229,195,0.12)",borderRadius:6,padding:"8px 12px",color:"#E8F5F3",fontSize:13,width:"100%",boxSizing:"border-box",fontFamily:fS,outline:"none"};
  const sel={...inp,cursor:"pointer"};
  const btnA=(sm)=>({background:"#00E5C3",color:"#050D0B",border:"none",borderRadius:6,padding:sm?"5px 12px":"8px 18px",fontSize:sm?12:13,fontWeight:700,cursor:"pointer",fontFamily:fS});
  const btnG={background:"transparent",color:"#7AADA6",border:"1px solid rgba(0,229,195,0.12)",borderRadius:6,padding:"7px 14px",fontSize:13,cursor:"pointer",fontFamily:fS};
  const btnM={background:"rgba(24,119,242,0.12)",color:"#4BA3F5",border:"1px solid rgba(24,119,242,0.25)",borderRadius:6,padding:"6px 12px",fontSize:12,cursor:"pointer",fontFamily:fS,fontWeight:600,textDecoration:"none",display:"inline-block"};
  const lbl={fontSize:10,color:T.txtMuted,marginBottom:4,display:"block",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:fS};
  const tagS=(t)=>({background:TAG_BG[t]||"rgba(255,255,255,0.04)",color:TAG_TXT[t]||T.txtSub,fontSize:9,fontWeight:700,borderRadius:3,padding:"2px 7px",display:"inline-block",letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:fS,border:"1px solid "+(TAG_TXT[t]||T.txtSub)+"33"});
  const av=(n,sz=22)=>({width:sz,height:sz,borderRadius:"50%",background:"transparent",border:"1.5px solid "+avColor(n),display:"flex",alignItems:"center",justifyContent:"center",fontSize:sz>24?10:8,fontWeight:700,color:avColor(n),flexShrink:0});
  const sec=(glow)=>({background:T.bg2,border:"1px solid "+(glow?T.borderHover:T.border),borderRadius:10,padding:16,boxShadow:glow?T.accentGlow:"none"});

  function Donut({segs,sz=88}){
    const r=30,cx=sz/2,cy=sz/2,sw=10,circ=2*Math.PI*r;
    const total=segs.reduce((a,s)=>a+s.v,0)||1;let off=0;
    return(<svg width={sz} height={sz}><circle cx={cx} cy={cy} r={r} fill="none" stroke={T.border} strokeWidth={sw}/>{segs.map((s,i)=>{const dash=(s.v/total)*circ;const el=(<circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.c} strokeWidth={sw} strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={-off*circ/total+circ*0.25} opacity={0.85}/>);off+=s.v;return el;})}<text x={cx} y={cy+5} textAnchor="middle" fontSize={14} fontWeight={700} fill={T.accent} fontFamily={fS}>{total}</text></svg>);
  }

  if(loading)return(<div style={{background:T.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,fontFamily:fS}}><div style={{width:40,height:40,borderRadius:10,background:T.accentDim,border:"1px solid "+T.borderHover,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:T.accent}}>BS</div><div style={{fontSize:14,color:T.txtSub}}>Carregando BS Command…</div><style>{`@keyframes ld{from{transform:translateX(-100%)}to{transform:translateX(200%)}}`}</style><div style={{width:120,height:2,background:T.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",background:T.accent,width:"60%",borderRadius:2,animation:"ld 1s ease-in-out infinite alternate"}}/></div></div>);

  const NAVS=[["home","Início"],["meta","Meta"],["board","Board"],["wa","WhatsApp"],["settings","Config"]];

  function Home(){
    return(<div style={{padding:"24px 28px",display:"flex",flexDirection:"column",gap:24,maxWidth:1100}}>
      <div><div style={{fontSize:11,color:T.accent,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:10,fontFamily:fS}}>· ESTRATÉGIA · CONTEÚDO · TRÁFEGO</div>
      <h1 style={{margin:0,fontSize:34,fontWeight:800,color:T.white,lineHeight:1.15,fontFamily:fT}}>Gestão estratégica<br/>para marcas que <em style={{color:T.accent,fontStyle:"italic"}}>crescem.</em></h1>
      <p style={{margin:"10px 0 0",fontSize:14,color:T.txtSub,fontFamily:fS}}>Controle campanhas, demandas e performance em um único painel.</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10}}>
        {[["Ativas",cards.filter(c=>c.col!=="done").length,T.accent],["Atrasadas",cards.filter(c=>isAtrasado(c.prazo)&&c.col!=="done").length,T.red],["Contas Meta",activeAccounts.length,"#4BA3F5"],["Alertas Meta",totalAlertas,T.warn],["Concluídas",cards.filter(c=>c.col==="done").length,T.txtSub]].map(([l,v,c])=>(
          <div key={l} style={sec(c===T.accent)}><div style={{fontSize:10,color:T.txtMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4,fontFamily:fS}}>{l}</div><div style={{fontSize:34,fontWeight:800,color:c,lineHeight:1,fontFamily:fS}}>{v}</div></div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={sec(false)}>
          <div style={{fontSize:11,color:T.txtMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14,fontFamily:fS}}>Board — {empresa?.nome}</div>
          {COLS.map(col=>{const n=empCards.filter(c=>c.col===col.id).length;const pct=empCards.length?Math.round((n/empCards.length)*100):0;return(<div key={col.id} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4,fontFamily:fS}}><span style={{color:T.txtSub}}>{col.label}</span><span style={{color:T.accent,fontWeight:700}}>{n}</span></div><div style={{height:3,background:"rgba(0,229,195,0.08)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",background:T.accent,width:pct+"%",borderRadius:2,opacity:0.8}}/></div></div>);})}
        </div>
        <div style={{...sec(true),cursor:"pointer"}} onClick={()=>{setView("meta");setMetaView("overview");}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><div style={{width:26,height:26,borderRadius:6,background:"rgba(24,119,242,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#4BA3F5"}}>f</div><div style={{fontSize:13,fontWeight:700,color:T.white,fontFamily:fS}}>Meta Business</div><div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}><div style={{width:6,height:6,borderRadius:"50%",background:T.accent}}/><span style={{fontSize:10,color:T.accent,fontFamily:fS}}>Live</span></div></div>
          {[["Ativas",activeAccounts.length,T.accent],["Alertas",totalAlertas,T.red],["Atenção",metaAccounts.flatMap(a=>a.trends.filter(t=>t.trend==="BAD")).length,T.warn]].map(([l,v,c])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,paddingBottom:10,borderBottom:"1px solid "+T.border}}><span style={{fontSize:12,color:T.txtSub,fontFamily:fS}}>{l}</span><span style={{fontSize:18,fontWeight:800,color:c,fontFamily:fS}}>{v}</span></div>))}
          <div style={{fontSize:11,color:T.accent,fontWeight:600,fontFamily:fS}}>Ver painel completo →</div>
        </div>
      </div>
      <div>
        <div style={{fontSize:11,color:T.txtMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14,fontFamily:fS}}>Empresas</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
          {empresas.map(emp=>{const ec=cards.filter(c=>c.empresaId===emp.id);const at=ec.filter(c=>isAtrasado(c.prazo)&&c.col!=="done").length;const done=ec.filter(c=>c.col==="done").length;const pct=ec.length?Math.round((done/ec.length)*100):0;
            return(<div key={emp.id} onClick={()=>{setEmpAtiva(emp.id);setView("board");}} style={{...sec(empAtiva===emp.id),cursor:"pointer",borderTop:"2px solid "+emp.cor}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><div style={{width:8,height:8,borderRadius:"50%",background:emp.cor}}/><div style={{fontSize:14,fontWeight:700,color:T.white,flex:1,fontFamily:fT}}>{emp.nome}</div>{at>0&&<span style={{background:T.redBg,color:T.red,borderRadius:4,fontSize:10,fontWeight:700,padding:"2px 7px"}}>⚠ {at}</span>}</div>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                <Donut sz={70} segs={[{v:ec.filter(c=>c.col==="todo").length,c:"#4BA3F5"},{v:ec.filter(c=>c.col==="progress").length,c:T.warn},{v:done,c:T.accent},{v:at,c:T.red}]}/>
                <div style={{flex:1}}>{[["Todo",ec.filter(c=>c.col==="todo").length,"#4BA3F5"],["Prog",ec.filter(c=>c.col==="progress").length,T.warn],["Done",done,T.accent],["Atraso",at,T.red]].map(([l,v,c])=>(<div key={l} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{width:5,height:5,borderRadius:"50%",background:c,flexShrink:0}}/><span style={{fontSize:10,color:T.txtSub,flex:1,fontFamily:fS}}>{l}</span><span style={{fontSize:11,fontWeight:700,color:c,fontFamily:fS}}>{v}</span></div>))}</div>
              </div>
              <div style={{height:2,background:"rgba(0,229,195,0.06)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",background:emp.cor,width:pct+"%",borderRadius:2}}/></div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:10,color:T.txtMuted,fontFamily:fS}}><span>{ec.length} demandas</span><span style={{color:T.accent,fontWeight:700}}>{pct}% concluído</span></div>
            </div>);
          })}
          <div onClick={()=>setModalEmp(true)} style={{background:"transparent",border:"1px dashed "+T.border,borderRadius:10,padding:16,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:140,color:T.txtMuted,gap:6,fontFamily:fS}}><div style={{fontSize:22,color:T.border}}>+</div><div style={{fontSize:12}}>Adicionar empresa</div></div>
        </div>
      </div>
    </div>);
  }

  function Board(){
    return(<>
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 20px",borderBottom:"1px solid "+T.border,flexWrap:"wrap",background:T.bg}}>
        <input placeholder="Buscar…" style={{...inp,width:150}} value={search} onChange={e=>setSearch(e.target.value)}/>
        <select style={{...sel,width:"auto"}} value={fTipo} onChange={e=>setFTipo(e.target.value)}><option value="all">Tipo: Todos</option>{TIPOS.map(t=><option key={t}>{t}</option>)}</select>
        <select style={{...sel,width:"auto"}} value={fResp} onChange={e=>setFResp(e.target.value)}><option value="all">Resp.: Todos</option>{(empresa?.responsaveis||[]).map(r=><option key={r}>{r}</option>)}</select>
        <span style={{marginLeft:"auto",fontSize:11,color:T.txtMuted,fontFamily:fS}}>{filtered.length} issues</span>
      </div>
      <div style={{display:"flex",gap:10,padding:16,overflowX:"auto",alignItems:"flex-start",flex:1}}>
        {COLS.map(col=>{const cc=filtered.filter(c=>c.col===col.id);const over=dragOver===col.id;
          return(<div key={col.id} style={{minWidth:205,flex:"0 0 205px",background:over?"rgba(0,229,195,0.04)":T.bg2,border:"1px solid "+(over?T.borderHover:T.border),borderRadius:8,display:"flex",flexDirection:"column"}} onDragOver={e=>{e.preventDefault();setDragOver(col.id);}} onDrop={()=>{if(drag)moverCard(drag,col.id);setDrag(null);setDragOver(null);}}>
            <div style={{padding:"10px 12px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",gap:6}}>
              {col.id==="done"&&<span style={{color:T.accent,fontSize:11}}>✓ </span>}
              <span style={{fontSize:10,fontWeight:700,color:T.txtMuted,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:fS}}>{col.label}</span>
              <span style={{marginLeft:"auto",fontSize:10,color:T.txtMuted,background:"rgba(0,229,195,0.06)",borderRadius:8,padding:"1px 7px",fontFamily:fS}}>{cc.length}</span>
            </div>
            <div style={{padding:8,display:"flex",flexDirection:"column",gap:6,minHeight:50}}>
              {cc.map(c=>{const at=isAtrasado(c.prazo)&&c.col!=="done";const dr=diasRest(c.prazo);
                return(<div key={c.id} draggable style={{background:T.bg,border:"1px solid "+(at?"rgba(255,77,77,0.4)":T.border),borderRadius:8,padding:"12px 14px",cursor:"pointer"}} onDragStart={()=>setDrag(c.id)} onClick={()=>{setDetail(c);setEditCard(null);}}>
                  {at&&<div style={{fontSize:9,color:T.red,fontWeight:700,marginBottom:4,fontFamily:fS}}>⚠ ATRASADO</div>}
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:T.txtMuted,marginBottom:4,fontFamily:fS}}><span>{c.cardId}</span><span style={{color:PRIO_C[c.prioridade||"Medium"]}}>{PRIO_I[c.prioridade||"Medium"]}</span></div>
                  <div style={{fontSize:13,color:T.txt,fontWeight:600,lineHeight:1.35,marginBottom:7,fontFamily:fT}}>{c.titulo}</div>
                  <span style={tagS(c.tipo)}>{c.tipo}</span>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}>
                    <div style={av(c.responsavel)}>{initials(c.responsavel)}</div>
                    {c.prazo&&<span style={{fontSize:9,color:at?T.red:dr!==null&&dr<=2?T.warn:T.txtMuted,fontFamily:fS}}>{at?diasAtraso(c.prazo)+"d":dr===0?"Hoje":dr+"d"}</span>}
                  </div>
                </div>);
              })}
              <div onClick={()=>{setForm(f=>({...f,responsavel:empresa?.responsaveis[0]||""}));setModalDem(true);}} style={{border:"1px dashed "+T.border,borderRadius:6,padding:"7px",fontSize:11,color:T.txtMuted,cursor:"pointer",textAlign:"center",fontFamily:fS}}>+ Add</div>
            </div>
          </div>);
        })}
      </div>
    </>);
  }

  function MetaPanel(){
    if(metaView==="detail"&&metaAcc){
      const acc=metaAcc;const st=STATUS_META[acc.status]||STATUS_META.ACTIVE;const insight=metaInsight[acc.id];
      return(<div style={{padding:"24px 28px",display:"flex",flexDirection:"column",gap:16,maxWidth:680}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <button onClick={()=>setMetaView("overview")} style={{...btnG,fontSize:12}}>← Voltar</button>
          <div style={{flex:1}}><div style={{fontSize:18,fontWeight:800,color:T.white,fontFamily:fT}}>{acc.name}</div><div style={{fontSize:11,color:T.txtSub,fontFamily:fS}}>{acc.business}</div></div>
          <span style={{background:st.bg,color:st.color,borderRadius:5,fontSize:10,fontWeight:700,padding:"4px 10px",fontFamily:fS,textTransform:"uppercase"}}>{st.label}</span>
          <a href={`https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=${acc.id}`} target="_blank" rel="noopener noreferrer" style={btnM}>Abrir ↗</a>
        </div>
        {acc.context&&<div style={{...sec(false),borderLeft:"2px solid "+T.accent}}><div style={{fontSize:10,color:T.txtMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5,fontFamily:fS}}>Contexto</div><div style={{fontSize:13,color:T.txt,lineHeight:1.6,fontFamily:fS}}>{acc.context}</div></div>}
        <div style={{...sec(true),border:"1px solid "+T.borderHover}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <div style={{width:22,height:22,borderRadius:5,background:T.accentDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:T.accent}}>AI</div>
            <div style={{fontSize:11,color:T.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:fS}}>Insight IA · CPA/CPL</div>
            {!insight&&<button onClick={()=>gerarInsightMeta(acc)} style={{...btnA(true),marginLeft:"auto"}}>{metaInsightLoading?"…":"Gerar ✨"}</button>}
          </div>
          {insight?<div style={{fontSize:13,color:T.txtSub,lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:fS}}>{insight}</div>:<div style={{fontSize:12,color:T.txtMuted,fontFamily:fS}}>Clique em Gerar insight.</div>}
        </div>
        {acc.anomalies.length>0&&<div style={{background:T.redBg,border:"1px solid rgba(255,77,77,0.25)",borderRadius:10,padding:14}}><div style={{fontSize:11,fontWeight:700,color:T.red,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10,fontFamily:fS}}>⚠ Alertas</div>{acc.anomalies.map((al,i)=>(<div key={i} style={{marginBottom:10}}><div style={{fontSize:13,fontWeight:700,color:"#FF7070",fontFamily:fT,marginBottom:4}}>{al.label}</div><div style={{fontSize:12,color:T.txtSub,lineHeight:1.6,marginBottom:8,fontFamily:fS}}>{al.detail}</div><a href={al.link} target="_blank" rel="noopener noreferrer" style={btnM}>Ver no Ads Manager ↗</a></div>))}</div>}
        {acc.trends.length>0&&<div style={sec(false)}><div style={{fontSize:11,fontWeight:700,color:T.white,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12,fontFamily:fS}}>Tendências</div>{acc.trends.map((t,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:"rgba(0,229,195,0.02)",borderRadius:6,marginBottom:6,border:"1px solid "+(t.trend==="GOOD"?"rgba(0,229,195,0.2)":t.trend==="NEW"?"rgba(75,163,245,0.2)":"rgba(255,184,0,0.12)")}}><span style={{fontSize:14,flexShrink:0}}>{t.trend==="GOOD"?"✅":t.trend==="NEW"?"✦":"⚠"}</span><span style={{fontSize:13,color:T.txt,flex:1,fontFamily:fS}}>{t.name}</span><span style={{fontSize:10,color:T.txtMuted,fontFamily:fS}}>{t.metric}</span>{t.change!=="—"&&<span style={{fontSize:12,fontWeight:700,color:t.trend==="GOOD"?T.accent:t.trend==="NEW"?"#4BA3F5":T.warn,fontFamily:fS}}>{t.change}</span>}<span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:4,background:t.trend==="GOOD"?"rgba(0,229,195,0.1)":t.trend==="NEW"?"rgba(75,163,245,0.1)":"rgba(255,184,0,0.1)",color:t.trend==="GOOD"?T.accent:t.trend==="NEW"?"#4BA3F5":T.warn,fontFamily:fS,textTransform:"uppercase"}}>{t.trend==="GOOD"?"BOM":t.trend==="NEW"?"NOVO":"ATENÇÃO"}</span><a href={`https://adsmanager.facebook.com/adsmanager/manage/ads?act=${acc.id}&selected_ad_ids=${t.id}`} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:"#4BA3F5",textDecoration:"none",fontFamily:fS}}>Ver ↗</a></div>))}</div>}
      </div>);
    }
    return(<div style={{padding:"24px 28px",display:"flex",flexDirection:"column",gap:20,maxWidth:1000}}>
      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div style={{width:36,height:36,borderRadius:9,background:"rgba(24,119,242,0.15)",border:"1px solid rgba(24,119,242,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"#4BA3F5"}}>f</div>
        <div><h2 style={{margin:0,fontSize:20,fontWeight:800,color:T.white,fontFamily:fT}}>Meta Business</h2><div style={{fontSize:11,color:T.txtSub,fontFamily:fS}}>{activeAccounts.length} contas · {fmtTime(metaLastUpdate)}</div></div>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}><button onClick={()=>{setMetaRefreshing(true);setMetaLastUpdate(new Date());setMetaInsight({});setTimeout(()=>setMetaRefreshing(false),1000);}} disabled={metaRefreshing} style={{...btnG,fontSize:12}}>{metaRefreshing?"…":"↻ Atualizar"}</button><a href="https://adsmanager.facebook.com" target="_blank" rel="noopener noreferrer" style={btnM}>Ads Manager ↗</a></div>
      </div>
      <div style={{background:"rgba(0,229,195,0.04)",border:"1px solid "+T.border,borderRadius:8,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,fontSize:12,fontFamily:fS}}><div style={{width:8,height:8,borderRadius:"50%",background:T.accent,flexShrink:0}}/><span style={{color:T.txtSub}}>Sincronizado · <strong style={{color:T.accent}}>{fmtTime(metaLastUpdate)}</strong> · Auto-refresh 5 min</span></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10}}>
        {[["Ativas",activeAccounts.length,T.accent],["Alertas",totalAlertas,T.red],["Tend. boa",metaAccounts.flatMap(a=>a.trends.filter(t=>t.trend==="GOOD")).length,T.accent],["Atenção",metaAccounts.flatMap(a=>a.trends.filter(t=>t.trend==="BAD")).length,T.warn]].map(([l,v,c])=>(<div key={l} style={sec(false)}><div style={{fontSize:10,color:T.txtMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4,fontFamily:fS}}>{l}</div><div style={{fontSize:30,fontWeight:800,color:c,fontFamily:fS}}>{v}</div></div>))}
      </div>
      {totalAlertas>0&&<div style={{background:T.redBg,border:"1px solid rgba(255,77,77,0.25)",borderRadius:10,padding:14}}><div style={{fontSize:11,fontWeight:700,color:T.red,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10,fontFamily:fS}}>⚠ Alertas críticos</div>{metaAccounts.filter(a=>a.anomalies.length>0).map(acc=>acc.anomalies.map((al,i)=>(<div key={acc.id+i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(255,77,77,0.1)"}}><span style={{fontSize:16,flexShrink:0}}>{al.type==="account_disabled"?"🚫":"👥"}</span><div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:T.red,fontFamily:fS}}>{al.label} — {acc.name}</div><div style={{fontSize:11,color:T.txtSub,marginTop:2,fontFamily:fS}}>{al.detail}</div></div><a href={al.link} target="_blank" rel="noopener noreferrer" style={btnM}>Ver ↗</a></div>)))}</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
        {metaAccounts.map(acc=>{const st=STATUS_META[acc.status]||STATUS_META.ACTIVE;const bads=acc.trends.filter(t=>t.trend==="BAD").length;const goods=acc.trends.filter(t=>t.trend==="GOOD").length;const news=acc.trends.filter(t=>t.trend==="NEW").length;const hasAlert=acc.anomalies.length>0;
          return(<div key={acc.id} onClick={()=>{setMetaAcc(acc);setMetaView("detail");gerarInsightMeta(acc);}} style={{...sec(false),cursor:"pointer",borderLeft:"2px solid "+(hasAlert?T.red:"rgba(24,119,242,0.4)")}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}><div><div style={{fontSize:13,fontWeight:700,color:T.white,fontFamily:fT,marginBottom:2}}>{acc.name}</div><div style={{fontSize:10,color:T.txtMuted,fontFamily:fS}}>{acc.business||"—"}</div></div><span style={{background:st.bg,color:st.color,borderRadius:5,fontSize:9,fontWeight:700,padding:"3px 8px",flexShrink:0,fontFamily:fS,textTransform:"uppercase"}}>{st.label}</span></div>
            {acc.context&&<div style={{fontSize:11,color:T.txtSub,marginBottom:8,lineHeight:1.5,fontFamily:fS,borderLeft:"2px solid rgba(0,229,195,0.2)",paddingLeft:8}}>{acc.context}</div>}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
              {goods>0&&<span style={{background:"rgba(0,229,195,0.08)",color:T.accent,borderRadius:4,fontSize:9,fontWeight:700,padding:"2px 7px",border:"1px solid rgba(0,229,195,0.2)",fontFamily:fS}}>✓ {goods}</span>}
              {bads>0&&<span style={{background:T.warnBg,color:T.warn,borderRadius:4,fontSize:9,fontWeight:700,padding:"2px 7px",border:"1px solid rgba(255,184,0,0.2)",fontFamily:fS}}>↓ {bads}</span>}
              {news>0&&<span style={{background:"rgba(75,163,245,0.08)",color:"#4BA3F5",borderRadius:4,fontSize:9,fontWeight:700,padding:"2px 7px",border:"1px solid rgba(75,163,245,0.2)",fontFamily:fS}}>✦ {news}</span>}
              {hasAlert&&<span style={{background:T.redBg,color:T.red,borderRadius:4,fontSize:9,fontWeight:700,padding:"2px 7px",border:"1px solid rgba(255,77,77,0.2)",fontFamily:fS}}>⚠ {acc.anomalies.length}</span>}
            </div>
            <div style={{fontSize:10,color:T.accent,fontWeight:600,fontFamily:fS}}>Analisar com IA →</div>
          </div>);
        })}
      </div>
    </div>);
  }

  function WAPanel(){
    const business=contatos.find(c=>c.tipo==="business");const equipe=contatos.filter(c=>c.tipo==="equipe");
    return(<div style={{padding:"24px 28px",display:"flex",flexDirection:"column",gap:20,maxWidth:900}}>
      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}><div style={{width:36,height:36,borderRadius:9,background:"rgba(37,211,102,0.15)",border:"1px solid rgba(37,211,102,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📲</div><div><h2 style={{margin:0,fontSize:20,fontWeight:800,color:T.white,fontFamily:fT}}>WhatsApp</h2><div style={{fontSize:11,color:T.txtSub,fontFamily:fS}}>{contatos.length} contatos · {notifLog.length} mensagens</div></div><button onClick={()=>{setEditContato(null);setNovoContato({nome:"",numero:"",tipo:"equipe"});setModalContato(true);}} style={{...btnA(true),marginLeft:"auto",background:"#25D366",color:"#fff"}}>+ Contato</button></div>
      <div style={{...sec(true),border:"1px solid rgba(37,211,102,0.3)"}}>
        <div style={{fontSize:10,color:"#25D366",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:12,fontFamily:fS}}>Meu WhatsApp Business</div>
        {business?.numero?(<div style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:48,height:48,borderRadius:"50%",background:"rgba(37,211,102,0.1)",border:"2px solid rgba(37,211,102,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🏢</div><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:T.white,fontFamily:fT}}>{business.nome}</div><div style={{fontSize:12,color:"#25D366",fontFamily:fS}}>+{business.numero}</div></div><button onClick={()=>abrirWhats(business.numero)} style={{background:"#25D366",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:fS}}>Abrir ↗</button><button onClick={()=>{setEditContato(business);setNovoContato({nome:business.nome,numero:business.numero,tipo:"business"});setModalContato(true);}} style={{...btnG,fontSize:12,padding:"6px 12px"}}>✏</button></div>)
        :(<div style={{display:"flex",alignItems:"center",gap:12}}><div style={{fontSize:13,color:T.txtSub,fontFamily:fS,flex:1}}>Cadastre seu número do WhatsApp Business.</div><button onClick={()=>{setEditContato(null);setNovoContato({nome:"Você (Business)",numero:"",tipo:"business"});setModalContato(true);}} style={{background:"#25D366",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:fS}}>Cadastrar</button></div>)}
      </div>
      <div><div style={{fontSize:10,color:T.txtMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:12,fontFamily:fS}}>Equipe</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10}}>
          {equipe.map(c=>(<div key={c.id} style={{...sec(false),display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><div style={av(c.nome,40)}>{initials(c.nome)}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:T.white,fontFamily:fT}}>{c.nome}</div>{c.numero?<div style={{fontSize:11,color:"#25D366",fontFamily:fS}}>+{c.numero}</div>:<div style={{fontSize:11,color:T.txtMuted,fontFamily:fS}}>Sem número</div>}</div><button onClick={()=>{setEditContato(c);setNovoContato({nome:c.nome,numero:c.numero,tipo:"equipe"});setModalContato(true);}} style={{background:"none",border:"none",color:T.txtMuted,cursor:"pointer",fontSize:14}}>✏</button></div>
            <div style={{display:"flex",gap:6}}>
              {c.numero?(<><button onClick={()=>abrirWhats(c.numero)} style={{flex:1,background:"#25D366",color:"#fff",border:"none",borderRadius:6,padding:"7px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:fS}}>💬 Conversar</button><button onClick={()=>{const dm=cards.filter(x=>x.responsavel===c.nome&&x.col!=="done");if(dm.length>0)abrirWhats(c.numero,LEMBRETES[dm[0].col]?.(c.nome,dm[0].titulo)||"");}} style={{flex:1,background:"rgba(0,229,195,0.1)",color:T.accent,border:"1px solid "+T.border,borderRadius:6,padding:"7px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:fS}}>📋 Lembrete</button></>)
              :(<button onClick={()=>{setEditContato(c);setNovoContato({nome:c.nome,numero:"",tipo:"equipe"});setModalContato(true);}} style={{flex:1,background:"rgba(37,211,102,0.08)",color:"#25D366",border:"1px solid rgba(37,211,102,0.2)",borderRadius:6,padding:"7px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:fS}}>+ Adicionar número</button>)}
            </div>
          </div>))}
          <div onClick={()=>{setEditContato(null);setNovoContato({nome:"",numero:"",tipo:"equipe"});setModalContato(true);}} style={{background:"transparent",border:"1px dashed "+T.border,borderRadius:10,padding:16,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:120,color:T.txtMuted,gap:6,fontFamily:fS}}><div style={{fontSize:22,color:T.border}}>+</div><div style={{fontSize:12}}>Novo contato</div></div>
        </div>
      </div>
      {notifLog.length>0&&<div><div style={{fontSize:10,color:T.txtMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:12,fontFamily:fS}}>Histórico</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {notifLog.slice(0,15).map((n,i)=>{const cont=contatos.find(c=>c.nome===n.responsavel);
            return(<div key={n.id||i} style={{...sec(false),display:"flex",alignItems:"flex-start",gap:12}}><div style={av(n.responsavel,36)}>{initials(n.responsavel)}</div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}><span style={{fontSize:13,fontWeight:700,color:T.white,fontFamily:fS}}>{n.responsavel}</span><span style={{fontSize:10,color:n.tipo==="atraso"?T.red:T.accent,background:n.tipo==="atraso"?T.redBg:"rgba(0,229,195,0.08)",borderRadius:4,padding:"1px 7px",fontFamily:fS,fontWeight:700}}>{n.tipo==="atraso"?"⚠ Atraso":"📋 Lembrete"}</span><span style={{fontSize:10,color:T.txtMuted,fontFamily:fS,marginLeft:"auto"}}>{n.hora||fmtTime(new Date(n.created_at||Date.now()))}</span></div><div style={{fontSize:12,color:T.txtSub,fontFamily:fS,lineHeight:1.5,overflow:"hidden",maxHeight:38}}>{(n.msg||"").split("\n")[0]}</div></div>
              <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>{cont?.numero&&<button onClick={()=>abrirWhats(cont.numero,n.msg)} style={{background:"#25D366",color:"#fff",border:"none",borderRadius:6,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:fS}}>Enviar ↗</button>}<button onClick={()=>abrirWhats("",n.msg)} style={{...btnG,fontSize:11,padding:"4px 8px"}}>WA Web</button></div>
            </div>);
          })}
        </div>
      </div>}
    </div>);
  }

  function DetailPanel(){
    if(!detail)return null;
    const cur=editCard||detail;const at=isAtrasado(detail.prazo)&&detail.col!=="done";const dias=at?diasAtraso(detail.prazo):0;
    const lembrete=LEMBRETES[detail.col]?.(detail.responsavel,detail.titulo)||"";
    return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:400,display:"flex",alignItems:"flex-start",justifyContent:"flex-end"}} onClick={e=>{if(e.target===e.currentTarget){setDetail(null);setEditCard(null);}}}>
      <div style={{background:T.bg,borderLeft:"1px solid "+T.border,width:"100%",maxWidth:480,height:"100vh",overflowY:"auto",padding:24,display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1,marginRight:10}}><div style={{fontSize:10,color:T.txtMuted,marginBottom:4,fontFamily:fS,letterSpacing:"0.1em"}}>{detail.cardId}</div>{editCard?<input style={{...inp,fontSize:15,fontWeight:700}} value={cur.titulo} onChange={e=>setEditCard(p=>({...p,titulo:e.target.value}))}/>:<div style={{fontSize:16,fontWeight:800,color:T.white,fontFamily:fT}}>{detail.titulo}</div>}</div>
          <div style={{display:"flex",gap:6,flexShrink:0}}>{!editCard&&<button onClick={()=>setEditCard({...detail})} style={{...btnG,fontSize:11,padding:"4px 10px"}}>✏</button>}{editCard&&<><button onClick={saveEdit} style={btnA(true)}>Salvar</button><button onClick={()=>setEditCard(null)} style={{...btnG,fontSize:11,padding:"4px 10px"}}>✕</button></>}<button onClick={()=>{setDetail(null);setEditCard(null);}} style={{background:"none",border:"none",color:T.txtMuted,fontSize:20,cursor:"pointer",lineHeight:1}}>×</button></div>
        </div>
        {at&&<div style={{background:T.redBg,border:"1px solid rgba(255,77,77,0.3)",borderRadius:6,padding:"8px 12px",fontSize:12,color:T.red,fontFamily:fS}}>⚠ {dias} dia{dias>1?"s":""} em atraso</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["Status",editCard?<select style={sel} value={cur.col} onChange={e=>setEditCard(p=>({...p,col:e.target.value}))}>{COLS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select>:<div style={{fontSize:12,color:T.txt,fontFamily:fS}}>{COLS.find(c=>c.id===detail.col)?.label}</div>],
            ["Prioridade",editCard?<select style={sel} value={cur.prioridade||"Medium"} onChange={e=>setEditCard(p=>({...p,prioridade:e.target.value}))}>{PRIORIDADES.map(p=><option key={p}>{p}</option>)}</select>:<div style={{fontSize:12,color:PRIO_C[detail.prioridade||"Medium"],fontWeight:700,fontFamily:fS}}>{detail.prioridade}</div>],
            ["Responsável",editCard?<select style={sel} value={cur.responsavel} onChange={e=>setEditCard(p=>({...p,responsavel:e.target.value}))}>{(empresa?.responsaveis||[]).map(r=><option key={r}>{r}</option>)}</select>:<div style={{display:"flex",alignItems:"center",gap:6}}><div style={av(detail.responsavel)}>{initials(detail.responsavel)}</div><span style={{fontSize:12,color:T.txt,fontFamily:fS}}>{detail.responsavel}</span></div>],
            ["Prazo",editCard?<input type="date" style={inp} value={cur.prazo} onChange={e=>setEditCard(p=>({...p,prazo:e.target.value}))}/>:<div style={{fontSize:12,color:at?T.red:T.txt,fontFamily:fS}}>{detail.prazo||"—"}</div>],
          ].map(([l,f])=>(<div key={l}><label style={lbl}>{l}</label>{f}</div>))}
        </div>
        <div><label style={lbl}>Tipo</label>{editCard?<select style={sel} value={cur.tipo} onChange={e=>setEditCard(p=>({...p,tipo:e.target.value}))}>{TIPOS.map(t=><option key={t}>{t}</option>)}</select>:<span style={tagS(detail.tipo)}>{detail.tipo}</span>}</div>
        <div><label style={lbl}>AI Briefing</label><div style={{...sec(true),fontSize:12,color:T.txtSub,lineHeight:1.7,whiteSpace:"pre-wrap",maxHeight:150,overflowY:"auto",fontFamily:fS}}>{detail.briefing||"Sem briefing."}</div></div>
        <div><label style={lbl}>Comentários ({(detail.comentarios||[]).length})</label>{(detail.comentarios||[]).map((cm,i)=>(<div key={i} style={{background:T.bg3,border:"1px solid "+T.border,borderRadius:6,padding:"7px 10px",marginBottom:5}}><div style={{fontSize:9,color:T.txtMuted,marginBottom:2,fontFamily:fS}}>{cm.autor} · {cm.data}</div><div style={{fontSize:12,color:T.txt,fontFamily:fS}}>{cm.texto}</div></div>))}<div style={{display:"flex",gap:6,marginTop:6}}><input style={{...inp,flex:1}} placeholder="Comentário…" value={comentario} onChange={e=>setComentario(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addComentario()}/><button onClick={addComentario} style={btnA(true)}>→</button></div></div>
        <div style={{background:"rgba(0,229,195,0.03)",border:"1px solid "+T.border,borderRadius:6,padding:"10px 12px",fontSize:11,color:T.txtSub,lineHeight:1.6,whiteSpace:"pre-wrap",fontFamily:fS}}>{lembrete}</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <a href={waLink(lembrete)} target="_blank" rel="noopener noreferrer" style={{flex:1,textAlign:"center",background:"#25D366",color:"#fff",borderRadius:6,padding:"9px",fontSize:12,fontWeight:700,textDecoration:"none",minWidth:120,fontFamily:fS}}>📲 Lembrete</a>
          {at&&<a href={waLink(msgAtraso(detail.responsavel,detail.titulo,dias))} target="_blank" rel="noopener noreferrer" style={{flex:1,textAlign:"center",background:T.redBg,color:T.red,border:"1px solid rgba(255,77,77,0.3)",borderRadius:6,padding:"9px",fontSize:12,fontWeight:700,textDecoration:"none",minWidth:120,fontFamily:fS}}>⚠ Cobrar</a>}
          <button onClick={()=>deletarCard(detail.id)} style={{background:"none",border:"1px solid rgba(255,77,77,0.3)",color:T.red,borderRadius:6,padding:"9px 14px",fontSize:12,cursor:"pointer",fontFamily:fS}}>Del</button>
        </div>
      </div>
    </div>);
  }

  return(
    <div style={{background:T.bg,minHeight:"100vh",fontFamily:fS,color:T.txt,display:"flex",flexDirection:"column"}}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      {saveStatus&&(<div style={{position:"fixed",top:60,right:16,zIndex:700,background:saveStatus==="saved"?"rgba(0,229,195,0.15)":saveStatus==="error"?T.redBg:"rgba(0,229,195,0.08)",border:"1px solid "+(saveStatus==="saved"?T.borderHover:saveStatus==="error"?"rgba(255,77,77,0.3)":T.border),borderRadius:8,padding:"8px 14px",fontSize:12,color:saveStatus==="saved"?T.accent:saveStatus==="error"?T.red:T.txtSub,fontFamily:fS,display:"flex",alignItems:"center",gap:6}}>{saveStatus==="saving"&&<span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>↻</span>}{saveStatus==="saved"&&"✓"}{saveStatus==="error"&&"⚠"}{saveStatus==="saving"?"Salvando…":saveStatus==="saved"?"Salvo":"Erro ao salvar"}</div>)}
      {notifPopup&&(<div style={{position:"fixed",bottom:20,right:20,zIndex:600,background:T.bg2,border:"1px solid "+(notifPopup.tipo==="atraso"?"rgba(255,77,77,0.4)":T.borderHover),borderRadius:10,padding:"12px 16px",maxWidth:300,boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}><div style={{flex:1}}><div style={{fontSize:11,fontWeight:700,color:notifPopup.tipo==="atraso"?T.red:T.accent,marginBottom:3,fontFamily:fS}}>{notifPopup.tipo==="atraso"?"⚠ Atraso":"📲 Lembrete"}</div><div style={{fontSize:12,color:T.txt,fontFamily:fS}}>{notifPopup.titulo}</div><div style={{fontSize:10,color:T.txtMuted,fontFamily:fS}}>Para: {notifPopup.responsavel}</div></div><a href={notifPopup.link} target="_blank" rel="noopener noreferrer" style={{background:"#25D366",color:"#fff",borderRadius:6,padding:"5px 8px",fontSize:11,fontWeight:700,textDecoration:"none",flexShrink:0}}>WA</a></div></div>)}
      <div style={{background:T.bg,borderBottom:"1px solid "+T.border,padding:"0 20px",height:52,display:"flex",alignItems:"center",gap:12,flexShrink:0,zIndex:50}}>
        <button onClick={()=>setSideOpen(o=>!o)} style={{background:"none",border:"none",color:T.txtMuted,cursor:"pointer",fontSize:16,padding:"0 4px"}}>☰</button>
        <div style={{fontWeight:900,fontSize:16,color:T.white,letterSpacing:"0.06em",display:"flex",alignItems:"center",gap:8,fontFamily:fS}}><div style={{width:28,height:28,borderRadius:7,background:T.accentDim,border:"1px solid "+T.borderHover,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:T.accent}}>BS</div>BS<span style={{color:T.accent}}> Command</span></div>
        {!dbReady&&<span style={{fontSize:10,color:T.warn,background:T.warnBg,border:"1px solid rgba(255,184,0,0.2)",borderRadius:10,padding:"2px 8px",fontFamily:fS}}>modo demo</span>}
        <div style={{flex:1}}/>
        {totalAlertas>0&&<span onClick={()=>{setView("meta");setMetaView("overview");}} style={{background:T.redBg,color:T.red,border:"1px solid rgba(255,77,77,0.3)",borderRadius:20,fontSize:10,fontWeight:700,padding:"3px 10px",cursor:"pointer",fontFamily:fS}}>⚠ {totalAlertas} alerta{totalAlertas>1?"s":""}</span>}
        {atrasados>0&&<span style={{background:T.warnBg,color:T.warn,border:"1px solid rgba(255,184,0,0.3)",borderRadius:20,fontSize:10,fontWeight:700,padding:"3px 10px",fontFamily:fS}}>⚠ {atrasados} atraso{atrasados>1?"s":""}</span>}
        <button onClick={()=>{setForm(f=>({...f,responsavel:empresa?.responsaveis[0]||""}));setModalDem(true);}} style={btnA(false)}>+ Create</button>
      </div>
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {sideOpen&&(<div style={{width:200,background:T.bg,borderRight:"1px solid "+T.border,overflowY:"auto",flexShrink:0,paddingTop:8}}>
          <div style={{padding:"10px 14px 8px",borderBottom:"1px solid "+T.border,marginBottom:6}}><div style={{fontSize:13,fontWeight:700,color:T.white,fontFamily:fT}}>{empresa?.nome||"BS Command"}</div><div style={{fontSize:10,color:T.txtMuted,fontFamily:fS,marginTop:1}}>{dbReady?"● banco conectado":"○ modo demo"}</div></div>
          <div style={{padding:"6px 14px 3px",fontSize:9,color:T.txtMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginTop:4,fontFamily:fS}}>Empresas</div>
          {empresas.map(e=>(<div key={e.id} onClick={()=>setEmpAtiva(e.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 14px",fontSize:12,color:e.id===empAtiva?T.accent:T.txtSub,background:e.id===empAtiva?"rgba(0,229,195,0.06)":"transparent",cursor:"pointer",borderLeft:e.id===empAtiva?"2px solid "+T.accent:"2px solid transparent",fontFamily:fS}}><span style={{width:6,height:6,borderRadius:"50%",background:e.cor,flexShrink:0}}/>{e.nome}</div>))}
          <div onClick={()=>setModalEmp(true)} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 14px",fontSize:11,color:T.txtMuted,cursor:"pointer",fontFamily:fS}}>+ Empresa</div>
          <div style={{padding:"8px 14px 3px",fontSize:9,color:T.txtMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginTop:8,fontFamily:fS}}>Navigation</div>
          {NAVS.map(([id,label])=>(<div key={id} onClick={()=>{setView(id);if(id==="meta")setMetaView("overview");}} style={{display:"flex",alignItems:"center",padding:"6px 14px",fontSize:12,color:view===id?T.accent:T.txtSub,background:view===id?"rgba(0,229,195,0.06)":"transparent",cursor:"pointer",borderLeft:view===id?"2px solid "+T.accent:"2px solid transparent",fontFamily:fS,position:"relative"}}>{label}{id==="meta"&&totalAlertas>0&&<span style={{marginLeft:"auto",background:T.redBg,color:T.red,borderRadius:8,fontSize:8,padding:"1px 5px",fontWeight:700}}>{totalAlertas}</span>}</div>))}
        </div>)}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{background:T.bg,borderBottom:"1px solid "+T.border,padding:"0 20px",display:"flex",gap:0,flexShrink:0}}>
            {NAVS.map(([id,label])=>(<div key={id} onClick={()=>{setView(id);if(id==="meta")setMetaView("overview");}} style={{padding:"13px 16px",fontSize:12,color:view===id?T.accent:T.txtMuted,borderBottom:view===id?"2px solid "+T.accent:"2px solid transparent",cursor:"pointer",fontWeight:view===id?700:400,marginBottom:-1,flexShrink:0,fontFamily:fS,letterSpacing:"0.04em",textTransform:"uppercase",position:"relative"}}>{label}{id==="meta"&&totalAlertas>0&&<span style={{position:"absolute",top:10,right:8,background:T.red,color:"#fff",borderRadius:"50%",width:12,height:12,fontSize:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{totalAlertas}</span>}</div>))}
          </div>
          <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>
            {view==="home"&&<Home/>}
            {view==="meta"&&<MetaPanel/>}
            {view==="board"&&<Board/>}
            {view==="wa"&&<WAPanel/>}
            {view==="settings"&&(<div style={{padding:"24px 28px"}}><h2 style={{margin:"0 0 20px",fontSize:22,fontWeight:800,color:T.white,fontFamily:fT}}>Configurações</h2><div style={{...sec(false),maxWidth:480,marginBottom:14}}><div style={{fontSize:12,fontWeight:700,color:T.white,marginBottom:12,fontFamily:fS,textTransform:"uppercase",letterSpacing:"0.08em"}}>Empresas</div>{empresas.map(e=>(<div key={e.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid "+T.border}}><span style={{width:8,height:8,borderRadius:"50%",background:e.cor,flexShrink:0}}/><span style={{flex:1,fontSize:12,color:T.txt,fontFamily:fS}}>{e.nome}</span><span style={{fontSize:10,color:T.txtMuted,fontFamily:fS}}>{(e.responsaveis||[]).join(", ")}</span></div>))}<button onClick={()=>setModalEmp(true)} style={{...btnA(true),marginTop:12}}>+ Nova empresa</button></div><div style={{...sec(false),maxWidth:480}}><div style={{fontSize:12,fontWeight:700,color:T.white,marginBottom:8,fontFamily:fS,textTransform:"uppercase",letterSpacing:"0.08em"}}>Status do banco</div><div style={{fontSize:13,color:dbReady?T.accent:T.warn,fontFamily:fS,fontWeight:600}}>{dbReady?"✓ Supabase conectado":"○ Modo demo — configure as variáveis no Vercel"}</div></div></div>)}
          </div>
        </div>
      </div>
      {modalEmp&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:16}}><div style={{background:T.bg2,border:"1px solid "+T.borderHover,borderRadius:12,padding:28,width:"100%",maxWidth:400,boxShadow:T.accentGlow}}><h3 style={{margin:"0 0 20px",fontSize:18,fontWeight:800,color:T.white,fontFamily:fT}}>Nova empresa</h3><div style={{display:"flex",flexDirection:"column",gap:12}}><div><label style={lbl}>Nome *</label><input style={inp} placeholder="Ex: Agência XYZ" value={novaEmp.nome} onChange={e=>setNovaEmp(f=>({...f,nome:e.target.value}))}/></div><div><label style={lbl}>Cor</label><div style={{display:"flex",gap:8,marginTop:4}}>{EMP_CORES.map(c=><div key={c} onClick={()=>setNovaEmp(f=>({...f,cor:c}))} style={{width:24,height:24,borderRadius:"50%",background:c,cursor:"pointer",border:novaEmp.cor===c?"3px solid #fff":"2px solid transparent"}}/>)}</div></div><div><label style={lbl}>Responsáveis (vírgula)</label><input style={inp} placeholder="Ana, Bruno, Carla" value={novaEmp.responsaveis} onChange={e=>setNovaEmp(f=>({...f,responsaveis:e.target.value}))}/></div></div><div style={{display:"flex",gap:8,marginTop:20,justifyContent:"flex-end"}}><button onClick={()=>setModalEmp(false)} style={btnG}>Cancelar</button><button onClick={criarEmpresa} style={btnA(false)}>Criar</button></div></div></div>)}
      {modalDem&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:16}}><div style={{background:T.bg2,border:"1px solid "+T.borderHover,borderRadius:12,padding:28,width:"100%",maxWidth:500,maxHeight:"90vh",overflowY:"auto",boxShadow:T.accentGlow}}><h3 style={{margin:"0 0 20px",fontSize:18,fontWeight:800,color:T.white,fontFamily:fT}}>Nova demanda<span style={{fontSize:13,fontWeight:400,color:T.txtSub,fontFamily:fS}}> — {empresa?.nome}</span></h3><div style={{display:"flex",flexDirection:"column",gap:12}}><div><label style={lbl}>Título *</label><input style={inp} value={form.titulo} onChange={e=>setForm(f=>({...f,titulo:e.target.value}))}/></div><div><label style={lbl}>Cliente</label><input style={inp} value={form.cliente} onChange={e=>setForm(f=>({...f,cliente:e.target.value}))}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><div><label style={lbl}>Tipo</label><select style={sel} value={form.tipo} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))}>{TIPOS.map(t=><option key={t}>{t}</option>)}</select></div><div><label style={lbl}>Responsável *</label><select style={sel} value={form.responsavel} onChange={e=>setForm(f=>({...f,responsavel:e.target.value}))}><option value="">Selecione</option>{(empresa?.responsaveis||[]).map(r=><option key={r}>{r}</option>)}</select></div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><div><label style={lbl}>Prioridade</label><select style={sel} value={form.prioridade} onChange={e=>setForm(f=>({...f,prioridade:e.target.value}))}>{PRIORIDADES.map(p=><option key={p}>{p}</option>)}</select></div><div><label style={lbl}>Prazo</label><input type="date" style={inp} value={form.prazo} onChange={e=>setForm(f=>({...f,prazo:e.target.value}))}/></div></div><div><label style={lbl}>Descrição</label><textarea style={{...inp,resize:"vertical"}} rows={3} value={form.descricao} onChange={e=>setForm(f=>({...f,descricao:e.target.value}))}/></div></div><div style={{display:"flex",gap:8,marginTop:20,justifyContent:"flex-end"}}><button onClick={()=>setModalDem(false)} disabled={loadingAI} style={btnG}>Cancelar</button><button onClick={handleSubmit} disabled={loadingAI||!form.titulo.trim()||!form.responsavel} style={btnA(false)}>{loadingAI?"Gerando briefing…":"Create + AI Briefing ✨"}</button></div></div></div>)}
      {modalContato&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:16}}><div style={{background:T.bg2,border:"1px solid rgba(37,211,102,0.3)",borderRadius:12,padding:28,width:"100%",maxWidth:400,boxShadow:"0 0 24px rgba(37,211,102,0.08)"}}><h3 style={{margin:"0 0 20px",fontSize:18,fontWeight:800,color:T.white,fontFamily:fT}}>{editContato?"Editar contato":"Novo contato"}</h3><div style={{display:"flex",flexDirection:"column",gap:12}}><div><label style={lbl}>Nome *</label><input style={inp} placeholder="Ex: Ana" value={novoContato.nome} onChange={e=>setNovoContato(f=>({...f,nome:e.target.value}))}/></div><div><label style={lbl}>Número (DDI+DDD+número)</label><input style={inp} placeholder="5519999999999" value={novoContato.numero} onChange={e=>setNovoContato(f=>({...f,numero:e.target.value.replace(/\D/g,"")}))}/>  <div style={{fontSize:10,color:T.txtMuted,marginTop:4,fontFamily:fS}}>Ex: 55 19 99999-9999 → 5519999999999</div></div><div><label style={lbl}>Tipo</label><select style={sel} value={novoContato.tipo} onChange={e=>setNovoContato(f=>({...f,tipo:e.target.value}))}><option value="equipe">Equipe</option><option value="business">Meu WhatsApp Business</option><option value="cliente">Cliente</option></select></div></div><div style={{display:"flex",gap:8,marginTop:20,justifyContent:"flex-end"}}><button onClick={()=>setModalContato(false)} style={btnG}>Cancelar</button><button onClick={salvarContato} style={{...btnA(false),background:"#25D366"}} disabled={!novoContato.nome.trim()}>Salvar</button></div></div></div>)}
      <DetailPanel/>
    </div>
  );
}
