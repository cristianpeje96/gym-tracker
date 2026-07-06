# 🏋️ IronLog — Gym Tracker

Aplicación web (PWA-ready) para llevar el registro de entrenamientos, plan
semanal, nutrición y progreso, pensada para usarse junto con un
**entrenador calificado**: cada usuario arma su propia rutina (la que le
asigne su instructor) en vez de partir de ejercicios genéricos.

---

## ✨ Funcionalidades

- **Resumen (Dashboard):** racha de días consecutivos entrenando, progreso
  semanal, próxima sesión, tus mejores marcas (PRs) y último entrenamiento.
- **Entrenar:** registra series (reps, kg, RPE) del día, con detección
  automática de nuevos récords personales al guardar. Permite agregar
  ejercicios sueltos que no estaban en el plan (por ejemplo, algo que te
  indicó tu instructor en el momento).
- **Historial:** gráficos de evolución por ejercicio, comparativa semanal
  de volumen/RPE, y listado de sesiones pasadas.
- **Plan semanal:** cada día es editable — agrega o quita ejercicios desde
  un selector con biblioteca predefinida por grupo muscular + tus propios
  ejercicios personalizados guardados.
- **Nutrición:** recomendaciones de calorías/macros según objetivo
  (déficit, mantenimiento, superávit), registro de peso corporal y de
  comidas (persistido en la nube, no se pierde al recargar).
- **Perfil:** datos personales, IMC, medidas corporales, tabla de
  referencia RPE/RIR, y gestión de cuenta.
- **Cuenta:** funciona sin registro (modo invitado, sesión anónima de
  Firebase) con opción de vincular Google en cualquier momento **sin
  perder el progreso** ya guardado.

---

## 🛠️ Tecnologías utilizadas

### Core

- **React 18** — librería de UI
- **Create React App** — toolchain de build/dev server

### Backend / datos

- **Firebase Authentication** — sesión anónima (invitado) + Google Sign-In
  (vinculación de cuenta sin perder datos, vía `linkWithPopup`)
- **Cloud Firestore** — base de datos (historial de sesiones, plan
  personalizado, ejercicios personalizados, perfil, nutrición)

### UI / diseño

- **CSS puro con variables (custom properties)** — sistema de diseño
  propio ("Tech & Premium": tema oscuro, acento morado eléctrico)
- **[Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)**
  — tipografía de titulares (peso 700)
