// carrito.js

// Leer carrito guardado o iniciar vacío
let cart = JSON.parse(localStorage.getItem('cart')) || {};

// Guardar carrito en localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Actualizar UI del carrito (contador, lista, total)
function updateCartUI() {
  const cartCount = document.getElementById('cart-count');
  const mobileCartCount = document.getElementById('mobile-cart-count');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!cartCount || !cartItemsContainer || !cartTotal || !checkoutBtn) {
    // No se encontró la UI del carrito (quizás no estamos en página con carrito)
    return;
  }

  const items = Object.values(cart);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

  cartCount.textContent = totalCount;
  if (mobileCartCount) mobileCartCount.textContent = totalCount;

  cartTotal.textContent = `$${totalPrice.toLocaleString()}`;

  cartItemsContainer.innerHTML = '';

  if (items.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-gray-400 text-center mt-8">Tu carrito está vacío.</p>';
    checkoutBtn.disabled = true;
    checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
    cartCount.classList.add('hidden');
    if (mobileCartCount) mobileCartCount.classList.add('hidden');
    saveCart();
    return;
  }

  checkoutBtn.disabled = false;
  checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  cartCount.classList.remove('hidden');
  if (mobileCartCount) mobileCartCount.classList.remove('hidden');

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center';

    div.innerHTML = `
      <div>
        <h3 class="font-semibold">${item.name}</h3>
        <p>$${item.price.toLocaleString()}</p>
      </div>
      <div class="flex items-center space-x-2">
        <button class="decrease text-amber-400 font-bold px-2 hover:text-amber-600" data-id="${item.id}">−</button>
        <span>${item.quantity}</span>
        <button class="increase text-amber-400 font-bold px-2 hover:text-amber-600" data-id="${item.id}">+</button>
        <button class="remove text-red-500 ml-4 hover:text-red-700" data-id="${item.id}" title="Eliminar">×</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  saveCart();
}

// Abrir y cerrar carrito
function setupCartToggle() {
  const cartBtn = document.getElementById('cart-btn');
  const mobileCartBtn = document.getElementById('mobile-cart-btn');
  const closeCartBtn = document.getElementById('close-cart');
  const cartPanel = document.getElementById('cart-panel');

  if (!cartBtn || !closeCartBtn || !cartPanel) return;

  cartPanel.classList.add('translate-x-full'); // iniciar oculto

  cartBtn.addEventListener('click', () => {
    cartPanel.classList.toggle('translate-x-full');
  });

  if (mobileCartBtn) {
    mobileCartBtn.addEventListener('click', () => {
      cartPanel.classList.toggle('translate-x-full');
    });
  }

  closeCartBtn.addEventListener('click', () => {
    cartPanel.classList.add('translate-x-full');
  });
}

// Agregar productos
function setupAddToCartButtons() {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.productId;
      const name = btn.dataset.productName;
      const price = parseFloat(btn.dataset.productPrice);

      if (!id || !name || isNaN(price)) {
        console.error('Producto inválido: falta id, nombre o precio');
        return;
      }

      if (cart[id]) {
        cart[id].quantity++;
      } else {
        cart[id] = { id, name, price, quantity: 1 };
      }
      updateCartUI();
    });
  });
}

// Delegación de eventos para botones +, -, eliminar dentro del carrito
function setupCartItemsListeners() {
  const cartItemsContainer = document.getElementById('cart-items');
  if (!cartItemsContainer) return;

  cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('increase')) {
      const id = e.target.dataset.id;
      cart[id].quantity++;
      updateCartUI();
    } else if (e.target.classList.contains('decrease')) {
      const id = e.target.dataset.id;
      if (cart[id].quantity > 1) {
        cart[id].quantity--;
      } else {
        delete cart[id];
      }
      updateCartUI();
    } else if (e.target.classList.contains('remove')) {
      const id = e.target.dataset.id;
      delete cart[id];
      updateCartUI();
    }
  });
}

// Checkout simulado
function setupCheckout() {
  const checkoutBtn = document.getElementById('checkout-btn');
  const cartPanel = document.getElementById('cart-panel');

  if (!checkoutBtn) return;

  checkoutBtn.addEventListener('click', () => {
    alert('Gracias por tu compra! Funcionalidad en desarrollo.');
    cart = {};
    updateCartUI();
    if (cartPanel) cartPanel.classList.add('translate-x-full');
  });
}

// Inicializar todo
document.addEventListener('DOMContentLoaded', () => {
  setupCartToggle();
  setupAddToCartButtons();
  setupCartItemsListeners();
  setupCheckout();
  updateCartUI();
});