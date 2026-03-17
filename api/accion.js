/**
 * /api/accion — GET
 * El docente hace clic desde su correo: ?token=xxx&accion=aprobar|rechazar
 * Devuelve una página HTML de confirmación.
 */
const {
  store, ESTADOS, enviarCorreo,
  tplEstudianteOK, tplMonitor, tplEstudianteNO, htmlConfirmacion,
} = require("./_lib");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") return res.status(405).end();

  const { token, accion } = req.query;

  if (!token || !["aprobar", "rechazar"].includes(accion)) {
    return res.status(400).send(htmlConfirmacion("❌ Enlace inválido", "El enlace está malformado o la acción no es reconocida.", false));
  }

  const solicitud = store.get(token);
  if (!solicitud) {
    return res.status(404).send(htmlConfirmacion("❌ No encontrada", "Esta solicitud no existe o el enlace ya expiró.", false));
  }

  // Acción ya procesada
  if (solicitud.estado !== ESTADOS.PENDIENTE_DOCENTE) {
    const msg = solicitud.estado === ESTADOS.APROBADA_DOCENTE || solicitud.estado === ESTADOS.COMPLETADA
      ? "Esta solicitud ya fue aprobada anteriormente."
      : "Esta solicitud ya fue rechazada anteriormente.";
    return res.send(htmlConfirmacion("ℹ️ Acción ya procesada", msg, true));
  }

  // ── APROBAR ──────────────────────────────────────────────────────────────────
  if (accion === "aprobar") {
    solicitud.estado = ESTADOS.APROBADA_DOCENTE;
    solicitud.historial.push({ estado: ESTADOS.APROBADA_DOCENTE, ts: new Date().toISOString() });
    store.set(token, solicitud);

    console.log(`✅ Aprobada: ${solicitud.id}`);

    // Paso 3 — Envío simultáneo al monitor y al estudiante
    const [rMonitor, rEstudiante] = await Promise.all([
      enviarCorreo({
        to     : process.env.MONITOR_EMAIL || "monitor.sistemas@fadp.edu.co",
        subject: `[FADP] Préstamo autorizado — ${solicitud.estudiante.nombre} | ${solicitud.equipo}`,
        html   : tplMonitor(solicitud),
      }),
      enviarCorreo({
        to     : solicitud.estudiante.correo,
        subject: `[FADP] ✅ Tu préstamo fue autorizado — ${solicitud.equipo}`,
        html   : tplEstudianteOK(solicitud),
      }),
    ]);

    solicitud.estado = ESTADOS.COMPLETADA;
    solicitud.historial.push({ estado: ESTADOS.COMPLETADA, ts: new Date().toISOString() });
    store.set(token, solicitud);

    return res.send(htmlConfirmacion(
      "✅ Préstamo aprobado",
      `Aprobaste el préstamo de <strong>${solicitud.estudiante.nombre} ${solicitud.estudiante.apellido}</strong>.<br><br>
       Monitor notificado: ${rMonitor.ok ? "✅" : "⚠️ error"}<br>
       Estudiante notificado: ${rEstudiante.ok ? "✅" : "⚠️ error"}`,
      true
    ));
  }

  // ── RECHAZAR ─────────────────────────────────────────────────────────────────
  if (accion === "rechazar") {
    solicitud.estado = ESTADOS.RECHAZADA_DOCENTE;
    solicitud.historial.push({ estado: ESTADOS.RECHAZADA_DOCENTE, ts: new Date().toISOString() });
    store.set(token, solicitud);

    console.log(`❌ Rechazada: ${solicitud.id}`);

    await enviarCorreo({
      to     : solicitud.estudiante.correo,
      subject: "[FADP] Tu solicitud de préstamo no fue aprobada",
      html   : tplEstudianteNO(solicitud),
    });

    return res.send(htmlConfirmacion(
      "❌ Solicitud rechazada",
      `Rechazaste el préstamo de <strong>${solicitud.estudiante.nombre} ${solicitud.estudiante.apellido}</strong>.<br><br>El estudiante fue notificado.`,
      true
    ));
  }
};
