const AllProducts = document.querySelector(".products");
const allfavorites = document.querySelector(".favorites");
const totalPrice = document.querySelector(".total .totalPrice")

let ProductsInCart = localStorage.getItem("ProductsInCart")
let Products_In_Cart = localStorage.getItem("ProductsInCart") ? JSON.parse(localStorage.getItem("ProductsInCart")) : [];

let total = localStorage.getItem("totalPrice") ? +(localStorage.getItem("totalPrice")) : 0;
let quantity = 1;
console.log(total)

//Fetch Products Data From DB File
const Fetch_Products_From_DB = async () => {
  try {
    const res = await fetch("../DB/products_List.json");
    const data = await res.json();
    products = data.data;
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
// Draw Product Card
const Product_Card =async (products)=> {
  AllProducts.innerHTML = products.map((item) => {
    let quantity = +(localStorage.getItem(`quantity-${item.id}`));

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
  }).join('');
}
// Check if there are products in the cart To Draw Them in Cart Page
ProductsInCart && Product_Card(JSON.parse(ProductsInCart));

// Draw Total Price
if (Products_In_Cart) {
  total =0;
  Products_In_Cart.map(product => total += +(+product.salePrice * +(localStorage.getItem(`quantity-${product.id}`))));
  totalPrice.innerHTML = total;
}
// Remove Product From Cart Function
const Remove_Product_From_cart= (id)=> {
  let itemIndex = Products_In_Cart.findIndex((item) => item.id === id);

  if (itemIndex !== -1) {
    Products_In_Cart.splice(itemIndex, 1);
    localStorage.setItem("ProductsInCart", JSON.stringify(Products_In_Cart));

    total = 0;
    let productItem = document.getElementById(`product-${id}`);
    if (productItem) {
      productItem.remove();
    }
    Products_In_Cart.forEach((item) => {
      let quantityElement = document.getElementById(`quantity-${id}`);
      let quantity = +(quantityElement.innerHTML);
      total += +item.salePrice * quantity;

    });
    totalPrice.innerHTML = total;
    localStorage.setItem("totalPrice", JSON.stringify(total));
  }
}
// Increase Product Quantity Function
const Increase_Product_Quantity= (id, salePrice)=> {
  let quantityElement = document.getElementById(`quantity-${id}`);
  let quantity = +(quantityElement.innerHTML);

  quantity++;
  quantityElement.innerHTML = quantity;
  localStorage.setItem(`quantity-${id}`, quantity.toString());
  total += (+salePrice);
  totalPrice.innerHTML = total;
  localStorage.setItem("totalPrice", JSON.stringify(total));
}
// Decrease Product Quantity Function
const Decrease_Product_Quantity =(id, salePrice)=> {
  
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
// Drow Products In Favorites Container
const Favorite_Products = async _ => {
  const Products_DB = await Fetch_Products_From_DB();
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  let Products = [];
  let slideContent = '';
  const itemsPerSlide = 3;

  for (let i = 0; i < favorites.length; i++) {
    const favoriteId = favorites[i];
    const item = Products_DB.find((product) => product.id === favoriteId);
    if (item) {
      const heartIconClass = 'fas';

      slideContent += `
        <div class="col-4">
          <div class="card border border-info pt-3">
            <img class="product-item-img card-img-top m-auto" src="../${item.imageURL}" alt="Card image" style="width:80%; height: 150px;">
            <div class="row flex flex-col justify-center items-center">
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
        Products.push(`
          <div class="carousel-item ${Products.length === 0 ? 'active' : ''}">
            <div class="row">${slideContent}</div>
          </div>
        `);
        slideContent = '';
      }
    }
  }

  const carouselInner = document.querySelector('.carousel-inner');
  carouselInner.innerHTML = Products.join('');

}
Favorite_Products();
// Remove From Favorites Function
const removeFromFavorites=(id)=>{
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  var heartIcon = document.getElementById(`fav-${id}`);
  heartIcon.classList.remove("fas");
  heartIcon.classList.add("far");

  const index = favorites.indexOf(id);
  if (index !== -1) {
    favorites.splice(index, 1);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  Favorite_Products();

}