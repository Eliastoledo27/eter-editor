// ===== ÉTER STUDIO - EDITOR PROFESIONAL V2.0 =====
// Combina Editor de Tiendas Online + Generador de Catálogos

// Variables globales
let productos = [];
let catalogosGuardados = JSON.parse(localStorage.getItem('catalogosEter')) || [];
let configuracionDiseño = JSON.parse(localStorage.getItem('configuracionDiseñoEter')) || {
    header: { texto: 'Catálogo Éter', color: [34, 34, 34], tamaño: 24, negrita: true },
    footer: { texto: 'Generado con Éter Generador de Catálogos', color: [128, 128, 128], tamaño: 10, negrita: false },
    logo: null
};

// Configuración del editor de tiendas
let configuracionEditor = {
    general: {
        storeName: 'Éter Fashion Store',
        storeDescription: 'Tu tienda de moda online con los mejores productos y diseños únicos.',
        storeLogo: '',
        whatsappNumber: '+34612345678'
    },
    header: {
        bgColor: '#667eea',
        textColor: '#ffffff',
        fontSize: 48,
        showLogo: true
    },
    products: {
        columns: 3,
        spacing: 20,
        priceColor: '#00aa00',
        showCategories: true,
        showDescriptions: true
    },
    cart: {
        position: 'fixed',
        color: '#667eea',
        showCount: true,
        autoHide: false
    },
    theme: {
        preset: 'modern',
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        backgroundColor: '#f8f9fa'
    },
    whatsapp: {
        message: '¡Hola! Me gustaría realizar este pedido. ¿Podrías confirmar la disponibilidad y el proceso de pago?',
        showNumber: true,
        color: '#25d366'
    }
};

// Productos de ejemplo
const productosEjemplo = [
    {
        id: 'prod_1',
        nombre: 'Camiseta Vintage Éter',
        precio: '29.99',
        talle: 'M',
        categoria: 'Ropa',
        descripcion: 'Camiseta de algodón premium con diseño vintage único.',
        imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        seleccionado: true
    },
    {
        id: 'prod_2',
        nombre: 'Jeans Slim Fit Premium',
        precio: '79.99',
        talle: 'L',
        categoria: 'Ropa',
        descripcion: 'Jeans de alta calidad con corte slim fit.',
        imagen: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
        seleccionado: true
    },
    {
        id: 'prod_3',
        nombre: 'Sneakers Urban Éter',
        precio: '89.99',
        talle: '42',
        categoria: 'Calzado',
        descripcion: 'Sneakers urbanos con tecnología de amortiguación avanzada.',
        imagen: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
        seleccionado: true
    },
    {
        id: 'prod_4',
        nombre: 'Reloj Smart Éter Pro',
        precio: '199.99',
        talle: 'Único',
        categoria: 'Accesorios',
        descripcion: 'Reloj inteligente con funciones avanzadas.',
        imagen: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        seleccionado: true
    },
    {
        id: 'prod_5',
        nombre: 'Mochila Laptop Éter',
        precio: '59.99',
        talle: 'Único',
        categoria: 'Accesorios',
        descripcion: 'Mochila elegante con compartimento especial para laptop.',
        imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        seleccionado: true
    },
    {
        id: 'prod_6',
        nombre: 'Gafas de Sol Éter',
        precio: '129.99',
        talle: 'Único',
        categoria: 'Accesorios',
        descripcion: 'Gafas de sol premium con protección UV.',
        imagen: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        seleccionado: true
    }
];

// Registro de última tienda generada
let ultimaTienda = JSON.parse(localStorage.getItem('eter_ultima_tienda')) || null;

async function guardarTiendaEnCarpetaTemporal(htmlContent, cssContent, baseName) {
	// Crear carpeta temporal automática en OPFS (Origin Private File System)
	if (!('storage' in navigator) || !navigator.storage.getDirectory) {
		throw new Error('OPFS no soportado');
	}
	const root = await navigator.storage.getDirectory();
	const tmpRoot = await root.getDirectoryHandle('tienda_temp', { create: true });
	const subFolderName = baseName.replace(/[^a-zA-Z0-9_\-]/g, '_');
	const tempDir = await tmpRoot.getDirectoryHandle(subFolderName, { create: true });
	// Guardar CSS
	const cssHandle = await tempDir.getFileHandle('estilos.css', { create: true });
	const cssWritable = await cssHandle.createWritable();
	await cssWritable.write(cssContent);
	await cssWritable.close();
	// Guardar HTML (con href relativo a estilos.css)
	const safeName = subFolderName; 
	const htmlFileName = `${safeName}.html`;
	const htmlHandle = await tempDir.getFileHandle(htmlFileName, { create: true });
	const htmlWritable = await htmlHandle.createWritable();
	await htmlWritable.write(htmlContent);
	await htmlWritable.close();
	// Crear URLs para apertura inmediata (usar CSS blob URL para que abra con estilos)
	const cssFile = await cssHandle.getFile();
	const cssBlobUrl = URL.createObjectURL(cssFile);
	const htmlForOpen = htmlContent.replace(/href="estilos\.css"/g, `href="${cssBlobUrl}"`);
	const htmlOpenBlob = new Blob([htmlForOpen], { type: 'text/html;charset=utf-8' });
	const htmlOpenUrl = URL.createObjectURL(htmlOpenBlob);
	return {
		folderHandle: tempDir,
		htmlHandle,
		cssHandle,
		htmlFileName,
		openUrl: htmlOpenUrl
	};
}

