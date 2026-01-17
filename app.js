// ==================== ESTADO GLOBAL ====================
const state = {
    jugadores: 3,
    impostores: 1,
    modo: 'palabras',
    categoria: 'Lugares',
    mostrarCategoriaImpostor: true,
    categorias: ['Lugares', 'Navidad', 'Animales', 'Comida', 'Objetos', 'Películas', 'Deportes', 'Oficina', 'Familia', 'Viajes', 'Amigos', 'Profesiones', 'Tecnología', 'Música', 'Hobbies'],
    categoriasEmojis: {
        'Lugares': '🏛️',
        'Navidad': '🎄',
        'Animales': '🦁',
        'Comida': '🍕',
        'Objetos': '📦',
        'Películas': '🎬',
        'Deportes': '⚽',
        'Oficina': '💼',
        'Familia': '👨‍👩‍👧‍👦',
        'Viajes': '✈️',
        'Amigos': '🤝',
        'Profesiones': '👩‍⚕️',
        'Tecnología': '📱',
        'Música': '🎵',
        'Hobbies': '🎨'
    },
    categoriasSeleccionadas: ['Lugares'],
    nombres: [],
    roles: [],
    palabraSecreta: '',
    jugadorActual: 0,
    jugadoresVistos: [],
    votos: [],
    juegoTerminado: false,
    nombresEditados: false
};

// ==================== PERSISTENCIA DE DATOS ====================
function guardarEstado() {
    try {
        localStorage.setItem('impostorState', JSON.stringify(state));
    } catch (e) {
        console.error('Error al guardar estado:', e);
    }
}

function cargarEstado() {
    try {
        const saved = localStorage.getItem('impostorState');
        if (saved) {
            const savedState = JSON.parse(saved);
            // Solo restaurar configuración básica, no juego en progreso
            state.jugadores = savedState.jugadores || state.jugadores;
            state.impostores = savedState.impostores || state.impostores;
            state.categoriasSeleccionadas = savedState.categoriasSeleccionadas || state.categoriasSeleccionadas;
            state.nombres = savedState.nombres || [];
            state.nombresEditados = savedState.nombresEditados || false;
        }
    } catch (e) {
        console.error('Error al cargar estado:', e);
    }
}

function limpiarEstadoJuego() {
    state.roles = [];
    state.palabraSecreta = '';
    state.jugadorActual = 0;
    state.jugadoresVistos = [];
    state.votos = [];
    state.juegoTerminado = false;
    guardarEstado();
}

