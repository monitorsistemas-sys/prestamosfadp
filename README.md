# 🚀 FADP Préstamos — Deploy en Vercel + GitHub

## Estructura del proyecto

```
fadp-loans/
├── api/                  ← Serverless Functions (backend Node.js)
│   ├── _lib.js           ← Utilidades compartidas (store, correos, templates)
│   ├── crear.js          ← POST /api/crear
│   ├── accion.js         ← GET  /api/accion
│   ├── estado.js         ← GET  /api/estado
│   └── health.js         ← GET  /api/health
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   └── App.jsx           ← Frontend React
├── package.json
└── vercel.json
```

---

## Paso 1 — Subir a GitHub

```bash
# En tu máquina local, dentro de la carpeta del proyecto:
git init
git add .
git commit -m "FADP Loans inicial"

# Crea el repo en github.com (botón New Repository)
# Luego conecta y sube:
git remote add origin https://github.com/TU_USUARIO/fadp-loans.git
git branch -M main
git push -u origin main
```

---

## Paso 2 — Conectar con Vercel

1. Ve a **vercel.com** → **Add New Project**
2. Selecciona el repo `fadp-loans` de tu GitHub
3. Vercel detecta automáticamente que es un proyecto React + Functions
4. **NO cambies nada** en Build Settings — deja los defaults:
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Clic en **Deploy** (fallará en correos hasta que configures el .env — eso es normal)

---

## Paso 3 — Configurar Variables de Entorno en Vercel

En tu proyecto de Vercel → **Settings → Environment Variables**, agrega:

| Nombre           | Valor                                      |
|------------------|--------------------------------------------|
| `SMTP_HOST`      | `smtp.gmail.com`                           |
| `SMTP_PORT`      | `587`                                      |
| `SMTP_USER`      | `tu-correo@gmail.com`                      |
| `SMTP_PASS`      | `xxxx xxxx xxxx xxxx` *(App Password)*     |
| `SMTP_FROM`      | `"FADP Préstamos" <tu-correo@gmail.com>`   |
| `MONITOR_EMAIL`  | `monitor.sistemas@fadp.edu.co`             |

> ⚠️ **Gmail App Password**: en tu cuenta Google → Seguridad → Verificación en 2 pasos → Contraseñas de aplicaciones. Crea una para "Correo".

Después de agregar las variables → **Redeploy** (Deployments → ··· → Redeploy).

---

## Paso 4 — ¡Listo para pruebas!

Tu app queda en: `https://fadp-loans.vercel.app` (o el nombre que Vercel asigne)

### URLs disponibles:
```
GET  /api/health             → verifica que el backend responde
POST /api/crear              → crea solicitud
GET  /api/accion?token=X&accion=aprobar
GET  /api/estado?id=FADP-XXX
```

### Probar desde terminal:
```bash
# Health check
curl https://fadp-loans.vercel.app/api/health

# Crear solicitud de prueba
curl -X POST https://fadp-loans.vercel.app/api/crear \
  -H "Content-Type: application/json" \
  -d '{
    "estudiante": {
      "nombre": "María",
      "apellido": "García",
      "codigo": "2024001",
      "correo": "tu-correo@gmail.com"
    },
    "correoDocente": "correo-docente@gmail.com",
    "equipo": "Cámara Sony A7 III",
    "cantidad": 1,
    "fechaHora": "2025-12-01T10:00",
    "motivo": "Proyecto final"
  }'
```

---

## ⚠️ Nota importante sobre el almacenamiento

Las Serverless Functions de Vercel son **stateless** — el `Map` en memoria se reinicia entre deploys y puede perderse entre requests fríos.

Para pruebas cortas esto funciona. Si necesitas persistencia real antes de tener el servidor institucional, agrega **Upstash Redis** (gratis):

1. upstash.com → crear DB Redis
2. Agregar `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` en Vercel
3. Reemplazar `global.__fadpStore` en `_lib.js` por `@upstash/redis`

---

## Migrar al servidor institucional (cuando tengas acceso)

Solo cambia el DNS / URL — el código del `backend/server.js` original (Express puro) va en el servidor sin cambios. El frontend solo necesita apuntar a la nueva URL.
