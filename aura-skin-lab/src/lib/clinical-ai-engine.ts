import { ProductItem } from "@/data/mock-products";

export interface SynergyAlert {
  type: "warning" | "info" | "success";
  title: string;
  detail: string;
}

export interface CartSynergyReport {
  score: number;
  alerts: SynergyAlert[];
  coveredSteps: {
    cleanse: boolean;
    treat: boolean;
    moisturize: boolean;
    protect: boolean;
  };
  missingSuggestion?: {
    stepLabel: string;
    reason: string;
    product: ProductItem;
  };
}

function hasKeyword(product: ProductItem, keywords: string[]): boolean {
  const haystack = [
    product.name,
    product.tagline,
    product.category,
    ...product.activeIngredients,
  ]
    .join(" ")
    .toLowerCase();
  return keywords.some((k) => haystack.includes(k));
}

export function analyzeCartSynergy(
  cartProducts: ProductItem[],
  catalog: ProductItem[]
): CartSynergyReport {
  const visibleCatalog = catalog.filter(
    (p) => p.isVisible !== false && p.aiRecommended !== false
  );
  const cartIds = new Set(cartProducts.map((p) => p.id));

  const coveredSteps = {
    cleanse: cartProducts.some(
      (p) =>
        p.category === "Limpiadores" || p.routineStep.startsWith("Paso 1")
    ),
    treat: cartProducts.some(
      (p) => p.category === "Serums" || p.routineStep.startsWith("Paso 2")
    ),
    moisturize: cartProducts.some(
      (p) =>
        p.category === "Hidratantes" || p.routineStep.startsWith("Paso 3")
    ),
    protect: cartProducts.some(
      (p) =>
        p.category === "Protección Solar" || p.routineStep.startsWith("Paso 4")
    ),
  };

  if (cartProducts.length === 0) {
    return {
      score: 0,
      alerts: [],
      coveredSteps,
    };
  }

  const hasRetinoid = cartProducts.some((p) =>
    hasKeyword(p, ["retinol", "retinal", "retinoide"])
  );
  const hasExfoliantAcid = cartProducts.some((p) =>
    hasKeyword(p, ["salicílico", "salicylic", "bha", "aha", "glicólico", "exfoliant"])
  );
  const hasBarrierRepair = cartProducts.some((p) =>
    hasKeyword(p, ["ceramida", "ceramide", "centella", "pantenol", "b5", "hialurónico", "hyaluronic"])
  );
  const hasNiacinamide = cartProducts.some((p) =>
    hasKeyword(p, ["niacinamida", "niacinamide"])
  );

  let score = 88;
  const alerts: SynergyAlert[] = [];

  if (hasRetinoid && hasExfoliantAcid) {
    score -= 14;
    alerts.push({
      type: "warning",
      title: "Precaución Bioquímica: Retinol + Ácido Exfoliante",
      detail:
        "No apliques ambos la misma noche. Úsalos en noches alternas (ciclo skin-cycling) para evitar irritación o descamación.",
    });
  }

  if ((hasRetinoid || hasExfoliantAcid) && !coveredSteps.protect) {
    score -= 10;
    alerts.push({
      type: "warning",
      title: "Fotoprotección Diurna Requerida",
      detail:
        "Tu bolsa incluye activos renovadores fotosensibles. Es indispensable acompañarlos con SPF 50+ cada mañana.",
    });
  }

  if (hasRetinoid && hasBarrierRepair) {
    score += 6;
    alerts.push({
      type: "success",
      title: "Sinergia Ideal: Renovación + Reparación de Barrera",
      detail:
        "Excelente combinación. Las ceramidas/humectantes amortiguan la acción del retinol mediante la técnica sándwich.",
    });
  } else if (hasNiacinamide && hasBarrierRepair) {
    score += 5;
    alerts.push({
      type: "success",
      title: "Alta Sinergia Calmante & Seborreguladora",
      detail:
        "La Niacinamida potencia la síntesis natural de ceramidas y equilibra la barrera hidrolipídica sin irritar.",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      type: "info",
      title: "Fórmulas 100% Compatibles entre sí",
      detail:
        "No se detectaron conflictos de pH ni superposición de activos irritantes en tu selección actual.",
    });
  }

  const completedCount = Object.values(coveredSteps).filter(Boolean).length;
  score = Math.min(99, Math.max(62, score + completedCount * 2));

  // Recomendar el paso faltante más relevante
  let missingSuggestion: CartSynergyReport["missingSuggestion"] = undefined;

  if ((hasRetinoid || hasExfoliantAcid) && !coveredSteps.protect) {
    const spf = visibleCatalog.find(
      (p) =>
        !cartIds.has(p.id) &&
        (p.category === "Protección Solar" || p.routineStep.startsWith("Paso 4"))
    );
    if (spf) {
      missingSuggestion = {
        stepLabel: "Paso 4: Escudo Solar Obligatorio",
        reason: "Protege la piel renovada del fotodaño y manchas post-inflamatorias.",
        product: spf,
      };
    }
  } else if (!coveredSteps.cleanse) {
    const cleanser = visibleCatalog.find(
      (p) =>
        !cartIds.has(p.id) &&
        (p.category === "Limpiadores" || p.routineStep.startsWith("Paso 1"))
    );
    if (cleanser) {
      missingSuggestion = {
        stepLabel: "Paso 1: Limpieza Preparatoria",
        reason: "Prepara el pH 5.5 para multiplicar la penetración de tus activos.",
        product: cleanser,
      };
    }
  } else if (!coveredSteps.moisturize) {
    const cream = visibleCatalog.find(
      (p) =>
        !cartIds.has(p.id) &&
        (p.category === "Hidratantes" || p.routineStep.startsWith("Paso 3"))
    );
    if (cream) {
      missingSuggestion = {
        stepLabel: "Paso 3: Sellado Lipídico",
        reason: "Evita la pérdida transepidérmica de agua y sella el tratamiento.",
        product: cream,
      };
    }
  } else if (!coveredSteps.protect) {
    const spf = visibleCatalog.find(
      (p) =>
        !cartIds.has(p.id) &&
        (p.category === "Protección Solar" || p.routineStep.startsWith("Paso 4"))
    );
    if (spf) {
      missingSuggestion = {
        stepLabel: "Paso 4: Fotoprotección Diaria",
        reason: "Completa los 4 pilares clínicos para prevenir el fotoenvejecimiento.",
        product: spf,
      };
    }
  }

  return {
    score,
    alerts,
    coveredSteps,
    missingSuggestion,
  };
}

