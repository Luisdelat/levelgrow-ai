# 🚀 LEVELGROW AI - Deployment Guide

## Deployment Status: READY FOR VERCEL ✅

Tu aplicación está lista para deployar en Vercel. Solo necesitas completar 3 pasos:

---

## PASO 1: Crear Supabase (5 minutos)

1. Ir a https://supabase.com
2. Click en "New Project"
3. Rellenar:
   - **Project Name:** levelgrow-ai
   - **Database Password:** (guarda en lugar seguro)
   - **Region:** us-east-1 (or your region)
4. Click "Create new project"
5. Una vez creado, ir a **Settings → Database → Connection string**
6. Copiar la cadena `postgresql://...`

---

## PASO 2: Crear en Vercel (5 minutos)

1. Ir a https://vercel.com/new
2. Conectar tu cuenta de GitHub (si no está conectada)
3. Importar este repositorio (o hacer fork)
4. Click "Import"
5. En "Environment Variables", agregar:

```
DATABASE_URL = [La cadena de Supabase del PASO 1]
NEXT_PUBLIC_PAYPAL_CLIENT_ID = BAARP-LsUUZTVhF2y-pr
PAYPAL_SECRET = EMa5olriIfeQ0dVlEPlAjW4hyMAKeUCr2uO45Lw4gGowXw1XP4zySkS8sNNZ-QpkB1JwWlY6yHH2gpL5
NEXT_PUBLIC_CLAUDE_API_KEY = [Tu Claude API Key]
```

6. Click "Deploy" ✅
7. Esperar 2-3 minutos a que compile

---

## PASO 3: Conectar Dominio (2 minutos)

1. Una vez deployed en Vercel, ir a **Settings → Domains**
2. Click "Add Domain"
3. Ingresar: `app.levelgrowai.com`
4. Seguir instrucciones para conectar tu registrador de dominios
   - Si el dominio está en GoDaddy, Namecheap, etc.
   - Copiar los DNS records de Vercel
   - Pegarlos en tu registrador

---

## ¿Qué sucede después del Deploy?

✅ **Automático:**
- Base de datos PostgreSQL creada en Supabase
- Migraciones automáticas ejecutadas
- API endpoints activos
- Chat con Claude AI funcionando
- Pagos PayPal integrados

✅ **Lo que funciona:**
1. Registrarse con email/contraseña
2. Seleccionar plan ($49 o $99)
3. Completar GENOMA (8 preguntas)
4. Chat IA personalizado basado en el Método LEVELGROW
5. Pagos con PayPal

---

## Variables de Entorno Necesarias

| Variable | Valor | Dónde obtener |
|----------|-------|---------------|
| `DATABASE_URL` | PostgreSQL connection string | Supabase Settings → Database |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | BAARP-LsUUZTVhF2y-pr | ✅ Ya incluido |
| `PAYPAL_SECRET` | EMa5olriIfe... | ✅ Ya incluido |
| `NEXT_PUBLIC_CLAUDE_API_KEY` | sk-ant-... | https://console.anthropic.com |

---

## ¿Problemas?

- **Error 500**: Espera a que las migraciones de BD terminen (2-3 min)
- **Database connection error**: Verifica que DATABASE_URL esté bien copiada
- **PayPal no funciona**: Verifica credenciales en Vercel Environment Variables
- **Claude no responde**: Agrega tu Claude API Key

---

## Información Técnica

- **Framework:** Next.js 16 (React 19, TypeScript)
- **Base de datos:** PostgreSQL (Supabase)
- **Auth:** JWT + Bcrypt
- **Pagos:** PayPal REST API
- **IA:** Anthropic Claude API
- **Hosting:** Vercel
- **Dominio:** app.levelgrowai.com

---

**¡Listo!** Una vez completados estos 3 pasos, tu plataforma estará viva 🎉
