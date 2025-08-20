const noInternet                      = document.querySelector (".noInternet"              );
const AddToCart                       = document.querySelector (".AddToCart"               );
const Remove_Product_From_Cart_Button = document.querySelector (".Remove_Product_From_Cart");
const badge                           = document.querySelector (".badge"                   );
const totalPrice                      = document.querySelector (".total .totalPrice"       );
const shoppingCartIcon                = document.querySelector (".shoppingCart"            );
const cartsProudect                   = document.querySelector (".cartsProudect"           );
const search                          = document.getElementById("search"                   );
const Search_Target                   = document.getElementById("Search_Target"            );
let Cart_Preview                      = document.querySelector (".Cart_Preview"            );
let productscontainer                 = document.querySelector (".Products_container"      );

// Initialize Products and total from localStorage
let total = localStorage.getItem("totalPrice")
  ? +localStorage.getItem("totalPrice")
  : 0;
let Products_In_Cart = localStorage.getItem("ProductsInCart")
  ? JSON.parse(localStorage.getItem("ProductsInCart"))
  : [];
// Initialize Search Variables
let Search_By = "title";
let quantity = 1;

// Check if the user is online or offline
window.addEventListener("load", () => toggleInternetStatus(navigator.onLine));
window.addEventListener("online", () => toggleInternetStatus(true));
window.addEventListener("offline", () => toggleInternetStatus(false));
const toggleInternetStatus = (isOnline) => {
  noInternet.style.display = isOnline ? "none" : "block";
};

