// Variables globales
let productos = [];
let catalogosGuardados = JSON.parse(localStorage.getItem('catalogosEter')) || [];
let configuracionDiseño = JSON.parse(localStorage.getItem('configuracionDiseñoEter')) || {
    header: {
        texto: 'Catálogo Éter',
        color: [34, 34, 34],
        tamaño: 24,
        negrita: true
    },
    footer: {
        texto: 'Generado con Éter Generador de Catálogos',
        color: [128, 128, 128],
        tamaño: 10,
        negrita: false
    },
    logo: null
};

// Configuración por defecto del editor de tiendas
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

// Productos de ejemplo predefinidos
const productosEjemplo = [
    {
        id: 'prod_1',
        nombre: 'Camiseta Vintage Éter',
        precio: '29.99',
        talle: 'M',
        categoria: 'Ropa',
        descripcion: 'Camiseta de algodón premium con diseño vintage único. Perfecta para cualquier ocasión.',
        imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        seleccionado: true
    },
    {
        id: 'prod_2',
        nombre: 'Jeans Slim Fit Premium',
        precio: '79.99',
        talle: 'L',
        categoria: 'Ropa',
        descripcion: 'Jeans de alta calidad con corte slim fit. Comodidad y estilo en una sola prenda.',
        imagen: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
        seleccionado: true
    },
    {
        id: 'prod_3',
        nombre: 'Sneakers Urban Éter',
        precio: '89.99',
        talle: '42',
        categoria: 'Calzado',
        descripcion: 'Sneakers urbanos con tecnología de amortiguación avanzada. Ideales para el día a día.',
        imagen: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
        seleccionado: true
    },
    {
        id: 'prod_4',
        nombre: 'Reloj Smart Éter Pro',
        precio: '199.99',
        talle: 'Único',
        categoria: 'Accesorios',
        descripcion: 'Reloj inteligente con funciones avanzadas de monitoreo de salud y conectividad.',
        imagen: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        seleccionado: true
    },
    {
        id: 'prod_5',
        nombre: 'Mochila Laptop Éter',
        precio: '59.99',
        talle: 'Único',
        categoria: 'Accesorios',
        descripcion: 'Mochila elegante con compartimento especial para laptop y múltiples bolsillos.',
        imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        seleccionado: true
    },
    {
        id: 'prod_6',
        nombre: 'Gafas de Sol Éter',
        precio: '129.99',
        talle: 'Único',
        categoria: 'Accesorios',
        descripcion: 'Gafas de sol premium con protección UV y diseño moderno. Perfectas para cualquier look.',
        imagen: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        seleccionado: true
    }
];

// Inicializar jsPDF cuando esté disponible
let jsPDF;
if (window.jspdf) {
    jsPDF = window.jspdf.jsPDF;
}



// Inicialización del editor
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Éter Studio...');
    
    // Cargar productos de ejemplo
    productos.length = 0;
    productos.push(...productosEjemplo);
    
    // Inicializar navegación de configuración
    inicializarNavegacionConfig();
    
    // Inicializar controles de vista
    inicializarControlesVista();
    
    // Generar vista previa inicial
    actualizarTiendaEnTiempoReal();
    
    // Actualizar contadores
    actualizarContadores();
    
    console.log('✅ Éter Studio iniciado correctamente');
});

// ===== FUNCIONES DE NAVEGACIÓN =====

function inicializarNavegacionConfig() {
    const navItems = document.querySelectorAll('.nav-item');
    const configSections = document.querySelectorAll('.config-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            
            // Remover activo de todos los elementos
            navItems.forEach(nav => nav.classList.remove('active'));
            configSections.forEach(section => section.classList.remove('active'));
            
            // Activar elemento seleccionado
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

function aplicarVistaResponsive(view, frame) {
    const views = {
        desktop: { width: '100%', height: '100%' },
        tablet: { width: '768px', height: '1024px' },
        mobile: { width: '375px', height: '667px' }
    };
    
    const config = views[view];
    frame.style.width = config.width;
    frame.style.height = config.height;
    frame.style.margin = view === 'desktop' ? '0' : '0 auto';
    frame.style.border = view === 'desktop' ? 'none' : '2px solid var(--border-primary)';
}

// ===== FUNCIONES DE CONFIGURACIÓN =====

function actualizarTiendaEnTiempoReal() {
    console.log('🔄 Actualizando tienda en tiempo real...');
    
    // Recopilar configuración actual
    recopilarConfiguracion();
    
    // Generar HTML de la tienda
    const htmlContent = generarTiendaAvanzada();
    
    // Mostrar en el frame
    mostrarTiendaEnFrame(htmlContent);
    
    // Actualizar contadores
    actualizarContadores();
    
    // Actualizar timestamp
    document.getElementById('lastUpdate').textContent = 'Ahora';
    
    console.log('✅ Tienda actualizada');
}

function recopilarConfiguracion() {
    configuracionEditor = {
        general: {
            storeName: document.getElementById('storeName').value,
            storeDescription: document.getElementById('storeDescription').value,
            storeLogo: document.getElementById('storeLogo').value,
            whatsappNumber: document.getElementById('whatsappNumber').value
        },
        header: {
            bgColor: document.getElementById('headerBgColor').value,
            textColor: document.getElementById('headerTextColor').value,
            fontSize: parseInt(document.getElementById('headerFontSize').value),
            showLogo: document.getElementById('showLogo').checked
        },
        products: {
            columns: parseInt(document.getElementById('productColumns').value),
            spacing: parseInt(document.getElementById('productSpacing').value),
            priceColor: document.getElementById('priceColor').value,
            showCategories: document.getElementById('showCategories').checked,
            showDescriptions: document.getElementById('showDescriptions').checked
        },
        cart: {
            position: document.getElementById('cartPosition').value,
            color: document.getElementById('cartColor').value,
            showCount: document.getElementById('showCartCount').checked,
            autoHide: document.getElementById('autoHideCart').checked
        },
        theme: {
            preset: document.querySelector('.theme-preset.active').dataset.theme,
            primaryColor: document.getElementById('primaryColor').value,
            secondaryColor: document.getElementById('secondaryColor').value,
            backgroundColor: document.getElementById('backgroundColor').value
        },
        whatsapp: {
            message: document.getElementById('whatsappMessage').value,
            showNumber: document.getElementById('showWhatsappNumber').checked,
            color: document.getElementById('whatsappColor').value
        }
    };
}

function cambiarTema(tema) {
    console.log('🎨 Cambiando tema a:', tema);
    
    // Remover activo de todos los presets
    document.querySelectorAll('.theme-preset').forEach(preset => {
        preset.classList.remove('active');
    });
    
    // Activar preset seleccionado
    document.querySelector(`[data-theme="${tema}"]`).classList.add('active');
    
    // Aplicar configuración del tema
    const temas = {
        modern: {
            primaryColor: '#667eea',
            secondaryColor: '#764ba2',
            backgroundColor: '#f8f9fa'
        },
        elegant: {
            primaryColor: '#2c3e50',
            secondaryColor: '#34495e',
            backgroundColor: '#ecf0f1'
        },
        minimal: {
            primaryColor: '#6c757d',
            secondaryColor: '#495057',
            backgroundColor: '#ffffff'
        },
        colorful: {
            primaryColor: '#ff6b6b',
            secondaryColor: '#4ecdc4',
            backgroundColor: '#f8f9fa'
        }
    };
    
    const config = temas[tema];
    document.getElementById('primaryColor').value = config.primaryColor;
    document.getElementById('primaryColor').value = config.secondaryColor;
    document.getElementById('backgroundColor').value = config.backgroundColor;
    
    // Actualizar tienda
    actualizarTiendaEnTiempoReal();
}

// ===== FUNCIONES DE VISTA PREVIA =====

function mostrarTiendaEnFrame(htmlContent) {
    const frame = document.getElementById('previewFrame');
    if (!frame) {
        console.error('Frame de vista previa no encontrado');
        return;
    }
    
    // Crear un iframe para mostrar la tienda
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
    document.getElementById('productCount').textContent = productosSeleccionados.length;
    
    // Calcular uso de memoria simulado
    const memoryUsage = (Math.random() * 2 + 1.5).toFixed(1);
    document.getElementById('memoryUsage').textContent = memoryUsage + ' MB';
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
        // Obtener productos actuales
        const productosActuales = productos.filter(p => p.seleccionado);
        
        if (productosActuales.length === 0) {
            mostrarNotificacion('⚠️ No hay productos seleccionados para publicar', 'warning');
            return;
        }
        
        // Obtener configuración actual
        const configuracionActual = {
            header: {
                texto: configuracionDiseño.header?.texto || 'Catálogo Éter'
            },
            productos: {
                mostrarDescripcion: true,
                mostrarCategoria: true,
                precioColor: '#00aa00'
            },
            whatsapp: {
                numero: '+34612345678' // Puedes hacer esto configurable
            }
        };
        
        // Usar la nueva función de publicación con enlace
        publicarTiendaConEnlace(
            configuracionActual.header.texto,
            productosActuales,
            configuracionActual
        );
        
    } catch (error) {
        console.error('❌ Error al publicar tienda:', error);
        mostrarNotificacion('❌ Error al publicar la tienda', 'error');
    }
}

// Configurar navegación por pestañas
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remover clase active de todos los botones y paneles
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Agregar clase active al botón clickeado y su panel correspondiente
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Actualizar vista previa si es necesario
            if (targetTab === 'vista-previa') {
                actualizarVistaPreviaCompleta();
            }
        });
    });
}

// Configurar drag and drop
function setupDragAndDrop() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    if (!fileUploadArea) return;

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        fileUploadArea.classList.add('drag-over');
    }

    function unhighlight(e) {
        fileUploadArea.classList.remove('drag-over');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        document.getElementById('imagenesProducto').files = files;
        previewImages({ target: { files: files } });
    }

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, unhighlight, false);
    });

    fileUploadArea.addEventListener('drop', handleDrop, false);
}

// Cargar productos guardados
function cargarProductosGuardados() {
    try {
        const productosGuardados = localStorage.getItem('productosEter');
        if (productosGuardados) {
            productos = JSON.parse(productosGuardados);
            
            // Limpiar productos con IDs problemáticos
            productos = productos.filter(producto => {
                if (!producto.id || typeof producto.id !== 'string') {
                    console.warn('Producto con ID inválido encontrado:', producto);
                    return false;
                }
                return true;
            });
            
            // Regenerar IDs si es necesario
            productos.forEach(producto => {
                if (!producto.id.startsWith('prod_')) {
                    producto.id = 'prod_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
                    console.log('ID regenerado para:', producto.nombre, '->', producto.id);
                }
            });
            
            actualizarListaProductos();
            console.log('Productos cargados:', productos.length);
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarNotificacion('Error al cargar productos guardados', 'error');
    }
}

// Cargar configuración de diseño
function cargarConfiguracionDiseño() {
    try {
        const configGuardada = localStorage.getItem('configuracionDiseñoEter');
        if (configGuardada) {
            configuracionDiseño = JSON.parse(configGuardada);
            aplicarConfiguracionDiseño();
        }
    } catch (error) {
        console.error('Error al cargar configuración de diseño:', error);
    }
}

// Aplicar configuración de diseño a los controles
function aplicarConfiguracionDiseño() {
    const headerTexto = document.getElementById('headerTexto');
    const headerTamaño = document.getElementById('headerTamaño');
    const headerTamañoValor = document.getElementById('headerTamañoValor');
    const headerColor = document.getElementById('headerColor');
    const headerNegrita = document.getElementById('headerNegrita');
    const headerCursiva = document.getElementById('headerCursiva');
    const headerFont = document.getElementById('headerFont');
    
    const footerTexto = document.getElementById('footerTexto');
    const footerTamaño = document.getElementById('footerTamaño');
    const footerTamañoValor = document.getElementById('footerTamañoValor');
    const footerColor = document.getElementById('footerColor');
    const footerNegrita = document.getElementById('footerNegrita');
    const footerCursiva = document.getElementById('footerCursiva');
    const footerFont = document.getElementById('footerFont');
    
    const productosColumnas = document.getElementById('productosColumnas');
    const productosColumnasValor = document.getElementById('productosColumnasValor');
    const productosEspaciado = document.getElementById('productosEspaciado');
    const productosEspaciadoValor = document.getElementById('productosEspaciadoValor');
    const precioColor = document.getElementById('precioColor');
    const mostrarDescripcion = document.getElementById('mostrarDescripcion');
    const mostrarCategoria = document.getElementById('mostrarCategoria');
    
    // Aplicar configuración de header
    if (headerTexto) headerTexto.value = configuracionDiseño.header.texto;
    if (headerTamaño) headerTamaño.value = configuracionDiseño.header.tamaño;
    if (headerTamañoValor) headerTamañoValor.textContent = configuracionDiseño.header.tamaño + 'px';
    if (headerColor) headerColor.value = rgbToHex(configuracionDiseño.header.color);
    if (headerNegrita) headerNegrita.checked = configuracionDiseño.header.negrita;
    if (headerCursiva) headerCursiva.checked = configuracionDiseño.header.cursiva || false;
    if (headerFont) headerFont.value = configuracionDiseño.header.font || 'Arial, sans-serif';
    
    // Aplicar configuración de footer
    if (footerTexto) footerTexto.value = configuracionDiseño.footer.texto;
    if (footerTamaño) footerTamaño.value = configuracionDiseño.footer.tamaño;
    if (footerTamañoValor) footerTamañoValor.textContent = configuracionDiseño.footer.tamaño + 'px';
    if (footerColor) footerColor.value = rgbToHex(configuracionDiseño.footer.color);
    if (footerNegrita) footerNegrita.checked = configuracionDiseño.footer.negrita;
    if (footerCursiva) footerCursiva.checked = configuracionDiseño.footer.cursiva || false;
    if (footerFont) footerFont.value = configuracionDiseño.footer.font || 'Arial, sans-serif';
    
    // Aplicar configuración de productos
    if (productosColumnas) productosColumnas.value = configuracionDiseño.productos?.columnas || 2;
    if (productosColumnasValor) productosColumnasValor.textContent = configuracionDiseño.productos?.columnas || 2;
    if (productosEspaciado) productosEspaciado.value = configuracionDiseño.productos?.espaciado || 15;
    if (productosEspaciadoValor) productosEspaciadoValor.textContent = (configuracionDiseño.productos?.espaciado || 15) + 'px';
    if (precioColor) precioColor.value = rgbToHex(configuracionDiseño.productos?.precioColor || [0, 170, 0]);
    if (mostrarDescripcion) mostrarDescripcion.checked = configuracionDiseño.productos?.mostrarDescripcion !== false;
    if (mostrarCategoria) mostrarCategoria.checked = configuracionDiseño.productos?.mostrarCategoria !== false;
    
    // Aplicar tema y layout
    if (configuracionDiseño.tema) {
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(opt => opt.classList.remove('active'));
        const activeTheme = document.querySelector(`[data-theme="${configuracionDiseño.tema}"]`);
        if (activeTheme) activeTheme.classList.add('active');
    }
    
    if (configuracionDiseño.layout) {
        const layoutOptions = document.querySelectorAll('.layout-option');
        layoutOptions.forEach(opt => opt.classList.remove('active'));
        const activeLayout = document.querySelector(`[data-layout="${configuracionDiseño.layout}"]`);
        if (activeLayout) activeLayout.classList.add('active');
    }
    
    // Aplicar logo
    if (configuracionDiseño.logo) {
        const logoPreview = document.getElementById('logoPreview');
        if (logoPreview) {
            logoPreview.innerHTML = '<img src="' + configuracionDiseño.logo + '" alt="Logo">';
        }
    }
}

// Configurar eventos del diseñador
function configurarEventosDiseñador() {
    const headerTexto = document.getElementById('headerTexto');
    const headerTamaño = document.getElementById('headerTamaño');
    const headerTamañoValor = document.getElementById('headerTamañoValor');
    const headerColor = document.getElementById('headerColor');
    const headerNegrita = document.getElementById('headerNegrita');
    const headerCursiva = document.getElementById('headerCursiva');
    const headerFont = document.getElementById('headerFont');
    
    const footerTexto = document.getElementById('footerTexto');
    const footerTamaño = document.getElementById('footerTamaño');
    const footerTamañoValor = document.getElementById('footerTamañoValor');
    const footerColor = document.getElementById('footerColor');
    const footerNegrita = document.getElementById('footerNegrita');
    const footerCursiva = document.getElementById('footerCursiva');
    const footerFont = document.getElementById('footerFont');
    
    const productosColumnas = document.getElementById('productosColumnas');
    const productosColumnasValor = document.getElementById('productosColumnasValor');
    const productosEspaciado = document.getElementById('productosEspaciado');
    const productosEspaciadoValor = document.getElementById('productosEspaciadoValor');
    const precioColor = document.getElementById('precioColor');
    const mostrarDescripcion = document.getElementById('mostrarDescripcion');
    const mostrarCategoria = document.getElementById('mostrarCategoria');
    
    const logoInput = document.getElementById('logoInput');
    
    if (headerTexto) headerTexto.addEventListener('input', actualizarVistaPrevia);
    if (headerTamaño) {
        headerTamaño.addEventListener('input', function(e) {
            if (headerTamañoValor) headerTamañoValor.textContent = e.target.value + 'px';
            actualizarVistaPrevia();
        });
    }
    if (headerColor) headerColor.addEventListener('input', actualizarVistaPrevia);
    if (headerNegrita) headerNegrita.addEventListener('change', actualizarVistaPrevia);
    if (headerCursiva) headerCursiva.addEventListener('change', actualizarVistaPrevia);
    if (headerFont) headerFont.addEventListener('change', actualizarVistaPrevia);
    
    if (footerTexto) footerTexto.addEventListener('input', actualizarVistaPrevia);
    if (footerTamaño) {
        footerTamaño.addEventListener('input', function(e) {
            if (footerTamañoValor) footerTamañoValor.textContent = e.target.value + 'px';
            actualizarVistaPrevia();
        });
    }
    if (footerColor) footerColor.addEventListener('input', actualizarVistaPrevia);
    if (footerNegrita) footerNegrita.addEventListener('change', actualizarVistaPrevia);
    if (footerCursiva) footerCursiva.addEventListener('change', actualizarVistaPrevia);
    if (footerFont) footerFont.addEventListener('change', actualizarVistaPrevia);
    
    if (productosColumnas) {
        productosColumnas.addEventListener('input', function(e) {
            if (productosColumnasValor) productosColumnasValor.textContent = e.target.value;
            actualizarVistaPrevia();
        });
    }
    if (productosEspaciado) {
        productosEspaciado.addEventListener('input', function(e) {
            if (productosEspaciadoValor) productosEspaciadoValor.textContent = e.target.value + 'px';
            actualizarVistaPrevia();
        });
    }
    if (precioColor) precioColor.addEventListener('input', actualizarVistaPrevia);
    if (mostrarDescripcion) mostrarDescripcion.addEventListener('change', actualizarVistaPrevia);
    if (mostrarCategoria) mostrarCategoria.addEventListener('change', actualizarVistaPrevia);
    
    if (logoInput) logoInput.addEventListener('change', cargarLogo);
    
    // Configurar selectores de tema y layout
    configurarSelectoresTemaLayout();
}

// Guardar productos en localStorage
function guardarProductosEnLocalStorage() {
    try {
        const productosComprimidos = productos.map(producto => ({
            id: producto.id,
            nombre: producto.nombre,
            talle: producto.talle,
            precio: producto.precio,
            categoria: producto.categoria,
            descripcion: producto.descripcion || '',
            imagen: producto.imagen,
            seleccionado: producto.seleccionado
        }));
        
        localStorage.setItem('productosEter', JSON.stringify(productosComprimidos));
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            mostrarNotificacion('Error: El almacenamiento está lleno. Limpiando datos antiguos...', 'warning');
            limpiarAlmacenamientoAntiguo();
            setTimeout(() => {
                try {
                    localStorage.setItem('productosEter', JSON.stringify(productosComprimidos));
                    mostrarNotificacion('Productos guardados después de limpiar', 'success');
                } catch (retryError) {
                    mostrarNotificacion('Error persistente. Limpia manualmente algunos catálogos.', 'error');
                }
            }, 1000);
        } else {
            mostrarNotificacion('Error al guardar productos: ' + error.message, 'error');
        }
    }
}

