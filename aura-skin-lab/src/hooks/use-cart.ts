// Hook personalizado para interactuar con el carrito
export function useCart() {
  return {
    items: [],
    itemCount: 0,
    subtotal: 0,
  };
}