// Base de datos de palabras por categoría
const palabrasPorCategoria = {
    'Lugares': ['Plaza', 'Playa', 'Museo', 'Restaurante', 'Hospital', 'Escuela', 'Parque', 'Biblioteca', 'Cine', 'Aeropuerto', 'Estación', 'Banco', 'Teatro', 'Gimnasio', 'Mercado', 'Hotel', 'Casino', 'Iglesia', 'Estadio', 'Universidad'],
    'Navidad': ['Árbol', 'Regalo', 'Nieve', 'Reno', 'Trineo', 'Chimenea', 'Campana', 'Estrella', 'Vela', 'Galleta', 'Calcetín', 'Villancico', 'Muérdago', 'Belén', 'Corona', 'Jengibre', 'Bastón', 'Posada', 'Nochebuena'],
    'Animales': ['Perro', 'Gato', 'León', 'Elefante', 'Tigre', 'Jirafa', 'Mono', 'Oso', 'Lobo', 'Zorro', 'Caballo', 'Vaca', 'Cerdo', 'Oveja', 'Conejo', 'Ratón', 'Pájaro', 'Pez', 'Tiburón', 'Ballena'],
    'Comida': ['Pizza', 'Hamburguesa', 'Pasta', 'Sushi', 'Tacos', 'Ensalada', 'Sopa', 'Pan', 'Queso', 'Pollo', 'Carne', 'Pescado', 'Arroz', 'Papas', 'Helado', 'Chocolate', 'Café', 'Té', 'Jugo', 'Agua'],
    'Objetos': ['Mesa', 'Silla', 'Lápiz', 'Libro', 'Teléfono', 'Computadora', 'Reloj', 'Llave', 'Puerta', 'Ventana', 'Cama', 'Sofá', 'Lámpara', 'Espejo', 'Cuchillo', 'Plato', 'Vaso', 'Botella', 'Caja', 'Bolsa'],
    'Películas': ['Titanic', 'Avatar', 'Matrix', 'Gladiador', 'Rocky', 'Alien', 'Terminator', 'Superman', 'Batman', 'Spiderman', 'Jumanji', 'Coco', 'Frozen', 'Shrek', 'Toy Story', 'Nemo', 'Up'],
    'Deportes': ['Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Ciclismo', 'Boxeo', 'Golf', 'Béisbol', 'Volleyball', 'Rugby', 'Hockey', 'Esquí', 'Surf', 'Atletismo', 'Gimnasia', 'Yoga', 'Ping Pong', 'Karate', 'Escalada'],
    'Oficina': ['Escritorio', 'Computadora', 'Impresora', 'Reunión', 'Café', 'Jefe', 'Empleado', 'Contrato', 'Proyecto', 'Presentación', 'Email', 'Teléfono', 'Carpeta', 'Agenda', 'Calculadora', 'Grapadora', 'Post-it', 'Pizarra', 'Factura', 'Presupuesto'],
    'Familia': ['Madre', 'Padre', 'Hermano', 'Hermana', 'Hijo', 'Hija', 'Abuelo', 'Abuela', 'Tío', 'Tía', 'Primo', 'Prima', 'Sobrino', 'Sobrina', 'Nieto', 'Nieta', 'Suegro', 'Suegra', 'Cuñado', 'Cuñada'],
    'Viajes': ['Maleta', 'Pasaporte', 'Avión', 'Hotel', 'Mapa', 'Turista', 'Foto', 'Recuerdo', 'Guía', 'Ticket', 'Camping', 'Crucero', 'Safari', 'Mochila', 'Visa', 'Itinerario', 'Hostal', 'Excursión', 'Aduana', 'Equipaje'],
    'Amigos': ['Fiesta', 'Risa', 'Confianza', 'Secreto', 'Apoyo', 'Diversión', 'Juego', 'Abrazo', 'Saludo', 'Broma', 'Charla', 'Reunión', 'Paseo', 'Aventura', 'Recuerdo', 'Lealtad', 'Compañía', 'Ayuda', 'Consejo', 'Celebración'],
    'Profesiones': ['Doctor', 'Profesor', 'Ingeniero', 'Chef', 'Abogado', 'Arquitecto', 'Enfermero', 'Policía', 'Bombero', 'Piloto', 'Carpintero', 'Electricista', 'Plomero', 'Artista', 'Músico', 'Escritor', 'Periodista', 'Fotógrafo', 'Diseñador', 'Científico'],
    'Tecnología': ['Celular', 'Tablet', 'Laptop', 'Internet', 'WiFi', 'App', 'Software', 'Hardware', 'Router', 'Mouse', 'Teclado', 'Monitor', 'Auriculares', 'Cámara', 'Dron', 'Smartwatch', 'USB', 'Bluetooth', 'Cloud', 'Password'],
    'Música': ['Piano', 'Guitarra', 'Batería', 'Violín', 'Trompeta', 'Saxofón', 'Flauta', 'Canción', 'Concierto', 'Banda', 'Ritmo', 'Melodía', 'Nota', 'Acorde', 'Letra', 'Micrófono', 'Amplificador', 'DJ', 'Playlist', 'Festival'],
    'Hobbies': ['Lectura', 'Pintura', 'Dibujo', 'Jardinería', 'Cocina', 'Fotografía', 'Colección', 'Videojuegos', 'Ajedrez', 'Puzzle', 'Costura', 'Tejer', 'Origami', 'Danza', 'Canto', 'Escritura', 'Modelismo', 'Pesca', 'Camping', 'Meditación']
};

