# Agenda de Entrevistas - TP DDS 2026

Sistema Full Stack para la gestión integral de entrevistas de trabajo, postulación y seguimiento de candidatos.

## Tecnologías Utilizadas

### Backend
- Node.js + Express
- Base de datos: SQLite con ORM Sequelize
- Autenticación: JWT (Access y Refresh Tokens) con cookies seguras y Bcrypt
- Validación de datos: express-validator
- Seguridad: Helmet, CORS, Rate Limiting (login)
- Testing: Jest + Supertest (13 casos de prueba integrales)

### Frontend
- React 18 + Vite
- Enrutamiento: React Router DOM v6
- Formularios: React Hook Form
- Estilos: Tailwind CSS v4 (sin archivo de configuración, usando `@theme`)
- Iconos: Lucide React
- Cliente HTTP: Axios (con interceptores para manejo automático de tokens)

## Instalación y Ejecución Local

1. Instalar dependencias globales:
```bash
# En el directorio backend/
npm install

# En el directorio frontend/
npm install
```

2. Configurar la base de datos (Backend):
```bash
# En el directorio backend/ (Carga datos iniciales de prueba)
npm run seed
```

3. Levantar los servidores:
```bash
# En el directorio backend/
npm run dev

# En otra terminal, en el directorio frontend/
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

### Usuarios de Prueba (Generados por el Seed)
- **Admin**: `admin@test.com` / `password123`
- **Entrevistador 1**: `entrev1@test.com` / `password123`
- **Entrevistador 2**: `entrev2@test.com` / `password123`
- **Entrevistador 3**: `entrev3@test.com` / `password123`

## Testing

Para ejecutar la batería de pruebas en el backend:
```bash
# En el directorio backend/
npm test
```
Esto utiliza una base de datos SQLite en memoria para no afectar los datos de desarrollo.

## Limitaciones y Decisiones de Diseño

- **Gestión de Sesión Frontend**: Se optó por usar `sessionStorage` para guardar el *access token* en lugar de `localStorage`. Esto es una decisión consciente para mitigar ataques XSS (Cross-Site Scripting) persistentes, de modo que el token se elimina al cerrar la pestaña. Sin embargo, tiene la limitación de que si el usuario abre la aplicación en múltiples pestañas, deberá iniciar sesión nuevamente en cada una. El *refresh token* se maneja de forma segura mediante una cookie `httpOnly`, pero en esta implementación inicial no se implementó un flujo automático de silent-refresh en background.
- **Tailwind v4**: Este proyecto utiliza la última versión de Tailwind CSS (v4). Por este motivo, **no existe el archivo `tailwind.config.js`**. Toda la configuración del tema y customización (colores, fuentes, animaciones) se realiza directamente a través de la directiva `@theme {}` en el archivo `src/index.css` principal.

## Endpoints Principales del Backend

### Autenticación
- `POST /api/auth/register` — Registrar nuevo usuario
- `POST /api/auth/login` — Iniciar sesión (retorna accessToken + cookie refreshToken)
- `POST /api/auth/refresh` — Renovar access token desde cookie
- `POST /api/auth/logout` — Cerrar sesión (limpia cookie)

### Entrevistas
- `GET /api/entrevistas` — Listar con filtros: `?fecha=&estado=&entrevistadorId=&postulanteId=&page=&limit=&sortBy=&order=`
- `GET /api/entrevistas/resumen` — Dashboard admin (protegido: admin/rrhh)
- `GET /api/entrevistas/:id` — Detalle de entrevista
- `GET /api/entrevistas/:id/historial` — Historial de cambios
- `POST /api/entrevistas` — Crear entrevista (protegido: admin/rrhh)
- `PUT /api/entrevistas/:id` — Editar entrevista (protegido: admin/rrhh)
- `PATCH /api/entrevistas/:id/cancelar` — Cancelar (protegido: admin/rrhh)
- `PATCH /api/entrevistas/:id/realizar` — Marcar realizada (entrevistador asignado o admin/rrhh)
- `PATCH /api/entrevistas/:id/reprogramar` — Reprogramar (protegido: admin/rrhh)

### Postulantes
- `GET /api/postulantes` — Listar postulantes (protegido: admin/rrhh)

### Usuarios
- `GET /api/usuarios` — Listar entrevistadores (protegido, usado internamente por formularios)

## Rutas del Frontend

| Ruta | Componente | Acceso |
|------|-----------|--------|
| `/` | Landing | Público |
| `/login` | Login | Público |
| `/register` | Register | Público |
| `/entrevistas` | EntrevistasList | Todos los roles |
| `/entrevistas/nueva` | EntrevistaFormPage | admin, rrhh |
| `/entrevistas/:id` | EntrevistaDetail | Todos los roles |
| `/entrevistas/:id/editar` | EntrevistaFormPage | admin, rrhh |
| `/entrevistas/:id/reprogramar` | ReprogramarPage | admin, rrhh |
| `/resumen` | ResumenAdmin | admin, rrhh |
| `/postulantes` | PostulantesList | admin, rrhh |
| `*` | NotFound | Público |

## Reglas de Negocio

### Superposición de horarios
Al crear, editar o reprogramar una entrevista se verifica que el entrevistador no tenga otra entrevista en estado `programada` o `reprogramada` en la misma fecha con horario superpuesto. La condición de superposición es: `horaInicio < horaFin_existente AND horaFin > horaInicio_existente`. Al editar o reprogramar se excluye la propia entrevista de la comparación.

### Estados del postulante
Solo se pueden programar entrevistas para postulantes en estado `nuevo` o `en_proceso`. Los postulantes en estado `rechazado` o `contratado` no son elegibles.

### Flujo de estados de entrevista
- `programada` → puede pasar a `realizada`, `cancelada` o `reprogramada`
- `reprogramada` → puede pasar a `realizada` o `cancelada`
- `realizada` → estado final, solo permite editar observaciones
- `cancelada` → estado final, no permite modificaciones

### Validación de modalidad
- Modalidad `virtual`: requiere campo `link` obligatorio
- Modalidad `presencial`: requiere campo `ubicacion` obligatorio

## Autenticación JWT y Permisos

### Tokens
- **Access token**: duración 15 minutos, enviado en el body del login, almacenado en `sessionStorage` en el frontend, incluido en cada request como `Authorization: Bearer <token>`
- **Refresh token**: duración 7 días, almacenado en cookie `httpOnly` con `sameSite: Strict`
- **Payload del JWT**: contiene `{ id, email, rol }` — nunca incluye la contraseña

### Roles y permisos
| Acción | entrevistador | rrhh | admin |
|--------|--------------|------|-------|
| Ver sus entrevistas | ✅ | ✅ | ✅ |
| Ver todas las entrevistas | ❌ | ✅ | ✅ |
| Crear entrevista | ❌ | ✅ | ✅ |
| Editar entrevista | ❌ | ✅ | ✅ |
| Cancelar entrevista | ❌ | ✅ | ✅ |
| Reprogramar entrevista | ❌ | ✅ | ✅ |
| Marcar como realizada | ✅ (solo asignado) | ✅ | ✅ |
| Ver resumen/dashboard | ❌ | ✅ | ✅ |
| Ver postulantes | ❌ | ✅ | ✅ |

### Códigos de error HTTP
- `401` — No se envió token (no autenticado)
- `403` — Token válido pero rol sin permiso para la acción
- `400` — Error de validación o regla de negocio
- `404` — Recurso no encontrado
- `500` — Error interno del servidor
