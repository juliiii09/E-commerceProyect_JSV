"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ShoppingBag, Search, Menu, X, Heart, ShieldAlert } from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import { useHasMounted } from "@/hooks/use-has-mounted";

export const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mounted = useHasMounted();
  const { getTotalItems, openCart } = useCartStore();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const totalItems = mounted ? getTotalItems() : 0;

  return (
    <>
      {/* Barra superior de anuncios */}
      <div className="bg-[#2f3e33] text-[#f4f1ea] text-[11px] py-2 px-4 text-center tracking-[0.18em] uppercase font-normal flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-[#c8d6ca]" />
        <span>Meve Skin Lab · Envío sin costo en órdenes &gt; $50 · Diagnóstico dermatológico con IA</span>
      </div>

      {/* Header principal */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-md border-b border-stone-200/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Navegación desktop (izquierda) */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wider uppercase text-stone-700 font-medium">
            <Link href="/catalog" className="hover:text-stone-950 transition-colors">
              Catálogo
            </Link>
            <Link href="/catalog?category=serums" className="hover:text-stone-950 transition-colors">
              Serums & Activos
            </Link>
            <Link href="/catalog?category=hidratantes" className="hover:text-stone-950 transition-colors">
              Hidratantes
            </Link>
            <Link 
              href="/ai-consultant" 
              className="inline-flex items-center gap-1.5 text-[#2f3e33] font-medium hover:text-stone-950 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-[#3d5245]" />
              <span>Asesor IA</span>
            </Link>
          </nav>

          {/* Logotipo Central: MEVE */}
          <div className="flex flex-col items-center">
            <Link href="/" className="group flex flex-col items-center text-center">
              <span className="font-serif text-2xl sm:text-3xl font-light tracking-[0.25em] text-stone-900 group-hover:opacity-80 transition-opacity">
                MEVE
              </span>
              <span className="text-[9px] tracking-[0.35em] text-stone-500 font-medium -mt-1 uppercase">
                Skin Laboratory
              </span>
            </Link>
          </div>

          {/* Acciones derecha */}
          <div className="flex items-center gap-3 sm:gap-5">
            
            {/* Acceso directo a Admin Dashboard */}
            <Link
              href="/admin"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200/70 text-stone-800 hover:bg-stone-300 text-[11px] font-medium transition-colors"
              title="Panel de Administración y Control del Catálogo"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-800" />
              <span>Admin Panel</span>
            </Link>

            <button 
              aria-label="Buscar"
              className="text-stone-700 hover:text-stone-950 transition-colors p-1.5 rounded-full hover:bg-stone-200/50"
            >
              <Search className="w-4 h-4" />
            </button>

            <button 
              aria-label="Favoritos"
              className="hidden sm:flex text-stone-700 hover:text-stone-950 transition-colors p-1.5 rounded-full hover:bg-stone-200/50"
            >
              <Heart className="w-4 h-4" />
            </button>

            {/* Carrito de compras interactivo */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-[#2f3e33] text-[#faf8f5] px-4 py-2 rounded-full text-xs font-medium hover:bg-stone-900 transition-all shadow-sm group"
              aria-label="Abrir bolsa de compras"
            >
              <ShoppingBag className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Bolsa</span>
              <span className="bg-[#faf8f5] text-[#2f3e33] text-[10px] font-semibold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                {totalItems}
              </span>
            </button>

            {/* Botón hamburguesa móvil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-stone-800 p-1"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 border-b border-stone-200 px-6 py-6 space-y-4 shadow-xl">
            <Link 
              href="/catalog" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-wider text-stone-800 font-medium"
            >
              Catálogo Completo
            </Link>
            <Link 
              href="/catalog?category=serums" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-wider text-stone-800"
            >
              Serums & Activos
            </Link>
            <Link 
              href="/catalog?category=hidratantes" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-wider text-stone-800"
            >
              Cremas & Hidratantes
            </Link>
            <Link 
              href="/ai-consultant" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm uppercase tracking-wider text-emerald-800 font-semibold"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Diagnóstico con IA
            </Link>
            <div className="pt-3 border-t border-stone-100">
              <Link 
                href="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-600 font-medium bg-stone-100 p-2.5 rounded-xl"
              >
                <ShieldAlert className="w-4 h-4 text-emerald-700" />
                Panel Administrador (Dashboard)
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
