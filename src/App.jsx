import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Crown, Clock, CloudSun, Trash2, ShieldCheck, Send, Download,
  Share2, Copy, Power, Image, Paperclip, ChevronLeft, Usb,
  CheckSquare, Square, X, Loader, Zap, Sparkles, Bluetooth, BluetoothConnected, BluetoothOff
} from 'lucide-react';

// ─── LANGUES ──────────────────────────────────────────────────────
const LANGUAGES = {
  fr: {
    placeholder: 'Posez votre question ou déposez un fichier...',
    thinking: 'Analyse en cours', executing: 'Exécution', generating: 'Génération',
    errorMsg: 'Erreur de connexion. Vérifiez votre réseau.',
    welcome: 'Bonjour ! Je suis NO KOMPLEX AI-PRODUCTOR. Comment puis-je vous aider ?',
    export: 'Exporter', share: 'Partager', clear: 'Effacer', upgrade: 'Améliorer',
    usb: 'Clé USB', back: 'Retour', copySelected: 'Copier sélection', copyAll: 'Tout copier',
    active: 'IA Active', inactive: 'IA Inactive', adminTitle: 'Panneau Admin',
    resetHistory: "Réinitialiser l'historique", close: 'Fermer', changePlan: 'Changer le plan',
    changeAvatar: "Changer l'image de l'IA", selectMode: 'Mode sélection', cancelSelect: 'Annuler',
    attachFile: 'Joindre un fichier', dropFile: 'Déposez votre fichier ici',
    historyTitle: 'Historique des sessions', newSession: 'Nouvelle session',
    bluetooth: 'Bluetooth', btConnecting: 'Connexion...', btConnected: 'Connecté', btSending: 'Envoi en cours...', btSent: 'Envoyé !', btUnsupported: 'Bluetooth non supporté sur ce navigateur', btError: 'Connexion échouée. Réessayez.',
  },
  ht: {
    placeholder: 'Poze kesyon ou oswa depoze yon fichye...',
    thinking: 'Analiz ap fèt', executing: 'Ekzekisyon', generating: 'Jenere',
    errorMsg: 'Erè koneksyon. Tcheke rezo ou.',
    welcome: 'Bonjou ! Mwen se NO KOMPLEX AI-PRODUCTOR. Kijan mwen ka ede ou ?',
    export: 'Eksporte', share: 'Pataje', clear: 'Efase', upgrade: 'Amelyore',
    usb: 'Kle USB', back: 'Retounen', copySelected: 'Kopye seleksyon', copyAll: 'Kopye tout',
    active: 'IA Aktif', inactive: 'IA Inaktif', adminTitle: 'Panel Admin',
    resetHistory: 'Efase Istorik', close: 'Fèmen', changePlan: 'Chanje plan',
    changeAvatar: 'Chanje imaj IA a', selectMode: 'Seleksyon', cancelSelect: 'Anile',
    attachFile: 'Ajoute fichye', dropFile: 'Depoze fichye ou la',
    historyTitle: 'Istorik sesyon', newSession: 'Nouvo sesyon',
    bluetooth: 'Bluetooth', btConnecting: 'Koneksyon...', btConnected: 'Konekte', btSending: 'Ap voye...', btSent: 'Voye !', btUnsupported: 'Bluetooth pa disponib', btError: 'Koneksyon echwe. Eseye ankò.',
  },
  en: {
    placeholder: 'Ask your question or drop a file...',
    thinking: 'Analyzing', executing: 'Executing', generating: 'Generating',
    errorMsg: 'Connection error. Check your network.',
    welcome: "Hello! I'm NO KOMPLEX AI-PRODUCTOR. How can I help you?",
    export: 'Export', share: 'Share', clear: 'Clear', upgrade: 'Upgrade',
    usb: 'USB Drive', back: 'Back', copySelected: 'Copy selection', copyAll: 'Copy all',
    active: 'AI Active', inactive: 'AI Inactive', adminTitle: 'Admin Panel',
    resetHistory: 'Reset History', close: 'Close', changePlan: 'Change plan',
    changeAvatar: 'Change AI image', selectMode: 'Select mode', cancelSelect: 'Cancel',
    attachFile: 'Attach file', dropFile: 'Drop your file here',
    historyTitle: 'Session history', newSession: 'New session',
    bluetooth: 'Bluetooth', btConnecting: 'Connecting...', btConnected: 'Connected', btSending: 'Sending...', btSent: 'Sent!', btUnsupported: 'Bluetooth not supported on this browser', btError: 'Connection failed. Try again.',
  },
  es: {
    placeholder: 'Haz tu pregunta o suelta un archivo...',
    thinking: 'Analizando', executing: 'Ejecutando', generating: 'Generando',
    errorMsg: 'Error de conexión. Revisa tu red.',
    welcome: '¡Hola! Soy NO KOMPLEX AI-PRODUCTOR. ¿Cómo puedo ayudarte?',
    export: 'Exportar', share: 'Compartir', clear: 'Limpiar', upgrade: 'Mejorar',
    usb: 'USB', back: 'Volver', copySelected: 'Copiar selección', copyAll: 'Copiar todo',
    active: 'IA Activa', inactive: 'IA Inactiva', adminTitle: 'Panel Admin',
    resetHistory: 'Resetear Historial', close: 'Cerrar', changePlan: 'Cambiar plan',
    changeAvatar: 'Cambiar imagen IA', selectMode: 'Selección', cancelSelect: 'Cancelar',
    attachFile: 'Adjuntar archivo', dropFile: 'Suelta tu archivo aquí',
    historyTitle: 'Historial de sesiones', newSession: 'Nueva sesión',
    bluetooth: 'Bluetooth', btConnecting: 'Conectando...', btConnected: 'Conectado', btSending: 'Enviando...', btSent: '¡Enviado!', btUnsupported: 'Bluetooth no soportado', btError: 'Conexión fallida. Inténtalo de nuevo.',
  }
};

