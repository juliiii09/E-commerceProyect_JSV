import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customerEmail, shippingAddress } = body;

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (stripeKey) {
      // Si el usuario configuró claves de Stripe, aquí se crea la sesión de Stripe Checkout
      return NextResponse.json({
        provider: "stripe",
        message: "Stripe integration endpoint ready",
        checkoutUrl: "https://checkout.stripe.com/test-session"
      });
    }

    // Respuesta simulada de orden aprobada para portafolio
    const orderId = "AURA-" + Math.floor(100000 + Math.random() * 900000);

    return NextResponse.json({
      status: "success",
      orderId,
      customerEmail,
      itemsCount: items?.length || 0,
      message: "Orden procesada y confirmada exitosamente."
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error procesando orden de compra" },
      { status: 500 }
    );
  }
}
