const STORAGE_CART_KEY = 'shoppingCard';
const STORAGE_COUNT_KEY = 'productCount';
const API_PRODUCTS_URL = 'https://dummyjson.com/products?limit=100';
const PRODUCTS_PER_PAGE = 4;

let apiProducts = [];
let productsShown = 0;

function getCartItems() {
  return JSON.parse(localStorage.getItem(STORAGE_CART_KEY)) || [];
}

function getCartCount() {
  return parseInt(JSON.parse(localStorage.getItem(STORAGE_COUNT_KEY)) || 0, 10);
}

function saveCart(items, count) {
  localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(items));
  localStorage.setItem(STORAGE_COUNT_KEY, JSON.stringify(count));
}

function updateCartCountBadges() {
  const count = getCartCount();
  const badges = document.querySelectorAll('.cart-count');

  badges.forEach((badge) => {
    badge.textContent = count > 0 ? `(${count})` : '';
  });
}

function createDesktopCartLink() {
  const navList = document.querySelector('.navHeader ul');
  if (!navList || navList.querySelector('[data-cart-link="desktop"]')) return;

  const li = document.createElement('li');
  li.setAttribute('data-cart-link', 'desktop');

  const a = document.createElement('a');
  a.className = 'navLinks';
  a.href = 'shopping-cart.html';
  a.innerHTML = 'Carrito <span class="cart-count"></span>';

  li.appendChild(a);
  navList.appendChild(li);
}

function createMobileCartLink() {
  const mobileNav = document.querySelector('.navbar-nav');
  if (!mobileNav || mobileNav.querySelector('[data-cart-link="mobile"]')) return;

  const li = document.createElement('li');
  li.className = 'nav-item';
  li.setAttribute('data-cart-link', 'mobile');

  const a = document.createElement('a');
  a.className = 'nav-link';
  a.href = 'shopping-cart.html';
  a.innerHTML = 'Carrito <span class="cart-count"></span>';

  li.appendChild(a);
  mobileNav.appendChild(li);
}

function ensureCartLinks() {
  createDesktopCartLink();
  createMobileCartLink();
  updateCartCountBadges();
}

function parsePrice(priceText) {
  const raw = (priceText || '').replace(/[^0-9.,]/g, '');
  let normalized = raw;

  if (raw.includes(',') && raw.includes('.')) {
    normalized = raw.replace(/\./g, '').replace(',', '.');
  } else if (raw.includes(',')) {
    normalized = raw.replace(',', '.');
  } else if (/\.\d{3}$/.test(raw)) {
    normalized = raw.replace(/\./g, '');
  }

  return Number.parseFloat(normalized) || 0;
}

function getProductIconClass(category) {
  const map = {
    beauty: 'fa-solid fa-heart',
    fragrances: 'fa-solid fa-spray-can-sparkles',
    furniture: 'fa-solid fa-couch',
    groceries: 'fa-solid fa-basket-shopping',
    'home-decoration': 'fa-solid fa-house',
    kitchen: 'fa-solid fa-mug-hot',
    laptops: 'fa-solid fa-laptop',
    mens: 'fa-solid fa-shirt',
    'mens-shirts': 'fa-solid fa-shirt',
    'mens-shoes': 'fa-solid fa-shoe-prints',
    motorcycles: 'fa-solid fa-motorcycle',
    skincare: 'fa-solid fa-pump-soap',
    smartphones: 'fa-solid fa-mobile-screen-button',
    sports: 'fa-solid fa-football',
    sunglasses: 'fa-solid fa-glasses',
    tablets: 'fa-solid fa-tablet-screen-button',
    tops: 'fa-solid fa-shirt',
    vehicle: 'fa-solid fa-car-side',
    womens: 'fa-solid fa-bag-shopping',
    'womens-bags': 'fa-solid fa-bag-shopping',
    'womens-dresses': 'fa-solid fa-person-dress',
    'womens-jewellery': 'fa-solid fa-gem',
    'womens-shoes': 'fa-solid fa-shoe-prints'
  };

  return map[(category || '').toLowerCase()] || 'fa-solid fa-paw';
}

function renderProductsFromApi(productsContainer, products) {
  productsContainer.innerHTML = '';

  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    const article = document.createElement('article');
    article.className = 'card-producto';

    const iconClass = getProductIconClass(product.category);
    const safeTitle = product.title || 'Producto';
    const safeDescription = product.description || 'Producto solidario';
    const formattedPrice = Number(product.price || 0).toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    article.innerHTML = `
      <i class="${iconClass}" aria-hidden="true"></i>
      <h3>${safeTitle}</h3>
      <p>${safeDescription}</p>
      <p class="precio">$${formattedPrice}</p>
      <a href="contacto.html?producto=${encodeURIComponent(safeTitle)}" class="btn-comprar">Comprar</a>
    `;

    fragment.appendChild(article);
  });

  productsContainer.appendChild(fragment);
}

