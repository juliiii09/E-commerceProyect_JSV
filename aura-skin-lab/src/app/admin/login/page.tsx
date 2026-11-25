"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
  Sparkles,
  Clock,
} from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverFieldErrors, setServerFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Temporizador regresivo cuando se activa bloqueo anti fuerza bruta
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // Validaciones reactivas en cliente
  const passwordChecks = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasLetter: /[A-Za-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };
  }, [password]);

  const clientErrors = useMemo(() => {
    const errs: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errs.email = "El correo corporativo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
      errs.email = "Ingresa un formato de correo válido (ej. admin@meve.com).";
    }

    if (!password) {
      errs.password = "La contraseña de seguridad es obligatoria.";
    } else if (!passwordChecks.minLength) {
      errs.password = "Debe contener mínimo 8 caracteres.";
    } else if (!passwordChecks.hasLetter || !passwordChecks.hasNumber) {
      errs.password = "Debe combinar letras y al menos un número.";
    }

    return errs;
  }, [email, password, passwordChecks]);

  const emailError =
    serverFieldErrors.email || (touched.email ? clientErrors.email : undefined);
  const passwordError =
    serverFieldErrors.password ||
    (touched.password ? clientErrors.password : undefined);

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setTouched({ email: true, password: true });
    setServerError(null);
    setServerFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setServerError(null);
    setServerFieldErrors({});

    if (lockoutSeconds > 0) return;

    if (clientErrors.email || clientErrors.password) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.fieldErrors) {
          setServerFieldErrors(data.fieldErrors);
        }
        if (res.status === 429 && data?.retryAfterSeconds) {
          setLockoutSeconds(data.retryAfterSeconds);
        }
        setServerError(
          data?.error || "No fue posible validar las credenciales ingresadas."
        );
        return;
      }

      const safeTarget =
        redirectTo.startsWith("/admin") && redirectTo !== "/admin/login"
          ? redirectTo
          : "/admin";

      router.replace(safeTarget);
      router.refresh();
    } catch {
      setServerError("Error de red al conectar con el servidor de autenticación.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141714] text-stone-100 grid grid-cols-1 lg:grid-cols-12">
      {/* Columna Izquierda: Identidad Clínica & Seguridad */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 flex-col justify-between p-12 xl:p-16 border-r border-stone-800/80 bg-gradient-to-br from-[#141714] via-[#1a221b] to-[#111512]">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la tienda pública</span>
          </Link>

          <div className="mt-16 space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] uppercase tracking-widest font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Acceso Restringido • Consola Ejecutiva</span>
            </div>

            <h1 className="font-serif text-4xl xl:text-5xl font-light tracking-wide text-white leading-tight">
              MEVE Skin Laboratory <br />
              <span className="text-emerald-400 italic">Admin Suite</span>
            </h1>

            <p className="text-sm text-stone-400 leading-relaxed font-light">
              Gestiona en tiempo real el catálogo de formulaciones dermatológicas,
              control de stock, órdenes de compra y métricas financieras bajo
              sesiones firmadas con HMAC-SHA256.
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-lg">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800">
              <div className="text-emerald-400 text-xs font-semibold">
                Sesión HttpOnly
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Token criptográfico verificado en cada ruta mediante Proxy de Next.js.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800">
              <div className="text-emerald-400 text-xs font-semibold">
                Protección Anti-Bruteforce
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Bloqueo automático tras 5 intentos fallidos consecutivos.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-stone-500">
            © {new Date().getFullYear()} Meve-commerce • Plataforma Administrativa v1.0
          </p>
        </div>
      </div>

      {/* Columna Derecha: Formulario de Autenticación */}
      <div className="lg:col-span-7 xl:col-span-6 flex items-center justify-center p-6 sm:p-12 bg-[#faf8f5] text-stone-900">
        <div className="w-full max-w-md space-y-6">
          {/* Header móvil */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-stone-200">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Tienda</span>
            </Link>
            <span className="font-serif text-xl tracking-[0.25em] font-semibold">
              MEVE ADMIN
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-widest font-bold text-emerald-800">
              Autenticación de Credenciales
            </span>
            <h2 className="font-serif text-3xl text-stone-900 font-light mt-1">
              Iniciar Sesión en el Panel
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Ingresa tus credenciales autorizadas para acceder a la gestión comercial.
            </p>
          </div>

          {/* Alerta de error del servidor o bloqueo */}
          {serverError && (
            <div
              role="alert"
              className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
                lockoutSeconds > 0
                  ? "bg-amber-50 border-amber-300 text-amber-900"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              {lockoutSeconds > 0 ? (
                <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-semibold">
                  {lockoutSeconds > 0
                    ? `Acceso bloqueado temporalmente (${lockoutSeconds}s)`
                    : "Error de autenticación"}
                </p>
                <p>{serverError}</p>
              </div>
            </div>
          )}

          {/* Formulario con validaciones */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-sm space-y-5"
          >
            {/* Campo Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-stone-800"
              >
                Correo Electrónico Corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@meve.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (serverFieldErrors.email) {
                      setServerFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                  className={`w-full pl-10 pr-9 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 ${
                    emailError
                      ? "border-rose-400 bg-rose-50/40 focus:ring-rose-500/20"
                      : touched.email && !clientErrors.email
                      ? "border-emerald-500 bg-emerald-50/20 focus:ring-emerald-600/20"
                      : "border-stone-200 bg-stone-50/50 focus:bg-white focus:ring-emerald-700/20"
                  }`}
                />
                {touched.email && !emailError && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
              {emailError && (
                <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{emailError}</span>
                </p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-stone-800"
              >
                Contraseña de Seguridad
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (serverFieldErrors.password) {
                      setServerFieldErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }
                  }}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, password: true }))
                  }
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 ${
                    passwordError
                      ? "border-rose-400 bg-rose-50/40 focus:ring-rose-500/20"
                      : touched.password && !clientErrors.password
                      ? "border-emerald-500 bg-emerald-50/20 focus:ring-emerald-600/20"
                      : "border-stone-200 bg-stone-50/50 focus:bg-white focus:ring-emerald-700/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-stone-400 hover:text-stone-700 absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {passwordError && (
                <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{passwordError}</span>
                </p>
              )}

              {/* Indicadores de políticas de contraseña */}
              <div className="pt-1 flex flex-wrap gap-1.5">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                    passwordChecks.minLength
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-stone-100 border-stone-200 text-stone-500"
                  }`}
                >
                  8+ caracteres
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                    passwordChecks.hasLetter
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-stone-100 border-stone-200 text-stone-500"
                  }`}
                >
                  Letras (A-Z)
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                    passwordChecks.hasNumber
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-stone-100 border-stone-200 text-stone-500"
                  }`}
                >
                  Al menos 1 número
                </span>
              </div>
            </div>

            {/* Recordar sesión */}
            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-stone-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 text-emerald-700 focus:ring-emerald-600"
                />
                <span>Mantener sesión activa por 7 días</span>
              </label>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isSubmitting || lockoutSeconds > 0}
              className="w-full py-3.5 rounded-full bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-950 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Verificando Credenciales...</span>
                </>
              ) : lockoutSeconds > 0 ? (
                <span>Reintentar en {lockoutSeconds}s</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  <span>Ingresar al Panel Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Tarjeta de Credenciales Demo para Pruebas */}
          <div className="p-5 rounded-3xl bg-emerald-950/5 border border-emerald-900/15 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-950">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Credenciales Autorizadas (Entorno Demo)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
              <button
                type="button"
                onClick={() => fillDemoAccount("admin@meve.com", "MeveAdmin2026!")}
                className="text-left p-3 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-xs transition-all group"
              >
                <div className="font-bold text-stone-900 group-hover:text-emerald-800 flex items-center justify-between">
                  <span>Admin Master</span>
                  <span className="text-[10px] text-emerald-700">Usar →</span>
                </div>
                <div className="font-mono text-stone-600 mt-1 truncate">
                  admin@meve.com
                </div>
                <div className="font-mono text-stone-400">MeveAdmin2026!</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  fillDemoAccount("operaciones@meve.com", "Operaciones2026!")
                }
                className="text-left p-3 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-xs transition-all group"
              >
                <div className="font-bold text-stone-900 group-hover:text-emerald-800 flex items-center justify-between">
                  <span>Gestor Comercial</span>
                  <span className="text-[10px] text-emerald-700">Usar →</span>
                </div>
                <div className="font-mono text-stone-600 mt-1 truncate">
                  operaciones@meve.com
                </div>
                <div className="font-mono text-stone-400">Operaciones2026!</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#141714] flex items-center justify-center text-stone-300 text-xs">
          Cargando módulo de seguridad...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}