const TIERS = {
  FREE:  { label: 'Gratuit', limit: 5,       color: '#64748b' },
  PRO:   { label: 'Pro',     limit: 100,      color: '#0ea5e9' },
  ELITE: { label: 'Élite',   limit: Infinity, color: '#f59e0b' }
};

// ─── ÉTAPES D'ANIMATION IA ────────────────────────────────────────
const AI_STEPS = {
  thinking:  ['Analyse de votre demande', 'Compréhension du contexte', 'Préparation de la réponse'],
  executing: ['Traitement en cours', 'Application des instructions', 'Finalisation'],
  generating:['Génération du contenu', 'Optimisation de la réponse', 'Mise en forme'],
};

// ─── COMPOSANT ANIMATION IA ───────────────────────────────────────
const AIThinking = ({ phase, lang }) => {
  const [step, setStep] = useState(0);
  const [dots, setDots] = useState('');
  const t = LANGUAGES[lang];
  const steps = AI_STEPS[phase] || AI_STEPS.thinking;

  useEffect(() => {
    const si = setInterval(() => setStep(s => (s + 1) % steps.length), 900);
    const di = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => { clearInterval(si); clearInterval(di); };
  }, [phase]);

  const icons = { thinking: <Sparkles size={14}/>, executing: <Zap size={14}/>, generating: <Loader size={14} style={{ animation:'spin 1s linear infinite' }}/> };
  const colors = { thinking: '#0ea5e9', executing: '#8b5cf6', generating: '#f59e0b' };
  const color = colors[phase] || colors.thinking;

  return (
    <div style={{ background:'white', border:`1px solid ${color}30`, borderRadius:'18px 18px 18px 4px', padding:'14px 18px', maxWidth:'75%', boxShadow:`0 2px 12px ${color}15` }}>
      {/* Barre de progression animée */}
      <div style={{ height:3, background:'#f1f5f9', borderRadius:2, marginBottom:10, overflow:'hidden' }}>
        <div style={{ height:'100%', background:`linear-gradient(90deg, ${color}, ${color}80)`, borderRadius:2, animation:'progress 1.5s ease-in-out infinite', width:'60%' }} />
      </div>
      {/* Phase principale */}
      <div style={{ display:'flex', alignItems:'center', gap:6, color, fontWeight:600, fontSize:13, marginBottom:6 }}>
        {icons[phase]}
        <span>{t[phase]}{dots}</span>
      </div>
      {/* Étape courante */}
      <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#94a3b8' }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:color, animation:'blink 1s infinite' }} />
        <span style={{ animation:'fadeStep .4s ease' }}>{steps[step]}</span>
      </div>
      {/* Points de chargement */}
      <div style={{ display:'flex', gap:4, marginTop:8 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:color, opacity: i === step % 4 ? 1 : 0.2, transition:'opacity .3s', animationDelay:`${i*0.15}s` }} />
        ))}
      </div>
    </div>
  );
};

// ─── COMPOSANT MESSAGE FICHIER ────────────────────────────────────
const FilePreview = ({ file }) => {
  if (file.type.startsWith('image/')) {
    return <img src={file.url} alt={file.name} style={{ maxWidth:'100%', maxHeight:200, borderRadius:8, marginTop:6, display:'block' }} />;
  }
  if (file.type.startsWith('video/')) {
    return <video src={file.url} controls style={{ maxWidth:'100%', maxHeight:200, borderRadius:8, marginTop:6, display:'block' }} />;
  }
  if (file.type.startsWith('audio/')) {
    return <audio src={file.url} controls style={{ marginTop:6, width:'100%' }} />;
  }
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f1f5f9', borderRadius:8, padding:'8px 12px', marginTop:6, fontSize:12 }}>
      <Paperclip size={14} color="#64748b" />
      <span style={{ color:'#475569' }}>{file.name}</span>
      <span style={{ color:'#94a3b8' }}>({(file.size/1024).toFixed(1)} KB)</span>
    </div>
  );
};

