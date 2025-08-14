const crypto = require('crypto');
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
    const { action, username, password, tiendaId } = req.body;

    switch (action) {
      case 'register':
        await handleRegister(req, res, username, password, tiendaId);
        break;
      case 'login':
        await handleLogin(req, res, username, password, tiendaId);
        break;
      case 'verify':
        await handleVerify(req, res, tiendaId);
        break;
      default:
        res.status(400).json({ error: 'Acción no válida' });
    }
  } catch (error) {
    console.error('Error en auth API:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

async function handleRegister(req, res, username, password, tiendaId) {
  try {
    // Validar datos
    if (!username || !password || !tiendaId) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (username.length < 3 || password.length < 6) {
      return res.status(400).json({ 
        error: 'Usuario debe tener al menos 3 caracteres y contraseña al menos 6' 
      });
    }

    // Crear directorio de la tienda si no existe
    const tiendaDir = path.join(process.cwd(), 'tiendas', tiendaId);
    if (!fs.existsSync(tiendaDir)) {
      fs.mkdirSync(tiendaDir, { recursive: true });
    }

    // Verificar si el usuario ya existe
    const configPath = path.join(tiendaDir, 'config.json');
    let config = {};
    
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (config.users && config.users[username]) {
        return res.status(400).json({ error: 'El usuario ya existe' });
      }
    }

    // Hash de la contraseña
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    // Guardar usuario
    if (!config.users) config.users = {};
    config.users[username] = {
      hash: hash,
      salt: salt,
      created: new Date().toISOString(),
      role: 'admin'
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    res.json({ 
      success: true, 
      message: 'Usuario registrado exitosamente',
      tiendaId: tiendaId
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
}

async function handleLogin(req, res, username, password, tiendaId) {
  try {
    // Validar datos
    if (!username || !password || !tiendaId) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Leer configuración
    const configPath = path.join(process.cwd(), 'tiendas', tiendaId, 'config.json');
    if (!fs.existsSync(configPath)) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const user = config.users && config.users[username];

    if (!user) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Verificar contraseña
    const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
    if (hash !== user.hash) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Generar token de sesión
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    if (!config.sessions) config.sessions = {};
    config.sessions[sessionToken] = {
      username: username,
      role: user.role,
      created: new Date().toISOString(),
      expires: sessionExpiry.toISOString()
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    res.json({ 
      success: true, 
      message: 'Login exitoso',
      sessionToken: sessionToken,
      username: username,
      role: user.role,
      tiendaId: tiendaId
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

async function handleVerify(req, res, tiendaId) {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionToken || !tiendaId) {
      return res.status(401).json({ error: 'Token de sesión requerido' });
    }

    // Leer configuración
    const configPath = path.join(process.cwd(), 'tiendas', tiendaId, 'config.json');
    if (!fs.existsSync(configPath)) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const session = config.sessions && config.sessions[sessionToken];

    if (!session) {
      return res.status(401).json({ error: 'Sesión inválida' });
    }

    // Verificar expiración
    if (new Date(session.expires) < new Date()) {
      delete config.sessions[sessionToken];
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      return res.status(401).json({ error: 'Sesión expirada' });
    }

    res.json({ 
      success: true, 
      username: session.username,
      role: session.role,
      tiendaId: tiendaId
    });

  } catch (error) {
    console.error('Error en verificación:', error);
    res.status(500).json({ error: 'Error al verificar sesión' });
  }
} 