// ==================== HELPERS / COMPONENTES ====================
const UI = {
    render: (html) => {
        document.getElementById('app').innerHTML = html;
    },
    
    backButton: (onClick) => `
        <button onclick="${onClick}" class="back-btn">←</button>
    `,
    
    card: (content, maxWidth = '420px') => `
        <div class="card" style="max-width:${maxWidth};position:relative;">
            ${content}
        </div>
    `,
    
    title: (text) => `<div class="title">${text}</div>`,
    
    subtitle: (text) => `<div class="subtitle">${text}</div>`,
    
    primaryButton: (text, onClick) => `
        <button class="btn-primary" onclick="${onClick}">${text}</button>
    `,
    
    primaryButtonDisabled: (text, reason = '') => `
        <button class="btn-primary disabled" disabled>${text}</button>
        ${reason ? `<div style="color:#6b5844;font-size:0.9rem;margin-top:12px;text-align:center;">${reason}</div>` : ''}
    `,
    
    counter: (label, value, onDecrease, onIncrease) => `
        <div style="flex:1;">
            <div style="color:#6b5844;font-size:1rem;">${label}</div>
            <div style="font-size:2.2rem;font-weight:bold;margin:8px 0;color:#2c2416;">${value}</div>
            <div style="display:flex;justify-content:center;gap:8px;">
                <button onclick="${onDecrease}" class="counter-btn">-</button>
                <button onclick="${onIncrease}" class="counter-btn">+</button>
            </div>
        </div>
    `,
    
    modeCard: (id, label, isActive, onClick) => `
        <div onclick="${onClick}" class="mode-card ${isActive ? 'active' : ''}">
            ${label}
        </div>
    `,
    
    categoryChip: (cat, isActive, onClick) => `
        <div onclick="${onClick}" class="category-chip ${isActive ? 'active' : ''}">
            ${cat}
        </div>
    `,
    
    playerCard: (index, nombre) => `
        <div class="player-card">
            <div class="player-number">${index + 1}</div>
            <input type="text" value="${nombre}" onchange="updateNombre(${index}, this.value)" class="player-input">
        </div>
    `,
    
    configButton: (label, value, onClick) => `
        <div onclick="${onClick}" style="flex:1;cursor:pointer;background:#f5e8d3;border-radius:16px;padding:16px;text-align:center;transition:all 0.2s;display:flex;flex-direction:column;align-items:center;justify-content:center;" 
             onmouseover="this.style.background='#ead6ba'" onmouseout="this.style.background='#f5e8d3'">
            <div style="color:#6b5844;font-size:1.1rem;margin-bottom:8px;width:100%;text-align:center;font-weight:600;">${label}</div>
            <div style="font-size:1.3rem;font-weight:bold;color:#b7202f;width:100%;text-align:center;line-height:1.4;">${value}</div>
        </div>
    `,
    
    configButtonCustom: (label, value, onClick, fontSize = '1.3rem') => `
        <div onclick="${onClick}" style="flex:1;cursor:pointer;background:#f5e8d3;border-radius:16px;padding:16px;text-align:center;transition:all 0.2s;display:flex;flex-direction:column;align-items:center;justify-content:center;" 
             onmouseover="this.style.background='#ead6ba'" onmouseout="this.style.background='#f5e8d3'">
            <div style="color:#6b5844;font-size:1.1rem;margin-bottom:8px;width:100%;text-align:center;font-weight:600;">${label}</div>
            <div style="font-size:${fontSize};font-weight:bold;color:#b7202f;width:100%;text-align:center;line-height:1.4;">${value}</div>
        </div>
    `,
    
    playerRevealCard: (index, nombre, onClick, disabled = false, sizeClass = '') => `
        <div onclick="${disabled ? '' : onClick}" class="player-reveal-card ${disabled ? 'disabled' : ''} ${sizeClass}">
            <div class="player-avatar ${disabled ? 'disabled' : ''} ${sizeClass}">${nombre.charAt(0).toUpperCase()}</div>
            <div style="font-size:1.1rem;font-weight:500;color:#2c2416;">${nombre}</div>
            ${disabled ? '<div style="font-size:0.8rem;color:#999;margin-top:8px;">✓ Visto</div>' : ''}
        </div>
    `,
    
    voteCard: (index, nombre, votos = 0) => `
        <div onclick="votarJugador(${index})" class="vote-card">
            <div class="player-avatar-small">${nombre.charAt(0).toUpperCase()}</div>
            <div style="font-size:1rem;font-weight:500;color:#2c2416;flex:1;">${nombre}</div>
            <div class="vote-count">${votos}</div>
        </div>
    `,
    
    categoryListCard: (categoria, emoji, isSelected, onClick) => `
        <div onclick="${onClick}" class="category-list-card ${isSelected ? 'selected' : ''}">
            <div style="font-size:2rem;margin-right:16px;">${emoji}</div>
            <div style="font-size:1.1rem;font-weight:500;color:#2c2416;flex:1;text-align:left;">${categoria}</div>
            ${isSelected ? '<div style="font-size:1.5rem;color:#b7202f;">✓</div>' : ''}
        </div>
    `,
    
    header: (showBackButton = false, onBack = '') => `
        <div class="app-header">
            ${showBackButton ? `<button onclick="${onBack}" class="header-back-btn">←</button>` : ''}
            <img src="assets/logo_impostor_header.png" alt="Impostor" class="header-logo">
        </div>
    `
};

