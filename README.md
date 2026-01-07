# ModelAI Manager

A modern, responsive React application for managing ModelAI entities with full CRUD operations.

## Features

- ✅ Full CRUD operations for ModelAI entities
- ✅ Responsive design with Tailwind CSS
- ✅ Sidebar navigation
- ✅ AWS Amplify GraphQL integration
- ✅ Modern UI with Headless UI components
- ✅ TypeScript support

## Prerequisites

- Node.js 18+ and npm/yarn
- AWS Amplify backend configured (already set up)

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build

Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── Layout.tsx            # Main layout wrapper
│   └── ui/                   # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Modal.tsx
│       └── Table.tsx
├── pages/
│   └── ModelAI/
│       ├── ModelAIList.tsx   # List/Read all
│       ├── ModelAICreate.tsx # Create form
│       ├── ModelAIEdit.tsx   # Update form
│       └── ModelAIDetail.tsx # Detail view
├── hooks/
│   └── useModelAI.ts         # Custom hooks for ModelAI operations
├── utils/
│   └── amplifyClient.ts      # Amplify GraphQL client setup
├── types/
│   └── modelai.ts            # TypeScript types
├── App.tsx                   # Main app component with routing
└── main.tsx                  # React entry point
```

## Routes

- `/` - Redirects to `/modelai`
- `/modelai` - List all ModelAI records
- `/modelai/create` - Create new ModelAI
- `/modelai/:id` - View ModelAI details
- `/modelai/:id/edit` - Edit ModelAI

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- AWS Amplify
- React Router
- Headless UI
- Heroicons

## Tareas principales

1. SSO para las aplicaciones,  autenticación y autorización (prod)

@neider

- Oráculo
- Drones Images
- Model AI manager/Kobol Integración

MVR (monitoring, verificaction, reporting)
Plataformas independientes
Monitoreo son servicios de oraculo

2. ETL Glue / Athena parquet

@muaricio pruebas
@rances
@robin

- IoT
- Forms (Hoja de vida de los arboles)

3. Multimodelos

@luis_miguel
@mauricio

- Publicación y aprobación a través "Model AI Manager"

4. Migración Alchemy MySQL => AppSync GraphQL

@mauricio
@robin

5. Integración Kobol

@robin
@rances

6. Codificacion

Proyecto => Predio => Parcelas => Arbol_ID (lat,long)
Codificacion clara


COL_MET_<PREDIO_COD>_<PARCELA_COD>_<ARBOL_ID>

PREDIO_GEOJSON_POLYGON
PARCELA_GEOJSON_POLYGON

PCI, "Cuarto de dato"

Estandarización de los 

Punto de muestreo, no como árbol

[] Mirar la codificación por departamento/municipio


7. Herramienta de drones, imágenes

Predio => Parcela => 
"Cuarto de datos"