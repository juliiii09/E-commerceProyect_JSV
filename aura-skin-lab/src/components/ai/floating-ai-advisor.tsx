"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, X, ArrowUp, Plus, Check } from "lucide-react";
import { PRODUCTS_CATALOG, ProductItem } from "@/data/mock-products";
import { useProductStore } from "@/store/use-product-store";
import { useCartStore } from "@/store/use-cart-store";
import { useHasMounted } from "@/hooks/use-has-mounted";

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  products?: ProductItem[];
}

const QUICK_PROMPTS = [
  "Revisar mi bolsa",
  "Poros y brillo",
  "¿Retinol + Salicílico?",
  "Piel sensible",
];

export function FloatingAiAdvisor() {
  const pathname = usePathname();
  const mounted = useHasMounted();
  const { products: storedProducts } = useProductStore();
  const { items: cartItems, addItem } = useCartStore();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hola, soy Aura. Puedo orientarte sobre ingredientes activos, orden de aplicación o revisar la armonía de tu bolsa.",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef<number>(1);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const catalog = mounted ? storedProducts : PRODUCTS_CATALOG;
  const cartProducts = mounted ? cartItems.map((i) => i.product) : [];

  const sendQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isTyping) return;

    msgIdRef.current += 1;
    const userMsg: ChatMessage = {
      id: `u-${msgIdRef.current}`,
      sender: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          catalog,
          cartProducts,
        }),
      });
      const data = await res.json();

      msgIdRef.current += 1;
      const aiId = `ai-${msgIdRef.current}`;
      setMessages((prev) => [
        ...prev,
        {
          id: aiId,
          sender: "ai",
          text:
            data?.reply ||
            "He revisado nuestras formulaciones para orientarte.",
          products: Array.isArray(data?.recommendedProducts)
            ? data.recommendedProducts
            : [],
        },
      ]);
    } catch {
      msgIdRef.current += 1;
      const errId = `err-${msgIdRef.current}`;
      setMessages((prev) => [
        ...prev,
        {
          id: errId,
          sender: "ai",
          text: "No pude procesar la consulta en este momento. Intenta nuevamente.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAdd = (product: ProductItem) => {
    addItem(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Ventana Minimalista Editorial */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-3rem)] sm:w-[360px] bg-[#faf8f5] rounded-2xl border border-stone-200/90 shadow-[0_20px_50px_rgba(28,25,23,0.12)] overflow-hidden flex flex-col max-h-[74vh]">
          {/* Header Limpio */}
          <div className="px-5 py-4 bg-white border-b border-stone-200/70 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3d5245]" />
                <span className="font-serif text-lg text-stone-900 tracking-wide">
                  Aura — Consulta Dermo
                </span>
              </div>
              <p className="text-[10px] text-stone-400 uppercase tracking-[0.18em] mt-0.5">
                Asistencia Clínica Personalizada
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              aria-label="Cerrar consulta"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Historial de Mensajes */}
          <div
            ref={scrollRef}
            className="p-5 space-y-4 overflow-y-auto flex-1 max-h-[340px]"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[86%] px-4 py-2.5 rounded-2xl text-xs font-light leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#2f3e33] text-[#faf8f5] rounded-br-sm"
                      : "bg-white border border-stone-200/70 text-stone-700 rounded-bl-sm"
                  }`}
                >
                  {msg.text.replace(/\*\*/g, "")}
                </div>

                {/* Fórmulas Sugeridas Minimalistas */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2.5 w-full space-y-1.5">
                    {msg.products.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-2.5 rounded-xl bg-white border border-stone-200/70 flex items-center justify-between gap-3 hover:border-stone-300 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                            <Image
                              src={prod.image}
                              alt={prod.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/product/${prod.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="font-serif text-sm text-stone-900 hover:text-[#2f3e33] truncate block"
                            >
                              {prod.name}
                            </Link>
                            <div className="text-[10px] text-stone-400">
                              ${prod.price.toFixed(2)} · {prod.category}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleQuickAdd(prod)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors border ${
                            addedId === prod.id
                              ? "bg-[#2f3e33] text-white border-[#2f3e33]"
                              : "bg-[#faf8f5] text-stone-700 border-stone-200 hover:border-stone-800 hover:text-stone-900"
                          }`}
                          aria-label="Añadir a la bolsa"
                        >
                          {addedId === prod.id ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="text-[11px] text-stone-400 font-light italic px-1">
                Analizando formulación...
              </div>
            )}
          </div>

          {/* Sugerencias Discretas */}
          <div className="px-4 py-2.5 border-t border-stone-200/60 bg-[#f5f2ec] flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendQuery(prompt)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white/80 border border-stone-200/80 text-[10px] text-stone-600 hover:text-stone-900 hover:border-stone-400 transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Campo de Texto */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendQuery(input);
            }}
            className="p-3 bg-white border-t border-stone-200/70 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Consulta un ingrediente o síntoma..."
              className="flex-1 px-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-8 h-8 rounded-full bg-[#2f3e33] text-white flex items-center justify-center hover:bg-stone-900 transition-colors disabled:opacity-30"
              aria-label="Enviar"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Botón Flotante Discreto y Armonioso */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md text-stone-800 border border-stone-300/80 shadow-md hover:shadow-lg hover:border-[#2f3e33] transition-all"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#3d5245]" />
        <span className="text-xs font-medium tracking-wide">Consulta IA</span>
        {cartProducts.length > 0 && !isOpen && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#3d5245]" />
        )}
      </button>
    </div>
  );
}
