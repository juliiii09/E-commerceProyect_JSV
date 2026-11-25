export const ADMIN_COOKIE_NAME = "meve_admin_session";

export interface AdminUserProfile {
  email: string;
  name: string;
  role: "Admin Master" | "Gestor Comercial";
}

export interface AdminSessionPayload extends AdminUserProfile {
  iat: number;
  exp: number;
}

export interface LoginValidationResult {
  valid: boolean;
  normalizedEmail: string;
  errors: {
    email?: string;
    password?: string;
  };
}

const DEFAULT_SECRET =
  "meve-skin-laboratory-clinical-hmac-secret-key-2026-secure";

function getSecretKeyMaterial(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET || DEFAULT_SECRET;
  return new TextEncoder().encode(secret);
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array | null {
  try {
    const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

export function timingSafeEqualStr(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  const maxLen = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < maxLen; i++) {
    const av = i < aBytes.length ? aBytes[i] : 0;
    const bv = i < bBytes.length ? bBytes[i] : 0;
    diff |= av ^ bv;
  }
  return diff === 0;
}

export function validateLoginInput(
  rawEmail: unknown,
  rawPassword: unknown
): LoginValidationResult {
  const errors: { email?: string; password?: string } = {};
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  const password = typeof rawPassword === "string" ? rawPassword : "";

  if (!email) {
    errors.email = "Ingresa tu correo electrónico corporativo.";
  } else if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = "El formato del correo electrónico no es válido.";
  }

  if (!password) {
    errors.password = "Ingresa tu contraseña de seguridad.";
  } else if (password.length < 8) {
    errors.password = "La contraseña debe tener al menos 8 caracteres.";
  } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = "La contraseña debe incluir letras y al menos un número.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    normalizedEmail: email,
    errors,
  };
}

export function authenticateAdminCredentials(
  email: string,
  password: string
): AdminUserProfile | null {
  const primaryEmail = (process.env.ADMIN_EMAIL || "admin@meve.com")
    .trim()
    .toLowerCase();
  const primaryPassword = process.env.ADMIN_PASSWORD || "MeveAdmin2026!";

  const accounts: Array<AdminUserProfile & { password: string }> = [
    {
      email: primaryEmail,
      password: primaryPassword,
      name: "Admin Master",
      role: "Admin Master",
    },
    {
      email: "operaciones@meve.com",
      password: "Operaciones2026!",
      name: "Coordinación Logística",
      role: "Gestor Comercial",
    },
  ];

  let matchedUser: AdminUserProfile | null = null;

  for (const acc of accounts) {
    const emailOk = timingSafeEqualStr(email, acc.email);
    const passOk = timingSafeEqualStr(password, acc.password);
    if (emailOk && passOk) {
      matchedUser = {
        email: acc.email,
        name: acc.name,
        role: acc.role,
      };
    }
  }

  return matchedUser;
}

async function getHmacKey(): Promise<CryptoKey> {
  const keyData = getSecretKeyMaterial();
  return crypto.subtle.importKey(
    "raw",
    keyData.buffer.slice(
      keyData.byteOffset,
      keyData.byteOffset + keyData.byteLength
    ) as ArrayBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signAdminSession(
  user: AdminUserProfile,
  durationMs: number = 1000 * 60 * 60 * 8
): Promise<string> {
  const now = Date.now();
  const payload: AdminSessionPayload = {
    ...user,
    iat: now,
    exp: now + durationMs,
  };

  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));
  const payloadSegment = toBase64Url(payloadBytes);

  const key = await getHmacKey();
  const sigInput = new TextEncoder().encode(payloadSegment);
  const sigBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    sigInput.buffer.slice(
      sigInput.byteOffset,
      sigInput.byteOffset + sigInput.byteLength
    ) as ArrayBuffer
  );

  const sigSegment = toBase64Url(new Uint8Array(sigBuffer));
  return `${payloadSegment}.${sigSegment}`;
}

export async function verifyAdminSession(
  token: string | undefined | null
): Promise<AdminSessionPayload | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadSegment, sigSegment] = parts;
  const sigBytes = fromBase64Url(sigSegment);
  const payloadBytes = fromBase64Url(payloadSegment);
  if (!sigBytes || !payloadBytes) return null;

  try {
    const key = await getHmacKey();
    const sigInput = new TextEncoder().encode(payloadSegment);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes.buffer.slice(
        sigBytes.byteOffset,
        sigBytes.byteOffset + sigBytes.byteLength
      ) as ArrayBuffer,
      sigInput.buffer.slice(
        sigInput.byteOffset,
        sigInput.byteOffset + sigInput.byteLength
      ) as ArrayBuffer
    );

    if (!isValid) return null;

    const decoded = JSON.parse(
      new TextDecoder().decode(payloadBytes)
    ) as AdminSessionPayload;

    if (!decoded || typeof decoded.exp !== "number" || decoded.exp <= Date.now()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

