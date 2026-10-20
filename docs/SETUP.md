# Portfolio — Marianela De Martino

Sitio multipágina con estética de archivador: las pestañas de carpeta son el menú.
Hecho con Vite, React, React Router y CSS puro (Flexbox).

## Ejecutar

Requiere [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install
```

```bash
npm run dev
```

`npm run build` genera la versión de producción en `dist/`.

## Estructura

```
src/
├── components/   Layout, FolderTabs (menú), MiniTabs, ProjectCard, LanguageToggle, Asterisk
├── context/      LanguageContext (ES / EN)
├── data/         profile.js (datos del CV) y sampleProjects.js
├── firebase/     config.js y projects.js (Firestore)
├── hooks/        useProjects.js
├── i18n/         translations.js (textos de interfaz)
├── pages/        Home, About, Portfolio, CV, Contact, Admin, NotFound
├── styles/       global.css (paleta, tipografía, botones, formularios)
├── utils/        cvPdf.js (genera el PDF del CV)
├── routes.js     pestañas del menú y categorías de proyectos
└── App.jsx       rutas
```

## Editar tus datos

Todo el contenido profesional está en `src/data/profile.js`. Las páginas Sobre mí, CV,
Contacto y el PDF descargable se arman a partir de ese archivo, en ambos idiomas.
Pendientes marcados con `TODO`: correo, redes, fechas de cada experiencia y lista de habilidades.

## Firebase (portfolio dinámico y panel admin)

Sin credenciales el sitio funciona igual y muestra los proyectos de `sampleProjects.js`.

1. Creá un proyecto en la [consola de Firebase](https://console.firebase.google.com) y agregá una app web.
2. Copiá `.env.example` como `.env` y pegá las credenciales.
3. Activá **Firestore Database**.
4. Activá **Authentication → Correo electrónico/contraseña** y creá tu usuario en la pestaña *Users*.
5. En Firestore → *Reglas*, publicá esto con tu correo:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{id} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.email == 'TU-CORREO@ejemplo.com';
    }
  }
}
```

La privacidad del panel depende de estas reglas: `/admin` pide inicio de sesión, pero lo que
impide que otra persona escriba en la base es la regla `allow write`.

### Subida de archivos (Cloudinary, plan gratuito)

El panel Admin sube imágenes, videos y PDFs a [Cloudinary](https://cloudinary.com) (gratis, sin
tarjeta), y guarda las URLs en Firestore junto con el resto del proyecto. También acepta el link
externo (Behance, etc.) y un video de YouTube/Vimeo. Límites del plan gratuito: imagen 10 MB,
PDF 10 MB, video 100 MB por archivo. Firebase Storage no se usa, así que no hace falta el plan Blaze.

1. Creá una cuenta gratis en Cloudinary. Copiá el **Cloud name** del dashboard a
   `VITE_CLOUDINARY_CLOUD_NAME` en `.env`.
2. **Settings → Upload → Upload presets → Add upload preset**:
   - *Signing mode*: **Unsigned**
   - *Asset folder*: `portfolio`
   - *Allowed formats*: `jpg,png,webp,gif,mp4,mov,webm,pdf`
   
   Copiá el nombre del preset a `VITE_CLOUDINARY_UPLOAD_PRESET`.
3. Si un PDF da error 401 al abrirse, activá la entrega de PDF en
   **Settings → Security → Restricted media types**.
4. Reiniciá `npm run dev`.

Notas:
- El nombre de la nube y el preset quedan visibles en el código del sitio. Cualquiera podría
  subir archivos a tu cuenta con ellos, pero no aparecerían en el portfolio (los proyectos se
  publican solo con tu login + reglas de Firestore). Si hace falta, desactivá el preset.
- Al eliminar un proyecto se borra de Firestore, pero los archivos quedan en Cloudinary. Borralos
  a mano desde **Media Library**.
- Las imágenes se reducen en el navegador antes de subirse (máx. 2000 px, WebP) y se sirven
  optimizadas por Cloudinary.

Cada proyecto se guarda en la colección `projects` con `title`, `description`, `link`,
`category`, `media` y `createdAt`. `media` es una lista de `{ kind, name, url }` donde `kind`
es `image`, `video`, `pdf` o `embed` (YouTube/Vimeo). La primera imagen es la portada. Los
proyectos viejos, sin `media`, siguen funcionando.

## Formulario de contacto

Por defecto abre el cliente de correo del visitante con el mensaje armado (usa `profile.email`).
Para enviar el correo directamente desde la web, creá un formulario en
[Formspree](https://formspree.io) y pegá su URL en `VITE_FORMSPREE_ENDPOINT`.

## Publicar

Al ser una SPA con rutas reales, el hosting debe redirigir todas las rutas a `index.html`
(en Firebase Hosting: `"rewrites": [{ "source": "**", "destination": "/index.html" }]`).

## Publicar el sitio

El build sale en `dist/` (`npm run build`). El sitio usa rutas con `BrowserRouter`, por eso el
repo incluye `public/_redirects` (Netlify) y `vercel.json` (Vercel).

1. Subí el proyecto a GitHub (el `.env` no se sube: está en `.gitignore`).
2. Importá el repo en Netlify o Vercel. Build: `npm run build`. Carpeta de salida: `dist`.
3. Cargá en el panel del hosting **todas** las variables del `.env` (`VITE_FIREBASE_*` y
   `VITE_CLOUDINARY_*`) y hacé un nuevo deploy: Vite las incrusta al compilar.
4. En Firebase → Authentication → Settings → **Authorized domains**, agregá el dominio público.