// ==================== PANTALLA: BIENVENIDA ====================
function renderWelcome() {
    document.body.style.background = '#000';
    
    const content = `
        <div style="margin-bottom:32px;">
            <div style="position:relative;max-width:280px;width:80%;margin:0 auto 16px auto;border-radius:24px;overflow:hidden;background:radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);">
                <img src="assets/logo_laundry_impostor.png" alt="Impostor" style="width:100%;display:block;">
            </div>
        </div>
        ${UI.title('Impostor')}
        ${UI.subtitle('Juego de palabras')}
        <div style="color:#fff;font-size:1.1rem;margin-bottom:32px;">
            Un juego de fiesta con ideas ocultas y pistas astutas
        </div>
        <button onclick="renderConfig()" class="btn-primary" style="max-width:280px;display:block;margin:0 auto;">Empezar</button>
    `;
    
    UI.render(`<div class="card card-centered welcome-screen" style="max-width:450px;position:relative;">${content}</div>`);
}

// ==================== PANTALLA: CONFIGURACIÓN ====================
function renderConfig() {
    document.body.style.background = '#fef6ea';
    
    // Mostrar nombres de categorías o cantidad
    let categoriasTexto;
    let categoriasFontSize = '1.3rem'; // Tamaño por defecto
    if (state.categoriasSeleccionadas.length === 1) {
        categoriasTexto = state.categoriasSeleccionadas[0];
    } else {
        // Mostrar los nombres de las categorías seleccionadas
        categoriasTexto = state.categoriasSeleccionadas.join(', ');
        // Si hay más de 4 categorías, reducir el tamaño de fuente
        if (state.categoriasSeleccionadas.length > 4) {
            categoriasFontSize = '0.95rem';
        }
    }
    
    const content = `
        ${UI.header(true, 'renderWelcome()')}
        
        <div style="flex:1;display:flex;flex-direction:column;padding:20px;overflow:hidden;">
            <div style="flex:1;overflow-y:auto;padding-right:8px;">
                ${UI.title('Configuración del juego')}
            
                <div style="display:flex;gap:16px;justify-content:center;margin:24px 0 16px 0;">
                    ${UI.configButton('¿Cuántos jugadores?', state.jugadores, 'renderNombres()')}
                    ${UI.counter('¿Cuántos impostores?', state.impostores, 'updateImpostores(-1)', 'updateImpostores(1)')}
                </div>
                
                <div style="margin:24px 0 12px 0;">
                    ${UI.configButtonCustom('Categorías', categoriasTexto, 'renderSeleccionCategorias()', categoriasFontSize)}
                </div>
                
                <div style="margin:24px 0 0 0;display:flex;align-items:center;gap:12px;">
                    <label style="color:#6b5844;font-size:1rem;">Mostrar categoría al impostor</label>
                    <input type="checkbox" id="mostrarCat" ${state.mostrarCategoriaImpostor ? 'checked' : ''} 
                           onchange="toggleMostrarCategoria()" class="checkbox">
                </div>
            </div>
            
            <div style="flex-shrink:0;margin-top:16px;">
                ${UI.primaryButton('Iniciar juego', 'iniciarJuego()')}
            </div>
        </div>
    `;
    
    UI.render(UI.card(content));
}

