# 🇧🇴 Sistema Web para la Gestión Centralizada de Activos No Corrientes de la Policía Boliviana

![Estado](https://img.shields.io/badge/Estado-Producción_Lista-success)
![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)
![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/Estilos-Tailwind_CSS-38B2AC?logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Backend-Node.js_%2B_Express-339933?logo=nodedotjs)
![PostgreSQL](https://img.shields.io/badge/Base_de_Datos-PostgreSQL-4169E1?logo=postgresql)

## 📌 Descripción del Proyecto

**S.G.A.N.C. (Sistema de Gestión de Activos No Corrientes)** es un Portal Institucional y Dashboard de Control Táctico desarrollado para la asignatura de **Ingeniería de Software** (UTEPSA). El sistema está diseñado específicamente para los requerimientos de la Policía Boliviana, centralizando la fiscalización y monitoreo de recursos logísticos nacionales.

El sistema destaca por su inmersiva interfaz gráfica inspirada en centros de comando modernos y su arquitectura robusta basada en estándares de ingeniería.

## 🚀 Características Principales

### 🖥️ Interfaz y Experiencia de Usuario (UI/UX)
- **Portal Táctico Dual:** Soporte nativo para **Modo Claro (Default)** y **Modo Oscuro** (Neon Tactical) con una transición fluida y persistencia de estado global.
- **Soporte Multi-idioma (Inclusión Nacional):** El sistema es totalmente localizable en 5 idiomas: **Español 🇧🇴, Inglés 🇺🇸, Quechua ⛰️, Aymara ☀️ y Guaraní 🏹**, permitiendo una navegación inclusiva para todo el territorio boliviano.
- **Radar Táctico de Alta Intensidad:** Fondo dinámico en el Login que simula un radar militar de escaneo 360°, con efectos de brillo neón y puntos de rastreo (*blips*) en tiempo real.
- **Login de Seguridad Institucional:** Pantalla de autenticación con simulación de túnel VPN, efecto de escaneo biométrico y protección estricta de rutas (RBAC).
- **Sidebar de Comando:** Navegación lateral estructurada que centraliza el acceso rápido a los diferentes módulos (Auditorías, Reportes, Bitácora).

### 🌐 Conexión en Tiempo Real
- **Barra de Estado Nacional (Ticker):** Un panel informativo en la cabecera del portal que incluye un reloj de alta precisión (con milisegundos) y una marquesina dinámica conectada a la API de **Open-Meteo** para reportar el estado climático de los 9 departamentos de Bolivia. Incluye sistema de contingencia sin conexión (Offline-Fallback).

### ⚙️ Arquitectura y Seguridad
- **Patrones de Arquitectura y Diseño:** El sistema está construido bajo los patrones **MVC (Modelo-Vista-Controlador)** en el frontend/backend y **Singleton** para asegurar la capa de datos.
- **Roles y Privilegios (RBAC):** Autenticación y vista adaptativa para 3 roles clave (Comandante General, Administrativo, Auditor).
- **Generador de Reportes (Patrón Factory):** Aplicación de patrones de diseño de software (*Factory Method*) en el backend para la exportación escalable de padrones (PDF, Excel, Word).
- **Trazabilidad Inmutable (Bitácora RF-12):** Implementación de registros inmutables directamente en la estructura de **PostgreSQL**. El frontend refleja esto mediante un módulo de **Bitácora Transaccional** para fiscalizar estrictamente el registro de transacciones.

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