//Fetch Products Data From DB File
const fetchProducts = async () => {
  try {
    const res = await fetch("./DB/products_List.json");
    const data = await res.json();
    products = data.data;
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Fetch products and draw them on the page
const Product_Card = async () => {
  const allProducts = await fetchProducts();
  //Check if product Existes In Cart
  let ProductsIdsInCart = Products_In_Cart.map(element=>  element.id)
  //Products Containe
  productscontainer.innerHTML = allProducts
    .map((item) => {
      const isFavorite = checkFavorite(item.id);
      const heartIconClass = isFavorite ? "fas" : "far";

      const heightImage = "200px"

      return `
            <div class="product-item mb-4 p-4 w-full md:w-1/3 lg:w-1/4 xl:w-1/5"> 
             <div class="pt-3 w-full"> 
                <img class="product-item-img card-img-top m-auto" src="./${item.imageURL}" alt="Card image" style="width:80%; height:${heightImage};"> 
                <div class="product-itm-desc card-body pb-0 pl-4"> 
                <p class="card-title"><span class="text-2xl text-orange-500">${item.title}</span></p> 
                <p class="card-text">Category :${item.category}.</p> 
                <div class="color w-full  flex justify-start items-center gap-2">Color: <p class="w-[12px] h-[12px] rounded-full" style="background:${item.color}"></p></div> 
                <p class="card-price">Price: <span> <del>${item.price} EGP</del> <span class="text-lg text-green-500">${item.salePrice} EGP</span></span></p> 
                </div> <div class="product-item-action d-flex justify-content-between pr-4 pl-4"> 
                <button id="add-btn-${item.id}" class="AddToCart btn btn-success mb-2 ${ProductsIdsInCart.includes(item.id) && "hidden"}" onClick="Add_Product_To_Cart(${item.id})">Add To Cart</button> 
                <button id="remove-btn-${item.id}" class="Remove_Product_From_Cart btn btn-danger mb-2 ${!ProductsIdsInCart.includes(item.id) && "hidden"}" onClick="Remove_Product_From_Cart_Preview(${item.id})">Remove From Cart</button> 
                <i id="fav-${item.id}" class="${heartIconClass} fa-heart text-green-500" onClick="AddToFaveroites(${item.id})"></i> 
                </div> 
              </div> 
            </div>
        `;
    })
    .join("");
};
Product_Card();

// Draw Shoping Cart Items Function
const Shoping_Cart_Items = (item) => {
  if (!document.getElementById(`Cart_Preview_Item-${item.id}`)) {
    let quantity = +localStorage.getItem(`quantity-${item.id}`);
      if(!quantity){
        localStorage.setItem(`quantity-${item.id}`,1)
        quantity = +1
      }
    Cart_Preview.innerHTML += `<div id="Cart_Preview_Item-${item.id}" class="row my-2 pr-2 w-full flex flex-nowrap">
        <span class="col-6 ">${item.title}</span>
        <span class="col-2 text-3xl font-bold text-orange-500" id="quantity-${item.id}">${quantity}</span>
        <button class="text-danger Decrease_Product_Quantity p-2 px-3 bg-gray-200 hover:bg-gray-400 rounded-lg font-bold text-lg" onClick="Decrease_Product_Quantity(${item.id},${item.salePrice})">-</button>
        <button class="text-success Increase_Product_Quantity p-2 px-3 bg-gray-200 hover:bg-gray-400 rounded-lg font-bold text-lg" onClick="Increase_Product_Quantity(${item.id},${item.salePrice})">+</button>
      </div>`;
  }
};

// Check The Item Put In The Local Storage
if (Products_In_Cart) {
  Products_In_Cart.map((item) => {
    Shoping_Cart_Items(item);
    const addBtn = document.getElementById(`add-btn-${item.id}`);
    const removeBtn = document.getElementById(`remove-btn-${item.id}`);
    removeBtn && (addBtn.style.display = "none");

    removeBtn && (removeBtn.style.display = "inline-block");

    total += +item.salePrice * +localStorage.getItem(`quantity-${item.id}`);
  });
  totalPrice.innerHTML = total + " EGP";

  if (Products_In_Cart.length > 0) {
    badge.style.display = "block";
    badge.innerHTML = Products_In_Cart.length;
  } else {
    badge.style.display = "none";
  }
}
//*********************** */
//*****Actions Function****/
//*********************** */
// Remove Product From Cart Function
const Remove_Product_From_Cart_Preview = (id) => {
  let itemIndex = Products_In_Cart.findIndex((item) => item.id === id);

  if (itemIndex !== -1) {
    Products_In_Cart.splice(itemIndex, 1);
    localStorage.setItem("ProductsInCart", JSON.stringify(Products_In_Cart));

    total = 0;
    document.getElementById(`add-btn-${id}`).style.display = "inline-block";
    document.getElementById(`remove-btn-${id}`).style.display = "none";

    let Cart_Preview_Item = document.getElementById(`Cart_Preview_Item-${id}`);
    if (Cart_Preview_Item) {
      Cart_Preview_Item.remove();
      localStorage.removeItem(`quantity-${id}`)
    }
    
    Products_In_Cart.forEach((item) => {
      let quantityElement = document.getElementById(`quantity-${item.id}`);
      let quantity = +quantityElement.innerHTML;
      Shoping_Cart_Items(item);
      total += (+item.salePrice * quantity);
    });

    totalPrice.innerHTML = total + " EGP";
    localStorage.setItem("totalPrice", +total);

    if (Products_In_Cart.length > 0) {
      badge.style.display = "block";
      badge.innerHTML = Products_In_Cart.length;
    } else {
      badge.style.display = "none";
      cartsProudect.style.display = "none"
    }
  }
};
// Increase and Decrease Product Quantity Functions
const Increase_Product_Quantity = (id, salePrice) => {
  let quantityElement = document.getElementById(`quantity-${id}`);
  let quantity = +quantityElement.innerHTML;

  quantity++;
  quantityElement.innerHTML = quantity;
  localStorage.setItem(`quantity-${id}`, +quantity);
  total += +salePrice;
  totalPrice.innerHTML = total + " EGP";
  localStorage.setItem("totalPrice", JSON.stringify(total));
  openCart();
};
const Decrease_Product_Quantity = (id, salePrice) => {
  let quantityElement = document.getElementById(`quantity-${id}`);
  let quantity = +quantityElement.innerHTML;

  if (quantity > 1) {
    quantity--;
    quantityElement.innerHTML = quantity;
    localStorage.setItem(`quantity-${id}`, +quantity);
    total -= +salePrice;
    totalPrice.innerHTML = total + " EGP";
    localStorage.setItem("totalPrice", JSON.stringify(total));
  } else {
    Remove_Product_From_Cart_Preview(id);
  }
  openCart();
};

// Add Product To Cart Function
const Add_Product_To_Cart = (id) => {
  if (localStorage.getItem("userName")) {
    let choosenItem = products.find((item) => item.id === id);
    let itemIndex = Products_In_Cart.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      Shoping_Cart_Items(choosenItem);

      Products_In_Cart = [...Products_In_Cart, choosenItem];
      localStorage.setItem("ProductsInCart", JSON.stringify(Products_In_Cart));

      let quantity = localStorage.getItem(`quantity-${choosenItem.id}`)
        ? +localStorage.getItem(`quantity-${choosenItem.id}`)
        : 1;

      total += +choosenItem.salePrice * quantity;
      totalPrice.innerHTML = total + " EGP";
      localStorage.setItem("totalPrice", JSON.stringify(total));

      document.getElementById(`add-btn-${id}`).style.display = "none";
      document.getElementById(`remove-btn-${id}`).style.display =
        "inline-block";

      if (Products_In_Cart.length != 0) {
        badge.style.display = "block";
        badge.innerHTML = Products_In_Cart.length;
      }
    } else {
      badge.style.display = "none";
    }
  } else {
    window.location = "./Pages/login.html";
  }
};


//*************************************/
//***** Favorites Actions Functions****/
//*************************************/

// Check if the item is in favorites
const checkFavorite = (itemId) => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const isFavorite = favorites.includes(itemId);

  return isFavorite;
};
// Add or remove item from favorites
const AddToFaveroites = (id) => {
  if (localStorage.getItem("userName")) {
    const heartIcon = document.getElementById(`fav-${id}`);
    if (heartIcon.classList.contains("far")) {
      heartIcon.classList.remove("far");
      heartIcon.classList.add("fas");
      addToFavorites(id);
    } else {
      heartIcon.classList.remove("fas");
      heartIcon.classList.add("far");
      removeFromFavorites(id);
    }
  } else {
    window.location = "../Pages/login.html";
  }
};