export interface ProductAiSkinInsight {
  affinityScore: number;
  statusLabel: string;
  verdict: string;
  applyBefore: string;
  applyAfter: string;
  avoidMixing: string;
  synergyPartner?: ProductItem;
  synergyReason?: string;
}

export function analyzeProductForSkin(
  product: ProductItem,
  skinType: "Seca" | "Grasa" | "Mixta" | "Sensible" | "Normal",
  catalog: ProductItem[]
): ProductAiSkinInsight {
  const isDirectMatch = product.skinTypes.includes(skinType);
  const isRetinolOrAcid = hasKeyword(product, [
    "retinol",
    "salicílico",
    "bha",
    "aha",
    "exfoliant",
  ]);

  let affinityScore = isDirectMatch ? 96 : 76;
  let statusLabel = isDirectMatch
    ? `Afinidad Óptima para Piel ${skinType}`
    : `Uso Adaptado en Piel ${skinType}`;

  let verdict = product.aiClinicalNote || "";

  if (!verdict) {
    if (isDirectMatch && skinType === "Sensible" && isRetinolOrAcid) {
      affinityScore = 82;
      statusLabel = "Introducir Progresivamente";
      verdict = `Sus activos (${product.activeIngredients[0]}) son eficaces, pero en piel sensible recomendamos iniciar 2 veces por semana sobre piel seca.`;
    } else if (isDirectMatch) {
      verdict = `Su vehículo "${product.texture.toLowerCase()}" y concentración de ${
        product.activeIngredients[0] || "activos botánicos"
      } están calibrados para equilibrar la piel ${skinType.toLowerCase()} sin saturar los poros.`;
    } else {
      affinityScore = skinType === "Sensible" && isRetinolOrAcid ? 68 : 78;
      verdict = `Esta fórmula está priorizada para piel ${product.skinTypes.join(
        "/"
      )}. En piel ${skinType.toLowerCase()}, aplícala únicamente de forma localizada o acompañada de una crema reparadora de ceramidas.`;
    }
  }

  let applyBefore = "Rostro recién lavado y ligeramente húmedo";
  let applyAfter = "Crema hidratante reparadora y SPF 50+ (de día)";
  let avoidMixing = "Totalmente compatible con el resto del catálogo";

  if (product.routineStep.startsWith("Paso 1")) {
    applyBefore = "Primer paso sobre piel húmeda (o tras desmaquillante)";
    applyAfter = "Serum de tratamiento activo e hidratante";
  } else if (product.routineStep.startsWith("Paso 2")) {
    applyBefore = "Limpiador suave de pH 5.5";
    applyAfter =
      product.timeOfDay === "Solo Noche"
        ? "Crema nutritiva de ceramidas para sellar durante la noche"
        : "Hidratante ligera + Fotoprotector Mineral SPF 50+";
  } else if (product.routineStep.startsWith("Paso 3")) {
    applyBefore = "Limpiador + Serum acuoso de activos";
    applyAfter =
      product.timeOfDay === "Solo Noche"
        ? "Último paso nocturno"
        : "Fotoprotector SPF 50+ en la rutina matutina";
  } else if (product.routineStep.startsWith("Paso 4")) {
    applyBefore = "Serum antioxidante o crema hidratante ligera";
    applyAfter = "Último paso del cuidado facial (antes del maquillaje)";
  }

  if (hasKeyword(product, ["retinol"])) {
    avoidMixing =
      "Evita combinar en la misma noche con Ácido Salicílico (BHA), AHA o Vitamina C pura ácida.";
  } else if (hasKeyword(product, ["salicílico", "bha", "aha"])) {
    avoidMixing =
      "No superponer en la misma sesión nocturna con Retinol ni exfoliantes físicos.";
  }

  const candidates = catalog.filter(
    (p) => p.id !== product.id && p.isVisible !== false && p.aiRecommended !== false
  );

  let synergyPartner: ProductItem | undefined;
  let synergyReason = "";

  if (isRetinolOrAcid) {
    synergyPartner = candidates.find((p) =>
      hasKeyword(p, ["ceramida", "ceramide", "centella"])
    );
    synergyReason =
      "Amortigua la renovación celular y refuerza los lípidos para cero irritación.";
  } else if (product.category === "Limpiadores") {
    synergyPartner = candidates.find((p) => p.category === "Serums");
    synergyReason =
      "Con los poros limpios a pH 5.5, este serum duplica su biodisponibilidad dérmica.";
  } else if (product.category === "Serums") {
    synergyPartner = candidates.find((p) => p.category === "Hidratantes");
    synergyReason =
      "Sella los activos hidrofílicos del serum impidiendo que se evaporen.";
  } else {
    synergyPartner = candidates.find((p) => p.category === "Protección Solar") || candidates[0];
    synergyReason =
      "Protege los resultados del tratamiento frente a la radiación UV diaria.";
  }

  return {
    affinityScore,
    statusLabel,
    verdict,
    applyBefore,
    applyAfter,
    avoidMixing,
    synergyPartner,
    synergyReason,
  };
}

