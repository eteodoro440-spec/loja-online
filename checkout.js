const storageKey = 'lojanova-cart';

const cartCountEl = document.getElementById('cart-count');
const summaryItemsEl = document.getElementById('summary-items');
const summaryTotalEl = document.getElementById('summary-total');
const checkoutForm = document.getElementById('checkout-form');

function getCart() {
  const cart = localStorage.getItem(storageKey);
  return cart ? JSON.parse(cart) : [];
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountEl) cartCountEl.textContent = String(total);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function renderSummary() {
  const cart = getCart();

  if (!cart.length) {
    summaryItemsEl.innerHTML = '<p style="color: var(--muted);">Seu carrinho está vazio.</p>';
    summaryTotalEl.textContent = formatCurrency(0);
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 19.9;
  const total = subtotal + shipping;

  summaryItemsEl.innerHTML = cart
    .map(
      (item) => `
        <div class="summary-item-row">
          <div>
            <strong>${item.name}</strong>
            <p>${item.quantity}x</p>
          </div>
          <span>${formatCurrency(item.price * item.quantity)}</span>
        </div>
      `
    )
    .join('');

  summaryItemsEl.insertAdjacentHTML(
    'beforeend',
    `
      <div class="summary-item-row subtotal-row">
        <span>Subtotal</span>
        <span>${formatCurrency(subtotal)}</span>
      </div>
      <div class="summary-item-row">
        <span>Frete</span>
        <span>${formatCurrency(shipping)}</span>
      </div>
    `
  );

  summaryTotalEl.textContent = formatCurrency(total);
}

const paymentRadios = document.querySelectorAll('input[name="payment"]');
const paymentBlocks = {
  card: document.getElementById('card-payment'),
  pix: document.getElementById('pix-payment'),
  boleto: document.getElementById('boleto-payment'),
};

paymentRadios.forEach((radio) => {
  radio.addEventListener('change', () => {
    Object.entries(paymentBlocks).forEach(([key, block]) => {
      block.style.display = radio.value === key ? 'block' : 'none';
    });
  });
});

checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const cart = getCart();
  if (!cart.length) {
    alert('Seu carrinho está vazio.');
    return;
  }

  alert('Pedido realizado com sucesso!\nObrigado por comprar na Loja Nova!');
  localStorage.removeItem(storageKey);
  updateCartCount();
  renderSummary();
  checkoutForm.reset();
});

updateCartCount();
renderSummary();
