import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderLineItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  shippingAddress: string;
  city: string;
  country: string;
  items: OrderLineItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  paymentMethod: string;
}

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "AURA-849201",
    customerName: "Valentina Herrera",
    customerEmail: "valentina.h@gmail.com",
    phone: "+57 310 456 7890",
    shippingAddress: "Calle 93 # 14-20, Apto 402",
    city: "Bogotá",
    country: "Colombia",
    items: [
      {
        productId: "prod-1",
        name: "Ceramide Barrier Rescue Cream",
        price: 38.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
        category: "Hidratantes",
      },
      {
        productId: "prod-2",
        name: "Niacinamide 10% Pore Clarifier",
        price: 32.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
        category: "Serums",
      },
    ],
    subtotal: 70.0,
    shippingCost: 0,
    total: 70.0,
    status: "paid",
    createdAt: "2026-11-05T13:40:00.000Z",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "AURA-849174",
    customerName: "Camila Restrepo",
    customerEmail: "camila.restrepo@outlook.com",
    phone: "+57 314 889 1203",
    shippingAddress: "Cra 43A # 7-50, El Poblado",
    city: "Medellín",
    country: "Colombia",
    items: [
      {
        productId: "prod-3",
        name: "Multi-Depth Hyaluronic Acid Elixir",
        price: 36.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80",
        category: "Serums",
      },
      {
        productId: "prod-4",
        name: "Invisible Silk Mineral SPF 50+",
        price: 34.0,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
        category: "Protección Solar",
      },
    ],
    subtotal: 104.0,
    shippingCost: 0,
    total: 104.0,
    status: "shipped",
    createdAt: "2026-11-04T19:15:00.000Z",
    paymentMethod: "Mastercard •••• 8819",
  },
  {
    id: "AURA-849112",
    customerName: "Sofía Mendoza",
    customerEmail: "sofia.mendoza@empresa.co",
    phone: "+57 300 221 9044",
    shippingAddress: "Av. Colombia # 2-45, Oeste",
    city: "Cali",
    country: "Colombia",
    items: [
      {
        productId: "prod-6",
        name: "Encapsulated Retinol 0.3% Night Renew",
        price: 42.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
        category: "Serums",
      },
    ],
    subtotal: 42.0,
    shippingCost: 4.99,
    total: 46.99,
    status: "pending",
    createdAt: "2026-11-04T14:22:00.000Z",
    paymentMethod: "Visa •••• 1094",
  },
  {
    id: "AURA-848990",
    customerName: "Daniela Gómez",
    customerEmail: "dgomez.derma@salud.com",
    phone: "+57 320 775 3311",
    shippingAddress: "Calle 84 # 51B-30, Alto Prado",
    city: "Barranquilla",
    country: "Colombia",
    items: [
      {
        productId: "prod-5",
        name: "Gentle Centella Balancing Cleanser",
        price: 26.0,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
        category: "Limpiadores",
      },
      {
        productId: "prod-8",
        name: "Peptide & Caffeine Eye Contour",
        price: 35.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
        category: "Hidratantes",
      },
    ],
    subtotal: 87.0,
    shippingCost: 0,
    total: 87.0,
    status: "delivered",
    createdAt: "2026-11-02T10:05:00.000Z",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "AURA-848850",
    customerName: "Andrés Villamizar",
    customerEmail: "andres.v@correo.com",
    phone: "+57 315 609 4412",
    shippingAddress: "Cra 35 # 48-12, Cabecera",
    city: "Bucaramanga",
    country: "Colombia",
    items: [
      {
        productId: "prod-7",
        name: "Salicylic Acid 2% Clarifying Exfoliant",
        price: 29.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80",
        category: "Limpiadores",
      },
    ],
    subtotal: 29.0,
    shippingCost: 4.99,
    total: 33.99,
    status: "cancelled",
    createdAt: "2026-11-01T16:48:00.000Z",
    paymentMethod: "Mastercard •••• 5531",
  },
];

interface OrderStore {
  orders: AdminOrder[];
  addOrder: (order: AdminOrder) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  resetOrders: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: INITIAL_ORDERS,

      addOrder: (order) => {
        set({ orders: [order, ...get().orders] });
      },

      updateOrderStatus: (id, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        });
      },

      deleteOrder: (id) => {
        set({
          orders: get().orders.filter((o) => o.id !== id),
        });
      },

      resetOrders: () => {
        set({ orders: INITIAL_ORDERS });
      },
    }),
    {
      name: "meve-orders-store",
    }
  )
);

