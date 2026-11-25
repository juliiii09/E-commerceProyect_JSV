"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  LogOut,
  Plus,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import type { AdminUserProfile } from "@/lib/admin-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUserProfile>({
    email: "admin@meve.com",
    name: "Admin Master",
    role: "Admin Master",
  });
  const [loggingOut, setLoggingOut] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;

    let cancelled = false;
    fetch("/api/admin/auth/me")
      .then(async (res) => {
        if (!res.ok) {
          if (!cancelled) {
            router.replace(`/admin/login?from=${encodeURIComponent(pathname || "/admin")}`);
          }
          return;
        }
        const data = await res.json();
        if (!cancelled && data?.user) {
          setAdminUser(data.user);
        }
      })
      .catch(() => {
        // El proxy protege la navegación principal
      });

    return () => {
      cancelled = true;
    };
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  const navigation = [
    { name: "Dashboard General", href: "/admin", icon: LayoutDashboard },
    { name: "Catálogo & Productos", href: "/admin/products", icon: Package },
    { name: "Órdenes & Ventas", href: "/admin/orders", icon: ShoppingBag },
  ];

  const initials = adminUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex">
      {/* Sidebar Lateral Desktop */}
      <aside className="w-64 bg-[#141714] text-stone-300 flex-col justify-between shrink-0 border-r border-stone-800 hidden md:flex sticky top-0 h-screen">
        <div>
          {/* Logo Admin MEVE */}
          <div className="p-6 border-b border-stone-800/80">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-light tracking-[0.25em] text-white">
                MEVE
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Admin
              </span>
            </Link>
            <p className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest">
              Panel de Control v1.0
            </p>
          </div>

          {/* Menú de Navegación */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] uppercase tracking-widest text-stone-500 font-semibold">
              Gestión Comercial
            </div>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500 text-stone-950 font-bold shadow-md"
                      : "text-stone-400 hover:text-white hover:bg-stone-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar: Link a Tienda Pública, Usuario y Cerrar Sesión */}
        <div className="p-4 border-t border-stone-800/80 space-y-3">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-stone-900/90 text-stone-300 hover:text-white hover:bg-stone-800 text-xs transition-colors border border-stone-800"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Ver Tienda Pública</span>
            </div>
            <span className="text-stone-500">↗</span>
          </Link>

          <div className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl bg-stone-900/50 border border-stone-800/70">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-200 font-bold text-xs flex items-center justify-center shrink-0">
                {initials}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">
                  {adminUser.name}
                </div>
                <div className="text-[10px] text-stone-500 truncate">
                  {adminUser.email}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Cerrar sesión segura"
              className="p-2 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors shrink-0 disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Drawer Móvil */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
          />
          <div className="relative w-72 max-w-[85vw] bg-[#141714] text-stone-300 flex flex-col justify-between p-5 z-10 border-r border-stone-800">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl font-light tracking-[0.25em] text-white">
                    MEVE
                  </span>
                  <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-5 space-y-1.5">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium ${
                        isActive
                          ? "bg-emerald-500 text-stone-950 font-bold"
                          : "text-stone-400 hover:text-white hover:bg-stone-800/60"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-3 pt-4 border-t border-stone-800">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-stone-900 text-stone-300 text-xs border border-stone-800"
              >
                <span>Ver Tienda Pública</span>
                <span>↗</span>
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-950/50 text-rose-300 border border-rose-800/50 text-xs font-medium hover:bg-rose-900/50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{loggingOut ? "Cerrando sesión..." : "Cerrar Sesión"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Área de Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Barra Superior Admin */}
        <header className="h-16 bg-white border-b border-stone-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100"
              aria-label="Abrir menú admin"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="md:hidden">
              <Link href="/admin" className="font-serif text-xl font-bold tracking-widest">
                MEVE
              </Link>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Sesión verificada:</span>
              <span className="text-stone-900 font-semibold">{adminUser.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-900 text-white text-xs font-medium hover:bg-emerald-950 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Gestionar Fórmulas</span>
              <span className="xs:hidden">Fórmulas</span>
            </Link>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 text-stone-600 hover:text-rose-700 hover:border-rose-200 hover:bg-rose-50 text-xs font-medium transition-colors disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        {/* Contenido de la página de Admin */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
