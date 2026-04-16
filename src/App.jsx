import React, { useState, useEffect, useRef } from 'react';
import { Power, Crown, Clock, CloudSun, Trash2, ShieldCheck, Send, Download, Share2, Copy } from 'lucide-react';

// ─── CONFIGURATION ────────────────────────────────────────────────
const LANGUAGES = {
  fr: {
    placeholder: 'Posez votre question...',
    thinking: 'NO KOMPLEX AI réfléchit...',
    errorMsg: 'Erreur de connexion. Vérifiez votre réseau.',
    welcome: 'Bonjour ! Je suis NO KOMPLEX AI-PRODUCTOR. Comment puis-je vous aider ?',
    export: 'Exporter', share: 'Partager', clear: 'Effacer', upgrade: 'Améliorer',
  },
  ht: {
    placeholder: 'Poze kesyon ou...',
    thinking: 'NO KOMPLEX AI ap réfléchi...',
    errorMsg: 'Erè koneksyon. Tcheke rezo ou.',
    welcome: 'Bonjou ! Mwen se NO KOMPLEX AI-PRODUCTOR. Kijan mwen ka ede ou ?',
    export: 'Eksporte', share: 'Pataje', clear: 'Efase', upgrade: 'Amelyore',
  },
  en: {
    placeholder: 'Ask your question...',
    thinking: 'NO KOMPLEX AI is thinking...',
    errorMsg: 'Connection error. Check your network.',
    welcome: "Hello! I'm NO KOMPLEX AI-PRODUCTOR. How can I help you?",
    export: 'Export', share: 'Share', clear: 'Clear', upgrade: 'Upgrade',
  },
  es: {
    placeholder: 'Haz tu pregunta...',
    thinking: 'NO KOMPLEX AI está pensando...',
    errorMsg: 'Error de conexión. Revisa tu red.',
    welcome: '¡Hola! Soy NO KOMPLEX AI-PRODUCTOR. ¿Cómo puedo ayudarte?',
    export: 'Exportar', share: 'Compartir', clear: 'Limpiar', upgrade: 'Mejorar',
  }
};

const TIERS = {
  FREE:  { label: 'Gratuit', limit: 5,       color: '#64748b' },
  PRO:   { label: 'Pro',     limit: 100,      color: '#0ea5e9' },
  ELITE: { label: 'Élite',   limit: Infinity, color: '#f59e0b' }
};