// Limpiar almacenamiento antiguo
function limpiarAlmacenamientoAntiguo() {
    try {
        const catalogosGuardados = JSON.parse(localStorage.getItem('catalogosEter')) || [];
        if (catalogosGuardados.length > 3) {
            const catalogosOrdenados = catalogosGuardados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            const catalogosAMantener = catalogosOrdenados.slice(0, 3);
            localStorage.setItem('catalogosEter', JSON.stringify(catalogosAMantener));
            mostrarNotificacion('Se limpiaron catálogos antiguos automáticamente', 'warning');
        }
        
        const configDiseño = localStorage.getItem('configuracionDiseñoEter');
        if (configDiseño && configDiseño.length > 10000) {
            localStorage.removeItem('configuracionDiseñoEter');
            mostrarNotificacion('Se limpió la configuración de diseño', 'warning');
        }
    } catch (error) {
        console.error('Error al limpiar almacenamiento:', error);
    }
}

// Preview de imágenes
function previewImages(event) {
    const preview = document.getElementById('imagePreview');
    if (!preview) return;
    
    preview.innerHTML = '';
    Array.from(event.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-img';
            preview.appendChild(img);
        }
        reader.readAsDataURL(file);
    });
}

// Toggle seleccionar todos
function toggleSeleccionarTodos() {
    const checkboxes = document.querySelectorAll('.producto-checkbox');
    const todosMarcados = productos.every(p => p.seleccionado);
    
    productos.forEach((producto, index) => {
        producto.seleccionado = !todosMarcados;
        if (checkboxes[index]) {
            checkboxes[index].checked = !todosMarcados;
        }
    });
}

// Agregar productos
function agregarProductos() {
    const imageInput = document.getElementById('imagenesProducto');
    const archivos = imageInput.files;
    const nombre = document.getElementById('nombreProducto').value.trim();
    const talle = document.getElementById('talleProducto').value.trim();
    const precio = document.getElementById('precioProducto').value;
    const categoria = document.getElementById('categoriaProducto').value;

    if (archivos.length === 0) {
        mostrarNotificacion('Por favor, selecciona al menos una imagen', 'warning');
        return;
    }
    if (!nombre) {
        mostrarNotificacion('Por favor, ingresa un nombre de producto', 'warning');
        return;
    }
    if (!talle) {
        mostrarNotificacion('Por favor, ingresa un talle', 'warning');
        return;
    }
    if (!precio || parseFloat(precio) <= 0) {
        mostrarNotificacion('Por favor, ingresa un precio válido', 'warning');
        return;
    }
    if (!categoria) {
        mostrarNotificacion('Por favor, selecciona una categoría', 'warning');
        return;
    }

    Array.from(archivos).forEach(imagen => {
        const reader = new FileReader();
        reader.onloadend = function() {
            const producto = {
                id: 'prod_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                imagen: reader.result,
                nombre: nombre,
                talle: talle,
                precio: parseFloat(precio).toFixed(2),
                categoria: categoria,
                seleccionado: false,
                descripcion: ''
            };

            productos.push(producto);
            actualizarListaProductos();
            guardarProductosEnLocalStorage();
            
            document.getElementById('imagenesProducto').value = '';
            document.getElementById('imagePreview').innerHTML = '';
        }
        reader.readAsDataURL(imagen);
    });
}

// Editar descripción
function editarDescripcion(id) {
    const producto = productos.find(p => p.id === id);
    const nuevaDescripcion = prompt('Ingrese una descripción para el producto', producto.descripcion || '');
    
    if (nuevaDescripcion !== null) {
        producto.descripcion = nuevaDescripcion;
        actualizarListaProductos();
        guardarProductosEnLocalStorage();
    }
}

// Actualizar lista de productos
function actualizarListaProductos() {
    const listaProductos = document.getElementById('listaProductos');
    const totalProductos = document.getElementById('totalProductos');
    
    if (!listaProductos) return;
    
    listaProductos.innerHTML = '';

    productos.forEach((producto) => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <input 
                type="checkbox" 
                class="producto-checkbox" 
                data-id="${producto.id}"
                ${producto.seleccionado ? 'checked' : ''}
            >
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="product-info">
                <div class="product-name">${producto.nombre}</div>
                <div class="product-details">
                    <span>Talla: ${producto.talle}</span>
                    <span class="product-price">$${producto.precio}</span>
                    <span class="product-category">${producto.categoria}</span>
                </div>
                ${producto.descripcion ? `<div class="product-description">${producto.descripcion}</div>` : ''}
            </div>
            <div class="product-actions">
                <button onclick="editarDescripcion(${producto.id})" class="action-btn" title="Editar descripción">
                    <i class="fas fa-comment"></i>
                </button>
                <button onclick="editarProducto(${producto.id})" class="action-btn" title="Editar producto">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="eliminarProducto(${producto.id})" class="action-btn delete" title="Eliminar producto">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        listaProductos.appendChild(div);
    });

    if (totalProductos) {
        totalProductos.textContent = productos.length;
    }

    // Añadir eventos de checkbox
    document.querySelectorAll('.producto-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const id = e.target.getAttribute('data-id');
            const producto = productos.find(p => p.id == id);
            if (producto) {
                producto.seleccionado = e.target.checked;
                guardarProductosEnLocalStorage();
            }
        });
    });
    
    // Actualizar vistas previas
    actualizarVistaPrevia();
    actualizarVistaPreviaCompleta();
}

// Aumentar precio
function aumentarPrecio() {
    const tipoAumento = prompt('Selecciona el tipo de aumento:\n1. Porcentaje\n2. Monto fijo', '1');
    
    if (tipoAumento === null) return;
    
    let valorAumento;
    if (tipoAumento === '1') {
        valorAumento = parseFloat(prompt('Ingresa el porcentaje de aumento (ej: 10 para 10%):'));
        if (isNaN(valorAumento)) {
            mostrarNotificacion('Porcentaje inválido', 'error');
            return;
        }
    } else if (tipoAumento === '2') {
        valorAumento = parseFloat(prompt('Ingresa el monto fijo a aumentar:'));
        if (isNaN(valorAumento)) {
            mostrarNotificacion('Monto inválido', 'error');
            return;
        }
    } else {
        mostrarNotificacion('Opción inválida', 'error');
        return;
    }

    const productosSeleccionados = productos.filter(p => p.seleccionado);
    
    if (productosSeleccionados.length === 0) {
        mostrarNotificacion('Selecciona al menos un producto', 'warning');
        return;
    }

    productosSeleccionados.forEach(producto => {
        const precioActual = parseFloat(producto.precio);
        
        if (tipoAumento === '1') {
            producto.precio = (precioActual * (1 + valorAumento / 100)).toFixed(2);
        } else {
            producto.precio = (precioActual + valorAumento).toFixed(2);
        }
    });

    actualizarListaProductos();
    guardarProductosEnLocalStorage();
    mostrarNotificacion('Precios actualizados exitosamente', 'success');
}

// Eliminar producto
function eliminarProducto(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        productos = productos.filter(p => p.id !== id);
        actualizarListaProductos();
        guardarProductosEnLocalStorage();
        mostrarNotificacion('Producto eliminado', 'success');
    }
}

// Editar producto
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    const nuevoNombre = prompt('Nuevo nombre del producto', producto.nombre);
    const nuevoTalle = prompt('Nuevo talle', producto.talle);
    const nuevoPrecio = prompt('Nuevo precio', producto.precio);
    const nuevaCategoria = prompt('Nueva categoría', producto.categoria);

    if (nuevoNombre) producto.nombre = nuevoNombre;
    if (nuevoTalle) producto.talle = nuevoTalle;
    if (nuevoPrecio) producto.precio = parseFloat(nuevoPrecio).toFixed(2);
    if (nuevaCategoria) producto.categoria = nuevaCategoria;

    actualizarListaProductos();
    guardarProductosEnLocalStorage();
    mostrarNotificacion('Producto editado', 'success');
}

// Limpiar lista de productos
function limpiarListaProductos() {
    const confirmacion = confirm('¿Estás seguro de que quieres limpiar toda la lista de productos?');
    if (confirmacion) {
        productos = [];
        actualizarListaProductos();
        guardarProductosEnLocalStorage();
        mostrarNotificacion('Lista de productos limpiada', 'success');
    }
}

// Exportar CSV
function exportarCSV() {
    if (productos.length === 0) {
        mostrarNotificacion('No hay productos para exportar', 'warning');
        return;
    }

    const nombreCatalogo = document.getElementById('nombreCatalogo')?.value || 'catalogo_eter';
    
    let csvContent = "Nombre,Talla,Precio,Categoría,Descripción\n";
    
    productos.forEach(producto => {
        csvContent += `"${producto.nombre}","${producto.talle}","${producto.precio}","${producto.categoria}","${producto.descripcion || ''}"\n`;
    });
    
    descargarArchivo(csvContent, `${nombreCatalogo}.csv`, 'text/csv;charset=utf-8;');
    mostrarNotificacion('CSV exportado exitosamente', 'success');
}

