# 🇧🇴 Sistema Web para la Gestión Centralizada de Activos No Corrientes de la Policía Boliviana

![Estado](https://img.shields.io/badge/Estado-Producción_Lista-success)
![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)
![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/Estilos-Tailwind_CSS-38B2AC?logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Backend-Node.js_%2B_Express-339933?logo=nodedotjs)
![PostgreSQL](https://img.shields.io/badge/Base_de_Datos-PostgreSQL-4169E1?logo=postgresql)

## 📌 Descripción del Proyecto

Desarrollado como proyecto para la asignatura de **Ingeniería de Software** (UTEPSA), este sistema es un **Portal Institucional y Dashboard de Control Táctico** diseñado específicamente para los requerimientos de la Policía Boliviana. 

El sistema centraliza, fiscaliza y monitorea la distribución de los activos no corrientes (vehículos patrulleros, equipos de radiocomunicación, armamento, motocicletas, etc.) asignados a las diferentes unidades departamentales. Destaca por su inmersiva interfaz gráfica inspirada en centros de comando modernos.

## 🚀 Características Principales

### 🖥️ Interfaz y Experiencia de Usuario (UI/UX)
- **Portal Táctico:** Diseño moderno Cyberpunk-Militar que incluye soporte nativo y fluido para **Dark Mode** (Modo Oscuro) utilizando colores institucionales (Verde Neón y Dorado).
- **Sidebar Táctico de Comando:** Navegación lateral estructurada que centraliza el acceso rápido a los diferentes módulos del sistema, garantizando fluidez y un estilo inmersivo.
- **Login Seguro (Uso Oficial):** Pantalla de autenticación con acceso restringido, animaciones de *Glassmorphism* y protección estricta de rutas.
- **Radar de Monitoreo Animado:** Componente visual interactivo (CSS puro) que simula el escaneo 360° de un radar militar detectando objetivos en tiempo real.
- **Carga de Imágenes Dinámica e Inteligente:** Las fichas técnicas y las noticias de impacto detectan y cargan imágenes automáticamente (`.png`, `.jpg`, `.jpeg`, `.webp`), estableciendo un icono *placeholder* inteligente si la fotografía no está disponible.

### 🌐 Conexión en Tiempo Real
- **Barra de Estado Nacional (Ticker):** Un panel informativo en la cabecera del portal que incluye un reloj de alta precisión (con milisegundos) y una marquesina dinámica conectada a la API de **Open-Meteo** para reportar el estado climático de los 9 departamentos de Bolivia. Incluye sistema de contingencia sin conexión (Offline-Fallback).

### ⚙️ Arquitectura y Seguridad
- **Patrones de Arquitectura y Diseño:** El sistema está construido bajo los patrones **MVC (Modelo-Vista-Controlador)** en el frontend/backend y **DAO (Data Access Object)** para asegurar la capa de datos.
- **Roles y Privilegios (RBAC):** Autenticación y vista adaptativa para 3 roles clave:
  - *Comandante General* (Acceso Total)
  - *Administrativo* (Gestión)
  - *Auditor* (Módulo de Auditorías RF-04 para conciliación físico-contable)
- **Generador de Reportes (Patrón Factory):** Aplicación de patrones de diseño de software (*Factory Method*) en el backend para la exportación escalable de padrones (PDF, Excel, Word).
- **Trazabilidad Inmutable (RF-12):** Implementación de `Triggers` directamente en la estructura de PostgreSQL. El frontend refleja esto mediante un módulo de **Bitácora Inmutable** estilo "Logs de BD" para fiscalizar estrictamente el registro de transacciones (Bajas, Altas, Modificaciones).

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React.js, Vite, Tailwind CSS.
* **Backend:** Node.js, Express.js.
* **Base de Datos:** PostgreSQL (pg).
* **Integraciones:** Open-Meteo API (Climatología).

## 📂 Estructura del Proyecto

```text
📦 Proyecto-Policia-Boliviana
 ┣ 📂 database             # Scripts de SQL, Triggers y Procedimientos Almacenados
 ┣ 📂 frontend             # Código fuente de React (Vite)
 ┃ ┣ 📂 public             # Assets estáticos (Imágenes de activos: patrulla, motorola, etc.)
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components       # Componentes de UI (Dashboard.jsx, HeaderStatus.jsx)
 ┃ ┃ ┣ 📂 services         # Conexión con el Backend (API)
 ┃ ┃ ┗ 📜 index.css        # Animaciones y utilidades globales
 ┃ ┗ 📜 tailwind.config.js # Configuración de diseño y colores institucionales
 ┣ 📂 src                  # Código fuente del Backend (Node/Express)
 ┃ ┣ 📂 controllers        # Lógica de negocio
 ┃ ┣ 📂 dataAccess         # Patrón Singleton de Conexión a BD
 ┃ ┣ 📂 factories          # Implementación del Patrón Factory Method
 ┃ ┣ 📂 middlewares        # Seguridad y autenticación
 ┃ ┗ 📂 routes             # Definición de Endpoints
 ┗ 📜 README.md
```

## ⚙️ Instalación y Uso Local

### 1. Requisitos Previos
* Instalar **Node.js** (v16 o superior).
* Instalar **PostgreSQL**.

### 2. Base de Datos
Ejecutar el script principal de la base de datos ubicado en `/database/schema.sql` en tu servidor PostgreSQL local para construir el esquema, tablas y los disparadores (Triggers) de seguridad.

### 3. Ejecutar Backend
```bash
# Navegar a la raíz del proyecto
npm install
npm start
```

### 4. Ejecutar Frontend
```bash
# Navegar a la carpeta frontend
cd frontend
npm install
npm run dev
```

## 👨‍💻 Créditos Académicos

Proyecto desarrollado para la defensa académica en **UTEPSA**.
* **Autor:** Ronald Augusto Rodriguez Serrano
* **Integrantes del Equipo:**
Luis Carlos Dominguez Medina
Ronald Augusto Rodriguez Serrano
Yordin Tomas Rojas Salazar

* **Materia:** Ingeniería de Software
* **Año:** 2026
* **Horario:** 10:00 - 13:00
* **Duración:** Marzo-Abril
* **Docente:** Ing. Eivy Pereyra Carvalho

---
*© 2026 Todos los derechos reservados | Grupo 3 | UTEPSA | Santa Cruz - Bolivia*