// ==================== PANTALLA: SELECCIÓN DE CATEGORÍAS ====================
function renderSeleccionCategorias() {
    // Guardar posición del scroll antes de re-renderizar
    const scrollContainer = document.querySelector('.categories-scroll-container');
    const scrollPos = scrollContainer ? scrollContainer.scrollTop : 0;
    
    const content = `
        ${UI.header(true, 'confirmarCategorias()')}
        
        <div style="flex:1;display:flex;flex-direction:column;padding:20px;overflow:hidden;">
            <div style="flex-shrink:0;">
                ${UI.title('Seleccionar Categorías')}
                
                <div style="margin:12px 0;color:#6b5844;font-size:0.95rem;text-align:center;">
                    Elige una o más categorías para el juego.
                </div>
            </div>
            
            <div class="categories-scroll-container">
                ${state.categorias.map(cat => 
                    UI.categoryListCard(
                        cat, 
                        state.categoriasEmojis[cat], 
                        state.categoriasSeleccionadas.includes(cat),
                        `toggleCategoria('${cat}')`
                    )
                ).join('')}
            </div>
            
            <div style="flex-shrink:0;margin-top:16px;">
                ${UI.primaryButton('Confirmar', 'confirmarCategorias()')}
            </div>
        </div>
    `;
    
    UI.render(UI.card(content));
    
    // Restaurar posición del scroll después de re-renderizar
    if (scrollPos > 0) {
        requestAnimationFrame(() => {
            const newScrollContainer = document.querySelector('.categories-scroll-container');
            if (newScrollContainer) {
                newScrollContainer.scrollTop = scrollPos;
            }
        });
    }
}

// ==================== PANTALLA: SELECCIÓN DE JUGADORES ====================
function renderJugadores() {
    // Determinar columnas y clase de tamaño según cantidad de jugadores
    let gridCols, sizeClass, gap;
    if (state.jugadores <= 4) {
        gridCols = '1fr 1fr';
        sizeClass = '';
        gap = '16px';
    } else if (state.jugadores <= 6) {
        gridCols = '1fr 1fr';
        sizeClass = 'compact';
        gap = '12px';
    } else if (state.jugadores <= 9) {
        gridCols = '1fr 1fr 1fr';
        sizeClass = 'compact';
        gap = '10px';
    } else {
        gridCols = '1fr 1fr 1fr';
        sizeClass = 'mini';
        gap = '8px';
    }
    
    const content = `
        ${UI.header(true, 'renderConfig()')}
        
        <div style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;">
            ${UI.title('Jugadores')}
        
        ${state.jugadoresVistos.length === state.jugadores ? 
            `<div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;">
                <div style="padding:24px;background:#d4edda;border-radius:16px;color:#155724;font-size:1.1rem;text-align:center;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.1);max-width:400px;">
                    ✓ Todos los jugadores vieron su rol
                </div>
            </div>
            <div style="flex-shrink:0;margin-top:16px;">
                ${UI.primaryButton('Iniciar debate y votación', 'iniciarVotacion()')}
            </div>` 
            : 
            `<div style="margin:8px 0;color:#6b5844;font-size:0.9rem;text-align:center;flex-shrink:0;line-height:1.3;">
                Toca tu nombre para revelar tu palabra y luego pasa el dispositivo al siguiente jugador.
            </div>
            
            <div style="display:grid;grid-template-columns:${gridCols};gap:${gap};flex:1;align-content:center;padding:4px 0;">
                ${state.nombres.map((nombre, i) => 
                    UI.playerRevealCard(i, nombre, `revelarRol(${i})`, state.jugadoresVistos.includes(i), sizeClass)
                ).join('')}
            </div>`}
        </div>
    `;
    
    UI.render(UI.card(content));
}