// Importar CSV
function importarCSV(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const contenido = e.target.result;
            const filas = contenido.split('\n');
            
            productos = [];
            
            for (let i = 1; i < filas.length; i++) {
                const columnas = filas[i].split(',');
                
                if (columnas.length >= 4 && columnas[0].trim() !== '') {
                    const producto = {
                        id: Date.now() + Math.random(),
                        nombre: columnas[0].trim().replace(/"/g, ''),
                        talle: columnas[1].trim().replace(/"/g, ''),
                        precio: parseFloat(columnas[2]).toFixed(2),
                        categoria: columnas[3].trim().replace(/"/g, ''),
                        descripcion: columnas[4] ? columnas[4].trim().replace(/"/g, '') : '',
                        imagen: '',
                        seleccionado: false
                    };
                    
                    productos.push(producto);
                }
            }
            
            actualizarListaProductos();
            guardarProductosEnLocalStorage();
            mostrarNotificacion('CSV importado exitosamente', 'success');
        } catch (error) {
            mostrarNotificacion('Error al importar CSV: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

// Generar PDF
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

// Mostrar selector de tema
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

// Generar PDF con tema específico
function generarPDFConTema(tema, nombreCatalogo, nombreTema) {
    const doc = new jsPDF('p', 'mm', 'a4');
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

    function fitImagePreservingAspectRatio(doc, imageData, x, y, maxWidth, maxHeight) {
        const img = new Image();
        img.src = imageData;
        
        const imgWidth = img.width;
        const imgHeight = img.height;
        
        let newWidth, newHeight;
        
        if (imgWidth / imgHeight > maxWidth / maxHeight) {
            newWidth = maxWidth;
            newHeight = (imgHeight * maxWidth) / imgWidth;
        } else {
            newHeight = maxHeight;
            newWidth = (imgWidth * maxHeight) / imgHeight;
        }
        
        const centerX = x + (maxWidth - newWidth) / 2;
        const centerY = y + (maxHeight - newHeight) / 2;
        
        doc.addImage(imageData, 'JPEG', centerX, centerY, newWidth, newHeight);
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

            if (producto.imagen) {
                fitImagePreservingAspectRatio(
                    doc, 
                    producto.imagen, 
                    pos.x, 
                    pos.y, 
                    imageMaxWidth, 
                    imageMaxHeight
                );
            }

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

// Funciones auxiliares
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 0, 0];
}

function rgbToHex(rgb) {
    return '#' + rgb.map(c => c.toString(16).padStart(2, '0')).join('');
}

// Actualizar vista previa del diseñador
function actualizarVistaPrevia() {
    const configuracion = obtenerConfiguracionDiseño();
    
    const previewHeader = document.getElementById('previewHeader');
    const previewFooter = document.getElementById('previewFooter');
    const productosPreview = document.getElementById('productosPreview');
    
    if (previewHeader) {
        previewHeader.textContent = configuracion.headerTexto || 'Catálogo Éter';
        previewHeader.style.fontSize = configuracion.headerTamaño + 'px';
        previewHeader.style.color = configuracion.headerColor;
        previewHeader.style.fontFamily = configuracion.headerFont;
        
        let headerStyle = '';
        if (configuracion.headerNegrita) headerStyle += 'bold ';
        if (configuracion.headerCursiva) headerStyle += 'italic ';
        previewHeader.style.fontWeight = configuracion.headerNegrita ? 'bold' : 'normal';
        previewHeader.style.fontStyle = configuracion.headerCursiva ? 'italic' : 'normal';
    }
    
    if (previewFooter) {
        previewFooter.textContent = configuracion.footerTexto || 'Generado con Éter Generador de Catálogos';
        previewFooter.style.fontSize = configuracion.footerTamaño + 'px';
        previewFooter.style.color = configuracion.footerColor;
        previewFooter.style.fontFamily = configuracion.footerFont;
        
        let footerStyle = '';
        if (configuracion.footerNegrita) footerStyle += 'bold ';
        if (configuracion.footerCursiva) footerStyle += 'italic ';
        previewFooter.style.fontWeight = configuracion.footerNegrita ? 'bold' : 'normal';
        previewFooter.style.fontStyle = configuracion.footerCursiva ? 'italic' : 'normal';
    }
    
    if (productosPreview) {
        mostrarProductosEnPreview(productos, configuracion);
    }
    
    // Actualizar también la vista previa completa si está activa
    const vistaPreviaTab = document.getElementById('vista-previa');
    if (vistaPreviaTab && vistaPreviaTab.classList.contains('active')) {
        actualizarVistaPreviaCompleta();
    }
}

// Mostrar productos en la vista previa del diseñador
function mostrarProductosEnPreview(productos, configuracion = {}) {
    const contenedor = document.getElementById('productosPreview');
    if (!contenedor) return;
    
    if (!productos || productos.length === 0) {
        contenedor.innerHTML = `
            <div class="no-productos">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ffaa00; margin-bottom: 1rem;"></i>
                <p>No hay productos agregados.</p>
                <p>Ve a la pestaña Generador para agregar productos.</p>
            </div>
        `;
        return;
    }
    
    const productosAMostrar = productos.slice(0, 8);
    const columnas = configuracion.productosColumnas || 2;
    const espaciado = configuracion.productosEspaciado || 15;
    const precioColor = configuracion.precioColor || '#00aa00';
    const mostrarDescripcion = configuracion.mostrarDescripcion !== false;
    const mostrarCategoria = configuracion.mostrarCategoria !== false;
    
    // Aplicar configuración de grid
    contenedor.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`;
    contenedor.style.gap = `${espaciado}px`;
    
    contenedor.innerHTML = productosAMostrar.map(producto => `
        <div class="preview-product">
            <div class="preview-image">
                ${producto.imagen ? 
                    `<img src="${producto.imagen}" alt="${producto.nombre}">` : 
                    '<i class="fas fa-image"></i>'
                }
            </div>
            <div class="preview-info">
                <div class="preview-name">${producto.nombre}</div>
                <div class="preview-details">
                    <span>${producto.talle}</span>
                    ${mostrarCategoria ? `<span>${producto.categoria}</span>` : ''}
                </div>
                <div class="preview-price" style="color: ${precioColor}">$${producto.precio}</div>
                ${mostrarDescripcion && producto.descripcion ? `<div class="preview-description">${producto.descripcion}</div>` : ''}
            </div>
        </div>
    `).join('');
    
    if (productos.length > 8) {
        contenedor.innerHTML += `
            <div class="preview-product">
                <div class="preview-image">
                    <i class="fas fa-plus"></i>
                </div>
                <div class="preview-info">
                    <div class="preview-name">Y ${productos.length - 8} más...</div>
                    <div class="preview-details">
                        <span>Total: ${productos.length} productos</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// Actualizar vista previa completa
function actualizarVistaPreviaCompleta() {
    const container = document.getElementById('previewFullContainer');
    if (!container) return;
    
    if (!productos || productos.length === 0) {
        container.innerHTML = `
            <div class="preview-empty-state">
                <div class="preview-empty-icon">
                    <i class="fas fa-box-open"></i>
                </div>
                <h3 class="preview-empty-title">No hay productos para mostrar</h3>
                <p class="preview-empty-description">Ve a la pestaña Generador para agregar productos y crear tu catálogo.</p>
                <button onclick="cambiarTab('generador')" class="preview-empty-button">
                    <i class="fas fa-plus-circle"></i>
                    Agregar Productos
                </button>
            </div>
        `;
        return;
    }
    
    // Obtener configuración de diseño
    const configuracion = obtenerConfiguracionDiseño();
    const logo = configuracionDiseño.logo;
    
    // Calcular estadísticas
    const totalProductos = productos.length;
    const precioTotal = productos.reduce((sum, p) => sum + parseFloat(p.precio), 0).toFixed(2);
    const categorias = [...new Set(productos.map(p => p.categoria))];
    
    container.innerHTML = `
        <div class="preview-catalog-wrapper">
            <!-- Header del Catálogo -->
            <div class="preview-catalog-header" style="font-size: ${configuracion.headerTamaño}px; color: ${configuracion.headerColor}; font-weight: ${configuracion.headerNegrita ? 'bold' : 'normal'}; font-family: ${configuracion.headerFont}; font-style: ${configuracion.headerCursiva ? 'italic' : 'normal'};">
                ${logo ? `<div class="preview-logo"><img src="${logo}" alt="Logo"></div>` : ''}
                <h1 class="preview-catalog-title">${configuracion.headerTexto || 'Catálogo Éter'}</h1>
                <div class="preview-catalog-subtitle">Catálogo Profesional de Productos</div>
            </div>
            
            <!-- Estadísticas del Catálogo -->
            <div class="preview-catalog-stats">
                <div class="preview-stat-item">
                    <i class="fas fa-boxes"></i>
                    <span class="preview-stat-number">${totalProductos}</span>
                    <span class="preview-stat-label">Productos</span>
                </div>
                <div class="preview-stat-item">
                    <i class="fas fa-dollar-sign"></i>
                    <span class="preview-stat-number">$${precioTotal}</span>
                    <span class="preview-stat-label">Valor Total</span>
                </div>
                <div class="preview-stat-item">
                    <i class="fas fa-tags"></i>
                    <span class="preview-stat-number">${categorias.length}</span>
                    <span class="preview-stat-label">Categorías</span>
                </div>
            </div>
            
            <!-- Filtros y Búsqueda -->
            <div class="preview-catalog-controls">
                <div class="preview-search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="previewSearch" placeholder="Buscar productos..." class="preview-search-input">
                </div>
                <div class="preview-filter-buttons">
                    <button class="preview-filter-btn active" data-filter="todos">
                        <i class="fas fa-th"></i>
                        Todos
                    </button>
                    ${categorias.map(cat => `
                        <button class="preview-filter-btn" data-filter="${cat.toLowerCase()}">
                            <i class="fas fa-tag"></i>
                            ${cat}
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <!-- Grid de Productos -->
            <div class="preview-catalog-grid" id="previewProductGrid">
                ${productos.map((producto, index) => `
                    <div class="preview-catalog-item" data-category="${producto.categoria.toLowerCase()}" data-index="${index}">
                        <div class="preview-item-image">
                            ${producto.imagen ? 
                                `<img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">` : 
                                '<div class="preview-item-placeholder"><i class="fas fa-image"></i></div>'
                            }
                            <div class="preview-item-overlay">
                                <button class="preview-item-btn" onclick="verDetalleProducto(${index})">
                                    <i class="fas fa-eye"></i>
                                    Ver Detalle
                                </button>
                            </div>
                        </div>
                        <div class="preview-item-content">
                            <h3 class="preview-item-title">${producto.nombre}</h3>
                            <div class="preview-item-details">
                                <span class="preview-item-size">
                                    <i class="fas fa-ruler"></i>
                                    ${producto.talle}
                                </span>
                                <span class="preview-item-category">
                                    <i class="fas fa-tag"></i>
                                    ${producto.categoria}
                                </span>
                            </div>
                            <div class="preview-item-price">
                                <span class="preview-price-amount">$${producto.precio}</span>
                                ${producto.descripcion ? `<div class="preview-item-description">${producto.descripcion}</div>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Paginación -->
            <div class="preview-catalog-pagination">
                <button class="preview-pagination-btn" onclick="cambiarPaginaPrevia('prev')">
                    <i class="fas fa-chevron-left"></i>
                    Anterior
                </button>
                <div class="preview-pagination-info">
                    <span id="previewPageInfo">Página 1 de 1</span>
                </div>
                <button class="preview-pagination-btn" onclick="cambiarPaginaPrevia('next')">
                    Siguiente
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            
            <!-- Footer del Catálogo -->
            <div class="preview-catalog-footer" style="font-size: ${configuracion.footerTamaño}px; color: ${configuracion.footerColor}; font-weight: ${configuracion.footerNegrita ? 'bold' : 'normal'}; font-family: ${configuracion.footerFont}; font-style: ${configuracion.footerCursiva ? 'italic' : 'normal'};">
                <p>${configuracion.footerTexto || 'Generado con Éter Generador de Catálogos'}</p>
                <div class="preview-footer-info">
                    <span>Generado el ${new Date().toLocaleDateString()}</span>
                    <span>•</span>
                    <span>${totalProductos} productos</span>
                </div>
            </div>
        </div>
    `;
    
    // Configurar eventos de búsqueda y filtros
    configurarEventosVistaPrevia();
    
    // Actualizar paginación
    actualizarPaginacionPrevia();
}

// Configurar eventos de la vista previa
function configurarEventosVistaPrevia() {
    // Búsqueda
    const searchInput = document.getElementById('previewSearch');
    if (searchInput) {
        searchInput.addEventListener('input', filtrarProductosPrevia);
    }
    
    // Filtros por categoría
    const filterButtons = document.querySelectorAll('.preview-filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtrarProductosPrevia();
        });
    });
}

// Filtrar productos en vista previa
function filtrarProductosPrevia() {
    const searchTerm = document.getElementById('previewSearch')?.value.toLowerCase() || '';
    const activeFilter = document.querySelector('.preview-filter-btn.active')?.getAttribute('data-filter') || 'todos';
    const items = document.querySelectorAll('.preview-catalog-item');
    
    items.forEach(item => {
        const title = item.querySelector('.preview-item-title').textContent.toLowerCase();
        const category = item.getAttribute('data-category');
        const matchesSearch = title.includes(searchTerm);
        const matchesFilter = activeFilter === 'todos' || category === activeFilter;
        
        if (matchesSearch && matchesFilter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    actualizarPaginacionPrevia();
}

// Ver detalle de producto
function verDetalleProducto(index) {
    const producto = productos[index];
    if (!producto) return;
    
    const modal = document.createElement('div');
    modal.className = 'preview-product-modal';
    modal.innerHTML = `
        <div class="preview-modal-overlay">
            <div class="preview-modal-content">
                <button class="preview-modal-close" onclick="cerrarModalProducto()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="preview-modal-body">
                    <div class="preview-modal-image">
                        ${producto.imagen ? 
                            `<img src="${producto.imagen}" alt="${producto.nombre}">` : 
                            '<div class="preview-modal-placeholder"><i class="fas fa-image"></i></div>'
                        }
                    </div>
                    <div class="preview-modal-info">
                        <h2 class="preview-modal-title">${producto.nombre}</h2>
                        <div class="preview-modal-details">
                            <div class="preview-modal-detail">
                                <i class="fas fa-ruler"></i>
                                <span><strong>Talla:</strong> ${producto.talle}</span>
                            </div>
                            <div class="preview-modal-detail">
                                <i class="fas fa-dollar-sign"></i>
                                <span><strong>Precio:</strong> $${producto.precio}</span>
                            </div>
                            <div class="preview-modal-detail">
                                <i class="fas fa-tag"></i>
                                <span><strong>Categoría:</strong> ${producto.categoria}</span>
                            </div>
                        </div>
                        ${producto.descripcion ? `
                            <div class="preview-modal-description">
                                <h4>Descripción:</h4>
                                <p>${producto.descripcion}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Configurar eventos del modal
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            cerrarModalProducto();
        }
    };
    
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('preview-modal-overlay')) {
            cerrarModalProducto();
        }
    };
    
    document.addEventListener('keydown', handleEscape);
    modal.querySelector('.preview-modal-overlay').addEventListener('click', handleOverlayClick);
    
    // Guardar referencias para limpiar eventos
    modal._handleEscape = handleEscape;
    modal._handleOverlayClick = handleOverlayClick;
}

// Cerrar modal de producto
function cerrarModalProducto() {
    const modal = document.querySelector('.preview-product-modal');
    if (modal) {
        // Limpiar eventos
        if (modal._handleEscape) {
            document.removeEventListener('keydown', modal._handleEscape);
        }
        if (modal._handleOverlayClick) {
            modal.querySelector('.preview-modal-overlay').removeEventListener('click', modal._handleOverlayClick);
        }
        
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Cambiar página en vista previa
function cambiarPaginaPrevia(direction) {
    // Implementación de paginación si es necesario
    console.log('Cambiar página:', direction);
}

// Actualizar paginación
function actualizarPaginacionPrevia() {
    const pageInfo = document.getElementById('previewPageInfo');
    if (pageInfo) {
        pageInfo.textContent = 'Página 1 de 1';
    }
}

// Cambiar a otra pestaña
function cambiarTab(tabName) {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    // Inicializar funcionalidades específicas de cada pestaña
    if (tabName === 'tienda-online') {
        actualizarTiendaOnline();
    } else if (tabName === 'vista-previa') {
        actualizarVistaPreviaCompleta();
    } else if (tabName === 'diseñador') {
        actualizarVistaPrevia();
    }
}

// Cargar logo
function cargarLogo(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            configuracionDiseño.logo = e.target.result;
            const logoPreview = document.getElementById('logoPreview');
            if (logoPreview) {
                logoPreview.innerHTML = '<img src="' + e.target.result + '" alt="Logo">';
            }
        };
        reader.readAsDataURL(file);
    }
}

// Guardar diseño
function guardarDiseño() {
    const configuracion = obtenerConfiguracionDiseño();
    
    configuracionDiseño = {
        header: {
            texto: configuracion.headerTexto || 'Catálogo Éter',
            color: hexToRgb(configuracion.headerColor),
            tamaño: configuracion.headerTamaño,
            negrita: configuracion.headerNegrita,
            cursiva: configuracion.headerCursiva,
            font: configuracion.headerFont
        },
        footer: {
            texto: configuracion.footerTexto || 'Generado con Éter Generador de Catálogos',
            color: hexToRgb(configuracion.footerColor),
            tamaño: configuracion.footerTamaño,
            negrita: configuracion.footerNegrita,
            cursiva: configuracion.footerCursiva,
            font: configuracion.footerFont
        },
        productos: {
            columnas: configuracion.productosColumnas,
            espaciado: configuracion.productosEspaciado,
            precioColor: hexToRgb(configuracion.precioColor),
            mostrarDescripcion: configuracion.mostrarDescripcion,
            mostrarCategoria: configuracion.mostrarCategoria
        },
        tema: configuracion.tema,
        layout: configuracion.layout,
        logo: configuracionDiseño.logo
    };
    
    localStorage.setItem('configuracionDiseñoEter', JSON.stringify(configuracionDiseño));
    mostrarNotificacion('Diseño guardado exitosamente', 'success');
}

// Restaurar diseño por defecto
function restaurarDiseño() {
    configuracionDiseño = {
        header: {
            texto: 'Catálogo Éter',
            color: [34, 34, 34],
            tamaño: 24,
            negrita: true,
            cursiva: false,
            font: 'Arial, sans-serif'
        },
        footer: {
            texto: 'Generado con Éter Generador de Catálogos',
            color: [128, 128, 128],
            tamaño: 10,
            negrita: false,
            cursiva: false,
            font: 'Arial, sans-serif'
        },
        productos: {
            columnas: 2,
            espaciado: 15,
            precioColor: [0, 170, 0],
            mostrarDescripcion: true,
            mostrarCategoria: true
        },
        tema: 'cyber',
        layout: 'grid',
        logo: null
    };
    
    localStorage.setItem('configuracionDiseñoEter', JSON.stringify(configuracionDiseño));
    aplicarConfiguracionDiseño();
    actualizarVistaPrevia();
    mostrarNotificacion('Diseño restaurado', 'info');
}

// Limpiar diseño
function limpiarDiseño() {
    if (confirm('¿Estás seguro de que quieres limpiar todo el diseño?')) {
        const headerTexto = document.getElementById('headerTexto');
        const headerTamaño = document.getElementById('headerTamaño');
        const headerTamañoValor = document.getElementById('headerTamañoValor');
        const headerColor = document.getElementById('headerColor');
        const headerNegrita = document.getElementById('headerNegrita');
        const headerCursiva = document.getElementById('headerCursiva');
        const headerFont = document.getElementById('headerFont');
        
        const footerTexto = document.getElementById('footerTexto');
        const footerTamaño = document.getElementById('footerTamaño');
        const footerTamañoValor = document.getElementById('footerTamañoValor');
        const footerColor = document.getElementById('footerColor');
        const footerNegrita = document.getElementById('footerNegrita');
        const footerCursiva = document.getElementById('footerCursiva');
        const footerFont = document.getElementById('footerFont');
        
        const productosColumnas = document.getElementById('productosColumnas');
        const productosColumnasValor = document.getElementById('productosColumnasValor');
        const productosEspaciado = document.getElementById('productosEspaciado');
        const productosEspaciadoValor = document.getElementById('productosEspaciadoValor');
        const precioColor = document.getElementById('precioColor');
        const mostrarDescripcion = document.getElementById('mostrarDescripcion');
        const mostrarCategoria = document.getElementById('mostrarCategoria');
        
        const logoInput = document.getElementById('logoInput');
        const logoPreview = document.getElementById('logoPreview');
        
        // Limpiar header
        if (headerTexto) headerTexto.value = '';
        if (headerTamaño) headerTamaño.value = 24;
        if (headerTamañoValor) headerTamañoValor.textContent = '24px';
        if (headerColor) headerColor.value = '#222222';
        if (headerNegrita) headerNegrita.checked = false;
        if (headerCursiva) headerCursiva.checked = false;
        if (headerFont) headerFont.value = 'Arial, sans-serif';
        
        // Limpiar footer
        if (footerTexto) footerTexto.value = '';
        if (footerTamaño) footerTamaño.value = 10;
        if (footerTamañoValor) footerTamañoValor.textContent = '10px';
        if (footerColor) footerColor.value = '#808080';
        if (footerNegrita) footerNegrita.checked = false;
        if (footerCursiva) footerCursiva.checked = false;
        if (footerFont) footerFont.value = 'Arial, sans-serif';
        
        // Limpiar productos
        if (productosColumnas) productosColumnas.value = 2;
        if (productosColumnasValor) productosColumnasValor.textContent = '2';
        if (productosEspaciado) productosEspaciado.value = 15;
        if (productosEspaciadoValor) productosEspaciadoValor.textContent = '15px';
        if (precioColor) precioColor.value = '#00aa00';
        if (mostrarDescripcion) mostrarDescripcion.checked = true;
        if (mostrarCategoria) mostrarCategoria.checked = true;
        
        // Limpiar logo
        if (logoInput) logoInput.value = '';
        if (logoPreview) logoPreview.innerHTML = '<p>Sin logo</p>';
        
        // Resetear tema y layout
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(opt => opt.classList.remove('active'));
        const cyberTheme = document.querySelector('[data-theme="cyber"]');
        if (cyberTheme) cyberTheme.classList.add('active');
        
        const layoutOptions = document.querySelectorAll('.layout-option');
        layoutOptions.forEach(opt => opt.classList.remove('active'));
        const gridLayout = document.querySelector('[data-layout="grid"]');
        if (gridLayout) gridLayout.classList.add('active');
        
        actualizarVistaPrevia();
        mostrarNotificacion('Diseño limpiado', 'info');
    }
}

// Generar PDF desde vista previa
function generarPDFDesdePrevia() {
    if (productos.length === 0) {
        mostrarNotificacion('No hay productos para generar PDF', 'warning');
        return;
    }
    generarPDF();
}

// Exportar catálogo JSON
function exportarCatalogoJSON() {
    if (productos.length === 0) {
        mostrarNotificacion('No hay productos para exportar', 'warning');
        return;
    }

    const nombreCatalogo = document.getElementById('nombreCatalogo')?.value || 'catalogo_eter';
    const catalogoExport = {
        nombre: nombreCatalogo,
        fecha: new Date().toISOString(),
        productos: productos
    };

    const jsonString = JSON.stringify(catalogoExport, null, 2);
    descargarArchivo(jsonString, `${nombreCatalogo}.json`, 'application/json');
    mostrarNotificacion('JSON exportado exitosamente', 'success');
}

// Importar catálogo JSON
function importarCatalogoJSON(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const catalogoImport = JSON.parse(e.target.result);
            
            document.getElementById('nombreCatalogo').value = catalogoImport.nombre || '';
            productos = catalogoImport.productos || [];
            
            actualizarListaProductos();
            guardarProductosEnLocalStorage();
            mostrarNotificacion(`Catálogo "${catalogoImport.nombre}" importado exitosamente`, 'success');
        } catch (error) {
            mostrarNotificacion('Error al importar el JSON: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

// Exportar XML
function exportarXML() {
    if (productos.length === 0) {
        mostrarNotificacion('No hay productos para exportar', 'warning');
        return;
    }

    const nombreCatalogo = document.getElementById('nombreCatalogo')?.value || 'catalogo_eter';
    
    const xmlDoc = document.implementation.createDocument(null, 'catalogo');
    const catalogoElement = xmlDoc.documentElement;
    
    const nombreElement = xmlDoc.createElement('nombre');
    nombreElement.textContent = nombreCatalogo;
    catalogoElement.appendChild(nombreElement);
    
    const fechaElement = xmlDoc.createElement('fecha');
    fechaElement.textContent = new Date().toISOString();
    catalogoElement.appendChild(fechaElement);
    
    const productosElement = xmlDoc.createElement('productos');
    productos.forEach(producto => {
        const productoElement = xmlDoc.createElement('producto');
        
        const propiedades = [
            { nombre: 'nombre', valor: producto.nombre },
            { nombre: 'talle', valor: producto.talle },
            { nombre: 'precio', valor: producto.precio },
            { nombre: 'categoria', valor: producto.categoria },
            { nombre: 'descripcion', valor: producto.descripcion || '' }
        ];
        
        propiedades.forEach(prop => {
            const element = xmlDoc.createElement(prop.nombre);
            element.textContent = prop.valor;
            productoElement.appendChild(element);
        });
        
        const imagenElement = xmlDoc.createElement('imagen');
        imagenElement.textContent = producto.imagen;
        productoElement.appendChild(imagenElement);
        
        productosElement.appendChild(productoElement);
    });
    
    catalogoElement.appendChild(productosElement);
    
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(xmlDoc);
    
    descargarArchivo(xmlString, `${nombreCatalogo}.xml`, 'text/xml');
    mostrarNotificacion('XML exportado exitosamente', 'success');
}

// Importar XML
function importarXML(event) {
    const file = event.target.files[0];
    
    if (!file) {
        mostrarNotificacion('❌ No se seleccionó ningún archivo', 'error');
        return;
    }
    
    if (!file.name.toLowerCase().endsWith('.xml')) {
        mostrarNotificacion('❌ El archivo debe ser un XML válido', 'error');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(e.target.result, 'text/xml');
            
            // Verificar si el XML es válido
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                throw new Error('El archivo XML no es válido o está malformado');
            }
            
            // Buscar el nombre del catálogo en diferentes ubicaciones posibles
            let nombreCatalogo = '';
            const nombreElement = xmlDoc.querySelector('nombre, catalog > nombre, catalogo > nombre, root > nombre');
            if (nombreElement) {
                nombreCatalogo = nombreElement.textContent.trim();
            }
            
            if (nombreCatalogo) {
                document.getElementById('nombreCatalogo').value = nombreCatalogo;
            }
            
            productos = [];
            
            // Buscar productos en diferentes estructuras XML posibles
            const productosElements = xmlDoc.querySelectorAll('producto, product, item');
            
            if (productosElements.length === 0) {
                throw new Error('No se encontraron productos en el archivo XML');
            }
            
            productosElements.forEach((productoElement, index) => {
                try {
                    const producto = {
                        id: Date.now() + Math.random() + index,
                        nombre: productoElement.querySelector('nombre, name, titulo')?.textContent?.trim() || `Producto ${index + 1}`,
                        talle: productoElement.querySelector('talle, size, talla')?.textContent?.trim() || 'M',
                        precio: productoElement.querySelector('precio, price, cost')?.textContent?.trim() || '0.00',
                        categoria: productoElement.querySelector('categoria, category, tipo')?.textContent?.trim() || 'Otros',
                        descripcion: productoElement.querySelector('descripcion, description, desc')?.textContent?.trim() || '',
                        imagen: productoElement.querySelector('imagen, image, img')?.textContent?.trim() || '',
                        seleccionado: false
                    };
                    
                    productos.push(producto);
                } catch (productError) {
                    console.warn(`Error procesando producto ${index + 1}:`, productError);
                }
            });
            
            if (productos.length === 0) {
                throw new Error('No se pudieron procesar los productos del archivo XML');
            }
            
            actualizarListaProductos();
            guardarProductosEnLocalStorage();
            mostrarNotificacion(`✅ Catálogo "${nombreCatalogo || 'Sin nombre'}" importado exitosamente con ${productos.length} productos`, 'success');
            
        } catch (error) {
            console.error('Error al importar XML:', error);
            mostrarNotificacion(`❌ Error al importar el XML: ${error.message}`, 'error');
        }
    };
    
    reader.onerror = () => {
        mostrarNotificacion('❌ Error al leer el archivo XML', 'error');
    };
    
    reader.readAsText(file);
}

// Guardar catálogo
function guardarCatalogo() {
    if (productos.length === 0) {
        mostrarNotificacion('No hay productos para guardar', 'warning');
        return;
    }

    const nombreCatalogo = document.getElementById('nombreCatalogo')?.value || `Catálogo ${catalogosGuardados.length + 1}`;
    
    const catalogoExistente = catalogosGuardados.find(c => c.nombre === nombreCatalogo);
    
    if (catalogoExistente) {
        const confirmacion = confirm(`Ya existe un catálogo con el nombre "${nombreCatalogo}". ¿Deseas sobrescribirlo?`);
        if (!confirmacion) {
            return;
        }
        catalogosGuardados = catalogosGuardados.filter(c => c.nombre !== nombreCatalogo);
    }

    const nuevoCatalogo = {
        nombre: nombreCatalogo,
        fecha: new Date().toISOString(),
        productos: productos.map(producto => ({
            ...producto,
            id: undefined
        }))
    };

    catalogosGuardados.push(nuevoCatalogo);
    localStorage.setItem('catalogosEter', JSON.stringify(catalogosGuardados));

    mostrarNotificacion(`Catálogo "${nombreCatalogo}" guardado exitosamente`, 'success');
}

// Importar catálogo
function importarCatalogo() {
    if (catalogosGuardados.length === 0) {
        mostrarNotificacion('No hay catálogos guardados para importar', 'warning');
        return;
    }

    mostrarSelectorCatalogo(catalogosGuardados, 'importar');
}

// Eliminar catálogo
function eliminarCatalogo() {
    if (catalogosGuardados.length === 0) {
        mostrarNotificacion('No hay catálogos guardados para eliminar', 'warning');
        return;
    }

    mostrarSelectorCatalogo(catalogosGuardados, 'eliminar');
}

// Mostrar selector de catálogo
function mostrarSelectorCatalogo(catalogos, accion) {
    const dialogo = document.createElement('div');
    dialogo.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    dialogo.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 class="text-2xl mb-4 ${accion === 'eliminar' ? 'text-red-400' : 'text-cyan-400'}">
                ${accion === 'eliminar' ? 'Eliminar' : 'Importar'} Catálogo
            </h2>
            <div id="listaCatalogosGuardados" class="space-y-2"></div>
            <div class="mt-4 flex justify-end space-x-2">
                <button id="cerrarDialogo" class="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
            </div>
        </div>
    `;

    const listaCatalogosGuardados = dialogo.querySelector('#listaCatalogosGuardados');
    catalogos.forEach((catalogo, index) => {
        const botonCatalogo = document.createElement('button');
        botonCatalogo.className = `w-full text-left p-3 rounded transition ${accion === 'eliminar' ? 'bg-gray-700 hover:bg-red-800' : 'bg-gray-700 hover:bg-gray-600'}`;
        botonCatalogo.innerHTML = `
            <p class="font-bold ${accion === 'eliminar' ? 'text-red-400' : 'text-cyan-400'}">${catalogo.nombre}</p>
            <p class="text-sm text-gray-400">Guardado: ${new Date(catalogo.fecha).toLocaleString()}</p>
            <p class="text-sm text-gray-400">Productos: ${catalogo.productos.length}</p>
        `;
        
        botonCatalogo.addEventListener('click', () => {
            if (accion === 'eliminar') {
                const confirmacion = confirm(`¿Estás seguro de que quieres eliminar el catálogo "${catalogo.nombre}"?`);
                
                if (confirmacion) {
                    catalogosGuardados = catalogosGuardados.filter(c => c.nombre !== catalogo.nombre);
                    localStorage.setItem('catalogosEter', JSON.stringify(catalogosGuardados));
                    document.body.removeChild(dialogo);
                    mostrarNotificacion(`Catálogo "${catalogo.nombre}" eliminado exitosamente`, 'success');
                }
            } else {
                productos = catalogo.productos.map(producto => ({
                    ...producto,
                    id: Date.now() + Math.random(),
                    seleccionado: false
                }));
                
                document.getElementById('nombreCatalogo').value = catalogo.nombre;
                actualizarListaProductos();
                guardarProductosEnLocalStorage();
                document.body.removeChild(dialogo);
                mostrarNotificacion(`Catálogo "${catalogo.nombre}" importado exitosamente`, 'success');
            }
        });
        
        listaCatalogosGuardados.appendChild(botonCatalogo);
    });

    const cerrarDialogo = dialogo.querySelector('#cerrarDialogo');
    cerrarDialogo.addEventListener('click', () => {
        document.body.removeChild(dialogo);
    });

    document.body.appendChild(dialogo);
}

// Función auxiliar para descargar archivos mejorada
function descargarArchivo(content, filename, contentType) {
    try {
        console.log('📥 Iniciando descarga:', filename);
        console.log('📊 Tamaño del contenido:', content.length, 'caracteres');
        
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        // Añadir atributos adicionales para mejor compatibilidad
        a.setAttribute('download', filename);
        a.setAttribute('type', contentType);
        
        document.body.appendChild(a);
        
        // Simular clic con manejo de errores
        try {
            a.click();
            console.log('✅ Descarga iniciada correctamente');
        } catch (clickError) {
            console.error('❌ Error al hacer clic:', clickError);
            throw new Error('No se pudo iniciar la descarga');
        }
        
        // Limpiar después de un delay
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log('🧹 Recursos limpiados');
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error en descarga:', error);
        
        // Método alternativo usando window.open
        try {
            const blob = new Blob([content], { type: contentType });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);
            
            console.log('✅ Descarga alternativa iniciada');
        } catch (fallbackError) {
            console.error('❌ Error en descarga alternativa:', fallbackError);
            throw new Error('No se pudo descargar el archivo');
        }
    }
}

// Sistema de notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <i class="fas ${getIconoTipo(tipo)}"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(26, 26, 42, 0.95);
        border: 2px solid var(--primary-cyan);
        border-radius: 10px;
        padding: 1rem 1.5rem;
        color: var(--text-primary);
        z-index: 1001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        backdrop-filter: blur(10px);
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        font-family: 'Rajdhani', sans-serif;
    `;
    
    if (tipo === 'success') {
        notificacion.style.borderColor = '#00ff88';
        notificacion.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.3)';
    } else if (tipo === 'error') {
        notificacion.style.borderColor = '#ff4444';
        notificacion.style.boxShadow = '0 0 20px rgba(255, 68, 68, 0.3)';
    } else if (tipo === 'warning') {
        notificacion.style.borderColor = '#ffaa00';
        notificacion.style.boxShadow = '0 0 20px rgba(255, 170, 0, 0.3)';
    }
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notificacion.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notificacion.parentNode) {
                document.body.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}

function getIconoTipo(tipo) {
    const iconos = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return iconos[tipo] || iconos.info;
}

// ===== NUEVAS FUNCIONES DEL DISEÑADOR MEJORADO =====

// Configurar selectores de tema y layout
function configurarSelectoresTemaLayout() {
    const themeOptions = document.querySelectorAll('.theme-option');
    const layoutOptions = document.querySelectorAll('.layout-option');
    
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            actualizarVistaPrevia();
        });
    });
    
    layoutOptions.forEach(option => {
        option.addEventListener('click', function() {
            layoutOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            actualizarVistaPrevia();
        });
    });
}