export interface SymptomMatchResult {
  product: ProductItem;
  score: number;
  aiReason: string;
}

export function matchProductsBySymptom(
  rawQuery: string,
  catalog: ProductItem[]
): SymptomMatchResult[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return [];

  const detectedConcerns = new Set<ProductItem["concerns"][number]>();
  const detectedSkinTypes = new Set<ProductItem["skinTypes"][number]>();

  if (/(acne|acné|granit|brote|espinill|barrit|comedon)/.test(q)) {
    detectedConcerns.add("acné");
    detectedConcerns.add("poros");
  }
  if (/(poro|punto negro|brill|sebo|gras|zona t|textura)/.test(q)) {
    detectedConcerns.add("poros");
    detectedSkinTypes.add("Grasa");
    detectedSkinTypes.add("Mixta");
  }
  if (/(seca|tirant|deshidrat|escam|apagad|agua|humect)/.test(q)) {
    detectedConcerns.add("deshidratación");
    detectedSkinTypes.add("Seca");
  }
  if (/(arrug|edad|línea|linea|firmeza|colágeno|colageno|ojer|bolsa|noche)/.test(q)) {
    detectedConcerns.add("antiedad");
  }
  if (/(roja|rojec|rosácea|rosacea|irrit|arde|sensib|calma|barrera)/.test(q)) {
    detectedConcerns.add("rojeces");
    detectedSkinTypes.add("Sensible");
  }
  if (/(manch|sol|tono|marca|pigment|protector|spf|uv)/.test(q)) {
    detectedConcerns.add("manchas");
  }

  const visible = catalog.filter((p) => p.isVisible !== false);

  const scored: SymptomMatchResult[] = visible
    .map((product) => {
      let score = 0;
      const matchedReasons: string[] = [];

      for (const c of detectedConcerns) {
        if (product.concerns.includes(c)) {
          score += 32;
          matchedReasons.push(`actúa sobre ${c}`);
        }
      }
      for (const st of detectedSkinTypes) {
        if (product.skinTypes.includes(st)) {
          score += 14;
        }
      }

      const fullText = [
        product.name,
        product.tagline,
        product.description,
        ...product.activeIngredients,
      ]
        .join(" ")
        .toLowerCase();

      const words = q.split(/\s+/).filter((w) => w.length >= 4);
      for (const w of words) {
        if (fullText.includes(w)) {
          score += 18;
        }
      }

      if (
        /(sol|spf|protector|uv)/.test(q) &&
        product.category === "Protección Solar"
      ) {
        score += 40;
        matchedReasons.push("escudo mineral UV/HEV");
      }

      const aiReason =
        matchedReasons.length > 0
          ? `Seleccionada por IA porque ${matchedReasons.slice(0, 2).join(" y ")} gracias a ${product.activeIngredients[0] || "su complejo activo"}.`
          : `Fórmula compatible rica en ${product.activeIngredients.slice(0, 2).join(" + ")}.`;

      return {
        product,
        score: Math.min(99, score),
        aiReason,
      };
    })
    .filter((item) => item.score >= 20)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 4);
}

