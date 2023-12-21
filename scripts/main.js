// Утилиты

function toNum(str) {
  const num = Number(str.replace(/ /g, ""));
  return num;
}

function toCurrency(num) {
  const format = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "UAH",
    minimumFractionDigits: 0,
  }).format(num);
  return format;
}

// Корзина

const cardAddArr = Array.from(document.querySelectorAll(".card__add"));
const cartNum = document.querySelector("#cart_num");
const cart = document.querySelector("#cart");

class Cart {
  products;

  constructor() {
    this.products = [];
  }

  get count() {
    return this.products.reduce((acc, product) => acc + product.quantity, 0);
  }

  addProduct(product) {
    const existingProduct = this.products.find(
      (existing) => existing.name === product.name
    );

    if (existingProduct) {
      // Если продукт уже существует, увеличиваем его количество
      existingProduct.quantity += 1;
    } else {
      // Если продукт не в корзине, добавляем его с количеством 1
      product.quantity = 1;
      this.products.push(product);
    }
  }

  removeProduct(index) {
    this.products.splice(index, 1);
  }

  get cost() {
    const totalCost = this.products.reduce(
      (acc, product) => acc + toNum(product.price) * product.quantity,
      0
    );
    return totalCost;
  }
}

class Product {
  imageSrc;
  name;
  price;
  quantity;

  constructor(card) {
    this.imageSrc = card.querySelector(".card__image").children[0].src;
    this.name = card.querySelector(".card__title").innerText;
    this.price = card.querySelector(".card__price--common").innerText;
    this.quantity = 0;
  }
}

const myCart = new Cart();

if (localStorage.getItem("cart") == null) {
  localStorage.setItem("cart", JSON.stringify(myCart));
}

const savedCart = JSON.parse(localStorage.getItem("cart"));
myCart.products = savedCart.products;
cartNum.textContent = myCart.count;

cardAddArr.forEach((cardAdd) => {
  cardAdd.addEventListener("click", (e) => {
    e.preventDefault();
    const card = e.target.closest(".card");
    const product = new Product(card);
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    myCart.products = savedCart.products;
    myCart.addProduct(product);
    localStorage.setItem("cart", JSON.stringify(myCart));
    cartNum.textContent = myCart.count;
  });
});

// Попап

const popup = document.querySelector(".popup");
const popupClose = document.querySelector("#popup_close");
const body = document.body;
const popupContainer = document.querySelector("#popup_container");
const popupProductList = document.querySelector("#popup_product_list");
const popupCost = document.querySelector("#popup_cost");

cart.addEventListener("click", (e) => {
  e.preventDefault();
  popup.classList.add("popup--open");
  body.classList.add("lock");
  popupContainerFill();
});

function popupContainerFill() {
  popupProductList.innerHTML = null;
  const savedCart = JSON.parse(localStorage.getItem("cart"));
  myCart.products = savedCart.products;
  const productsHTML = myCart.products.map((product, index) => {
    const productItem = document.createElement("div");
    productItem.classList.add("popup__product");

    const productWrap1 = document.createElement("div");
    productWrap1.classList.add("popup__product-wrap");
    const productWrap2 = document.createElement("div");
    productWrap2.classList.add("popup__product-wrap");

    const productImage = document.createElement("img");
    productImage.classList.add("popup__product-image");
    productImage.setAttribute("src", product.imageSrc);

    const productTitle = document.createElement("h2");
    productTitle.classList.add("popup__product-title");
    productTitle.innerHTML = product.name;

    const productPrice = document.createElement("div");
    productPrice.classList.add("popup__product-price");
    productPrice.innerHTML = toCurrency(toNum(product.price));

    const productQuantityInput = document.createElement("input");
    productQuantityInput.classList.add("popup__product-quantity-input");
    productQuantityInput.setAttribute("type", "number");
    productQuantityInput.setAttribute("min", "1");
    productQuantityInput.setAttribute("value", product.quantity);

    const productDelete = document.createElement("button");
    productDelete.classList.add("popup__product-delete");
    productDelete.innerHTML = "&#10006;";

    productQuantityInput.addEventListener("change", (e) => {
      const newQuantity = parseInt(e.target.value, 10);
      myCart.products[index].quantity = newQuantity;
      localStorage.setItem("cart", JSON.stringify(myCart));
      popupContainerFill();
    });

    productDelete.addEventListener("click", () => {
      myCart.removeProduct(index);
      localStorage.setItem("cart", JSON.stringify(myCart));
      popupContainerFill();
    });

    productWrap1.appendChild(productImage);
    productWrap1.appendChild(productTitle);
    productWrap2.appendChild(productPrice);
    productWrap2.appendChild(productQuantityInput);
    productWrap2.appendChild(productDelete);
    productItem.appendChild(productWrap1);
    productItem.appendChild(productWrap2);

    return productItem;
  });

  productsHTML.forEach((productHTML) => {
    popupProductList.appendChild(productHTML);
  });

  popupCost.value = toCurrency(myCart.cost);
}

popupClose.addEventListener("click", (e) => {
  e.preventDefault();
  popup.classList.remove("popup--open");
  body.classList.remove("lock");
});
document.addEventListener("DOMContentLoaded", function () {
  var orderButton = document.querySelector('.card__add1');
  var orderContainer = document.querySelector('#popup_container');

  orderButton.addEventListener('click', function () {
    var orderNumber = Math.floor(Math.random() * 1000) + 1;
    alert('Ваш заказ принят, номер заказа: ' + orderNumber);
  });
});
