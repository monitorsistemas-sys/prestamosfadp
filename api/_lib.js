/**
 * _lib.js — Utilidades compartidas entre las funciones de Vercel
 * Almacenamiento en memoria global (persiste entre llamadas en el mismo worker)
 * Para producción real: reemplazar `store` por una BD (PlanetScale, Supabase, etc.)
 */

const nodemailer = require("nodemailer");

// ─── Store global ─────────────────────────────────────────────────────────────
// Vercel reutiliza workers, así que el Map sobrevive entre requests del mismo worker.
// Para pruebas es suficiente. En producción usar Upstash Redis o similar.
if (!global.__fadpStore) global.__fadpStore = new Map();
const store = global.__fadpStore;

// ─── Estados ──────────────────────────────────────────────────────────────────
const ESTADOS = {
  PENDIENTE_DOCENTE : "pendiente_docente",
  APROBADA_DOCENTE  : "aprobada_docente",
  RECHAZADA_DOCENTE : "rechazada_docente",
  COMPLETADA        : "completada",
};

// ─── Transporter SMTP ─────────────────────────────────────────────────────────
function getTransporter() {
  return nodemailer.createTransport({
    host   : process.env.SMTP_HOST || "smtp.gmail.com",
    port   : parseInt(process.env.SMTP_PORT || "587"),
    secure : false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
}

async function enviarCorreo({ to, subject, html }) {
  const t = getTransporter();
  try {
    const info = await t.sendMail({
      from: process.env.SMTP_FROM || '"FADP Préstamos" <noreply@fadp.edu.co>',
      to, subject, html,
    });
    console.log(`📧 → ${to} | ${info.messageId}`);
    return { ok: true };
  } catch (err) {
    console.error(`❌ Correo fallido → ${to}:`, err.message);
    return { ok: false, error: err.message };
  }
}

// ─── URL helper ──────────────────────────────────────────────────────────────
function actionUrl(token, accion) {
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.APP_BASE_URL || "http://localhost:3000";
  return `${base}/api/accion?token=${token}&accion=${accion}`;
}

// ─── Templates ────────────────────────────────────────────────────────────────
function tplDocente(s) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<style>
body{font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px}
.card{background:#fff;border-radius:12px;max-width:560px;margin:0 auto;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,.08)}
.hdr{background:#1a1f36;border-radius:8px;padding:20px 24px;margin-bottom:24px}
.hdr h1{color:#e8d5b7;margin:0;font-size:20px}.hdr p{color:#8b8fa8;margin:4px 0 0;font-size:13px}
.f{margin-bottom:14px}.f label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8b8fa8;display:block;margin-bottom:2px}
.f value{font-size:15px;color:#1a1f36;font-weight:500}
hr{border:none;border-top:1px solid #eee;margin:20px 0}
.acts{display:flex;gap:12px;margin-top:24px}
.ok{background:#0d7a4a;color:#fff;padding:13px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;flex:1;text-align:center;display:block}
.no{background:#c0392b;color:#fff;padding:13px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;flex:1;text-align:center;display:block}
.ft{font-size:12px;color:#aaa;margin-top:24px;text-align:center}
</style></head><body>
<div class="card">
  <div class="hdr"><h1>📋 Solicitud de Préstamo — FADP</h1><p>Requiere su aprobación</p></div>
  <div class="f"><label>Estudiante</label><value>${s.estudiante.nombre} ${s.estudiante.apellido}</value></div>
  <div class="f"><label>Código</label><value>${s.estudiante.codigo}</value></div>
  <div class="f"><label>Correo del estudiante</label><value>${s.estudiante.correo}</value></div>
  <hr>
  <div class="f"><label>Equipos</label><value>${s.equipo}</value></div>
  <div class="f"><label>Cantidad</label><value>${s.cantidad}</value></div>
  <div class="f"><label>Fecha y hora</label><value>${new Date(s.fechaHora).toLocaleString("es-CO",{dateStyle:"full",timeStyle:"short"})}</value></div>
  <div class="f"><label>Motivo</label><value>${s.motivo||"No especificado"}</value></div>
  <hr>
  <p style="font-size:14px;color:#444">Como docente, puede aprobar o rechazar esta solicitud:</p>
  <div class="acts">
    <a href="${actionUrl(s.token,"aprobar")}" class="ok">✅ Aprobar</a>
    <a href="${actionUrl(s.token,"rechazar")}" class="no">❌ Rechazar</a>
  </div>
  <p class="ft">ID: ${s.id} · ${new Date().toLocaleString("es-CO")}</p>
</div></body></html>`;
}

function tplEstudianteOK(s) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<style>
body{font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px}
.card{background:#fff;border-radius:12px;max-width:520px;margin:0 auto;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,.08)}
.badge{background:#e6f9f0;border:1px solid #0d7a4a;border-radius:8px;padding:16px 20px;margin-bottom:24px}
.badge h2{color:#0d7a4a;margin:0 0 4px;font-size:18px}.badge p{color:#2d6a4f;margin:0;font-size:13px}
.f{margin-bottom:12px}.f label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8b8fa8;display:block;margin-bottom:2px}
.f value{font-size:15px;color:#1a1f36;font-weight:500}
.ft{font-size:12px;color:#aaa;margin-top:24px;text-align:center}
</style></head><body>
<div class="card">
  <div class="badge"><h2>✅ ¡Préstamo Autorizado!</h2><p>Tu docente aprobó tu solicitud.</p></div>
  <p style="font-size:14px;color:#444">Hola <strong>${s.estudiante.nombre}</strong>, el monitor de sistemas coordinará la entrega.</p>
  <div class="f"><label>Equipos</label><value>${s.equipo}</value></div>
  <div class="f"><label>Cantidad</label><value>${s.cantidad}</value></div>
  <div class="f"><label>Fecha y hora</label><value>${new Date(s.fechaHora).toLocaleString("es-CO",{dateStyle:"full",timeStyle:"short"})}</value></div>
  <div class="f"><label>Docente autorizador</label><value>${s.correoDocente}</value></div>
  <p class="ft">Ref: ${s.id} · FADP Sistema de Préstamos</p>
</div></body></html>`;
}

function tplMonitor(s) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<style>
body{font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px}
.card{background:#fff;border-radius:12px;max-width:560px;margin:0 auto;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,.08)}
.hdr{background:#1a1f36;border-radius:8px;padding:20px 24px;margin-bottom:24px}
.hdr h1{color:#e8d5b7;margin:0;font-size:20px}.hdr p{color:#8b8fa8;margin:4px 0 0;font-size:13px}
.tag{display:inline-block;background:#e6f9f0;color:#0d7a4a;border:1px solid #0d7a4a;border-radius:6px;padding:4px 12px;font-size:12px;font-weight:600;margin-bottom:20px}
.f{margin-bottom:14px}.f label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8b8fa8;display:block;margin-bottom:2px}
.f value{font-size:15px;color:#1a1f36;font-weight:500}
hr{border:none;border-top:1px solid #eee;margin:20px 0}
.ft{font-size:12px;color:#aaa;margin-top:24px;text-align:center}
</style></head><body>
<div class="card">
  <div class="hdr"><h1>🖥️ Solicitud de Equipos — FADP</h1><p>Aprobada por docente · Lista para entrega</p></div>
  <span class="tag">✅ APROBADA POR DOCENTE</span>
  <div class="f"><label>Estudiante</label><value>${s.estudiante.nombre} ${s.estudiante.apellido}</value></div>
  <div class="f"><label>Código</label><value>${s.estudiante.codigo}</value></div>
  <div class="f"><label>Correo</label><value>${s.estudiante.correo}</value></div>
  <div class="f"><label>Semestre</label><value>${s.estudiante.semestre||"No especificado"}</value></div>
  <hr>
  <div class="f"><label>Equipos</label><value>${s.equipo}</value></div>
  <div class="f"><label>Cantidad</label><value>${s.cantidad}</value></div>
  <div class="f"><label>Fecha y hora</label><value>${new Date(s.fechaHora).toLocaleString("es-CO",{dateStyle:"full",timeStyle:"short"})}</value></div>
  <div class="f"><label>Motivo</label><value>${s.motivo||"No especificado"}</value></div>
  <hr>
  <div class="f"><label>Docente autorizador</label><value>${s.correoDocente}</value></div>
  <p class="ft">Ref: ${s.id} · ${new Date().toLocaleString("es-CO",{dateStyle:"full",timeStyle:"short"})}</p>
</div></body></html>`;
}

function tplEstudianteNO(s) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<style>
body{font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px}
.card{background:#fff;border-radius:12px;max-width:480px;margin:0 auto;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,.08)}
.badge{background:#fdf0ee;border:1px solid #c0392b;border-radius:8px;padding:16px 20px;margin-bottom:24px}
.badge h2{color:#c0392b;margin:0 0 4px;font-size:18px}.badge p{color:#7a1e15;margin:0;font-size:13px}
.ft{font-size:12px;color:#aaa;margin-top:24px;text-align:center}
</style></head><body>
<div class="card">
  <div class="badge"><h2>❌ Solicitud no aprobada</h2><p>Tu docente rechazó la solicitud.</p></div>
  <p style="font-size:14px;color:#444">Hola <strong>${s.estudiante.nombre}</strong>, tu solicitud de <em>${s.equipo}</em> no fue autorizada. Comunícate con tu docente si crees que es un error.</p>
  <p class="ft">Ref: ${s.id} · FADP Sistema de Préstamos</p>
</div></body></html>`;
}

function htmlConfirmacion(titulo, mensaje, exito) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titulo} — FADP</title>
<style>
*{box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f0f0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px}
.card{background:#fff;border-radius:16px;max-width:460px;width:100%;padding:40px 36px;box-shadow:0 4px 24px rgba(0,0,0,.1);text-align:center}
.icon{font-size:52px;margin-bottom:16px}
h1{font-size:22px;color:${exito?"#1a1f36":"#c0392b"};margin:0 0 12px}
p{font-size:15px;color:#555;line-height:1.6}
.badge{display:inline-block;background:${exito?"#e6f9f0":"#fdf0ee"};color:${exito?"#0d7a4a":"#c0392b"};border-radius:8px;padding:6px 16px;font-size:13px;font-weight:600;margin-top:20px}
.ft{font-size:11px;color:#bbb;margin-top:28px}
</style></head><body>
<div class="card">
  <div class="icon">${exito?"✅":"❌"}</div>
  <h1>${titulo}</h1><p>${mensaje}</p>
  <div class="badge">Sistema FADP Préstamos</div>
  <p class="ft">Puede cerrar esta ventana.</p>
</div></body></html>`;
}

module.exports = { store, ESTADOS, enviarCorreo, tplDocente, tplEstudianteOK, tplMonitor, tplEstudianteNO, htmlConfirmacion };
