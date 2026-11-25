"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  RotateCcw,
  X,
  Check,
  AlertCircle,
  ExternalLink,
  Package,
  Eye,
  EyeOff,
  Star,
  Sparkles,
  LayoutGrid,
  Monitor,
  ImagePlus,
} from "lucide-react";
import { useProductStore } from "@/store/use-product-store";
import { PRODUCTS_CATALOG, ProductItem } from "@/data/mock-products";
import { generateClinicalDraftFromPrompt } from "@/lib/clinical-ai-engine";
import { useHasMounted } from "@/hooks/use-has-mounted";

type CategoryOption = ProductItem["category"];
type SkinTypeOption = ProductItem["skinTypes"][number];
type ConcernOption = ProductItem["concerns"][number];
type RoutineStepOption = ProductItem["routineStep"];
type TimeOfDayOption = ProductItem["timeOfDay"];

const CATEGORIES: CategoryOption[] = [
  "Limpiadores",
  "Serums",
  "Hidratantes",
  "Protección Solar",
];

const SKIN_TYPES: SkinTypeOption[] = [
  "Seca",
  "Grasa",
  "Mixta",
  "Sensible",
  "Normal",
];

const CONCERNS: ConcernOption[] = [
  "acné",
  "poros",
  "deshidratación",
  "antiedad",
  "rojeces",
  "manchas",
];

const ROUTINE_STEPS: RoutineStepOption[] = [
  "Paso 1: Limpieza",
  "Paso 2: Tratamiento & Activos",
  "Paso 3: Hidratación",
  "Paso 4: Fotoprotección",
];

const TIMES_OF_DAY: TimeOfDayOption[] = [
  "Día y Noche",
  "Solo Día",
  "Solo Noche",
];

const PRESET_IMAGES = [
  {
    label: "Frasco Crema Clínica",
    url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Gotero Serum Ámbar",
    url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Elixir Cristalino",
    url: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Tubo Fotoprotector",
    url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Textura Macro Gel",
    url: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Set Laboratorio Botánico",
    url: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
  },
];

interface ProductFormState {
  name: string;
  tagline: string;
  category: CategoryOption;
  price: string;
  stock: string;
  badge: string;
  volume: string;
  gallery: string[];
  newGalleryUrl: string;
  isVisible: boolean;
  isFeatured: boolean;
  aiRecommended: boolean;
  aiClinicalNote: string;
  skinTypes: SkinTypeOption[];
  concerns: ConcernOption[];
  activeIngredientsText: string;
  description: string;
  howToUse: string;
  texture: string;
  routineStep: RoutineStepOption;
  timeOfDay: TimeOfDayOption;
  benefitsText: string;
}

const EMPTY_FORM: ProductFormState = {
  name: "",
  tagline: "",
  category: "Serums",
  price: "36.00",
  stock: "30",
  badge: "Nueva Fórmula",
  volume: "30 ml / 1.0 fl. oz.",
  gallery: [PRESET_IMAGES[1].url, PRESET_IMAGES[4].url, PRESET_IMAGES[5].url],
  newGalleryUrl: "",
  isVisible: true,
  isFeatured: true,
  aiRecommended: true,
  aiClinicalNote: "",
  skinTypes: ["Mixta", "Sensible"],
  concerns: ["deshidratación"],
  activeIngredientsText: "Ácido Azelaico 10%, Pantenol 2%",
  description: "",
  howToUse: "Aplicar de 3 a 4 gotas sobre rostro limpio antes de hidratar.",
  texture: "Fluido sedoso ultraligero de rápida absorción",
  routineStep: "Paso 2: Tratamiento & Activos",
  timeOfDay: "Día y Noche",
  benefitsText:
    "Calma rojeces visibles\nUnifica el tono cutáneo\nRefuerza la barrera dérmica",
};

