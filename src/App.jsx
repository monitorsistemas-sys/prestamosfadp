import { useState, createContext, useContext } from "react";

const API_BASE = "";

// ─── Traducciones ─────────────────────────────────────────────────────────────
const T = {
  es: {
    appSubtitle   : "Sistemas y Multimedios",
    accessTitle   : "Acceso al Sistema",
    accessSub     : "Ingresa tu correo institucional para continuar",
    emailLabel    : "Correo Institucional",
    emailPlaceholder: "estudiante@fadp.edu.co",
    emailNote     : "Este correo recibirá todas las notificaciones",
    rememberMe    : "Recordarme",
    continue      : "Continuar →",
    emailError    : "Ingresa un correo institucional válido.",
    newRequest    : "Nueva Solicitud de Préstamo",
    sStudent      : "Datos del Estudiante",
    nombre        : "Nombre", apellido: "Apellido",
    codigo        : "Código Estudiantil", semestre: "Semestre",
    sEquipos      : "Equipos a Solicitar",
    noEquipos     : "Sin equipos añadidos",
    addEquipo     : "+ Añadir equipo",
    selectEquipo  : "Selecciona un equipo",
    allAdded      : "Ya añadiste todos los equipos disponibles",
    sFechas       : "Fecha y Hora",
    salida        : "📤 Salida", devolucion: "📥 Devolución",
    motivo        : "Motivo / Descripción",
    motivoPh      : "Describe el proyecto o actividad...",
    sDocente      : "Autorización Docente",
    docenteLabel  : "Correo del Docente",
    docentePh     : "docente@fadp.edu.co",
    docenteNote   : "💡 El docente recibirá un correo para aprobar o rechazar. El monitor solo es notificado tras la aprobación.",
    sTerminos     : "Compromiso de Responsabilidad",
    terminosText  : "Acepto el",
    terminosLink  : "compromiso de responsabilidad y los términos y condiciones",
    terminosPost  : "del préstamo de equipos de la FADP.",
    aceptado      : "Compromiso aceptado",
    enviar        : "Enviar al Docente →",
    enviando      : "Enviando solicitud…",
    errEquipos    : "Debes añadir al menos un equipo.",
    errDocente    : "Correo del docente inválido.",
    errSalida     : "Indica la fecha y hora de salida.",
    errDevolucion : "Indica la fecha y hora de devolución.",
    errFechas     : "La devolución debe ser posterior a la salida.",
    errTerminos   : "Debes aceptar el compromiso de responsabilidad para continuar.",
    sent          : "¡Solicitud Enviada!",
    sentSub       : (c) => `Tu docente recibirá el correo para aprobar.\nRecibirás una notificación en`,
    refCode       : "Código de referencia",
    refNote       : "Guárdalo para rastrear tu solicitud",
    step1         : "Enviado al docente",
    step2         : "Esperando aprobación",
    step3         : "Monitor recibe si aprueba",
    newReq        : "Nueva solicitud",
    horario       : "Horario disponible:",
    elegirFecha   : "Seleccionar",
    elegirHora    : "Elegir hora →",
    meses         : ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
    diasSem       : ["D","L","M","X","J","V","S"],
    tTermTitulo   : "📋 Términos y Condiciones",
    tTermEntendido: "Entendido ✓",
    tTermContent  : [
      { h: "1. Responsabilidad del estudiante", p: "El estudiante solicitante asume plena responsabilidad sobre los equipos prestados desde el momento de su entrega hasta su devolución al monitor de sistemas. Cualquier daño, pérdida o robo deberá ser reportado de inmediato." },
      { h: "2. Condiciones de uso", p: "Los equipos prestados son de uso exclusivo para actividades académicas de la FADP. Queda prohibido su uso para fines personales, comerciales o ajenos a la institución." },
      { h: "3. Devolución puntual", p: "El estudiante se compromete a devolver los equipos en la fecha y hora indicadas en la solicitud. El incumplimiento reiterado podrá resultar en la suspensión temporal del servicio de préstamo." },
      { h: "4. Estado de los equipos", p: "Los equipos deben ser devueltos en las mismas condiciones en que fueron entregados. El estudiante verificará el estado al recibirlos y reportará cualquier anomalía previa." },
      { h: "5. Daños y pérdidas", p: "En caso de daño por mal uso o pérdida, el estudiante asumirá los costos de reparación o reposición según el valor comercial del bien establecido por la FADP." },
      { h: "6. Autorización docente", p: "Todo préstamo requiere la autorización expresa del docente responsable. Sin dicha aprobación, el préstamo no será procesado ni entregado por el monitor de sistemas." },
      { h: "7. Aceptación", p: "Al marcar la casilla de aceptación, el estudiante declara haber leído, entendido y aceptado en su totalidad los presentes términos, comprometiéndose a su cumplimiento durante el período del préstamo." },
    ],
  },
  en: {
    appSubtitle   : "Systems & Multimedia",
    accessTitle   : "System Access",
    accessSub     : "Enter your institutional email to continue",
    emailLabel    : "Institutional Email",
    emailPlaceholder: "student@fadp.edu.co",
    emailNote     : "This email will receive all notifications",
    rememberMe    : "Remember me",
    continue      : "Continue →",
    emailError    : "Please enter a valid institutional email.",
    newRequest    : "New Loan Request",
    sStudent      : "Student Information",
    nombre        : "First Name", apellido: "Last Name",
    codigo        : "Student ID", semestre: "Semester",
    sEquipos      : "Equipment to Request",
    noEquipos     : "No equipment added yet",
    addEquipo     : "+ Add equipment",
    selectEquipo  : "Select equipment",
    allAdded      : "You've already added all available equipment",
    sFechas       : "Date & Time",
    salida        : "📤 Checkout", devolucion: "📥 Return",
    motivo        : "Purpose / Description",
    motivoPh      : "Describe the project or activity...",
    sDocente      : "Teacher Authorization",
    docenteLabel  : "Teacher's Email",
    docentePh     : "teacher@fadp.edu.co",
    docenteNote   : "💡 The teacher will receive an email to approve or reject. The monitor is only notified after approval.",
    sTerminos     : "Responsibility Agreement",
    terminosText  : "I accept the",
    terminosLink  : "responsibility agreement and terms and conditions",
    terminosPost  : "for FADP equipment loans.",
    aceptado      : "Agreement accepted",
    enviar        : "Send to Teacher →",
    enviando      : "Submitting request…",
    errEquipos    : "You must add at least one piece of equipment.",
    errDocente    : "Invalid teacher email.",
    errSalida     : "Please select a checkout date and time.",
    errDevolucion : "Please select a return date and time.",
    errFechas     : "Return must be after checkout.",
    errTerminos   : "You must accept the responsibility agreement to continue.",
    sent          : "Request Submitted!",
    sentSub       : (c) => `Your teacher will receive the approval email.\nYou'll get a notification at`,
    refCode       : "Reference Code",
    refNote       : "Save it to track your request",
    step1         : "Sent to teacher",
    step2         : "Awaiting approval",
    step3         : "Monitor notified upon approval",
    newReq        : "New request",
    horario       : "Available hours:",
    elegirFecha   : "Select",
    elegirHora    : "Choose time →",
    meses         : ["January","February","March","April","May","June","July","August","September","October","November","December"],
    diasSem       : ["S","M","T","W","T","F","S"],
    tTermTitulo   : "📋 Terms & Conditions",
    tTermEntendido: "Got it ✓",
    tTermContent  : [
      { h: "1. Student Responsibility", p: "The requesting student assumes full responsibility for the loaned equipment from the moment of delivery until its return to the systems monitor. Any damage, loss, or theft must be reported immediately." },
      { h: "2. Conditions of Use", p: "Loaned equipment is for exclusive use in FADP academic activities. Use for personal, commercial, or non-institutional purposes is strictly prohibited." },
      { h: "3. Timely Return", p: "The student agrees to return the equipment by the date and time specified in the request. Repeated non-compliance may result in temporary suspension of the loan service." },
      { h: "4. Equipment Condition", p: "Equipment must be returned in the same condition as delivered. The student will verify its condition upon receipt and report any prior damage." },
      { h: "5. Damage & Loss", p: "In case of damage due to misuse or loss, the student will bear the repair or replacement cost at the commercial value established by FADP." },
      { h: "6. Teacher Authorization", p: "All loans require explicit approval from the responsible teacher. Without such approval, the loan will not be processed or delivered by the systems monitor." },
      { h: "7. Acceptance", p: "By checking the acceptance box, the student declares having read, understood, and fully accepted these terms, committing to compliance throughout the loan period." },
    ],
  },
};

