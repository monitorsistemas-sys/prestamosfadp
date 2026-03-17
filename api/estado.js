/**
 * /api/estado — GET ?id=FADP-XXXX
 * Consulta el estado actual de una solicitud.
 */
const { store } = require("./_lib");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido" });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Falta parámetro: id" });

  for (const [, sol] of store) {
    if (sol.id === id) {
      return res.json({
        id        : sol.id,
        estado    : sol.estado,
        createdAt : sol.createdAt,
        historial : sol.historial,
        equipo    : sol.equipo,
        cantidad  : sol.cantidad,
        fechaHora : sol.fechaHora,
      });
    }
  }

  return res.status(404).json({ error: "Solicitud no encontrada" });
};