// ─── STYLES CONSTANTS ─────────────────────────────────────────────
const S = {
  app:    { minHeight:'100vh', display:'flex', flexDirection:'column', background:'#f0f4ff' },
  header: { position:'sticky', top:0, zIndex:40, background:'white', borderBottom:'1px solid #e2e8f0', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 1px 8px rgba(0,0,0,0.06)' },
  main:   { flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:12 },
  footer: { background:'white', borderTop:'1px solid #e2e8f0', padding:'12px 16px' },
};

export default function App() {
  const [lang, setLang]           = useState('fr');
  const [messages, setMessages]   = useState(() => { try { return JSON.parse(localStorage.getItem('nk_history')) || []; } catch { return []; } });
  const [input, setInput]         = useState('');
  const [isActive, setIsActive]   = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan]           = useState(() => localStorage.getItem('nk_plan') || 'FREE');
  const [msgCount, setMsgCount]   = useState(() => parseInt(localStorage.getItem('nk_count') || '0'));
  const [weather, setWeather]     = useState({ temp: '--', city: '...', condition: '' });
  const [time, setTime]           = useState(new Date());
  const [isAdmin, setIsAdmin]     = useState(false);
  const [copied, setCopied]       = useState(null);
  const bottomRef                 = useRef(null);
  const t = LANGUAGES[lang];

  useEffect(() => { const i = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(i); }, []);

  useEffect(() => {
    fetch('/.netlify/functions/weather').then(r => r.json()).then(setWeather)
      .catch(() => fetch('https://ipapi.co/json/').then(r => r.json())
        .then(d => setWeather({ temp: '--', city: d.city || 'Inconnu', condition: '' }))
        .catch(() => setWeather({ temp: '--', city: 'Hors-ligne', condition: '' })));
  }, []);

  useEffect(() => { localStorage.setItem('nk_history', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('nk_plan', plan); }, [plan]);
  useEffect(() => { localStorage.setItem('nk_count', String(msgCount)); }, [msgCount]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);
  useEffect(() => {
    if (messages.length === 0)
      setMessages([{ role: 'ai', content: LANGUAGES[lang].welcome, id: 'welcome' }]);
  }, [lang]);

  const handleSend = async () => {
    if (!input.trim() || !isActive || isLoading) return;
    if (msgCount >= TIERS[plan].limit) {
      setMessages(prev => [...prev, { role:'ai', content:`⚠️ Limite du plan ${TIERS[plan].label} atteinte. Passez au plan supérieur.`, id:Date.now() }]);
      return;
    }
    const userMsg = { role: 'user', content: input.trim(), id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })), lang, plan })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.content, id: Date.now() + 1 }]);
      setMsgCount(c => c + 1);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: t.errorMsg, id: Date.now() + 1 }]);
    } finally { setIsLoading(false); }
  };

  const checkAdmin = async (val) => {
    if (val.length < 4) return;
    try {
      const res = await fetch('/.netlify/functions/admin', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ code: val }) });
      const data = await res.json();
      if (data.authorized) { setIsAdmin(true); setInput(''); }
    } catch {}
  };

  const copyMsg = (id, text) => { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000); };

  const exportChat = () => {
    const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `NK-AI-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  // Gestion retour Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const paidPlan = params.get("plan");
    if (payment === "success" && paidPlan) {
      setPlan(paidPlan);
      setMsgCount(0);
      setMessages(prev => [...prev, { role: "ai", content: "🎉 Plan " + paidPlan + " activé ! Profitez de toutes les fonctionnalités.", id: Date.now() }]);
      window.history.replaceState({}, "", "/");
    }
    if (payment === "cancelled") window.history.replaceState({}, "", "/");
  }, []);

  const handleUpgrade = async (selectedPlan) => {
    try {
      const res = await fetch("/.netlify/functions/stripe-checkout", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ plan: selectedPlan }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { alert("Erreur paiement. Réessayez."); }
  };

  return (
    <div style={S.app}>

      {/* HEADER */}
      <header style={S.header}>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:13, color:'#334155', fontWeight:500 }}>
              <Clock size={12} color="#0ea5e9" />
              {time.toLocaleTimeString(lang)}
            </div>
            <div style={{ fontSize:11, color:'#94a3b8' }}>{time.toLocaleDateString(lang)}</div>
          </div>
          {weather.city !== '...' && (
            <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'#0284c7', background:'#e0f2fe', padding:'3px 10px', borderRadius:20 }}>
              <CloudSun size={13} />{weather.city}{weather.temp !== '--' ? ` · ${weather.temp}` : ''}
            </div>
          )}
        </div>

        <div style={{ fontWeight:800, fontSize:15, letterSpacing:2, color:'#0ea5e9' }}>NK-AI</div>

        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ display:'flex', background:'#f1f5f9', borderRadius:20, padding:2 }}>
            {Object.keys(LANGUAGES).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding:'4px 9px', borderRadius:20, fontSize:11, fontWeight:600, border:'none', cursor:'pointer', transition:'all .2s', background: lang===l ? '#0ea5e9' : 'transparent', color: lang===l ? 'white' : '#64748b' }}>{l.toUpperCase()}</button>
            ))}
          </div>
          <button onClick={() => setIsActive(v => !v)} style={{ background: isActive ? '#dcfce7' : '#fee2e2', border:'none', borderRadius:'50%', padding:6, cursor:'pointer' }}>
            <Power size={15} color={isActive ? '#16a34a' : '#dc2626'} />
          </button>
        </div>
      </header>

      {/* CHAT */}
      <main style={S.main}>
        {messages.map(m => (
          <div key={m.id} style={{ display:'flex', justifyContent: m.role==='user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ position:'relative', maxWidth:'82%', padding:'12px 16px',
              borderRadius: m.role==='user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role==='user' ? 'linear-gradient(135deg,#0ea5e9,#0284c7)' : 'white',
              color: m.role==='user' ? 'white' : '#1e293b', fontSize:14, lineHeight:1.6,
              boxShadow:'0 1px 6px rgba(0,0,0,0.07)', border: m.role==='ai' ? '1px solid #e2e8f0' : 'none'
            }}>
              <p style={{ whiteSpace:'pre-wrap', margin:0 }}>{m.content}</p>
              <button onClick={() => copyMsg(m.id, m.content)} className="copy-btn" style={{ position:'absolute', top:-8, right:-8, background:'white', border:'1px solid #e2e8f0', borderRadius:'50%', padding:4, cursor:'pointer', opacity:0, transition:'opacity .2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity='1'} onMouseLeave={e => e.currentTarget.style.opacity='0'}>
                <Copy size={10} color="#64748b" />
              </button>
              {copied===m.id && <span style={{ position:'absolute', top:-22, right:0, fontSize:11, background:'#0ea5e9', color:'white', padding:'2px 8px', borderRadius:8 }}>✓ Copié</span>}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display:'flex', justifyContent:'flex-start' }}>
            <div style={{ background:'white', border:'1px solid #e2e8f0', padding:'12px 16px', borderRadius:'18px 18px 18px 4px', fontSize:13, color:'#94a3b8', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
              <span style={{ animation:'pulse 1.5s infinite' }}>💭 {t.thinking}</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      {/* ADMIN PANEL */}
      {isAdmin && (
        <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(240,244,255,0.97)', backdropFilter:'blur(8px)', overflowY:'auto', padding:24 }}>
          <div style={{ maxWidth:480, margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
              <div style={{ background:'#eff6ff', borderRadius:'50%', padding:8 }}>
                <ShieldCheck size={22} color="#0ea5e9" />
              </div>
              <div>
                <h1 style={{ fontSize:18, fontWeight:700, color:'#0f172a' }}>Panneau Admin</h1>
                <p style={{ fontSize:12, color:'#64748b' }}>Lesly Tech LLC</p>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:12, padding:16 }}>
                <p style={{ fontSize:11, color:'#94a3b8', marginBottom:4 }}>Messages utilisés</p>
                <p style={{ fontSize:26, fontWeight:700, color:'#0ea5e9' }}>{msgCount}<span style={{ fontSize:13, color:'#94a3b8' }}>/{TIERS[plan].limit===Infinity?'∞':TIERS[plan].limit}</span></p>
              </div>
              <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:12, padding:16 }}>
                <p style={{ fontSize:11, color:'#94a3b8', marginBottom:4 }}>Plan actuel</p>
                <p style={{ fontSize:18, fontWeight:700, color:TIERS[plan].color }}>{TIERS[plan].label}</p>
              </div>
            </div>

            <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:12, padding:16, marginBottom:12 }}>
              <p style={{ fontSize:12, color:'#64748b', marginBottom:8 }}>Changer le plan</p>
              <select value={plan} onChange={e => setPlan(e.target.value)} style={{ width:'100%', padding:'8px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:14, background:'white', color:'#1e293b' }}>
                {Object.entries(TIERS).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>

            <button onClick={() => { setMessages([]); setMsgCount(0); }} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:'#fff5f5', color:'#dc2626', border:'1px solid #fecaca', padding:'10px', borderRadius:12, fontSize:13, cursor:'pointer', marginBottom:12 }}>
              <Trash2 size={14} /> Réinitialiser l'historique
            </button>
            <button onClick={() => setIsAdmin(false)} style={{ width:'100%', background:'#0ea5e9', color:'white', border:'none', padding:'12px', borderRadius:12, fontSize:14, fontWeight:600, cursor:'pointer' }}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={S.footer}>
        <div style={{ display:'flex', gap:8, marginBottom:10, overflowX:'auto', paddingBottom:4 }}>
          {[
            { icon:<Download size={13}/>, label:t.export,  action:exportChat },
            { icon:<Share2   size={13}/>, label:t.share,   action:() => navigator.clipboard.writeText(window.location.href) },
            { icon:<Trash2   size={13}/>, label:t.clear,   action:() => { setMessages([]); setMsgCount(0); } },
            { icon:<Crown    size={13}/>, label:t.upgrade, action:() => handleUpgrade(plan === 'FREE' ? 'PRO' : 'ELITE'), gold:true },
          ].map((btn,i) => (
            <button key={i} onClick={btn.action} style={{ display:'flex', alignItems:'center', gap:6, background:btn.gold?'#fffbeb':'#f8fafc', border:`1px solid ${btn.gold?'#fde68a':'#e2e8f0'}`, color:btn.gold?'#d97706':'#475569', padding:'6px 14px', borderRadius:20, fontSize:12, whiteSpace:'nowrap', cursor:'pointer', fontWeight:500 }}>
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>

        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <input
            type="text" value={input}
            onChange={e => { setInput(e.target.value); checkAdmin(e.target.value); }}
            onKeyDown={e => e.key==='Enter' && !e.shiftKey && handleSend()}
            placeholder={isActive ? t.placeholder : '⏸ IA désactivée'}
            disabled={!isActive || isLoading}
            style={{ flex:1, border:'1.5px solid #e2e8f0', borderRadius:24, padding:'12px 18px', fontSize:14, outline:'none', background:isActive?'white':'#f8fafc', color:'#1e293b', transition:'border-color .2s' }}
            onFocus={e => e.target.style.borderColor='#0ea5e9'}
            onBlur={e => e.target.style.borderColor='#e2e8f0'}
          />
          <button onClick={handleSend} disabled={!input.trim()||!isActive||isLoading} style={{ background:input.trim()&&isActive?'#0ea5e9':'#e2e8f0', border:'none', borderRadius:'50%', width:46, height:46, display:'flex', alignItems:'center', justifyContent:'center', cursor:input.trim()&&isActive?'pointer':'not-allowed', transition:'background .2s', flexShrink:0 }}>
            {isLoading
              ? <div style={{ width:18, height:18, border:'2px solid white', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
              : <Send size={18} color="white" />}
          </button>
        </div>

        <div style={{ marginTop:8, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:10, letterSpacing:1 }}>
          <span style={{ color:TIERS[plan].color, fontWeight:600 }}>{TIERS[plan].label} · {msgCount}/{TIERS[plan].limit===Infinity?'∞':TIERS[plan].limit}</span>
          {plan!=='ELITE' && <span style={{ color:'#cbd5e1' }}>NO KOMPLEX AI-PRODUCTOR</span>}
          <span style={{ color:'#cbd5e1' }}>© {new Date().getFullYear()} Lesly Tech LLC</span>
        </div>
      </footer>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
