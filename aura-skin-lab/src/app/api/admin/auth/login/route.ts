import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  authenticateAdminCredentials,
  signAdminSession,
  validateLoginInput,
} from "@/lib/admin-auth";

interface AttemptRecord {
  count: number;
  firstAttemptAt: number;
  lockedUntil: number;
}

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 5 * 60 * 1000; // 5 minutos
const LOCKOUT_MS = 60 * 1000; // 60 segundos de bloqueo temporal

const loginAttempts = new Map<string, AttemptRecord>();

function getClientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "local-client";
}

export async function POST(req: Request) {
  try {
    const clientKey = getClientKey(req);
    const now = Date.now();
    const record = loginAttempts.get(clientKey);

    if (record && record.lockedUntil > now) {
      const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return NextResponse.json(
        {
          error: `Demasiados intentos fallidos. Por seguridad, espera ${retryAfterSeconds}s antes de volver a intentar.`,
          code: "RATE_LIMITED",
          retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password, rememberMe } = body ?? {};

    const validation = validateLoginInput(email, password);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: "Revisa los campos marcados antes de continuar.",
          code: "VALIDATION_ERROR",
          fieldErrors: validation.errors,
        },
        { status: 400 }
      );
    }

    const user = authenticateAdminCredentials(
      validation.normalizedEmail,
      String(password)
    );

    if (!user) {
      const activeWindow =
        record && now - record.firstAttemptAt < WINDOW_MS
          ? record
          : { count: 0, firstAttemptAt: now, lockedUntil: 0 };

      const nextCount = activeWindow.count + 1;
      const isLocked = nextCount >= MAX_ATTEMPTS;

      loginAttempts.set(clientKey, {
        count: isLocked ? 0 : nextCount,
        firstAttemptAt: activeWindow.firstAttemptAt,
        lockedUntil: isLocked ? now + LOCKOUT_MS : 0,
      });

      if (isLocked) {
        return NextResponse.json(
          {
            error:
              "Se alcanzó el límite de 5 intentos fallidos. Acceso bloqueado temporalmente por 60 segundos.",
            code: "RATE_LIMITED",
            retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000),
          },
          { status: 429 }
        );
      }

      const remainingAttempts = MAX_ATTEMPTS - nextCount;
      return NextResponse.json(
        {
          error: `Credenciales inválidas. Verifica tu correo y contraseña (${remainingAttempts} ${
            remainingAttempts === 1 ? "intento restante" : "intentos restantes"
          }).`,
          code: "INVALID_CREDENTIALS",
          remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Limpiar historial de fallos tras autenticación exitosa
    loginAttempts.delete(clientKey);

    const durationMs = rememberMe
      ? 1000 * 60 * 60 * 24 * 7 // 7 días
      : 1000 * 60 * 60 * 8; // 8 horas

    const token = await signAdminSession(user, durationMs);

    const response = NextResponse.json({
      authenticated: true,
      user,
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.floor(durationMs / 1000),
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Error interno verificando las credenciales de acceso." },
      { status: 500 }
    );
  }
}