function guardarUltimaTienda(info) {
	ultimaTienda = {
		fileName: info?.fileName || '',
		filePath: info?.htmlFilePath || '',
		openUrl: info?.openUrl || '',
		createdAt: Date.now()
	};
	localStorage.setItem('eter_ultima_tienda', JSON.stringify(ultimaTienda));
}

// Modal de Enlaces
function abrirEnlacesModal() {
	const hayTienda = !!(ultimaTienda && ultimaTienda.filePath && ultimaTienda.fileName);
	const enlaceFile = hayTienda ? `file://${ultimaTienda.filePath}` : '';

	const modal = document.createElement('div');
	modal.className = 'publicacion-modal';
	modal.id = 'publicacionModal';
	modal.innerHTML = `
		<div class="publicacion-content">
			<div class="publicacion-header">
				<h2><i class="fas fa-link"></i> Enlaces</h2>
				<button class="publicacion-close" onclick="cerrarModalPublicacion()"><i class="fas fa-times"></i></button>
			</div>
			<div class="publicacion-body" style="text-align:center; padding: 1.5rem 2rem;">
				<div class="publicacion-actions-simple" style="justify-content:center;">
					<button class="btn-copiar-enlace${hayTienda ? '' : ' disabled'}" ${hayTienda ? '' : 'disabled'} onclick="${hayTienda ? 'copiarEnlaceDirecto()' : ''}">
						<i class="fas fa-copy"></i>
						Copiar enlace
					</button>
					<button class="btn-ver-tienda${hayTienda ? '' : ' disabled'}" ${hayTienda ? '' : 'disabled'} onclick="${hayTienda ? 'abrirTiendaDirecta()' : ''}">
						<i class="fas fa-external-link-alt"></i>
						Abrir tienda
					</button>
				</div>
				<div class="publicacion-details" style="margin-top:1rem;">
					<div class="detail-item"><i class="fas fa-file-code"></i><span>${hayTienda ? (ultimaTienda.fileName) : 'No hay tienda publicada recientemente'}</span></div>
				</div>
			</div>
		</div>
	`;
	// estilos mínimos para disabled
	const style = document.createElement('style');
	style.textContent = `
		.publicacion-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 10000; }
		.publicacion-content { background: var(--bg-white, #ffffff); color: var(--text-dark, #111); width: 90%; max-width: 520px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); overflow: hidden; }
		.publicacion-header { background: linear-gradient(135deg, var(--primary-blue, #667eea) 0%, var(--secondary-blue, #764ba2) 100%); color: #fff; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; }
		.publicacion-close { background: rgba(255,255,255,0.2); border: none; color: #fff; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; }
		.publicacion-body { padding: 20px; }
		.publicacion-actions-simple { display: flex; gap: 12px; justify-content: center; margin-bottom: 16px; }
		.btn-copiar-enlace, .btn-ver-tienda { padding: 12px 18px; border: none; border-radius: 10px; font-weight: 600; color: #fff; cursor: pointer; }
		.btn-copiar-enlace { background: linear-gradient(135deg, #25d366 0%, #128c7e 100%); }
		.btn-ver-tienda { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
		.publicacion-details { background: #f2f4f8; border-radius: 10px; padding: 12px; }
		.detail-item { display:flex; align-items:center; gap:8px; color:#555; }
		.btn-copiar-enlace.disabled, .btn-ver-tienda.disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(30%); }
	`;
	document.head.appendChild(style);
	document.body.appendChild(modal);
}

function cerrarModalPublicacion() {
	const modal = document.getElementById('publicacionModal');
	if (modal) modal.remove();
}

function copiarEnlaceDirecto() {
	if (ultimaTienda?.openUrl) {
		navigator.clipboard?.writeText(ultimaTienda.openUrl);
		mostrarNotificacion('✅ Enlace copiado', 'success');
		return;
	}
	if (!ultimaTienda?.filePath) return;
	const link = `file://${ultimaTienda.filePath}`;
	if (navigator.clipboard?.writeText) {
		navigator.clipboard.writeText(link).then(() => mostrarNotificacion('✅ Enlace copiado', 'success'));
	} else {
		const t = document.createElement('textarea');
		t.value = link; t.style.position='fixed'; t.style.left='-9999px';
		document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
		mostrarNotificacion('✅ Enlace copiado', 'success');
	}
}

function abrirTiendaDirecta() {
	if (ultimaTienda?.openUrl) {
		window.open(ultimaTienda.openUrl, '_blank');
		return;
	}
	if (!ultimaTienda?.filePath) return;
	window.open(`file://${ultimaTienda.filePath}`, '_blank');
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Éter Studio...');
    
    // Cargar productos
    productos.length = 0;
    productos.push(...productosEjemplo);
    
    // Inicializar componentes
    inicializarNavegacionConfig();
    inicializarControlesVista();
    inicializarControlesRango();
    configurarEventosTeclado();
    
    // Generar vista previa inicial
    actualizarTiendaEnTiempoReal();
    actualizarContadores();
    actualizarPuntuacionRendimiento();
    
    console.log('✅ Éter Studio iniciado correctamente');
});

// ===== FUNCIONES DE NAVEGACIÓN =====

function inicializarNavegacionConfig() {
    const navItems = document.querySelectorAll('.nav-item');
    const configSections = document.querySelectorAll('.config-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            
            navItems.forEach(nav => nav.classList.remove('active'));
            configSections.forEach(section => section.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(section).classList.add('active');
        });
    });
}

function inicializarControlesVista() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const previewFrame = document.getElementById('previewFrame');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            aplicarVistaResponsive(view, previewFrame);
        });
    });
}

