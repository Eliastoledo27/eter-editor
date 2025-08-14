# Sistema de Tiendas Online - Éter Studio

Esta carpeta contiene todas las tiendas generadas por los usuarios del editor Éter Studio.

## Estructura

```
tiendas/
├── [usuario]/
│   ├── config.json      # Configuración de la tienda
│   ├── index.html       # Tienda principal
│   ├── admin.html       # Panel de administración
│   ├── estilos.css      # Estilos de la tienda
│   └── assets/          # Recursos (imágenes, etc.)
```

## Autenticación

Cada tienda tiene su propio sistema de autenticación con:
- Usuario único
- Contraseña segura
- Panel de administración protegido

## Despliegue Automático

Las tiendas se despliegan automáticamente en Vercel cuando se publican. 