export function generateClinicalDraftFromPrompt(
  name: string,
  activeText: string,
  category: ProductItem["category"]
) {
  const cleanName = name.trim() || "Bio-Active Cellular Elixir";
  const actives = activeText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const primaryActive = actives[0] || "Complejo Péptido Botánico 5%";
  const lower = `${cleanName} ${activeText}`.toLowerCase();

  let concerns: ProductItem["concerns"] = ["deshidratación", "antiedad"];
  let skinTypes: ProductItem["skinTypes"] = ["Normal", "Mixta", "Sensible"];
  let timeOfDay: ProductItem["timeOfDay"] = "Día y Noche";
  let routineStep: ProductItem["routineStep"] = "Paso 2: Tratamiento & Activos";
  let volume = "30 ml / 1.0 fl. oz.";
  let texture = "Serum fluido sedoso de rápida absorción celular";

  if (category === "Limpiadores") {
    routineStep = "Paso 1: Limpieza";
    volume = "150 ml / 5.1 fl. oz.";
    texture = "Gel dermo-limpiador sin sulfatos con pH fisiológico 5.5";
  } else if (category === "Hidratantes") {
    routineStep = "Paso 3: Hidratación";
    volume = "50 ml / 1.7 fl. oz.";
    texture = "Emulsión lamelar aterciopelada no comedogénica";
  } else if (category === "Protección Solar") {
    routineStep = "Paso 4: Fotoprotección";
    timeOfDay = "Solo Día";
    volume = "50 ml / 1.7 fl. oz.";
    texture = "Fluido ultraligero de toque seco e invisible";
    concerns = ["manchas", "antiedad", "rojeces"];
  }

  if (/(retinol|retinal|bakuchiol|peptid|péptid)/.test(lower)) {
    concerns = ["antiedad", "manchas", "poros"];
    if (/retinol|retinal/.test(lower)) timeOfDay = "Solo Noche";
  } else if (/(salic|bha|zinc|niacinam|azelaic|acne|acné)/.test(lower)) {
    concerns = ["acné", "poros", "manchas"];
    skinTypes = ["Grasa", "Mixta", "Sensible"];
  } else if (/(vitamin.*c|ascorb|tranexam|arbutin|manch)/.test(lower)) {
    concerns = ["manchas", "antiedad"];
    timeOfDay = "Solo Día";
  } else if (/(centella|ceramid|avena|pantenol|b5|aloe)/.test(lower)) {
    concerns = ["rojeces", "deshidratación"];
    skinTypes = ["Seca", "Sensible", "Mixta", "Normal"];
  }

  return {
    tagline: `Fórmula clínica concentrada con ${primaryActive} de alta biodisponibilidad dérmica.`,
    volume,
    texture,
    routineStep,
    timeOfDay,
    skinTypes,
    concerns,
    description: `${cleanName} combina ${
      actives.join(", ") || primaryActive
    } en una matriz bio-compatible libre de fragancias sintéticas. Actúa directamente sobre la arquitectura epidérmica para restaurar el equilibrio cutáneo sin comprometer el manto ácido.`,
    howToUse:
      timeOfDay === "Solo Noche"
        ? "Aplicar de 3 a 4 gotas exclusivamente en la rutina nocturna sobre piel limpia y seca. Acompañar con protector solar SPF 50+ a la mañana siguiente."
        : category === "Protección Solar"
        ? "Aplicar generosamente dos líneas sobre rostro y cuello 15 minutos antes de la exposición solar. Reaplicar cada 3 horas."
        : "Aplicar mañana y noche sobre rostro y cuello limpios realizando suaves presiones ascendentes hasta su completa absorción.",
    benefitsText: [
      `Concentración optimizada de ${primaryActive} con tolerancia clínica comprobada`,
      "Fórmula pH 5.5 respetuosa con el microbioma cutáneo",
      "Resultados visibles en luminosidad, confort y textura en 14 días",
    ].join("\n"),
    aiClinicalNote: `Recomendación Dra. Aura IA: Ideal para potenciar rutinas enfocadas en ${concerns.join(
      " y "
    )} gracias a la pureza de ${primaryActive}.`,
  };
}