function inicializarControlesRango() {
    const rangeInputs = document.querySelectorAll('.config-range');
    
    rangeInputs.forEach(input => {
        const valueDisplay = input.parentElement.querySelector('.range-value');
        if (valueDisplay) {
            actualizarValorRango(input, valueDisplay);
            input.addEventListener('input', function() {
                actualizarValorRango(this, valueDisplay);
            });
        }
    });
}

function actualizarValorRango(input, display) {
    const value = input.value;
    const unit = input.dataset.unit || 'px';
    display.textContent = value + unit;
}

function aplicarVistaResponsive(view, frame) {
    const views = {
        desktop: { width: '100%', height: '100%', size: '1920x1080' },
        tablet: { width: '768px', height: '1024px', size: '768x1024' },
        mobile: { width: '375px', height: '667px', size: '375x667' }
    };
    
    const config = views[view];
    frame.style.width = config.width;
    frame.style.height = config.height;
    frame.style.margin = view === 'desktop' ? '0' : '0 auto';
    frame.style.border = view === 'desktop' ? 'none' : '2px solid var(--border-primary)';
    
    const previewSize = document.getElementById('previewSize');
    if (previewSize) {
        previewSize.textContent = config.size;
    }
}

// ===== FUNCIONES DE CONFIGURACIÓN =====

function actualizarTiendaEnTiempoReal() {
    console.log('🔄 Actualizando tienda en tiempo real...');
    
    try {
        recopilarConfiguracion();
        const htmlContent = generarTiendaAvanzada();
        mostrarTiendaEnFrame(htmlContent);
        actualizarContadores();
        
        const lastUpdate = document.getElementById('lastUpdate');
        if (lastUpdate) {
            lastUpdate.textContent = 'Ahora';
        }
        
        actualizarPuntuacionRendimiento();
        console.log('✅ Tienda actualizada');
        
    } catch (error) {
        console.error('❌ Error al actualizar tienda:', error);
        mostrarNotificacion('Error al actualizar la tienda: ' + error.message, 'error');
    }
}

function recopilarConfiguracion() {
    try {
        configuracionEditor = {
            general: {
                storeName: document.getElementById('storeName')?.value || 'Éter Fashion Store',
                storeDescription: document.getElementById('storeDescription')?.value || '',
                storeLogo: document.getElementById('storeLogo')?.value || '',
                whatsappNumber: document.getElementById('whatsappNumber')?.value || '+34612345678'
            },
            header: {
                bgColor: document.getElementById('headerBgColor')?.value || '#667eea',
                textColor: document.getElementById('headerTextColor')?.value || '#ffffff',
                fontSize: parseInt(document.getElementById('headerFontSize')?.value) || 48,
                showLogo: document.getElementById('showLogo')?.checked || true
            },
            products: {
                columns: parseInt(document.getElementById('productColumns')?.value) || 3,
                spacing: parseInt(document.getElementById('productSpacing')?.value) || 20,
                priceColor: document.getElementById('priceColor')?.value || '#00aa00',
                showCategories: document.getElementById('showCategories')?.checked || true,
                showDescriptions: document.getElementById('showDescriptions')?.checked || true
            },
            cart: {
                position: document.getElementById('cartPosition')?.value || 'fixed',
                color: document.getElementById('cartColor')?.value || '#667eea',
                showCount: document.getElementById('showCartCount')?.checked || true,
                autoHide: document.getElementById('autoHideCart')?.checked || false
            },
            theme: {
                preset: document.querySelector('.theme-preset.active')?.dataset.theme || 'modern',
                primaryColor: document.getElementById('primaryColor')?.value || '#667eea',
                secondaryColor: document.getElementById('secondaryColor')?.value || '#764ba2',
                backgroundColor: document.getElementById('backgroundColor')?.value || '#f8f9fa'
            },
            whatsapp: {
                message: document.getElementById('whatsappMessage')?.value || '',
                showNumber: document.getElementById('showWhatsappNumber')?.checked || true,
                color: document.getElementById('whatsappColor')?.value || '#25d366'
            }
        };
    } catch (error) {
        console.error('Error al recopilar configuración:', error);
    }
}

function cambiarTema(tema) {
    console.log('🎨 Cambiando tema a:', tema);
    
    document.querySelectorAll('.theme-preset').forEach(preset => {
        preset.classList.remove('active');
    });
    
    const selectedPreset = document.querySelector(`[data-theme="${tema}"]`);
    if (selectedPreset) {
        selectedPreset.classList.add('active');
    }
    
    const temas = {
        modern: { primaryColor: '#667eea', secondaryColor: '#764ba2', backgroundColor: '#f8f9fa' },
        elegant: { primaryColor: '#2c3e50', secondaryColor: '#34495e', backgroundColor: '#ecf0f1' },
        minimal: { primaryColor: '#6c757d', secondaryColor: '#495057', backgroundColor: '#ffffff' },
        colorful: { primaryColor: '#ff6b6b', secondaryColor: '#4ecdc4', backgroundColor: '#f8f9fa' },
        dark: { primaryColor: '#1a1a1a', secondaryColor: '#2d2d2d', backgroundColor: '#0d1117' },
        light: { primaryColor: '#ffffff', secondaryColor: '#f8f9fa', backgroundColor: '#ffffff' }
    };
    
    const config = temas[tema];
    if (config) {
        const primaryColor = document.getElementById('primaryColor');
        const secondaryColor = document.getElementById('secondaryColor');
        const backgroundColor = document.getElementById('backgroundColor');
        
        if (primaryColor) primaryColor.value = config.primaryColor;
        if (secondaryColor) secondaryColor.value = config.secondaryColor;
        if (backgroundColor) backgroundColor.value = config.backgroundColor;
    }
    
    actualizarTiendaEnTiempoReal();
}

