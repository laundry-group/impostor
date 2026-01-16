# Impostor ¿Quién? - Juego de palabras PWA

Una Progressive Web App (PWA) instalable para jugar al Impostor en cualquier dispositivo. Inspirado en Spyfall, con diseño elegante tipo menú de restaurante.

## ✨ Características principales

- 🎮 **Juego completo de Impostor/Spyfall**: 3-12 jugadores, múltiples categorías
- 📱 **PWA instalable**: Funciona como app nativa en móviles y escritorio
- 🔄 **Offline-first**: Funciona sin conexión una vez instalado
- 💾 **Persistencia de datos**: Guarda configuración y progreso automáticamente
- 🎨 **Diseño responsive**: Optimizado para dispositivos móviles
- 🎯 **15 categorías**: Lugares, Navidad, Animales, Comida, Objetos, Películas, Deportes, Oficina, Familia, Viajes, Amigos, Profesiones, Tecnología, Música, Hobbies
- 🎭 **Configuración flexible**: 1-5 impostores, múltiples categorías simultáneas
- 🗳️ **Sistema de votación**: Debate y votación con contador de votos
- ⚡ **Optimizado**: Imágenes comprimidas, carga rápida
- 🔄 **Actualización automática**: Notifica cuando hay nueva versión disponible

## 🎮 Cómo jugar

1. **Configuración**: 
   - Elige el número de jugadores (3-12)
   - Selecciona cuántos impostores habrá (1-5)
   - Elige una o más categorías
   - Opcionalmente, muestra la categoría al impostor
   - Ingresa los nombres de los jugadores

2. **Revelación de roles**:
   - Cada jugador toca su nombre para ver su palabra secreta
   - Los ciudadanos reciben una palabra de la categoría
   - Los impostores no conocen la palabra (o solo la categoría)
   - Una vez todos vieron su rol, comienza el debate

3. **Votación**:
   - Discutan sobre quién creen que es el impostor
   - Cada jugador vota por un sospechoso
   - Se pueden deshacer votos antes de finalizar

4. **Resultados**:
   - Se revelan los impostores reales
   - Ganan los ciudadanos si votan correctamente al impostor
   - Gana el impostor si no es descubierto

## 📲 Cómo instalar la app

### En Android (Chrome/Edge)

1. Abre la aplicación en Chrome o Edge
2. Toca el menú (⋮) → "Añadir a pantalla de inicio" o "Instalar app"
3. Confirma la instalación
4. ¡La app aparecerá en tu pantalla de inicio con su propio icono!

### En iOS (Safari)

1. Abre la aplicación en Safari
2. Toca el botón de compartir (□↑)
3. Selecciona "Añadir a pantalla de inicio"
4. Confirma y nombra la app
5. ¡La app aparecerá en tu pantalla de inicio!

### En Windows (Edge/Chrome)

1. Abre la aplicación en Edge o Chrome
2. Haz clic en el icono de instalación (⊕) en la barra de direcciones
   - O ve al menú → "Aplicaciones" → "Instalar este sitio como aplicación"
3. Confirma la instalación
4. ¡La app se abrirá en su propia ventana sin barras del navegador!

### En macOS/Linux (Chrome/Edge/Brave)

1. Abre la aplicación en el navegador
2. Busca el icono de instalación en la barra de direcciones
3. Haz clic en "Instalar"
4. La app se instalará como una aplicación nativa

## 🚀 Desarrollo y despliegue

### Para desarrollo local:

```bash
# Con Python (recomendado)
python -m http.server 8000

# Con Node.js
npx http-server

# Con PHP
php -S localhost:8000

# Con VS Code
# Usa la extensión "Live Server"
```

Luego abre: `http://localhost:8000`

### Para producción:

La app puede ser desplegada en cualquier hosting estático:

- **Netlify**: Arrastra y suelta la carpeta o conecta con Git
- **Vercel**: Conecta con GitHub y despliega automáticamente
- **GitHub Pages**: Settings → Pages → Deploy from branch
- **Firebase Hosting**: `firebase init` → `firebase deploy`
- **Cloudflare Pages**: Conecta repositorio y despliega

⚠️ **Importante para PWA**: 
- HTTPS es requerido en producción (localhost funciona sin HTTPS)
- Todos los recursos deben estar disponibles offline
- El Service Worker se actualiza automáticamente

## 📁 Estructura del proyecto

