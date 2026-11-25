import { NextResponse } from "next/server";
import { PRODUCTS_CATALOG, ProductItem } from "@/data/mock-products";
import { answerClinicalChatLocal } from "@/lib/clinical-ai-engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const catalog: ProductItem[] = Array.isArray(body?.catalog)
      ? body.catalog
      : PRODUCTS_CATALOG;
    const cartProducts: ProductItem[] = Array.isArray(body?.cartProducts)
      ? body.cartProducts
      : [];

    if (!message) {
      return NextResponse.json(
        { error: "Escribe una consulta dermatológica." },
        { status: 400 }
      );
    }

    const localFallback = answerClinicalChatLocal(message, catalog, cartProducts);
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const visibleCatalog = catalog
          .filter((p) => p.isVisible !== false)
          .map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            actives: p.activeIngredients,
            concerns: p.concerns,
            skinTypes: p.skinTypes,
            price: p.price,
          }));

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Eres Dra. Aura IA, dermatóloga clínica especialista de MEVE Skin Laboratory.
Responde en español, breve (máximo 70 palabras), cálida y científicamente precisa.
Catálogo actual: ${JSON.stringify(visibleCatalog)}.
Productos en la bolsa del usuario: ${JSON.stringify(
                        cartProducts.map((c) => c.name)
                      )}.
Consulta del usuario: "${message}"
Devuelve SOLO JSON válido con el formato:
{"reply": "tu respuesta", "productIds": ["id1", "id2"]}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const rawText: string =
            data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          const cleaned = rawText.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(cleaned);

          if (parsed?.reply) {
            const recs = Array.isArray(parsed.productIds)
              ? catalog.filter((p) => parsed.productIds.includes(p.id)).slice(0, 2)
              : localFallback.recommendedProducts;

            return NextResponse.json({
              reply: parsed.reply,
              recommendedProducts: recs,
              source: "gemini",
            });
          }
        }
      } catch {
        // Continúa con el motor clínico determinístico
      }
    }

    return NextResponse.json(localFallback);
  } catch {
    return NextResponse.json(
      { error: "No se pudo procesar la consulta dermatológica." },
      { status: 500 }
    );
  }
}

