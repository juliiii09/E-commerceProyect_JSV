"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ShieldCheck, Leaf, HeartHandshake, ArrowRight, ShieldAlert } from "lucide-react";

export const Footer = () => {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#171916] text-stone-300 pt-20 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Pilares Éticos de la Marca */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-16 border-b border-stone-800 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-2.5 rounded-full bg-stone-800/80 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">Testado Clínicamente</h4>
              <p className="text-xs text-stone-400">Formulaciones dermo-compatibles</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-2.5 rounded-full bg-stone-800/80 text-emerald-400">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">100% Clean Beauty</h4>
              <p className="text-xs text-stone-400">Sin parabenos ni sulfatos agresivos</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-2.5 rounded-full bg-stone-800/80 text-emerald-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">Cruelty-Free</h4>
              <p className="text-xs text-stone-400">Jamás testado en animales</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-2.5 rounded-full bg-stone-800/80 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">Rutinas con IA</h4>
              <p className="text-xs text-stone-400">Diagnóstico cutáneo personalizado</p>
            </div>
          </div>
        </div>

        {/* Sección principal del Footer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-16">
          
          {/* Columna Marca MEVE */}
          <div className="md:col-span-4 space-y-4">
            <div className="font-serif text-2xl tracking-[0.2em] text-white font-light">
              MEVE
            </div>
            <p className="text-xs tracking-widest text-emerald-400 uppercase font-medium">
              Meve-commerce • Clinical Botanicals & Skin AI
            </p>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Combinamos biotecnología botánica pura con la precisión de la inteligencia artificial para crear regímenes de cuidado de la piel que realmente transforman tu barrera cutánea.
            </p>
          </div>

          {/* Enlaces de Tienda */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs tracking-widest uppercase font-semibold text-stone-100">
              Colección
            </h5>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link href="/catalog" className="hover:text-white transition-colors">Todos los Productos</Link></li>
              <li><Link href="/catalog?category=serums" className="hover:text-white transition-colors">Serums Activos</Link></li>
              <li><Link href="/catalog?category=hidratantes" className="hover:text-white transition-colors">Cremas & Barrera</Link></li>
              <li><Link href="/catalog?category=proteccion-solar" className="hover:text-white transition-colors">Protección Solar</Link></li>
              <li><Link href="/catalog?category=limpiadores" className="hover:text-white transition-colors">Limpiadores Suaves</Link></li>
            </ul>
          </div>

          {/* Experiencia IA & Administración */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs tracking-widest uppercase font-semibold text-stone-100">
              Plataforma & Gestión
            </h5>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link href="/ai-consultant" className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Test Dermatológico IA
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-amber-300 hover:text-amber-200 font-medium inline-flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Panel Administrador (Dashboard)
                </Link>
              </li>
              <li><span className="hover:text-white cursor-pointer">Guía de Ingredientes Activos</span></li>
              <li><span className="hover:text-white cursor-pointer">Compatibilidad de Fórmulas</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="text-xs tracking-widest uppercase font-semibold text-stone-100">
              Club Meve Skincare
            </h5>
            <p className="text-sm text-stone-400">
              Recibe 15% de descuento en tu primer pedido usando el cupón <strong className="text-emerald-400">AURA15</strong>.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="flex items-center rounded-full bg-stone-800/80 p-1 border border-stone-700 focus-within:border-emerald-500">
                <input
                  type="email"
                  placeholder="Tu correo electrónico..."
                  className="w-full bg-transparent px-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-stone-100 text-stone-900 hover:bg-emerald-400 hover:text-stone-950 p-2 rounded-full transition-colors"
                  aria-label="Suscribirse"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="pt-8 mt-4 border-t border-stone-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Meve-commerce Inc. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <span className="hover:text-stone-300 cursor-pointer">Política de Privacidad</span>
            <span className="hover:text-stone-300 cursor-pointer">Términos de Servicio</span>
            <Link href="/admin" className="text-stone-400 hover:text-white underline">
              Dashboard Admin
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