export interface ChatAdvisorResponse {
  reply: string;
  recommendedProducts: ProductItem[];
  source: "gemini" | "clinical-engine";
}

export function answerClinicalChatLocal(
  message: string,
  catalog: ProductItem[],
  cartProducts: ProductItem[]
): ChatAdvisorResponse {
  const q = message.toLowerCase();
  const visible = catalog.filter(
    (p) => p.isVisible !== false && p.aiRecommended !== false
  );

  // 1. Si pregunta por su bolsa / carrito actual
  if (/(bolsa|carrito|llevo|mezcl.*bolsa|analiza mi)/.test(q)) {
    if (cartProducts.length === 0) {
      const starters = visible.slice(0, 2);
      return {
        reply:
          "Tu bolsa está vacía en este momento. Para iniciar una rutina equilibrada te sugiero comenzar con un limpiador pH 5.5 y un serum hidratante o seborregulador según tu tipo de piel:",
        recommendedProducts: starters,
        source: "clinical-engine",
      };
    }

    const report = analyzeCartSynergy(cartProducts, visible);
    const mainAlert = report.alerts[0];
    const recs = report.missingSuggestion
      ? [report.missingSuggestion.product]
      : [];

    return {
      reply: `Analicé las ${cartProducts.length} fórmulas en tu bolsa: obtienen un **${report.score}% de Sinergia Bioquímica**. ${mainAlert.title}: ${mainAlert.detail}${
        report.missingSuggestion
          ? ` Para completar tu régimen te falta **${report.missingSuggestion.stepLabel}**:`
          : ""
      }`,
      recommendedProducts: recs,
      source: "clinical-engine",
    };
  }

  // 2. Si pregunta por mezclar Retinol con Ácidos o Vitamina C
  if (/retinol/.test(q) && /(salic|bha|aha|vitamina c|mezcl|junto)/.test(q)) {
    const barrier = visible.filter((p) =>
      hasKeyword(p, ["ceramida", "hialurónico", "spf"])
    );
    return {
      reply:
        "Regla de oro dermatológica: **No apliques Retinol y Ácido Salicílico (BHA) o Vitamina C pura en la misma sesión**, ya que operan a distintos niveles de pH y sobre-estimulan la renovación celular. Usa Vitamina C + SPF por la mañana, y alterna noches entre Retinol y BHA acompañados de Ceramidas:",
      recommendedProducts: barrier.slice(0, 2),
      source: "clinical-engine",
    };
  }

  // 3. Búsqueda por síntoma o necesidad en el catálogo vivo
  const matches = matchProductsBySymptom(message, visible);
  if (matches.length > 0) {
    const top = matches.slice(0, 2);
    return {
      reply: `Según lo que me describes, tu piel se beneficiará de activos dirigidos sin agentes oclusivos. He seleccionado del laboratorio las ${top.length} fórmulas con mayor afinidad bioquímica para ti (${top[0].aiReason.toLowerCase()}):`,
      recommendedProducts: top.map((m) => m.product),
      source: "clinical-engine",
    };
  }

  // 4. Respuesta general orientativa
  const defaults = visible.slice(0, 2);
  return {
    reply:
      "Soy **Dra. Aura IA**, tu asesora dermo-cosmética. Puedo analizar tu tipo de piel (seca, grasa, mixta o sensible), revisar si los productos de tu bolsa son compatibles entre sí, o recomendarte activos para acné, manchas, poros, rojeces o antiedad. Aquí tienes dos de nuestras fórmulas comodín de máxima tolerancia:",
    recommendedProducts: defaults,
    source: "clinical-engine",
  };
}

