-- ========================================================
-- Aura Skin Lab - Seed Data (Categorías y Productos)
-- ========================================================

-- Insertar Categorías
INSERT INTO categories (id, name, slug, description) VALUES
('c1000000-0000-0000-0000-000000000001', 'Limpiadores', 'limpiadores', 'Fórmulas suaves que respetan la barrera lipídica sin resecar.'),
('c1000000-0000-0000-0000-000000000002', 'Serums & Tratamientos', 'serums-tratamientos', 'Altas concentraciones de activos específicos para cada necesidad.'),
('c1000000-0000-0000-0000-000000000003', 'Hidratantes', 'hidratantes', 'Nutrición y sellado de hidratación profunda.'),
('c1000000-0000-0000-0000-000000000004', 'Protección Solar', 'proteccion-solar', 'Filtros solares ligeros, no comedogénicos y de amplio espectro.')
ON CONFLICT (id) DO NOTHING;

-- Insertar Productos
INSERT INTO products (id, name, slug, tagline, description, how_to_use, price, stock, category_id, skin_types, active_ingredients, images, is_featured, rating) VALUES
(
    'p1000000-0000-0000-0000-000000000001',
    'Gentle Centella Cleansing Gel',
    'gentle-centella-cleansing-gel',
    'Gel limpiador calmante con pH balanceado 5.5',
    'Limpia profundamente impurezas, exceso de sebo y residuos ambientales sin alterar la barrera protectora de la piel.',
    'Aplicar 1-2 pulsaciones sobre el rostro húmedo, masajear en movimientos circulares durante 60 segundos y aclarar con agua tibia.',
    24.00,
    35,
    'c1000000-0000-0000-0000-000000000001',
    ARRAY['dry', 'oily', 'combination', 'sensitive', 'normal'],
    ARRAY['Centella Asiática 5%', 'Té Verde', 'Pantenol B5'],
    ARRAY['/images/products/cleanser.webp'],
    TRUE,
    4.9
),
(
    'p1000000-0000-0000-0000-000000000002',
    'Niacinamide 10% + Zinc Pore Clarifier',
    'niacinamide-10-zinc-pore-clarifier',
    'Serum equilibrante y minimizador de poros',
    'Fórmula de alta potencia para regular la producción sebácea, desvanecer manchas post-inflamatorias y afinar la textura de los poros.',
    'Aplicar 3 a 4 gotas en todo el rostro por la mañana y por la noche antes de cremas más pesadas.',
    28.50,
    40,
    'c1000000-0000-0000-0000-000000000002',
    ARRAY['oily', 'combination', 'sensitive'],
    ARRAY['Niacinamida 10%', 'Zinc PCA 1%', 'Alantoína'],
    ARRAY['/images/products/niacinamide.webp'],
    TRUE,
    4.8
),
(
    'p1000000-0000-0000-0000-000000000003',
    'Multi-Molecular Hyaluronic Acid Serum',
    'multi-molecular-hyaluronic-acid-serum',
    'Complejo de hidratación profunda en 4 pesos moleculares',
    'Penetra en múltiples capas de la epidermis para retener hasta 1,000 veces su peso en agua, devolviendo elasticidad y tersura inmediata.',
    'Aplicar sobre piel ligeramente húmeda por la mañana y noche. Sellar inmediatamente con una crema hidratante.',
    32.00,
    28,
    'c1000000-0000-0000-0000-000000000002',
    ARRAY['dry', 'combination', 'sensitive', 'normal'],
    ARRAY['Ácido Hialurónico 2%', 'Vitamina B5', 'Beta-Glucano'],
    ARRAY['/images/products/hyaluronic.webp'],
    TRUE,
    5.0
),
(
    'p1000000-0000-0000-0000-000000000004',
    'Encapsulated Retinol 0.3% Renew Serum',
    'encapsulated-retinol-renew-serum',
    'Tratamiento nocturno antiedad y regenerador celular',
    'Retinol microencapsulado de liberación sostenida que minimiza la irritación mientras estimula la producción de colágeno y renueva la piel.',
    'Usar únicamente de noche. Iniciar 2 noches por semana y aumentar progresivamente. Aplicar protector solar al día siguiente.',
    39.00,
    20,
    'c1000000-0000-0000-0000-000000000002',
    ARRAY['dry', 'combination', 'normal'],
    ARRAY['Retinol Encapsulado 0.3%', 'Escualano Vegetal', 'Bisabolol'],
    ARRAY['/images/products/retinol.webp'],
    FALSE,
    4.7
),
(
    'p1000000-0000-0000-0000-000000000005',
    'Ceramide Barrier Rescue Cream',
    'ceramide-barrier-rescue-cream',
    'Crema reparadora intensiva con 5 ceramidas esenciales',
    'Nutre y restablece la barrera de lípidos natural, aliviando irritaciones, rojeces y descamación provocadas por agentes externos o tratamientos activos.',
    'Aplicar una cantidad del tamaño de una moneda de 10 céntimos sobre rostro y cuello limpios día y noche.',
    34.00,
    25,
    'c1000000-0000-0000-0000-000000000003',
    ARRAY['dry', 'sensitive', 'normal', 'combination'],
    ARRAY['5 Ceramidas Esenciales (1, 2, 3, 4, 6-II)', 'Colesterol', 'Péptidos'],
    ARRAY['/images/products/ceramide-cream.webp'],
    TRUE,
    4.9
),
(
    'p1000000-0000-0000-0000-000000000006',
    'Invisible Mineral Fluid SPF 50+ PA++++',
    'invisible-mineral-fluid-spf-50',
    'Fotoprotector 100% mineral invisible con toque seda',
    'Protección ultra ligera de amplio espectro contra rayos UVA/UVB, luz azul y polución. No deja residuo blanco ni sensación grasa.',
    'Agitar bien antes de usar. Aplicar generosamente como último paso de tu rutina matutina, 15 minutos antes de la exposición.',
    29.00,
    45,
    'c1000000-0000-0000-0000-000000000004',
    ARRAY['oily', 'dry', 'combination', 'sensitive', 'normal'],
    ARRAY['Óxido de Zinc No-Nano 12%', 'Vitamina E', 'Ectoína'],
    ARRAY['/images/products/sunscreen.webp'],
    TRUE,
    5.0
)
ON CONFLICT (id) DO NOTHING;