```
Impostor/
├── index.html              # Página principal HTML
├── app.js                 # Lógica completa del juego (716 líneas)
├── style.css              # Estilos responsive (592 líneas)
├── manifest.json          # Configuración PWA
├── sw.js                  # Service Worker v2 (cache-first strategy)
├── generate_icons.py      # Script para generar iconos PWA
├── optimize_images.py     # Script de optimización de imágenes
└── assets/
    ├── icons/             # Iconos PWA en 8 tamaños
    │   ├── icon-72x72.png
    │   ├── icon-96x96.png
    │   ├── icon-128x128.png
    │   ├── icon-144x144.png
    │   ├── icon-152x152.png
    │   ├── icon-192x192.png
    │   ├── icon-384x384.png
    │   └── icon-512x512.png
    ├── logo_laundry_impostor.png    # Logo principal (175.87 KB)
    └── logo_impostor_header.png     # Logo header (46.44 KB)
```

## 🎨 Características de diseño

- **Paleta de colores**:
  - Fondo principal: `#fef6ea` (beige cálido)
  - Color primario: `#b7202f` (rojo corporativo)
  - Header: `#000000` (negro)
  - Secundario: `#f5e8d3` (beige claro)
  - Textos: `#2c2416`, `#6b5844`

- **Tipografía**: System fonts optimizadas para cada plataforma
- **Layout**: Full viewport, flexbox, diseño vertical
- **Scroll personalizado**: Barras de scroll en color rojo corporativo
- **Animaciones**: Transiciones suaves en botones y cards
- **Responsive**: Adapta cantidad de columnas según jugadores

## 🔧 Scripts de utilidades

### Regenerar iconos PWA

```bash
python generate_icons.py
```

Genera todos los tamaños de iconos necesarios (72px a 512px) desde el logo principal.

### Optimizar imágenes

```bash
python optimize_images.py
```

Comprime imágenes PNG manteniendo calidad visual. En la última optimización se redujo 68.54 KB (23.6%).

## 🎯 Características técnicas avanzadas

### Gestión de estado
- Estado global con persistencia automática en `localStorage`
- Guardado automático al cambiar configuración o progreso
- Recuperación de partida al recargar la página

### Scroll inteligente
- Preservación de posición al actualizar listas
- Implementado en selección de categorías y votación
- Evita saltos molestos durante la interacción

### UI adaptativa
- Cards de jugadores se adaptan según cantidad (2-3 columnas)
- Tamaños `normal`, `compact`, y `mini` para 3-12 jugadores
- Fuentes adaptativas según cantidad de categorías seleccionadas

### Service Worker
- Estrategia Cache First para máxima velocidad
- Actualización automática en segundo plano
- Notificación al usuario cuando hay nueva versión
- Cacheo de todos los recursos estáticos

## 🌐 Compatibilidad PWA

| Plataforma | Navegadores | Instalación | Offline |
|------------|-------------|-------------|---------|
| **Android** | Chrome, Edge, Samsung Internet | ✅ Nativa | ✅ |
| **iOS** | Safari 11.3+ | ✅ A2HS | ✅ |
| **Windows** | Chrome, Edge | ✅ Nativa | ✅ |
| **macOS** | Chrome, Edge, Safari | ✅ Nativa | ✅ |
| **Linux** | Chrome, Firefox, Edge | ✅ Nativa | ✅ |

## 📝 Configuración técnica

### Manifest.json
```json
{
  "name": "Impostor ¿Quién?",
  "short_name": "Impostor",
  "theme_color": "#b7202f",
  "background_color": "#000000",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "./",
  "start_url": "./"
}
```

### Service Worker
- **Versión**: v2
- **Estrategia**: Cache First (prioridad a caché para velocidad)
- **Recursos cacheados**: HTML, CSS, JS, imágenes, iconos
- **Actualización**: Automática con notificación al usuario

## 🔒 Requisitos para instalación

- ✅ `manifest.json` válido con todos los campos requeridos
- ✅ Service Worker registrado y activo
- ✅ HTTPS en producción (localhost funciona con HTTP)
- ✅ Iconos en múltiples tamaños (192px y 512px mínimos)
- ✅ Diseño responsive con viewport meta tag
- ✅ Start URL accesible

## 🎯 Mejoras futuras posibles

- [ ] Modo multijuego online con WebRTC
- [ ] Temporizador para debates
- [ ] Estadísticas de partidas jugadas
- [ ] Categorías personalizadas por usuario
- [ ] Modo oscuro
- [ ] Sonidos y efectos de audio
- [ ] Compartir resultados en redes sociales
- [ ] Múltiples idiomas

## 📄 Licencia

Este proyecto es de uso privado para Laundry Restaurant.

---

**Versión**: 2.0  
**Última actualización**: Enero 2026  
**Desarrollado con**: Vanilla JavaScript, CSS3, PWA APIs

¡Disfruta jugando Impostor! 🎭
