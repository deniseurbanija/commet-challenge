# Commet - Gestión de Deals 

## Descripción

Es una aplicación web para la gestión de deals, que permite importar datos desde archivos JSON o CSV, almacenarlos en una base de datos SQLite y calcular comisiones automáticamente.

## Tecnologías Utilizadas

- **Frontend**: NextJs, TypeScript
- **Backend**: NestJs, Prisma
- **Base de Datos**: SQLite
- **Librerías**: PapaParse (para CSV), Lucide React (iconos)

## Deploy ✨
https://commet-challenge.vercel.app/

## Enfoque de Desarrollo

El enfoque utilizado para este desarrollo se basa en la arquitectura de cliente-servidor, donde el frontend y el backend se comunican a través de una API RESTful. 

1. **Frontend**: 
   - Se utilizó React con TypeScript para construir una interfaz de usuario interactiva y tipada. 
   - Se implementaron componentes reutilizables y un manejo de estado eficiente para gestionar los datos de los deals.
   - Se integró la librería PapaParse para manejar la importación de archivos CSV.

2. **Backend**: 
   - Se utilizó NestJs para crear un servidor que maneja las solicitudes de la API.
   - Al importar deals, tanto en formato Json y CSV, soporta distintos encabezados en inglés.
   - Prisma se utilizó como ORM para interactuar con la base de datos SQLite, facilitando la creación, lectura, actualización y eliminación de datos.
   - Se implementaron validaciones y manejo de errores para asegurar la integridad de los datos y proporcionar retroalimentación clara al usuario.

3. **Base de Datos**: 
   - SQLite se eligió por su simplicidad y facilidad de uso en entornos de desarrollo, permitiendo un almacenamiento ligero y eficiente de los datos de los deals.

Este enfoque modular y basado en componentes permite una fácil escalabilidad y mantenimiento del código, así como una experiencia de usuario fluida.

## Instalación

### Requisitos Previos

- Node.js (v20 o superior)
- npm (v10 o superior)

### Clonar el Repositorio

```bash
git clone https://github.com/deniseurbanija/commet-challenge.git
cd commet-challenge
```

### Configuración del Backend

1. Navega a la carpeta del backend:

   ```bash
   cd backend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicializa Prisma y crea la base de datos:

   ```bash
   npx prisma migrate dev --name init
   ```

4. Inicia el servidor:

   ```bash
   npm run dev
   ```

### Configuración del Frontend

1. Navega a la carpeta del frontend:

   ```bash
   cd frontend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia la aplicación:

   ```bash
   npm run dev
   ```

## Uso

1. Abre tu navegador y ve a `http://localhost:3000`.
2. Usa el botón de importación para cargar archivos JSON o CSV con la siguiente estructura:

   **JSON**:
   ```json
   [
     {
       "deal_id": "C1",
       "total": 3200,
       "rep_name": "Juan Gomez",
       "sold_at": "2024-03-15"
     }
   ]
   ```

   **CSV**:
   ```csv
   opportunity_id,amount,seller,deal_date
   C1,3200,Juan Gomez,2024-03-15
   ```

3. Los datos se mostrarán en la tabla y se calcularán las comisiones automáticamente.
