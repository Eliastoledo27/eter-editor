# Configuración de Vercel para Éter Studio

## 🚀 Despliegue Automático en Vercel

Este editor ahora incluye funcionalidad para desplegar automáticamente las tiendas generadas en Vercel, permitiendo obtener un enlace público para previsualizar la tienda online.

## 📋 Requisitos Previos

### 1. Instalar Node.js
- Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/)
- Versión mínima requerida: 14.0.0

### 2. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 3. Autenticarse con Vercel
```bash
vercel login
```

## 🔧 Configuración

### Archivos de Configuración

El proyecto incluye los siguientes archivos para Vercel:

- `vercel.json` - Configuración de despliegue
- `package.json` - Dependencias y scripts
- `.vercelignore` - Archivos a ignorar en el despliegue

### Estructura del Proyecto

```
EterGenerCat/
├── index.html          # Editor principal
├── script.js           # Lógica del editor
├── styles.css          # Estilos del editor
├── vercel.json         # Configuración de Vercel
├── package.json        # Dependencias
└── tienda/             # Carpeta donde se generan las tiendas
    ├── index.html      # Tienda generada
    └── estilos.css     # Estilos de la tienda
```

## 🎯 Cómo Usar

### 1. Generar una Tienda
1. Abre el editor en tu navegador
2. Configura los productos y opciones
3. Haz clic en "Publicar"

### 2. Despliegue Automático
- El editor intentará desplegar automáticamente en Vercel
- Si Vercel CLI no está instalado, se mostrará un mensaje de error
- Si el despliegue es exitoso, se mostrará la URL de Vercel

### 3. Opciones Disponibles
- **Ver en Vercel**: Abre la tienda en el navegador
- **Copiar URL Vercel**: Copia el enlace al portapapeles
- **Copiar Enlace Local**: Copia el enlace local
- **Abrir Tienda Local**: Abre la tienda desde el archivo local

## 🔍 Solución de Problemas

### Error: "Vercel CLI no encontrado"
```bash
npm install -g vercel
vercel login
```

### Error: "No se pudo desplegar en Vercel"
1. Verifica tu conexión a internet
2. Asegúrate de estar autenticado: `vercel login`
3. Verifica que tienes permisos en tu cuenta de Vercel

### Error: "Timeout en el despliegue"
- El despliegue puede tardar hasta 60 segundos
- Verifica que los archivos de la tienda se generaron correctamente

## 📱 URLs Generadas

### Formato de URL de Vercel
```
https://[proyecto]-[hash]-[usuario].vercel.app
```

### Ejemplo
```
https://eter-tienda-online-abc123-eliastoledo27.vercel.app
```

## 🔄 Actualizaciones

### Desplegar Cambios
- Cada vez que presiones "Publicar", se generará un nuevo despliegue
- Las URLs anteriores seguirán funcionando
- Puedes acceder al historial de despliegues en tu dashboard de Vercel

### Configuración Personalizada
- Modifica `vercel.json` para cambiar la configuración
- Ajusta `package.json` para agregar scripts personalizados

## 📞 Soporte

Si tienes problemas con el despliegue en Vercel:

1. Verifica la documentación oficial de Vercel
2. Revisa los logs de error en la consola del navegador
3. Asegúrate de que todos los requisitos están cumplidos

## 🎉 Beneficios

- **Enlaces Públicos**: Comparte tu tienda con cualquier persona
- **Despliegue Rápido**: Automático en segundos
- **HTTPS**: Conexión segura automática
- **CDN Global**: Carga rápida desde cualquier lugar
- **Sin Configuración**: Funciona con un solo clic 