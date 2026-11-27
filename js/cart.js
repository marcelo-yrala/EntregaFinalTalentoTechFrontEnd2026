(function () {
  const STORAGE_CART_KEY = 'shoppingCard';
  const STORAGE_COUNT_KEY = 'productCount';

  function getCartItems() {
    return JSON.parse(localStorage.getItem(STORAGE_CART_KEY)) || [];
  }

  function renderCart() {
    const articles = getCartItems();
    const cartContainer = document.getElementById('item-products');
    const checkoutButton = document.getElementById('checkout-button');

    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    const hasProducts = Array.isArray(articles) && articles.length > 0;
    if (checkoutButton) checkoutButton.hidden = !hasProducts;

    if (!hasProducts) {
      cartContainer.innerHTML = '<p>El carrito está vacio</p>';
      return;
    }

    let totalPrice = 0;
    const table = document.createElement('table');

    const head = `
      <thead>
        <tr>
          <th>Cantidad</th>
          <th>Producto</th>
          <th>Precio</th>
        </tr>
      </thead>
    `;

    let body = '<tbody>';

    articles.forEach((article) => {
      body += `
        <tr>
          <td>${article.count}</td>
          <td>${article.title}</td>
          <td>$${Number(article.price).toFixed(2)}</td>
        </tr>
      `;

      totalPrice += Number(article.price) * Number(article.count);
    });

    body += '</tbody>';

    const footer = `
      <tfoot>
        <tr>
          <th colspan="3">Total: $ ${totalPrice.toFixed(2)}</th>
        </tr>
      </tfoot>
    `;

    table.innerHTML = head + body + footer;
    cartContainer.appendChild(table);
  }

  function checkoutCart() {
    const articles = getCartItems();

    const totalItems = articles.reduce((total, article) => total + Number(article.count), 0);
    const totalPrice = articles.reduce(
      (total, article) => total + Number(article.price) * Number(article.count),
      0
    );

    const confirmed = confirm(
      `¿Confirmas la compra de ${totalItems} ${totalItems === 1 ? 'producto' : 'productos'} por $${totalPrice.toFixed(2)}?`
    );

    if (!confirmed) return;

    localStorage.removeItem(STORAGE_CART_KEY);
    localStorage.removeItem(STORAGE_COUNT_KEY);
    location.reload();
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderCart();

    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
      checkoutButton.addEventListener('click', checkoutCart);
    }
  });
})();
