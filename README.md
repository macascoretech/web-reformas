# Macas Core Build S.L. — Web Corporativa

Sitio web corporativo para **Macas Core Build S.L.**, empresa familiar especializada en reformas integrales y construcción de piscinas en Murcia.

Desarrollado con **Astro JS** + **TailwindCSS**, optimizado para SEO, accesibilidad (WCAG) y rendimiento.

---

## Índice

- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Configuración de Resend](#configuración-de-resend)
- [Desarrollar en local](#desarrollar-en-local)
- [Cómo añadir proyectos al portfolio](#cómo-añadir-proyectos-al-portfolio)
- [Cómo cambiar datos de contacto](#cómo-cambiar-datos-de-contacto)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Estructura del proyecto](#estructura-del-proyecto)

---

## Instalación

### Requisitos

- **Node.js** ≥ 18
- **npm** ≥ 9 (o pnpm / yarn)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/macas-core-build.git
cd macas-core-build

# 2. Instalar dependencias
npm install

# 3. Copiar archivo de entorno
cp .env.example .env

# 4. Editar .env con tus datos reales (ver sección Variables de entorno)

# 5. Iniciar servidor de desarrollo
npm run dev
```

El sitio estará disponible en `http://localhost:4321`.

---

## Variables de entorno

Copia `.env.example` a `.env` y rellena cada valor:

```env
# API Key de Resend (obligatorio para el formulario de contacto)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# Email del propietario — recibirá cada consulta enviada por el formulario
CONTACT_EMAIL=andrea@macascore.com

# Email remitente VERIFICADO en Resend (debe pertenecer a un dominio verificado)
FROM_EMAIL=no-reply@macascore.com

# URL pública del sitio (sin barra final)
PUBLIC_SITE_URL=https://macascore.com
```

> **Importante:** Nunca subas el archivo `.env` a un repositorio público.
> Está incluido en `.gitignore` por defecto.

---

## Configuración de Resend

1. Crea una cuenta gratuita en [resend.com](https://resend.com).
2. Añade y **verifica tu dominio** en *Domains* (necesitas acceso al DNS).
3. Crea una **API Key** en *API Keys* con permiso de envío.
4. Pega la API Key en `RESEND_API_KEY` de tu `.env`.
5. Asegúrate de que `FROM_EMAIL` usa el dominio verificado, por ejemplo: `no-reply@macascore.com`.

El endpoint `/api/contact` enviará:
- **Email al propietario** (`CONTACT_EMAIL`) con los datos de la consulta y botón para responder.
- **Email de confirmación al usuario** con tono cercano y profesional.

---

## Desarrollar en local

```bash
npm run dev      # Servidor de desarrollo con hot reload
npm run build    # Compilar el proyecto para producción
npm run preview  # Previsualizar el build de producción localmente
```

---

## Cómo añadir proyectos al portfolio

1. **Añade la imagen** del proyecto en:
   ```
   /public/images/portfolio/mi-proyecto.jpg
   ```
   > Formato recomendado: `.webp` o `.jpg` · Tamaño: **800 × 600 px** aprox.

2. **Edita el componente Portfolio** en:
   ```
   /src/components/Portfolio.astro
   ```

3. Busca el array `projects` al inicio del frontmatter y añade un nuevo objeto:
   ```typescript
   {
     id:          7,                                        // número único
     image:       '/images/portfolio/mi-proyecto.jpg',     // ruta de la imagen
     alt:         'Descripción accesible de la imagen',    // texto alternativo
     category:    'Reforma integral',                      // etiqueta de la tarjeta
     title:       'Reforma de vivienda en ...',            // título del proyecto
     description: 'Descripción breve del trabajo realizado (2-3 frases).',
     location:    'Molina de Segura',                      // localidad
   },
   ```

4. Guarda el archivo. El carrusel se actualiza automáticamente.

---

## Cómo cambiar datos de contacto

Todos los datos de contacto, redes sociales y textos globales se gestionan desde **un único archivo de configuración**:

```
/src/config/site.ts
```

Campos editables:

| Campo            | Descripción                                  |
|-----------------|----------------------------------------------|
| `phone`          | Número de teléfono (formato internacional)  |
| `phoneDisplay`   | Número formateado para mostrar al usuario   |
| `whatsapp`       | Número para el enlace de WhatsApp (sin '+') |
| `email`          | Email de contacto visible                    |
| `address`        | Dirección completa                           |
| `social.facebook` | URL del perfil de Facebook                 |
| `social.instagram`| URL del perfil de Instagram                |
| `cif`            | CIF de la empresa                            |

> Los cambios en `site.ts` se propagan automáticamente a Navbar, Footer,
> Hero, Contact y páginas legales.

---

## Despliegue en Vercel

### Opción 1 — Interfaz web (recomendado)

1. Sube el proyecto a un repositorio de GitHub.
2. Accede a [vercel.com](https://vercel.com) → **Add New Project**.
3. Importa tu repositorio.
4. En **Environment Variables**, añade las mismas variables de tu `.env`:
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL`
   - `FROM_EMAIL`
   - `PUBLIC_SITE_URL`
5. Haz clic en **Deploy**. Vercel detecta Astro automáticamente.

### Opción 2 — Vercel CLI

```bash
npm install -g vercel
vercel login
vercel deploy
```

### Nota sobre el adaptador

El proyecto usa `@astrojs/vercel/serverless` (configurado en `astro.config.mjs`) para habilitar las rutas de API dinámicas (endpoint de contacto). Esto es necesario para que el formulario funcione en producción.

---

## Estructura del proyecto

```
web-reformas/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── images/
│       ├── hero-bg.jpg          ← Imagen Hero (reemplazar con foto real)
│       ├── about-team.jpg       ← Foto del equipo (reemplazar)
│       ├── og-image.jpg         ← Imagen Open Graph para redes sociales
│       └── portfolio/
│           ├── proyecto-1.jpg   ← Fotos de proyectos (reemplazar)
│           └── ...
├── src/
│   ├── components/
│   │   ├── Navbar.astro         ← Barra de navegación fija
│   │   ├── Hero.astro           ← Sección hero con CTA
│   │   ├── About.astro          ← Sobre nosotros + valores
│   │   ├── Services.astro       ← Grid de servicios
│   │   ├── Process.astro        ← Proceso de trabajo en pasos
│   │   ├── Portfolio.astro      ← Carrusel de proyectos ← EDITAR AQUÍ
│   │   ├── Contact.astro        ← Formulario + datos de contacto
│   │   ├── Footer.astro         ← Pie de página con links y redes
│   │   └── CookieBanner.astro   ← Banner de cookies RGPD
│   ├── config/
│   │   └── site.ts              ← ⚙️ CONFIGURACIÓN CENTRAL ← EDITAR AQUÍ
│   ├── layouts/
│   │   └── Layout.astro         ← Layout base con SEO y meta tags
│   ├── pages/
│   │   ├── index.astro          ← Home / Landing page
│   │   ├── aviso-legal.astro
│   │   ├── politica-privacidad.astro
│   │   ├── politica-cookies.astro
│   │   └── api/
│   │       └── contact.ts       ← Endpoint POST /api/contact (Resend)
│   └── styles/
│       └── global.css           ← Estilos globales y animaciones
├── .env.example                 ← Plantilla de variables de entorno
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## Imágenes a reemplazar

| Archivo                          | Dimensiones sugeridas | Descripción                    |
|----------------------------------|----------------------|--------------------------------|
| `public/images/hero-bg.jpg`      | 1920 × 1080 px       | Foto de portada (obra, piscina)|
| `public/images/about-team.jpg`   | 640 × 480 px         | Foto del equipo trabajando     |
| `public/images/og-image.jpg`     | 1200 × 630 px        | Imagen para redes sociales     |
| `public/images/portfolio/proyecto-*.jpg` | 800 × 600 px | Fotos de proyectos realizados  |

> Usa `.webp` para mejor rendimiento. Puedes convertir imágenes con herramientas como [Squoosh](https://squoosh.app).

---

## Tecnologías utilizadas

| Tecnología    | Versión  | Uso                         |
|--------------|----------|-----------------------------|
| Astro JS     | ^4.16    | Framework principal         |
| TailwindCSS  | ^3.4     | Estilos y diseño responsive |
| Resend       | ^4.0     | Envío de emails             |
| TypeScript   | ^5.6     | Tipado estático             |
| @astrojs/sitemap | ^3.1 | Generación automática de sitemap |
| @astrojs/vercel | ^7.8  | Adaptador para Vercel       |

---

## Licencia

© 2026 Macas Core Build S.L. — Todos los derechos reservados.  
Este código es de uso privado y propiedad de Macas Core Build S.L.