const addToFavorites = (itemId) => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.includes(itemId)) {
    favorites.push(itemId);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

const removeFromFavorites = (itemId) => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.indexOf(itemId);
  if (index !== -1) {
    favorites.splice(index, 1);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

const openCart = () => {
  if (Cart_Preview.innerHTML != "") {
    if (cartsProudect.style.display == "block") {
      cartsProudect.style.display = "none";
    } else {
      cartsProudect.style.display = "block";
    }
  }
};

// Fail Cart By Products
shoppingCartIcon.addEventListener("click", openCart);
//Search Event Button
Search_Target.addEventListener("change", function () {
  let selectedValue = this.value;

  if (selectedValue === "Search_By_Title") {
    Search_By = "title";
  } else if (selectedValue === "Search_By_Category") {
    Search_By = "category";
  }

  search.placeholder = `search by ${Search_By}`;
  search.focus();
  search.value = "";
  drawData();
});
// Search Input Event
search.addEventListener("input", function () {
  let value = this.value.trim();
  if (value.length > 0) {
    Search_For_Product(value);
  } else {
    drawData();
  }
});
// Draw Products Data Function
const Search_For_Product = (value) => {
  let filteredProducts = products.filter((item) => {
    if (Search_By === "title") {
      return item.title.toLowerCase().includes(value.toLowerCase());
    } else if (Search_By === "category") {
      return item.category.toLowerCase().includes(value.toLowerCase());
    }
  });
  let product = filteredProducts.map((item) => {
    let isFavorite = checkFavorite(item.id);
      let ProductsIdsInCart = Products_In_Cart.map(element=>  element.id)

    let heartIconClass = isFavorite ? "fas" : "far";
    let heightImage='200px'

    return `
            <div class="product-item mb-4 p-4 w-full md:w-1/3 lg:w-1/4 xl:w-1/5"> 
                <div class=" pt-3 w-full"> 
                    <img class="product-item-img card-img-top m-auto" src="./${item.imageURL}" alt="Card image" style="width:80%; height:${heightImage};">
                    <div class="product-itm-desc card-body pb-0 pl-4">
                        <p class="card-title">Product: ${item.title}.</p>
                        <p class="card-text">Category :${item.category}.</p>
                        <p class="color">Color: ${item.color}.</p>
                        <p class="card-price">Price: <span> <del>${item.price} EGP</del> ${item.salePrice} EGP</span></p>
                    </div>
                    <div class="product-item-action d-flex justify-content-between pr-4 pl-4">
                    <button id="add-btn-${item.id}" class="AddToCart btn btn-success mb-2 ${ProductsIdsInCart.includes(item.id) && "hidden"}" onClick="Add_Product_To_Cart(${item.id})">Add To Cart</button>
                    <button id="remove-btn-${item.id}" class="Remove_Product_From_Cart btn btn-danger mb-2 ${!ProductsIdsInCart.includes(item.id) && "hidden"}" onClick="Remove_Product_From_Cart_Preview(${item.id})">Remove From Cart</button>
                        <i id="fav-${item.id}" class="${heartIconClass} fa-heart" onClick="AddToFaveroites(${item.id})"></i>
                    </div>
                </div>
            </div>
        `;
  });

  productscontainer.innerHTML = product.join("");
};
