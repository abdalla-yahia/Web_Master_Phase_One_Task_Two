let proudectInCart = localStorage.getItem("proudectInCart")
let allProducts = document.querySelector(".products");
let allfavorites = document.querySelector(".favorites");
let totalPrice = document.querySelector(".total .totalPrice")
let Products_In_Cart = localStorage.getItem("proudectInCart") ? JSON.parse(localStorage.getItem("proudectInCart")) : [];
let total = localStorage.getItem("totalPrice") ? +(localStorage.getItem("totalPrice")) : 0;
let quantity = 1;


if (proudectInCart) {
  drawProudectCart(JSON.parse(proudectInCart));
}

function drawProudectCart(products) {

  let y = products.map((item) => {
    let quantity = +(localStorage.getItem(`quantity-${item.id}`)) || 1;

    return `
        <div id="product-${item.id}" class="product-item mb-4 p-4 w-full md:w-1/3 lg:w-1/4 xl:w-1/5">
        <div class=" pt-3 w-full flex justify-center items-center">
          <div class="row flex flex-col justify-center items-center w-full">
            <div >
              <img class="product-item-img card-img-top ml-3 mt-4 max-w-[70%]"  src="../${item.imageURL}" alt="Card image">
            </div>
            
              <div class="product-itm-desc  pb-0"> 
                <p class="card-title">Product: <span class="text-2xl text-orange-500">${item.title}</span></p> 
                <p class="card-text">Category :${item.category}.</p> 
                <div class="color w-full  flex justify-start items-center gap-2">Color: <p class="w-[12px] h-[12px] rounded-full" style="background:${item.color}"></p></div> 
                <p class="card-price">Price: <span> <del>${item.price} EGP</del> <span class="text-lg text-green-500">${item.salePrice} EGP</span></span></p> 
              </div> <div class="product-item-action d-flex justify-content-between pr-4 pl-4"> 

              <div class="product-item-action flex flex-col w-full justify-between items-center pr-4 pl-3">
                <button id="remove-btn-${item.id}" class="Remove_Product_From_cartBtn btn btn-danger w-full line-clamp-1 mb-2 d-inline-block" onClick="Remove_Product_From_cart(${item.id})">Remove From Cart</button>
                <div class="flex items-center justify-between w-full gap-2">
                    <span class="text-danger Decrease_Product_Quantity p-0 m-0" style="font-size : 30px;  cursor: pointer; " onClick="Decrease_Product_Quantity(${item.id},${item.salePrice})">-</span>
                    <span class="text-success Increase_Product_Quantity p-0 m-0" style="font-size : 30px;  cursor: pointer; " onClick="Increase_Product_Quantity(${item.id},${item.salePrice})">+</span>
                    <div class="text-primary" style="font-size : 25px" id="quantity-${item.id}">${quantity}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })
  allProducts.innerHTML = y.join('');
}

// ---------------------------------------------------------------------------------------------


if (Products_In_Cart) {
  Products_In_Cart.map((item) => {
    total += +item.salePrice * +(localStorage.getItem(`quantity-${item.id}`));
  })
  totalPrice.innerHTML = total / 2;

}

function Remove_Product_From_cart(id) {
  let itemIndex = Products_In_Cart.findIndex((item) => item.id === id);
  let quantityElement = document.getElementById(`quantity-${id}`);
  let quantity = +(quantityElement.innerHTML);

  if (itemIndex !== -1) {
    Products_In_Cart.splice(itemIndex, 1);
    localStorage.setItem("proudectInCart", JSON.stringify(Products_In_Cart));

    total = 0;
    let productItem = document.getElementById(`product-${id}`);
    if (productItem) {
      productItem.remove();
    }
    Products_In_Cart.forEach((item) => {
      total += +item.salePrice * quantity;
      // total += +item.salePrice * +(localStorage.getItem(`quantity-${item.id}`));

    });
    totalPrice.innerHTML = total;
    localStorage.setItem("totalPrice", JSON.stringify(total));
  }
}
// -----------------------------------------------

// ----------------------------------------------------
function Increase_Product_Quantity(id, salePrice) {
  // console.log(item);

  let quantityElement = document.getElementById(`quantity-${id}`);
  let quantity = +(quantityElement.innerHTML);

  quantity++;
  quantityElement.innerHTML = quantity;
  localStorage.setItem(`quantity-${id}`, quantity.toString());
  total += (+salePrice);
  totalPrice.innerHTML = total;
  localStorage.setItem("totalPrice", JSON.stringify(total));
}
function Decrease_Product_Quantity(id, salePrice) {
  // console.log(item);
  let quantityElement = document.getElementById(`quantity-${id}`);
  let quantity = +(quantityElement.innerHTML);

  if (quantity > 1) {
    quantity--;
    quantityElement.innerHTML = quantity;
    localStorage.setItem(`quantity-${id}`, quantity.toString());
    total -= (+salePrice);
    totalPrice.innerHTML = total;
    localStorage.setItem("totalPrice", JSON.stringify(total));
  }
  else {
    Remove_Product_From_cart(id);
  }
}
// -----------------------------------------------------------
let products = [
  { id: 1, title: "oppo reno 7", category: "phone", color: "Black", price: "1120", salePrice: "1000", imageURL: "images/1.jpg" },
  { id: 2, title: "Iphone 14", category: "phone", color: "gray", price: "2120", salePrice: "2000", imageURL: "images/2.jpg" },
  { id: 3, title: "relme", category: "phone", color: "white", price: "3120", salePrice: "3000", imageURL: "images/3.jpg" },
  { id: 4, title: "infinx", category: "smart watch", color: "Blue", price: "4120", salePrice: "4000", imageURL: "images/4.jpg" },
  { id: 5, title: "oppo reno 7", category: "smart watch", color: "Black", price: "1120", salePrice: "1000", imageURL: "images/1.jpg" },
  { id: 6, title: "Iphone 14", category: "smart watch", color: "gray", price: "2120", salePrice: "2000", imageURL: "images/2.jpg" },
  { id: 7, title: "relme", category: "Labtob", color: "white", price: "3120", salePrice: "3000", imageURL: "images/3.jpg" },
  { id: 8, title: "infinx", category: "Labtob", color: "Blue", price: "4120", salePrice: "4000", imageURL: "images/4.jpg" },
  { id: 9, title: "oppo reno 7", category: "Labtob", color: "Black", price: "1120", salePrice: "1000", imageURL: "images/1.jpg" },
  { id: 10, title: "Iphone 14", category: "Air pods", color: "gray", price: "2120", salePrice: "2000", imageURL: "images/2.jpg" },
  { id: 11, title: "relme", category: "Air pods", color: "white", price: "3120", salePrice: "3000", imageURL: "images/3.jpg" },
  { id: 12, title: "infinx", category: "Air pods", color: "Blue", price: "4120", salePrice: "4000", imageURL: "images/4.jpg" },
]

function drawFavData() {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  let pro = [];
  let indicators = '';
  let slideContent = '';
  const itemsPerSlide = 3;

  for (let i = 0; i < favorites.length; i++) {
    const favoriteId = favorites[i];
    const item = products.find((product) => product.id === favoriteId);
    if (item) {
      const heartIconClass = 'fas';

      slideContent += `
        <div class="col-4">
          <div class="card border border-info pt-3">
            <img class="product-item-img card-img-top m-auto" src="../${item.imageURL}" alt="Card image" style="width:80%; height: 150px;">
            <div class="row">
              <div class="product-itm-desc card-body pb-2 pl-4 col-10">
                <p class="card-title">Product: ${item.title}.</p>
                <p class="card-text">Category: ${item.category}.</p>
              </div>
              <div class="product-item-action d-flex justify-content-between mt-4 pt-4 col-2">
                <i id="fav-${item.id}" class="${heartIconClass} fa-heart text-green-500" onClick="removeFromFavorites(${item.id})"></i>
              </div>
            </div>
          </div>
        </div>
      `;

      if ((i + 1) % itemsPerSlide === 0 || i === favorites.length - 1) {
        pro.push(`
          <div class="carousel-item ${pro.length === 0 ? 'active' : ''}">
            <div class="row">${slideContent}</div>
          </div>
        `);

        indicators += `<li data-target="#carouselExampleIndicators" data-slide-to="${pro.length - 1}" class="${pro.length === 0 ? 'active' : ''}"></li>`;

        slideContent = '';
      }
    }
  }

  const carouselInner = document.querySelector('.carousel-inner');
  carouselInner.innerHTML = pro.join('');

  const carouselIndicators = document.querySelector('.carousel-indicators');
  carouselIndicators.innerHTML = indicators;
}

drawFavData();
// ------------------------------------------------------------

function removeFromFavorites(id) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  var heartIcon = document.getElementById(`fav-${id}`);
  heartIcon.classList.remove("fas");
  heartIcon.classList.add("far");

  const index = favorites.indexOf(id);
  if (index !== -1) {
    favorites.splice(index, 1);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  drawFavData();

}