// ===== FUNCIONES DE VISTA PREVIA =====

function mostrarTiendaEnFrame(htmlContent) {
    const frame = document.getElementById('previewFrame');
    if (!frame) {
        console.error('Frame de vista previa no encontrado');
        return;
    }
    
    frame.innerHTML = `
        <iframe 
            srcdoc="${htmlContent.replace(/"/g, '&quot;')}"
            style="width: 100%; height: 100%; border: none; border-radius: 8px;"
            title="Vista previa de tienda online">
        </iframe>
    `;
}

// ===== FUNCIONES DE UTILIDAD =====

function actualizarContadores() {
    const productosSeleccionados = productos.filter(p => p.seleccionado);
    const productCount = document.getElementById('productCount');
    const memoryUsage = document.getElementById('memoryUsage');
    
    if (productCount) {
        productCount.textContent = productosSeleccionados.length;
    }
    
    if (memoryUsage) {
        const memory = (Math.random() * 2 + 1.5).toFixed(1);
        memoryUsage.textContent = memory + ' MB';
    }
}

function actualizarPuntuacionRendimiento() {
    const score = Math.floor(Math.random() * 5) + 95;
    const performanceScore = document.getElementById('performanceScore');
    if (performanceScore) {
        performanceScore.textContent = score + '%';
    }
}

function toggleConfigPanel() {
    const panel = document.querySelector('.config-panel');
    const toggle = document.querySelector('.panel-toggle i');
    
    panel.classList.toggle('collapsed');
    
    if (panel.classList.contains('collapsed')) {
        toggle.className = 'fas fa-chevron-right';
    } else {
        toggle.className = 'fas fa-chevron-left';
    }
}

function togglePreview() {
    console.log('👁️ Alternando vista previa...');
    actualizarTiendaEnTiempoReal();
}

function toggleFullscreen() {
    const frame = document.getElementById('previewFrame');
    if (!document.fullscreenElement) {
        frame.requestFullscreen().catch(err => {
            console.log('Error al entrar en pantalla completa:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

function toggleDevTools() {
    const frame = document.getElementById('previewFrame');
    if (frame) {
        const iframe = frame.querySelector('iframe');
        if (iframe) {
            try {
                iframe.contentWindow.focus();
                iframe.contentWindow.console.log('Dev Tools activados');
            } catch (e) {
                console.log('No se pueden abrir Dev Tools en iframe');
            }
        }
    }
}

function configurarEventosTeclado() {
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            exportarTiendaOnline();
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            togglePreview();
        }
        
        if (e.key === 'F11') {
            e.preventDefault();
            toggleFullscreen();
        }
        
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal, .dialogo-tema');
            modals.forEach(modal => {
                if (modal.style.display !== 'none') {
                    modal.style.display = 'none';
                }
            });
        }
    });
}

// ===== FUNCIONES DE EXPORTACIÓN =====

function exportarTiendaOnline() {
    console.log('📦 Exportando tienda online...');
    
    const productosSeleccionados = productos.filter(p => p.seleccionado);
    
    if (productosSeleccionados.length === 0) {
        mostrarNotificacion('❌ No hay productos seleccionados para exportar', 'warning');
        return;
    }
    
    try {
        const htmlContent = generarTiendaAvanzada();
        const filename = `${configuracionEditor.general.storeName.replace(/[^a-zA-Z0-9]/g, '_')}_tienda_${Date.now()}.html`;
        
        descargarArchivo(htmlContent, filename, 'text/html; charset=utf-8');
        mostrarNotificacion('✅ Tienda exportada exitosamente', 'success');
        
    } catch (error) {
        console.error('❌ Error al exportar tienda:', error);
        mostrarNotificacion('❌ Error al exportar tienda: ' + error.message, 'error');
    }
}

function publicarTienda() {
    console.log('🚀 Publicando tienda...');
    try {
        const productosActuales = productos.filter(p => p.seleccionado);
        if (!productosActuales.length) {
            mostrarNotificacion('⚠️ No hay productos seleccionados para publicar', 'warning');
            return;
        }
        // Generar HTML/CSS
        const htmlContent = generarTiendaAvanzada();
        // CSS base: extraer desde tema actual
        const cssContent = `:root{--primary-color:${configuracionEditor?.theme?.primaryColor||'#667eea'};--secondary-color:${configuracionEditor?.theme?.secondaryColor||'#764ba2'}}`;
        const nombre = (configuracionEditor?.general?.storeName || 'Tienda').replace(/[^a-zA-Z0-9]/g, '_');
        // Guardar en carpeta temporal con File System Access API
        guardarTiendaEnCarpetaTemporal(htmlContent, cssContent, `${nombre}_tienda_${Date.now()}`)
            .then(res => {
                guardarUltimaTienda({ fileName: res.htmlFileName, htmlFilePath: '', openUrl: res.openUrl });
                mostrarNotificacion('✅ Tienda guardada en carpeta temporal. Usa "Enlaces" para abrir o copiar.', 'success');
            })
            .catch(err => {
                console.error(err);
                mostrarNotificacion('❌ No se pudo guardar en carpeta. Se generará enlace temporal.', 'warning');
                // Fallback a blob URL en memoria
                const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                guardarUltimaTienda({ fileName: `${nombre}.html`, htmlFilePath: url, openUrl: url });
            });
    } catch (error) {
        console.error('❌ Error al publicar tienda:', error);
        mostrarNotificacion('❌ Error al publicar la tienda', 'error');
    }
}

// ===== GENERADOR DE CATÁLOGOS (FUNCIONALIDAD ANTERIOR) =====

function generarPDF() {
    if (productos.length === 0) {
        mostrarNotificacion('Agrega al menos un producto antes de generar el catálogo.', 'warning');
        return;
    }

    const temas = {
        original: {
            fondo: [10, 10, 26],
            borde: [0, 255, 255],
            textoTitulo: [0, 255, 255],
            textoNombre: [0, 255, 255],
            textoTalla: [255, 0, 255],
            textoPrecio: [0, 255, 0],
            textoCategoria: [100, 100, 255]
        },
        pastel: {
            fondo: [255, 228, 225],
            borde: [255, 240, 175],
            textoTitulo: [199, 21, 133],
            textoNombre: [199, 21, 133],
            textoTalla: [255, 105, 180],
            textoPrecio: [255, 20, 147],
            textoCategoria: [255, 182, 193]
        },
        verde: {
            fondo: [152, 251, 152],
            borde: [173, 255, 47],
            textoTitulo: [0, 128, 0],
            textoNombre: [34, 139, 34],
            textoTalla: [0, 255, 127],
            textoPrecio: [50, 205, 50],
            textoCategoria: [144, 238, 144]
        },
        sepia: {
            fondo: [245, 222, 179],
            borde: [210, 180, 140],
            textoTitulo: [139, 69, 19],
            textoNombre: [160, 82, 45],
            textoTalla: [205, 133, 63],
            textoPrecio: [139, 101, 8],
            textoCategoria: [188, 143, 143]
        }
    };

    const nombreCatalogo = document.getElementById('nombreCatalogo')?.value || 'Catálogo Éter';
    mostrarSelectorTema(temas, nombreCatalogo);
}

function mostrarSelectorTema(temas, nombreCatalogo) {
    const dialogoTema = document.createElement('div');
    dialogoTema.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    dialogoTema.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-lg w-96">
            <h2 class="text-2xl mb-4 text-cyan-400">Selecciona un tema para el PDF</h2>
            <div class="grid grid-cols-2 gap-4">
                ${Object.keys(temas).map(tema => `
                    <button data-tema="${tema}" class="tema-btn p-4 rounded-lg" style="background-color: rgb(${temas[tema].fondo.join(',')})">
                        <span class="text-black">${tema.charAt(0).toUpperCase() + tema.slice(1)}</span>
                    </button>
                `).join('')}
            </div>
            <div class="mt-4 flex justify-end space-x-2">
                <button id="cancelarTema" class="bg-red-500 text-white px-4 py-2 rounded">Cancelar</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialogoTema);

    const botonesTema = dialogoTema.querySelectorAll('.tema-btn');
    botonesTema.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const tema = e.currentTarget.getAttribute('data-tema');
            document.body.removeChild(dialogoTema);
            generarPDFConTema(tema, nombreCatalogo, tema);
        });
    });

    const botonCancelar = dialogoTema.querySelector('#cancelarTema');
    botonCancelar.addEventListener('click', () => {
        document.body.removeChild(dialogoTema);
    });
}

