"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Truck,
  AlertTriangle,
  Plus,
  Star,
} from "lucide-react";
import { useProductStore } from "@/store/use-product-store";
import { AdminOrder, useOrderStore, OrderStatus } from "@/store/use-order-store";
import { PRODUCTS_CATALOG } from "@/data/mock-products";
import { useHasMounted } from "@/hooks/use-has-mounted";

const EMPTY_ORDERS: AdminOrder[] = [];

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; badgeClass: string }
> = {
  pending: {
    label: "Pendiente",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
  },
  paid: {
    label: "Pagada",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  shipped: {
    label: "En Tránsito",
    badgeClass: "bg-sky-50 text-sky-800 border-sky-200",
  },
  delivered: {
    label: "Entregada",
    badgeClass: "bg-stone-900 text-white border-stone-900",
  },
  cancelled: {
    label: "Cancelada",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export default function AdminDashboardPage() {
  const mounted = useHasMounted();
  const { products: storedProducts } = useProductStore();
  const { orders } = useOrderStore();

  const products = mounted ? storedProducts : PRODUCTS_CATALOG;
  const activeOrders = mounted ? orders : EMPTY_ORDERS;

  const metrics = useMemo(() => {
    const validOrders = activeOrders.filter((o) => o.status !== "cancelled");
    const netRevenue = validOrders.reduce((acc, o) => acc + o.total, 0);
    const avgTicket =
      validOrders.length > 0 ? netRevenue / validOrders.length : 0;

    const pendingCount = activeOrders.filter(
      (o) => o.status === "pending"
    ).length;
    const shippedCount = activeOrders.filter(
      (o) => o.status === "shipped"
    ).length;
    const avgRating =
      products.length > 0
        ? products.reduce((acc, p) => acc + p.rating, 0) / products.length
        : 5.0;

    // Ingresos por categoría
    const categoryTotals: Record<string, number> = {
      Serums: 0,
      Hidratantes: 0,
      "Protección Solar": 0,
      Limpiadores: 0,
    };

    for (const order of validOrders) {
      for (const item of order.items) {
        const cat = item.category || "Serums";
        categoryTotals[cat] =
          (categoryTotals[cat] || 0) + item.price * item.quantity;
      }
    }

    const maxCategoryVal = Math.max(1, ...Object.values(categoryTotals));

    return {
      netRevenue,
      avgTicket,
      totalOrders: activeOrders.length,
      pendingCount,
      shippedCount,
      avgRating,
      categoryTotals,
      maxCategoryVal,
    };
  }, [activeOrders, products]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => (p.stock ?? 24) <= 10);
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Encabezado Ejecutivo */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
            Resumen Operativo en Tiempo Real
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 mt-1">
            Dashboard General
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Monitorea las ventas, órdenes recientes y desempeño del catálogo clínico MEVE.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-full bg-white border border-stone-200 text-stone-800 text-xs font-semibold hover:bg-stone-50 transition-colors shadow-2xs"
          >
            Ver Órdenes ({metrics.totalOrders})
          </Link>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Fórmula</span>
          </Link>
        </div>
      </div>

      {/* Tarjetas de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">
              Ingresos Netos
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-stone-900 font-sans">
            ${metrics.netRevenue.toFixed(2)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Excluye órdenes canceladas</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">
              Órdenes Registradas
            </span>
            <div className="p-2.5 rounded-2xl bg-stone-100 text-stone-800">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-stone-900 font-sans">
            {metrics.totalOrders}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-stone-500">
            <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
              <Clock className="w-3 h-3" /> {metrics.pendingCount} pendientes
            </span>
            <span className="inline-flex items-center gap-1 text-sky-700 font-medium">
              <Truck className="w-3 h-3" /> {metrics.shippedCount} enviadas
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">
              Ticket Promedio (AOV)
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-stone-900 font-sans">
            ${metrics.avgTicket.toFixed(2)}
          </div>
          <div className="text-[11px] text-stone-500">
            Envío gratis en compras &gt; $50.00
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">
              Fórmulas Activas
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-950 text-emerald-300">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-stone-900 font-sans">
            {products.length}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-stone-600 font-medium">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Valoración media {metrics.avgRating.toFixed(1)} / 5.0</span>
          </div>
        </div>
      </div>

      {/* Sección Intermedia: Ventas por Categoría + Inventario */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Desempeño por Categoría */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl text-stone-900 font-medium">
                Ingresos por Línea Dermatológica
              </h2>
              <p className="text-xs text-stone-500">
                Participación acumulada por categoría de producto
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-emerald-800 hover:underline inline-flex items-center gap-1"
            >
              <span>Catálogo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {Object.entries(metrics.categoryTotals).map(([category, amount]) => {
              const pct = Math.round((amount / metrics.maxCategoryVal) * 100);
              const countInCat = products.filter(
                (p) => p.category === category
              ).length;
              return (
                <div key={category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-800">
                      {category}{" "}
                      <span className="text-stone-400 font-normal">
                        ({countInCat} SKU{countInCat === 1 ? "" : "s"})
                      </span>
                    </span>
                    <span className="font-bold text-stone-900 font-sans">
                      ${amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-800 to-emerald-500 transition-all duration-500"
                      style={{ width: `${Math.max(pct, amount > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estado de Inventario & Alertas */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl text-stone-900 font-medium">
                  Control de Stock Clínico
                </h2>
                <p className="text-xs text-stone-500">
                  Alertas de reposición y fórmulas destacadas
                </p>
              </div>
            </div>

            {lowStockProducts.length > 0 ? (
              <div className="space-y-2.5">
                {lowStockProducts.slice(0, 4).map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-semibold text-stone-900 truncate">
                        {prod.name}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-950 font-bold text-[10px] shrink-0">
                      {prod.stock ?? 0} uds
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-center gap-3 text-xs text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <div className="font-semibold">Inventario saludable</div>
                  <p className="text-emerald-800/80 text-[11px]">
                    Todas las fórmulas cuentan con disponibilidad óptima en laboratorio.
                  </p>
                </div>
              </div>
            )}

            {/* Top 3 Fórmulas */}
            <div className="pt-2 space-y-2.5">
              <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                Fórmulas Líderes del Catálogo
              </div>
              {products.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-1.5 border-b border-stone-100 last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-stone-900 truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-stone-900 font-sans shrink-0">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/admin/products"
            className="w-full py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold text-center hover:bg-emerald-950 transition-colors"
          >
            Administrar Todo el Inventario
          </Link>
        </div>
      </div>

      {/* Tabla de Últimas Órdenes */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-6 sm:px-8 border-b border-stone-200/70 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl text-stone-900 font-medium">
              Órdenes Recientes
            </h2>
            <p className="text-xs text-stone-500">
              Las compras efectuadas en el Checkout se sincronizan automáticamente aquí
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-emerald-800 hover:underline inline-flex items-center gap-1"
          >
            <span>Gestionar todas</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/80 text-[11px] uppercase tracking-wider text-stone-500 border-b border-stone-200/70">
                <th className="py-3.5 px-6 font-semibold">Referencia</th>
                <th className="py-3.5 px-6 font-semibold">Cliente</th>
                <th className="py-3.5 px-6 font-semibold">Ciudad</th>
                <th className="py-3.5 px-6 font-semibold">Ítems</th>
                <th className="py-3.5 px-6 font-semibold">Total</th>
                <th className="py-3.5 px-6 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {activeOrders.slice(0, 5).map((order) => {
                const statusInfo = STATUS_CONFIG[order.status];
                const totalUnits = order.items.reduce(
                  (acc, i) => acc + i.quantity,
                  0
                );
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-stone-50/70 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono font-bold text-stone-900">
                      #{order.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-stone-900">
                        {order.customerName}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        {order.customerEmail}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-stone-600">{order.city}</td>
                    <td className="py-4 px-6 text-stone-600">
                      {totalUnits} {totalUnits === 1 ? "fórmula" : "fórmulas"}
                    </td>
                    <td className="py-4 px-6 font-bold text-stone-900 font-sans">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.badgeClass}`}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
