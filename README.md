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