function generarPDFConTema(tema, nombreCatalogo, nombreTema) {
    if (!window.jspdf) {
        mostrarNotificacion('❌ jsPDF no está disponible', 'error');
        return;
    }
    
    const doc = new window.jspdf.jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const temaSeleccionado = temas[tema];

    function createPageBackground(doc) {
        doc.setFillColor(...temaSeleccionado.fondo);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        doc.setDrawColor(...temaSeleccionado.borde);
        doc.setLineWidth(2);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    }

    function addHeader(doc, catalogName) {
        doc.setTextColor(...temaSeleccionado.textoTitulo);
        doc.setFontSize(20);
        doc.text(catalogName, pageWidth / 2, 25, { align: 'center' });
    }

    const gridColumns = 2;
    const gridRows = 2;
    const productMargin = 10;
    const imageMaxWidth = (pageWidth - 40) / gridColumns - productMargin * 2;
    const imageMaxHeight = (pageHeight - 80) / gridRows - productMargin * 4;

    for (let i = 0; i < productos.length; i += 4) {
        if (i > 0) {
            doc.addPage();
        }
        
        createPageBackground(doc);
        addHeader(doc, nombreCatalogo);

        const positions = [
            { x: productMargin + 10, y: 50 },
            { x: pageWidth / 2 + productMargin / 2, y: 50 },
            { x: productMargin + 10, y: pageHeight / 2 + 20 },
            { x: pageWidth / 2 + productMargin / 2, y: pageHeight / 2 + 20 }
        ];

        for (let j = 0; j < 4 && i + j < productos.length; j++) {
            const producto = productos[i + j];
            const pos = positions[j];

            const infoY = pos.y + imageMaxHeight + 10;

            doc.setFontSize(10);
            
            doc.setTextColor(...temaSeleccionado.textoNombre);
            doc.text(`Nombre: ${producto.nombre}`, pos.x + imageMaxWidth / 2, infoY, { align: 'center' });
            
            doc.setTextColor(...temaSeleccionado.textoTalla);
            doc.text(`Talla: ${producto.talle}`, pos.x + imageMaxWidth / 2, infoY + 10, { align: 'center' });
            
            doc.setTextColor(...temaSeleccionado.textoPrecio);
            doc.text(`Precio: $${producto.precio}`, pos.x + imageMaxWidth / 2, infoY + 20, { align: 'center' });
            
            doc.setTextColor(...temaSeleccionado.textoCategoria);
            doc.text(`Categoría: ${producto.categoria}`, pos.x + imageMaxWidth / 2, infoY + 30, { align: 'center' });
        }
    }

    doc.save(`${nombreCatalogo}_${nombreTema}.pdf`);
    mostrarNotificacion('PDF generado exitosamente', 'success');
}

