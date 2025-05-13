API AGRITRACK

# Instalación

1. Clonar el repositorio
2. Instalar dependencias con `bun i`
3. Montar el servidor con `bun run dev`
4. Instalar Bun para montar mejor el servidor `(https://bun.sh/)`

# Consejos

1. Usar `bun add <paquete>` para instalar dependencias
2. Usar `bun add -D <paquete>` para instalar dependencias de desarrollo
3. Usar `bun add -D @types/<paquete>` para instalar dependencias de desarrollo de tipos (como TypeScript)
4. Usar `bun run dev` para iniciar el servidor en modo desarrollo
5. Usar `bun run build` para compilar el código
6. Usar `bun run start` para iniciar el servidor en producción

# Configuración

1. Debes crear solamente una base de datos en MySQL/MariaDB con el nombre `agritrack`
2. No crear tablas en la base de datos, porque se crean automáticamente