// ==================== PANTALLA: REVELACIÓN DE ROL ====================
function renderRevelacion(jugadorIndex) {
    const esImpostor = state.roles[jugadorIndex] === 'impostor';
    const nombre = state.nombres[jugadorIndex];
    
    const content = `
        ${UI.header(true, 'renderJugadores()')}
        
        <div style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;justify-content:center;">
            ${UI.title(`Hola, ${nombre}`)}
        
        <div style="margin:32px 0 16px 0;color:#b7202f;font-size:1rem;">
            La palabra para ${nombre}
        </div>
        
        <div style="font-size:1.5rem;font-weight:bold;margin-bottom:24px;">
            Categoría: ${state.categoria}
        </div>
        
        <div class="reveal-card ${esImpostor ? 'impostor' : 'ciudadano'}">
            ${esImpostor ? 'Impostor' : state.palabraSecreta}
        </div>
        
        ${UI.primaryButton('¡Entendido!', 'renderJugadores()')}
        </div>
    `;
    
    UI.render(UI.card(content, '450px'));
}

// ==================== PANTALLA: VOTACIÓN ====================
function renderVotacion() {
    // Guardar posición del scroll antes de re-renderizar
    const scrollContainer = document.querySelector('.votes-scroll-container');
    const scrollPos = scrollContainer ? scrollContainer.scrollTop : 0;
    
    const content = `
        ${UI.header(false)}
        
        <div style="flex:1;display:flex;flex-direction:column;padding:20px;overflow:hidden;">
            <div style="flex-shrink:0;">
                ${UI.title('Votación')}
                
                <div style="margin:12px 0 8px 0;color:#6b5844;font-size:0.95rem;text-align:center;line-height:1.4;">
                    Discutan y voten por quien creen que es el impostor
                </div>
                
                <div style="margin:8px 0;padding:10px;background:#f5e8d3;border-radius:10px;color:#6b5844;text-align:center;font-size:0.9rem;font-weight:600;">
                    Votos registrados: ${state.votos.length} / ${state.jugadores}
                </div>
            </div>
            
            <div class="votes-scroll-container">
                ${state.nombres.map((nombre, i) => {
                    const votosRecibidos = state.votos.filter(v => v === i).length;
                    return UI.voteCard(i, nombre, votosRecibidos);
                }).join('')}
            </div>
            
            <div style="flex-shrink:0;margin-top:12px;">
                ${state.votos.length > 0 ? `
                    <button onclick="deshacerVotacion()" class="btn-secondary" style="width:100%;max-width:400px;margin:0 auto 10px auto;display:block;">
                        ↺ Deshacer votación
                    </button>
                ` : ''}
                
                ${state.votos.length === state.jugadores ? 
                    UI.primaryButton('Ver resultados', 'verResultados()') : ''}
            </div>
        </div>
    `;
    
    UI.render(UI.card(content));
    
    // Restaurar posición del scroll después de re-renderizar
    requestAnimationFrame(() => {
        const newScrollContainer = document.querySelector('.votes-scroll-container');
        if (newScrollContainer && scrollPos > 0) {
            newScrollContainer.scrollTop = scrollPos;
        }
    });
}