// Catálogo bilingüe
const EQUIPOS_CATALOGO = [
  { id: "cam_sony",      es: "Cámara Sony A7 III",     en: "Sony A7 III Camera",       icono: "📷" },
  { id: "cam_canon",     es: "Cámara Canon EOS R",     en: "Canon EOS R Camera",       icono: "📸" },
  { id: "mic_rode",      es: "Micrófono Rode NT1",     en: "Rode NT1 Microphone",      icono: "🎙️" },
  { id: "mic_shure",     es: "Micrófono Shure SM7B",   en: "Shure SM7B Microphone",    icono: "🎤" },
  { id: "tripode",       es: "Trípode",                en: "Tripod",                   icono: "📐" },
  { id: "reflector",     es: "Reflector / Panel LED",  en: "LED Light Panel",          icono: "💡" },
  { id: "lente_wide",    es: "Lente Gran Angular",     en: "Wide Angle Lens",          icono: "🔭" },
  { id: "grabadora",     es: "Grabadora de Audio",     en: "Audio Recorder",           icono: "🎚️" },
  { id: "estabilizador", es: "Estabilizador / Gimbal", en: "Gimbal Stabilizer",        icono: "🎬" },
  { id: "drone",         es: "Drone DJI",              en: "DJI Drone",                icono: "🚁" },
  { id: "laptop",        es: "Laptop Edición",         en: "Editing Laptop",           icono: "💻" },
  { id: "disco",         es: "Disco Duro Externo",     en: "External Hard Drive",      icono: "💾" },
];

// ─── Contextos de tema e idioma ───────────────────────────────────────────────
const ThemeCtx = createContext({ dark: true });
const LangCtx  = createContext({ lang: "es" });

function useTheme() { return useContext(ThemeCtx); }
function useLang()  { const { lang } = useContext(LangCtx); return T[lang]; }

// Paleta que cambia con el tema
function useC() {
  const { dark } = useTheme();
  return {
    red       : "#D32F2F",
    redDark   : "#B71C1C",
    redLight  : dark ? "#3D1010" : "#FFEBEE",
    redLightText: dark ? "#FF8A80" : "#B71C1C",
    bg        : dark ? "#0D0D0D"  : "#F2F2F2",
    bgCard    : dark ? "#1A1A1A"  : "#FFFFFF",
    bgInput   : dark ? "#2C2C2C"  : "#FFFFFF",
    bgInputFocus: dark ? "#333"   : "#FFFFFF",
    surface   : dark ? "#242424"  : "#F8F8F8",
    headerBg  : dark ? "#111111"  : "#FFFFFF",
    headerBorder: dark ? "transparent" : "#E0E0E0",
    textPrimary : dark ? "#F0F0F0"  : "#0D0D0D",
    textSecondary: dark ? "#9E9E9E" : "#616161",
    textMuted : dark ? "#555555"  : "#9E9E9E",
    border    : dark ? "#2E2E2E"  : "#E0E0E0",
    borderInput: dark ? "#3A3A3A" : "#E0E0E0",
    green     : "#2E7D32",
    greenBg   : dark ? "#0D2E0F"  : "#E8F5E9",
    greenText : dark ? "#81C784"  : "#2E7D32",
    warnBg    : dark ? "#2A2000"  : "#FFFDE7",
    warnBorder: dark ? "#4A3800"  : "#FFF176",
    warnText  : dark ? "#FFD54F"  : "#5D4037",
    modalBg   : dark ? "#1E1E1E"  : "#FFFFFF",
    dayDisabled: dark ? "#333"    : "#E0E0E0",
    dayDisText: dark ? "#444"     : "#BDBDBD",
    slotBg    : dark ? "#2A2A2A"  : "#F5F5F5",
    slotText  : dark ? "#E0E0E0"  : "#0D0D0D",
    overlayBg : "rgba(0,0,0,0.65)",
    shadow    : dark ? "0 2px 12px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.08)",
  };
}

