# Patitas en Alerta - Marketplace de Productos (API Secundaria)

Este repositorio contiene la aplicación del catálogo y gestión de productos del Marketplace. Se diseñó como una API pública e independiente (API Secundaria Simplificada) que expone endpoints abiertos para consultar, crear, modificar y eliminar productos.

## Estructura del proyecto

*   `/backend`: API hecha en Spring Boot (corre en el puerto `8081` para evitar colisiones).
*   `/frontend`: Interfaz web hecha con React + Vite + TypeScript (corre en el puerto `5174`).

---

## Requisitos previos

*   **Java 21** o superior.
*   **Node.js** (v18+) y npm.
*   **PostgreSQL** (conectado a la misma base de datos compartida).

---

## Paso a paso para levantar el proyecto

### 1. Configurar la Base de Datos
1. Este microservicio comparte la base de datos `patitas_en_alerta` con el portal principal. Si no la creaste todavía, podés crearla en PostgreSQL con el nombre `patitas_en_alerta`.
2. En la raíz de `/backend`, configurar tus credenciales en el archivo `.env` (basándote en `.env.example`):
   ```env
   DB_URL=jdbc:postgresql://localhost:5122/patitas_en_alerta
   DB_USER=postgres
   DB_PASS=tu_contraseña
   ```

### 2. Ejecutar el Backend (Spring Boot)
1. Abrir la terminal e ir a la carpeta de backend:
   ```bash
   cd backend
   ```
2. Ejecutar con el wrapper de Maven:
   *   En Windows (PowerShell/CMD):
       ```bash
       .\mvnw.cmd spring-boot:run
       ```
   *   En Linux/Mac:
       ```bash
       ./mvnw spring-boot:run
       ```
3. El backend va a quedar escuchando en: `http://localhost:8081`.
4. Podés ver y probar la API en la documentación de Swagger: `http://localhost:8081/swagger-ui.html`.

### 3. Ejecutar el Frontend (React)
1. Abrir otra terminal e ir a la carpeta de frontend:
   ```bash
   cd frontend
   ```
2. Instalar las dependencias de Node:
   ```bash
   npm install
   ```
3. Iniciar el entorno de desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador: `http://localhost:5174`.
   *(Este portal es de acceso totalmente libre y público, no requiere credenciales de login)*
