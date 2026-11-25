export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: "Limpiadores" | "Serums" | "Hidratantes" | "Protección Solar";
  price: number;
  stock?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  skinTypes: ("Seca" | "Grasa" | "Mixta" | "Sensible" | "Normal")[];
  concerns: ("acné" | "poros" | "deshidratación" | "antiedad" | "rojeces" | "manchas")[];
  activeIngredients: string[];
  image: string;
  gallery?: string[];
  isVisible?: boolean;
  isFeatured?: boolean;
  aiRecommended?: boolean;
  aiClinicalNote?: string;
  volume: string;
  description: string;
  howToUse: string;
  texture: string;
  routineStep: "Paso 1: Limpieza" | "Paso 2: Tratamiento & Activos" | "Paso 3: Hidratación" | "Paso 4: Fotoprotección";
  timeOfDay: "Día y Noche" | "Solo Noche" | "Solo Día";
  benefits: string[];
}

export const PRODUCTS_CATALOG: ProductItem[] = [
  {
    id: "prod-1",
    name: "Ceramide Barrier Rescue Cream",
    slug: "ceramide-barrier-rescue-cream",
    tagline: "Crema reparadora intensiva con 5 ceramidas bioidénticas y péptidos.",
    category: "Hidratantes",
    price: 38.00,
    rating: 4.9,
    reviewsCount: 142,
    badge: "Bestseller",
    skinTypes: ["Seca", "Sensible", "Normal", "Mixta"],
    concerns: ["deshidratación", "rojeces", "antiedad"],
    activeIngredients: ["5 Ceramidas (NP, AP, EOP)", "Péptidos de Cobre", "Centella Asiática 3%"],
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    volume: "50 ml / 1.7 fl. oz.",
    description: "Restaura la barrera lipídica comprometida, alivia rojeces al instante y previene la pérdida transepidérmica de agua sin obstruir poros.",
    howToUse: "Aplicar una porción del tamaño de una almendra sobre rostro y cuello limpios. Masajear suavemente con movimientos ascendentes hasta su total absorción.",
    texture: "Crema rica sedosa de rápida absorción, acabado no graso",
    routineStep: "Paso 3: Hidratación",
    timeOfDay: "Día y Noche",
    benefits: [
      "Reparación celular de la barrera cutánea en 48 horas",
      "Alivio inmediato de tirantez y descamación",
      "Refuerzo del microbioma dérmico natural"
    ]
  },
  {
    id: "prod-2",
    name: "Niacinamide 10% Pore Clarifier",
    slug: "niacinamide-10-zinc-pore-clarifier",
    tagline: "Serum ultra-concentrado seborregulador y perfeccionador de textura.",
    category: "Serums",
    price: 32.00,
    rating: 4.8,
    reviewsCount: 238,
    badge: "Fórmula de Culto",
    skinTypes: ["Grasa", "Mixta", "Sensible"],
    concerns: ["poros", "acné", "manchas"],
    activeIngredients: ["Niacinamida 10%", "Zinc PCA 1%", "Alantoína 0.5%"],
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    volume: "30 ml / 1.0 fl. oz.",
    description: "Minimiza la apariencia de poros dilatados, equilibra la producción de sebo excesivo y desvanece marcas post-inflamatorias y manchas solares.",
    howToUse: "Aplicar 3-4 gotas en el rostro por la mañana y noche sobre la piel limpia, antes de cremas hidratantes más densas.",
    texture: "Gel fluido transparente ultra liviano, absorción instantánea",
    routineStep: "Paso 2: Tratamiento & Activos",
    timeOfDay: "Día y Noche",
    benefits: [
      "Reducción visible del tamaño aparente de los poros en 14 días",
      "Regulación sostenida del brillo en la zona T",
      "Efecto unificador del tono y difuminador de manchas"
    ]
  },
  {
    id: "prod-3",
    name: "Multi-Depth Hyaluronic Acid Elixir",
    slug: "multi-molecular-hyaluronic-acid-serum",
    tagline: "Complejo de hidratación celular en 4 pesos moleculares + B5.",
    category: "Serums",
    price: 36.00,
    rating: 5.0,
    reviewsCount: 185,
    badge: "Favorito de Dermatólogos",
    skinTypes: ["Seca", "Sensible", "Normal", "Mixta", "Grasa"],
    concerns: ["deshidratación", "antiedad"],
    activeIngredients: ["Ácido Hialurónico 4D 2%", "Pro-Vitamina B5 (Pantenol)", "Beta-Glucano"],
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80",
    volume: "30 ml / 1.0 fl. oz.",
    description: "Infundido con 4 pesos moleculares distintos que hidratan desde la superficie hasta las capas dérmicas profundas, aportando turgencia y elasticidad.",
    howToUse: "Aplicar 3 a 5 gotas sobre la piel ligeramente húmeda (después de la limpieza o tónico). Sellar de inmediato con tu crema hidratante.",
    texture: "Serum acuoso cristalino con tacto sedoso hidrofílico",
    routineStep: "Paso 2: Tratamiento & Activos",
    timeOfDay: "Día y Noche",
    benefits: [
      "Aumento del 120% en la hidratación dérmica inmediata",
      "Relleno visual de micro-arrugas por deshidratación",
      "Efecto tensor elástico duradero"
    ]
  },
  {
    id: "prod-4",
    name: "Invisible Silk Mineral SPF 50+",
    slug: "invisible-mineral-fluid-spf-50",
    tagline: "Fotoprotector físico 100% mineral con acabado mate sedoso.",
    category: "Protección Solar",
    price: 34.00,
    rating: 4.9,
    reviewsCount: 164,
    badge: "Sin Residuo Blanco",
    skinTypes: ["Grasa", "Mixta", "Sensible", "Seca", "Normal"],
    concerns: ["manchas", "antiedad", "rojeces"],
    activeIngredients: ["Óxido de Zinc No-Nano 12%", "Ectoína 1%", "Vitamina E Antioxidante"],
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    volume: "50 ml / 1.7 fl. oz.",
    description: "Máxima fotoprotección de amplio espectro contra radiación UVA/UVB, luz azul emitida por pantallas y partículas de polución urbana.",
    howToUse: "Agitar enérgicamente antes de usar. Aplicar dos líneas generosas en los dedos índice y anular como último paso matutino, 15 min antes de salir.",
    texture: "Fluido mate aterciopelado ultraligero, no comedogénico",
    routineStep: "Paso 4: Fotoprotección",
    timeOfDay: "Solo Día",
    benefits: [
      "100% filtros físicos seguros para piel reactiva y arrecifes marinos",
      "Acabado cero blanco, compatible con base de maquillaje",
      "Defensa biológica contra el envejecimiento digital (luz HEV)"
    ]
  },
  {
    id: "prod-5",
    name: "Gentle Centella Balancing Cleanser",
    slug: "gentle-centella-cleansing-gel",
    tagline: "Gel limpiador calmante bio-idéntico con pH equilibrado 5.5.",
    category: "Limpiadores",
    price: 26.00,
    rating: 4.9,
    reviewsCount: 96,
    badge: "pH 5.5",
    skinTypes: ["Sensible", "Seca", "Mixta", "Grasa", "Normal"],
    concerns: ["rojeces", "acné", "deshidratación"],
    activeIngredients: ["Centella Asiática 4%", "Té Verde Orgánico", "Glicerina Vegetal"],
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    volume: "150 ml / 5.1 fl. oz.",
    description: "Disuelve impurezas, exceso de sebo y residuos contaminantes respetando intacta la película hidrolipídica protectora.",
    howToUse: "Masajear suavemente 1 pulsación sobre el rostro húmedo durante 60 segundos con movimientos circulares. Enjuagar con agua tibia.",
    texture: "Gel botánico que genera una micro-espuma suave sin sulfatos",
    routineStep: "Paso 1: Limpieza",
    timeOfDay: "Día y Noche",
    benefits: [
      "Limpieza profunda sin tirantez ni sensación astringente",
      "Calma rojeces e irritaciones provocadas por el clima",
      "Prepara la dermis para maximizar la absorción de los serums"
    ]
  },
  {
    id: "prod-6",
    name: "Encapsulated Retinol 0.3% Night Renew",
    slug: "encapsulated-retinol-renew-serum",
    tagline: "Tratamiento nocturno antiedad con retinol liposomal de liberación lenta.",
    category: "Serums",
    price: 42.00,
    rating: 4.8,
    reviewsCount: 112,
    badge: "Fórmula de Noche",
    skinTypes: ["Normal", "Seca", "Mixta"],
    concerns: ["antiedad", "manchas", "poros"],
    activeIngredients: ["Retinol Microencapsulado 0.3%", "Escualano Vegetal 2%", "Bisabolol"],
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    volume: "30 ml / 1.0 fl. oz.",
    description: "Estimula la renovación epidérmica y la biosíntesis de colágeno mientras duermes, con tecnología de microcápsulas que previene la irritación clásica.",
    howToUse: "Usar exclusivamente por la noche. Iniciar 2 noches por semana y aumentar según tolerancia dérmica. Usar fotoprotector obligatorio de día.",
    texture: "Emulsión sedosa nutritiva no grasa",
    routineStep: "Paso 2: Tratamiento & Activos",
    timeOfDay: "Solo Noche",
    benefits: [
      "Aceleración de la renovación celular en un 40%",
      "Atenuación comprobada de líneas de expresión y arrugas",
      "Tolerancia cutánea superior gracias a la microencapsulación"
    ]
  },
  {
    id: "prod-7",
    name: "Salicylic Acid 2% Clarifying Exfoliant",
    slug: "salicylic-acid-2-clarifying-toner",
    tagline: "Tónico exfoliante líquido con BHA para puntos negros y textura.",
    category: "Limpiadores",
    price: 29.00,
    rating: 4.7,
    reviewsCount: 88,
    badge: "Puntos Negros",
    skinTypes: ["Grasa", "Mixta"],
    concerns: ["acné", "poros"],
    activeIngredients: ["Ácido Salicílico 2% (BHA)", "Extracto de Té Verde", "Pantenol"],
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80",
    volume: "120 ml / 4.0 fl. oz.",
    description: "Penetra en el interior del canal folicular para disolver el sebo oxidado y las células muertas que forman comedones y puntos negros.",
    howToUse: "Empapar un disco de algodón o aplicar con las palmas de las manos sobre el rostro limpio 2-3 noches por semana sin enjuagar.",
    texture: "Líquido astringente suave de rápida penetración",
    routineStep: "Paso 1: Limpieza",
    timeOfDay: "Solo Noche",
    benefits: [
      "Desobstrucción profunda de puntos negros en 7 días",
      "Alisado notable del relieve irregular de la piel",
      "Control de brotes recurrentes"
    ]
  },
  {
    id: "prod-8",
    name: "Peptide & Caffeine Eye Contour",
    slug: "peptide-firming-eye-contour",
    tagline: "Bálsamo descongestivo para ojeras, bolsas y líneas perioculares.",
    category: "Hidratantes",
    price: 35.00,
    rating: 4.9,
    reviewsCount: 74,
    badge: "Antiojeras",
    skinTypes: ["Seca", "Sensible", "Mixta", "Normal", "Grasa"],
    concerns: ["antiedad", "deshidratación"],
    activeIngredients: ["Matrikina Peptides 3%", "Cafeína Pura 2%", "Ácido Hialurónico"],
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    volume: "15 ml / 0.5 fl. oz.",
    description: "Tratamiento multifuncional para la delicada zona del contorno de ojos. Descongestiona bolsas vasculares y drena pigmentos oscuros.",
    howToUse: "Aplicar la cantidad de un grano de arroz en el hueso orbital con suaves toques de las yemas de los dedos anulares mañana y noche.",
    texture: "Gel-crema refrescante no migratorio",
    routineStep: "Paso 3: Hidratación",
    timeOfDay: "Día y Noche",
    benefits: [
      "Drenaje visible de bolsas matutinas en 15 minutos",
      "Aclarado progresivo de ojeras violáceas y marrones",
      "Hidratación que evita que el corrector se cuartee"
    ]
  }
];

// Compatibilidad con imports existentes
export const FEATURED_PRODUCTS = PRODUCTS_CATALOG.slice(0, 4);
