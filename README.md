# Proyecto APROTUR Web

Este es el sitio web oficial de la asociacion APROTUR, desarrollado utilizando React, Next.js y TypeScript. El proyecto cuenta con un panel de administracion para la gestion de contenidos dinamicos y persistencia de datos local mediante un archivo de base de datos simulado.

## Caracteristicas Principales

1. Panel de Administracion (/admin):
   - Gestion de anuncios destacados (Banners superiores).
   - Gestion de presentaciones de diapositivas principales (Slides).
   - Gestion de Galeria de Fotos y Videos con soporte para enlaces de redes sociales (YouTube, Facebook, TikTok, Instagram, Directo).
   - Gestion de Noticias y Comunicados, que incluye la creacion, edicion de contenido, imagenes adjuntas, y seleccionador de fechas nativo.
   - Modulo de revision de documentos y solicitudes cargados a traves del portal virtual Mesa de Partes.

2. Seccion de Noticias:
   - Visualizacion dinamica de comunicados y novedades de la asociacion.
   - Soporte para multiples fotografias por noticia con vista previa interactiva.
   - Formateo automatico de fechas seleccionadas al estilo local de lectura.

3. Mesa de Partes:
   - Formulario interactivo para que los usuarios puedan registrar solicitudes oficiales adjuntando archivos digitales.
   - Panel interno en administracion para evaluar el estado y actualizar las solicitudes recibidas.

## Requisitos Previos

Asegurate de tener instalado Node.js (version 18 o superior recomendada) en tu sistema de desarrollo.

## Instalacion y Ejecucion Local

Sigue los siguientes pasos para poner en marcha el proyecto de manera local:

1. Instalar dependencias del proyecto:
   npm install

2. Ejecutar el servidor en modo desarrollo:
   npm run dev

3. Acceder a la aplicacion:
   Abre tu navegador de preferencia e ingresa a la direccion http://localhost:3000

## Construccion para Produccion

Para generar la compilacion optimizada lista para produccion, utiliza el comando:
npm run build

Este comando ejecutara la verificacion de tipos con TypeScript y empaquetara la aplicacion para su distribucion final.