// ─── Barra de controles (tema + idioma) ──────────────────────────────────────
function ControlBar({ dark, setDark, lang, setLang }) {
  const C = useC();
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "flex-end",
      gap: 8, padding: "10px 16px",
      background: C.headerBg, borderBottom: `1px solid ${C.headerBorder}`,
    }}>
      {/* Idioma */}
      <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}` }}>
        {["es","en"].map((l) => (
          <button key={l} type="button" onClick={() => setLang(l)} style={{
            padding: "5px 11px", border: "none", cursor: "pointer",
            background: lang === l ? "#D32F2F" : C.bgInput,
            color: lang === l ? "#FFF" : C.textSecondary,
            fontSize: 11, fontWeight: "700", fontFamily: "inherit",
            letterSpacing: "0.06em", transition: "all 0.15s",
          }}>{l.toUpperCase()}</button>
        ))}
      </div>
      {/* Tema */}
      <button type="button" onClick={() => setDark(!dark)} style={{
        width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.border}`,
        background: C.bgInput, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 17, transition: "background 0.2s",
      }}>
        {dark ? "☀️" : "🌙"}
      </button>
    </div>
  );
}

// ─── Input genérico ───────────────────────────────────────────────────────────
function Input({ label, value, onChange, type = "text", placeholder, required, icon }) {
  const [focused, setFocused] = useState(false);
  const C = useC();
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: "700",
        color: focused ? "#D32F2F" : C.textSecondary, marginBottom: 5,
        letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s",
      }}>
        {label}{required && <span style={{ color: "#D32F2F" }}> *</span>}
      </label>
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{
            position: "absolute", left: 13, top: "50%",
            transform: "translateY(-50%)", fontSize: 17, pointerEvents: "none",
          }}>{icon}</span>
        )}
        <input
          type={type} value={value} onChange={onChange}
          placeholder={placeholder} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: icon ? "13px 13px 13px 42px" : "13px",
            border: `2px solid ${focused ? "#D32F2F" : C.borderInput}`,
            borderRadius: 11, fontSize: 15,
            color: C.textPrimary, background: C.bgInput,
            outline: "none",
            boxShadow: focused ? `0 0 0 4px ${C.redLight}` : "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxSizing: "border-box", WebkitAppearance: "none",
            fontFamily: "inherit",
          }}
        />
      </div>
    </div>
  );
}

// ─── Separador de sección ─────────────────────────────────────────────────────
function SectionHeader({ children }) {
  const C = useC();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ flex: 1, height: 1, background: C.border }} />
      <span style={{
        fontSize: 10, fontWeight: "800", color: "#D32F2F",
        letterSpacing: "0.14em", textTransform: "uppercase", whiteSpace: "nowrap",
      }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

// ─── Slots de tiempo ──────────────────────────────────────────────────────────
const TIME_SLOTS = (() => {
  const slots = [];
  for (let m = 450; m <= 1230; m += 15) {
    const h = Math.floor(m / 60), min = m % 60;
    const hh = String(h).padStart(2,"0"), mm = String(min).padStart(2,"0");
    const ampm = h < 12 ? "a.m." : "p.m.";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    slots.push({ value: `${hh}:${mm}`, label: `${h12}:${mm} ${ampm}` });
  }
  return slots;
})();

function parseDT(str) {
  if (!str) return { date: "", time: "" };
  const [datePart, timePart = ""] = str.split("T");
  return { date: datePart, time: timePart.slice(0,5) };
}

function ahoraColombia() {
  const co = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }));
  const p = (n) => String(n).padStart(2,"0");
  return `${co.getFullYear()}-${p(co.getMonth()+1)}-${p(co.getDate())}T${p(co.getHours())}:${p(co.getMinutes())}`;
}