function getOrCreateLoadMoreButton(productsContainer) {
  let button = document.getElementById('mostrar-products-main');
  if (button) return button;

  button = document.createElement('button');
  button.type = 'button';
  button.id = 'mostrar-products-main';
  button.className = 'btn-comprar';
  button.textContent = 'Mostrar mas';
  button.style.display = 'none';
  button.style.margin = '1.5rem auto 0';

  const section = productsContainer.closest('.productos') || productsContainer.parentElement;
  section.appendChild(button);

  return button;
}

function updateLoadMoreButton(productsContainer) {
  const button = getOrCreateLoadMoreButton(productsContainer);
  const noMoreProducts = productsShown >= apiProducts.length;

  button.style.display = noMoreProducts ? 'none' : 'block';
  button.disabled = noMoreProducts;
}

function renderNextProducts(productsContainer) {
  const nextProducts = apiProducts.slice(productsShown, productsShown + PRODUCTS_PER_PAGE);
  const fragment = document.createDocumentFragment();

  nextProducts.forEach((product) => {
    const article = document.createElement('article');
    article.className = 'card-producto';

    const iconClass = getProductIconClass(product.category);
    const safeTitle = product.title || 'Producto';
    const safeDescription = product.description || 'Producto solidario';
    const formattedPrice = Number(product.price || 0).toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    article.innerHTML = `
      <i class="${iconClass}" aria-hidden="true"></i>
      <h3>${safeTitle}</h3>
      <p>${safeDescription}</p>
      <p class="precio">$${formattedPrice}</p>
      <a href="contacto.html?producto=${encodeURIComponent(safeTitle)}" class="btn-comprar">Comprar</a>
    `;

    fragment.appendChild(article);
  });

  productsContainer.appendChild(fragment);
  productsShown += nextProducts.length;
  updateLoadMoreButton(productsContainer);
}

function resetAndRenderProducts(productsContainer, products) {
  apiProducts = products;
  productsShown = 0;
  productsContainer.innerHTML = '';
  renderNextProducts(productsContainer);
}

function loadProductsFromApi(productsContainer) {
  const previousContent = productsContainer.innerHTML;
  const loadMoreButton = getOrCreateLoadMoreButton(productsContainer);

  productsContainer.innerHTML = '<p class="intro-seccion">Cargando productos...</p>';
  loadMoreButton.style.display = 'none';
  loadMoreButton.disabled = true;

  fetch(API_PRODUCTS_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const products = Array.isArray(data.products) ? data.products : [];
      if (!products.length) {
        productsContainer.innerHTML = previousContent;
        loadMoreButton.style.display = 'none';
        return;
      }

      resetAndRenderProducts(productsContainer, products);
    })
    .catch(() => {
      productsContainer.innerHTML = previousContent;
      loadMoreButton.style.display = 'none';
    });
}

function handleProductPurchase(event) {
  const buyButton = event.target.closest('.btn-comprar');
  if (!buyButton) return;

  event.preventDefault();

  const productCard = buyButton.closest('.card-producto');
  if (!productCard) return;

  const titleElement = productCard.querySelector('h3');
  const priceElement = productCard.querySelector('.precio');
  if (!titleElement || !priceElement) return;

  const title = titleElement.textContent.trim();
  const price = parsePrice(priceElement.textContent.trim());

  const items = getCartItems();
  const existingItem = items.find((item) => item.title === title);

  if (existingItem) {
    existingItem.count += 1;
  } else {
    items.push({ title, price, count: 1 });
  }

  const count = getCartCount() + 1;
  saveCart(items, count);
  updateCartCountBadges();
}

function initProductsSection() {
  const productsContainer = document.querySelector('.cards-productos');
  if (!productsContainer) return;

  const loadMoreButton = getOrCreateLoadMoreButton(productsContainer);

  loadMoreButton.addEventListener('click', () => {
    renderNextProducts(productsContainer);
  });

  loadProductsFromApi(productsContainer);
  productsContainer.addEventListener('click', handleProductPurchase);
}

function prefillContactFormFromParams() {
  const params = new URLSearchParams(window.location.search);
  const producto = params.get('producto');

  if (!producto) return;

  const campoProducto = document.getElementById('producto');
  const mensaje = document.getElementById('mensaje');

  if (campoProducto) {
    campoProducto.value = producto;
  }

  if (mensaje && !mensaje.value) {
    mensaje.value = 'Hola, me interesa comprar: ' + producto;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  ensureCartLinks();
  initProductsSection();
  prefillContactFormFromParams();
});
