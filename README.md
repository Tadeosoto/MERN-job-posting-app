# MERN Job Posting App (Backend)

API REST para registro de usuarios, autenticación JWT, publicación de empleos, subida de fotos a Cloudinary y notificaciones por correo.

## Requisitos

- Node.js 18+
- Cuenta MongoDB Atlas
- Cuenta Cloudinary
- Gmail con contraseña de aplicación (para Nodemailer)

## Instalación

```bash
npm install
```

Copia `.env.example` a `.env` y completa tus variables:

```bash
copy .env.example .env
```

## Ejecutar

```bash
npm run dev
```

El servidor corre en `http://localhost:3000`.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `MONGODB_URI` | URI de conexión a MongoDB |
| `SECRET_KEY` | Clave para firmar JWT |
| `CLOUD_NAME` | Cloud name de Cloudinary |
| `API_KEY` | API key de Cloudinary |
| `API_SECRET_KEY` | API secret de Cloudinary |
| `EMAIL` | Gmail remitente |
| `PASSWORD` | Contraseña de aplicación de Gmail |

## Endpoints principales

- `POST /api/users` — Registro (form-data con `pic` opcional)
- `POST /api/users/signin` — Login
- `POST /api/jobs` — Crear empleo (envía correo a usuarios con rol `employee`)
- `GET /api/jobs` — Listar empleos

## Crear admin (opcional)

```bash
node seedAdmin.js
```

Credenciales por defecto del seed: `admin@example.com` / `admin123`