// ==================== PANTALLA: RESULTADOS ====================
function renderResultados() {
    // Contar votos
    const conteoVotos = {};
    state.votos.forEach(voto => {
        conteoVotos[voto] = (conteoVotos[voto] || 0) + 1;
    });
    
    // Encontrar jugador con más votos
    let maxVotos = 0;
    let jugadoresConMaxVotos = [];
    Object.entries(conteoVotos).forEach(([idx, votos]) => {
        if (votos > maxVotos) {
            maxVotos = votos;
            jugadoresConMaxVotos = [parseInt(idx)];
        } else if (votos === maxVotos) {
            jugadoresConMaxVotos.push(parseInt(idx));
        }
    });
    
    const empate = jugadoresConMaxVotos.length > 1;
    const votadoIdx = empate ? null : jugadoresConMaxVotos[0];
    const esImpostor = votadoIdx !== null && state.roles[votadoIdx] === 'impostor';
    
    // Determinar ganadores
    let resultado, color, bg;
    if (empate) {
        resultado = '🤝 Empate - Nadie es expulsado';
        color = '#ffa500';
        bg = '#4a3a1a';
    } else if (esImpostor) {
        resultado = `✅ ¡Los Ciudadanos Ganan!<br><br>${state.nombres[votadoIdx]} era el Impostor`;
        color = '#6bffb8';
        bg = '#1a4a3a';
    } else {
        resultado = `❌ ¡El Impostor Gana!<br><br>${state.nombres[votadoIdx]} era inocente`;
        color = '#ff6b6b';
        bg = '#4a1a1a';
    }
    
    const impostores = state.nombres.filter((_, i) => state.roles[i] === 'impostor');
    
    const content = `
        ${UI.header(false)}
        
        <div style="flex:1;display:flex;flex-direction:column;padding:20px;overflow:hidden;">
            <div style="flex-shrink:0;">
                ${UI.title('Resultados')}
            
                <div style="margin:20px 0 16px 0;padding:24px;background:${bg};border-radius:20px;color:${color};font-size:1.2rem;font-weight:bold;text-align:center;line-height:1.5;">
                    ${resultado}
                </div>
            </div>
            
            <div style="flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;">
                <div style="margin:12px 0;padding:20px;background:#f5e8d3;border-radius:16px;">
                    <div style="color:#6b5844;font-size:1rem;margin-bottom:16px;text-align:left;">Votación:</div>
                    <table style="width:100%;border-collapse:collapse;">
                        ${state.nombres.map((nombre, i) => {
                            const votos = state.votos.filter(v => v === i).length;
                            const rolText = state.roles[i] === 'impostor' ? '👤 Impostor' : '👥 Ciudadano';
                            return `
                                <tr style="border-bottom:1px solid rgba(107, 88, 68, 0.2);">
                                    <td style="padding:8px 8px 8px 0;text-align:left;color:#2c2416;">${nombre}</td>
                                    <td style="padding:8px;text-align:center;color:#6b5844;white-space:nowrap;">${votos} votos</td>
                                    <td style="padding:8px 0 8px 8px;text-align:right;color:${state.roles[i] === 'impostor' ? '#b7202f' : '#2d7a2d'};font-size:0.9rem;white-space:nowrap;">${rolText}</td>
                                </tr>
                            `;
                        }).join('')}
                    </table>
                </div>
                
                <div style="margin:16px 0;padding:16px;background:#e5f5e5;border-radius:12px;">
                    <div style="color:#2d7a2d;font-size:1rem;margin-bottom:8px;">La palabra secreta era:</div>
                    <div style="color:#2c2416;font-size:1.5rem;font-weight:bold;">${state.palabraSecreta}</div>
                </div>
            </div>
            
            <div style="flex-shrink:0;margin-top:12px;">
                ${UI.primaryButton('Nuevo juego', 'nuevoJuego()')}
            </div>
        </div>
    `;
    
    UI.render(UI.card(content));
}

// ==================== LÓGICA: INICIAR JUEGO ====================
function iniciarJuego() {
    // Asignar roles aleatorios
    state.roles = Array(state.jugadores).fill('ciudadano');
    state.jugadoresVistos = [];
    
    // Seleccionar impostores aleatorios
    const indices = Array.from({length: state.jugadores}, (_, i) => i);
    for (let i = 0; i < state.impostores; i++) {
        const randomIndex = Math.floor(Math.random() * indices.length);
        const jugadorIndex = indices.splice(randomIndex, 1)[0];
        state.roles[jugadorIndex] = 'impostor';
    }
    
    // Seleccionar palabra secreta aleatoria de las categorías seleccionadas
    // Primero seleccionar una categoría aleatoria
    const categoriaAleatoria = state.categoriasSeleccionadas[Math.floor(Math.random() * state.categoriasSeleccionadas.length)];
    // Luego seleccionar una palabra de esa categoría
    const palabrasCategoria = palabrasPorCategoria[categoriaAleatoria];
    state.palabraSecreta = palabrasCategoria[Math.floor(Math.random() * palabrasCategoria.length)];
    // Guardar la categoría seleccionada
    state.categoria = categoriaAleatoria;
    
    renderJugadores();
}

