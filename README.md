# MERN Job Posting App

API REST + dashboard web para publicar empleos, autenticación JWT, fotos en Cloudinary y notificaciones por correo.

## Estructura

```
mern-stack-project/
├── client/          # React + Vite (dashboard UI)
├── controllers/
├── models/
├── routes/
└── index.js         # API Express
```

## Requisitos

- Node.js 18+
- MongoDB Atlas
- Cloudinary
- Gmail con contraseña de aplicación (Nodemailer)

## Backend

```bash
npm install
copy .env.example .env
# Edita .env con tus credenciales
npm run dev
```

API: `http://localhost:3000/api`

### Admin (opcional)

```bash
node seedAdmin.js
```

`admin@example.com` / `admin123`

## Frontend (dashboard)

```bash
cd client
npm install
copy .env.example .env
npm run dev
```

UI: `http://localhost:5173`

Por defecto el proxy de Vite envía `/api` → `http://localhost:3000`.

Para apuntar a producción, en `client/.env`:

```
VITE_API_URL=https://mern-job-posting-app.vercel.app/api
```

## Funciones del dashboard

| Rol | Puede |
|-----|--------|
| **employer** / **admin** | Publicar, editar y eliminar empleos |
| **employee** | Ver empleos (recibe email al publicar) |
| **admin** | Ver lista de usuarios |

- Login / registro con sesión (JWT en `localStorage`)
- Búsqueda y paginación de empleos
- Formularios con botones (sin Postman)

## Variables de entorno (API)

| Variable | Descripción |
|----------|-------------|
| `MONGODB_URI` | URI MongoDB |
| `SECRET_KEY` | JWT |
| `CLOUD_NAME` | Cloudinary |
| `API_KEY` | Cloudinary |
| `API_SECRET_KEY` | Cloudinary |
| `EMAIL` | Gmail |
| `PASSWORD` | App password Gmail |

## Deploy

- **API:** Vercel (este repo, raíz) — configura env vars en Vercel
- **UI:** Nuevo proyecto Vercel con **Root Directory** = `client`, variable `VITE_API_URL` = URL de tu API + `/api`

## Endpoints principales

- `POST /api/users/signin` — Login (devuelve `token` + `user`)
- `GET /api/users/me` — Usuario actual (Bearer token)
- `POST /api/users` — Registro
- `GET /api/jobs` — Listar (auth)
- `POST /api/jobs` — Crear (auth)
