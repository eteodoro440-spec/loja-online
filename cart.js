const storageKey = "lojanova-cart";
const promoKey = "lojanova-promo";

const cartItemsEl = document.getElementById("cart-items");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const discountEl = document.getElementById("discount");
const totalEl = document.getElementById("total");
const cartCountEl = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");
const promoCodeInput = document.getElementById("promo-code");
const promoMessageEl = document.getElementById("promo-message");
const applyPromoBtn = document.getElementById("apply-promo");

function getCart() {
  const cart = localStorage.getItem(storageKey);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem(storageKey, JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountEl) cartCountEl.textContent = String(totalQty);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getPromoDiscount(subtotal) {
  const promo = localStorage.getItem(promoKey);
  if (!promo) return 0;

  if (promo.toUpperCase() === "LOJANOVA10") {
    return subtotal * 0.1;
  }

  if (promo.toUpperCase() === "FRETEGRATIS") {
    return 0;
  }

  return 0;
}

function renderCart() {
  const cart = getCart();
  const cartSummary = cart.length > 0 ? cart : [];

  if (cartSummary.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="empty-state">
        <span style="font-size: 3rem">🛒</span>
        <h2>Carrinho vazio</h2>
        <p>Comece a adicionar produtos para sua compra</p>
        <a href="index.html#produtos" class="primary-btn">Voltar às compras</a>
      </div>
    `;
    subtotalEl.textContent = formatCurrency(0);
    shippingEl.textContent = formatCurrency(0);
    discountEl.textContent = formatCurrency(0);
    totalEl.textContent = formatCurrency(0);
    checkoutBtn.disabled = true;
    updateCartCount();
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 19.9;
  const discount = getPromoDiscount(subtotal);
  const total = Math.max(subtotal + shipping - discount, 0);

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div class="cart-item-visual">${item.emoji}</div>
          <div class="cart-item-content">
            <div class="cart-item-top">
              <h3>${item.name}</h3>
              <button class="remove-btn" data-id="${item.id}" type="button">Remover</button>
            </div>
            <p>${item.category}</p>
            <div class="cart-item-bottom">
              <div class="qty-control">
                <button type="button" class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button type="button" class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
              </div>
              <strong>${formatCurrency(item.price * item.quantity)}</strong>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  subtotalEl.textContent = formatCurrency(subtotal);
  shippingEl.textContent = formatCurrency(shipping);
  discountEl.textContent = formatCurrency(discount);
  totalEl.textContent = formatCurrency(total);
  checkoutBtn.disabled = false;

  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const updatedCart = getCart().filter((item) => item.id !== id);
      saveCart(updatedCart);
      renderCart();
    });
  });

  document.querySelectorAll(".qty-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const action = button.dataset.action;
      const updatedCart = getCart().map((item) => {
        if (item.id !== id) return item;

        if (action === "increase") {
          return { ...item, quantity: item.quantity + 1 };
        }

        if (action === "decrease") {
          if (item.quantity <= 1) {
            return null;
          }
          return { ...item, quantity: item.quantity - 1 };
        }

        return item;
      }).filter(Boolean);

      saveCart(updatedCart);
      renderCart();
    });
  });

  updateCartCount();
}

function applyPromoCode() {
  const code = promoCodeInput.value.trim();
  if (!code) {
    promoMessageEl.textContent = "Digite um código promocional.";
    promoMessageEl.style.color = "#d33d3d";
    return;
  }

  localStorage.setItem(promoKey, code);
  const subtotal = getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = getPromoDiscount(subtotal);

  if (discount > 0) {
    promoMessageEl.textContent = "Cupom aplicado com sucesso!";
    promoMessageEl.style.color = "#1a8a4b";
  } else {
    promoMessageEl.textContent = "Cupom inválido. Tente: LOJANOVA10";
    promoMessageEl.style.color = "#d33d3d";
    localStorage.removeItem(promoKey);
  }

  renderCart();
}

applyPromoBtn.addEventListener("click", applyPromoCode);
checkoutBtn.addEventListener("click", () => {
  alert("Pedido finalizado com sucesso!\nObrigado por comprar na Loja Nova.");
  localStorage.removeItem(storageKey);
  localStorage.removeItem(promoKey);
  renderCart();
});

updateCartCount();
renderCart();
