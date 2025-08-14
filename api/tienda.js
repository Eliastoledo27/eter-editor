const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { action, tiendaId, data } = req.body;

    switch (action) {
      case 'create':
        await handleCreateTienda(req, res, tiendaId, data);
        break;
      case 'update':
        await handleUpdateTienda(req, res, tiendaId, data);
        break;
      case 'get':
        await handleGetTienda(req, res, tiendaId);
        break;
      case 'list':
        await handleListTiendas(req, res);
        break;
      default:
        res.status(400).json({ error: 'Acción no válida' });
    }
  } catch (error) {
    console.error('Error en tienda API:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

async function handleCreateTienda(req, res, tiendaId, data) {
  try {
    if (!tiendaId || !data) {
      return res.status(400).json({ error: 'TiendaId y datos son requeridos' });
    }

    // Crear directorio de la tienda
    const tiendaDir = path.join(process.cwd(), 'tiendas', tiendaId);
    if (!fs.existsSync(tiendaDir)) {
      fs.mkdirSync(tiendaDir, { recursive: true });
    }

    // Crear archivos de la tienda
    const { html, css, config } = data;

    // Guardar HTML principal
    if (html) {
      fs.writeFileSync(path.join(tiendaDir, 'index.html'), html, 'utf8');
    }

    // Guardar CSS
    if (css) {
      fs.writeFileSync(path.join(tiendaDir, 'estilos.css'), css, 'utf8');
    }

    // Guardar configuración
    if (config) {
      fs.writeFileSync(path.join(tiendaDir, 'config.json'), JSON.stringify(config, null, 2), 'utf8');
    }

    // Crear panel de administración
    const adminHTML = generateAdminPanel(tiendaId);
    fs.writeFileSync(path.join(tiendaDir, 'admin.html'), adminHTML, 'utf8');

    res.json({ 
      success: true, 
      message: 'Tienda creada exitosamente',
      tiendaId: tiendaId,
      url: `/tienda/${tiendaId}`,
      adminUrl: `/admin/${tiendaId}`
    });

  } catch (error) {
    console.error('Error al crear tienda:', error);
    res.status(500).json({ error: 'Error al crear la tienda' });
  }
}

async function handleUpdateTienda(req, res, tiendaId, data) {
  try {
    if (!tiendaId || !data) {
      return res.status(400).json({ error: 'TiendaId y datos son requeridos' });
    }

    const tiendaDir = path.join(process.cwd(), 'tiendas', tiendaId);
    if (!fs.existsSync(tiendaDir)) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    const { html, css, config } = data;

    // Actualizar archivos
    if (html) {
      fs.writeFileSync(path.join(tiendaDir, 'index.html'), html, 'utf8');
    }

    if (css) {
      fs.writeFileSync(path.join(tiendaDir, 'estilos.css'), css, 'utf8');
    }

    if (config) {
      const currentConfig = fs.existsSync(path.join(tiendaDir, 'config.json')) 
        ? JSON.parse(fs.readFileSync(path.join(tiendaDir, 'config.json'), 'utf8'))
        : {};
      
      const updatedConfig = { ...currentConfig, ...config };
      fs.writeFileSync(path.join(tiendaDir, 'config.json'), JSON.stringify(updatedConfig, null, 2), 'utf8');
    }

    res.json({ 
      success: true, 
      message: 'Tienda actualizada exitosamente',
      tiendaId: tiendaId
    });

  } catch (error) {
    console.error('Error al actualizar tienda:', error);
    res.status(500).json({ error: 'Error al actualizar la tienda' });
  }
}

async function handleGetTienda(req, res, tiendaId) {
  try {
    if (!tiendaId) {
      return res.status(400).json({ error: 'TiendaId es requerido' });
    }

    const tiendaDir = path.join(process.cwd(), 'tiendas', tiendaId);
    if (!fs.existsSync(tiendaDir)) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    const tiendaData = {
      tiendaId: tiendaId,
      exists: true,
      files: {}
    };

    // Leer archivos si existen
    const htmlPath = path.join(tiendaDir, 'index.html');
    const cssPath = path.join(tiendaDir, 'estilos.css');
    const configPath = path.join(tiendaDir, 'config.json');

    if (fs.existsSync(htmlPath)) {
      tiendaData.files.html = fs.readFileSync(htmlPath, 'utf8');
    }

    if (fs.existsSync(cssPath)) {
      tiendaData.files.css = fs.readFileSync(cssPath, 'utf8');
    }

    if (fs.existsSync(configPath)) {
      tiendaData.files.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    res.json(tiendaData);

  } catch (error) {
    console.error('Error al obtener tienda:', error);
    res.status(500).json({ error: 'Error al obtener la tienda' });
  }
}

async function handleListTiendas(req, res) {
  try {
    const tiendasDir = path.join(process.cwd(), 'tiendas');
    
    if (!fs.existsSync(tiendasDir)) {
      return res.json({ tiendas: [] });
    }

    const tiendas = fs.readdirSync(tiendasDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => {
        const tiendaId = dirent.name;
        const configPath = path.join(tiendasDir, tiendaId, 'config.json');
        let config = {};
        
        if (fs.existsSync(configPath)) {
          try {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          } catch (e) {
            console.error(`Error leyendo config de ${tiendaId}:`, e);
          }
        }

        return {
          tiendaId: tiendaId,
          created: config.created || null,
          name: config.name || tiendaId,
          url: `/tienda/${tiendaId}`,
          adminUrl: `/admin/${tiendaId}`
        };
      });

    res.json({ tiendas: tiendas });

  } catch (error) {
    console.error('Error al listar tiendas:', error);
    res.status(500).json({ error: 'Error al listar tiendas' });
  }
}

function generateAdminPanel(tiendaId) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - ${tiendaId}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .admin-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 40px;
            max-width: 500px;
            width: 100%;
        }
        
        .admin-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .admin-header h1 {
            color: #333;
            font-size: 2rem;
            margin-bottom: 10px;
        }
        
        .admin-header p {
            color: #666;
            font-size: 1rem;
        }
        
        .login-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .form-group label {
            font-weight: 600;
            color: #333;
            font-size: 0.9rem;
        }
        
        .form-group input {
            padding: 12px 16px;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .btn {
            padding: 14px 24px;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            text-align: center;
            display: inline-block;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        
        .btn-secondary {
            background: #f8f9fa;
            color: #333;
            border: 2px solid #e1e5e9;
        }
        
        .btn-secondary:hover {
            background: #e9ecef;
        }
        
        .admin-actions {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 30px;
        }
        
        .status {
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 0.9rem;
            text-align: center;
            display: none;
        }
        
        .status.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .status.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="admin-header">
            <h1>🔐 Panel de Administración</h1>
            <p>Gestiona tu tienda: <strong>${tiendaId}</strong></p>
        </div>
        
        <div id="loginSection">
            <form class="login-form" id="loginForm">
                <div class="form-group">
                    <label for="username">Usuario:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Contraseña:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
            </form>
            
            <div class="admin-actions">
                <a href="/tienda/${tiendaId}" class="btn btn-secondary" target="_blank">
                    👁️ Ver Tienda
                </a>
            </div>
        </div>
        
        <div id="adminSection" class="hidden">
            <div class="admin-actions">
                <h3>Bienvenido, <span id="adminUsername"></span></h3>
                <a href="/tienda/${tiendaId}" class="btn btn-primary" target="_blank">
                    🏪 Ver Tienda
                </a>
                <button class="btn btn-secondary" onclick="logout()">
                    🚪 Cerrar Sesión
                </button>
            </div>
        </div>
        
        <div id="status" class="status"></div>
    </div>

    <script>
        const tiendaId = '${tiendaId}';
        let sessionToken = localStorage.getItem('sessionToken_' + tiendaId);
        
        // Verificar sesión al cargar
        if (sessionToken) {
            verifySession();
        }
        
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('/api/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'login',
                        username: username,
                        password: password,
                        tiendaId: tiendaId
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    sessionToken = data.sessionToken;
                    localStorage.setItem('sessionToken_' + tiendaId, sessionToken);
                    showAdminSection(data.username);
                    showStatus('Sesión iniciada exitosamente', 'success');
                } else {
                    showStatus(data.error, 'error');
                }
            } catch (error) {
                showStatus('Error al conectar con el servidor', 'error');
            }
        });
        
        async function verifySession() {
            try {
                const response = await fetch('/api/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionToken
                    },
                    body: JSON.stringify({
                        action: 'verify',
                        tiendaId: tiendaId
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showAdminSection(data.username);
                } else {
                    localStorage.removeItem('sessionToken_' + tiendaId);
                    sessionToken = null;
                }
            } catch (error) {
                localStorage.removeItem('sessionToken_' + tiendaId);
                sessionToken = null;
            }
        }
        
        function showAdminSection(username) {
            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('adminSection').classList.remove('hidden');
            document.getElementById('adminUsername').textContent = username;
        }
        
        function logout() {
            localStorage.removeItem('sessionToken_' + tiendaId);
            sessionToken = null;
            document.getElementById('adminSection').classList.add('hidden');
            document.getElementById('loginSection').classList.remove('hidden');
            document.getElementById('loginForm').reset();
            showStatus('Sesión cerrada', 'success');
        }
        
        function showStatus(message, type) {
            const status = document.getElementById('status');
            status.textContent = message;
            status.className = 'status ' + type;
            status.style.display = 'block';
            
            setTimeout(() => {
                status.style.display = 'none';
            }, 3000);
        }
    </script>
</body>
</html>`;
} 