- **[Inter](https://fonts.google.com/specimen/Inter)** — tipografía de
  cuerpo/UI
- **[lucide-react](https://lucide.dev/)** — íconos monolineales (trazo
  1.5–2px), reaccionan al estado (gris apagado / morado activo)

### Gráficos

- **[Recharts](https://recharts.org/)** — gráficos de progreso y
  comparativas (líneas, barras, áreas)

### Otras dependencias instaladas

`@mui/material`, `@emotion/react`/`styled`, `chart.js` + `react-chartjs-2`,
`axios`, `date-fns`, `react-icons` están en `package.json` pero no se usan
actualmente en las pantallas principales (quedaron de una iteración
anterior del proyecto); se pueden remover con `npm uninstall` si se
quiere aligerar el bundle.

---

## 📁 Estructura del proyecto

src/
├── components/
│ ├── common/
│ │ ├── Button/ # Botón reutilizable
│ │ ├── NavTabs/ # Barra de navegación inferior
│ │ └── SelectorEjercicios/ # Selector de ejercicios (hoja inferior)
│ ├── dashboard/ # Pantalla "Resumen"
│ ├── entrenamiento/ # Pantalla "Entrenar" + SerieInput/RpeSelector
│ ├── historial/ # Pantalla "Historial" (progreso, comparativa)
│ ├── plan/ # Pantalla "Plan semanal" (editable)
│ ├── nutricion/ # Pantalla "Nutrición"
│ └── perfil/ # Pantalla "Perfil" + TablaRpe
├── contexts/
│ ├── AuthContext.jsx # Sesión (invitado/Google), estado de auth
│ └── EntrenamientoContext.jsx # Historial de sesiones del usuario
├── services/ # Acceso a Firestore (una función = una operación)
│ ├── entrenamientoService.js # Guardar/leer sesiones e info de perfil
│ ├── planService.js # Plan personalizado por usuario
│ ├── ejerciciosService.js # Ejercicios personalizados del usuario
│ ├── nutricionService.js # Pesos y comidas registradas
│ └── recomendacionesService.js
├── constants/
│ ├── planEntrenamiento.js # Plan por defecto (vacío a propósito)
│ └── ejerciciosLibrary.js # Biblioteca predefinida por grupo muscular
├── utils/
│ ├── helpers.js # Día actual, formateo de fechas
│ ├── calculosNutricionales.js # Fórmulas de calorías/macros
│ └── gamificacion.js # Racha, PRs, progreso semanal
├── firebase/
│ ├── firebase.js # Inicialización + chequeo de config
│ └── config.js # Lee credenciales desde variables de entorno
└── styles/
└── variables.css # Tokens de diseño (color, tipografía, espaciado)

---

## 🚀 Cómo correr el proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

Este proyecto **no trae credenciales en el código** (por seguridad, están
en un archivo ignorado por git).

```bash
cp .env.example .env.local
```

Completa `.env.local` con los datos de tu proyecto en
**Firebase Console → Configuración del proyecto → Tus apps → Config del SDK**.

En **Firebase Console → Authentication → Sign-in method**, habilita:

- **Anónimo** (necesario para el modo invitado)
- **Google** (necesario para vincular cuenta desde Perfil)

Si `.env.local` falta o está incompleto, la app lo detecta y muestra en
pantalla los pasos exactos para corregirlo (no falla en silencio).

### 3. Levantar el servidor de desarrollo

```bash
npm start
```

Abre [http://localhost:3000](http://localhost:3000).

### 4. Build de producción

```bash
npm run build
```

---

## 🎨 Sistema de diseño

Todos los colores, tipografías y espaciados viven como variables CSS en
`src/styles/variables.css` — cambiar un valor ahí se propaga a toda la
app.

| Token                      | Valor     | Uso                                                  |
| -------------------------- | --------- | ---------------------------------------------------- |
| `--color-fondo`            | `#0b0a0f` | Fondo general de la app                              |
| `--color-tarjeta`          | `#16141f` | Tarjetas, inputs, menús                              |
| `--color-acento`           | `#7c3aed` | Botones de acción, íconos activos, bordes destacados |
| `--color-lavanda`          | `#a78bfa` | Texto secundario importante, estados activos tenues  |
| `--color-texto`            | `#ffffff` | Texto principal                                      |
| `--color-texto-secundario` | `#9ca3af` | Descripciones, fechas                                |

Existen alias retrocompatibles (`--color-ink`, `--color-iron`, etc.) para
que el código de componentes no tenga que renombrarse cada vez que
cambia la identidad visual.

---

## 🔐 Notas de seguridad

- Las credenciales de Firebase viven en `.env.local`, que está en
  `.gitignore` y nunca se sube al repositorio. `.env.example` es la
  plantilla pública (sin valores).
- La API key de Firebase para apps web es pública por diseño (viaja al
  navegador); la protección real son las **restricciones configuradas en
  Google Cloud Console** (APIs permitidas + dominios autorizados) y las
  **reglas de seguridad de Firestore**.
- El login con Google usa `linkWithPopup` para conservar el mismo UID (y
  por lo tanto el historial) al pasar de invitado a cuenta registrada.

---

## 📌 Estado conocido / pendientes

- `src/components/progreso/Progreso.jsx` y `src/components/api/RecomendacionesIA.jsx`
  existen en el repo pero **no están conectados** a la navegación
  principal (código en pausa para una futura iteración).
- El plan de entrenamiento por defecto está **vacío a propósito**: cada
  usuario debe cargar la rutina que le indique su instructor desde la
  pestaña "Plan", no viene con ejercicios de ejemplo precargados.
- Esta app es una herramienta de **seguimiento**, no un sustituto de la
  asesoría de un entrenador o profesional de la salud calificado — se
  muestra un aviso al respecto en el Dashboard.

### Desarrolladro: Cristian Peje