// ─── Selector de fecha + hora personalizado ───────────────────────────────────
function DateField({ label, value, onChange, required, minValue }) {
  const p = (n) => String(n).padStart(2,"0");
  const C = useC();
  const t = useLang();
  const [open, setOpen]   = useState(false);
  const [step, setStep]   = useState("date");
  const { date, time }    = parseDT(value);
  const { date: minDate, time: minTime } = parseDT(minValue);

  const todayCO = (() => {
    const co = new Date(new Date().toLocaleString("en-US",{timeZone:"America/Bogota"}));
    return `${co.getFullYear()}-${p(co.getMonth()+1)}-${p(co.getDate())}`;
  })();

  const getInitCal = () => {
    if (date) return { y: parseInt(date.slice(0,4)), mo: parseInt(date.slice(5,7))-1 };
    const co = new Date(new Date().toLocaleString("en-US",{timeZone:"America/Bogota"}));
    return { y: co.getFullYear(), mo: co.getMonth() };
  };
  const [calY,  setCalY]  = useState(() => getInitCal().y);
  const [calMo, setCalMo] = useState(() => getInitCal().mo);

  const firstDay    = new Date(calY, calMo, 1).getDay();
  const daysInMonth = new Date(calY, calMo+1, 0).getDate();

  const prevMo = () => {
    const nd = new Date(calY, calMo-1, 1);
    if (minDate && nd < new Date(parseInt(minDate.slice(0,4)), parseInt(minDate.slice(5,7))-1, 1)) return;
    setCalY(nd.getFullYear()); setCalMo(nd.getMonth());
  };
  const nextMo = () => { const nd = new Date(calY,calMo+1,1); setCalY(nd.getFullYear()); setCalMo(nd.getMonth()); };

  const isDayDisabled = (day) => { const ds=`${calY}-${p(calMo+1)}-${p(day)}`; return minDate ? ds < minDate : false; };
  const selectDay = (day) => {
    if (isDayDisabled(day)) return;
    const ds = `${calY}-${p(calMo+1)}-${p(day)}`;
    onChange({ target: { value: time ? `${ds}T${time}` : ds } });
    setStep("time");
  };
  const isTimeDisabled = (slot) => {
    if (!date||!minDate||date>minDate) return false;
    if (date===minDate&&minTime) return slot.value < minTime;
    return false;
  };
  const selectTime = (slot) => {
    if (isTimeDisabled(slot)) return;
    const d = date||`${calY}-${p(calMo+1)}-01`;
    onChange({ target: { value: `${d}T${slot.value}` } });
    setOpen(false);
  };

  const displayText = () => {
    if (!value) return null;
    const { date: d, time: ti } = parseDT(value);
    if (!d) return null;
    const [y,mo,dy] = d.split("-");
    const slot = TIME_SLOTS.find((s) => s.value===ti);
    return `${dy}/${mo}/${y}${slot ? " · "+slot.label : ""}`;
  };

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <label style={{
        display:"block", fontSize:11, fontWeight:"700",
        color: open ? "#D32F2F" : C.textSecondary,
        marginBottom:5, letterSpacing:"0.06em", textTransform:"uppercase", transition:"color 0.2s",
      }}>
        {label}{required&&<span style={{color:"#D32F2F"}}> *</span>}
      </label>

      <button type="button" onClick={() => { setOpen(!open); setStep("date"); }} style={{
        width:"100%", padding:"12px 10px",
        border:`2px solid ${open ? "#D32F2F" : C.borderInput}`,
        borderRadius:11, background:C.bgInput, outline:"none",
        cursor:"pointer", fontFamily:"inherit",
        boxShadow: open ? `0 0 0 4px ${C.redLight}` : "none",
        transition:"border-color 0.2s, box-shadow 0.2s",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <span style={{ fontSize:12, fontWeight: value?"600":"400", color: value?C.textPrimary:C.textMuted }}>
          {displayText() || t.elegirFecha}
        </span>
        <span style={{ fontSize:14, color:C.textSecondary }}>{open&&step==="time"?"🕐":"📅"}</span>
      </button>

      {open && (
        <div style={{
          position:"fixed", inset:0, zIndex:1500,
          display:"flex", alignItems:"flex-end", background:C.overlayBg,
        }} onClick={() => setOpen(false)}>
          <div style={{
            background:C.modalBg, borderRadius:"20px 20px 0 0",
            width:"100%", maxHeight:"82vh", overflowY:"auto",
            paddingBottom:32, animation:"slideUp 0.22s ease",
          }} onClick={(e) => e.stopPropagation()}>

            <div style={{ width:36, height:4, borderRadius:2, background:C.border, margin:"12px auto 0" }} />

            {/* Tabs */}
            <div style={{ display:"flex", margin:"14px 16px 0", borderRadius:10, overflow:"hidden", border:`1px solid ${C.border}` }}>
              {[{id:"date",ico:"📅",txt:t.meses[0].slice(0,3)!=="Jan"?"Fecha":"Date"},{id:"time",ico:"🕐",txt:t.meses[0].slice(0,3)!=="Jan"?"Hora":"Time"}].map((tb) => (
                <button key={tb.id} type="button" onClick={() => setStep(tb.id)}
                  disabled={tb.id==="time"&&!date}
                  style={{
                    flex:1, padding:"10px 0", border:"none",
                    background: step===tb.id ? "#D32F2F" : C.bgInput,
                    color: step===tb.id ? "#FFF" : (tb.id==="time"&&!date)?C.border:C.textSecondary,
                    fontSize:13, fontWeight:"700",
                    cursor:(tb.id==="time"&&!date)?"not-allowed":"pointer",
                    fontFamily:"inherit", transition:"background 0.15s",
                  }}>
                  {tb.ico} {tb.txt}
                </button>
              ))}
            </div>

            {/* Calendario */}
            {step==="date" && (
              <div style={{ padding:"16px 16px 0" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                  <button type="button" onClick={prevMo} style={{ width:34,height:34,borderRadius:9,border:`1px solid ${C.border}`,background:C.bgInput,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.textPrimary }}>‹</button>
                  <span style={{ fontSize:15, fontWeight:"700", color:C.textPrimary }}>{t.meses[calMo]} {calY}</span>
                  <button type="button" onClick={nextMo} style={{ width:34,height:34,borderRadius:9,border:`1px solid ${C.border}`,background:C.bgInput,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.textPrimary }}>›</button>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:4 }}>
                  {t.diasSem.map((d,i) => <div key={i} style={{ textAlign:"center",fontSize:11,fontWeight:"700",color:C.textSecondary,padding:"4px 0" }}>{d}</div>)}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
                  {Array(firstDay).fill(null).map((_,i) => <div key={"e"+i}/>)}
                  {Array(daysInMonth).fill(null).map((_,i) => {
                    const day=i+1, ds=`${calY}-${p(calMo+1)}-${p(day)}`;
                    const disabled=isDayDisabled(day), isSelected=date===ds, isToday=ds===todayCO;
                    return (
                      <button key={day} type="button" onClick={() => selectDay(day)} disabled={disabled} style={{
                        padding:"10px 0", border:"none", borderRadius:9,
                        background: isSelected?"#D32F2F":isToday?C.redLight:"transparent",
                        color: disabled?C.dayDisText:isSelected?"#FFF":isToday?"#D32F2F":C.textPrimary,
                        fontSize:14, fontWeight:(isSelected||isToday)?"700":"400",
                        cursor:disabled?"not-allowed":"pointer", fontFamily:"inherit",
                      }}>{day}</button>
                    );
                  })}
                </div>
                {date && (
                  <button type="button" onClick={() => setStep("time")} style={{
                    width:"100%", marginTop:16, padding:"13px",
                    background:"#D32F2F", color:"#FFF", border:"none",
                    borderRadius:11, fontSize:14, fontWeight:"700",
                    cursor:"pointer", fontFamily:"inherit",
                  }}>{t.elegirHora}</button>
                )}
              </div>
            )}

            {/* Slots de hora */}
            {step==="time" && (
              <div style={{ padding:"14px 16px 0" }}>
                <p style={{ margin:"0 0 12px", fontSize:12, color:C.textSecondary, textAlign:"center" }}>
                  {t.horario} <strong style={{color:C.textPrimary}}>7:30 a.m. — 8:30 p.m.</strong>
                </p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:7 }}>
                  {TIME_SLOTS.map((slot) => {
                    const disabled=isTimeDisabled(slot), isSelected=time===slot.value;
                    return (
                      <button key={slot.value} type="button" onClick={() => !disabled&&selectTime(slot)} disabled={disabled} style={{
                        padding:"11px 4px", border:"none", borderRadius:10,
                        background: isSelected?"#D32F2F":disabled?C.surface:C.slotBg,
                        color: isSelected?"#FFF":disabled?C.dayDisText:C.slotText,
                        fontSize:13, fontWeight:isSelected?"700":"500",
                        cursor:disabled?"not-allowed":"pointer", fontFamily:"inherit",
                        boxShadow:isSelected?`0 2px 8px rgba(211,47,47,0.3)`:"none",
                        transition:"all 0.12s",
                      }}>{slot.label}</button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Modal de Términos ────────────────────────────────────────────────────────
function ModalTerminos({ onCerrar }) {
  const C = useC();
  const t = useLang();
  return (
    <div style={{
      position:"fixed", inset:0, background:C.overlayBg,
      zIndex:2000, display:"flex", alignItems:"flex-end",
      backdropFilter:"blur(4px)",
    }} onClick={onCerrar}>
      <div style={{
        background:C.modalBg, borderRadius:"22px 22px 0 0",
        width:"100%", maxHeight:"88vh", overflowY:"auto",
        paddingBottom:40, animation:"slideUp 0.25s ease",
      }} onClick={(e) => e.stopPropagation()}>

        <div style={{ width:36,height:4,borderRadius:2,background:C.border,margin:"14px auto 0" }} />

        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"16px 20px 12px", borderBottom:`1px solid ${C.border}`,
          position:"sticky", top:0, background:C.modalBg, zIndex:1,
        }}>
          <h2 style={{ margin:0, fontSize:17, fontWeight:"800", color:C.textPrimary }}>{t.tTermTitulo}</h2>
          <button onClick={onCerrar} style={{
            background:C.surface, border:"none", borderRadius:8,
            width:32, height:32, fontSize:16, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            color:C.textSecondary,
          }}>✕</button>
        </div>

        <div style={{ padding:"20px", fontSize:14, color:C.textSecondary, lineHeight:1.7 }}>
          <p style={{ fontWeight:"700", color:"#D32F2F", marginTop:0 }}>
            Fundación Academia de Dibujo Profesional — FADP<br />
            Sistemas y Multimedios
          </p>
          {t.tTermContent.map((item, i) => (
            <div key={i}>
              <h3 style={{ fontSize:12, fontWeight:"800", color:C.textPrimary, letterSpacing:"0.04em", textTransform:"uppercase", marginTop:18 }}>{item.h}</h3>
              <p style={{ margin:0 }}>{item.p}</p>
            </div>
          ))}
        </div>

        <div style={{ padding:"0 20px" }}>
          <button onClick={onCerrar} style={{
            width:"100%", padding:"15px", background:"#D32F2F",
            color:"#FFF", border:"none", borderRadius:13,
            fontSize:15, fontWeight:"700", cursor:"pointer", fontFamily:"inherit",
          }}>{t.tTermEntendido}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Selector de equipos ──────────────────────────────────────────────────────
function SelectorEquipos({ equipos, onChange }) {
  const [modal, setModal] = useState(false);
  const C = useC();
  const t = useLang();
  const { lang } = useContext(LangCtx);

  const nombre = (eq) => eq[lang] || eq.es;

  const agregar = (eq) => {
    if (!equipos.find((e) => e.id===eq.id))
      onChange([...equipos, { ...eq, cantidad:1 }]);
    setModal(false);
  };
  const cambiarQty = (id, delta) =>
    onChange(equipos.map((e) => e.id===id ? {...e, cantidad:Math.max(1,e.cantidad+delta)} : e));
  const quitar = (id) => onChange(equipos.filter((e) => e.id!==id));
  const disponibles = EQUIPOS_CATALOGO.filter((e) => !equipos.find((s) => s.id===e.id));

  return (
    <>
      {equipos.length===0 ? (
        <div style={{ border:`2px dashed ${C.border}`, borderRadius:12, padding:"24px 16px", textAlign:"center", marginBottom:12 }}>
          <div style={{ fontSize:28, marginBottom:6 }}>📦</div>
          <p style={{ color:C.textSecondary, fontSize:14, margin:0 }}>{t.noEquipos}</p>
        </div>
      ) : (
        <div style={{ marginBottom:10 }}>
          {equipos.map((eq) => (
            <div key={eq.id} style={{
              display:"flex", alignItems:"center", gap:10,
              background:C.bgCard, border:`1.5px solid ${C.border}`,
              borderRadius:12, padding:"11px 12px", marginBottom:8,
              boxShadow:C.shadow,
            }}>
              <span style={{ fontSize:20 }}>{eq.icono}</span>
              <span style={{ flex:1, fontSize:13, fontWeight:"600", color:C.textPrimary, lineHeight:1.3 }}>{nombre(eq)}</span>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <button type="button" onClick={() => cambiarQty(eq.id,-1)} style={{ width:30,height:30,borderRadius:8,border:`1.5px solid ${C.border}`,background:C.surface,fontSize:18,cursor:"pointer",fontWeight:"700",color:C.textPrimary,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1 }}>−</button>
                <span style={{ fontSize:16,fontWeight:"800",color:"#D32F2F",minWidth:22,textAlign:"center" }}>{eq.cantidad}</span>
                <button type="button" onClick={() => cambiarQty(eq.id,1)} style={{ width:30,height:30,borderRadius:8,border:"none",background:"#D32F2F",fontSize:18,cursor:"pointer",fontWeight:"700",color:"#FFF",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1 }}>+</button>
              </div>
              <button type="button" onClick={() => quitar(eq.id)} style={{ width:28,height:28,borderRadius:7,border:"none",background:C.redLight,fontSize:13,cursor:"pointer",color:C.redLightText,display:"flex",alignItems:"center",justifyContent:"center",marginLeft:2 }}>✕</button>
            </div>
          ))}
        </div>
      )}

      <button type="button" onClick={() => setModal(true)} style={{
        display:"flex", alignItems:"center", justifyContent:"center",
        gap:8, width:"100%", padding:"13px",
        background:C.bgCard, border:`2px solid #D32F2F`,
        borderRadius:12, fontSize:14, fontWeight:"700",
        color:"#D32F2F", cursor:"pointer", fontFamily:"inherit",
      }}>{t.addEquipo}</button>

      {modal && (
        <div style={{ position:"fixed",inset:0,background:C.overlayBg,zIndex:1000,display:"flex",alignItems:"flex-end" }} onClick={() => setModal(false)}>
          <div style={{ background:C.modalBg,borderRadius:"22px 22px 0 0",width:"100%",maxHeight:"72vh",overflowY:"auto",paddingBottom:32,animation:"slideUp 0.22s ease" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width:36,height:4,borderRadius:2,background:C.border,margin:"14px auto" }} />
            <p style={{ fontSize:16,fontWeight:"700",color:C.textPrimary,padding:"0 20px 10px",margin:0,borderBottom:`1px solid ${C.border}` }}>{t.selectEquipo}</p>
            {disponibles.length===0 ? (
              <p style={{ padding:24,color:C.textSecondary,textAlign:"center",fontSize:14 }}>{t.allAdded}</p>
            ) : disponibles.map((eq) => (
              <button key={eq.id} type="button" onClick={() => agregar(eq)} style={{
                display:"flex",alignItems:"center",gap:14,
                width:"100%",padding:"13px 20px",
                background:"transparent",border:"none",
                cursor:"pointer",textAlign:"left",fontFamily:"inherit",
                borderBottom:`1px solid ${C.border}`,
              }}>
                <span style={{ width:42,height:42,borderRadius:11,background:C.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{eq.icono}</span>
                <span style={{ fontSize:14,fontWeight:"500",color:C.textPrimary }}>{nombre(eq)}</span>
                <span style={{ marginLeft:"auto",color:"#D32F2F",fontSize:22,fontWeight:"300" }}>+</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Pantalla 1: Acceso ───────────────────────────────────────────────────────
function PantallaAcceso({ onAcceder }) {
  const [correo, setCorreo]       = useState("");
  const [recordar, setRecordar]   = useState(false);
  const [error, setError]         = useState("");
  const C = useC();
  const t = useLang();

  const submit = (e) => {
    e.preventDefault();
    if (!correo.includes("@") || !correo.includes(".")) { setError(t.emailError); return; }
    onAcceder(correo.trim().toLowerCase());
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg === "#F2F2F2" ? "#f0f0f0" : "#0f1117",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 16px",
    }}>
      {/* Card login */}
      <div style={{
        background: C.bgCard,
        borderRadius: 18,
        padding: "32px 28px 24px",
        width: "100%", maxWidth: 400,
        marginTop: 0,
        boxShadow: C.bg === "#F2F2F2"
          ? "0 8px 32px rgba(0,0,0,0.12)"
          : "0 8px 40px rgba(0,0,0,0.5)",
      }}>
        <h2 style={{ color: C.textPrimary, fontSize: 22, fontWeight: "800", margin: "0 0 4px" }}>
          {t.accessTitle}
        </h2>
        <p style={{ color: C.textSecondary, fontSize: 13, margin: "0 0 24px" }}>
          {t.accessSub}
        </p>

        <form onSubmit={submit}>
          {/* Email */}
          <label style={{
            display: "block", color: C.textSecondary, fontSize: 12,
            fontWeight: "700", letterSpacing: "0.04em", marginBottom: 6,
          }}>
            {t.emailLabel} <span style={{ color: "#D32F2F" }}>*</span>
          </label>
          <input
            type="email" value={correo} autoFocus required
            onChange={(e) => setCorreo(e.target.value)}
            placeholder={t.emailPlaceholder}
            style={{
              width: "100%", padding: "13px 14px",
              background: C.bgInput,
              border: `1.5px solid ${C.borderInput}`,
              borderRadius: 10, fontSize: 15, color: C.textPrimary,
              outline: "none", boxSizing: "border-box",
              fontFamily: "inherit", marginBottom: 8,
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#D32F2F"; e.target.style.boxShadow = `0 0 0 3px ${C.redLight}`; }}
            onBlur={(e)  => { e.target.style.borderColor = C.borderInput; e.target.style.boxShadow = "none"; }}
          />

          {error && (
            <div style={{
              background: C.redLight, border: `1px solid #D32F2F`,
              borderRadius: 8, padding: "9px 13px", marginBottom: 12,
              color: C.redLightText, fontSize: 13,
            }}>⚠️ {error}</div>
          )}

          {/* Recordarme */}
          <label style={{
            display: "flex", alignItems: "center", gap: 9,
            cursor: "pointer", userSelect: "none",
            fontSize: 13, color: C.textSecondary,
            marginBottom: 20, marginTop: 4,
          }}>
            <div
              onClick={() => setRecordar(!recordar)}
              style={{
                width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                border: `2px solid ${recordar ? "#D32F2F" : C.borderInput}`,
                background: recordar ? "#D32F2F" : C.bgInput,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s", cursor: "pointer",
              }}
            >
              {recordar && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            {t.rememberMe}
          </label>

          {/* Botón */}
          <button type="submit" style={{
            width: "100%", padding: "14px",
            background: "#D32F2F", color: "#FFF",
            border: "none", borderRadius: 10,
            fontSize: 15, fontWeight: "700",
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 16px rgba(211,47,47,0.35)",
            letterSpacing: "0.02em", transition: "opacity 0.2s",
          }}
            onMouseOver={(e) => e.target.style.opacity = "0.9"}
            onMouseOut={(e)  => e.target.style.opacity = "1"}
          >{t.continue}</button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
          <p style={{ margin: "0 0 2px", fontSize: 12, color: C.textMuted }}>
            FADP · Departamento de Sistemas y Multimedios
          </p>
          <p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>
            © 2026 · v1.0
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Pantalla 2: Formulario ───────────────────────────────────────────────────
function PantallaFormulario({ correoEstudiante, onExito }) {
  const ahora = ahoraColombia();
  const C = useC();
  const t = useLang();

  const [form, setForm] = useState({ nombre:"",apellido:"",codigo:"",semestre:"",correoDocente:"",motivo:"",fechaSalida:"",fechaDevolucion:"" });
  const [equipos, setEquipos]         = useState([]);
  const [aceptoTerminos, setAcepto]   = useState(false);
  const [verTerminos, setVerTerminos] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const set = (k) => (e) => setForm((f) => ({...f, [k]: e.target.value}));

  const submit = async (e) => {
    e.preventDefault(); setError("");
    if (equipos.length===0)                                               return setError(t.errEquipos);
    if (!form.correoDocente.includes("@"))                                return setError(t.errDocente);
    if (!form.fechaSalida)                                                return setError(t.errSalida);
    if (!form.fechaDevolucion)                                            return setError(t.errDevolucion);
    if (new Date(form.fechaDevolucion) <= new Date(form.fechaSalida))     return setError(t.errFechas);
    if (!aceptoTerminos)                                                  return setError(t.errTerminos);

    setLoading(true);
    try {
      const { lang } = { lang: Object.keys(T).find(l => T[l].enviar === t.enviar) || "es" };
      const resumen = equipos.map((e) => `${e.cantidad}x ${e[lang]||e.es}`).join(", ");
      const res = await fetch(`${API_BASE}/api/crear`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          estudiante: { nombre:form.nombre, apellido:form.apellido, codigo:form.codigo, semestre:form.semestre, correo:correoEstudiante },
          correoDocente:form.correoDocente, equipo:resumen,
          equiposDetalle:equipos,
          cantidad:equipos.reduce((s,e)=>s+e.cantidad,0),
          fechaHora:form.fechaSalida, fechaSalida:form.fechaSalida,
          fechaDevolucion:form.fechaDevolucion, motivo:form.motivo,
          zonaHoraria:"America/Bogota",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error||"Error");
      onExito(data);
    } catch(err) {
      setError(err.message||"No se pudo conectar al servidor.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, paddingBottom:40 }}>
      {verTerminos && <ModalTerminos onCerrar={() => setVerTerminos(false)} />}

      {/* Header sticky */}
      <div style={{ background:C.headerBg, padding:"14px 18px", position:"sticky", top:0, zIndex:10, borderBottom:`1px solid ${C.headerBorder}`, display:"flex", alignItems:"center", gap:12 }}>
        <div>
          <h1 style={{ color:C.textPrimary, fontSize:14, fontWeight:"700", margin:0 }}>{t.newRequest}</h1>
          <p style={{ color:C.textMuted, fontSize:11, margin:0 }}>{correoEstudiante}</p>
        </div>
      </div>

      <form onSubmit={submit} style={{ padding:"16px 14px" }}>

        {/* Datos del estudiante */}
        <div style={{ background:C.bgCard, borderRadius:18, padding:"18px 16px", marginBottom:14, boxShadow:C.shadow }}>
          <SectionHeader>{t.sStudent}</SectionHeader>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <Input label={t.nombre} value={form.nombre} onChange={set("nombre")} placeholder="María" required icon="👤" />
            <Input label={t.apellido} value={form.apellido} onChange={set("apellido")} placeholder="García" required />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <Input label={t.codigo} value={form.codigo} onChange={set("codigo")} placeholder="2024001" required icon="🎓" />
            <Input label={t.semestre} value={form.semestre} onChange={set("semestre")} placeholder="4°" required />
          </div>
        </div>

        {/* Equipos */}
        <div style={{ background:C.bgCard, borderRadius:18, padding:"18px 16px", marginBottom:14, boxShadow:C.shadow }}>
          <SectionHeader>{t.sEquipos}</SectionHeader>
          <SelectorEquipos equipos={equipos} onChange={setEquipos} />
        </div>

        {/* Fechas */}
        <div style={{ background:C.bgCard, borderRadius:18, padding:"18px 16px", marginBottom:14, boxShadow:C.shadow }}>
          <SectionHeader>{t.sFechas}</SectionHeader>
          <div style={{ display:"flex", gap:10, marginBottom:14 }}>
            <DateField label={t.salida} value={form.fechaSalida} onChange={set("fechaSalida")} minValue={ahora} required />
            <DateField label={t.devolucion} value={form.fechaDevolucion} onChange={set("fechaDevolucion")} minValue={form.fechaSalida||ahora} required />
          </div>
          <label style={{ display:"block",fontSize:11,fontWeight:"700",color:C.textSecondary,marginBottom:6,letterSpacing:"0.06em",textTransform:"uppercase" }}>
            {t.motivo} *
          </label>
          <textarea
            value={form.motivo} onChange={set("motivo")}
            placeholder={t.motivoPh} required rows={3}
            style={{ width:"100%",padding:"13px",border:`2px solid ${C.borderInput}`,borderRadius:11,fontSize:14,color:C.textPrimary,background:C.bgInput,outline:"none",resize:"vertical",fontFamily:"inherit",lineHeight:"1.5",boxSizing:"border-box",minHeight:82 }}
            onFocus={(e) => { e.target.style.borderColor="#D32F2F"; e.target.style.boxShadow=`0 0 0 4px ${C.redLight}`; }}
            onBlur={(e)  => { e.target.style.borderColor=C.borderInput; e.target.style.boxShadow="none"; }}
          />
        </div>

        {/* Docente */}
        <div style={{ background:C.bgCard, borderRadius:18, padding:"18px 16px", marginBottom:14, boxShadow:C.shadow }}>
          <SectionHeader>{t.sDocente}</SectionHeader>
          <Input label={t.docenteLabel} type="email" value={form.correoDocente} onChange={set("correoDocente")} placeholder={t.docentePh} required icon="👨‍🏫" />
          <div style={{ background:C.warnBg, border:`1px solid ${C.warnBorder}`, borderRadius:10, padding:"10px 13px" }}>
            <p style={{ margin:0, fontSize:12, color:C.warnText, lineHeight:1.5 }}>{t.docenteNote}</p>
          </div>
        </div>

        {/* Términos */}
        <div style={{ background:C.bgCard, borderRadius:18, padding:"18px 16px", marginBottom:18, boxShadow:C.shadow, border:`2px solid ${aceptoTerminos ? C.green : C.border}`, transition:"border-color 0.2s" }}>
          <SectionHeader>{t.sTerminos}</SectionHeader>
          <label style={{ display:"flex", alignItems:"flex-start", gap:14, cursor:"pointer", userSelect:"none" }}>
            <div onClick={() => setAcepto(!aceptoTerminos)} style={{
              width:24, height:24, borderRadius:7, flexShrink:0, marginTop:1,
              border:`2.5px solid ${aceptoTerminos ? C.green : C.border}`,
              background: aceptoTerminos ? C.green : C.bgInput,
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all 0.2s", cursor:"pointer",
            }}>
              {aceptoTerminos && (
                <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                  <path d="M1.5 5L5 8.5L11.5 1.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <p style={{ margin:0, fontSize:14, color:C.textPrimary, lineHeight:1.6 }}>
              {t.terminosText}{" "}
              <span onClick={(e) => { e.stopPropagation(); setVerTerminos(true); }}
                style={{ color:"#D32F2F", fontWeight:"700", textDecoration:"underline", cursor:"pointer" }}>
                {t.terminosLink}
              </span>
              {" "}{t.terminosPost}
            </p>
          </label>
          {aceptoTerminos && (
            <div style={{ marginTop:12, padding:"10px 12px", background:C.greenBg, borderRadius:9, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:16 }}>✅</span>
              <span style={{ fontSize:12, color:C.greenText, fontWeight:"600" }}>{t.aceptado}</span>
            </div>
          )}
        </div>

        {error && (
          <div style={{ background:C.redLight, border:`1.5px solid #D32F2F`, borderRadius:12, padding:"12px 14px", marginBottom:16, color:C.redLightText, fontSize:14, lineHeight:1.5 }}>
            ⚠️ {error}
          </div>
        )}

        <button type="submit" disabled={loading} style={{
          width:"100%", padding:"17px",
          background: loading ? (C.bg === "#F2F2F2" ? "#BDBDBD" : "#333") : "#D32F2F",
          color:"#FFF", border:"none", borderRadius:15, fontSize:16, fontWeight:"700",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : "0 6px 20px rgba(211,47,47,0.4)",
          fontFamily:"inherit", letterSpacing:"0.02em", transition:"all 0.2s",
        }}>
          {loading ? t.enviando : t.enviar}
        </button>
      </form>
    </div>
  );
}

// ─── Pantalla 3: Confirmación ─────────────────────────────────────────────────
function PantallaConfirmacion({ resultado, correoEstudiante, onNueva }) {
  const C = useC();
  const t = useLang();
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 24px" }}>
      <div>

        <div style={{
          width:90, height:90, borderRadius:"50%",
          background:C.greenBg, border:`3px solid ${C.green}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:46, marginBottom:22,
          animation:"popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>✅</div>

        <h2 style={{ color:C.textPrimary, fontSize:26, fontWeight:"800", margin:"0 0 8px", textAlign:"center" }}>{t.sent}</h2>
        <p style={{ color:C.textSecondary, fontSize:14, textAlign:"center", margin:"0 0 28px", lineHeight:1.6, whiteSpace:"pre-line" }}>
          {t.sentSub()}{"\n"}<span style={{ color:C.textPrimary, fontWeight:"600" }}>{correoEstudiante}</span>
        </p>

        <div style={{ background:C.bgCard, borderRadius:16, padding:"18px 24px", width:"100%", maxWidth:340, textAlign:"center", marginBottom:14, border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
          <p style={{ color:C.textMuted, fontSize:10, fontWeight:"700", letterSpacing:"0.12em", textTransform:"uppercase", margin:"0 0 6px" }}>{t.refCode}</p>
          <p style={{ color:"#D32F2F", fontSize:24, fontWeight:"800", fontFamily:"monospace", margin:0, letterSpacing:"0.06em" }}>{resultado.id}</p>
          <p style={{ color:C.textMuted, fontSize:11, margin:"4px 0 0" }}>{t.refNote}</p>
        </div>

        <div style={{ background:C.bgCard, borderRadius:16, padding:"14px 18px", width:"100%", maxWidth:340, marginBottom:28, border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
          {[
            { icon:"✅", label:t.step1, done:true },
            { icon:"⏳", label:t.step2, active:true },
            { icon:"🔒", label:t.step3, pending:true },
          ].map((s,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom:i<2?`1px solid ${C.border}`:"none" }}>
              <span style={{ fontSize:17 }}>{s.icon}</span>
              <span style={{ fontSize:13, lineHeight:1.4, color: s.done?C.textPrimary:s.active?"#FFCC80":C.textMuted }}>{s.label}</span>
            </div>
          ))}
        </div>

        <button onClick={onNueva} style={{
          background:"transparent", border:`2px solid ${C.border}`,
          color:C.textSecondary, borderRadius:13, padding:"13px 26px",
          fontSize:14, cursor:"pointer", fontFamily:"inherit", fontWeight:"600",
        }}>{t.newReq}</button>
    </div>
  );
}

// ─── App Principal ────────────────────────────────────────────────────────────
export default function App() {
  const [pantalla, setPantalla]       = useState("acceso");
  const [correoEstudiante, setCorreo] = useState("");
  const [resultado, setResultado]     = useState(null);
  const [dark, setDark]               = useState(true);
  const [lang, setLang]               = useState("es");

  return (
    <ThemeCtx.Provider value={{ dark }}>
      <LangCtx.Provider value={{ lang }}>
        <>
          <style>{`
            * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
            body { margin:0; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,sans-serif; background:${dark?"#0D0D0D":"#F2F2F2"}; overscroll-behavior:none; transition:background 0.3s; }
            @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
            @keyframes popIn   { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
            ::-webkit-scrollbar{width:3px}
            ::-webkit-scrollbar-thumb{background:${dark?"#333":"#CCC"};border-radius:2px}
          `}</style>

          {/* Barra de controles siempre visible */}
          <ControlBar dark={dark} setDark={setDark} lang={lang} setLang={setLang} />

          {pantalla==="acceso" && (
            <PantallaAcceso onAcceder={(c) => { setCorreo(c); setPantalla("formulario"); }} />
          )}
          {pantalla==="formulario" && (
            <PantallaFormulario
              correoEstudiante={correoEstudiante}
              onExito={(r) => { setResultado(r); setPantalla("confirmacion"); }}
            />
          )}
          {pantalla==="confirmacion" && (
            <PantallaConfirmacion
              resultado={resultado}
              correoEstudiante={correoEstudiante}
              onNueva={() => { setResultado(null); setPantalla("formulario"); }}
            />
          )}
        </>
      </LangCtx.Provider>
    </ThemeCtx.Provider>
  );
}