function revelarRol(jugadorIndex) {
    if (!state.jugadoresVistos.includes(jugadorIndex)) {
        state.jugadoresVistos.push(jugadorIndex);
    }
    renderRevelacion(jugadorIndex);
}

function iniciarVotacion() {
    state.votos = [];
    renderVotacion();
}

function votarJugador(jugadorIndex) {
    // Cada jugador vota una vez, se puede cambiar el voto
    if (state.votos.length < state.jugadores) {
        state.votos.push(jugadorIndex);
        renderVotacion();
    }
}

function deshacerVotacion() {
    state.votos = [];
    renderVotacion();
}

function verResultados() {
    renderResultados();
}

function nuevoJuego() {
    state.nombresEditados = false;
    renderConfig();
}

// ==================== PANTALLA: NOMBRES DE JUGADORES ====================
function renderNombres() {
    // Inicializar nombres si no existen
    if (!state.nombres || state.nombres.length !== state.jugadores) {
        state.nombres = Array.from({length: state.jugadores}, (_, i) => `Jugador ${i + 1}`);
    }
    
    // Marcar como visitado/configurado al entrar a esta pantalla
    state.nombresEditados = true;
    
    const content = `
        ${UI.header(true, 'renderConfig()')}
        
        <div style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;">
            ${UI.title('Nombres de jugadores')}
        
        <div style="margin:16px 0;color:#b7202f;font-size:1.1rem;flex-shrink:0;">
            ${state.jugadores} jugadores
        </div>
        
        <div class="players-scroll-container">
            ${state.nombres.map((nombre, i) => UI.playerCard(i, nombre)).join('')}
        </div>
        
        <div style="flex-shrink:0;margin-top:auto;padding-top:16px;">
            <div style="display:flex;gap:12px;margin-bottom:16px;">
                <button onclick="eliminarJugador()" class="btn-secondary">- Eliminar</button>
                <button onclick="anadirJugador()" class="btn-secondary">+ Añadir</button>
            </div>
            
            ${UI.primaryButton('Continuar', 'renderConfig()')}
        </div>
        </div>
    `;
    
    UI.render(UI.card(content));
}

// ==================== LÓGICA: JUGADORES ====================
function updateNombre(idx, value) {
    state.nombres[idx] = value;
    state.nombresEditados = true;
    guardarEstado();
}

function anadirJugador() {
    if (state.jugadores < 15) {
        state.jugadores++;
        state.nombres.push(`Jugador ${state.jugadores}`);
        state.nombresEditados = false;
        guardarEstado();
        renderNombres();
    }
}

function eliminarJugador() {
    if (state.jugadores > 3) {
        state.jugadores--;
        state.nombres.pop();
        state.nombresEditados = false;
        guardarEstado();
        renderNombres();
    }
}

// ==================== LÓGICA: CONFIGURACIÓN ====================
function updateJugadores(delta) {
    state.jugadores = Math.max(3, Math.min(15, state.jugadores + delta));
    if (state.impostores >= state.jugadores) {
        state.impostores = state.jugadores - 1;
    }
    guardarEstado();
    // No renderizar nada, esta función ya no se usa desde la UI
}

function updateImpostores(delta) {
    state.impostores = Math.max(1, Math.min(state.jugadores - 1, state.impostores + delta));
    renderConfig();
}

function setCategoria(cat) {
    state.categoria = cat;
    renderConfig();
}

function toggleCategoria(cat) {
    const index = state.categoriasSeleccionadas.indexOf(cat);
    if (index === -1) {
        state.categoriasSeleccionadas.push(cat);
    } else {
        // No permitir deseleccionar si es la única
        if (state.categoriasSeleccionadas.length > 1) {
            state.categoriasSeleccionadas.splice(index, 1);
        }
    }
    guardarEstado();
    renderSeleccionCategorias();
}

function confirmarCategorias() {
    guardarEstado();
    renderConfig();
}

function toggleMostrarCategoria() {
    state.mostrarCategoriaImpostor = !state.mostrarCategoriaImpostor;
    guardarEstado();
    renderConfig();
}

// ==================== INICIALIZACIÓN ====================
window.onload = () => {
    // Cargar estado guardado
    cargarEstado();
    renderWelcome();
};
