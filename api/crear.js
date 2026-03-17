/**
 * /api/crear — POST
 * Crea la solicitud y notifica al docente.
 */
const { v4: uuidv4 } = require("uuid");
const { store, ESTADOS, enviarCorreo, tplDocente } = require("./_lib");

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { estudiante, correoDocente, equipo, cantidad, fechaHora, motivo } = req.body;

  // Validaciones
  if (!correoDocente || !equipo || !cantidad || !fechaHora) {
    return res.status(400).json({ error: "Faltan campos requeridos: correoDocente, equipo, cantidad, fechaHora" });
  }
  if (!estudiante?.nombre || !estudiante?.correo) {
    return res.status(400).json({ error: "Datos del estudiante incompletos (nombre y correo requeridos)" });
  }
  if (!estudiante.correo.includes("@")) {
    return res.status(400).json({ error: "Correo del estudiante inválido" });
  }
  if (!correoDocente.includes("@")) {
    return res.status(400).json({ error: "Correo del docente inválido" });
  }

  const id    = `FADP-${Date.now().toString(36).toUpperCase()}`;
  const token = uuidv4();

  const solicitud = {
    id, token,
    estado   : ESTADOS.PENDIENTE_DOCENTE,
    createdAt: new Date().toISOString(),
    estudiante,
    correoDocente,
    equipo,
    cantidad : parseInt(cantidad),
    fechaHora,
    motivo   : motivo || "",
    historial: [{ estado: ESTADOS.PENDIENTE_DOCENTE, ts: new Date().toISOString() }],
  };

  store.set(token, solicitud);
  console.log(`📝 Solicitud creada: ${id}`);

  const result = await enviarCorreo({
    to     : correoDocente,
    subject: `[FADP] Solicitud de préstamo de ${estudiante.nombre} ${estudiante.apellido} — Requiere aprobación`,
    html   : tplDocente(solicitud),
  });

  return res.status(201).json({
    ok     : true,
    id,
    estado : solicitud.estado,
    correoEnviado: result.ok,
    mensaje: `Solicitud creada. Se notificó al docente ${correoDocente}.`,
  });
};
