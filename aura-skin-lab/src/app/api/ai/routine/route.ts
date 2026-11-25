import { NextResponse } from "next/server";
import { PRODUCTS_CATALOG } from "@/data/mock-products";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { skinType, mainConcern, sensitivity } = body;

    // Si hay una GEMINI_API_KEY configurada, se puede consultar al modelo
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Actúa como dermatóloga jefe de la marca de cosmética clínica Aura Skin Lab.
Catálogo disponible: ${JSON.stringify(
                        PRODUCTS_CATALOG.map((p) => ({
                          id: p.id,
                          name: p.name,
                          actives: p.activeIngredients,
                          category: p.category,
                        }))
                      )}.
Perfil del paciente: Biotipo ${skinType}, Preocupación principal ${mainConcern}, Nivel de reactividad ${sensitivity}.
Genera un diagnóstico en JSON con:
{
  "summary": "resumen clínico",
  "recommendedProductIds": ["id1", "id2", "id3"],
  "tip": "consejo clave del especialista"
}`
                    }
                  ]
                }
              ]
            })
          }
        );

        if (response.ok) {
          const geminiData = await response.json();
          const textResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          return NextResponse.json({
            source: "gemini-api",
            data: textResponse
          });
        }
      } catch (geminiError) {
        console.warn("Fallo al contactar Gemini API, usando motor clínico local:", geminiError);
      }
    }

    // Motor de recomendación clínico nativo (Respaldo inteligente garantizado)
    const cleanser = PRODUCTS_CATALOG.find((p) => p.id === "prod-5")!;
    const sunscreen = PRODUCTS_CATALOG.find((p) => p.id === "prod-4")!;
    let serum = PRODUCTS_CATALOG.find((p) => p.id === "prod-2")!;
    let cream = PRODUCTS_CATALOG.find((p) => p.id === "prod-1")!;

    if (mainConcern === "antiedad") {
      serum = PRODUCTS_CATALOG.find((p) => p.id === "prod-6") || serum;
    } else if (mainConcern === "deshidratación") {
      serum = PRODUCTS_CATALOG.find((p) => p.id === "prod-3") || serum;
    }

    return NextResponse.json({
      source: "aura-clinical-engine",
      diagnosis: {
        summary: `Biotipo ${skinType} con necesidad prioritaria en ${mainConcern}.`,
        morningRoutine: [cleanser.name, serum.name, sunscreen.name],
        nightRoutine: [cleanser.name, serum.name, cream.name],
        clinicalTip: "Recuerda aplicar los activos higroscópicos sobre piel húmeda."
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error procesando diagnóstico de piel con IA" },
      { status: 500 }
    );
  }
}