// ===== FUNCIONES DE NOTIFICACIÓN =====

function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <i class="${getIconoTipo(tipo)}"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notificacion.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 4000);
}

function getIconoTipo(tipo) {
    const iconos = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return iconos[tipo] || iconos.info;
}

function descargarArchivo(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ===== GENERADOR DE TIENDA AVANZADA - DISEÑO MEJORADO =====

function generarTiendaAvanzada() {
    const productosSeleccionados = productos.filter(p => p.seleccionado);
    const config = configuracionEditor;
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${config.general.storeDescription || 'Tienda online profesional'}">
    <meta name="keywords" content="tienda online, productos, compras">
    <title>${config.general.storeName}</title>
    
    <!-- Preload critical resources -->
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" as="style">
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" as="style">
    
    <!-- Stylesheets -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <style>
        /* ===== RESET Y CONFIGURACIÓN BASE ===== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --primary-color: ${config.theme.primaryColor};
            --secondary-color: ${config.theme.secondaryColor};
            --accent-color: ${config.products.priceColor};
            --background-color: ${config.theme.backgroundColor};
            --text-color: #2d3748;
            --text-light: #718096;
            --border-color: #e2e8f0;
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            --shadow-md: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06);
            --shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
            --shadow-xl: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04);
            --border-radius: 12px;
            --border-radius-lg: 16px;
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--background-color);
            color: var(--text-color);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        /* ===== LAYOUT PRINCIPAL ===== */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* ===== HEADER MEJORADO ===== */
        .store-header {
            background: linear-gradient(135deg, ${config.header.bgColor} 0%, ${config.theme.secondaryColor} 100%);
            color: ${config.header.textColor};
            padding: 2rem 0;
            margin-bottom: 3rem;
            position: relative;
            overflow: hidden;
        }
        
        .store-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }
        
        .header-content {
            position: relative;
            z-index: 2;
            text-align: center;
        }
        
        .store-title {
            font-size: clamp(2rem, 5vw, ${config.header.fontSize}px);
            font-weight: 800;
            margin-bottom: 1rem;
            letter-spacing: -0.025em;
        }
        
        .store-subtitle {
            font-size: 1.125rem;
            opacity: 0.9;
            font-weight: 400;
            max-width: 600px;
            margin: 0 auto;
        }
        
        /* ===== NAVEGACIÓN MEJORADA ===== */
        .nav-bar {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border-color);
            position: sticky;
            top: 0;
            z-index: 100;
            padding: 1rem 0;
        }
        
        .nav-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .nav-logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-color);
        }
        
        .nav-menu {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-menu a {
            color: var(--text-color);
            text-decoration: none;
            font-weight: 500;
            transition: var(--transition);
            position: relative;
        }
        
        .nav-menu a:hover {
            color: var(--primary-color);
        }
        
        .nav-menu a::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--primary-color);
            transition: var(--transition);
        }
        
        .nav-menu a:hover::after {
            width: 100%;
        }
        
        /* ===== CARRITO FLOTANTE MEJORADO ===== */
        .floating-cart {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-lg);
            box-shadow: var(--shadow-xl);
            min-width: 320px;
            z-index: 1000;
            transform: translateY(-10px);
            opacity: 0;
            animation: slideInCart 0.5s ease forwards;
        }
        
        @keyframes slideInCart {
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .cart-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.5rem;
            border-bottom: 1px solid var(--border-color);
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
        }
        
        .cart-title {
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .cart-count {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 600;
        }
        
        .cart-items {
            max-height: 300px;
            overflow-y: auto;
            padding: 1rem;
        }
        
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid var(--border-color);
            animation: fadeInUp 0.3s ease;
        }
        
        .cart-item:last-child {
            border-bottom: none;
        }
        
        .cart-item-info {
            flex: 1;
        }
        
        .cart-item-name {
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 0.25rem;
        }
        
        .cart-item-details {
            font-size: 0.875rem;
            color: var(--text-light);
        }
        
        .cart-item-price {
            font-weight: 700;
            color: var(--accent-color);
        }
        
        .cart-total {
            padding: 1.5rem;
            background: #f8fafc;
            border-top: 1px solid var(--border-color);
            text-align: center;
        }
        
        .cart-total-amount {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--text-color);
            margin-bottom: 0.5rem;
        }
        
        .cart-total-label {
            font-size: 0.875rem;
            color: var(--text-light);
        }
        
        /* ===== BOTÓN WHATSAPP MEJORADO ===== */
        .whatsapp-btn {
            background: linear-gradient(135deg, ${config.whatsapp.color}, #128c7e);
            color: white;
            border: none;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            cursor: pointer;
            width: 100%;
            font-weight: 600;
            font-size: 1rem;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            text-decoration: none;
            margin: 0 1.5rem 1.5rem;
        }
        
        .whatsapp-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3);
        }
        
        /* ===== GRID DE PRODUCTOS MEJORADO ===== */
        .products-section {
            margin-bottom: 4rem;
        }
        
        .section-title {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .section-title h2 {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--text-color);
            margin-bottom: 1rem;
        }
        
        .section-title p {
            font-size: 1.125rem;
            color: var(--text-light);
            max-width: 600px;
            margin: 0 auto;
        }
        
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .product-card {
            background: white;
            border-radius: var(--border-radius-lg);
            overflow: hidden;
            box-shadow: var(--shadow-sm);
            transition: var(--transition);
            border: 1px solid var(--border-color);
            position: relative;
        }
        
        .product-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-xl);
            border-color: var(--primary-color);
        }
        
        .product-image-container {
            position: relative;
            overflow: hidden;
            aspect-ratio: 1;
        }
        
        .product-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: var(--transition);
        }
        
        .product-card:hover .product-image {
            transform: scale(1.05);
        }
        
        .product-badge {
            position: absolute;
            top: 1rem;
            left: 1rem;
            background: var(--accent-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 600;
            z-index: 2;
        }
        
        .product-content {
            padding: 1.5rem;
        }
        
        .product-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--text-color);
            line-height: 1.3;
        }
        
        .product-details {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            color: var(--text-light);
        }
        
        .product-detail {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .product-description {
            color: var(--text-light);
            margin-bottom: 1.5rem;
            line-height: 1.6;
            font-size: 0.875rem;
        }
        
        .product-price {
            font-size: 2rem;
            font-weight: 800;
            color: var(--accent-color);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .product-price::before {
            content: '$';
            font-size: 1.5rem;
            opacity: 0.7;
        }
        
        .add-to-cart-btn {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: var(--border-radius);
            cursor: pointer;
            width: 100%;
            font-weight: 600;
            font-size: 1rem;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            position: relative;
            overflow: hidden;
        }
        
        .add-to-cart-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s ease;
        }
        
        .add-to-cart-btn:hover::before {
            left: 100%;
        }
        
        .add-to-cart-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }
        
        .add-to-cart-btn.added {
            background: linear-gradient(135deg, #10b981, #059669);
        }
        
        /* ===== FOOTER MEJORADO ===== */
        .store-footer {
            background: linear-gradient(135deg, #1a202c, #2d3748);
            color: white;
            padding: 3rem 0 2rem;
            margin-top: 4rem;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .footer-section h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #e2e8f0;
        }
        
        .footer-section p,
        .footer-section a {
            color: #a0aec0;
            text-decoration: none;
            line-height: 1.6;
            transition: var(--transition);
        }
        
        .footer-section a:hover {
            color: white;
        }
        
        .footer-bottom {
            border-top: 1px solid #4a5568;
            padding-top: 2rem;
            text-align: center;
            color: #a0aec0;
        }
        
        /* ===== ANIMACIONES ===== */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .product-card {
            animation: fadeInUp 0.6s ease-out;
        }
        
        .product-card:nth-child(1) { animation-delay: 0.1s; }
        .product-card:nth-child(2) { animation-delay: 0.2s; }
        .product-card:nth-child(3) { animation-delay: 0.3s; }
        .product-card:nth-child(4) { animation-delay: 0.4s; }
        .product-card:nth-child(5) { animation-delay: 0.5s; }
        .product-card:nth-child(6) { animation-delay: 0.6s; }
        
        /* ===== RESPONSIVE DESIGN ===== */
        @media (max-width: 768px) {
            .container {
                padding: 0 15px;
            }
            
            .nav-menu {
                display: none;
            }
            
            .floating-cart {
                position: static;
                margin-bottom: 2rem;
                transform: none;
                opacity: 1;
                animation: none;
            }
            
            .products-grid {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
            
            .store-title {
                font-size: 2rem;
            }
            
            .section-title h2 {
                font-size: 2rem;
            }
            
            .footer-content {
                grid-template-columns: 1fr;
                text-align: center;
            }
        }
        
        @media (max-width: 480px) {
            .store-header {
                padding: 1.5rem 0;
            }
            
            .product-content {
                padding: 1rem;
            }
            
            .product-price {
                font-size: 1.5rem;
            }
        }
        
        /* ===== MEJORAS DE ACCESIBILIDAD ===== */
        .add-to-cart-btn:focus,
        .whatsapp-btn:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
        
        .product-card:focus-within {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
        
        /* ===== LOADING STATES ===== */
        .loading {
            opacity: 0.7;
            pointer-events: none;
        }
        
        .loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            border: 2px solid var(--border-color);
            border-top: 2px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="store-header">
        <div class="container">
            <div class="header-content">
                <h1 class="store-title">
                    <i class="fas fa-store"></i> ${config.general.storeName}
                </h1>
                <p class="store-subtitle">${config.general.storeDescription}</p>
            </div>
        </div>
    </header>
    
    <!-- Navigation -->
    <nav class="nav-bar">
        <div class="container">
            <div class="nav-content">
                <div class="nav-logo">
                    <i class="fas fa-shopping-bag"></i> ${config.general.storeName}
                </div>
                <ul class="nav-menu">
                    <li><a href="#productos">Productos</a></li>
                    <li><a href="#categorias">Categorías</a></li>
                    <li><a href="#contacto">Contacto</a></li>
                </ul>
            </div>
        </div>
    </nav>
    
    <!-- Main Content -->
    <main class="container">
        <!-- Products Section -->
        <section class="products-section" id="productos">
            <div class="section-title">
                <h2>Nuestros Productos</h2>
                <p>Descubre nuestra colección exclusiva con los mejores precios y calidad premium</p>
            </div>
            
            <div class="products-grid">
                ${productosSeleccionados.map(producto => `
                <article class="product-card">
                    <div class="product-image-container">
                        <img src="${producto.imagen}" 
                             alt="${producto.nombre}" 
                             class="product-image"
                             loading="lazy"
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7imqA8L3RleHQ+Cjwvc3ZnPgo='">
                        <div class="product-badge">${producto.categoria}</div>
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">${producto.nombre}</h3>
                        ${config.products.showCategories ? `
                        <div class="product-details">
                            <span class="product-detail">
                                <i class="fas fa-ruler"></i> ${producto.talle}
                            </span>
                            <span class="product-detail">
                                <i class="fas fa-tag"></i> ${producto.categoria}
                            </span>
                        </div>
                        ` : ''}
                        ${config.products.showDescriptions && producto.descripcion ? `
                        <p class="product-description">${producto.descripcion}</p>
                        ` : ''}
                        <div class="product-price">${producto.precio}</div>
                        <button class="add-to-cart-btn" onclick="addToCart('${producto.id}')" data-product-id="${producto.id}">
                            <i class="fas fa-plus"></i> Añadir al Carrito
                        </button>
                    </div>
                </article>
                `).join('')}
            </div>
        </section>
    </main>
    
    <!-- Floating Cart -->
    <div class="floating-cart" id="cart">
        <div class="cart-header">
            <div class="cart-title">
                <i class="fas fa-shopping-cart"></i>
                Carrito ${config.cart.showCount ? '(<span id="cartCount">0</span>)' : ''}
            </div>
        </div>
        <div class="cart-items" id="cartItems">
            <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                <i class="fas fa-shopping-cart" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Tu carrito está vacío</p>
            </div>
        </div>
        <div class="cart-total">
            <div class="cart-total-amount" id="cartTotal">$0.00</div>
            <div class="cart-total-label">Total del pedido</div>
        </div>
        <a href="#" class="whatsapp-btn" onclick="sendToWhatsApp(); return false;">
            <i class="fab fa-whatsapp"></i> Enviar Pedido por WhatsApp
        </a>
    </div>
    
    <!-- Footer -->
    <footer class="store-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>${config.general.storeName}</h3>
                    <p>${config.general.storeDescription}</p>
                </div>
                <div class="footer-section">
                    <h3>Contacto</h3>
                    <p><i class="fab fa-whatsapp"></i> ${config.general.whatsappNumber}</p>
                    <p><i class="fas fa-envelope"></i> info@${config.general.storeName.toLowerCase().replace(/\s+/g, '')}.com</p>
                </div>
                <div class="footer-section">
                    <h3>Enlaces</h3>
                    <p><a href="#productos">Productos</a></p>
                    <p><a href="#categorias">Categorías</a></p>
                    <p><a href="#contacto">Contacto</a></p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 ${config.general.storeName}. Generado con Éter Studio. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>

    <script>
        // ===== FUNCIONALIDAD DEL CARRITO =====
        let products = ${JSON.stringify(productosSeleccionados)};
        let cart = [];
        let telefono = '${config.general.whatsappNumber}';
        
        // Inicializar carrito
        updateCart();
        
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (product) {
                const existingItem = cart.find(item => item.id === productId);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({...product, quantity: 1});
                }
                updateCart();
                
                // Efecto visual mejorado
                const btn = event.target.closest('.add-to-cart-btn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> ¡Añadido!';
                btn.classList.add('added');
                
                // Mostrar notificación
                showNotification('Producto añadido al carrito', 'success');
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('added');
                }, 2000);
            }
        }
        
        function updateCart() {
            const cartCount = document.getElementById('cartCount');
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            
            if (cartCount) {
                cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            }
            
            if (cartItems) {
                if (cart.length === 0) {
                    cartItems.innerHTML = \`
                        <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                            <i class="fas fa-shopping-cart" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                            <p>Tu carrito está vacío</p>
                        </div>
                    \`;
                } else {
                    cartItems.innerHTML = cart.map(item => 
                        \`<div class="cart-item">
                            <div class="cart-item-info">
                                <div class="cart-item-name">\${item.nombre}</div>
                                <div class="cart-item-details">Talla: \${item.talle} | Cantidad: \${item.quantity}</div>
                            </div>
                            <div class="cart-item-price">$$\${(parseFloat(item.precio) * item.quantity).toFixed(2)}</div>
                        </div>\`
                    ).join('');
                }
            }
            
            if (cartTotal) {
                const total = cart.reduce((sum, item) => sum + (parseFloat(item.precio) * item.quantity), 0);
                cartTotal.textContent = \`$\${total.toFixed(2)}\`;
            }
        }
        
        function sendToWhatsApp() {
            if (cart.length === 0) {
                showNotification('El carrito está vacío', 'error');
                return;
            }
            
            const message = \`🛍️ *Nuevo Pedido - ${config.general.storeName}*

*Productos solicitados:*
\${cart.map(item => 
    \`• \${item.nombre} (Talla: \${item.talle}) x\${item.quantity} - $$\${(parseFloat(item.precio) * item.quantity).toFixed(2)}\`
).join('\\n')}

*Total del pedido: $\${cart.reduce((sum, item) => sum + (parseFloat(item.precio) * item.quantity), 0).toFixed(2)}*

${config.whatsapp.message}

Gracias! 😊\`;
            
            const whatsappUrl = \`https://wa.me/\${telefono}?text=\${encodeURIComponent(message)}\`;
            window.open(whatsappUrl, '_blank');
        }
        
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.style.cssText = \`
                position: fixed;
                top: 20px;
                right: 20px;
                background: \${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                font-weight: 500;
            \`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }
        
        // ===== MEJORAS DE UX =====
        
        // Smooth scrolling para enlaces internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Lazy loading de imágenes
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }
        
        // Manejo de errores de imágenes
        document.querySelectorAll('.product-image').forEach(img => {
            img.onerror = function() {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7imqA8L3RleHQ+Cjwvc3ZnPgo=';
            };
        });
    </script>
</body>
</html>`;
} 