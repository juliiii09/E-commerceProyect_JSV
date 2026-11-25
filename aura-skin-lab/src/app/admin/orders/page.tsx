"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  Search,
  Eye,
  X,
  RotateCcw,
  ShoppingBag,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  Trash2,
} from "lucide-react";
import {
  AdminOrder,
  OrderStatus,
  useOrderStore,
} from "@/store/use-order-store";
import { useHasMounted } from "@/hooks/use-has-mounted";

const EMPTY_ORDERS: AdminOrder[] = [];

const STATUS_META: Record<
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
    label: "Enviada",
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

export default function AdminOrdersPage() {
  const mounted = useHasMounted();
  const { orders, updateOrderStatus, deleteOrder, resetOrders } =
    useOrderStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const activeOrders = mounted ? orders : EMPTY_ORDERS;

  const filteredOrders = useMemo(() => {
    return activeOrders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q) ||
        order.city.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [activeOrders, statusFilter, search]);

  const summary = useMemo(() => {
    const net = activeOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((acc, o) => acc + o.total, 0);
    return {
      net,
      pending: activeOrders.filter((o) => o.status === "pending").length,
      shipped: activeOrders.filter((o) => o.status === "shipped").length,
      delivered: activeOrders.filter((o) => o.status === "delivered").length,
    };
  }, [activeOrders]);

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
            Logística & Despachos
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 mt-1">
            Órdenes & Ventas
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Supervisa pagos, actualiza estados de envío y consulta el detalle de cada compra.
          </p>
        </div>

        <button
          onClick={resetOrders}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar Órdenes Demo</span>
        </button>
      </div>

      {/* Mini KPIs de Órdenes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80">
          <div className="text-[11px] text-stone-500">Facturación Activa</div>
          <div className="text-xl font-bold text-stone-900 font-sans mt-1">
            ${summary.net.toFixed(2)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80">
          <div className="text-[11px] text-stone-500">Por Despachar</div>
          <div className="text-xl font-bold text-amber-700 font-sans mt-1">
            {summary.pending}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80">
          <div className="text-[11px] text-stone-500">En Tránsito</div>
          <div className="text-xl font-bold text-sky-700 font-sans mt-1">
            {summary.shipped}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80">
          <div className="text-[11px] text-stone-500">Entregadas</div>
          <div className="text-xl font-bold text-emerald-800 font-sans mt-1">
            {summary.delivered}
          </div>
        </div>
      </div>

      {/* Buscador y Filtros de Estado */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar #ID, cliente, email o ciudad..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
          {(
            [
              { key: "all", label: "Todas" },
              { key: "pending", label: "Pendientes" },
              { key: "paid", label: "Pagadas" },
              { key: "shipped", label: "Enviadas" },
              { key: "delivered", label: "Entregadas" },
              { key: "cancelled", label: "Canceladas" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === tab.key
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Órdenes */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShoppingBag className="w-8 h-8 text-stone-400 mx-auto" />
            <div className="font-serif text-xl text-stone-900">
              No hay órdenes que coincidan con el filtro
            </div>
            <p className="text-xs text-stone-500">
              Cambia el filtro de estado o realiza una compra de prueba en el Checkout.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 text-[11px] uppercase tracking-wider text-stone-500 border-b border-stone-200/70">
                  <th className="py-3.5 px-6 font-semibold">Orden</th>
                  <th className="py-3.5 px-6 font-semibold">Fecha</th>
                  <th className="py-3.5 px-6 font-semibold">Cliente</th>
                  <th className="py-3.5 px-6 font-semibold">Destino</th>
                  <th className="py-3.5 px-6 font-semibold">Total</th>
                  <th className="py-3.5 px-6 font-semibold">Estado</th>
                  <th className="py-3.5 px-6 font-semibold text-right">
                    Detalle
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredOrders.map((order) => {
                  const statusInfo = STATUS_META[order.status];
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-stone-50/60 transition-colors"
                    >
                      <td className="py-4 px-6 font-mono font-bold text-stone-900">
                        #{order.id}
                      </td>
                      <td className="py-4 px-6 text-stone-500 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-stone-900">
                          {order.customerName}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          {order.customerEmail}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-stone-600">
                        {order.city}, {order.country}
                      </td>
                      <td className="py-4 px-6 font-bold text-stone-900 font-sans">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(
                              order.id,
                              e.target.value as OrderStatus
                            )
                          }
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border cursor-pointer focus:outline-none ${statusInfo.badgeClass}`}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="paid">Pagada</option>
                          <option value="shipped">Enviada</option>
                          <option value="delivered">Entregada</option>
                          <option value="cancelled">Cancelada</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-medium transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver</span>
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            title="Eliminar registro"
                            className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalle de Orden */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-stone-200 bg-[#faf8f5] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-800">
                  Comprobante de Orden
                </span>
                <h2 className="font-serif text-2xl text-stone-900">
                  Pedido #{selectedOrder.id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full hover:bg-stone-200/70 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Info Cliente y Envío */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                    Destinatario
                  </div>
                  <div className="font-bold text-stone-900 text-sm">
                    {selectedOrder.customerName}
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    <span>{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>{selectedOrder.phone}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                    Entrega & Pago
                  </div>
                  <div className="flex items-start gap-1.5 text-stone-700">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      {selectedOrder.shippingAddress}, {selectedOrder.city} (
                      {selectedOrder.country})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                    <span>{selectedOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Productos Comprados */}
              <div className="space-y-2.5">
                <div className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                  Fórmulas Incluidas ({selectedOrder.items.length})
                </div>
                <div className="divide-y divide-stone-100 border border-stone-200/70 rounded-2xl overflow-hidden">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.productId}
                      className="p-3 flex items-center justify-between gap-3 bg-white"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-stone-900 truncate">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            Cant: {item.quantity} × ${item.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-stone-900 font-sans">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen Financiero */}
              <div className="space-y-2 pt-3 border-t border-stone-200">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-sans">
                    ${selectedOrder.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Costo de Envío</span>
                  <span className="font-sans">
                    {selectedOrder.shippingCost === 0
                      ? "Gratis"
                      : `$${selectedOrder.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span className="font-serif">Total Pagado</span>
                  <span className="font-sans">
                    ${selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Cambiar estado desde el modal */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="text-stone-600 font-medium">Estado:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      const next = e.target.value as OrderStatus;
                      updateOrderStatus(selectedOrder.id, next);
                      setSelectedOrder({ ...selectedOrder, status: next });
                    }}
                    className="px-3 py-1.5 rounded-full border border-stone-300 text-xs font-semibold bg-white"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagada</option>
                    <option value="shipped">Enviada</option>
                    <option value="delivered">Entregada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-emerald-950"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
