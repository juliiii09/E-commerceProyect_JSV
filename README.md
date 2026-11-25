# MEVE · Aura Skin Lab — Clinical & Botanical Skincare E-Commerce

> **Plataforma E-Commerce Fullstack de Dermocosmética Inteligente**  
> Experiencia de compra editorial (*Quiet Luxury*), motor bioquímico de Inteligencia Artificial integrado en todo el recorrido del usuario y Panel de Administración protegido con validación criptográfica de credenciales y gestión de vistas en tiempo real.

---

## Tabla de Contenidos

1. [Resumen del Proyecto](#-resumen-del-proyecto)
2. [Arquitectura & Stack Tecnológico](#-arquitectura--stack-tecnológico)
3. [Ecosistema de Inteligencia Artificial (6 Módulos)](#-ecosistema-de-inteligencia-artificial-6-módulos)
4. [Panel de Administración & Seguridad (`/admin`)](#-panel-de-administración--seguridad-admin)
5. [Estructura del Repositorio](#-estructura-del-repositorio)
6. [Esquema de Base de Datos (Supabase / PostgreSQL)](#-esquema-de-base-de-datos-supabase--postgresql)
7. [Instalación y Ejecución Local](#-instalación-y-ejecución-local)
8. [Rutas Principales y Credenciales de Prueba](#-rutas-principales-y-credenciales-de-prueba)

---

## Resumen del Proyecto

**MEVE (Aura Skin Lab)** es un e-commerce especializado en formulaciones dermatológicas y botánicas de alta eficacia. Resuelve la principal fricción en la compra de *skincare* online: **saber qué activos son bioquímicamente compatibles entre sí y cuáles corresponden al biotipo de cada persona**.

El diseño visual sigue una línea **minimalista, armónica y editorial** (*Quiet Luxury*), combinando tonos alabastro (`#faf8f5`), lino cálido (`#f4f1ea` / `#f5f2ec`), verde eucalipto profundo (`#2f3e33`) y tipografía serif (`Cormorant Garamond`) e interfaz sans (`Plus Jakarta Sans`).

---

## Arquitectura & Stack Tecnológico

| Capa | Tecnología | Implementación en el Proyecto |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.4.2 (App Router + Turbopack)** | Rutas agrupadas `(shop)`, Route Handlers (`/api/*`), convención `src/proxy.ts` para protección de rutas y SSR/CSR híbrido. |
| **UI & Runtime** | **React 19.3 + TypeScript 5** | Hooks sincronizados con `useSyncExternalStore` (`useHasMounted`) para hidratación limpia sin *cascading renders*. |
| **Estilos** | **Tailwind CSS 4 + Lucide Icons** | Paleta botánica personalizada, bordes capilares (`border-stone-200/80`) y microinteracciones fluidas. |
| **Estado & Persistencia** | **Zustand (`persist` middleware)** | 3 stores reactivos sincronizados en `localStorage`: Catálogo (`meve-products-store`), Carrito (`aura-cart-storage`) y Órdenes (`meve-orders-store`). |
| **Motor de IA** | **Motor Bioquímico Clínico + Google Gemini API** | Reglas determinísticas de sinergia/conflicto de activos + integración opcional con `gemini-1.5-flash` en `/api/ai/chat`. |
| **Seguridad Admin** | **Web Crypto API (`HMAC-SHA256`)** | Tokens de sesión firmados sin estado, cookies `HttpOnly`, comparación en tiempo constante y *rate limiting* contra fuerza bruta. |
| **Base de Datos SQL** | **Supabase (PostgreSQL)** | Migraciones completas y `seed.sql` listos en `/supabase` para despliegue conectado. |

---

## Ecosistema de Inteligencia Artificial (6 Módulos)

Todas las interfaces de IA comparten un diseño minimalista tipo nota de laboratorio/botica e interactúan en vivo con el catálogo activo:

### 1. Consultora Clínica Flotante — *Dra. Aura IA* (`FloatingAiAdvisor`)
- **Ubicación**: Botón discreto `Consulta IA` disponible en toda la tienda pública (`src/components/ai/floating-ai-advisor.tsx`).
- **Capacidades**: Responde dudas sobre acné, manchas, embarazo, rosácea, hidratación o mezcla de activos mediante `/api/ai/chat` (compatible con `GEMINI_API_KEY` y motor clínico local de respaldo), sugiriendo productos reales del catálogo con botón directo para agregarlos a la bolsa.

### 2. Analizador Bioquímico de Sinergia en Bolsa y Carrito (`CartSynergyAnalyzer`)
- **Ubicación**: Integrado dentro del `CartDrawer` lateral y en la página `/cart`.
- **Capacidades**: Evalúa en tiempo real los productos agregados a la bolsa:
  - Calcula el **Puntaje de Compatibilidad (`%`)**.
  - Muestra el balance de la rutina en 4 pilares: **Limpieza · Activos · Barrera · SPF**.
  - Detecta **sinergias positivas** (ej. *Ácido Hialurónico B5 + Ceramidas*, *Vitamina C + Protector Solar SPF 50+*).
  - Emite **alertas de precaución bioquímica** si detecta conflictos (ej. *Retinal + BHA exfoliante* en la misma rutina nocturna).
  - Recomienda el **eslabón faltante** de la rutina con adición en un clic.

### 3. Ficha de Afinidad Dérmica y *Layering* por Producto (`ProductAiInsight`)
- **Ubicación**: Página de detalle de cada fórmula (`/product/[slug]`).
- **Capacidades**:
  - Calcula el porcentaje de afinidad para cada biotipo (**Mixta, Grasa, Seca, Sensible, Normal**).
  - Indica el protocolo exacto de capas (*Aplicar después de...* y *Sellar con...*) y una nota bioquímica personalizada.
  - Sugiere la **Pareja Sinérgica Ideal** del catálogo y permite agregar la dupla en un solo clic.

### 4. Laboratorio Interactivo de Compatibilidad de Activos (`IngredientCompatibilityLab`)
- **Ubicación**: Página de inicio (`/`).
- **Capacidades**: Simulador a dos columnas donde el usuario selecciona cualquier par de activos dermatológicos (*Retinal 0.1%*, *Niacinamida 10%*, *Ácido Salicílico BHA 2%*, *Vitamina C 15%*, *Ácido Hialurónico + B5*, *Ceramidas Bioidénticas*) y obtiene al instante el veredicto (`Sinergia Óptima`, `Alternar AM / PM` o `Separar Noches`), protocolo de uso y las dos fórmulas recomendadas.

### 5. Buscador Semántico por Síntomas en Lenguaje Natural (`/catalog`)
- **Ubicación**: Barra superior del catálogo (`src/app/(shop)/catalog/page.tsx`).
- **Capacidades**: Permite describir síntomas libres (*"siento la cara tirante, roja y me arde con el frío"* o *"tengo poros abiertos y brillo en la zona T"*) y filtra las fórmulas con su porcentaje de coincidencia clínica (`% match`).

### 6. Diagnóstico Dermatológico Completo en 4 Pasos (`/ai-consultant`)
- **Ubicación**: Ruta dedicada `/ai-consultant`.
- **Capacidades**: Cuestionario guiado (Biotipo, Preocupación Principal, Reactividad/Sensibilidad y Preferencia de Textura) que construye un protocolo completo de **Mañana (AM)** y **Noche (PM)** con botón para añadir la rutina completa a la bolsa.

---

## Panel de Administración & Seguridad (`/admin`)

El panel administrativo está completamente aislado de la tienda pública (oculta `Navbar`, `Footer`, `CartDrawer` y el botón flotante de IA) y cuenta con seguridad a nivel de servidor y cliente:

### Seguridad y Validación de Credenciales
- **Proxy de Protección (`src/proxy.ts`)**: Intercepta todas las peticiones a `/admin/:path*`, verifica la firma criptográfica `HMAC-SHA256` de la cookie `HttpOnly` (`meve_admin_session`) y redirige a `/admin/login` si no es válida o expiró.
- **Protección contra Fuerza Bruta (`/api/admin/auth/login`)**: Bloquea temporalmente la IP/sesión con código `HTTP 429` tras 5 intentos fallidos consecutivos durante 60 segundos.
- **Comparación en Tiempo Constante (`timingSafeEqualStr`)**: Evita ataques de temporización al validar correos y contraseñas.
- **Validaciones en Cliente y Servidor**: Formato RFC de correo, longitud mínima de contraseña (8 caracteres), políticas de complejidad (mayúscula, número y símbolo) y bloqueo visual con cuenta regresiva.

### Módulos del Panel
1. **Dashboard Ejecutivo (`/admin`)**: KPIs financieros, unidades vendidas, alertas de stock bajo (`<= 10 uds`), últimas órdenes y tabla rápida del inventario.
2. **Gestión de Productos, Vistas y Copiloto IA (`/admin/products`)**:
   - **Crear y editar fórmulas** en un modal organizado en 3 pestañas (*Datos & Ficha Clínica*, *Galería & Ángulos*, *Vistas de Tienda & IA*).
   - **Gestor de Galería Multi-Ángulo**: Agrega múltiples fotografías por URL o presets curados, reordena la portada principal y elimina ángulos (sincronizado con las miniaturas de `/product/[slug]`).
   - **Interruptores de Vistas en Tiempo Real**:
     - `Publicada / Oculta`: Muestra u oculta el producto inmediatamente de la tienda pública.
     - `Home`: Destaca o retira la fórmula de la portada principal.
     - `IA`: Activa o pausa la fórmula en las recomendaciones de *Dra. Aura IA*.
   - **Copiloto IA de Redacción Clínica**: Al escribir el nombre del producto y sus ingredientes activos, el botón *"Autocompletar con IA"* redacta automáticamente el subtítulo, descripción clínica, modo de uso, beneficios, textura, biotipos compatibles y nota para el motor de IA.
3. **Gestión de Órdenes (`/admin/orders`)**: Visualización de pedidos creados desde `/checkout`, filtro por estado (`paid`, `shipped`, `pending`, `cancelled`), cambio de estado en tiempo real y desglose de productos y dirección de envío.

---

## Estructura del Repositorio

```text
E-commerceProyect_JSV/
├── aura-skin-lab/                          # Aplicación Next.js 16 (App Router)
│   ├── src/
│   │   ├── proxy.ts                        # Guardián de rutas /admin (Next.js 16 Proxy)
│   │   ├── app/
│   │   │   ├── (shop)/                     # Rutas de la tienda pública
│   │   │   │   ├── catalog/page.tsx        # Catálogo + Buscador IA por síntomas
│   │   │   │   ├── product/[slug]/         # Detalle SSR/CSR + Galería + Ficha IA
│   │   │   │   ├── cart/page.tsx           # Bolsa completa + Analizador de Sinergia IA
│   │   │   │   └── checkout/page.tsx       # Checkout conectado al store de órdenes
│   │   │   ├── ai-consultant/page.tsx      # Diagnóstico dermatológico en 4 pasos
│   │   │   ├── admin/                      # Panel de Administración protegido
│   │   │   │   ├── layout.tsx              # Sidebar administrativo + sesión activa
│   │   │   │   ├── login/page.tsx          # Login con validaciones y bloqueo 429
│   │   │   │   ├── page.tsx                # Dashboard de métricas e inventario
│   │   │   │   ├── products/page.tsx       # CRUD de productos, galerías, vistas y Copiloto IA
│   │   │   │   └── orders/page.tsx         # Gestión de órdenes y estados de envío
│   │   │   ├── api/
│   │   │   │   ├── admin/auth/             # Endpoints login, logout y me (HttpOnly cookie)
│   │   │   │   ├── ai/chat/route.ts        # Endpoint conversacional Dra. Aura IA
│   │   │   │   ├── ai/routine/route.ts     # Endpoint de generación de rutina
│   │   │   │   └── checkout/route.ts       # Procesamiento de orden
│   │   │   ├── layout.tsx                  # Layout raíz (tipografías, Navbar, CartDrawer, Dra. Aura)
│   │   │   └── page.tsx                    # Landing Page + Selector IA + Laboratorio de Activos
│   │   ├── components/
│   │   │   ├── ai/                         # Suite minimalista de componentes de IA
│   │   │   │   ├── floating-ai-advisor.tsx
│   │   │   │   ├── cart-synergy-analyzer.tsx
│   │   │   │   ├── product-ai-insight.tsx
│   │   │   │   └── ingredient-compatibility-lab.tsx
│   │   │   ├── layout/                     # Navbar, Footer, CartDrawer
│   │   │   ├── product/                    # ProductView (galería interactiva) y SlugResolver
│   │   │   └── ui/                         # Botones y primitivos visuales
│   │   ├── data/
│   │   │   └── mock-products.ts            # Catálogo inicial curado de 8 fórmulas clínicas
│   │   ├── hooks/
│   │   │   └── use-has-mounted.ts          # Hook React 19 con useSyncExternalStore
│   │   ├── lib/
│   │   │   ├── admin-auth.ts               # Criptografía HMAC-SHA256 y validación de credenciales
│   │   │   └── clinical-ai-engine.ts       # Motor bioquímico de sinergia, síntomas y copy clínico
│   │   └── store/
│   │       ├── use-cart-store.ts           # Estado persistente de la bolsa de compras
│   │       ├── use-product-store.ts        # Estado persistente de productos, galerías y vistas
│   │       └── use-order-store.ts          # Estado persistente de órdenes de clientes
│   ├── package.json
│   └── tsconfig.json
├── supabase/                               # Scripts SQL para PostgreSQL / Supabase
│   ├── migrations/001_initial_schema.sql
│   └── seed.sql
└── README.md
```

---

## Esquema de Base de Datos (Supabase / PostgreSQL)

El directorio [`supabase/`](./supabase) incluye la migración inicial (`001_initial_schema.sql`) y los datos semilla (`seed.sql`) con las tablas:
- `categories`: Categorías dermatológicas (*Limpiadores, Serums, Hidratantes, Tratamientos, Protección Solar*).
- `products`: Fórmulas con `skin_types`, `active_ingredients`, `images`, `stock`, `price` y `rating`.
- `orders` & `order_items`: Registro transaccional de compras y direcciones de envío.

> **Nota**: En modo local por defecto, la aplicación funciona al **100% sin requerir configuración externa** gracias a sus stores persistentes en `localStorage` (`Zustand`), permitiendo crear productos, cambiar vistas, generar órdenes en `/checkout` y administrarlas en `/admin` de inmediato.

---

## Instalación y Ejecución Local

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/juliiii09/E-commerceProyect_JSV.git
   cd E-commerceProyect_JSV/aura-skin-lab
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Variables de entorno (Opcional)**:
   Crea un archivo `.env.local` dentro de `aura-skin-lab/` si deseas personalizar el secreto HMAC o conectar Google Gemini / Supabase:
   ```env
   ADMIN_JWT_SECRET=meve-skin-lab-hmac-secret-key-2026-clinical-auth
   GEMINI_API_KEY=tu_api_key_opcional_de_google_gemini
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_opcional
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_opcional
   ```

4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Rutas Principales y Credenciales de Prueba

### Tienda Pública
- **Inicio & Laboratorio de Activos IA**: `http://localhost:3000/`
- **Catálogo & Buscador por Síntomas IA**: `http://localhost:3000/catalog`
- **Diagnóstico Dermatológico en 4 Pasos**: `http://localhost:3000/ai-consultant`
- **Bolsa & Analizador Bioquímico de Rutina**: `http://localhost:3000/cart`
- **Checkout**: `http://localhost:3000/checkout`

### Panel de Administración
- **Acceso Login**: `http://localhost:3000/admin/login`
- **Dashboard**: `http://localhost:3000/admin`
- **Gestión de Productos, Vistas y Copiloto IA**: `http://localhost:3000/admin/products`
- **Gestión de Órdenes**: `http://localhost:3000/admin/orders`

| Rol | Correo Electrónico | Contraseña |
| :--- | :--- | :--- |
| **Directora Clínica (Admin)** | `admin@meve.com` | `MeveAdmin2026!` |
| **Gestor de Inventario** | `operaciones@meve.com` | `Operaciones2026!` |
