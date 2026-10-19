# LEVELGROW AI - Marketing Automation Platform

Platform comercial de asistente de marketing basada en la metodología HTA de HAZTUAGENCIA.

## Stack Tecnológico

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Authentication**: JWT
- **AI**: Claude API (Anthropic)
- **Payments**: PayPal REST API

## Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd levelgrow-ai
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env.local`:

```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=BAARP-LsUUZTVhF2y-pr
PAYPAL_SECRET=EMa5olriIfeQ0dVlEPlAjW4hyMAKeUCr2uO45Lw4gGowXw1XP4zySkS8sNNZ-QpkB1JwWlY6yHH2gpL5

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Claude API
NEXT_PUBLIC_CLAUDE_API_KEY=sk-ant-your-key-here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/levelgrow

# JWT Secret
JWT_SECRET=your-secret-key-change-in-production

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Configurar Base de Datos

#### Opción A: PostgreSQL local

```bash
# Instalar PostgreSQL y crear base de datos
psql -U postgres -c "CREATE DATABASE levelgrow;"
```

#### Opción B: Supabase

1. Ir a [https://supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Copiar conexión string en `DATABASE_URL`

### 5. Ejecutar Prisma Migrations

```bash
# Generar cliente Prisma
npx prisma generate

# Crear tablas en la base de datos
npx prisma migrate dev --name init

# Ver base de datos en UI
npx prisma studio
```

### 6. Obtener Claude API Key

1. Ir a [https://console.anthropic.com](https://console.anthropic.com)
2. Crear cuenta / Iniciar sesión
3. Ir a API Keys
4. Crear nueva key
5. Copiar en `NEXT_PUBLIC_CLAUDE_API_KEY`

### 7. Configurar PayPal (Ya tenemos credenciales)

Las credenciales PayPal ya están en `.env.local`. Solo verificar que sean correctas:

- **Client ID**: `BAARP-LsUUZTVhF2y-pr`
- **Secret**: Configurada

## Desarrollo

### Ejecutar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### Estructura de carpetas

```
levelgrow-ai/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Estilos globales
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   │   ├── page.tsx             # Dashboard principal
│   │   ├── onboarding/          # GENOMA builder
│   │   ├── chat/                # Asistente IA
│   │   └── acciones/            # Plan de acciones
│   └── api/
│       ├── auth/                # Autenticación
│       ├── chat/                # Chat con IA
│       ├── genoma/              # GENOMA save/retrieve
│       ├── paypal/              # Pagos
│       └── user/                # Datos de usuario
├── lib/
│   └── auth.ts                  # Funciones auth
├── prisma/
│   └── schema.prisma            # Esquema base de datos
├── components/                  # Componentes React reutilizables
├── public/                      # Archivos estáticos
└── package.json
```

## Funcionalidades

### 1. Autenticación
- Registro con email/password
- Login
- JWT tokens
- Sesiones seguras

### 2. GENOMA Marketing
- Onboarding interactivo
- Preguntas personalizadas
- Almacenamiento de datos
- Generación de perfil

### 3. Asistente IA
- Chat en tiempo real con Claude
- Contexto personalizado por GENOMA
- Historial de conversaciones
- Respuestas basadas en HTA

### 4. Plan de Acciones
- Acciones personalizadas
- Tracking de progreso
- Prioridades
- Duración estimada

### 5. Pagos
- PayPal integration
- Suscripciones mensuales
- Planes: Básico ($49) y Full ($99)
- Gestión de suscripciones

## Deployment

### Vercel (Recomendado)

```bash
# 1. Push a GitHub
git push origin main

# 2. Ir a https://vercel.com
# 3. Conectar repo de GitHub
# 4. Añadir variables de entorno
# 5. Deploy

# En Vercel dashboard añadir variables:
PAYPAL_SECRET=...
SUPABASE_SERVICE_KEY=...
DATABASE_URL=...
JWT_SECRET=...
NEXT_PUBLIC_CLAUDE_API_KEY=...
```

### Dominio Custom

Para usar `app.levelgrowai.com`:

1. Ir a Vercel dashboard
2. Proyecto → Settings → Domains
3. Añadir dominio personalizado
4. Seguir instrucciones de DNS

## API Endpoints

### Authentication
- `POST /api/auth/register` - Registrarse
- `POST /api/auth/login` - Iniciar sesión

### Chat
- `POST /api/chat` - Enviar mensaje
- `GET /api/chat?sessionId=xyz` - Obtener conversación

### GENOMA
- `POST /api/genoma` - Guardar GENOMA
- `GET /api/genoma` - Obtener GENOMA

### PayPal
- `POST /api/paypal/create-subscription` - Crear suscripción
- `POST /api/paypal/webhook` - Webhook de pagos

### User
- `GET /api/user` - Obtener datos de usuario

## Roadmap

- [ ] Integración Supabase completa
- [ ] Dashboard avanzado
- [ ] Exportar reportes PDF
- [ ] Integración Meta Ads
- [ ] Integración email marketing
- [ ] Analytics avanzados
- [ ] Webhook PayPal
- [ ] Soporte multiidioma
- [ ] App mobile

## Soporte

Para preguntas o issues, contactar a Luis Arturo Guadarrama.

## Licencia

Propietario - LEVELGROW AI