// Exportar PDF desde el diseñador
function exportarPDFDesdeDiseñador() {
    const nombreCatalogo = document.getElementById('nombreCatalogo').value || 'Catálogo Éter';
    const configuracion = obtenerConfiguracionDiseño();
    
    // Generar PDF con la configuración actual del diseñador
    generarPDFConConfiguracion(configuracion, nombreCatalogo);
}

// Generar PDF con configuración personalizada
function generarPDFConConfiguracion(configuracion, nombreCatalogo) {
    try {
        const doc = new jsPDF();
        
        // Aplicar configuración de diseño
        const headerTexto = configuracion.headerTexto || nombreCatalogo;
        const headerTamaño = configuracion.headerTamaño || 24;
        const headerColor = configuracion.headerColor || '#222222';
        const headerFont = configuracion.headerFont || 'Arial, sans-serif';
        const headerNegrita = configuracion.headerNegrita || false;
        const headerCursiva = configuracion.headerCursiva || false;
        
        const footerTexto = configuracion.footerTexto || 'Generado con Éter Generador de Catálogos';
        const footerTamaño = configuracion.footerTamaño || 10;
        const footerColor = configuracion.footerColor || '#808080';
        const footerFont = configuracion.footerFont || 'Arial, sans-serif';
        const footerNegrita = configuracion.footerNegrita || false;
        const footerCursiva = configuracion.footerCursiva || false;
        
        const productosColumnas = configuracion.productosColumnas || 2;
        const productosEspaciado = configuracion.productosEspaciado || 15;
        const precioColor = configuracion.precioColor || '#00aa00';
        const mostrarDescripcion = configuracion.mostrarDescripcion !== false;
        const mostrarCategoria = configuracion.mostrarCategoria !== false;
        
        // Configurar fuentes
        let headerStyle = '';
        if (headerNegrita) headerStyle += 'bold ';
        if (headerCursiva) headerStyle += 'italic ';
        
        let footerStyle = '';
        if (footerNegrita) footerStyle += 'bold ';
        if (footerCursiva) footerStyle += 'italic ';
        
        // Añadir cabecera
        doc.setFontSize(headerTamaño);
        doc.setTextColor(hexToRgb(headerColor));
        doc.setFont(headerFont.split(',')[0].replace(/['"]/g, ''), headerStyle.trim() || 'normal');
        doc.text(headerTexto, 105, 20, { align: 'center' });
        
        // Añadir productos
        const productosSeleccionados = productos.filter(p => p.seleccionado);
        if (productosSeleccionados.length === 0) {
            doc.setFontSize(14);
            doc.setTextColor(100, 100, 100);
            doc.text('No hay productos seleccionados', 105, 60, { align: 'center' });
        } else {
            let y = 40;
            let x = 20;
            let columna = 0;
            
            productosSeleccionados.forEach((producto, index) => {
                if (y > 250) {
                    doc.addPage();
                    y = 20;
                    columna = 0;
                    x = 20;
                }
                
                // Imagen del producto
                if (producto.imagen) {
                    try {
                        const img = new Image();
                        img.src = producto.imagen;
                        doc.addImage(img, 'JPEG', x, y, 30, 30);
                        x += 35;
                    } catch (error) {
                        x += 35;
                    }
                } else {
                    x += 35;
                }
                
                // Información del producto
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.setFont('Arial', 'bold');
                doc.text(producto.nombre, x, y + 5);
                
                y += 8;
                doc.setFontSize(10);
                doc.setFont('Arial', 'normal');
                doc.text(`Talla: ${producto.talle}`, x, y + 5);
                
                y += 6;
                doc.setTextColor(hexToRgb(precioColor));
                doc.setFont('Arial', 'bold');
                doc.text(`$${producto.precio}`, x, y + 5);
                
                if (mostrarCategoria) {
                    y += 6;
                    doc.setTextColor(100, 100, 100);
                    doc.setFont('Arial', 'italic');
                    doc.text(producto.categoria, x, y + 5);
                }
                
                if (mostrarDescripcion && producto.descripcion) {
                    y += 6;
                    doc.setTextColor(80, 80, 80);
                    doc.setFont('Arial', 'normal');
                    doc.text(producto.descripcion.substring(0, 30) + '...', x, y + 5);
                }
                
                columna++;
                if (columna >= productosColumnas) {
                    columna = 0;
                    x = 20;
                    y += 50;
                } else {
                    x += 85;
                }
            });
        }
        
        // Añadir pie de página
        doc.setFontSize(footerTamaño);
        doc.setTextColor(hexToRgb(footerColor));
        doc.setFont(footerFont.split(',')[0].replace(/['"]/g, ''), footerStyle.trim() || 'normal');
        doc.text(footerTexto, 105, 280, { align: 'center' });
        
        // Guardar PDF
        doc.save(`${nombreCatalogo.replace(/[^a-zA-Z0-9]/g, '_')}_diseñador.pdf`);
        mostrarNotificacion('PDF generado desde el diseñador', 'success');
    } catch (error) {
        console.error('Error generando PDF:', error);
        mostrarNotificacion('Error al generar PDF: ' + error.message, 'error');
    }
}

// Exportar HTML interactivo
function exportarHTML() {
    try {
        console.log('🚀 Iniciando exportación HTML...');
        
        const nombreCatalogo = document.getElementById('nombreCatalogo').value || 'Catálogo Éter';
        const configuracion = obtenerConfiguracionDiseño();
        const productosSeleccionados = productos.filter(p => p.seleccionado);
        
        console.log('📦 Productos seleccionados:', productosSeleccionados.length);
        console.log('⚙️ Configuración:', configuracion);
        
        if (productosSeleccionados.length === 0) {
            mostrarNotificacion('❌ No hay productos seleccionados para exportar', 'warning');
            return;
        }
        
        // Solicitar número de teléfono con validación
        let telefono = prompt('📱 Ingresa tu número de teléfono para WhatsApp (ej: +34612345678):');
        
        if (!telefono) {
            mostrarNotificacion('❌ Se requiere un número de teléfono para generar la tienda', 'warning');
            return;
        }
        
        // Limpiar y validar número de teléfono
        telefono = telefono.trim().replace(/\s+/g, '');
        
        if (!telefono.match(/^\+?[1-9]\d{1,14}$/)) {
            mostrarNotificacion('❌ Número de teléfono inválido. Usa formato: +34612345678', 'error');
            return;
        }
        
        console.log('📱 Teléfono validado:', telefono);
        
        // Mostrar notificación de procesamiento
        mostrarNotificacion('⚙️ Generando tienda online...', 'info');
        
        // Generar HTML con manejo de errores mejorado
        let htmlContent;
        try {
            htmlContent = generarHTMLTiendaOnline(nombreCatalogo, productosSeleccionados, configuracion, telefono);
        } catch (htmlError) {
            console.error('Error en generarHTMLTiendaOnline:', htmlError);
            htmlContent = generarHTMLFallback(nombreCatalogo, productosSeleccionados, telefono);
        }
        
        if (!htmlContent || htmlContent.length < 1000) {
            throw new Error('El HTML generado es demasiado pequeño o está vacío');
        }
        
        console.log('📄 HTML generado, tamaño:', htmlContent.length, 'caracteres');
        
        // Crear nombre de archivo seguro
        const filename = `${nombreCatalogo.replace(/[^a-zA-Z0-9]/g, '_')}_tienda_${Date.now()}.html`;
        
        // Descargar archivo
        descargarArchivo(htmlContent, filename, 'text/html; charset=utf-8');
        
        console.log('✅ Archivo descargado:', filename);
        mostrarNotificacion('✅ Tienda online HTML generada exitosamente', 'success');
        
        // Mostrar información adicional
        setTimeout(() => {
            mostrarNotificacion(`📁 Archivo: ${filename}`, 'info');
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error en exportación HTML:', error);
        mostrarNotificacion(`❌ Error al generar HTML: ${error.message}`, 'error');
        
        // Intentar descarga alternativa con mejor manejo de errores
        try {
            const nombreCatalogo = document.getElementById('nombreCatalogo').value || 'Catálogo Éter';
            const productosSeleccionados = productos.filter(p => p.seleccionado);
            const telefono = '+34612345678'; // Teléfono por defecto
            
            const fallbackContent = generarHTMLFallback(nombreCatalogo, productosSeleccionados, telefono);
            const filename = `${nombreCatalogo.replace(/[^a-zA-Z0-9]/g, '_')}_tienda_simple.html`;
            descargarArchivo(fallbackContent, filename, 'text/html; charset=utf-8');
            mostrarNotificacion('✅ Se generó una versión simplificada', 'success');
        } catch (fallbackError) {
            console.error('❌ Error en fallback:', fallbackError);
            mostrarNotificacion('❌ No se pudo generar el archivo HTML. Verifica que hay productos seleccionados.', 'error');
        }
    }
}

// Generar HTML de tienda online mejorado
function generarHTMLTiendaOnline(nombreCatalogo, productos, configuracion, telefono) {
    const headerTexto = configuracion.header?.texto || nombreCatalogo || 'Catálogo Éter';
    const mostrarDescripcion = configuracion.productos?.mostrarDescripcion !== false;
    const mostrarCategoria = configuracion.productos?.mostrarCategoria !== false;
    const precioColor = configuracion.productos?.precioColor || '#00aa00';
    
    // Generar IDs únicos y consistentes para los productos
    const productosConIds = productos.map((producto, index) => ({
        ...producto,
        id: `prod_${Date.now()}_${index}_${Math.floor(Math.random() * 1000)}`
    }));

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${headerTexto} - Tienda Online</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <style>
        /* ===== RESET Y CONFIGURACIÓN BASE ===== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary-color: #667eea;
            --secondary-color: #764ba2;
            --accent-color: #f093fb;
            --success-color: #4facfe;
            --warning-color: #f093fb;
            --danger-color: #ff6b6b;
            --text-dark: #2d3748;
            --text-light: #718096;
            --bg-light: #f7fafc;
            --bg-white: #ffffff;
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            --shadow-md: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
            --shadow-lg: 0 10px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1);
            --shadow-xl: 0 20px 40px rgba(0,0,0,0.1);
            --border-radius: 12px;
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, var(--bg-light) 0%, #e2e8f0 100%);
            color: var(--text-dark);
            line-height: 1.6;
            min-height: 100vh;
        }

        /* ===== HEADER MEJORADO ===== */
        .header {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            color: white;
            padding: 1rem 0;
            box-shadow: var(--shadow-lg);
            position: sticky;
            top: 0;
            z-index: 1000;
            backdrop-filter: blur(10px);
        }

        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 800;
            background: linear-gradient(45deg, #fff, #f0f0f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .cart-icon {
            position: relative;
            background: rgba(255,255,255,0.2);
            padding: 0.75rem;
            border-radius: 50%;
            cursor: pointer;
            transition: var(--transition);
            backdrop-filter: blur(10px);
        }

        .cart-icon:hover {
            background: rgba(255,255,255,0.3);
            transform: scale(1.1);
        }

        .cart-count {
            position: absolute;
            top: -8px;
            right: -8px;
            background: var(--danger-color);
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 600;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        /* ===== HERO SECTION ===== */
        .hero-section {
            background: linear-gradient(135deg, var(--accent-color) 0%, var(--success-color) 100%);
            color: white;
            padding: 4rem 2rem;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
            animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }

        .hero-content {
            position: relative;
            z-index: 1;
        }

        .hero-title {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 1rem;
            text-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .hero-subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 2rem;
        }

        .hero-badges {
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .hero-badge {
            background: rgba(255,255,255,0.2);
            padding: 0.5rem 1rem;
            border-radius: 25px;
            font-size: 0.9rem;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
        }

        /* ===== MAIN CONTENT ===== */
        .main-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 2rem;
        }

        /* ===== PRODUCTS GRID ===== */
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }

        .product-card {
            background: var(--bg-white);
            border-radius: var(--border-radius);
            overflow: hidden;
            box-shadow: var(--shadow-md);
            transition: var(--transition);
            position: relative;
            border: 2px solid transparent;
        }

        .product-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-xl);
            border-color: var(--primary-color);
        }

        .product-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
            transition: left 0.5s;
        }

        .product-card:hover::before {
            left: 100%;
        }

        .product-image {
            position: relative;
            height: 250px;
            overflow: hidden;
            background: linear-gradient(45deg, #f8f9fa, #e9ecef);
        }

        .product-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .product-card:hover .product-image img {
            transform: scale(1.1);
        }

        .product-placeholder {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            font-size: 4rem;
            color: #ccc;
        }

        .product-info {
            padding: 1.5rem;
        }

        .product-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 1rem;
            line-height: 1.3;
        }

        .product-details {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }

        .product-size,
        .product-category {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            color: var(--text-light);
            font-weight: 500;
        }

        .product-size i,
        .product-category i {
            color: var(--primary-color);
        }

        .product-price {
            font-size: 1.8rem;
            font-weight: 800;
            color: ${precioColor};
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .product-price::before {
            content: '💰';
            font-size: 1.2rem;
        }

        .product-description {
            font-size: 0.9rem;
            color: var(--text-light);
            line-height: 1.5;
            margin-bottom: 1.5rem;
            font-style: italic;
            background: #f8f9fa;
            padding: 0.75rem;
            border-radius: 8px;
            border-left: 4px solid var(--primary-color);
        }

        .add-to-cart-btn {
            width: 100%;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            color: white;
            border: none;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
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
            transition: left 0.5s;
        }

        .add-to-cart-btn:hover::before {
            left: 100%;
        }

        .add-to-cart-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }

        .add-to-cart-btn.added {
            background: linear-gradient(135deg, var(--success-color) 0%, #00d4aa 100%);
            animation: addedPulse 0.6s ease-out;
        }

        @keyframes addedPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        /* ===== CART MODAL ===== */
        .cart-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(5px);
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }

        .cart-modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .cart-content {
            background: var(--bg-white);
            border-radius: var(--border-radius);
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
            box-shadow: var(--shadow-xl);
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .cart-header {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            color: white;
            padding: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .cart-header h2 {
            font-size: 1.5rem;
            font-weight: 700;
        }

        .cart-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .cart-close:hover {
            background: rgba(255,255,255,0.3);
            transform: scale(1.1);
        }

        .cart-items {
            max-height: 400px;
            overflow-y: auto;
            padding: 1rem;
        }

        .cart-item {
            display: flex;
            gap: 1rem;
            padding: 1rem;
            border-bottom: 1px solid #e2e8f0;
            animation: slideInUp 0.3s ease;
        }

        @keyframes slideInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .cart-item:last-child {
            border-bottom: none;
        }

        .cart-item-image {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            overflow: hidden;
            flex-shrink: 0;
        }

        .cart-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .cart-item-info {
            flex-grow: 1;
        }

        .cart-item-title {
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 0.5rem;
        }

        .cart-item-details {
            font-size: 0.9rem;
            color: var(--text-light);
            margin-bottom: 0.5rem;
        }

        .cart-item-price {
            font-weight: 600;
            color: ${precioColor};
        }

        .cart-total {
            background: #f8f9fa;
            padding: 1.5rem;
            border-top: 2px solid #e2e8f0;
        }

        .cart-total-amount {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--text-dark);
            text-align: center;
            margin-bottom: 1rem;
        }

        .whatsapp-btn {
            width: 100%;
            background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
            color: white;
            border: none;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: relative;
            overflow: hidden;
        }

        .whatsapp-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }

        .whatsapp-btn:hover::before {
            left: 100%;
        }

        .whatsapp-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }

        .empty-cart {
            text-align: center;
            padding: 3rem 1rem;
            color: var(--text-light);
        }

        .empty-cart i {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }

        /* ===== NOTIFICATIONS ===== */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-white);
            border-radius: var(--border-radius);
            padding: 1rem 1.5rem;
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            min-width: 300px;
            border-left: 4px solid var(--primary-color);
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification.success {
            border-left-color: var(--success-color);
        }

        .notification.error {
            border-left-color: var(--danger-color);
        }

        .notification.warning {
            border-left-color: var(--warning-color);
        }

        .notification-icon {
            font-size: 1.2rem;
        }

        .notification.success .notification-icon {
            color: var(--success-color);
        }

        .notification.error .notification-icon {
            color: var(--danger-color);
        }

        .notification.warning .notification-icon {
            color: var(--warning-color);
        }

        .notification-message {
            flex-grow: 1;
            font-weight: 500;
        }

        /* ===== RESPONSIVE DESIGN ===== */
        @media (max-width: 768px) {
            .hero-title {
                font-size: 2rem;
            }
            
            .products-grid {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
            
            .header-content {
                padding: 0 1rem;
            }
            
            .main-content {
                padding: 2rem 1rem;
            }
            
            .cart-content {
                width: 95%;
                margin: 1rem;
            }
            
            .notification {
                right: 10px;
                left: 10px;
                min-width: auto;
            }
        }

        /* ===== DEBUGGING STYLES ===== */
        .debug-info {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            font-family: monospace;
            font-size: 0.8rem;
            z-index: 1000;
            max-width: 300px;
        }

        .debug-info h4 {
            margin-bottom: 0.5rem;
            color: #4facfe;
        }

        .debug-info p {
            margin-bottom: 0.25rem;
        }

        .test-button {
            position: fixed;
            top: 20px;
            left: 20px;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: white;
            border: none;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            z-index: 1000;
            transition: var(--transition);
        }

        .test-button:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <div class="logo">${headerTexto}</div>
            <div class="cart-icon" onclick="toggleCart()">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count" id="cartCount">0</span>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-content">
            <h1 class="hero-title">¡Bienvenido a ${headerTexto}!</h1>
            <p class="hero-subtitle">Descubre nuestra increíble colección de productos</p>
            <div class="hero-badges">
                <span class="hero-badge">🚚 Envío rápido</span>
                <span class="hero-badge">💳 Pago seguro</span>
                <span class="hero-badge">📱 WhatsApp</span>
            </div>
        </div>
    </section>

    <!-- Main Content -->
    <main class="main-content">
        <div class="products-grid">
            ${productosConIds.map((producto, index) => `
                <div class="product-card" data-product-id="${producto.id}">
                    <div class="product-image">
                        ${producto.imagen ? 
                            `<img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">` : 
                            `<div class="product-placeholder"><i class="fas fa-image"></i></div>`
                        }
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${producto.nombre}</h3>
                        <div class="product-details">
                            <span class="product-size">
                                <i class="fas fa-ruler"></i>
                                ${producto.talle}
                            </span>
                            ${mostrarCategoria ? `
                                <span class="product-category">
                                    <i class="fas fa-tag"></i>
                                    ${producto.categoria}
                                </span>
                            ` : ''}
                        </div>
                        <div class="product-price">$${producto.precio}</div>
                        ${mostrarDescripcion && producto.descripcion ? `
                            <p class="product-description">${producto.descripcion}</p>
                        ` : ''}
                        <button class="add-to-cart-btn" onclick="addToCart('${producto.id}')" data-product-id="${producto.id}" data-product-name="${producto.nombre}">
                            <i class="fas fa-plus"></i>
                            <span class="btn-text">Añadir al Carrito</span>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    </main>

    <!-- Cart Modal -->
    <div class="cart-modal" id="cartModal">
        <div class="cart-content">
            <div class="cart-header">
                <h2><i class="fas fa-shopping-cart"></i> Tu Carrito</h2>
                <button class="cart-close" onclick="toggleCart()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="cart-items" id="cartItems">
                <!-- Cart items will be inserted here -->
            </div>
            <div class="cart-total">
                <div class="cart-total-amount" id="cartTotal">Total: $0.00</div>
                <button class="whatsapp-btn" onclick="sendToWhatsApp()">
                    <i class="fab fa-whatsapp"></i>
                    Enviar Pedido por WhatsApp
                </button>
            </div>
        </div>
    </div>

    <!-- Test Button -->
    <button class="test-button" onclick="testCart()">
        🧪 Test Carrito
    </button>

    <!-- Debug Info -->
    <div class="debug-info" id="debugInfo">
        <h4>🔧 Debug Info</h4>
        <p>Productos: <span id="debugProducts">0</span></p>
        <p>Carrito: <span id="debugCart">0</span></p>
        <p>Teléfono: <span id="debugPhone">${telefono}</span></p>
    </div>

    <script>
        // ===== VARIABLES GLOBALES =====
        let products = ${JSON.stringify(productosConIds).replace(/`/g, '\\`').replace(/\$/g, '\\$')};
        let cart = [];
        let telefono = '${telefono}';
        let headerTexto = '${headerTexto}';

        // ===== FUNCIONES PRINCIPALES =====
        
        function addToCart(productId) {
            console.log('🔍 Buscando producto con ID:', productId);
            console.log('📦 Productos disponibles:', products);
            
            const product = products.find(p => p.id === productId);
            
            if (product) {
                console.log('✅ Producto encontrado:', product);
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                    console.log('📈 Cantidad aumentada para:', product.nombre);
                } else {
                    cart.push({
                        ...product,
                        quantity: 1
                    });
                    console.log('🆕 Producto añadido al carrito:', product.nombre);
                }
                
                // Feedback visual del botón
                const button = document.querySelector(\`[data-product-id="\${productId}"]\`);
                if (button) {
                    button.classList.add('added');
                    const btnText = button.querySelector('.btn-text');
                    if (btnText) {
                        btnText.textContent = '¡Añadido!';
                    }
                    
                    setTimeout(() => {
                        button.classList.remove('added');
                        if (btnText) {
                            btnText.textContent = 'Añadir al Carrito';
                        }
                    }, 1000);
                }
                
                updateCartDisplay();
                showNotification(\`✅ \${product.nombre} añadido al carrito\`);
                console.log('🛒 Carrito actualizado:', cart);
            } else {
                console.error('❌ Producto no encontrado con ID:', productId);
                console.log('🔍 IDs disponibles:', products.map(p => p.id));
                showNotification(\`❌ Error: No se encontró el producto (ID: \${productId})\`, 'error');
            }
        }

        function updateCartDisplay() {
            const cartCount = document.getElementById('cartCount');
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            const debugCart = document.getElementById('debugCart');
            
            if (cartCount) {
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = totalItems;
            }
            
            if (cartItems) {
                if (cart.length === 0) {
                    cartItems.innerHTML = \`
                        <div class="empty-cart">
                            <i class="fas fa-shopping-cart"></i>
                            <p>Tu carrito está vacío</p>
                        </div>
                    \`;
                } else {
                    cartItems.innerHTML = cart.map(item => \`
                        <div class="cart-item">
                            <div class="cart-item-image">
                                <img src="\${item.imagen}" alt="\${item.nombre}">
                            </div>
                            <div class="cart-item-info">
                                <div class="cart-item-title">\${item.nombre}</div>
                                <div class="cart-item-details">
                                    Talla: \${item.talle} | Cantidad: \${item.quantity}
                                </div>
                                <div class="cart-item-price">$$\${(parseFloat(item.precio) * item.quantity).toFixed(2)}</div>
                            </div>
                        </div>
                    \`).join('');
                }
            }
            
            if (cartTotal) {
                const total = cart.reduce((sum, item) => sum + (parseFloat(item.precio) * item.quantity), 0);
                cartTotal.textContent = \`Total: $\${total.toFixed(2)}\`;
            }
            
            if (debugCart) {
                debugCart.textContent = cart.length;
            }
        }

        function toggleCart() {
            const modal = document.getElementById('cartModal');
            modal.classList.toggle('active');
        }

        function sendToWhatsApp() {
            if (cart.length === 0) {
                showNotification('❌ Tu carrito está vacío', 'warning');
                return;
            }
            
            const message = generateWhatsAppMessage();
            const url = \`https://wa.me/\${telefono}?text=\${encodeURIComponent(message)}\`;
            
            console.log('📱 Enviando a WhatsApp:', url);
            window.open(url, '_blank');
        }

        function generateWhatsAppMessage() {
            const items = cart.map(item => 
                \`• \${item.nombre} (Talla: \${item.talle}) - Cantidad: \${item.quantity} - $${(parseFloat(item.precio) * item.quantity).toFixed(2)}\`
            ).join('\\n');
            
            const total = cart.reduce((sum, item) => sum + (parseFloat(item.precio) * item.quantity), 0);
            
            return \`🛍️ *Nuevo Pedido - \${headerTexto}*

*Productos solicitados:*
\${items}

*Total del pedido: $${total.toFixed(2)}*

¡Hola! Me gustaría realizar este pedido. ¿Podrías confirmar la disponibilidad y el proceso de pago?

Gracias! 😊\`;
        }

        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = \`notification \${type}\`;
            
            const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : '⚠';
            const iconClass = type === 'success' ? 'fas fa-check' : type === 'error' ? 'fas fa-times' : 'fas fa-exclamation-triangle';
            
            notification.innerHTML = \`
                <i class="notification-icon \${iconClass}"></i>
                <span class="notification-message">\${message}</span>
            \`;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        function testCart() {
            console.log('🧪 Iniciando prueba del carrito...');
            console.log('📦 Productos disponibles:', products);
            console.log('🛒 Carrito actual:', cart);
            
            if (products.length > 0) {
                const firstProduct = products[0];
                console.log('🎯 Probando con primer producto:', firstProduct);
                console.log('🆔 ID del producto:', firstProduct.id);
                addToCart(firstProduct.id);
            } else {
                showNotification('⚠️ No hay productos para probar', 'warning');
            }
        }

        // ===== INICIALIZACIÓN =====
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🏪 Tienda inicializada con', products.length, 'productos');
            console.log('📦 Productos disponibles:', products);
            console.log('📱 Teléfono configurado:', telefono);
            console.log('📝 Header texto:', headerTexto);
            
            // Mostrar IDs de productos para debugging
            if (products.length > 0) {
                console.log('🆔 IDs de productos:');
                products.forEach((product, index) => {
                    console.log(\`  \${index + 1}. \${product.nombre} - ID: \${product.id}\`);
                });
            }
            
            // Inicializar carrito
            updateCartDisplay();
            
            // Actualizar debug info
            const debugProducts = document.getElementById('debugProducts');
            if (debugProducts) {
                debugProducts.textContent = products.length;
            }
            
            // Verificar que todos los elementos del DOM estén disponibles
            setTimeout(() => {
                const cartCount = document.getElementById('cartCount');
                const cartItems = document.getElementById('cartItems');
                const cartTotal = document.getElementById('cartTotal');
                
                if (cartCount && cartItems && cartTotal) {
                    console.log('✅ Todos los elementos del carrito están disponibles');
                } else {
                    console.error('❌ Faltan elementos del carrito:', { cartCount, cartItems, cartTotal });
                }
                
                // Verificar productos en el DOM
                const productCards = document.querySelectorAll('.product-card');
                const addButtons = document.querySelectorAll('.add-to-cart-btn');
                
                console.log('📦 Productos en el DOM:', productCards.length);
                console.log('🔘 Botones de añadir:', addButtons.length);
                
                if (productCards.length !== products.length) {
                    console.warn('⚠️ Número de productos en DOM no coincide con products array');
                }
                
                // Verificar que cada botón tenga el ID correcto
                addButtons.forEach((button, index) => {
                    const productId = button.getAttribute('data-product-id');
                    const productName = button.getAttribute('data-product-name');
                    console.log(\`🔘 Botón \${index + 1}: ID="\${productId}", Nombre="\${productName}"\`);
                });
            }, 100);
        });

        // ===== EVENT LISTENERS =====
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('cart-modal') && e.target.id === 'cartModal') {
                toggleCart();
            }
        });

        // ===== UTILIDADES =====
        function formatPrice(price) {
            return parseFloat(price).toFixed(2);
        }

        function validateProduct(product) {
            return product && product.id && product.nombre && product.precio;
        }
    </script>
</body>
</html>`;

    return html;
}

// Función de fallback para generar HTML simplificado mejorada
function generarHTMLFallback(nombreCatalogo, productos, telefono) {
    console.log('🔄 Generando HTML de fallback mejorado...');
    
    if (!productos || productos.length === 0) {
        throw new Error('No hay productos para generar la tienda');
    }
    
    const productosConIds = productos.map((producto, index) => ({
        ...producto,
        id: `prod_${Date.now()}_${index}_${Math.floor(Math.random() * 1000)}`,
        nombre: producto.nombre || `Producto ${index + 1}`,
        precio: producto.precio || '0.00',
        talle: producto.talle || 'M',
        categoria: producto.categoria || 'Otros',
        descripcion: producto.descripcion || '',
        imagen: producto.imagen || ''
    }));

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${nombreCatalogo || 'Catálogo Éter'} - Tienda Online</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        body { 
            font-family: 'Poppins', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header { 
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            color: #333; 
            padding: 30px; 
            text-align: center; 
            margin-bottom: 30px; 
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .header p {
            font-size: 1.1rem;
            color: #666;
        }
        
        .products { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
            gap: 25px; 
            margin-bottom: 30px;
        }
        
        .product { 
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 25px; 
            border-radius: 20px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        
        .product:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            border-color: #667eea;
        }
        
        .product img { 
            width: 100%; 
            height: 250px; 
            object-fit: cover; 
            border-radius: 15px; 
            margin-bottom: 20px;
            border: 2px solid #f0f0f0;
        }
        
        .product h3 { 
            margin-bottom: 15px; 
            color: #333; 
            font-size: 1.3rem;
            font-weight: 600;
        }
        
        .product p { 
            color: #666; 
            margin-bottom: 15px; 
            line-height: 1.6;
        }
        
        .product-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            font-size: 0.9rem;
            color: #888;
        }
        
        .price { 
            font-size: 1.8rem; 
            font-weight: 700; 
            color: #00aa00; 
            margin-bottom: 20px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        
        .add-btn { 
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white; 
            border: none; 
            padding: 15px 25px; 
            border-radius: 10px; 
            cursor: pointer; 
            width: 100%; 
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }
        
        .add-btn:hover { 
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }
        
        .cart { 
            position: fixed; 
            top: 20px; 
            right: 20px; 
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 25px; 
            border-radius: 20px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            min-width: 300px;
            border: 2px solid #f0f0f0;
        }
        
        .cart h3 {
            margin-bottom: 15px;
            color: #333;
            font-size: 1.2rem;
        }
        
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        
        .cart-item:last-child {
            border-bottom: none;
        }
        
        .whatsapp-btn { 
            background: linear-gradient(135deg, #25d366, #128c7e);
            color: white; 
            border: none; 
            padding: 15px 25px; 
            border-radius: 10px; 
            cursor: pointer; 
            margin-top: 15px;
            width: 100%;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
        }
        
        .whatsapp-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
        }
        
        @media (max-width: 768px) {
            .cart {
                position: static;
                margin-bottom: 20px;
            }
            
            .products {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><i class="fas fa-store"></i> ${nombreCatalogo || 'Catálogo Éter'}</h1>
            <p>Tienda Online Profesional</p>
        </div>
        
        <div class="cart" id="cart">
            <h3><i class="fas fa-shopping-cart"></i> Carrito (<span id="cartCount">0</span>)</h3>
            <div id="cartItems"></div>
            <div id="cartTotal" style="font-weight: 600; margin: 15px 0; font-size: 1.1rem;">Total: $0.00</div>
            <button class="whatsapp-btn" onclick="sendToWhatsApp()">
                <i class="fab fa-whatsapp"></i> Enviar por WhatsApp
            </button>
        </div>
        
        <div class="products">
            ${productosConIds.map(producto => `
            <div class="product">
                <img src="${producto.imagen || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7imqA8L3RleHQ+Cjwvc3ZnPgo='}" alt="${producto.nombre}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7imqA8L3RleHQ+Cjwvc3ZnPgo='">
                <h3>${producto.nombre}</h3>
                <div class="product-details">
                    <span><i class="fas fa-ruler"></i> Talla: ${producto.talle}</span>
                    <span><i class="fas fa-tag"></i> ${producto.categoria}</span>
                </div>
                ${producto.descripcion ? `<p>${producto.descripcion}</p>` : ''}
                <div class="price">$${parseFloat(producto.precio).toFixed(2)}</div>
                <button class="add-btn" onclick="addToCart('${producto.id}')">
                    <i class="fas fa-plus"></i> Añadir al Carrito
                </button>
            </div>
        `).join('')}
    </div>
    </div>

    <script>
        let products = ${JSON.stringify(productosConIds)};
        let cart = [];
        let telefono = '${telefono}';
        
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
                
                // Mostrar notificación visual
                const btn = event.target.closest('.add-btn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> ¡Añadido!';
                btn.style.background = 'linear-gradient(135deg, #00aa00, #008800)';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                }, 1500);
            }
        }
        
        function updateCart() {
            const cartCount = document.getElementById('cartCount');
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            
            if (!cartCount || !cartItems || !cartTotal) {
                console.error('Elementos del carrito no encontrados');
                return;
            }
            
            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            
            cartItems.innerHTML = cart.map(item => 
                \`<div class="cart-item">
                    <span>\${item.nombre} x\${item.quantity}</span>
                    <span>$$\${(parseFloat(item.precio) * item.quantity).toFixed(2)}</span>
                </div>\`
            ).join('');
            
            const total = cart.reduce((sum, item) => sum + (parseFloat(item.precio) * item.quantity), 0);
            cartTotal.textContent = \`Total: $\${total.toFixed(2)}\`;
        }
        
        function sendToWhatsApp() {
            if (cart.length === 0) {
                alert('El carrito está vacío');
                return;
            }
            
            const message = \`Hola! Me gustaría hacer un pedido:\\n\\n\${cart.map(item => 
                \`• \${item.nombre} (Talla: \${item.talle}) x\${item.quantity} - $$\${(parseFloat(item.precio) * item.quantity).toFixed(2)}\`
            ).join('\\n')}\\n\\nTotal: $\${cart.reduce((sum, item) => sum + (parseFloat(item.precio) * item.quantity), 0).toFixed(2)}\`;
            
            const whatsappUrl = \`https://wa.me/\${telefono}?text=\${encodeURIComponent(message)}\`;
            window.open(whatsappUrl, '_blank');
        }
        
        // Inicializar carrito
        updateCart();
        
        // Manejar errores de imágenes
        document.querySelectorAll('img').forEach(img => {
            img.onerror = function() {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7imqA8L3RleHQ+Cjwvc3ZnPgo=';
            };
        });
    </script>
</body>
</html>`;
}

// ===== FUNCIONES PARA LA TIENDA ONLINE =====

// Función para actualizar la vista previa de la tienda online
function actualizarTiendaOnline() {
    console.log('🔄 Actualizando vista previa de tienda online...');
    
    const productosSeleccionados = productos.filter(p => p.seleccionado);
    const nombreCatalogo = document.getElementById('nombreCatalogo').value || 'Catálogo Éter';
    const configuracion = obtenerConfiguracionDiseño();
    
    if (productosSeleccionados.length === 0) {
        mostrarEstadoVacioTienda();
        return;
    }
    
    try {
        const htmlContent = generarTiendaOnlineCompleta(nombreCatalogo, productosSeleccionados, configuracion);
        mostrarTiendaOnline(htmlContent);
        mostrarNotificacion('✅ Vista previa de tienda online actualizada', 'success');
    } catch (error) {
        console.error('❌ Error al actualizar tienda online:', error);
        mostrarNotificacion('❌ Error al actualizar tienda online: ' + error.message, 'error');
    }
}

// Función para generar la tienda online completa
function generarTiendaOnlineCompleta(nombreCatalogo, productos, configuracion) {
    console.log('🏪 Generando tienda online completa...');
    
    const productosConIds = productos.map((producto, index) => ({
        ...producto,
        id: `prod_${Date.now()}_${index}_${Math.floor(Math.random() * 1000)}`,
        nombre: producto.nombre || `Producto ${index + 1}`,
        precio: producto.precio || '0.00',
        talle: producto.talle || 'M',
        categoria: producto.categoria || 'Otros',
        descripcion: producto.descripcion || '',
        imagen: producto.imagen || ''
    }));

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${nombreCatalogo} - Tienda Online Profesional</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        /* Header de la tienda */
        .store-header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            margin-bottom: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .store-title {
            font-size: 3rem;
            font-weight: 900;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .store-subtitle {
            font-size: 1.2rem;
            color: #666;
            font-weight: 400;
        }
        
        /* Carrito flotante */
        .floating-cart {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            padding: 1.5rem;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            min-width: 300px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            z-index: 1000;
        }
        
        .cart-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
            font-weight: 600;
            color: #333;
        }
        
        .cart-count {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }
        
        .cart-items {
            max-height: 200px;
            overflow-y: auto;
            margin-bottom: 1rem;
        }
        
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid #eee;
        }
        
        .cart-item:last-child {
            border-bottom: none;
        }
        
        .cart-total {
            font-weight: 700;
            font-size: 1.2rem;
            color: #333;
            margin-bottom: 1rem;
            text-align: center;
        }
        
        .whatsapp-btn {
            background: linear-gradient(135deg, #25d366, #128c7e);
            color: white;
            border: none;
            padding: 1rem 1.5rem;
            border-radius: 15px;
            cursor: pointer;
            width: 100%;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .whatsapp-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3);
        }
        
        /* Grid de productos */
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .product-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .product-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 30px 60px rgba(0,0,0,0.15);
        }
        
        .product-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        
        .product-card:hover .product-image {
            transform: scale(1.05);
        }
        
        .product-content {
            padding: 2rem;
        }
        
        .product-title {
            font-size: 1.4rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #333;
            line-height: 1.3;
        }
        
        .product-details {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            color: #666;
        }
        
        .product-detail {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .product-description {
            color: #666;
            margin-bottom: 1.5rem;
            line-height: 1.6;
            font-style: italic;
        }
        
        .product-price {
            font-size: 2rem;
            font-weight: 800;
            color: #00aa00;
            margin-bottom: 1.5rem;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        
        .add-to-cart-btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 15px;
            cursor: pointer;
            width: 100%;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .add-to-cart-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }
        
        .add-to-cart-btn.added {
            background: linear-gradient(135deg, #00aa00, #008800);
        }
        
        /* Footer */
        .store-footer {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .footer-text {
            color: #666;
            font-weight: 500;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .floating-cart {
                position: static;
                margin-bottom: 2rem;
            }
            
            .products-grid {
                grid-template-columns: 1fr;
            }
            
            .store-title {
                font-size: 2rem;
            }
            
            .container {
                padding: 10px;
            }
        }
        
        /* Animaciones */
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
    </style>
</head>
<body>
    <div class="container">
        <!-- Header de la tienda -->
        <div class="store-header">
            <h1 class="store-title">
                <i class="fas fa-store"></i> ${nombreCatalogo}
            </h1>
            <p class="store-subtitle">Tienda Online Profesional</p>
        </div>
        
        <!-- Carrito flotante -->
        <div class="floating-cart" id="cart">
            <div class="cart-header">
                <i class="fas fa-shopping-cart"></i>
                Carrito (<span id="cartCount">0</span>)
            </div>
            <div class="cart-items" id="cartItems"></div>
            <div class="cart-total" id="cartTotal">Total: $0.00</div>
            <button class="whatsapp-btn" onclick="sendToWhatsApp()">
                <i class="fab fa-whatsapp"></i> Enviar Pedido
            </button>
        </div>
        
        <!-- Grid de productos -->
        <div class="products-grid">
            ${productosConIds.map(producto => `
            <div class="product-card">
                <img src="${producto.imagen || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDMwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTI1IiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7imqA8L3RleHQ+Cjwvc3ZnPgo='}" 
                     alt="${producto.nombre}" 
                     class="product-image"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDMwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTI1IiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7imqA8L3RleHQ+Cjwvc3ZnPgo='">
                <div class="product-content">
                    <h3 class="product-title">${producto.nombre}</h3>
                    <div class="product-details">
                        <span class="product-detail">
                            <i class="fas fa-ruler"></i> ${producto.talle}
                        </span>
                        <span class="product-detail">
                            <i class="fas fa-tag"></i> ${producto.categoria}
                        </span>
                    </div>
                    ${producto.descripcion ? `<p class="product-description">${producto.descripcion}</p>` : ''}
                    <div class="product-price">$${parseFloat(producto.precio).toFixed(2)}</div>
                    <button class="add-to-cart-btn" onclick="addToCart('${producto.id}')" data-product-id="${producto.id}">
                        <i class="fas fa-plus"></i> Añadir al Carrito
                    </button>
                </div>
            </div>
        `).join('')}
        </div>
        
        <!-- Footer -->
        <div class="store-footer">
            <p class="footer-text">
                <i class="fas fa-heart"></i> Generado con Éter Studio
            </p>
        </div>
    </div>

    <script>
        let products = ${JSON.stringify(productosConIds)};
        let cart = [];
        let telefono = '+34612345678'; // Número por defecto
        
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
                
                // Efecto visual
                const btn = event.target.closest('.add-to-cart-btn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> ¡Añadido!';
                btn.classList.add('added');
                
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
            
            cartItems.innerHTML = cart.map(item => 
                \`<div class="cart-item">
                    <span>\${item.nombre} x\${item.quantity}</span>
                    <span>$$\${(parseFloat(item.precio) * item.quantity).toFixed(2)}</span>
                </div>\`
            ).join('');
            
            const total = cart.reduce((sum, item) => sum + (parseFloat(item.precio) * item.quantity), 0);
            cartTotal.textContent = \`Total: $\${total.toFixed(2)}\`;
        }
        
        function sendToWhatsApp() {
            if (cart.length === 0) {
                alert('El carrito está vacío');
                return;
            }
            
            const message = \`🛍️ *Nuevo Pedido - ${nombreCatalogo}*

*Productos solicitados:*
\${cart.map(item => 
    \`• \${item.nombre} (Talla: \${item.talle}) x\${item.quantity} - $$\${(parseFloat(item.precio) * item.quantity).toFixed(2)}\`
).join('\\n')}

*Total del pedido: $\${cart.reduce((sum, item) => sum + (parseFloat(item.precio) * item.quantity), 0).toFixed(2)}*

¡Hola! Me gustaría realizar este pedido. ¿Podrías confirmar la disponibilidad y el proceso de pago?

Gracias! 😊\`;
            
            const whatsappUrl = \`https://wa.me/\${telefono}?text=\${encodeURIComponent(message)}\`;
            window.open(whatsappUrl, '_blank');
        }
        
        // Inicializar carrito
        updateCart();
        
        // Manejar errores de imágenes
        document.querySelectorAll('.product-image').forEach(img => {
            img.onerror = function() {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDMwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTI1IiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7imqA8L3RleHQ+Cjwvc3ZnPgo=';
            };
        });
    </script>
</body>
</html>`;
}

function mostrarTiendaEnFrame(htmlContent) {
    const frame = document.getElementById('previewFrame');
    if (!frame) {
        console.error('Frame de vista previa no encontrado');
        return;
    }
    
    // Crear un iframe para mostrar la tienda
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
    document.getElementById('productCount').textContent = productosSeleccionados.length;
    
    // Calcular uso de memoria simulado
    const memoryUsage = (Math.random() * 2 + 1.5).toFixed(1);
    document.getElementById('memoryUsage').textContent = memoryUsage + ' MB';
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
    
    // Simular proceso de publicación
    mostrarNotificacion('🔄 Preparando publicación...', 'info');
    
    setTimeout(() => {
        mostrarNotificacion('✅ Tienda publicada exitosamente en la nube', 'success');
    }, 2000);
}

// ===== FUNCIONES DE NOTIFICACIÓN =====

function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <i class="fas ${getIconoTipo(tipo)}"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    document.body.appendChild(notificacion);
    
    // Mostrar notificación
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 100);
    
    // Ocultar notificación
    setTimeout(() => {
        notificacion.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

function getIconoTipo(tipo) {
    const iconos = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return iconos[tipo] || iconos.info;
}

// ===== EDITOR PROFESIONAL ÉTER STUDIO =====

// Productos de ejemplo predefinidos
const productosEjemplo = [
    {
        id: 'prod_1',
        nombre: 'Camiseta Vintage Éter',
        precio: '29.99',
        talle: 'M',
        categoria: 'Ropa',
        descripcion: 'Camiseta de algodón premium con diseño vintage único. Perfecta para cualquier ocasión.',
        imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        seleccionado: true
    },
    {
        id: 'prod_2',
        nombre: 'Jeans Slim Fit Premium',
        precio: '79.99',
        talle: 'L',
        categoria: 'Ropa',
        descripcion: 'Jeans de alta calidad con corte slim fit. Comodidad y estilo en una sola prenda.',
        imagen: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
        seleccionado: true
    },
    {
        id: 'prod_3',
        nombre: 'Sneakers Urban Éter',
        precio: '89.99',
        talle: '42',
        categoria: 'Calzado',
        descripcion: 'Sneakers urbanos con tecnología de amortiguación avanzada. Ideales para el día a día.',
        imagen: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
        seleccionado: true
    },
    {
        id: 'prod_4',
        nombre: 'Reloj Smart Éter Pro',
        precio: '199.99',
        talle: 'Único',
        categoria: 'Accesorios',
        descripcion: 'Reloj inteligente con funciones avanzadas de monitoreo de salud y conectividad.',
        imagen: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        seleccionado: true
    },
    {
        id: 'prod_5',
        nombre: 'Mochila Laptop Éter',
        precio: '59.99',
        talle: 'Único',
        categoria: 'Accesorios',
        descripcion: 'Mochila elegante con compartimento especial para laptop y múltiples bolsillos.',
        imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        seleccionado: true
    },
    {
        id: 'prod_6',
        nombre: 'Gafas de Sol Éter',
        precio: '129.99',
        talle: 'Único',
        categoria: 'Accesorios',
        descripcion: 'Gafas de sol premium con protección UV y diseño moderno. Perfectas para cualquier look.',
        imagen: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        seleccionado: true
    }
];

// Configuración por defecto del editor
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

// Inicialización del editor
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Éter Studio...');
    
    // Cargar productos de ejemplo
    productos.length = 0;
    productos.push(...productosEjemplo);
    
    // Inicializar navegación de configuración
    inicializarNavegacionConfig();
    
    // Inicializar controles de vista
    inicializarControlesVista();
    
    // Generar vista previa inicial
    actualizarTiendaEnTiempoReal();
    
    // Actualizar contadores
    actualizarContadores();
    
    console.log('✅ Éter Studio iniciado correctamente');
});

// ===== FUNCIONES DE NAVEGACIÓN =====

function inicializarNavegacionConfig() {
    const navItems = document.querySelectorAll('.nav-item');
    const configSections = document.querySelectorAll('.config-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            
            // Remover activo de todos los elementos
            navItems.forEach(nav => nav.classList.remove('active'));
            configSections.forEach(section => section.classList.remove('active'));
            
            // Activar elemento seleccionado
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

function aplicarVistaResponsive(view, frame) {
    const views = {
        desktop: { width: '100%', height: '100%' },
        tablet: { width: '768px', height: '1024px' },
        mobile: { width: '375px', height: '667px' }
    };
    
    const config = views[view];
    frame.style.width = config.width;
    frame.style.height = config.height;
    frame.style.margin = view === 'desktop' ? '0' : '0 auto';
    frame.style.border = view === 'desktop' ? 'none' : '2px solid var(--border-primary)';
}

// ===== FUNCIONES DE CONFIGURACIÓN =====

function actualizarTiendaEnTiempoReal() {
    console.log('🔄 Actualizando tienda en tiempo real...');
    
    // Recopilar configuración actual
    recopilarConfiguracion();
    
    // Generar HTML de la tienda
    const htmlContent = generarTiendaAvanzada();
    
    // Mostrar en el frame
    mostrarTiendaEnFrame(htmlContent);
    
    // Actualizar contadores
    actualizarContadores();
    
    // Actualizar timestamp
    document.getElementById('lastUpdate').textContent = 'Ahora';
    
    console.log('✅ Tienda actualizada');
}

function recopilarConfiguracion() {
    configuracionEditor = {
        general: {
            storeName: document.getElementById('storeName').value,
            storeDescription: document.getElementById('storeDescription').value,
            storeLogo: document.getElementById('storeLogo').value,
            whatsappNumber: document.getElementById('whatsappNumber').value
        },
        header: {
            bgColor: document.getElementById('headerBgColor').value,
            textColor: document.getElementById('headerTextColor').value,
            fontSize: parseInt(document.getElementById('headerFontSize').value),
            showLogo: document.getElementById('showLogo').checked
        },
        products: {
            columns: parseInt(document.getElementById('productColumns').value),
            spacing: parseInt(document.getElementById('productSpacing').value),
            priceColor: document.getElementById('priceColor').value,
            showCategories: document.getElementById('showCategories').checked,
            showDescriptions: document.getElementById('showDescriptions').checked
        },
        cart: {
            position: document.getElementById('cartPosition').value,
            color: document.getElementById('cartColor').value,
            showCount: document.getElementById('showCartCount').checked,
            autoHide: document.getElementById('autoHideCart').checked
        },
        theme: {
            preset: document.querySelector('.theme-preset.active').dataset.theme,
            primaryColor: document.getElementById('primaryColor').value,
            secondaryColor: document.getElementById('secondaryColor').value,
            backgroundColor: document.getElementById('backgroundColor').value
        },
        whatsapp: {
            message: document.getElementById('whatsappMessage').value,
            showNumber: document.getElementById('showWhatsappNumber').checked,
            color: document.getElementById('whatsappColor').value
        }
    };
}

function cambiarTema(tema) {
    console.log('🎨 Cambiando tema a:', tema);
    
    // Remover activo de todos los presets
    document.querySelectorAll('.theme-preset').forEach(preset => {
        preset.classList.remove('active');
    });
    
    // Activar preset seleccionado
    document.querySelector(`[data-theme="${tema}"]`).classList.add('active');
    
    // Aplicar configuración del tema
    const temas = {
        modern: {
            primaryColor: '#667eea',
            secondaryColor: '#764ba2',
            backgroundColor: '#f8f9fa'
        },
        elegant: {
            primaryColor: '#2c3e50',
            secondaryColor: '#34495e',
            backgroundColor: '#ecf0f1'
        },
        minimal: {
            primaryColor: '#6c757d',
            secondaryColor: '#495057',
            backgroundColor: '#ffffff'
        },
        colorful: {
            primaryColor: '#ff6b6b',
            secondaryColor: '#4ecdc4',
            backgroundColor: '#f8f9fa'
        }
    };
    
    const config = temas[tema];
    document.getElementById('primaryColor').value = config.primaryColor;
    document.getElementById('primaryColor').value = config.secondaryColor;
    document.getElementById('backgroundColor').value = config.backgroundColor;
    
    // Actualizar tienda
    actualizarTiendaEnTiempoReal();
}

// ===== FUNCIONES DE VISTA PREVIA =====

function generarTiendaAvanzada() {
    const productosSeleccionados = productos.filter(p => p.seleccionado);
    const config = configuracionEditor;
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.general.storeName}</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: ${config.theme.backgroundColor};
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        /* Header de la tienda */
        .store-header {
            background: ${config.header.bgColor};
            color: ${config.header.textColor};
            padding: 3rem 2rem;
            border-radius: 20px;
            text-align: center;
            margin-bottom: 3rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
        }
        
        .store-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        .store-title {
            font-size: ${config.header.fontSize}px;
            font-weight: 900;
            margin-bottom: 1rem;
            position: relative;
            z-index: 1;
        }
        
        .store-subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            font-weight: 400;
            position: relative;
            z-index: 1;
        }
        
        ${config.header.showLogo ? `
        .store-logo {
            margin-bottom: 2rem;
            position: relative;
            z-index: 1;
        }
        
        .store-logo img {
            max-height: 80px;
            max-width: 250px;
            object-fit: contain;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        ` : ''}
        
        /* Carrito flotante */
        .floating-cart {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            padding: 1.5rem;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            min-width: 300px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            z-index: 1000;
            ${config.cart.autoHide ? 'opacity: 0; transform: translateY(-20px); transition: all 0.3s ease;' : ''}
        }
        
        .floating-cart:hover {
            ${config.cart.autoHide ? 'opacity: 1; transform: translateY(0);' : ''}
        }
        
        .cart-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
            font-weight: 600;
            color: #333;
        }
        
        .cart-count {
            background: ${config.cart.color};
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }
        
        .cart-items {
            max-height: 200px;
            overflow-y: auto;
            margin-bottom: 1rem;
        }
        
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid #eee;
        }
        
        .cart-item:last-child {
            border-bottom: none;
        }
        
        .cart-total {
            font-weight: 700;
            font-size: 1.2rem;
            color: #333;
            margin-bottom: 1rem;
            text-align: center;
        }
        
        .whatsapp-btn {
            background: ${config.whatsapp.color};
            color: white;
            border: none;
            padding: 1rem 1.5rem;
            border-radius: 15px;
            cursor: pointer;
            width: 100%;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .whatsapp-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3);
        }
        
        /* Grid de productos */
        .products-grid {
            display: grid;
            grid-template-columns: repeat(${config.products.columns}, 1fr);
            gap: ${config.products.spacing}px;
            margin-bottom: 3rem;
        }
        
        .product-card {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: 2px solid transparent;
        }
        
        .product-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 30px 60px rgba(0,0,0,0.15);
            border-color: ${config.theme.primaryColor};
        }
        
        .product-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        
        .product-card:hover .product-image {
            transform: scale(1.05);
        }
        
        .product-content {
            padding: 2rem;
        }
        
        .product-title {
            font-size: 1.4rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #333;
            line-height: 1.3;
        }
        
        ${config.products.showCategories ? `
        .product-details {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            color: #666;
        }
        
        .product-detail {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        ` : ''}
        
        ${config.products.showDescriptions ? `
        .product-description {
            color: #666;
            margin-bottom: 1.5rem;
            line-height: 1.6;
            font-style: italic;
        }
        ` : ''}
        
        .product-price {
            font-size: 2rem;
            font-weight: 800;
            color: ${config.products.priceColor};
            margin-bottom: 1.5rem;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        
        .add-to-cart-btn {
            background: linear-gradient(135deg, ${config.theme.primaryColor}, ${config.theme.secondaryColor});
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 15px;
            cursor: pointer;
            width: 100%;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .add-to-cart-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }
        
        .add-to-cart-btn.added {
            background: linear-gradient(135deg, #00aa00, #008800);
        }
        
        /* Footer */
        .store-footer {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .footer-text {
            color: #666;
            font-weight: 500;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .floating-cart {
                position: static;
                margin-bottom: 2rem;
            }
            
            .products-grid {
                grid-template-columns: 1fr;
            }
            
            .store-title {
                font-size: 2rem;
            }
            
            .container {
                padding: 10px;
            }
        }
        
        /* Animaciones */
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
    </style>
</head>
<body>
    <div class="container">
        <!-- Header de la tienda -->
        <div class="store-header">
            ${config.header.showLogo && config.general.storeLogo ? `
            <div class="store-logo">
                <img src="${config.general.storeLogo}" alt="${config.general.storeName}">
            </div>
            ` : ''}
            <h1 class="store-title">
                <i class="fas fa-store"></i> ${config.general.storeName}
            </h1>
            <p class="store-subtitle">${config.general.storeDescription}</p>
        </div>
        
        <!-- Carrito flotante -->
        <div class="floating-cart" id="cart">
            <div class="cart-header">
                <i class="fas fa-shopping-cart"></i>
                Carrito ${config.cart.showCount ? '(<span id="cartCount">0</span>)' : ''}
            </div>
            <div class="cart-items" id="cartItems"></div>
            <div class="cart-total" id="cartTotal">Total: $0.00</div>
            <button class="whatsapp-btn" onclick="sendToWhatsApp()">
                <i class="fab fa-whatsapp"></i> Enviar Pedido
            </button>
        </div>
        
        <!-- Grid de productos -->
        <div class="products-grid">
            ${productosSeleccionados.map(producto => `
            <div class="product-card">
                <img src="${producto.imagen}" 
                     alt="${producto.nombre}" 
                     class="product-image"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDMwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTI1IiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7imqA8L3RleHQ+Cjwvc3ZnPgo='">
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
                    <div class="product-price">$${producto.precio}</div>
                    <button class="add-to-cart-btn" onclick="addToCart('${producto.id}')" data-product-id="${producto.id}">
                        <i class="fas fa-plus"></i> Añadir al Carrito
                    </button>
                </div>
            </div>
        `).join('')}
        </div>
        
        <!-- Footer -->
        <div class="store-footer">
            <p class="footer-text">
                <i class="fas fa-heart"></i> Generado con Éter Studio
            </p>
        </div>
    </div>

    <script>
        let products = ${JSON.stringify(productosSeleccionados)};
        let cart = [];
        let telefono = '${config.general.whatsappNumber}';
        
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
                
                // Efecto visual
                const btn = event.target.closest('.add-to-cart-btn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> ¡Añadido!';
                btn.classList.add('added');
                
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
            
            cartItems.innerHTML = cart.map(item => 
                \`<div class="cart-item">
                    <span>\${item.nombre} x\${item.quantity}</span>
                    <span>$$\${(parseFloat(item.precio) * item.quantity).toFixed(2)}</span>
                </div>\`
            ).join('');
            
            const total = cart.reduce((sum, item) => sum + (parseFloat(item.precio) * item.quantity), 0);
            cartTotal.textContent = \`Total: $\${total.toFixed(2)}\`;
        }
        
        function sendToWhatsApp() {
            if (cart.length === 0) {
                alert('El carrito está vacío');
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
        
        // Inicializar carrito
        updateCart();
        
        // Manejar errores de imágenes
        document.querySelectorAll('.product-image').forEach(img => {
            img.onerror = function() {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDMwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTI1IiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7imqA8L3RleHQ+Cjwvc3ZnPgo=';
            };
        });
    </script>
</body>
</html>`;
}

// ===== FUNCIONES DE NOTIFICACIÓN =====

function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <i class="fas ${getIconoTipo(tipo)}"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    document.body.appendChild(notificacion);
    
    // Mostrar notificación
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 100);
    
    // Ocultar notificación
    setTimeout(() => {
        notificacion.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

function getIconoTipo(tipo) {
    const iconos = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return iconos[tipo] || iconos.info;
}

// ===== EDITOR PROFESIONAL ÉTER STUDIO - V2.0 =====

// Productos de ejemplo predefinidos - Mejorados
const productosEjemplo = [
    {
        id: 'prod_1',
        nombre: 'Camiseta Vintage Éter',
        precio: '29.99',
        talle: 'M',
        categoria: 'Ropa',
        descripcion: 'Camiseta de algodón premium con diseño vintage único. Perfecta para cualquier ocasión.',
        imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        seleccionado: true,
        stock: 15,
        sku: 'CAM-VINT-001'
    },
    {
        id: 'prod_2',
        nombre: 'Jeans Slim Fit Premium',
        precio: '79.99',
        talle: 'L',
        categoria: 'Ropa',
        descripcion: 'Jeans de alta calidad con corte slim fit. Comodidad y estilo en una sola prenda.',
        imagen: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
        seleccionado: true,
        stock: 8,
        sku: 'JEA-SLIM-002'
    },
    {
        id: 'prod_3',
        nombre: 'Sneakers Urban Éter',
        precio: '89.99',
        talle: '42',
        categoria: 'Calzado',
        descripcion: 'Sneakers urbanos con tecnología de amortiguación avanzada. Ideales para el día a día.',
        imagen: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
        seleccionado: true,
        stock: 12,
        sku: 'SNE-URB-003'
    },
    {
        id: 'prod_4',
        nombre: 'Reloj Smart Éter Pro',
        precio: '199.99',
        talle: 'Único',
        categoria: 'Accesorios',
        descripcion: 'Reloj inteligente con funciones avanzadas de monitoreo de salud y conectividad.',
        imagen: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        seleccionado: true,
        stock: 5,
        sku: 'REL-SMT-004'
    },
    {
        id: 'prod_5',
        nombre: 'Mochila Laptop Éter',
        precio: '59.99',
        talle: 'Único',
        categoria: 'Accesorios',
        descripcion: 'Mochila elegante con compartimento especial para laptop y múltiples bolsillos.',
        imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        seleccionado: true,
        stock: 20,
        sku: 'MOC-LAP-005'
    },
    {
        id: 'prod_6',
        nombre: 'Gafas de Sol Éter',
        precio: '129.99',
        talle: 'Único',
        categoria: 'Accesorios',
        descripcion: 'Gafas de sol premium con protección UV y diseño moderno. Perfectas para cualquier look.',
        imagen: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        seleccionado: true,
        stock: 10,
        sku: 'GAF-SOL-006'
    }
];

// Configuración por defecto del editor - Mejorada
let configuracionEditor = {
    general: {
        storeName: 'Éter Fashion Store',
        storeDescription: 'Tu tienda de moda online con los mejores productos y diseños únicos.',
        storeLogo: '',
        whatsappNumber: '+34612345678',
        metaDescription: 'Descubre nuestra colección exclusiva de moda con los mejores precios y calidad premium.',
        metaKeywords: 'moda, ropa, accesorios, tienda online'
    },
    header: {
        bgColor: '#667eea',
        textColor: '#ffffff',
        fontSize: 48,
        showLogo: true,
        style: 'gradient',
        height: 300
    },
    products: {
        columns: 3,
        spacing: 20,
        priceColor: '#00aa00',
        showCategories: true,
        showDescriptions: true,
        cardStyle: 'modern',
        hoverEffects: 'lift',
        imageHeight: 250
    },
    cart: {
        position: 'fixed',
        color: '#667eea',
        showCount: true,
        autoHide: false,
        buttonStyle: 'rounded',
        addAnimation: 'bounce'
    },
    theme: {
        preset: 'modern',
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        backgroundColor: '#f8f9fa',
        textColor: '#333333',
        borderColor: '#e9ecef',
        shadowStyle: 'soft',
        borderRadius: 8
    },
    whatsapp: {
        message: '¡Hola! Me gustaría realizar este pedido. ¿Podrías confirmar la disponibilidad y el proceso de pago?',
        showNumber: true,
        color: '#25d366',
        position: 'bottom-right',
        size: 60,
        showMobile: true
    },
    advanced: {
        customCSS: '',
        customJS: '',
        customMeta: '',
        googleAnalytics: '',
        facebookPixel: '',
        seoOptimization: true,
        imageCompression: true,
        lazyLoading: true
    }
};

// Inicialización del editor - Mejorada
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Éter Studio v2.0...');
    
    try {
        // Cargar productos de ejemplo
        productos.length = 0;
        productos.push(...productosEjemplo);
        
        // Inicializar navegación de configuración
        inicializarNavegacionConfig();
        
        // Inicializar controles de vista
        inicializarControlesVista();
        
        // Inicializar controles de rango
        inicializarControlesRango();
        
        // Generar vista previa inicial
        actualizarTiendaEnTiempoReal();
        
        // Actualizar contadores
        actualizarContadores();
        
        // Configurar eventos de teclado
        configurarEventosTeclado();
        
        console.log('✅ Éter Studio v2.0 iniciado correctamente');
        
    } catch (error) {
        console.error('❌ Error al inicializar Éter Studio:', error);
        mostrarNotificacion('Error al inicializar el editor: ' + error.message, 'error');
    }
});

// ===== FUNCIONES DE NAVEGACIÓN - Mejoradas =====

function inicializarNavegacionConfig() {
    const navItems = document.querySelectorAll('.nav-item');
    const configSections = document.querySelectorAll('.config-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            
            // Remover activo de todos los elementos
            navItems.forEach(nav => nav.classList.remove('active'));
            configSections.forEach(section => section.classList.remove('active'));
            
            // Activar elemento seleccionado
            this.classList.add('active');
            document.getElementById(section).classList.add('active');
            
            // Efecto de transición
            document.getElementById(section).style.animation = 'fadeInUp 0.3s ease';
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
    // Configurar todos los controles de rango
    const rangeInputs = document.querySelectorAll('.config-range');
    
    rangeInputs.forEach(input => {
        const valueDisplay = input.parentElement.querySelector('.range-value');
        if (valueDisplay) {
            // Actualizar valor inicial
            actualizarValorRango(input, valueDisplay);
            
            // Configurar evento de cambio
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
    
    // Actualizar indicador de tamaño
    document.getElementById('previewSize').textContent = config.size;
}

// ===== FUNCIONES DE CONFIGURACIÓN - Mejoradas =====

function actualizarTiendaEnTiempoReal() {
    console.log('🔄 Actualizando tienda en tiempo real...');
    
    try {
        // Recopilar configuración actual
        recopilarConfiguracion();
        
        // Generar HTML de la tienda
        const htmlContent = generarTiendaAvanzada();
        
        // Mostrar en el frame
        mostrarTiendaEnFrame(htmlContent);
        
        // Actualizar contadores
        actualizarContadores();
        
        // Actualizar timestamp
        document.getElementById('lastUpdate').textContent = 'Ahora';
        
        // Actualizar puntuación de rendimiento
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
                whatsappNumber: document.getElementById('whatsappNumber')?.value || '+34612345678',
                metaDescription: document.getElementById('metaDescription')?.value || '',
                metaKeywords: document.getElementById('metaKeywords')?.value || ''
            },
            header: {
                bgColor: document.getElementById('headerBgColor')?.value || '#667eea',
                textColor: document.getElementById('headerTextColor')?.value || '#ffffff',
                fontSize: parseInt(document.getElementById('headerFontSize')?.value) || 48,
                showLogo: document.getElementById('showLogo')?.checked || true,
                style: document.getElementById('headerStyle')?.value || 'gradient',
                height: parseInt(document.getElementById('headerHeight')?.value) || 300
            },
            products: {
                columns: parseInt(document.getElementById('productColumns')?.value) || 3,
                spacing: parseInt(document.getElementById('productSpacing')?.value) || 20,
                priceColor: document.getElementById('priceColor')?.value || '#00aa00',
                showCategories: document.getElementById('showCategories')?.checked || true,
                showDescriptions: document.getElementById('showDescriptions')?.checked || true,
                cardStyle: document.getElementById('cardStyle')?.value || 'modern',
                hoverEffects: document.getElementById('hoverEffects')?.value || 'lift',
                imageHeight: parseInt(document.getElementById('imageHeight')?.value) || 250
            },
            cart: {
                position: document.getElementById('cartPosition')?.value || 'fixed',
                color: document.getElementById('cartColor')?.value || '#667eea',
                showCount: document.getElementById('showCartCount')?.checked || true,
                autoHide: document.getElementById('autoHideCart')?.checked || false,
                buttonStyle: document.getElementById('buttonStyle')?.value || 'rounded',
                addAnimation: document.getElementById('addAnimation')?.value || 'bounce'
            },
            theme: {
                preset: document.querySelector('.theme-preset.active')?.dataset.theme || 'modern',
                primaryColor: document.getElementById('primaryColor')?.value || '#667eea',
                secondaryColor: document.getElementById('secondaryColor')?.value || '#764ba2',
                backgroundColor: document.getElementById('backgroundColor')?.value || '#f8f9fa',
                textColor: document.getElementById('textColor')?.value || '#333333',
                borderColor: document.getElementById('borderColor')?.value || '#e9ecef',
                shadowStyle: document.getElementById('shadowStyle')?.value || 'soft',
                borderRadius: parseInt(document.getElementById('borderRadius')?.value) || 8
            },
            whatsapp: {
                message: document.getElementById('whatsappMessage')?.value || '',
                showNumber: document.getElementById('showWhatsappNumber')?.checked || true,
                color: document.getElementById('whatsappColor')?.value || '#25d366',
                position: document.getElementById('whatsappPosition')?.value || 'bottom-right',
                size: parseInt(document.getElementById('whatsappSize')?.value) || 60,
                showMobile: document.getElementById('showWhatsappMobile')?.checked || true
            },
            advanced: {
                customCSS: document.getElementById('customCSS')?.value || '',
                customJS: document.getElementById('customJS')?.value || '',
                customMeta: document.getElementById('customMeta')?.value || '',
                googleAnalytics: document.getElementById('googleAnalytics')?.value || '',
                facebookPixel: document.getElementById('facebookPixel')?.value || '',
                seoOptimization: document.getElementById('seoOptimization')?.checked || true,
                imageCompression: document.getElementById('imageCompression')?.checked || true,
                lazyLoading: document.getElementById('lazyLoading')?.checked || true
            }
        };
    } catch (error) {
        console.error('❌ Error al recopilar configuración:', error);
        throw error;
    }
}

function cambiarTema(tema) {
    console.log('🎨 Cambiando tema a:', tema);
    
    try {
        // Remover activo de todos los presets
        document.querySelectorAll('.theme-preset').forEach(preset => {
            preset.classList.remove('active');
        });
        
        // Activar preset seleccionado
        const selectedPreset = document.querySelector(`[data-theme="${tema}"]`);
        if (selectedPreset) {
            selectedPreset.classList.add('active');
        }
        
        // Aplicar configuración del tema
        const temas = {
            modern: {
                primaryColor: '#667eea',
                secondaryColor: '#764ba2',
                backgroundColor: '#f8f9fa',
                textColor: '#333333',
                borderColor: '#e9ecef'
            },
            elegant: {
                primaryColor: '#2c3e50',
                secondaryColor: '#34495e',
                backgroundColor: '#ecf0f1',
                textColor: '#2c3e50',
                borderColor: '#bdc3c7'
            },
            minimal: {
                primaryColor: '#6c757d',
                secondaryColor: '#495057',
                backgroundColor: '#ffffff',
                textColor: '#212529',
                borderColor: '#dee2e6'
            },
            colorful: {
                primaryColor: '#ff6b6b',
                secondaryColor: '#4ecdc4',
                backgroundColor: '#f8f9fa',
                textColor: '#333333',
                borderColor: '#e9ecef'
            },
            dark: {
                primaryColor: '#1a1a1a',
                secondaryColor: '#2d2d2d',
                backgroundColor: '#121212',
                textColor: '#ffffff',
                borderColor: '#333333'
            },
            light: {
                primaryColor: '#ffffff',
                secondaryColor: '#f8f9fa',
                backgroundColor: '#ffffff',
                textColor: '#333333',
                borderColor: '#e9ecef'
            }
        };
        
        const config = temas[tema];
        if (config) {
            Object.keys(config).forEach(key => {
                const element = document.getElementById(key.replace(/([A-Z])/g, (match, p1) => p1.toLowerCase()));
                if (element) {
                    element.value = config[key];
                }
            });
        }
        
        // Actualizar tienda
        actualizarTiendaEnTiempoReal();
        
        mostrarNotificacion(`Tema ${tema} aplicado correctamente`, 'success');
        
    } catch (error) {
        console.error('❌ Error al cambiar tema:', error);
        mostrarNotificacion('Error al cambiar tema: ' + error.message, 'error');
    }
}

// ===== FUNCIONES DE VISTA PREVIA - Mejoradas =====

function mostrarTiendaEnFrame(htmlContent) {
    const frame = document.getElementById('previewFrame');
    if (!frame) {
        console.error('Frame de vista previa no encontrado');
        return;
    }
    
    try {
        // Crear un iframe para mostrar la tienda
        frame.innerHTML = `
            <iframe 
                srcdoc="${htmlContent.replace(/"/g, '&quot;')}"
                style="width: 100%; height: 100%; border: none; border-radius: 8px;"
                title="Vista previa de tienda online">
            </iframe>
        `;
        
        // Configurar eventos del iframe
        const iframe = frame.querySelector('iframe');
        if (iframe) {
            iframe.onload = function() {
                console.log('✅ Iframe cargado correctamente');
            };
            
            iframe.onerror = function() {
                console.error('❌ Error al cargar iframe');
                mostrarNotificacion('Error al cargar la vista previa', 'error');
            };
        }
        
    } catch (error) {
        console.error('❌ Error al mostrar tienda en frame:', error);
        frame.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-family: 'Inter', sans-serif;">
                <div style="text-align: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: #f59e0b;"></i>
                    <h3>Error al cargar la vista previa</h3>
                    <p>${error.message}</p>
                </div>
            </div>
        `;
    }
}

// ===== FUNCIONES DE UTILIDAD - Mejoradas =====

function actualizarContadores() {
    try {
        const productosSeleccionados = productos.filter(p => p.seleccionado);
        const productCountElement = document.getElementById('productCount');
        const memoryUsageElement = document.getElementById('memoryUsage');
        
        if (productCountElement) {
            productCountElement.textContent = productosSeleccionados.length;
        }
        
        if (memoryUsageElement) {
            // Calcular uso de memoria simulado basado en la complejidad
            const complexity = productosSeleccionados.length * 0.3 + 
                             (configuracionEditor.advanced.customCSS ? 0.5 : 0) +
                             (configuracionEditor.advanced.customJS ? 0.5 : 0);
            const memoryUsage = (Math.random() * 1.5 + 1.2 + complexity).toFixed(1);
            memoryUsageElement.textContent = memoryUsage + ' MB';
        }
        
    } catch (error) {
        console.error('❌ Error al actualizar contadores:', error);
    }
}

function actualizarPuntuacionRendimiento() {
    try {
        const performanceElement = document.getElementById('performanceScore');
        if (performanceElement) {
            // Calcular puntuación basada en optimizaciones
            let score = 100;
            
            if (!configuracionEditor.advanced.lazyLoading) score -= 10;
            if (!configuracionEditor.advanced.imageCompression) score -= 5;
            if (configuracionEditor.advanced.customCSS.length > 1000) score -= 15;
            if (configuracionEditor.advanced.customJS.length > 1000) score -= 15;
            if (productos.length > 20) score -= 10;
            
            score = Math.max(score, 60); // Mínimo 60%
            performanceElement.textContent = score + '%';
            
            // Cambiar color según puntuación
            if (score >= 90) {
                performanceElement.style.color = '#10b981';
            } else if (score >= 80) {
                performanceElement.style.color = '#f59e0b';
            } else {
                performanceElement.style.color = '#ef4444';
            }
        }
    } catch (error) {
        console.error('❌ Error al actualizar puntuación:', error);
    }
}

function toggleConfigPanel() {
    try {
        const panel = document.querySelector('.config-panel');
        const toggle = document.querySelector('.panel-toggle i');
        
        if (panel && toggle) {
            panel.classList.toggle('collapsed');
            
            if (panel.classList.contains('collapsed')) {
                toggle.className = 'fas fa-chevron-right';
            } else {
                toggle.className = 'fas fa-chevron-left';
            }
        }
    } catch (error) {
        console.error('❌ Error al alternar panel:', error);
    }
}

function togglePreview() {
    console.log('👁️ Alternando vista previa...');
    actualizarTiendaEnTiempoReal();
}

function toggleFullscreen() {
    try {
        const frame = document.getElementById('previewFrame');
        if (!document.fullscreenElement) {
            frame.requestFullscreen().catch(err => {
                console.log('Error al entrar en pantalla completa:', err);
                mostrarNotificacion('Error al entrar en pantalla completa', 'warning');
            });
        } else {
            document.exitFullscreen();
        }
    } catch (error) {
        console.error('❌ Error al alternar pantalla completa:', error);
        mostrarNotificacion('Error al alternar pantalla completa', 'error');
    }
}

function toggleDevTools() {
    try {
        const frame = document.getElementById('previewFrame');
        const iframe = frame.querySelector('iframe');
        
        if (iframe) {
            // Simular herramientas de desarrollador
            mostrarNotificacion('Herramientas de desarrollador activadas', 'info');
            
            // Agregar overlay con información de desarrollo
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 20px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                z-index: 1000;
                overflow: auto;
            `;
            
            overlay.innerHTML = `
                <h3>Dev Tools - Éter Studio</h3>
                <p><strong>Productos:</strong> ${productos.filter(p => p.seleccionado).length}</p>
                <p><strong>Tema:</strong> ${configuracionEditor.theme.preset}</p>
                <p><strong>Columnas:</strong> ${configuracionEditor.products.columns}</p>
                <p><strong>Memoria:</strong> ${document.getElementById('memoryUsage')?.textContent || 'N/A'}</p>
                <p><strong>Rendimiento:</strong> ${document.getElementById('performanceScore')?.textContent || 'N/A'}</p>
                <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px;">Cerrar</button>
            `;
            
            frame.appendChild(overlay);
        }
    } catch (error) {
        console.error('❌ Error al abrir Dev Tools:', error);
        mostrarNotificacion('Error al abrir Dev Tools', 'error');
    }
}

function exportarTiendaOnline() {
    console.log('📦 Exportando tienda online...');
    
    try {
        const productosSeleccionados = productos.filter(p => p.seleccionado);
        
        if (productosSeleccionados.length === 0) {
            mostrarNotificacion('❌ No hay productos seleccionados para exportar', 'warning');
            return;
        }
        
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
        // Simular proceso de publicación
        mostrarNotificacion('🔄 Preparando publicación...', 'info');
        
        setTimeout(() => {
            mostrarNotificacion('✅ Tienda publicada exitosamente en la nube', 'success');
            
            // Simular URL generada
            setTimeout(() => {
                mostrarNotificacion('🌐 URL: https://eter-store-' + Date.now() + '.web.app', 'info');
            }, 1000);
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error al publicar tienda:', error);
        mostrarNotificacion('❌ Error al publicar tienda: ' + error.message, 'error');
    }
}

// ===== FUNCIONES DE CONFIGURACIÓN DE EVENTOS =====

function configurarEventosTeclado() {
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + S para guardar
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            actualizarTiendaEnTiempoReal();
            mostrarNotificacion('💾 Cambios guardados', 'success');
        }
        
        // Ctrl/Cmd + E para exportar
        if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
            event.preventDefault();
            exportarTiendaOnline();
        }
        
        // Ctrl/Cmd + P para publicar
        if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
            event.preventDefault();
            publicarTienda();
        }
        
        // F11 para pantalla completa
        if (event.key === 'F11') {
            event.preventDefault();
            toggleFullscreen();
        }
    });
}

// ===== FUNCIONES DE NOTIFICACIÓN - Mejoradas =====

function mostrarNotificacion(mensaje, tipo = 'info') {
    try {
        // Crear notificación
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion ${tipo}`;
        notificacion.innerHTML = `
            <div class="notificacion-contenido">
                <i class="fas ${getIconoTipo(tipo)}"></i>
                <span>${mensaje}</span>
            </div>
        `;
        
        document.body.appendChild(notificacion);
        
        // Mostrar notificación
        setTimeout(() => {
            notificacion.style.transform = 'translateX(0)';
        }, 100);
        
        // Ocultar notificación
        setTimeout(() => {
            notificacion.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notificacion)) {
                    document.body.removeChild(notificacion);
                }
            }, 300);
        }, 4000);
        
    } catch (error) {
        console.error('❌ Error al mostrar notificación:', error);
        // Fallback simple
        alert(mensaje);
    }
}

function getIconoTipo(tipo) {
    const iconos = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return iconos[tipo] || iconos.info;
}

// Función para generar tienda online interactiva con CSS externo
function generarTiendaOnlineInteractiva(nombreCatalogo, productos, configuracion = {}) {
    console.log('🏪 Generando tienda online interactiva...');
    
    if (!productos || productos.length === 0) {
        throw new Error('No hay productos para generar la tienda');
    }
    
    const telefono = configuracion.whatsapp?.numero || '+34612345678';
    const headerTexto = configuracion.header?.texto || nombreCatalogo || 'Catálogo Éter';
    const mostrarDescripcion = configuracion.productos?.mostrarDescripcion !== false;
    const mostrarCategoria = configuracion.productos?.mostrarCategoria !== false;
    const precioColor = configuracion.productos?.precioColor || '#00aa00';
    
    // Generar IDs únicos para los productos
    const productosConIds = productos.map((producto, index) => ({
        ...producto,
        id: `prod_${Date.now()}_${index}_${Math.floor(Math.random() * 1000)}`
    }));

    // Generar contenido HTML
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${headerTexto} - Tienda Online</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="estilos.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <div class="logo">${headerTexto}</div>
            <div class="cart-icon" onclick="toggleCart()">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count" id="cartCount">0</span>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-content">
            <h1 class="hero-title">¡Bienvenido a ${headerTexto}!</h1>
            <p class="hero-subtitle">Descubre nuestra increíble colección de productos</p>
            <div class="hero-badges">
                <span class="hero-badge">🚚 Envío rápido</span>
                <span class="hero-badge">💳 Pago seguro</span>
                <span class="hero-badge">📱 WhatsApp</span>
            </div>
        </div>
    </section>

    <!-- Main Content -->
    <main class="main-content">
        <div class="products-grid">
            ${productosConIds.map((producto, index) => `
                <div class="product-card" data-product-id="${producto.id}">
                    <div class="product-image">
                        ${producto.imagen ? 
                            `<img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">` : 
                            `<div class="product-placeholder"><i class="fas fa-image"></i></div>`
                        }
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${producto.nombre}</h3>
                        <div class="product-details">
                            <span class="product-size">
                                <i class="fas fa-ruler"></i>
                                ${producto.talle}
                            </span>
                            ${mostrarCategoria ? `
                                <span class="product-category">
                                    <i class="fas fa-tag"></i>
                                    ${producto.categoria}
                                </span>
                            ` : ''}
                        </div>
                        <div class="product-price">$${producto.precio}</div>
                        ${mostrarDescripcion && producto.descripcion ? `
                            <p class="product-description">${producto.descripcion}</p>
                        ` : ''}
                        <button class="add-to-cart-btn" onclick="addToCart('${producto.id}')" data-product-id="${producto.id}" data-product-name="${producto.nombre}">
                            <i class="fas fa-plus"></i>
                            <span class="btn-text">Añadir al Carrito</span>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    </main>

    <!-- Cart Modal -->
    <div class="cart-modal" id="cartModal">
        <div class="cart-content">
            <div class="cart-header">
                <h2><i class="fas fa-shopping-cart"></i> Tu Carrito</h2>
                <button class="cart-close" onclick="toggleCart()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="cart-items" id="cartItems">
                <!-- Cart items will be inserted here -->
            </div>
            <div class="cart-total">
                <div class="cart-total-amount" id="cartTotal">Total: $0.00</div>
                <button class="whatsapp-btn" onclick="sendToWhatsApp()">
                    <i class="fab fa-whatsapp"></i>
                    Enviar Pedido por WhatsApp
                </button>
            </div>
        </div>
    </div>

    <script>
        // Variables globales
        let products = ${JSON.stringify(productosConIds).replace(/`/g, '\\`').replace(/\$/g, '\\$')};
        let cart = [];
        let telefono = '${telefono}';
        let headerTexto = '${headerTexto}';
        let precioColor = '${precioColor}';

        // Funciones principales
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            
            if (product) {
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        ...product,
                        quantity: 1
                    });
                }
                
                // Feedback visual del botón
                const button = document.querySelector(\`[data-product-id="\${productId}"]\`);
                if (button) {
                    button.classList.add('added');
                    const btnText = button.querySelector('.btn-text');
                    if (btnText) {
                        btnText.textContent = '¡Añadido!';
                    }
                    
                    setTimeout(() => {
                        button.classList.remove('added');
                        if (btnText) {
                            btnText.textContent = 'Añadir al Carrito';
                        }
                    }, 1000);
                }
                
                updateCartDisplay();
                showNotification(\`✅ \${product.nombre} añadido al carrito\`);
            }
        }

        function updateCartDisplay() {
            const cartCount = document.getElementById('cartCount');
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            
            if (cartCount) {
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = totalItems;
            }
            
            if (cartItems) {
                if (cart.length === 0) {
                    cartItems.innerHTML = \`
                        <div class="empty-cart">
                            <i class="fas fa-shopping-cart"></i>
                            <p>Tu carrito está vacío</p>
                        </div>
                    \`;
                } else {
                    cartItems.innerHTML = cart.map(item => \`
                        <div class="cart-item">
                            <div class="cart-item-image">
                                <img src="\${item.imagen}" alt="\${item.nombre}">
                            </div>
                            <div class="cart-item-info">
                                <div class="cart-item-title">\${item.nombre}</div>
                                <div class="cart-item-details">
                                    Talla: \${item.talle} | Cantidad: \${item.quantity}
                                </div>
                                <div class="cart-item-price">$$\${(parseFloat(item.precio) * item.quantity).toFixed(2)}</div>
                            </div>
                        </div>
                    \`).join('');
                }
            }
            
            if (cartTotal) {
                const total = cart.reduce((sum, item) => sum + (parseFloat(item.precio) * item.quantity), 0);
                cartTotal.textContent = \`Total: $\${total.toFixed(2)}\`;
            }
        }

        function toggleCart() {
            const modal = document.getElementById('cartModal');
            modal.classList.toggle('active');
        }

        function sendToWhatsApp() {
            if (cart.length === 0) {
                showNotification('❌ Tu carrito está vacío', 'warning');
                return;
            }
            
            const message = generateWhatsAppMessage();
            const url = \`https://wa.me/\${telefono}?text=\${encodeURIComponent(message)}\`;
            
            window.open(url, '_blank');
        }

        function generateWhatsAppMessage() {
            const items = cart.map(item => 
                \`• \${item.nombre} (Talla: \${item.talle}) - Cantidad: \${item.quantity} - $${(parseFloat(item.precio) * item.quantity).toFixed(2)}\`
            ).join('\\n');
            
            const total = cart.reduce((sum, item) => sum + (parseFloat(item.precio) * item.quantity), 0);
            
            return \`🛍️ *Nuevo Pedido - \${headerTexto}*

*Productos solicitados:*
\${items}

*Total del pedido: $${total.toFixed(2)}*

¡Hola! Me gustaría realizar este pedido. ¿Podrías confirmar la disponibilidad y el proceso de pago?

Gracias! 😊\`;
        }

        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = \`notification \${type}\`;
            
            const iconClass = type === 'success' ? 'fas fa-check' : type === 'error' ? 'fas fa-times' : 'fas fa-exclamation-triangle';
            
            notification.innerHTML = \`
                <i class="notification-icon \${iconClass}"></i>
                <span class="notification-message">\${message}</span>
            \`;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            updateCartDisplay();
        });

        // Event listeners
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('cart-modal') && e.target.id === 'cartModal') {
                toggleCart();
            }
        });
    </script>
</body>
</html>`;

    // Generar contenido CSS
    const cssContent = `/* ===== ESTILOS PARA TIENDA ONLINE INTERACTIVA ===== */

/* Variables CSS */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f093fb;
    --success-color: #4facfe;
    --warning-color: #f093fb;
    --danger-color: #ff6b6b;
    --text-dark: #2d3748;
    --text-light: #718096;
    --bg-light: #f7fafc;
    --bg-white: #ffffff;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
    --shadow-lg: 0 10px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1);
    --shadow-xl: 0 20px 40px rgba(0,0,0,0.1);
    --border-radius: 12px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --precio-color: ${precioColor};
}

/* Reset y configuración base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, var(--bg-light) 0%, #e2e8f0 100%);
    color: var(--text-dark);
    line-height: 1.6;
    min-height: 100vh;
}

/* Header */
.header {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    padding: 1rem 0;
    box-shadow: var(--shadow-lg);
    position: sticky;
    top: 0;
    z-index: 1000;
    backdrop-filter: blur(10px);
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.8rem;
    font-weight: 800;
    background: linear-gradient(45deg, #fff, #f0f0f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.cart-icon {
    position: relative;
    background: rgba(255,255,255,0.2);
    padding: 0.75rem;
    border-radius: 50%;
    cursor: pointer;
    transition: var(--transition);
    backdrop-filter: blur(10px);
}

.cart-icon:hover {
    background: rgba(255,255,255,0.3);
    transform: scale(1.1);
}

.cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background: var(--danger-color);
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

/* Hero Section */
.hero-section {
    background: linear-gradient(135deg, var(--accent-color) 0%, var(--success-color) 100%);
    color: white;
    padding: 4rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
    animation: float 20s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}

.hero-content {
    position: relative;
    z-index: 1;
}

.hero-title {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
    text-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.hero-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 2rem;
}

.hero-badges {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.hero-badge {
    background: rgba(255,255,255,0.2);
    padding: 0.5rem 1rem;
    border-radius: 25px;
    font-size: 0.9rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.3);
}

/* Main Content */
.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2rem;
}

/* Products Grid */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.product-card {
    background: var(--bg-white);
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    transition: var(--transition);
    position: relative;
    border: 2px solid transparent;
}

.product-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-color);
}

.product-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
    transition: left 0.5s;
}

.product-card:hover::before {
    left: 100%;
}

.product-image {
    position: relative;
    height: 250px;
    overflow: hidden;
    background: linear-gradient(45deg, #f8f9fa, #e9ecef);
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
    transform: scale(1.1);
}

.product-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 4rem;
    color: #ccc;
}

.product-info {
    padding: 1.5rem;
}

.product-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 1rem;
    line-height: 1.3;
}

.product-details {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.product-size,
.product-category {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--text-light);
    font-weight: 500;
}

.product-size i,
.product-category i {
    color: var(--primary-color);
}

.product-price {
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--precio-color);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.product-price::before {
    content: '💰';
    font-size: 1.2rem;
}

.product-description {
    font-size: 0.9rem;
    color: var(--text-light);
    line-height: 1.5;
    margin-bottom: 1.5rem;
    font-style: italic;
    background: #f8f9fa;
    padding: 0.75rem;
    border-radius: 8px;
    border-left: 4px solid var(--primary-color);
}

.add-to-cart-btn {
    width: 100%;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    border: none;
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
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
    transition: left 0.5s;
}

.add-to-cart-btn:hover::before {
    left: 100%;
}

.add-to-cart-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.add-to-cart-btn.added {
    background: linear-gradient(135deg, var(--success-color) 0%, #00d4aa 100%);
    animation: addedPulse 0.6s ease-out;
}

@keyframes addedPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

/* Cart Modal */
.cart-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(5px);
    z-index: 2000;
    animation: fadeIn 0.3s ease;
}

.cart-modal.active {
    display: flex;
    align-items: center;
    justify-content: center;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.cart-content {
    background: var(--bg-white);
    border-radius: var(--border-radius);
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: var(--shadow-xl);
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from { transform: translateY(-50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.cart-header {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.cart-header h2 {
    font-size: 1.5rem;
    font-weight: 700;
}

.cart-close {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
}

.cart-close:hover {
    background: rgba(255,255,255,0.3);
    transform: scale(1.1);
}

.cart-items {
    max-height: 400px;
    overflow-y: auto;
    padding: 1rem;
}

.cart-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    animation: slideInUp 0.3s ease;
}

@keyframes slideInUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.cart-item:last-child {
    border-bottom: none;
}

.cart-item-image {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
}

.cart-item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.cart-item-info {
    flex-grow: 1;
}

.cart-item-title {
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
}

.cart-item-details {
    font-size: 0.9rem;
    color: var(--text-light);
    margin-bottom: 0.5rem;
}

.cart-item-price {
    font-weight: 600;
    color: var(--precio-color);
}

.cart-total {
    background: #f8f9fa;
    padding: 1.5rem;
    border-top: 2px solid #e2e8f0;
}

.cart-total-amount {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-dark);
    text-align: center;
    margin-bottom: 1rem;
}

.whatsapp-btn {
    width: 100%;
    background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
    color: white;
    border: none;
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
}

.whatsapp-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
}

.whatsapp-btn:hover::before {
    left: 100%;
}

.whatsapp-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.empty-cart {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-light);
}

.empty-cart i {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

/* Notifications */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bg-white);
    border-radius: var(--border-radius);
    padding: 1rem 1.5rem;
    box-shadow: var(--shadow-lg);
    z-index: 3000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 300px;
    border-left: 4px solid var(--primary-color);
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    border-left-color: var(--success-color);
}

.notification.error {
    border-left-color: var(--danger-color);
}

.notification.warning {
    border-left-color: var(--warning-color);
}

.notification-icon {
    font-size: 1.2rem;
}

.notification.success .notification-icon {
    color: var(--success-color);
}

.notification.error .notification-icon {
    color: var(--danger-color);
}

.notification.warning .notification-icon {
    color: var(--warning-color);
}

.notification-message {
    flex-grow: 1;
    font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2rem;
    }
    
    .products-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .header-content {
        padding: 0 1rem;
    }
    
    .main-content {
        padding: 2rem 1rem;
    }
    
    .cart-content {
        width: 95%;
        margin: 1rem;
    }
    
    .notification {
        right: 10px;
        left: 10px;
        min-width: auto;
    }
}

// Función para abrir URL de Vercel
function abrirVercelUrl(url) {
    try {
        window.open(url, '_blank');
        mostrarNotificacion('✅ Abriendo tienda en Vercel', 'success');
    } catch (error) {
        console.error('❌ Error al abrir URL de Vercel:', error);
        mostrarNotificacion('❌ Error al abrir la URL de Vercel', 'error');
    }
}

// Función para copiar enlace de Vercel
function copiarEnlaceVercel(url) {
    try {
        // Usar la moderna Clipboard API si está disponible
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
                mostrarFeedbackCopiaVercel();
            }).catch(() => {
                // Fallback al método legacy
                copiarEnlaceFallback(url);
            });
        } else {
            // Fallback para navegadores que no soportan Clipboard API
            copiarEnlaceFallback(url);
        }
    } catch (error) {
        console.error('❌ Error al copiar enlace de Vercel:', error);
        mostrarNotificacion('❌ Error al copiar el enlace de Vercel', 'error');
    }
}

// Función para mostrar feedback visual de copia de Vercel
function mostrarFeedbackCopiaVercel() {
    const boton = document.querySelector('.btn-copiar-vercel');
    if (boton) {
        const textoOriginal = boton.innerHTML;
        
        // Cambiar el botón para mostrar que se copió
        boton.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
        boton.classList.add('copied');
        
        // Mostrar notificación
        mostrarNotificacion('✅ URL de Vercel copiada al portapapeles', 'success');
        
        // Restaurar el botón después de 2 segundos
        setTimeout(() => {
            boton.innerHTML = textoOriginal;
            boton.classList.remove('copied');
        }, 2000);
    } else {
        mostrarNotificacion('✅ URL de Vercel copiada al portapapeles', 'success');
    }
}

// Función para instalar Vercel CLI si no está disponible
async function instalarVercelCLI() {
    try {
        console.log('📦 Instalando Vercel CLI...');
        
        const { exec } = require('child_process');
        const util = require('util');
        const execAsync = util.promisify(exec);
        
        // Intentar instalar Vercel CLI globalmente
        await execAsync('npm install -g vercel', {
            timeout: 120000 // 2 minutos de timeout
        });
        
        console.log('✅ Vercel CLI instalado exitosamente');
        mostrarNotificacion('✅ Vercel CLI instalado exitosamente', 'success');
        return true;
        
    } catch (error) {
        console.error('❌ Error al instalar Vercel CLI:', error);
        mostrarNotificacion('❌ Error al instalar Vercel CLI', 'error');
        return false;
    }
}

// Función para verificar si Vercel CLI está instalado
async function verificarVercelCLI() {
    try {
        const { exec } = require('child_process');
        const util = require('util');
        const execAsync = util.promisify(exec);
        
        await execAsync('vercel --version', {
            timeout: 10000 // 10 segundos de timeout
        });
        
        return true;
    } catch (error) {
        return false;
    }
}