export default function AdminProductsPage() {
  const mounted = useHasMounted();
  const {
    products: storedProducts,
    addProduct,
    updateProduct,
    toggleVisibility,
    toggleFeatured,
    toggleAiRecommended,
    deleteProduct,
    resetToDefault,
  } = useProductStore();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("Todos");
  const [viewScope, setViewScope] = useState<"all" | "featured" | "hidden">(
    "all"
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"datos" | "vistas" | "ficha">(
    "datos"
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  // Modal de previsualización de vistas (Tarjeta vs Página Detalle)
  const [previewProduct, setPreviewProduct] = useState<ProductItem | null>(
    null
  );
  const [previewMode, setPreviewMode] = useState<"card" | "detail">("detail");
  const [previewActiveImg, setPreviewActiveImg] = useState<number>(0);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const products = mounted ? storedProducts : PRODUCTS_CATALOG;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const stats = useMemo(() => {
    const visibleCount = products.filter((p) => p.isVisible !== false).length;
    const featuredCount = products.filter((p) => p.isFeatured).length;
    const aiCount = products.filter((p) => p.aiRecommended !== false).length;
    return {
      total: products.length,
      visibleCount,
      hiddenCount: products.length - visibleCount,
      featuredCount,
      aiCount,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        categoryFilter === "Todos" || p.category === categoryFilter;
      const matchesScope =
        viewScope === "all"
          ? true
          : viewScope === "featured"
          ? Boolean(p.isFeatured)
          : p.isVisible === false;
      const q = search.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.activeIngredients.some((i) => i.toLowerCase().includes(q));
      return matchesCat && matchesScope && matchesSearch;
    });
  }, [products, categoryFilter, viewScope, search]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalTab("datos");
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (
    product: ProductItem,
    initialTab: "datos" | "vistas" | "ficha" = "datos"
  ) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      tagline: product.tagline,
      category: product.category,
      price: product.price.toFixed(2),
      stock: String(product.stock ?? 24),
      badge: product.badge || "",
      volume: product.volume,
      gallery:
        product.gallery && product.gallery.length > 0
          ? product.gallery
          : [product.image],
      newGalleryUrl: "",
      isVisible: product.isVisible !== false,
      isFeatured: Boolean(product.isFeatured),
      aiRecommended: product.aiRecommended !== false,
      aiClinicalNote: product.aiClinicalNote || "",
      skinTypes: product.skinTypes,
      concerns: product.concerns,
      activeIngredientsText: product.activeIngredients.join(", "),
      description: product.description,
      howToUse: product.howToUse,
      texture: product.texture,
      routineStep: product.routineStep,
      timeOfDay: product.timeOfDay,
      benefitsText: product.benefits.join("\n"),
    });
    setModalTab(initialTab);
    setFormError(null);
    setModalOpen(true);
  };

  const handleAiAutocomplete = () => {
    const draft = generateClinicalDraftFromPrompt(
      form.name,
      form.activeIngredientsText,
      form.category
    );
    setForm((prev) => ({
      ...prev,
      tagline: draft.tagline,
      volume: draft.volume,
      texture: draft.texture,
      routineStep: draft.routineStep,
      timeOfDay: draft.timeOfDay,
      skinTypes: draft.skinTypes,
      concerns: draft.concerns,
      description: draft.description,
      howToUse: draft.howToUse,
      benefitsText: draft.benefitsText,
      aiClinicalNote: draft.aiClinicalNote,
    }));
    showToast("Ficha clínica y parámetros dermatológicos redactados por IA.");
  };

  const addGalleryImage = (url: string) => {
    const clean = url.trim();
    if (!clean) return;
    if (form.gallery.includes(clean)) {
      showToast("Esa vista ya hace parte de la galería.");
      return;
    }
    setForm((prev) => ({
      ...prev,
      gallery: [...prev.gallery, clean],
      newGalleryUrl: "",
    }));
  };

  const removeGalleryImage = (index: number) => {
    if (form.gallery.length <= 1) {
      setFormError("El producto debe conservar al menos 1 vista fotográfica.");
      return;
    }
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== index),
    }));
  };

  const makePrimaryGalleryImage = (index: number) => {
    setForm((prev) => {
      const target = prev.gallery[index];
      const rest = prev.gallery.filter((_, idx) => idx !== index);
      return {
        ...prev,
        gallery: [target, ...rest],
      };
    });
  };

  const toggleSkinType = (st: SkinTypeOption) => {
    setForm((prev) => ({
      ...prev,
      skinTypes: prev.skinTypes.includes(st)
        ? prev.skinTypes.filter((x) => x !== st)
        : [...prev.skinTypes, st],
    }));
  };

  const toggleConcern = (c: ConcernOption) => {
    setForm((prev) => ({
      ...prev,
      concerns: prev.concerns.includes(c)
        ? prev.concerns.filter((x) => x !== c)
        : [...prev.concerns, c],
    }));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedPrice = parseFloat(form.price);
    const parsedStock = parseInt(form.stock, 10);

    if (form.name.trim().length < 3) {
      setFormError("El nombre de la fórmula debe tener al menos 3 caracteres.");
      return;
    }
    if (form.tagline.trim().length < 8) {
      setFormError(
        "Ingresa un subtítulo descriptivo corto (mínimo 8 caracteres) o usa 'Autocompletar con IA'."
      );
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError("El precio debe ser un valor numérico mayor a $0.");
      return;
    }
    if (isNaN(parsedStock) || parsedStock < 0) {
      setFormError("El stock disponible no puede ser negativo.");
      return;
    }
    if (form.skinTypes.length === 0) {
      setFormError("Selecciona al menos un tipo de piel compatible.");
      return;
    }
    if (form.description.trim().length < 15) {
      setFormError(
        "La descripción clínica debe tener al menos 15 caracteres (puedes generarla con IA)."
      );
      return;
    }

    const activeIngredients = form.activeIngredientsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (activeIngredients.length === 0) {
      setFormError("Especifica al menos un ingrediente activo.");
      return;
    }

    const benefits = form.benefitsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const cleanGallery =
      form.gallery.length > 0 ? form.gallery : [PRESET_IMAGES[0].url];

    const payload = {
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      category: form.category,
      price: Number(parsedPrice.toFixed(2)),
      stock: parsedStock,
      badge: form.badge.trim() || undefined,
      volume: form.volume.trim() || "30 ml",
      image: cleanGallery[0],
      gallery: cleanGallery,
      isVisible: form.isVisible,
      isFeatured: form.isFeatured,
      aiRecommended: form.aiRecommended,
      aiClinicalNote: form.aiClinicalNote.trim() || undefined,
      skinTypes: form.skinTypes,
      concerns:
        form.concerns.length > 0
          ? form.concerns
          : (["deshidratación"] as ConcernOption[]),
      activeIngredients,
      description: form.description.trim(),
      howToUse: form.howToUse.trim(),
      texture: form.texture.trim(),
      routineStep: form.routineStep,
      timeOfDay: form.timeOfDay,
      benefits:
        benefits.length > 0
          ? benefits
          : ["Fórmula dermatológica clínicamente balanceada"],
    };

    if (editingId) {
      updateProduct(editingId, payload);
      showToast(`Vistas y datos de "${payload.name}" actualizados.`);
    } else {
      addProduct(payload);
      showToast(`Nueva fórmula "${payload.name}" agregada y publicada.`);
    }

    setModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Notificación flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-stone-900 text-white text-xs font-medium shadow-xl border border-stone-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cabecera */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
            Gestión de Catálogo, Galerías & Escaparates
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 mt-1">
            Productos & Vistas de Tienda
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Agrega productos nuevos, controla qué fórmulas se ven en Inicio/Catálogo, edita sus galerías de ángulos y redacta fichas clínicas con IA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              resetToDefault();
              showToast("Catálogo restaurado a las 8 fórmulas originales.");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Base</span>
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-emerald-950 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Agregar Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Tarjetas Resumen de Vistas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <button
          type="button"
          onClick={() => setViewScope("all")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            viewScope === "all"
              ? "bg-stone-900 text-white border-stone-900 shadow-sm"
              : "bg-white text-stone-800 border-stone-200/80 hover:border-stone-300"
          }`}
        >
          <div className="text-[11px] opacity-75">Total Fórmulas</div>
          <div className="text-2xl font-bold font-sans mt-0.5">
            {stats.total}
          </div>
          <div className="text-[10px] opacity-70 mt-0.5">
            {stats.visibleCount} visibles en tienda
          </div>
        </button>

        <button
          type="button"
          onClick={() => setViewScope("featured")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            viewScope === "featured"
              ? "bg-amber-600 text-white border-amber-600 shadow-sm"
              : "bg-white text-stone-800 border-stone-200/80 hover:border-stone-300"
          }`}
        >
          <div className="text-[11px] opacity-75">Destacadas en Home</div>
          <div className="text-2xl font-bold font-sans mt-0.5">
            {stats.featuredCount}
          </div>
          <div className="text-[10px] opacity-70 mt-0.5">
            Sección Esenciales `/`
          </div>
        </button>

        <button
          type="button"
          onClick={() => setViewScope("hidden")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            viewScope === "hidden"
              ? "bg-rose-700 text-white border-rose-700 shadow-sm"
              : "bg-white text-stone-800 border-stone-200/80 hover:border-stone-300"
          }`}
        >
          <div className="text-[11px] opacity-75">Ocultas / Borrador</div>
          <div className="text-2xl font-bold font-sans mt-0.5">
            {stats.hiddenCount}
          </div>
          <div className="text-[10px] opacity-70 mt-0.5">
            No visibles al cliente
          </div>
        </button>

        <div className="p-4 rounded-2xl bg-[#f3f6f3] text-[#2f3e33] border border-[#d6e0d7]">
          <div className="text-[11px] text-[#3d5245] font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Indexadas en Motor IA</span>
          </div>
          <div className="text-2xl font-bold font-sans mt-0.5 text-stone-900">
            {stats.aiCount}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">
            Activas en recomendaciones
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar fórmula o ingrediente activo..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {["Todos", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                categoryFilter === cat
                  ? "bg-emerald-800 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla con Controles de Vistas Directos */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="w-8 h-8 text-stone-400 mx-auto" />
            <div className="font-serif text-xl text-stone-900">
              No se encontraron fórmulas en esta vista
            </div>
            <p className="text-xs text-stone-500">
              Cambia el filtro superior o agrega un nuevo producto al catálogo.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 text-[11px] uppercase tracking-wider text-stone-500 border-b border-stone-200/70">
                  <th className="py-3.5 px-5 font-semibold">Fórmula & Galería</th>
                  <th className="py-3.5 px-4 font-semibold">
                    Vistas & Escaparate (1-Clic)
                  </th>
                  <th className="py-3.5 px-4 font-semibold">Stock</th>
                  <th className="py-3.5 px-4 font-semibold">Precio</th>
                  <th className="py-3.5 px-5 font-semibold text-right">
                    Gestionar Vista
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredProducts.map((product) => {
                  const stockVal = product.stock ?? 24;
                  const isVisible = product.isVisible !== false;
                  const isFeatured = Boolean(product.isFeatured);
                  const isAiActive = product.aiRecommended !== false;
                  const viewsCount = product.gallery?.length || 1;

                  return (
                    <tr
                      key={product.id}
                      className={`transition-colors ${
                        isVisible
                          ? "hover:bg-stone-50/60"
                          : "bg-stone-50/80 opacity-75"
                      }`}
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewProduct(product);
                              setPreviewActiveImg(0);
                              setPreviewMode("detail");
                            }}
                            title="Previsualizar vistas del producto"
                            className="relative w-13 h-13 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 group"
                          >
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                            <span className="absolute bottom-0.5 right-0.5 bg-stone-950/80 text-white text-[9px] px-1.5 rounded-md font-bold">
                              {viewsCount} img
                            </span>
                          </button>
                          <div className="min-w-0">
                            <div className="font-semibold text-stone-900 flex items-center gap-2">
                              <span className="truncate">{product.name}</span>
                              {product.badge && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200 font-medium shrink-0">
                                  {product.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-500 truncate max-w-xs">
                              {product.category} • {product.volume}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Controles rápidos de Vistas y Presencia */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              toggleVisibility(product.id);
                              showToast(
                                isVisible
                                  ? `"${product.name}" ocultada de la tienda pública.`
                                  : `"${product.name}" ahora es visible en tienda.`
                              );
                            }}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                              isVisible
                                ? "bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100"
                                : "bg-stone-200 text-stone-600 border-stone-300 hover:bg-stone-300"
                            }`}
                          >
                            {isVisible ? (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Publicada</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Oculta</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              toggleFeatured(product.id);
                              showToast(
                                isFeatured
                                  ? `"${product.name}" removida del escaparate Home.`
                                  : `"${product.name}" destacada en la página de Inicio.`
                              );
                            }}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                              isFeatured
                                ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                                : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"
                            }`}
                          >
                            <Star
                              className={`w-3 h-3 ${
                                isFeatured
                                  ? "fill-amber-400 text-amber-500"
                                  : "text-stone-400"
                              }`}
                            />
                            <span>Home</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              toggleAiRecommended(product.id);
                              showToast(
                                isAiActive
                                  ? `"${product.name}" pausada en recomendaciones IA.`
                                  : `"${product.name}" activada en Dra. Aura IA.`
                              );
                            }}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                              isAiActive
                                ? "bg-[#eef2ee] text-[#2f3e33] border-[#d6e0d7] hover:bg-[#e4ebe4]"
                                : "bg-white text-stone-400 border-stone-200"
                            }`}
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>IA</span>
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`font-semibold px-2.5 py-1 rounded-full text-[11px] ${
                            stockVal === 0
                              ? "bg-rose-50 text-rose-700"
                              : stockVal <= 10
                              ? "bg-amber-50 text-amber-800"
                              : "bg-stone-100 text-stone-800"
                          }`}
                        >
                          {stockVal} uds
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold text-stone-900 font-sans text-sm">
                        ${product.price.toFixed(2)}
                      </td>

                      <td className="py-4 px-5 text-right">
                        {confirmDeleteId === product.id ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                deleteProduct(product.id);
                                setConfirmDeleteId(null);
                                showToast(`"${product.name}" eliminada.`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-semibold hover:bg-rose-700"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 rounded-lg bg-stone-200 text-stone-700 text-[11px]"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewProduct(product);
                                setPreviewActiveImg(0);
                                setPreviewMode("detail");
                              }}
                              title="Previsualizar tarjeta y página de detalle"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 text-[11px] font-medium transition-colors"
                            >
                              <Monitor className="w-3.5 h-3.5" />
                              <span className="hidden xl:inline">Vista Previa</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => openEditModal(product, "vistas")}
                              title="Editar galería y vistas"
                              className="p-2 rounded-xl text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                            >
                              <ImagePlus className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => openEditModal(product, "datos")}
                              title="Editar fórmula completa"
                              className="p-2 rounded-xl text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <Link
                              href={`/product/${product.slug}`}
                              title="Abrir página pública /product/[slug]"
                              className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(product.id)}
                              title="Eliminar fórmula"
                              className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================
          MODAL DE PREVISUALIZACIÓN DE VISTAS (Tarjeta vs Detalle)
         ============================================================ */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#faf8f5] w-full max-w-3xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-800">
                  Simulador de Vistas de Tienda
                </span>
                <h2 className="font-serif text-xl text-stone-900">
                  {previewProduct.name}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-full bg-stone-100 p-1 border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("card")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      previewMode === "card"
                        ? "bg-stone-900 text-white"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Vista Tarjeta</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("detail")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      previewMode === "detail"
                        ? "bg-stone-900 text-white"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Vista Detalle</span>
                  </button>
                </div>

                <button
                  onClick={() => setPreviewProduct(null)}
                  className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {previewMode === "card" ? (
                <div className="max-w-xs mx-auto bg-white rounded-3xl p-4 border border-stone-200 shadow-md space-y-3">
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100">
                    <Image
                      src={previewProduct.image}
                      alt={previewProduct.name}
                      fill
                      className="object-cover"
                    />
                    {previewProduct.badge && (
                      <span className="absolute top-3 left-3 bg-stone-900/85 text-white text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-medium">
                        {previewProduct.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-800 block">
                    {previewProduct.category}
                  </span>
                  <h3 className="font-serif text-lg text-stone-900">
                    {previewProduct.name}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2">
                    {previewProduct.tagline}
                  </p>
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="font-bold text-base font-sans">
                      ${previewProduct.price.toFixed(2)}
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-stone-900 text-white text-xs font-semibold">
                      Añadir
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-5 space-y-3">
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-stone-200">
                      <Image
                        src={
                          (previewProduct.gallery &&
                            previewProduct.gallery[previewActiveImg]) ||
                          previewProduct.image
                        }
                        alt={previewProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {previewProduct.gallery && previewProduct.gallery.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {previewProduct.gallery.map((imgUrl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPreviewActiveImg(idx)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 ${
                              previewActiveImg === idx
                                ? "border-emerald-700"
                                : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                          >
                            <Image
                              src={imgUrl}
                              alt={`Vista ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-7 space-y-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                      {previewProduct.category} • {previewProduct.routineStep}
                    </div>
                    <h3 className="font-serif text-2xl text-stone-900">
                      {previewProduct.name}
                    </h3>
                    <div className="text-xl font-bold text-stone-900 font-sans">
                      ${previewProduct.price.toFixed(2)}{" "}
                      <span className="text-xs font-normal text-stone-500">
                        ({previewProduct.volume})
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {previewProduct.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {previewProduct.activeIngredients.map((a) => (
                        <span
                          key={a}
                          className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                    {previewProduct.aiClinicalNote && (
                      <div className="p-3 rounded-2xl bg-emerald-950 text-emerald-100 text-xs flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{previewProduct.aiClinicalNote}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
                <Link
                  href={`/product/${previewProduct.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:underline"
                >
                  <span>Ir a la vista real en tienda</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const target = previewProduct;
                    setPreviewProduct(null);
                    openEditModal(target, "vistas");
                  }}
                  className="px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-emerald-950"
                >
                  Editar Vistas y Galería
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL DE CREAR / EDITAR PRODUCTO Y SUS VISTAS (3 PESTAÑAS)
         ============================================================ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-[#faf8f5]">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-800">
                  {editingId
                    ? "Edición Integral de Producto y Vistas"
                    : "Nuevo Registro de Laboratorio"}
                </span>
                <h2 className="font-serif text-2xl text-stone-900">
                  {editingId
                    ? "Configurar Fórmula & Vistas"
                    : "Agregar Nuevo Producto"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-stone-200/70 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navegación por Pestañas dentro del Modal */}
            <div className="px-6 pt-3 bg-stone-50 border-b border-stone-200 flex gap-2 overflow-x-auto">
              {(
                [
                  { id: "datos", label: "1. Datos & Copiloto IA" },
                  { id: "vistas", label: "2. Galería & Vistas de Tienda" },
                  { id: "ficha", label: "3. Ficha Clínica Detallada" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setModalTab(t.id)}
                  className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    modalTab === t.id
                      ? "border-emerald-800 text-emerald-950"
                      : "border-transparent text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleSaveProduct}
              className="p-6 space-y-5 max-h-[72vh] overflow-y-auto"
            >
              {formError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* PESTAÑA 1: DATOS COMERCIALES + AUTOCOMPLETADO CON IA */}
              {modalTab === "datos" && (
                <div className="space-y-4">
                  {/* Banner Copiloto IA Minimalista */}
                  <div className="p-4 rounded-2xl bg-[#f4f6f3] border border-[#d6e0d7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-[#2f3e33] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Redacción Clínica Asistida</span>
                      </div>
                      <p className="text-[11px] text-stone-600 font-light">
                        Ingresa el nombre y los activos principales para autocompletar descripción, beneficios y protocolo de uso.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAiAutocomplete}
                      className="px-4 py-2 rounded-full bg-[#2f3e33] text-[#faf8f5] text-xs font-medium hover:bg-stone-900 transition-colors shrink-0"
                    >
                      Autocompletar ficha
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Nombre Comercial de la Fórmula *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Vitamin C 15% + Ferulic Glow Drops"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Ingredientes Activos (separados por coma) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Ácido L-Ascórbico 15%, Ácido Ferúlico 0.5%, Vitamina E"
                        value={form.activeIngredientsText}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            activeIngredientsText: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Subtítulo / Tagline de Tarjeta *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Serum antioxidante iluminador contra manchas y fotodaño."
                        value={form.tagline}
                        onChange={(e) =>
                          setForm({ ...form, tagline: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Categoría *
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            category: e.target.value as CategoryOption,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-800 mb-1">
                          Precio (USD) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="1"
                          required
                          value={form.price}
                          onChange={(e) =>
                            setForm({ ...form, price: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-800 mb-1">
                          Stock (Uds) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={form.stock}
                          onChange={(e) =>
                            setForm({ ...form, stock: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Volumen / Presentación
                      </label>
                      <input
                        type="text"
                        value={form.volume}
                        onChange={(e) =>
                          setForm({ ...form, volume: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Insignia / Badge Superior
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Bestseller, Nueva Fórmula, pH 5.5"
                        value={form.badge}
                        onChange={(e) =>
                          setForm({ ...form, badge: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PESTAÑA 2: GALERÍA MULTI-ÁNGULO Y UBICACIÓN EN ESCAPARATES */}
              {modalTab === "vistas" && (
                <div className="space-y-5">
                  {/* Interruptores de Presencia en Vistas */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/70 flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isVisible}
                        onChange={(e) =>
                          setForm({ ...form, isVisible: e.target.checked })
                        }
                        className="mt-0.5 rounded text-emerald-700"
                      />
                      <div>
                        <div className="text-xs font-bold text-stone-900">
                          Visible en Tienda
                        </div>
                        <p className="text-[10px] text-stone-500">
                          Publicar en `/catalog` y buscadores.
                        </p>
                      </div>
                    </label>

                    <label className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/70 flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isFeatured}
                        onChange={(e) =>
                          setForm({ ...form, isFeatured: e.target.checked })
                        }
                        className="mt-0.5 rounded text-emerald-700"
                      />
                      <div>
                        <div className="text-xs font-bold text-stone-900">
                          Escaparate Home
                        </div>
                        <p className="text-[10px] text-stone-500">
                          Destacar en Esenciales del Inicio `/`.
                        </p>
                      </div>
                    </label>

                    <label className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/70 flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.aiRecommended}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            aiRecommended: e.target.checked,
                          })
                        }
                        className="mt-0.5 rounded text-emerald-700"
                      />
                      <div>
                        <div className="text-xs font-bold text-stone-900">
                          Elegible por IA
                        </div>
                        <p className="text-[10px] text-stone-500">
                          Recomendar en Dra. Aura y Test IA.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Galería de Vistas Fotográficas */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-stone-800">
                        Galería de Vistas del Producto ({form.gallery.length}{" "}
                        ángulos)
                      </label>
                      <span className="text-[10px] text-stone-500">
                        La primera imagen es la portada principal
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {form.gallery.map((imgUrl, idx) => (
                        <div
                          key={`${imgUrl}-${idx}`}
                          className={`relative group rounded-2xl overflow-hidden border-2 bg-stone-100 aspect-square ${
                            idx === 0
                              ? "border-emerald-600"
                              : "border-stone-200"
                          }`}
                        >
                          <Image
                            src={imgUrl}
                            alt={`Vista ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute top-2 left-2 bg-emerald-700 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded-full">
                              Principal
                            </span>
                          )}
                          <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between gap-1">
                            {idx !== 0 ? (
                              <button
                                type="button"
                                onClick={() => makePrimaryGalleryImage(idx)}
                                className="text-[9px] text-emerald-300 font-semibold px-1.5 py-0.5 rounded bg-stone-900"
                              >
                                Hacer portada
                              </button>
                            ) : (
                              <span className="text-[9px] text-stone-300 px-1">
                                Portada
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(idx)}
                              className="text-[10px] text-rose-300 hover:text-rose-200 px-1.5 py-0.5"
                            >
                              Quitar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Añadir vista por URL o Preset */}
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Pegar URL de nueva vista fotográfica (https://images.unsplash.com/...)"
                        value={form.newGalleryUrl}
                        onChange={(e) =>
                          setForm({ ...form, newGalleryUrl: e.target.value })
                        }
                        className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-mono focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => addGalleryImage(form.newGalleryUrl)}
                        className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-emerald-950"
                      >
                        + Agregar Vista
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] text-stone-500">
                        O suma vistas de estudio clínico con 1 clic:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_IMAGES.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => addGalleryImage(preset.url)}
                            className="px-2.5 py-1 rounded-lg text-[10px] bg-stone-100 border border-stone-200 text-stone-700 hover:bg-emerald-50 hover:border-emerald-400 transition-colors"
                          >
                            + {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PESTAÑA 3: FICHA CLÍNICA DETALLADA (Lo que se ve en /product/[slug]) */}
              {modalTab === "ficha" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Paso en la Rutina
                      </label>
                      <select
                        value={form.routineStep}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            routineStep: e.target.value as RoutineStepOption,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-white"
                      >
                        {ROUTINE_STEPS.map((step) => (
                          <option key={step} value={step}>
                            {step}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Horario de Aplicación
                      </label>
                      <select
                        value={form.timeOfDay}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            timeOfDay: e.target.value as TimeOfDayOption,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-white"
                      >
                        {TIMES_OF_DAY.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tipos de piel */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-800">
                      Tipos de Piel Compatibles *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SKIN_TYPES.map((st) => {
                        const active = form.skinTypes.includes(st);
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => toggleSkinType(st)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                              active
                                ? "bg-stone-900 text-white border-stone-900"
                                : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                            }`}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Objetivos */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-800">
                      Objetivos Dermatológicos
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CONCERNS.map((c) => {
                        const active = form.concerns.includes(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => toggleConcern(c)}
                            className={`px-3 py-1 rounded-full text-[11px] capitalize font-medium border transition-colors ${
                              active
                                ? "bg-emerald-800 text-white border-emerald-800"
                                : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                            }`}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Descripción Clínica Principal *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Textura Sensorial
                      </label>
                      <input
                        type="text"
                        value={form.texture}
                        onChange={(e) =>
                          setForm({ ...form, texture: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Nota Personalizada Dra. Aura IA
                      </label>
                      <input
                        type="text"
                        placeholder="Veredicto personalizado que mostrará el módulo IA..."
                        value={form.aiClinicalNote}
                        onChange={(e) =>
                          setForm({ ...form, aiClinicalNote: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Protocolo / Modo de Uso
                    </label>
                    <textarea
                      rows={2}
                      value={form.howToUse}
                      onChange={(e) =>
                        setForm({ ...form, howToUse: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Beneficios Comprobados (1 por línea)
                    </label>
                    <textarea
                      rows={3}
                      value={form.benefitsText}
                      onChange={(e) =>
                        setForm({ ...form, benefitsText: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <div className="flex gap-2">
                  {modalTab !== "ficha" && (
                    <button
                      type="button"
                      onClick={() =>
                        setModalTab(modalTab === "datos" ? "vistas" : "ficha")
                      }
                      className="px-4 py-2 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200"
                    >
                      Siguiente pestaña →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-emerald-950 transition-colors"
                  >
                    {editingId ? "Guardar Cambios" : "Publicar Producto"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