// ─── APP PRINCIPALE ───────────────────────────────────────────────
export default function App() {
  const [lang, setLang]             = useState('fr');
  const [sessions, setSessions]     = useState(() => { try { return JSON.parse(localStorage.getItem('nk_sessions')) || []; } catch { return []; } });
  const [currentSession, setCS]     = useState(() => { try { return JSON.parse(localStorage.getItem('nk_current')) || { id: Date.now(), messages: [], createdAt: new Date().toISOString() }; } catch { return { id: Date.now(), messages: [], createdAt: new Date().toISOString() }; } });
  const [input, setInput]           = useState('');
  const [isActive, setIsActive]     = useState(true);
  const [aiPhase, setAiPhase]       = useState(null); // null | 'thinking' | 'executing' | 'generating'
  const [plan, setPlan]             = useState(() => localStorage.getItem('nk_plan') || 'FREE');
  const [msgCount, setMsgCount]     = useState(() => parseInt(localStorage.getItem('nk_count') || '0'));
  const [weather, setWeather]       = useState({ temp: '--', city: '', condition: '' });
  const [time, setTime]             = useState(new Date());
  const [isAdmin, setIsAdmin]       = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected]     = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [avatar, setAvatar]         = useState(() => localStorage.getItem('nk_avatar') || null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [copied, setCopied]         = useState(null);
  const [btStatus, setBtStatus]     = useState('idle'); // idle | connecting | connected | sending | sent | error | unsupported
  const [btDevice, setBtDevice]     = useState(null);
  const [showBtModal, setShowBtModal] = useState(false);
  const bottomRef                   = useRef(null);
  const fileInputRef                = useRef(null);
  const avatarInputRef              = useRef(null);
  const t = LANGUAGES[lang];
  const messages = currentSession.messages;

  // ── Horloge locale ────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Météo via GPS puis fallback IP ───────────────────────────
  useEffect(() => {
    const fetchWeatherByCoords = (lat, lon, city) => {
      const apiKey = process.env.REACT_APP_OPENWEATHER_KEY;
      if (apiKey) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`)
          .then(r => r.json())
          .then(d => setWeather({
            temp: `${Math.round(d.main.temp)}°C`,
            city: city || d.name,
            condition: d.weather?.[0]?.description || ''
          }))
          .catch(() => setWeather({ temp: '--', city, condition: '' }));
      } else {
        setWeather({ temp: '--', city, condition: '' });
      }
    };

    // Étape 1 : GPS du navigateur (le plus précis)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // Reverse geocoding pour obtenir le nom de la ville
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then(r => r.json())
            .then(d => {
              const city = d.address?.city || d.address?.town || d.address?.village || d.address?.county || '';
              fetchWeatherByCoords(latitude, longitude, city);
            })
            .catch(() => fetchWeatherByCoords(latitude, longitude, ''));
        },
        // Étape 2 : fallback sur IP si GPS refusé
        () => {
          fetch('/.netlify/functions/weather').then(r => r.json()).then(setWeather)
            .catch(() => fetch('https://ipapi.co/json/').then(r => r.json())
              .then(d => setWeather({ temp: '--', city: d.city || '', condition: '' }))
              .catch(() => {}));
        },
        { timeout: 5000, maximumAge: 300000 }
      );
    } else {
      // Pas de GPS disponible — fallback IP
      fetch('/.netlify/functions/weather').then(r => r.json()).then(setWeather)
        .catch(() => fetch('https://ipapi.co/json/').then(r => r.json())
          .then(d => setWeather({ temp: '--', city: d.city || '', condition: '' }))
          .catch(() => {}));
    }
  }, []);

  // ── Persistance ───────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('nk_current', JSON.stringify(currentSession));
    // Sauvegarder dans sessions si messages > 0
    if (currentSession.messages.length > 0) {
      setSessions(prev => {
        const idx = prev.findIndex(s => s.id === currentSession.id);
        if (idx >= 0) { const copy = [...prev]; copy[idx] = currentSession; return copy; }
        return [currentSession, ...prev].slice(0, 50); // Max 50 sessions
      });
    }
  }, [currentSession]);

  useEffect(() => { localStorage.setItem('nk_sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('nk_plan', plan); }, [plan]);
  useEffect(() => { localStorage.setItem('nk_count', String(msgCount)); }, [msgCount]);
  useEffect(() => { if (avatar) localStorage.setItem('nk_avatar', avatar); }, [avatar]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, aiPhase]);

  // ── Message de bienvenue ──────────────────────────────────────
  
  // Retour Stripe (success / cancelled)
  useEffect(() => {
    const params   = new URLSearchParams(window.location.search);
    const payment  = params.get('payment');
    const paidPlan = params.get('plan');
    if (payment === 'success' && paidPlan) {
      setPlan(paidPlan);
      setMsgCount(0);
      window.history.replaceState({}, '', '/');
    }
    if (payment === 'cancelled') window.history.replaceState({}, '', '/');
  }, []);

useEffect(() => {
    if (messages.length === 0) {
      setCS(prev => ({ ...prev, messages: [{ role:'ai', content: LANGUAGES[lang].welcome, id:'welcome', type:'text' }] }));
    }
  }, [lang]);

  // ── Ajouter un message ────────────────────────────────────────
  const addMsg = (msg) => setCS(prev => ({ ...prev, messages: [...prev.messages, msg] }));

  // ── Envoi message ─────────────────────────────────────────────
  const handleSend = async () => {
    if ((!input.trim() && !attachedFile) || !isActive || aiPhase) return;
    if (msgCount >= TIERS[plan].limit) {
      addMsg({ role:'ai', content:`⚠️ Limite du plan ${TIERS[plan].label} atteinte.`, id:Date.now(), type:'text' });
      return;
    }

    const userMsg = {
      role: 'user', id: Date.now(), type: attachedFile ? 'media' : 'text',
      content: input.trim(),
      file: attachedFile || null
    };
    addMsg(userMsg);
    setInput('');
    setAttachedFile(null);

    // Animation phases
    setAiPhase('thinking');
    await new Promise(r => setTimeout(r, 1200));
    setAiPhase('executing');
    await new Promise(r => setTimeout(r, 900));
    setAiPhase('generating');

    try {
      const apiMessages = messages.concat(userMsg)
        .filter(m => m.type === 'text' || (m.type === 'media' && m.content))
        .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content || '[Fichier multimédia partagé]' }));

      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, lang, plan })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      addMsg({ role:'ai', content: data.content, id: Date.now()+1, type:'text' });
      setMsgCount(c => c + 1);
    } catch {
      addMsg({ role:'ai', content: t.errorMsg, id: Date.now()+1, type:'text' });
    } finally {
      setAiPhase(null);
    }
  };

  // ── Admin sécurisé ────────────────────────────────────────────
  const checkAdmin = async (val) => {
    if (val.length < 4) return;
    try {
      const res = await fetch('/.netlify/functions/admin', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ code: val }) });
      const data = await res.json();
      if (data.authorized) { setIsAdmin(true); setInput(''); }
    } catch {}
  };

  // ── Stripe ────────────────────────────────────────────────────
  const handleUpgrade = async (selectedPlan) => {
    try {
      const res = await fetch('/.netlify/functions/stripe-checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ plan: selectedPlan }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { alert('Erreur paiement.'); }
  };

  // ── Copie ─────────────────────────────────────────────────────
  const copyMsg = (id, text) => { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000); };

  const copySelected = () => {
    const text = messages.filter(m => selected.includes(m.id)).map(m => `${m.role === 'user' ? 'Vous' : 'NK-AI'}: ${m.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setSelected([]); setSelectMode(false);
    setCopied('selection');
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    const text = messages.map(m => `${m.role === 'user' ? 'Vous' : 'NK-AI'}: ${m.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied('all');
    setTimeout(() => setCopied(null), 2000);
  };

  // ── Export USB / Téléchargement ───────────────────────────────
  const exportChat = (format = 'json') => {
    let content, filename, type;
    if (format === 'txt') {
      content = messages.map(m => `[${m.role === 'user' ? 'VOUS' : 'NK-AI'}]\n${m.content}`).join('\n\n---\n\n');
      filename = `NK-AI-Chat-${Date.now()}.txt`;
      type = 'text/plain';
    } else {
      content = JSON.stringify({ session: currentSession, exportedAt: new Date().toISOString() }, null, 2);
      filename = `NK-AI-Chat-${Date.now()}.json`;
      type = 'application/json';
    }
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Bluetooth ─────────────────────────────────────────────────
  const handleBluetooth = async () => {
    setShowBtModal(true);
    // Vérifier support navigateur
    if (!navigator.bluetooth) {
      setBtStatus('unsupported');
      return;
    }
    try {
      setBtStatus('connecting');
      // Chercher un appareil BLE compatible (service Nordic UART ou générique)
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          '6e400001-b5a3-f393-e0a9-e50e24dcca9e', // Nordic UART Service
          '0000ffe0-0000-1000-8000-00805f9b34fb',  // HM-10 Serial
          'battery_service',
          'generic_access'
        ]
      });
      setBtDevice(device);
      setBtStatus('connected');

      // Tenter d'envoyer le chat via UART si disponible
      try {
        setBtStatus('sending');
        const server  = await device.gatt.connect();
        // Chercher le service UART Nordic
        const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e').catch(() => null);
        if (service) {
          const char = await service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
          const text = messages.map(m => (m.role === 'user' ? 'VOUS: ' : 'NK-AI: ') + m.content).join('\n---\n');
          // Envoyer par chunks de 20 bytes (limite BLE)
          const encoder = new TextEncoder();
          const data = encoder.encode(text.slice(0, 512));
          for (let i = 0; i < data.length; i += 20) {
            await char.writeValueWithoutResponse(data.slice(i, i + 20));
            await new Promise(r => setTimeout(r, 50));
          }
          setBtStatus('sent');
        } else {
          // Connexion réussie mais pas de service UART — afficher infos appareil
          setBtStatus('connected');
        }
      } catch {
        // Connexion GATT échouée — l'appareil est détecté mais pas compatible UART
        setBtStatus('connected');
      }

      // Écouter la déconnexion
      device.addEventListener('gattserverdisconnected', () => {
        setBtDevice(null);
        setBtStatus('idle');
      });

    } catch (err) {
      if (err.name === 'NotFoundError') {
        // Utilisateur a annulé la sélection
        setBtStatus('idle');
        setShowBtModal(false);
      } else {
        setBtStatus('error');
      }
    }
  };

  const disconnectBluetooth = () => {
    if (btDevice?.gatt?.connected) btDevice.gatt.disconnect();
    setBtDevice(null);
    setBtStatus('idle');
    setShowBtModal(false);
  };

  // ── Fichier attaché ───────────────────────────────────────────
  const handleFileAttach = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAttachedFile({ name: file.name, type: file.type, size: file.size, url });
  };

  // ── Drag & Drop ───────────────────────────────────────────────
  const onDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileAttach(file);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);

  // ── Avatar ────────────────────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  // ── Nouvelle session ──────────────────────────────────────────
  const newSession = () => {
    setCS({ id: Date.now(), messages: [], createdAt: new Date().toISOString() });
    setShowHistory(false);
  };

  const loadSession = (session) => { setCS(session); setShowHistory(false); };

  const userLocale = lang === 'ht' ? 'fr-HT' : lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US';

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'#e8eef7' }}
      onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>

      {/* ── DRAG OVERLAY ── */}
      {isDragging && (
        <div style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(14,165,233,0.15)', border:'3px dashed #0ea5e9', display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
          <div style={{ background:'white', borderRadius:16, padding:'24px 40px', textAlign:'center', boxShadow:'0 8px 32px rgba(14,165,233,0.3)' }}>
            <Paperclip size={32} color="#0ea5e9" style={{ marginBottom:8 }} />
            <p style={{ color:'#0ea5e9', fontWeight:700, fontSize:16 }}>{t.dropFile}</p>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <header style={{ position:'sticky', top:0, zIndex:40, background:'white', borderBottom:'1px solid #d1dae8', padding:'10px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.08)' }}>

        {/* Gauche: heure + météo */}
        <div style={{ display:'flex', gap:10, alignItems:'center', minWidth:120 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'#334155', fontWeight:600 }}>
              <Clock size={11} color="#0ea5e9" />{time.toLocaleTimeString(userLocale)}
            </div>
            <div style={{ fontSize:10, color:'#94a3b8' }}>{time.toLocaleDateString(userLocale)}</div>
          </div>
          {weather.city && (
            <div style={{ display:'flex', alignItems:'center', gap:3, fontSize:10, color:'#0284c7', background:'#e0f2fe', padding:'2px 8px', borderRadius:20 }}>
              <CloudSun size={11} />{weather.city}{weather.temp!=='--'?` · ${weather.temp}`:''}
            </div>
          )}
        </div>

        {/* Centre: Avatar + Nom */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
          <div style={{ position:'relative', cursor:'pointer' }} onClick={() => avatarInputRef.current?.click()}>
            {avatar
              ? <img src={avatar} alt="NK-AI" style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover', border:'2px solid #0ea5e9' }} />
              : <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#0ea5e9,#0284c7)', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #0ea5e9' }}>
                  <span style={{ color:'white', fontWeight:800, fontSize:12 }}>NK</span>
                </div>
            }
            <div style={{ position:'absolute', bottom:-2, right:-2, background:'#0ea5e9', borderRadius:'50%', padding:2 }}>
              <Image size={8} color="white" />
            </div>
          </div>
          <div style={{ fontWeight:900, fontSize:11, letterSpacing:1, color:'#0ea5e9', lineHeight:1.1, textAlign:'center' }}>
            NO KOMPLEX AI-PRODUCTOR
          </div>
          <input ref={avatarInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarChange} />
        </div>

        {/* Droite: langues */}
        <div style={{ display:'flex', background:'#f1f5f9', borderRadius:20, padding:2, minWidth:120, justifyContent:'flex-end' }}>
          {Object.keys(LANGUAGES).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding:'3px 8px', borderRadius:20, fontSize:10, fontWeight:600, border:'none', cursor:'pointer', transition:'all .2s', background: lang===l?'#0ea5e9':'transparent', color: lang===l?'white':'#64748b' }}>{l.toUpperCase()}</button>
          ))}
        </div>
      </header>

      {/* ── BARRE MODE SÉLECTION ── */}
      {selectMode && (
        <div style={{ background:'#0ea5e9', padding:'8px 16px', display:'flex', alignItems:'center', gap:8, justifyContent:'space-between' }}>
          <span style={{ color:'white', fontSize:13, fontWeight:600 }}>{selected.length} message(s) sélectionné(s)</span>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={copySelected} disabled={selected.length===0} style={{ background:'white', color:'#0ea5e9', border:'none', borderRadius:20, padding:'4px 12px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
              {t.copySelected}
            </button>
            <button onClick={copyAll} style={{ background:'rgba(255,255,255,0.2)', color:'white', border:'1px solid rgba(255,255,255,0.4)', borderRadius:20, padding:'4px 12px', fontSize:12, cursor:'pointer' }}>
              {t.copyAll}
            </button>
            <button onClick={() => { setSelectMode(false); setSelected([]); }} style={{ background:'none', border:'none', color:'white', cursor:'pointer' }}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── HISTORIQUE PANEL ── */}
      {showHistory && (
        <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(232,238,247,0.97)', backdropFilter:'blur(8px)', overflowY:'auto', padding:16 }}>
          <div style={{ maxWidth:500, margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <button onClick={() => setShowHistory(false)} style={{ background:'#f1f5f9', border:'none', borderRadius:'50%', padding:8, cursor:'pointer' }}>
                <ChevronLeft size={18} color="#475569" />
              </button>
              <h2 style={{ fontSize:17, fontWeight:700, color:'#0f172a' }}>{t.historyTitle}</h2>
              <button onClick={newSession} style={{ marginLeft:'auto', background:'#0ea5e9', color:'white', border:'none', borderRadius:20, padding:'6px 14px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                + {t.newSession}
              </button>
            </div>
            {sessions.length === 0 && <p style={{ color:'#94a3b8', textAlign:'center', padding:32 }}>Aucune session sauvegardée</p>}
            {sessions.map(s => (
              <div key={s.id} onClick={() => loadSession(s)} style={{ background: s.id===currentSession.id?'#eff6ff':'white', border:`1px solid ${s.id===currentSession.id?'#bfdbfe':'#d1dae8'}`, borderRadius:12, padding:'12px 16px', marginBottom:8, cursor:'pointer', transition:'all .2s' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>
                    {s.messages[0]?.content?.slice(0,40) || 'Session vide'}...
                  </span>
                  <span style={{ fontSize:10, color:'#94a3b8' }}>{new Date(s.createdAt).toLocaleDateString(userLocale)}</span>
                </div>
                <span style={{ fontSize:11, color:'#94a3b8' }}>{s.messages.length} messages</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL BLUETOOTH ── */}
      {showBtModal && (
        <div style={{ position:'fixed', inset:0, zIndex:60, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div style={{ background:'white', borderRadius:20, padding:24, maxWidth:340, width:'100%', boxShadow:'0 8px 40px rgba(0,0,0,0.2)' }}>
            {/* Icône status */}
            <div style={{ textAlign:'center', marginBottom:16 }}>
              {btStatus === 'idle' || btStatus === 'connecting' ? (
                <div style={{ width:64, height:64, borderRadius:'50%', background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                  <Bluetooth size={28} color="#0ea5e9" style={{ animation: btStatus==='connecting' ? 'pulse 1s infinite' : 'none' }} />
                </div>
              ) : btStatus === 'connected' || btStatus === 'sending' || btStatus === 'sent' ? (
                <div style={{ width:64, height:64, borderRadius:'50%', background:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                  <BluetoothConnected size={28} color="#16a34a" />
                </div>
              ) : (
                <div style={{ width:64, height:64, borderRadius:'50%', background:'#fee2e2', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                  <BluetoothOff size={28} color="#dc2626" />
                </div>
              )}

              {/* Titre status */}
              <h3 style={{ fontSize:16, fontWeight:700, color:'#0f172a', marginBottom:4 }}>
                {btStatus === 'idle'          && t.bluetooth}
                {btStatus === 'connecting'    && t.btConnecting}
                {btStatus === 'connected'     && t.btConnected}
                {btStatus === 'sending'       && t.btSending}
                {btStatus === 'sent'          && t.btSent}
                {btStatus === 'error'         && 'Erreur'}
                {btStatus === 'unsupported'   && 'Non supporté'}
              </h3>

              {/* Nom appareil */}
              {btDevice && (
                <p style={{ fontSize:13, color:'#0ea5e9', fontWeight:600 }}>📱 {btDevice.name || 'Appareil inconnu'}</p>
              )}

              {/* Message contextuel */}
              <p style={{ fontSize:12, color:'#64748b', marginTop:6, lineHeight:1.5 }}>
                {btStatus === 'idle'          && "Recherche d'appareils Bluetooth à proximité"}
                {btStatus === 'connecting'    && 'Sélectionnez votre appareil dans la liste...'}
                {btStatus === 'connected'     && `Connecté à ${btDevice?.name || "l'appareil"}. Prêt à transférer.`}
                {btStatus === 'sending'       && 'Transfert du chat en cours...'}
                {btStatus === 'sent'          && 'Chat transféré avec succès !'}
                {btStatus === 'error'         && t.btError}
                {btStatus === 'unsupported'   && t.btUnsupported}
              </p>
            </div>

            {/* Barre progression si envoi */}
            {(btStatus === 'sending' || btStatus === 'connecting') && (
              <div style={{ height:4, background:'#f1f5f9', borderRadius:2, margin:'12px 0', overflow:'hidden' }}>
                <div style={{ height:'100%', background:'#0ea5e9', borderRadius:2, animation:'progress 1.5s ease-in-out infinite', width:'60%' }} />
              </div>
            )}

            {/* Actions */}
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:16 }}>
              {(btStatus === 'idle' || btStatus === 'error') && (
                <button onClick={handleBluetooth} style={{ background:'#0ea5e9', color:'white', border:'none', borderRadius:12, padding:'12px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                  <Bluetooth size={14} style={{ marginRight:6, verticalAlign:'middle' }} />
                  Rechercher des appareils
                </button>
              )}
              {btStatus === 'connected' && (
                <button onClick={handleBluetooth} style={{ background:'#16a34a', color:'white', border:'none', borderRadius:12, padding:'12px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                  Envoyer le chat vers cet appareil
                </button>
              )}
              {btStatus === 'sent' && (
                <button onClick={() => { setBtStatus('idle'); setBtDevice(null); }} style={{ background:'#0ea5e9', color:'white', border:'none', borderRadius:12, padding:'12px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                  Transférer vers un autre appareil
                </button>
              )}
              {btStatus === 'unsupported' && (
                <p style={{ fontSize:11, color:'#94a3b8', textAlign:'center' }}>
                  Utilisez Chrome ou Edge sur desktop pour activer le Bluetooth
                </p>
              )}
              <button onClick={() => { setShowBtModal(false); if(btStatus !== 'connected') setBtStatus('idle'); }} style={{ background:'#f1f5f9', color:'#475569', border:'none', borderRadius:12, padding:'10px', fontSize:13, cursor:'pointer' }}>
                {btStatus === 'connected' ? 'Laisser connecté & fermer' : 'Fermer'}
              </button>
              {btDevice && (
                <button onClick={disconnectBluetooth} style={{ background:'#fff5f5', color:'#dc2626', border:'1px solid #fecaca', borderRadius:12, padding:'8px', fontSize:12, cursor:'pointer' }}>
                  Déconnecter l'appareil
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PANEL ADMIN ── */}
      {isAdmin && (
        <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(232,238,247,0.97)', backdropFilter:'blur(8px)', overflowY:'auto', padding:24 }}>
          <div style={{ maxWidth:500, margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
              <div style={{ background:'#eff6ff', borderRadius:'50%', padding:8 }}><ShieldCheck size={22} color="#0ea5e9" /></div>
              <div>
                <h1 style={{ fontSize:18, fontWeight:800, color:'#0f172a' }}>{t.adminTitle}</h1>
                <p style={{ fontSize:11, color:'#64748b' }}>NO KOMPLEX AI-PRODUCTOR — Lesly Tech LLC</p>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              <div style={{ background:'white', border:'1px solid #d1dae8', borderRadius:12, padding:16 }}>
                <p style={{ fontSize:11, color:'#94a3b8', marginBottom:4 }}>Messages utilisés</p>
                <p style={{ fontSize:26, fontWeight:700, color:'#0ea5e9' }}>{msgCount}<span style={{ fontSize:13, color:'#94a3b8' }}>/{TIERS[plan].limit===Infinity?'∞':TIERS[plan].limit}</span></p>
              </div>
              <div style={{ background:'white', border:'1px solid #d1dae8', borderRadius:12, padding:16 }}>
                <p style={{ fontSize:11, color:'#94a3b8', marginBottom:4 }}>Plan actuel</p>
                <p style={{ fontSize:18, fontWeight:700, color:TIERS[plan].color }}>{TIERS[plan].label}</p>
              </div>
            </div>

            {/* Statut IA + Power */}
            <div style={{ background:'white', border:'1px solid #d1dae8', borderRadius:12, padding:16, marginBottom:12 }}>
              <p style={{ fontSize:12, color:'#64748b', marginBottom:10 }}>Statut de l'IA</p>
              <button onClick={() => setIsActive(v => !v)} style={{ display:'flex', alignItems:'center', gap:8, background: isActive?'#dcfce7':'#fee2e2', border:`1px solid ${isActive?'#86efac':'#fca5a5'}`, borderRadius:10, padding:'10px 16px', cursor:'pointer', width:'100%', fontSize:14, fontWeight:600, color: isActive?'#16a34a':'#dc2626' }}>
                <Power size={16} />{isActive ? t.active : t.inactive}
                <span style={{ marginLeft:'auto', fontSize:11, opacity:.7 }}>{isActive?'Cliquer pour désactiver':'Cliquer pour activer'}</span>
              </button>
            </div>

            {/* Changer avatar */}
            <div style={{ background:'white', border:'1px solid #d1dae8', borderRadius:12, padding:16, marginBottom:12 }}>
              <p style={{ fontSize:12, color:'#64748b', marginBottom:10 }}>{t.changeAvatar}</p>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                {avatar
                  ? <img src={avatar} alt="avatar" style={{ width:48, height:48, borderRadius:'50%', objectFit:'cover', border:'2px solid #0ea5e9' }} />
                  : <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#0ea5e9,#0284c7)', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ color:'white', fontWeight:800 }}>NK</span></div>
                }
                <button onClick={() => avatarInputRef.current?.click()} style={{ background:'#eff6ff', border:'1px solid #bfdbfe', color:'#0ea5e9', borderRadius:8, padding:'8px 16px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                  <Image size={14} style={{ marginRight:6, verticalAlign:'middle' }} />Choisir une image
                </button>
                {avatar && <button onClick={() => setAvatar(null)} style={{ background:'#fff5f5', border:'1px solid #fecaca', color:'#dc2626', borderRadius:8, padding:'8px 12px', fontSize:12, cursor:'pointer' }}>Retirer</button>}
              </div>
            </div>

            {/* Changer plan */}
            <div style={{ background:'white', border:'1px solid #d1dae8', borderRadius:12, padding:16, marginBottom:12 }}>
              <p style={{ fontSize:12, color:'#64748b', marginBottom:8 }}>{t.changePlan}</p>
              <select value={plan} onChange={e => setPlan(e.target.value)} style={{ width:'100%', padding:'8px 12px', border:'1px solid #d1dae8', borderRadius:8, fontSize:14, background:'white', color:'#1e293b' }}>
                {Object.entries(TIERS).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>

            {/* Upgrade */}
            <div style={{ background:'white', border:'1px solid #fde68a', borderRadius:12, padding:16, marginBottom:12 }}>
              <p style={{ fontSize:12, color:'#64748b', marginBottom:8 }}>Passer à un plan supérieur</p>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => handleUpgrade('PRO')} style={{ flex:1, background:'#eff6ff', border:'1px solid #bfdbfe', color:'#0ea5e9', padding:'8px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>Pro — $19/mois</button>
                <button onClick={() => handleUpgrade('ELITE')} style={{ flex:1, background:'#fffbeb', border:'1px solid #fde68a', color:'#d97706', padding:'8px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>Élite — $49/mois</button>
              </div>
            </div>

            {/* Reset */}
            <button onClick={() => { setCS(prev => ({...prev, messages:[]})); setMsgCount(0); }} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:'#fff5f5', color:'#dc2626', border:'1px solid #fecaca', padding:'10px', borderRadius:12, fontSize:13, cursor:'pointer', marginBottom:12 }}>
              <Trash2 size={14} />{t.resetHistory}
            </button>
            <button onClick={() => setIsAdmin(false)} style={{ width:'100%', background:'#0ea5e9', color:'white', border:'none', padding:'12px', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer' }}>
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* ── ZONE DE CHAT ── */}
      <main style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:10 }}>
        {messages.map(m => (
          <div key={m.id} style={{ display:'flex', justifyContent: m.role==='user'?'flex-end':'flex-start', alignItems:'flex-start', gap:6 }}>
            {/* Checkbox mode sélection */}
            {selectMode && (
              <div onClick={() => setSelected(prev => prev.includes(m.id) ? prev.filter(x=>x!==m.id) : [...prev, m.id])} style={{ cursor:'pointer', paddingTop:12, flexShrink:0 }}>
                {selected.includes(m.id) ? <CheckSquare size={18} color="#0ea5e9" /> : <Square size={18} color="#94a3b8" />}
              </div>
            )}
            <div style={{ position:'relative', maxWidth:'82%', padding:'12px 16px',
              borderRadius: m.role==='user'?'18px 18px 4px 18px':'18px 18px 18px 4px',
              background: m.role==='user'?'linear-gradient(135deg,#0ea5e9,#0284c7)':'white',
              color: m.role==='user'?'white':'#1e293b', fontSize:14, lineHeight:1.6,
              boxShadow:'0 2px 8px rgba(0,0,0,0.08)',
              border: m.role==='ai'?'1px solid #d1dae8':'none',
              cursor: selectMode?'pointer':'default',
              outline: selectMode && selected.includes(m.id) ? '2px solid #0ea5e9' : 'none'
            }} onClick={() => selectMode && setSelected(prev => prev.includes(m.id)?prev.filter(x=>x!==m.id):[...prev,m.id])}>
              {m.content && <p style={{ whiteSpace:'pre-wrap', margin:0 }}>{m.content}</p>}
              {m.file && <FilePreview file={m.file} />}
              {!selectMode && (
                <button onClick={(e) => { e.stopPropagation(); copyMsg(m.id, m.content); }}
                  style={{ position:'absolute', top:-8, right:-8, background:'white', border:'1px solid #d1dae8', borderRadius:'50%', padding:4, cursor:'pointer', opacity:0, transition:'opacity .2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity='1'}
                  onMouseLeave={e => e.currentTarget.style.opacity='0'}>
                  <Copy size={10} color="#64748b" />
                </button>
              )}
              {copied===m.id && <span style={{ position:'absolute', top:-22, right:0, fontSize:11, background:'#0ea5e9', color:'white', padding:'2px 8px', borderRadius:8 }}>✓ Copié</span>}
            </div>
          </div>
        ))}

        {/* Animation IA */}
        {aiPhase && (
          <div style={{ display:'flex', justifyContent:'flex-start' }}>
            <AIThinking phase={aiPhase} lang={lang} />
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background:'white', borderTop:'1px solid #d1dae8', padding:'10px 16px' }}>

        {/* Fichier attaché preview */}
        {attachedFile && (
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:10, padding:'6px 12px', marginBottom:8 }}>
            <Paperclip size={14} color="#0ea5e9" />
            <span style={{ fontSize:12, color:'#0284c7', flex:1 }}>{attachedFile.name}</span>
            <button onClick={() => setAttachedFile(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}><X size={14} /></button>
          </div>
        )}

        {/* Boutons d'action */}
        <div style={{ display:'flex', gap:6, marginBottom:8, overflowX:'auto', paddingBottom:2 }}>
          {[
            { icon:<ChevronLeft size={12}/>, label:t.back, action:() => window.history.back() },
            { icon:<Usb size={12}/>, label:t.usb, action:() => exportChat('txt') },
            { icon: btStatus === 'connected' ? <BluetoothConnected size={12}/> : <Bluetooth size={12}/>, label: t.bluetooth, action:() => setShowBtModal(true), bt: true, active: btStatus === 'connected' },
            { icon:<Download size={12}/>, label:t.export, action:() => exportChat('json') },
            { icon:<Share2 size={12}/>, label:t.share, action:() => navigator.clipboard.writeText(window.location.href) },
            { icon:<Copy size={12}/>, label:t.copyAll, action:copyAll },
            { icon:<CheckSquare size={12}/>, label:t.selectMode, action:() => setSelectMode(v=>!v), active: selectMode },
            { icon:<Trash2 size={12}/>, label:t.clear, action:() => setCS(prev=>({...prev,messages:[]})) },
            { icon:<Crown size={12}/>, label:t.upgrade, action:() => handleUpgrade(plan==='FREE'?'PRO':'ELITE'), gold:true },
          ].map((btn,i) => (
            <button key={i} onClick={btn.action} style={{ display:'flex', alignItems:'center', gap:4, background: btn.gold?'#fffbeb': btn.bt&&btStatus==='connected'?'#dcfce7': btn.active?'#eff6ff':'#f1f5f9', border:`1px solid ${btn.gold?'#fde68a':btn.bt&&btStatus==='connected'?'#86efac':btn.active?'#bfdbfe':'#d1dae8'}`, color: btn.gold?'#d97706':btn.bt&&btStatus==='connected'?'#16a34a':btn.active?'#0ea5e9':'#475569', padding:'5px 10px', borderRadius:20, fontSize:11, whiteSpace:'nowrap', cursor:'pointer', fontWeight:500 }}>
              {btn.icon}{btn.label}
            </button>
          ))}
        </div>

        {/* Saisie */}
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <button onClick={() => fileInputRef.current?.click()} style={{ background:'#f1f5f9', border:'1px solid #d1dae8', borderRadius:'50%', width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }} title={t.attachFile}>
            <Paperclip size={16} color="#64748b" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt" style={{ display:'none' }} onChange={e => handleFileAttach(e.target.files[0])} />

          <input type="text" value={input}
            onChange={e => { setInput(e.target.value); checkAdmin(e.target.value); }}
            onKeyDown={e => e.key==='Enter' && !e.shiftKey && handleSend()}
            placeholder={isActive ? t.placeholder : '⏸ IA désactivée — Accès admin requis'}
            disabled={!!aiPhase}
            style={{ flex:1, border:'1.5px solid #d1dae8', borderRadius:24, padding:'11px 16px', fontSize:13, outline:'none', background:'white', color:'#1e293b', transition:'border-color .2s' }}
            onFocus={e => e.target.style.borderColor='#0ea5e9'}
            onBlur={e => e.target.style.borderColor='#d1dae8'}
          />
          <button onClick={handleSend} disabled={(!input.trim()&&!attachedFile)||!!aiPhase} style={{ background:(input.trim()||attachedFile)?'#0ea5e9':'#e2e8f0', border:'none', borderRadius:'50%', width:42, height:42, display:'flex', alignItems:'center', justifyContent:'center', cursor:(input.trim()||attachedFile)?'pointer':'not-allowed', transition:'background .2s', flexShrink:0 }}>
            {aiPhase ? <div style={{ width:16, height:16, border:'2px solid white', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} /> : <Send size={16} color="white" />}
          </button>
        </div>

        {/* Plan + branding */}
        <div style={{ marginTop:6, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:10, letterSpacing:1 }}>
          <span style={{ color:TIERS[plan].color, fontWeight:600 }}>{TIERS[plan].label} · {msgCount}/{TIERS[plan].limit===Infinity?'∞':TIERS[plan].limit}</span>
          {plan!=='ELITE' && <span style={{ color:'#cbd5e1' }}>NO KOMPLEX AI-PRODUCTOR</span>}
          <span style={{ color:'#cbd5e1' }}>© {new Date().getFullYear()} Lesly Tech LLC</span>
        </div>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes progress { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes fadeStep { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
