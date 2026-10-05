const products = [
  {
    name: "Camiseta Premium",
    price: 89.9,
    category: "Moda",
    emoji: "👕",
  },
  {
    name: "Fone Wireless X",
    price: 249.9,
    category: "Tecnologia",
    emoji: "🎧",
  },
  {
    name: "Luminária LED",
    price: 129.9,
    category: "Casa",
    emoji: "💡",
  },
  {
    name: "Relógio Smart",
    price: 399.9,
    category: "Acessórios",
    emoji: "⌚",
  },
  {
    name: "Mochila Travel",
    price: 179.9,
    category: "Acessórios",
    emoji: "🎒",
  },
  {
    name: "Vaso Decorativo",
    price: 79.9,
    category: "Casa",
    emoji: "🏺",
  },
  {
    name: "Notebook Slim",
    price: 3199.9,
    category: "Tecnologia",
    emoji: "💻",
  },
  {
    name: "Tênis Esportivo",
    price: 219.9,
    category: "Moda",
    emoji: "👟",
  },
];

const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");

let cartItems = 0;

function renderProducts() {
  productList.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image" aria-label="${product.name}">${product.emoji}</div>
          <div class="product-body">
            <span class="product-label">${product.category}</span>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-meta">
              <span class="product-price">R$ ${product.price.toFixed(2).replace(".", ",")}</span>
              <button class="add-btn" type="button" data-name="${product.name}">Add</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  const addButtons = document.querySelectorAll(".add-btn");
  addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      cartItems += 1;
      cartCount.textContent = String(cartItems);
      button.textContent = "Adicionado";
      button.disabled = true;
      setTimeout(() => {
        button.textContent = "Add";
        button.disabled = false;
      }, 800);
    });
  });
}

renderProducts();
